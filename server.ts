import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import initSqlJs, { Database } from 'sql.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let db: Database | null = null;
const dbFilePath = path.join(process.cwd(), 'domisoins.sqlite');

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  }
}

function queryAll(sql: string, params: any[] = []): any[] {
  if (!db) return [];
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results: any[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error('SQL queryAll Error:', err);
    return [];
  }
}

function queryOne(sql: string, params: any[] = []): any | null {
  const list = queryAll(sql, params);
  return list.length > 0 ? list[0] : null;
}

function runSql(sql: string, params: any[] = []) {
  if (!db) return;
  try {
    db.run(sql, params);
    saveDb();
  } catch (err) {
    console.error('SQL runSql Error:', err);
    throw err;
  }
}

async function initDatabase() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Schema Creation
  runSql(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT,
      proCategory TEXT,
      phone TEXT,
      whatsappPhone TEXT,
      city TEXT,
      address TEXT,
      verificationStatus TEXT,
      skillsBio TEXT,
      profilePictureUrl TEXT,
      diplomaFileName TEXT,
      diplomaFileUrl TEXT,
      balance REAL DEFAULT 0,
      createdAt TEXT
    );
  `);

  runSql(`
    CREATE TABLE IF NOT EXISTS deposits (
      id TEXT PRIMARY KEY,
      proId TEXT,
      proName TEXT,
      amount REAL,
      paymentMethod TEXT,
      bankAccountNumber TEXT,
      proofFileName TEXT,
      proofFileUrl TEXT,
      status TEXT,
      createdAt TEXT,
      processedAt TEXT,
      notes TEXT
    );
  `);

  runSql(`
    CREATE TABLE IF NOT EXISTS executed_acts (
      id TEXT PRIMARY KEY,
      proId TEXT,
      proName TEXT,
      patientName TEXT,
      patientPhone TEXT,
      actName TEXT,
      totalAmount REAL,
      commissionAmount REAL,
      proEarnings REAL,
      dateExecuted TEXT,
      notes TEXT,
      createdAt TEXT
    );
  `);

  // Ensure default Admin user exists: username 'admin', password 'malki115'
  const admin = queryOne("SELECT * FROM users WHERE username = 'admin' OR email = 'admin'");
  if (!admin) {
    runSql(
      `INSERT INTO users (id, username, email, password, name, role, proCategory, phone, whatsappPhone, city, verificationStatus, skillsBio, balance, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'admin-1',
        'admin',
        'admin',
        'malki115',
        'Direction Administration DomiSoins',
        'admin',
        'Autre Professionnel de Santé',
        '+212 728-338276',
        '212728338276',
        'Berkane',
        'verified',
        'Administrateur Général DomiSoins.ma',
        0,
        new Date().toISOString()
      ]
    );
  } else {
    // Ensure password is malki115 and phone updated
    runSql("UPDATE users SET password = 'malki115', name = 'Direction Administration DomiSoins', phone = '+212 728-338276', whatsappPhone = '212728338276' WHERE username = 'admin' OR email = 'admin'");
  }
}

// REST API ROUTES

// Auth Register
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      proCategory,
      phone,
      whatsappPhone,
      city,
      skillsBio,
      profilePictureUrl,
      diplomaFileName,
      diplomaFileUrl
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = queryOne('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Un compte existe déjà avec cet email' });
    }

    const id = 'pro-' + Date.now();
    const createdAt = new Date().toISOString().split('T')[0];

    runSql(
      `INSERT INTO users 
       (id, username, email, password, name, role, proCategory, phone, whatsappPhone, city, verificationStatus, skillsBio, profilePictureUrl, diplomaFileName, diplomaFileUrl, balance, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        username || cleanEmail,
        cleanEmail,
        password,
        name,
        'pro',
        proCategory || 'Médecin Généraliste / Spécialiste',
        phone || '+212 728-338276',
        whatsappPhone || '212728338276',
        city || 'Berkane',
        'pending',
        skillsBio || '',
        profilePictureUrl || '',
        diplomaFileName || 'Diplome.pdf',
        diplomaFileUrl || '',
        0,
        createdAt
      ]
    );

    const newUser = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return res.json({ success: true, user: newUser });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Erreur lors de l’inscription' });
  }
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { login, password } = req.body; // login can be username, email or 'admin'
    if (!login || !password) {
      return res.status(400).json({ success: false, message: 'Identifiant et mot de passe requis' });
    }

    const inputLogin = login.trim().toLowerCase();

    // Admin login check
    if ((inputLogin === 'admin' || inputLogin === 'admin@domisoins.ma') && password === 'malki115') {
      let admin = queryOne("SELECT * FROM users WHERE role = 'admin'");
      if (!admin) {
        admin = {
          id: 'admin-1',
          username: 'admin',
          email: 'admin',
          name: 'Direction Administration DomiSoins',
          role: 'admin',
          proCategory: 'Autre Professionnel de Santé',
          phone: '+212 728-338276',
          whatsappPhone: '212728338276',
          city: 'Berkane',
          verificationStatus: 'verified',
          skillsBio: 'Administrateur',
          balance: 0,
          createdAt: new Date().toISOString()
        };
      }
      return res.json({ success: true, user: admin });
    }

    // Normal Pro Login
    const user = queryOne(
      'SELECT * FROM users WHERE (LOWER(email) = ? OR LOWER(username) = ?) AND password = ?',
      [inputLogin, inputLogin, password]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects (Email/Nom d’utilisateur ou mot de passe)' });
    }

    return res.json({ success: true, user });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
  }
});

// Get User by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const user = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all pros
app.get('/api/pros', (req, res) => {
  try {
    const pros = queryAll("SELECT * FROM users WHERE role = 'pro' ORDER BY createdAt DESC");
    return res.json({ success: true, pros });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update Pro Verification Status (Admin)
app.post('/api/pros/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide' });
    }
    runSql('UPDATE users SET verificationStatus = ? WHERE id = ?', [status, req.params.id]);
    const updatedUser = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);
    return res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update Pro Profile (Self update)
app.put('/api/pros/:id', (req, res) => {
  try {
    const { name, phone, whatsappPhone, city, address, proCategory, skillsBio, profilePictureUrl, diplomaFileName, diplomaFileUrl } = req.body;
    runSql(
      `UPDATE users 
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           whatsappPhone = COALESCE(?, whatsappPhone),
           city = COALESCE(?, city),
           address = COALESCE(?, address),
           proCategory = COALESCE(?, proCategory),
           skillsBio = COALESCE(?, skillsBio),
           profilePictureUrl = COALESCE(?, profilePictureUrl),
           diplomaFileName = COALESCE(?, diplomaFileName),
           diplomaFileUrl = COALESCE(?, diplomaFileUrl)
       WHERE id = ?`,
      [name, phone, whatsappPhone, city, address, proCategory, skillsBio, profilePictureUrl, diplomaFileName, diplomaFileUrl, req.params.id]
    );

    const updatedUser = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);
    return res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Deposits
app.get('/api/deposits', (req, res) => {
  try {
    const { proId } = req.query;
    let sql = 'SELECT * FROM deposits';
    const params: any[] = [];
    if (proId) {
      sql += ' WHERE proId = ?';
      params.push(proId);
    }
    sql += ' ORDER BY createdAt DESC';
    const deposits = queryAll(sql, params);
    return res.json({ success: true, deposits });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Create Deposit Request (Pro)
app.post('/api/deposits', (req, res) => {
  try {
    const { proId, proName, amount, paymentMethod, bankAccountNumber, proofFileName, proofFileUrl, notes } = req.body;

    if (!proId || !amount || amount < 200) {
      return res.status(400).json({ success: false, message: 'Le montant minimum de dépôt est de 200 DH' });
    }

    if (!proofFileUrl) {
      return res.status(400).json({ success: false, message: 'Veuillez télécharger un justificatif de virement' });
    }

    const id = 'dep-' + Date.now();
    const createdAt = new Date().toISOString();

    runSql(
      `INSERT INTO deposits (id, proId, proName, amount, paymentMethod, bankAccountNumber, proofFileName, proofFileUrl, status, createdAt, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        proId,
        proName || 'Professionnel',
        Number(amount),
        paymentMethod || 'cashplus',
        bankAccountNumber || '',
        proofFileName || 'Justificatif.pdf',
        proofFileUrl,
        'pending',
        createdAt,
        notes || ''
      ]
    );

    const deposit = queryOne('SELECT * FROM deposits WHERE id = ?', [id]);
    return res.json({ success: true, deposit });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Process Deposit Status (Admin Approve / Reject)
app.post('/api/deposits/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide' });
    }

    const deposit = queryOne('SELECT * FROM deposits WHERE id = ?', [req.params.id]);
    if (!deposit) {
      return res.status(404).json({ success: false, message: 'Demande de dépôt introuvable' });
    }

    const processedAt = new Date().toISOString();
    runSql('UPDATE deposits SET status = ?, processedAt = ?, notes = COALESCE(?, notes) WHERE id = ?', [
      status,
      processedAt,
      notes || '',
      req.params.id
    ]);

    // If approved, credit pro's balance
    if (status === 'approved' && deposit.status !== 'approved') {
      runSql('UPDATE users SET balance = balance + ? WHERE id = ?', [deposit.amount, deposit.proId]);
    }

    const updatedDeposit = queryOne('SELECT * FROM deposits WHERE id = ?', [req.params.id]);
    const updatedPro = queryOne('SELECT * FROM users WHERE id = ?', [deposit.proId]);

    return res.json({ success: true, deposit: updatedDeposit, pro: updatedPro });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Executed Acts
app.get('/api/acts', (req, res) => {
  try {
    const { proId } = req.query;
    let sql = 'SELECT * FROM executed_acts';
    const params: any[] = [];
    if (proId) {
      sql += ' WHERE proId = ?';
      params.push(proId);
    }
    sql += ' ORDER BY createdAt DESC';
    const acts = queryAll(sql, params);
    return res.json({ success: true, acts });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Create Executed Act (Pro)
app.post('/api/acts', (req, res) => {
  try {
    const { proId, proName, patientName, patientPhone, actName, totalAmount, dateExecuted, notes } = req.body;

    if (!proId || !actName || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Nom de l’acte et montant obligatoires' });
    }

    const numericTotal = Number(totalAmount);
    const commissionAmount = numericTotal * 0.15; // 15% commission
    const proEarnings = numericTotal * 0.85; // 85% for pro

    const id = 'act-' + Date.now();
    const createdAt = new Date().toISOString();

    runSql(
      `INSERT INTO executed_acts (id, proId, proName, patientName, patientPhone, actName, totalAmount, commissionAmount, proEarnings, dateExecuted, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        proId,
        proName || 'Professionnel',
        patientName || 'Patient',
        patientPhone || '',
        actName,
        numericTotal,
        commissionAmount,
        proEarnings,
        dateExecuted || new Date().toISOString().split('T')[0],
        notes || '',
        createdAt
      ]
    );

    // Deduct 15% commission from pro's balance
    runSql('UPDATE users SET balance = balance - ? WHERE id = ?', [commissionAmount, proId]);

    const act = queryOne('SELECT * FROM executed_acts WHERE id = ?', [id]);
    const pro = queryOne('SELECT * FROM users WHERE id = ?', [proId]);

    return res.json({ success: true, act, proBalance: pro ? pro.balance : 0 });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Assign Task to Pro (with 15% commission check)
app.post('/api/admin/assign-task', (req, res) => {
  try {
    const { proId, actName, cost, patientName, patientPhone, patientAddress, notes } = req.body;

    if (!proId || !actName || !cost || Number(cost) <= 0) {
      return res.status(400).json({ success: false, message: 'Professionnel, libellé de la tâche et coût obligatoires' });
    }

    const pro = queryOne('SELECT * FROM users WHERE id = ?', [proId]);
    if (!pro) {
      return res.status(404).json({ success: false, message: 'Professionnel de santé introuvable' });
    }

    const numericCost = Number(cost);
    const commissionAmount = numericCost * 0.15; // 15% commission
    const proEarnings = numericCost * 0.85; // 85% for pro
    const currentBalance = Number(pro.balance || 0);

    // Balance verification: if 15% commission exceeds current balance
    if (commissionAmount > currentBalance) {
      const deficit = commissionAmount - currentBalance;
      return res.status(400).json({
        success: false,
        insufficientBalance: true,
        message: `Solde insuffisant pour réaliser cette tâche !`,
        currentBalance,
        requiredCommission: commissionAmount,
        cost: numericCost,
        deficit,
        pro
      });
    }

    const id = 'act-' + Date.now();
    const createdAt = new Date().toISOString();
    const dateExecuted = new Date().toISOString().split('T')[0];

    runSql(
      `INSERT INTO executed_acts (id, proId, proName, patientName, patientPhone, actName, totalAmount, commissionAmount, proEarnings, dateExecuted, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        pro.id,
        pro.name,
        patientName || 'Patient (Attribué par Direction)',
        patientPhone || '',
        actName,
        numericCost,
        commissionAmount,
        proEarnings,
        dateExecuted,
        notes || (patientAddress ? `Adresse: ${patientAddress}` : ''),
        createdAt
      ]
    );

    // Deduct 15% commission from pro balance
    runSql('UPDATE users SET balance = balance - ? WHERE id = ?', [commissionAmount, pro.id]);

    const updatedAct = queryOne('SELECT * FROM executed_acts WHERE id = ?', [id]);
    const updatedPro = queryOne('SELECT * FROM users WHERE id = ?', [pro.id]);

    return res.json({
      success: true,
      message: 'Tâche attribuée avec succès ! Retenue de 15% effectuée.',
      act: updatedAct,
      pro: updatedPro,
      newBalance: updatedPro.balance
    });
  } catch (err: any) {
    console.error('Assign task error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


async function startServer() {
  await initDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
