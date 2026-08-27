import React, { useState, useEffect } from 'react';
import { UserAccount, DepositRequest, ExecutedAct } from '../types';
import { 
  ShieldCheck, CheckCircle2, Clock, XCircle, MessageCircle, FileText, Phone, MapPin, 
  UserCheck, Stethoscope, Syringe, AlertCircle, ExternalLink, Search, DollarSign, Download, 
  Eye, Layers, ClipboardList, Check, Plus, AlertTriangle 
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser?: UserAccount | null;
  registeredPros?: UserAccount[];
  usersList?: UserAccount[];
  onVerifyUser?: (id: string, status: 'verified' | 'rejected') => void;
  onValidatePro?: (proId: string) => void;
  onRejectPro?: (proId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  registeredPros,
  usersList,
  onVerifyUser,
  onValidatePro,
  onRejectPro
}) => {
  const [activeTab, setActiveTab] = useState<'pros' | 'deposits' | 'acts'>('pros');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [acts, setActs] = useState<ExecutedAct[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState<{ url: string; title: string } | null>(null);

  // Assign Task Modal State
  const [selectedProForTask, setSelectedProForTask] = useState<UserAccount | null>(null);
  const [taskCategory, setTaskCategory] = useState<string>('Consultation & Visite Médicale à Domicile');
  const [customTaskName, setCustomTaskName] = useState<string>('');
  const [taskCost, setTaskCost] = useState<number>(300);
  const [taskPatientName, setTaskPatientName] = useState<string>('');
  const [taskPatientPhone, setTaskPatientPhone] = useState<string>('');
  const [taskPatientAddress, setTaskPatientAddress] = useState<string>('');
  const [taskNotes, setTaskNotes] = useState<string>('');
  const [isAssigningTask, setIsAssigningTask] = useState<boolean>(false);
  const [taskError, setTaskError] = useState<{
    isInsufficient: boolean;
    message: string;
    deficit?: number;
    commission?: number;
    balance?: number;
  } | null>(null);
  const [taskSuccess, setTaskSuccess] = useState<{
    message: string;
    commission: number;
    newBalance: number;
    assignedActName: string;
  } | null>(null);

  // Local pros state to ensure immediate balance updates
  const [localPros, setLocalPros] = useState<UserAccount[]>(registeredPros || usersList || []);

  useEffect(() => {
    if (registeredPros || usersList) {
      setLocalPros(registeredPros || usersList || []);
    }
  }, [registeredPros, usersList]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setLocalPros(data.users.filter((u: UserAccount) => u.role === 'pro'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pros = localPros;

  const fetchDeposits = async () => {
    setLoadingDeposits(true);
    try {
      const res = await fetch('/api/deposits');
      const data = await res.json();
      if (data.success && Array.isArray(data.deposits)) {
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeposits(false);
    }
  };

  const fetchActs = async () => {
    try {
      const res = await fetch('/api/acts');
      const data = await res.json();
      if (data.success && Array.isArray(data.acts)) {
        setActs(data.acts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeposits();
    fetchActs();
  }, []);

  const handleProcessDeposit = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/deposits/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeposits();
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidate = (id: string) => {
    if (onValidatePro) onValidatePro(id);
    if (onVerifyUser) onVerifyUser(id, 'verified');
    fetchUsers();
  };

  const handleReject = (id: string) => {
    if (onRejectPro) onRejectPro(id);
    if (onVerifyUser) onVerifyUser(id, 'rejected');
    fetchUsers();
  };

  // Open Assign Task Modal
  const handleOpenAssignTask = (pro: UserAccount) => {
    setSelectedProForTask(pro);
    setTaskCategory('Consultation & Visite Médicale à Domicile');
    setCustomTaskName('');
    setTaskCost(300);
    setTaskPatientName('');
    setTaskPatientPhone('');
    setTaskPatientAddress('');
    setTaskNotes('');
    setTaskError(null);
    setTaskSuccess(null);
  };

  // Submit Assigned Task
  const handleAssignTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProForTask) return;

    const finalActName = taskCategory === 'Autre Acte Médical / Infirmier Personnalisé' 
      ? (customTaskName.trim() || 'Acte Médical Spécifique')
      : taskCategory;

    const numericCost = Number(taskCost);
    if (!numericCost || numericCost <= 0) {
      alert('Veuillez saisir un coût valide.');
      return;
    }

    const commission = numericCost * 0.15;
    const currentBalance = Number(selectedProForTask.balance || 0);

    // Client-side quick check
    if (commission > currentBalance) {
      setTaskError({
        isInsufficient: true,
        message: 'Solde insuffisant pour réaliser cette tâche !',
        commission,
        balance: currentBalance,
        deficit: commission - currentBalance
      });
      return;
    }

    setIsAssigningTask(true);
    setTaskError(null);

    try {
      const res = await fetch('/api/admin/assign-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId: selectedProForTask.id,
          actName: finalActName,
          cost: numericCost,
          patientName: taskPatientName || 'Patient (Attribué par Direction)',
          patientPhone: taskPatientPhone,
          patientAddress: taskPatientAddress,
          notes: taskNotes
        })
      });

      const data = await res.json();

      if (data.success) {
        setTaskSuccess({
          message: 'Tâche attribuée avec succès ! Retenue de 15% effectuée sur le solde.',
          commission: commission,
          newBalance: data.newBalance,
          assignedActName: finalActName
        });
        // Update local pro balance
        setLocalPros(prev => prev.map(p => p.id === selectedProForTask.id ? { ...p, balance: data.newBalance } : p));
        setSelectedProForTask(prev => prev ? { ...prev, balance: data.newBalance } : null);
        fetchActs();
      } else if (data.insufficientBalance) {
        setTaskError({
          isInsufficient: true,
          message: data.message || 'Solde insuffisant pour réaliser cette tâche !',
          commission: data.requiredCommission || commission,
          balance: data.currentBalance || currentBalance,
          deficit: data.deficit || (commission - currentBalance)
        });
      } else {
        alert(data.message || 'Erreur lors de l’attribution de la tâche.');
      }
    } catch (err: any) {
      alert('Erreur réseau : ' + err.message);
    } finally {
      setIsAssigningTask(false);
    }
  };

  // Send WhatsApp Insufficient Balance Alert to Pro
  const handleSendInsufficientBalanceWhatsApp = () => {
    if (!selectedProForTask) return;
    const cleanPhone = (selectedProForTask.whatsappPhone || selectedProForTask.phone || '').replace(/[^0-9]/g, '') || '212728338276';
    const finalActName = taskCategory === 'Autre Acte Médical / Infirmier Personnalisé' 
      ? (customTaskName.trim() || 'Acte Médical Spécifique')
      : taskCategory;
    const commission = taskCost * 0.15;
    const currentBalance = selectedProForTask.balance || 0;

    const message = encodeURIComponent(
      `Bonjour ${selectedProForTask.name},\n\n` +
      `Une nouvelle tâche de soin vous a été attribuée sur la plateforme DomiSoins Berkane :\n` +
      `📋 Tâche : ${finalActName}\n` +
      `💰 Coût de l'acte : ${taskCost} DH\n` +
      `⚠️ Retenue commission (15%) : ${commission.toFixed(2)} DH\n\n` +
      `❌ Votre solde actuel est de ${currentBalance} DH, ce qui est INSUFFISANT pour valider et débloquer cette mission.\n\n` +
      `Nous vous invitons à recharger votre solde par un dépôt (minimum 200 DH) via :\n` +
      `• CashPlus : 0616828422\n` +
      `• Al Barid Bank : N° de Compte 9178043\n` +
      `• Attijariwafa Bank : RIB 007570000765300030138176\n\n` +
      `Puis téléchargez votre justificatif de virement dans votre espace professionnel pour activer la mission immédiatement.\n\n` +
      `Cordialement,\nDirection Administration DomiSoins Berkane`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Send WhatsApp Task Assigned Confirmation to Pro
  const handleSendTaskAssignedWhatsApp = () => {
    if (!selectedProForTask || !taskSuccess) return;
    const cleanPhone = (selectedProForTask.whatsappPhone || selectedProForTask.phone || '').replace(/[^0-9]/g, '') || '212728338276';
    const commission = taskCost * 0.15;
    const proGain = taskCost * 0.85;

    const message = encodeURIComponent(
      `Bonjour ${selectedProForTask.name},\n\n` +
      `✅ Une nouvelle mission de soin vous a été officiellement ATTRIBUÉE sur DomiSoins Berkane :\n\n` +
      `📋 Acte de Soin : ${taskSuccess.assignedActName}\n` +
      `💰 Montant Total : ${taskCost} DH\n` +
      `🔹 Commission 15% déduite : ${commission.toFixed(2)} DH (Nouveau Solde : ${taskSuccess.newBalance} DH)\n` +
      `💵 Votre Gain Net (85%) : ${proGain.toFixed(2)} DH\n` +
      `👤 Patient : ${taskPatientName || 'Patient Pris en Charge'}\n` +
      `📞 Tél Patient : ${taskPatientPhone || 'Non spécifié'}\n` +
      `📍 Adresse : ${taskPatientAddress || 'Berkane'}\n` +
      `📝 Instructions : ${taskNotes || 'Prendre contact pour convenir de l’heure'}\n\n` +
      `Bonne prise en charge !\nDirection Administration DomiSoins`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredPros = pros.filter(pro => {
    const matchesFilter = filterStatus === 'all' || pro.verificationStatus === filterStatus;
    const matchesSearch = !searchQuery || 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pro.proCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = pros.filter(p => p.verificationStatus === 'pending').length;
  const verifiedCount = pros.filter(p => p.verificationStatus === 'verified').length;
  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;
  const totalCommissions = acts.reduce((sum, act) => sum + (act.commissionAmount || 0), 0);

  const handleSendWhatsAppValidation = (pro: UserAccount) => {
    const cleanPhone = (pro.whatsappPhone || pro.phone || '').replace(/[^0-9]/g, '') || '212728338276';
    const message = encodeURIComponent(
      `Bonjour ${pro.name},\n\nVotre dossier de Professionnel de Santé (${pro.proCategory}) sur la plateforme DomiSoins a été VÉRIFIÉ et VALIDÉ avec succès par l'administration !\n\nVous bénéficiez désormais du badge Vert "Vérifié par l'Administration" et d'un accès complet à votre espace de consultations et soins à domicile.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-6 sm:p-8 border border-[#588157]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#588157] rounded-2xl flex items-center justify-center text-white border border-[#A3B18A]/30 shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#E9EDC9]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-2.5 py-0.5 rounded-full border border-[#A3B18A]">
                Espace Direction & Validation Administration
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-white mt-1">
                Gestion & Validation des Professionnels de Santé (Berkane)
              </h1>
              <p className="text-xs text-[#DAD7CD]">
                Vérification des diplômes, attributions du badge certifié vert et envoi automatique des notifications WhatsApp.
              </p>
            </div>
          </div>

          <div className="bg-[#344E41] p-3.5 rounded-2xl border border-[#588157]/40 text-xs text-[#DAD7CD]">
            <p className="font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#E9EDC9]" />
              <span>Admin Certifié SoinPro</span>
            </p>
            <p className="text-[11px] text-[#A3B18A]">Dossiers en attente : <strong className="text-amber-300 font-bold">{pendingCount}</strong></p>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">{pendingCount}</span>
            <p className="text-xs text-[#344E41]/70">Dossiers en Attente de Validation</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">{verifiedCount}</span>
            <p className="text-xs text-[#344E41]/70">Soignants Vérifiés (Badge Vert)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E9EDC9]/60 flex items-center justify-center text-[#588157]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">{pros.length}</span>
            <p className="text-xs text-[#344E41]/70">Total Soignants Inscrits à Berkane</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-[#E0E5DD] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pros')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${
            activeTab === 'pros'
              ? 'bg-[#2D4739] text-white shadow-md'
              : 'bg-white text-[#344E41] hover:bg-[#F9FAF8] border border-[#E0E5DD]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#E9EDC9]" />
          <span>Professionnels de Santé ({pros.length})</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${
            activeTab === 'deposits'
              ? 'bg-[#2D4739] text-white shadow-md'
              : 'bg-white text-[#344E41] hover:bg-[#F9FAF8] border border-[#E0E5DD]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#E9EDC9]" />
          <span>Validation des Dépôts & Virements</span>
          {pendingDepositsCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold">
              {pendingDepositsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('acts')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${
            activeTab === 'acts'
              ? 'bg-[#2D4739] text-white shadow-md'
              : 'bg-white text-[#344E41] hover:bg-[#F9FAF8] border border-[#E0E5DD]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#E9EDC9]" />
          <span>Actes Réalisés & Commissions (15%)</span>
        </button>
      </div>

      {/* TAB 1: PROFESSIONNELS */}
      {activeTab === 'pros' && (
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-6">
          
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#E0E5DD] pb-4">
            
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-[#F9FAF8] text-[#344E41] border border-[#E0E5DD]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>En Attente ({pendingCount})</span>
              </button>

              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  filterStatus === 'verified'
                    ? 'bg-[#588157] text-white shadow-xs'
                    : 'bg-[#F9FAF8] text-[#344E41] border border-[#E0E5DD]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Vérifiés ({verifiedCount})</span>
              </button>

              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-[#344E41] text-white'
                    : 'bg-[#F9FAF8] text-[#344E41] border border-[#E0E5DD]'
                }`}
              >
                Tous ({pros.length})
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-[#A3B18A] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, email..."
                className="w-full pl-9 pr-3 py-2 border border-[#E0E5DD] rounded-xl text-xs bg-[#F9FAF8]"
              />
            </div>
          </div>

          {/* Pros List */}
          {filteredPros.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#344E41]/60 space-y-2">
              <AlertCircle className="w-8 h-8 text-[#A3B18A] mx-auto" />
              <p className="font-bold">Aucun professionnel de santé dans la base de données SQLite.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPros.map((pro) => (
                <div 
                  key={pro.id}
                  className="p-5 rounded-2xl border border-[#E0E5DD] bg-white hover:border-[#A3B18A] transition-all space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs"
                >
                  {/* Info block */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={pro.profilePictureUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80'}
                      alt={pro.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E0E5DD] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-bold text-[#2D4739] text-base">{pro.name}</h3>

                        {pro.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Vérifié par l'Admin</span>
                          </span>
                        )}

                        {pro.verificationStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>En Attente de Validation</span>
                          </span>
                        )}

                        {pro.verificationStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-red-300">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Refusé</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[#588157] font-bold text-xs">{pro.proCategory}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#344E41]/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#A3B18A]" />
                          <span>{pro.city || 'Berkane'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#A3B18A]" />
                          <span>{pro.phone}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#2D4739]">Solde : {pro.balance || 0} DH</span>
                      </div>

                      <p className="text-xs text-[#2D4739] pt-1 bg-[#F9FAF8] p-2.5 rounded-xl border border-[#E0E5DD] max-w-2xl">
                        <strong>Bio / Compétences :</strong> "{pro.skillsBio}"
                      </p>

                      {/* Diploma File Attachment Badge */}
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#344E41]/70">Diplôme Téléchargé :</span>
                        <button
                          onClick={() => {
                            if (pro.diplomaFileUrl) {
                              setSelectedDocUrl({ url: pro.diplomaFileUrl, title: `Diplôme de ${pro.name}` });
                            } else {
                              alert(`Nom du fichier : ${pro.diplomaFileName || 'Diplome.pdf'}\nFichier transmis lors de l'inscription.`);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 bg-[#E9EDC9] hover:bg-[#A3B18A]/40 text-[#2D4739] px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#A3B18A]/50 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#588157]" />
                          <span>{pro.diplomaFileName || 'Diplome_Officiel_SoinPro.pdf'}</span>
                          <Eye className="w-3 h-3 ml-1 text-[#344E41]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E0E5DD]">
                    {/* BUTTON: TACHE ATTRIBUEE */}
                    <button
                      onClick={() => handleOpenAssignTask(pro)}
                      className="bg-[#2D4739] hover:bg-[#1B2E24] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      title="Attribuer une tâche/mission de soin à ce professionnel et prélever 15% de son solde"
                    >
                      <ClipboardList className="w-4 h-4 text-[#E9EDC9]" />
                      <span>Tâche Attribuée</span>
                    </button>

                    {pro.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleValidate(pro.id)}
                        className="bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#E9EDC9]" />
                        <span>Valider & Attribuer Badge Vert</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSendWhatsAppValidation(pro)}
                      className="bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notifier par WhatsApp</span>
                    </button>

                    {pro.verificationStatus === 'pending' && (
                      <button
                        onClick={() => handleReject(pro.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Refuser</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: DEPOSITS VALIDATION */}
      {activeTab === 'deposits' && (
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-4">
            <div>
              <h3 className="font-serif font-bold text-[#2D4739] text-lg">
                Demandes de Dépôts & Justificatifs de Virement
              </h3>
              <p className="text-xs text-[#344E41]/70">
                Vérifiez les preuves de virement (CashPlus, Albaridbank, Attijariwafabank) et créditez le solde des soignants.
              </p>
            </div>

            <button
              onClick={fetchDeposits}
              className="px-3 py-1.5 bg-[#F9FAF8] border border-[#E0E5DD] text-[#344E41] font-bold text-xs rounded-xl hover:bg-[#E0E5DD]"
            >
              Actualiser
            </button>
          </div>

          {deposits.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#344E41]/60 space-y-2">
              <DollarSign className="w-8 h-8 text-[#A3B18A] mx-auto" />
              <p className="font-bold">Aucune demande de dépôt enregistrée pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deposits.map((dep) => (
                <div key={dep.id} className="p-5 rounded-2xl border border-[#E0E5DD] bg-white space-y-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2D4739] text-base">{dep.proName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dep.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : dep.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {dep.status === 'approved' ? 'Approuvé & Crédité' : dep.status === 'rejected' ? 'Refusé' : 'En Attente'}
                      </span>
                    </div>

                    <p className="text-xs text-[#588157] font-extrabold">
                      Montant du dépôt : <span className="text-base font-serif font-black">{dep.amount} DH</span>
                    </p>

                    <p className="text-[#344E41]/80">
                      • Mode de Virement : <strong className="uppercase">{dep.paymentMethod}</strong>
                    </p>
                    <p className="text-[#344E41]/80">• Date : {dep.createdAt?.split('T')[0]}</p>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (dep.proofFileUrl) {
                            setSelectedDocUrl({ url: dep.proofFileUrl, title: `Preuve de virement - ${dep.proName}` });
                          } else {
                            alert(`Fichier : ${dep.proofFileName}`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#E9EDC9] hover:bg-[#A3B18A]/40 text-[#2D4739] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#A3B18A]/50 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#588157]" />
                        <span>Justificatif : {dep.proofFileName}</span>
                        <Eye className="w-3.5 h-3.5 text-[#344E41] ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    {dep.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleProcessDeposit(dep.id, 'approved')}
                          className="flex-1 md:flex-initial bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#E9EDC9]" />
                          <span>Approuver & Créditer Solde</span>
                        </button>

                        <button
                          onClick={() => handleProcessDeposit(dep.id, 'rejected')}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Refuser</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXECUTED ACTS & COMMISSIONS */}
      {activeTab === 'acts' && (
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-4">
            <div>
              <h3 className="font-serif font-bold text-[#2D4739] text-lg">
                Suivi des Actes Effectués & Commissions Plateforme (15%)
              </h3>
              <p className="text-xs text-[#344E41]/70">
                Chaque acte exécuté génère une retenue automatique de 15% déduite du solde du professionnel.
              </p>
            </div>

            <div className="bg-[#E9EDC9] px-4 py-2 rounded-2xl border border-[#A3B18A] text-xs font-bold text-[#2D4739]">
              Commissions totales perçues : <span className="text-base font-serif font-black">{totalCommissions.toFixed(2)} DH</span>
            </div>
          </div>

          {acts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#344E41]/60 space-y-2">
              <Layers className="w-8 h-8 text-[#A3B18A] mx-auto" />
              <p className="font-bold">Aucun acte effectué déclaré pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E0E5DD] bg-[#F9FAF8] text-[#344E41] uppercase text-[10px]">
                    <th className="p-3">Date</th>
                    <th className="p-3">Professionnel</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Acte Soin</th>
                    <th className="p-3">Montant Patient</th>
                    <th className="p-3 text-amber-700">Commission (15%)</th>
                    <th className="p-3 text-emerald-700">Gain Soignant (85%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E5DD]">
                  {acts.map((act) => (
                    <tr key={act.id} className="hover:bg-[#F9FAF8]">
                      <td className="p-3 font-semibold text-[#344E41]">{act.dateExecuted}</td>
                      <td className="p-3 font-bold text-[#2D4739]">{act.proName}</td>
                      <td className="p-3 text-[#344E41]">{act.patientName} ({act.patientPhone || 'N/A'})</td>
                      <td className="p-3 text-[#344E41] font-semibold">{act.actName}</td>
                      <td className="p-3 font-bold text-[#2D4739]">{act.totalAmount} DH</td>
                      <td className="p-3 font-bold text-amber-700 bg-amber-50/50">{act.commissionAmount?.toFixed(2)} DH</td>
                      <td className="p-3 font-bold text-emerald-700">{act.proEarnings?.toFixed(2)} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT / DIPLOMA PREVIEW MODAL */}
      {selectedDocUrl && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
              <h3 className="font-serif font-bold text-[#2D4739] text-base">{selectedDocUrl.title}</h3>
              <button
                onClick={() => setSelectedDocUrl(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#344E41]"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto border border-[#E0E5DD] rounded-2xl p-2 bg-gray-50 flex items-center justify-center">
              {selectedDocUrl.url.startsWith('data:image') || selectedDocUrl.url.startsWith('http') ? (
                <img
                  src={selectedDocUrl.url}
                  alt="Aperçu document"
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : selectedDocUrl.url.startsWith('data:application/pdf') ? (
                <iframe
                  src={selectedDocUrl.url}
                  className="w-full h-[50vh] rounded-xl"
                  title="Document PDF"
                />
              ) : (
                <div className="p-8 text-center text-xs space-y-2">
                  <FileText className="w-12 h-12 text-[#588157] mx-auto" />
                  <p className="font-bold text-[#2D4739]">Aperçu de fichier</p>
                  <a
                    href={selectedDocUrl.url}
                    download="Document_DomiSoins"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#588157] text-white font-bold rounded-xl text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le Fichier</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDocUrl(null)}
                className="px-5 py-2 bg-[#2D4739] text-white font-bold rounded-xl text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN TASK / TÂCHE ATTRIBUÉE (WITH 15% COMMISSION & BALANCE CHECK) */}
      {selectedProForTask && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-xl w-full p-6 text-[#2D4739] text-xs space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#588157] rounded-xl flex items-center justify-center text-white shrink-0">
                  <ClipboardList className="w-5 h-5 text-[#E9EDC9]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#2D4739]">
                    Attribution d'une Tâche / Mission de Soin
                  </h3>
                  <p className="text-[11px] text-[#344E41]/70">
                    Prélèvement automatique de la commission plateforme (15%) sur le solde
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProForTask(null);
                  setTaskError(null);
                  setTaskSuccess(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-[#344E41]"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Pro Card Summary & Balance Badge */}
            <div className="p-3.5 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProForTask.profilePictureUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedProForTask.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#E0E5DD]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-[#2D4739] text-xs">{selectedProForTask.name}</h4>
                  <p className="text-[11px] text-[#588157] font-semibold">{selectedProForTask.proCategory}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#344E41]/70 font-semibold block">Solde Actuel Disponible</span>
                <span className={`text-base font-serif font-black ${
                  (selectedProForTask.balance || 0) < (taskCost * 0.15) ? 'text-red-600' : 'text-[#2D4739]'
                }`}>
                  {selectedProForTask.balance || 0} DH
                </span>
              </div>
            </div>

            {/* SUCCESS BANNER */}
            {taskSuccess && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-900 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs">{taskSuccess.message}</p>
                    <p className="text-[11px]">
                      • Tâche : <strong>{taskSuccess.assignedActName}</strong> ({taskCost} DH)<br />
                      • Retenue 15% appliquée : <strong>-{taskSuccess.commission.toFixed(2)} DH</strong><br />
                      • Nouveau solde soignant : <strong>{taskSuccess.newBalance.toFixed(2)} DH</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendTaskAssignedWhatsApp}
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer les Détails de la Mission au Soignant sur WhatsApp</span>
                </button>
              </div>
            )}

            {/* INSUFFICIENT BALANCE ERROR BANNER & WHATSAPP RECHARGE BUTTON */}
            {taskError && taskError.isInsufficient && (
              <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-300 text-red-950 space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-red-900 text-sm">
                      Solde Insuffisant pour Réaliser cette Tâche !
                    </h5>
                    <p className="text-red-800">
                      La retenue de 15% de commission pour cette tâche s'élève à <strong>{(taskCost * 0.15).toFixed(2)} DH</strong>, alors que le solde actuel de <strong>{selectedProForTask.name}</strong> n'est que de <strong>{selectedProForTask.balance || 0} DH</strong>.
                    </p>
                    <p className="text-[11px] text-red-700 font-semibold">
                      Déficit à combler : <strong>{(taskCost * 0.15 - (selectedProForTask.balance || 0)).toFixed(2)} DH</strong>.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[11px] text-red-800 font-bold mb-2">
                    Avertissez le praticien pour qu'il effectue un virement de recharge (min 200 DH) :
                  </p>
                  <button
                    type="button"
                    onClick={handleSendInsufficientBalanceWhatsApp}
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Avertir le Professionnel par WhatsApp & Inviter au Dépôt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Task Form */}
            {!taskSuccess && (
              <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Type d'Acte / Tâche à Réaliser *</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTaskCategory(val);
                      if (val.includes('300')) setTaskCost(300);
                      else if (val.includes('150')) setTaskCost(150);
                      else if (val.includes('200')) setTaskCost(200);
                      else if (val.includes('120')) setTaskCost(120);
                      else if (val.includes('250')) setTaskCost(250);
                      else if (val.includes('400')) setTaskCost(400);
                      else if (val.includes('350')) setTaskCost(350);
                    }}
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold text-[#2D4739] bg-white text-xs"
                  >
                    <option value="Consultation & Visite Médicale à Domicile">Consultation & Visite Médicale à Domicile (300 DH)</option>
                    <option value="Injection & Perfusion Intraveineuse à Domicile">Injection & Perfusion Intraveineuse à Domicile (150 DH)</option>
                    <option value="Pansement d'Escarre & Soins de Plaies Complexes">Pansement d'Escarre & Soins de Plaies (200 DH)</option>
                    <option value="Prélèvement Sanguin & Bilan Biologique à Domicile">Prélèvement Sanguin & Bilan Biologique (120 DH)</option>
                    <option value="Séance de Kinésithérapie & Rééducation Motrice">Séance de Kinésithérapie & Rééducation (250 DH)</option>
                    <option value="Garde-Malade & Surveillance de Nuit">Garde-Malade & Surveillance de Nuit (400 DH)</option>
                    <option value="Sondage & Soins Post-Opératoires">Sondage & Soins Post-Opératoires (350 DH)</option>
                    <option value="Autre Acte Médical / Infirmier Personnalisé">Autre Acte Médical / Soin Personnalisé...</option>
                  </select>
                </div>

                {taskCategory === 'Autre Acte Médical / Infirmier Personnalisé' && (
                  <div>
                    <label className="block font-bold mb-1">Précisez le Libellé de l'Acte *</label>
                    <input
                      type="text"
                      value={customTaskName}
                      onChange={(e) => setCustomTaskName(e.target.value)}
                      placeholder="Ex: Échographie Doppler à domicile, Pose de sonde naso-gastrique..."
                      required
                      className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold bg-white text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold mb-1">Coût Total de la Tâche Payé par le Patient (DH) *</label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    value={taskCost}
                    onChange={(e) => setTaskCost(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold text-sm bg-white text-[#2D4739]"
                  />
                </div>

                {/* Calculation & Balance Live Indicator Box */}
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  (selectedProForTask.balance || 0) < (taskCost * 0.15)
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : 'bg-[#E9EDC9]/40 border-[#A3B18A]/50 text-[#2D4739]'
                }`}>
                  <div className="flex justify-between items-center font-bold">
                    <span>Retenue Commission Plateforme (15%) :</span>
                    <span className="font-serif font-black text-sm text-amber-700">
                      -{(taskCost * 0.15).toFixed(2)} DH
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#344E41]">
                    <span>Gain Net du Praticien (85%) :</span>
                    <span className="font-bold text-emerald-700">+{(taskCost * 0.85).toFixed(2)} DH</span>
                  </div>

                  <div className="pt-1.5 border-t border-black/10 flex justify-between items-center font-semibold text-[11px]">
                    <span>Solde après déduction :</span>
                    <span className={`font-bold ${
                      (selectedProForTask.balance || 0) - (taskCost * 0.15) < 0 ? 'text-red-600' : 'text-[#2D4739]'
                    }`}>
                      {((selectedProForTask.balance || 0) - (taskCost * 0.15)).toFixed(2)} DH
                    </span>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-2 pt-1 border-t border-[#E0E5DD]">
                  <p className="font-bold text-xs text-[#2D4739]">Coordonnées de la Demande Patient :</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#344E41] mb-0.5">Nom du Patient</label>
                      <input
                        type="text"
                        value={taskPatientName}
                        onChange={(e) => setTaskPatientName(e.target.value)}
                        placeholder="Ex: M. Mohammed Alami"
                        className="w-full p-2 border border-[#E0E5DD] rounded-xl text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#344E41] mb-0.5">Téléphone Patient</label>
                      <input
                        type="text"
                        value={taskPatientPhone}
                        onChange={(e) => setTaskPatientPhone(e.target.value)}
                        placeholder="Ex: +212 6..."
                        className="w-full p-2 border border-[#E0E5DD] rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#344E41] mb-0.5">Adresse / Quartier à Berkane</label>
                    <input
                      type="text"
                      value={taskPatientAddress}
                      onChange={(e) => setTaskPatientAddress(e.target.value)}
                      placeholder="Ex: Boulevard Mohammed V, Quartier Al Massira, Berkane"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#344E41] mb-0.5">Consignes / Notes médicales</label>
                    <input
                      type="text"
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      placeholder="Ex: Patient alité, matériel stérile fourni"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProForTask(null);
                      setTaskError(null);
                    }}
                    className="flex-1 py-3 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD] text-xs hover:bg-[#E0E5DD]"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isAssigningTask}
                    className="flex-1 py-3 bg-[#2D4739] hover:bg-[#1B2E24] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-xs"
                  >
                    {isAssigningTask ? (
                      <span>Attribution en cours...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-[#E9EDC9]" />
                        <span>Valider Tâche & Déduire 15%</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {taskSuccess && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProForTask(null);
                    setTaskSuccess(null);
                  }}
                  className="px-6 py-2.5 bg-[#2D4739] text-white font-bold rounded-xl text-xs"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
