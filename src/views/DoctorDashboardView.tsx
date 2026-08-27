import React, { useState, useEffect } from 'react';
import { Appointment, VitalLog, MedicalHistoryRecord, UserAccount, DepositRequest, ExecutedAct, PaymentMethod } from '../types';
import { 
  Stethoscope, Calendar, Clock, MapPin, CheckCircle2, UserCheck, Plus, FileText, Activity, 
  ShieldCheck, AlertCircle, Phone, MessageCircle, DollarSign, Upload, Eye, CreditCard, 
  ArrowUpRight, Building2, Download, XCircle, Check, RefreshCw 
} from 'lucide-react';

interface DoctorDashboardViewProps {
  currentUser?: UserAccount | null;
  appointments: Appointment[];
  vitals: VitalLog[];
  medicalHistory: MedicalHistoryRecord[];
  onAddMedicalHistory: (record: MedicalHistoryRecord) => void;
  onUpdateApptStatus: (id: string, status: 'Confirmé' | 'En cours' | 'Terminé' | 'Annulé') => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  currentUser,
  appointments = [],
  vitals = [],
  medicalHistory = [],
  onAddMedicalHistory,
  onUpdateApptStatus
}) => {
  const [showConsultNoteModal, setShowConsultNoteModal] = useState(false);
  const [selectedApptForNote, setSelectedApptForNote] = useState<Appointment | null>(null);

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(200);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cashplus');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [depositNotes, setDepositNotes] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  // Executed Act Modal State
  const [showActModal, setShowActModal] = useState(false);
  const [actPatientName, setActPatientName] = useState('');
  const [actPatientPhone, setActPatientPhone] = useState('');
  const [actName, setActName] = useState('');
  const [actTotalAmount, setActTotalAmount] = useState<number>(350);
  const [actNotes, setActNotes] = useState('');
  const [isSubmittingAct, setIsSubmittingAct] = useState(false);

  // Diploma Viewer & Update Modal State
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  const [newDiplomaFileName, setNewDiplomaFileName] = useState('');
  const [newDiplomaFileUrl, setNewDiplomaFileUrl] = useState('');
  const [isUpdatingDiploma, setIsUpdatingDiploma] = useState(false);

  // User Local Data State
  const [myDeposits, setMyDeposits] = useState<DepositRequest[]>([]);
  const [myActs, setMyActs] = useState<ExecutedAct[]>([]);
  const [userBalance, setUserBalance] = useState<number>(currentUser?.balance || 0);
  const [userDiplomaUrl, setUserDiplomaUrl] = useState<string>(currentUser?.diplomaFileUrl || '');
  const [userDiplomaName, setUserDiplomaName] = useState<string>(currentUser?.diplomaFileName || 'Diplome_Officiel.pdf');

  // New Consultation Note Form State
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [rx1, setRx1] = useState('');
  const [rx2, setRx2] = useState('');
  const [labNotes, setLabNotes] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const proId = currentUser?.id || 'pro-1';
  const proName = currentUser?.name || 'Professionnel de Santé';
  const proCategory = currentUser?.proCategory || 'Médecin Généraliste';
  const isVerified = currentUser ? currentUser.verificationStatus === 'verified' : false;
  const isPending = currentUser?.verificationStatus === 'pending';

  // Fetch deposits & acts for this pro from backend
  const fetchProData = async () => {
    if (!currentUser?.id) return;
    try {
      // Get user fresh balance & diploma
      const resUser = await fetch(`/api/users/${currentUser.id}`);
      const dataUser = await resUser.json();
      if (dataUser.success && dataUser.user) {
        setUserBalance(dataUser.user.balance || 0);
        if (dataUser.user.diplomaFileUrl) setUserDiplomaUrl(dataUser.user.diplomaFileUrl);
        if (dataUser.user.diplomaFileName) setUserDiplomaName(dataUser.user.diplomaFileName);
      }

      // Get deposits
      const resDep = await fetch(`/api/deposits?proId=${currentUser.id}`);
      const dataDep = await resDep.json();
      if (dataDep.success && Array.isArray(dataDep.deposits)) {
        setMyDeposits(dataDep.deposits);
      }

      // Get acts
      const resActs = await fetch(`/api/acts?proId=${currentUser.id}`);
      const dataActs = await resActs.json();
      if (dataActs.success && Array.isArray(dataActs.acts)) {
        setMyActs(dataActs.acts);
      }
    } catch (err) {
      console.error('Error fetching pro data:', err);
    }
  };

  useEffect(() => {
    fetchProData();
  }, [currentUser?.id]);

  // Handle Proof File Upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProofFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Diploma Update File Upload
  const handleDiplomaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewDiplomaFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewDiplomaFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to build WhatsApp notification text for deposit
  const buildDepositWhatsAppUrl = (dep: {
    proName: string;
    proCategory: string;
    amount: number;
    paymentMethod: string;
    bankAccountNumber?: string;
    proofFileName?: string;
    notes?: string;
    date?: string;
  }) => {
    const methodLabels: Record<string, string> = {
      cashplus: 'CashPlus (Transfert 0616828422)',
      albaridbank: 'Al Barid Bank (Compte 9178043)',
      attijariwafabank: 'Attijariwafa Bank (RIB 007570000765300030138176)'
    };
    const methodStr = methodLabels[dep.paymentMethod] || dep.paymentMethod.toUpperCase();
    const dateStr = dep.date || new Date().toLocaleDateString('fr-FR');
    const msg = `📌 *NOUVELLE DEMANDE DE DÉPÔT / RECHARGEMENT DE SOLDE*\n\n` +
      `👤 *Professionnel :* ${dep.proName} (${dep.proCategory})\n` +
      `💰 *Montant déposé :* ${dep.amount} DH\n` +
      `💳 *Mode de Virement :* ${methodStr}\n` +
      `🔢 *N° Référence / Compte :* ${dep.bankAccountNumber || 'Virement direct'}\n` +
      `📄 *Justificatif :* ${dep.proofFileName || 'Reçu_Virement'}\n` +
      `📝 *Notes :* ${dep.notes || 'Aucune'}\n` +
      `📅 *Date :* ${dateStr}\n\n` +
      `Merci de bien vouloir vérifier le justificatif et créditer le solde du compte sur DomiSoins.`;
    return `https://wa.me/212728338276?text=${encodeURIComponent(msg)}`;
  };

  // Submit Deposit Request to SQLite
  const handleSaveDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount < 200) {
      alert('Le montant minimum de dépôt est de 200 DH');
      return;
    }
    if (!proofFileUrl) {
      alert('Veuillez télécharger une photo ou un document PDF de votre justificatif de virement');
      return;
    }

    setIsSubmittingDeposit(true);
    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId,
          proName,
          amount: depositAmount,
          paymentMethod,
          bankAccountNumber,
          proofFileName: proofFileName || 'Reçu_Virement.pdf',
          proofFileUrl,
          notes: depositNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        // Send / Open WhatsApp notification with deposit info
        const waUrl = buildDepositWhatsAppUrl({
          proName,
          proCategory,
          amount: depositAmount,
          paymentMethod,
          bankAccountNumber,
          proofFileName: proofFileName || 'Reçu_Virement.pdf',
          notes: depositNotes
        });

        // Open WhatsApp directly
        window.open(waUrl, '_blank');

        setFeedbackMsg({
          type: 'success',
          msg: `Demande de dépôt de ${depositAmount} DH enregistrée ! La notification WhatsApp avec les détails du dépôt a été préparée.`
        });
        setShowDepositModal(false);
        setProofFileName('');
        setProofFileUrl('');
        setDepositNotes('');
        fetchProData();
      } else {
        alert(data.message || 'Erreur lors de l’envoi de la demande');
      }
    } catch (err: any) {
      alert('Erreur réseau : ' + err.message);
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  // Submit Executed Act
  const handleSaveAct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName || !actTotalAmount) {
      alert('Veuillez saisir le nom de l’acte et le montant payé par le patient.');
      return;
    }

    setIsSubmittingAct(true);
    try {
      const res = await fetch('/api/acts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId,
          proName,
          patientName: actPatientName || 'Patient Anonyme',
          patientPhone: actPatientPhone,
          actName,
          totalAmount: actTotalAmount,
          notes: actNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ type: 'success', msg: `Acte enregistré ! Commission de 15% (${(actTotalAmount * 0.15).toFixed(2)} DH) déduite de votre solde.` });
        setShowActModal(false);
        setActPatientName('');
        setActPatientPhone('');
        setActName('');
        setActNotes('');
        fetchProData();
      } else {
        alert(data.message || 'Erreur lors de la déclaration de l’acte');
      }
    } catch (err: any) {
      alert('Erreur réseau : ' + err.message);
    } finally {
      setIsSubmittingAct(false);
    }
  };

  // Submit Diploma Update
  const handleSaveDiplomaUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiplomaFileUrl) {
      alert('Veuillez sélectionner un fichier (PDF ou Image) pour votre diplôme.');
      return;
    }

    setIsUpdatingDiploma(true);
    try {
      const res = await fetch(`/api/pros/${proId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diplomaFileName: newDiplomaFileName || 'Diplome.pdf',
          diplomaFileUrl: newDiplomaFileUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setUserDiplomaUrl(newDiplomaFileUrl);
        setUserDiplomaName(newDiplomaFileName || 'Diplome.pdf');
        setFeedbackMsg({ type: 'success', msg: 'Votre diplôme a été mis à jour dans votre profil et transmis à l’administration.' });
        setShowDiplomaModal(false);
      } else {
        alert('Erreur lors de la mise à jour du diplôme.');
      }
    } catch (err: any) {
      alert('Erreur réseau : ' + err.message);
    } finally {
      setIsUpdatingDiploma(false);
    }
  };

  const handleOpenNoteModal = (appt: Appointment) => {
    setSelectedApptForNote(appt);
    setPatientName(appt.patientName);
    setShowConsultNoteModal(true);
  };

  const handleSaveConsultNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptForNote) return;

    const prescriptionsList = [rx1].filter(Boolean);
    if (rx2) prescriptionsList.push(rx2);

    const newRec: MedicalHistoryRecord = {
      id: `mh-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      doctorName: selectedApptForNote.doctorName,
      specialty: selectedApptForNote.doctorSpecialty,
      diagnosis,
      treatmentSummary: treatment,
      prescriptions: prescriptionsList.length > 0 ? prescriptionsList : ['Poursuite du traitement habituel'],
      labNotes,
      recommendedFollowUp: 'Revoir dans 1 mois si besoin'
    };

    onAddMedicalHistory(newRec);
    onUpdateApptStatus(selectedApptForNote.id, 'Terminé');
    setShowConsultNoteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Feedback Alert Message */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-xs ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{feedbackMsg.msg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="font-bold underline text-xs">Fermer</button>
        </div>
      )}
      
      {/* Pending Validation Alert Banner */}
      {isPending && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Dossier en attente de vérification par l'Administration</h4>
            <p>
              Bonjour <strong>{proName}</strong>, vos informations et votre diplôme (<em>{userDiplomaName}</em>) ont été enregistrés dans la base de données.
              Dès validation par l'administration, votre badge vert d'accréditation s'affichera sur votre profil public.
            </p>
          </div>
        </div>
      )}

      {/* Header Doctor / Pro Badge & Balance Overview */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-6 sm:p-8 border border-[#588157]/30 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser?.profilePictureUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80'}
              alt={proName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E9EDC9] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-950 bg-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Accrédité & Vérifié par l'Admin</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 bg-amber-200 px-3 py-0.5 rounded-full border border-amber-400">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    <span>En Cours de Validation Admin</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-serif font-extrabold text-white">{proName}</h1>
              <p className="text-xs text-[#E9EDC9] font-semibold">{proCategory}</p>
              <p className="text-xs text-[#DAD7CD]">
                📍 {currentUser?.city || 'Berkane'} • Tél : {currentUser?.phone || '+212 616-828422'}
              </p>
            </div>
          </div>

          {/* Solde Financier Card & Action */}
          <div className="bg-[#344E41] p-5 rounded-2xl border border-[#588157]/50 w-full lg:w-auto min-w-[280px] space-y-3 shadow-lg">
            <div className="flex justify-between items-center text-xs border-b border-[#588157]/40 pb-2">
              <span className="font-semibold text-[#DAD7CD] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#E9EDC9]" />
                <span>Solde Compte Pro :</span>
              </span>
              <span className="font-serif text-xl font-black text-emerald-300">{userBalance.toFixed(2)} DH</span>
            </div>

            <div className="text-[11px] text-[#A3B18A] space-y-1">
              <p>• Commission plateforme : <strong>15%</strong> par acte</p>
              <p>• Rechargement min : <strong>200 DH</strong> (CashPlus/Bank)</p>
            </div>

            {/* ACTION DEPOSIT BUTTON */}
            <button
              onClick={() => setShowDepositModal(true)}
              className="w-full bg-[#E9EDC9] hover:bg-[#A3B18A] text-[#2D4739] font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Effectuer un Dépôt / Recharger Solde</span>
            </button>
          </div>
        </div>

        {/* Diplôme & Bio Info Bar */}
        <div className="pt-4 border-t border-[#588157]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[#DAD7CD]">
          <div className="space-y-1">
            <p><strong>Présentation :</strong> "{currentUser?.skillsBio || 'Professionnel de santé certifié à Berkane'}"</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[#E9EDC9] font-bold">Diplôme Téléchargé :</span>
            <button
              onClick={() => setShowDiplomaModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#344E41] hover:bg-[#588157] text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-[#588157] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#E9EDC9]" />
              <span>{userDiplomaName}</span>
              <Eye className="w-3.5 h-3.5 ml-1 text-emerald-300" />
            </button>
          </div>
        </div>
      </div>

      {/* BANNER RECHARGE SOLDE DEPOSITS INCENTIVE */}
      <div className="bg-gradient-to-r from-[#2D4739] to-[#344E41] p-6 rounded-3xl text-white shadow-md border border-[#588157]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#E9EDC9] text-[#2D4739] px-3 py-0.5 rounded-full text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Information Réglementaire Commissions Soignants</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-white">
            Alimentez votre Solde pour Valider vos Consultations à Domicile
          </h3>
          <p className="text-xs text-[#DAD7CD]">
            Afin de garantir le fonctionnement de la plateforme à Berkane, DomiSoins applique une déduction automatique de <strong>15% de commission</strong> sur chaque soin réalisé. 
            Veuillez effectuer un virement (minimum 200 DH) via CashPlus, Al Barid Bank ou Attijariwafa Bank puis importer votre reçu de virement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-5 py-3 bg-[#588157] hover:bg-[#A3B18A] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Upload className="w-4 h-4 text-[#E9EDC9]" />
            <span>Faire un Dépôt / Importer Reçu</span>
          </button>

          <button
            onClick={() => setShowActModal(true)}
            className="px-5 py-3 bg-white hover:bg-[#F9FAF8] text-[#2D4739] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#588157]" />
            <span>Déclarer un Acte Réalisé</span>
          </button>
        </div>
      </div>

      {/* SECTION HISTORIQUE DES DÉPÔTS & ACTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table 1: Mes Demandes de Dépôts */}
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
            <h3 className="font-serif font-bold text-[#2D4739] text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#588157]" />
              <span>Historique de mes Dépôts ({myDeposits.length})</span>
            </h3>

            <button
              onClick={() => setShowDepositModal(true)}
              className="text-xs text-[#588157] font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau Dépôt</span>
            </button>
          </div>

          {myDeposits.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#344E41]/60 space-y-2">
              <AlertCircle className="w-6 h-6 text-[#A3B18A] mx-auto" />
              <p className="font-bold">Aucun dépôt de solde effectué pour le moment.</p>
              <p>Cliquez sur "Effectuer un Dépôt" pour recharger votre compte.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myDeposits.map((dep) => (
                <div key={dep.id} className="p-4 rounded-2xl border border-[#E0E5DD] bg-[#F9FAF8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-black text-[#2D4739] text-sm">{dep.amount} DH</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dep.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : dep.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {dep.status === 'approved' ? 'Approuvé & Crédité' : dep.status === 'rejected' ? 'Refusé' : 'En Attente Admin'}
                      </span>
                    </div>

                    <p className="text-[#344E41]/70">
                      Via <strong className="uppercase">{dep.paymentMethod}</strong> • Date : {dep.createdAt?.split('T')[0]}
                    </p>
                    <p className="text-[11px] text-[#A3B18A]">Justificatif : {dep.proofFileName}</p>
                  </div>

                  <a
                    href={buildDepositWhatsAppUrl({
                      proName: dep.proName || proName,
                      proCategory: proCategory,
                      amount: dep.amount,
                      paymentMethod: dep.paymentMethod,
                      bankAccountNumber: dep.bankAccountNumber,
                      proofFileName: dep.proofFileName,
                      notes: dep.notes,
                      date: dep.createdAt?.split('T')[0]
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-xl text-[11px] shadow-xs transition-colors shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Notification WhatsApp</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table 2: Mes Actes Réalisés (Commissions 15%) */}
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
            <h3 className="font-serif font-bold text-[#2D4739] text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#588157]" />
              <span>Actes Réalisés & Retenues 15% ({myActs.length})</span>
            </h3>

            <button
              onClick={() => setShowActModal(true)}
              className="text-xs text-[#588157] font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Déclarer Acte</span>
            </button>
          </div>

          {myActs.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#344E41]/60 space-y-2">
              <Activity className="w-6 h-6 text-[#A3B18A] mx-auto" />
              <p className="font-bold">Aucun acte déclaré pour le moment.</p>
              <p>Chaque soin à domicile réalisé doit être enregistré ici.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myActs.map((act) => (
                <div key={act.id} className="p-4 rounded-2xl border border-[#E0E5DD] bg-[#F9FAF8] space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-[#2D4739] text-sm">{act.actName}</span>
                    <span className="font-bold text-[#2D4739]">{act.totalAmount} DH Payé</span>
                  </div>
                  <p className="text-[#344E41]/80">Patient : <strong>{act.patientName}</strong> • Date : {act.dateExecuted}</p>
                  <div className="flex gap-4 pt-1 text-[11px] font-semibold">
                    <span className="text-amber-700">Commission (15%) : -{act.commissionAmount?.toFixed(2)} DH</span>
                    <span className="text-emerald-700">Votre Gain Net (85%) : {act.proEarnings?.toFixed(2)} DH</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>



      {/* MODAL 1: DEPOSIT / RECHARGE SOLDE FORM */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-2xl w-full p-6 text-[#2D4739] text-xs space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#588157]" />
                  <span>Dépôt & Rechargement de Solde Soignant</span>
                </h3>
                <p className="text-[11px] text-[#344E41]/70">Minimum obligatoire : 200 DH</p>
              </div>

              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#344E41]"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Official Accounts Bank Info */}
            <div className="space-y-3 bg-[#F9FAF8] p-4 rounded-2xl border border-[#E0E5DD]">
              <h4 className="font-bold text-[#2D4739] text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#588157]" />
                <span>Coordonnées Officielle pour le Virement (Choisissez une option) :</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CashPlus */}
                <div className="p-3 bg-white rounded-xl border border-[#E0E5DD] space-y-1">
                  <span className="font-extrabold text-[#2D4739] block text-xs">1. CashPlus</span>
                  <p className="text-[11px] text-[#344E41]">Tél : <strong>0616828422</strong></p>
                  <p className="text-[10px] text-[#344E41]/70">DomiSoins Berkane</p>
                </div>

                {/* Al Barid Bank */}
                <div className="p-3 bg-white rounded-xl border border-[#E0E5DD] space-y-1">
                  <span className="font-extrabold text-[#2D4739] block text-xs">2. Al Barid Bank</span>
                  <p className="text-[11px] text-[#344E41]">Compte : <strong>9178043</strong></p>
                  <p className="text-[10px] text-[#344E41]/70">DomiSoins Berkane</p>
                </div>

                {/* Attijariwafa Bank */}
                <div className="p-3 bg-white rounded-xl border border-[#E0E5DD] space-y-1">
                  <span className="font-extrabold text-[#2D4739] block text-xs">3. Attijariwafa Bank</span>
                  <p className="text-[10px] text-[#344E41]">RIB : <strong>007570000765300030138176</strong></p>
                  <p className="text-[10px] text-[#344E41]/70">DomiSoins SARL</p>
                </div>
              </div>
            </div>

            {/* Deposit Form */}
            <form onSubmit={handleSaveDeposit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Montant du Dépôt (DH) *</label>
                  <input
                    type="number"
                    min={200}
                    step={50}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl text-sm font-bold text-[#2D4739] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Mode de Paiement Utilisé *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold text-[#2D4739] bg-white"
                  >
                    <option value="cashplus">CashPlus (Transfert 0616828422)</option>
                    <option value="albaridbank">Al Barid Bank (N° 9178043)</option>
                    <option value="attijariwafabank">Attijariwafa Bank (RIB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">N° de Référence / Transaction / Compte d'origine :</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Ex: Ref CashPlus #9283011 ou RIB expéditeur"
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              {/* Upload Proof Document */}
              <div className="p-4 bg-[#E9EDC9]/30 rounded-2xl border border-[#A3B18A]/40 space-y-2">
                <label className="block font-bold text-[#2D4739]">
                  Télécharger le Justificatif / Reçu de Virement (Image ou PDF) *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofUpload}
                  required
                  className="w-full text-xs"
                />
                {proofFileName && (
                  <p className="text-[11px] text-[#588157] font-bold">
                    ✓ Fichier sélectionné : {proofFileName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Notes / Informations complémentaires (Optionnel) :</label>
                <input
                  type="text"
                  value={depositNotes}
                  onChange={(e) => setDepositNotes(e.target.value)}
                  placeholder="Ex: Virement effectué à 14h par M. Bennani"
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingDeposit}
                  className="flex-1 py-3 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmittingDeposit ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#E9EDC9]" />
                      <span>Soumettre à l'Administration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EXECUTED ACT DECLARATION FORM */}
      {showActModal && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-md w-full p-6 text-[#2D4739] text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
              <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#588157]" />
                <span>Déclaration d'un Acte Réalisé (Paiement Direct)</span>
              </h3>
              <button onClick={() => setShowActModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-[#344E41]">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAct} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Libellé de l'Acte de Soin *</label>
                <input
                  type="text"
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  placeholder="Ex: Consultation à domicile, Perfusion IV, Pansement escarre..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Montant Total Payé par le Patient (DH) *</label>
                <input
                  type="number"
                  min={50}
                  step={10}
                  value={actTotalAmount}
                  onChange={(e) => setActTotalAmount(Number(e.target.value))}
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl font-bold text-sm bg-white"
                />
              </div>

              {/* Commission preview */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold text-xs">Calcul Automatique des Retenues :</p>
                <p>• Commission DomiSoins (15%) : <strong>{(actTotalAmount * 0.15).toFixed(2)} DH</strong> (Déduite du Solde)</p>
                <p>• Votre Gain Net Praticien (85%) : <strong>{(actTotalAmount * 0.85).toFixed(2)} DH</strong></p>
              </div>

              <div>
                <label className="block font-bold mb-1">Nom du Patient :</label>
                <input
                  type="text"
                  value={actPatientName}
                  onChange={(e) => setActPatientName(e.target.value)}
                  placeholder="Nom et Prénom du patient"
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Téléphone du Patient :</label>
                <input
                  type="text"
                  value={actPatientPhone}
                  onChange={(e) => setActPatientPhone(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActModal(false)}
                  className="flex-1 py-2.5 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAct}
                  className="flex-1 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow transition-colors"
                >
                  Valider & Déduire Commission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW & UPDATE DIPLOMA */}
      {showDiplomaModal && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-lg w-full p-6 text-[#2D4739] text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E0E5DD] pb-3">
              <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#588157]" />
                <span>Mon Diplôme & Attestation Professionnelle</span>
              </h3>
              <button onClick={() => setShowDiplomaModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-[#344E41]">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Display Current Diploma if available */}
            <div className="space-y-2">
              <p className="font-bold text-[#2D4739]">Nom du fichier actuel : {userDiplomaName}</p>

              {userDiplomaUrl ? (
                <div className="border border-[#E0E5DD] rounded-2xl p-2 bg-gray-50 max-h-[300px] overflow-auto flex justify-center items-center">
                  {userDiplomaUrl.startsWith('data:image') || userDiplomaUrl.startsWith('http') ? (
                    <img src={userDiplomaUrl} alt="Aperçu diplôme" className="max-h-[260px] object-contain rounded-xl" referrerPolicy="no-referrer" />
                  ) : (
                    <iframe src={userDiplomaUrl} className="w-full h-[250px] rounded-xl" title="Aperçu PDF" />
                  )}
                </div>
              ) : (
                <p className="text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Aucun aperçu direct n'est disponible pour ce fichier. Vous pouvez le remplacer ci-dessous.
                </p>
              )}
            </div>

            {/* Update Diploma Form */}
            <form onSubmit={handleSaveDiplomaUpdate} className="space-y-3 pt-2 border-t border-[#E0E5DD]">
              <label className="block font-bold text-[#2D4739]">Mettre à jour mon Diplôme (PDF ou Image) :</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleDiplomaUpload}
                className="w-full text-xs"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiplomaModal(false)}
                  className="flex-1 py-2.5 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Fermer
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingDiploma}
                  className="flex-1 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow transition-colors"
                >
                  {isUpdatingDiploma ? 'Enregistrement...' : 'Enregistrer le nouveau Diplôme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONSULTATION NOTE */}
      {showConsultNoteModal && selectedApptForNote && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-lg w-full p-6 text-[#2D4739] text-xs space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#588157]" />
              <span>Rédaction du Bilan Médical — {patientName}</span>
            </h3>

            <form onSubmit={handleSaveConsultNote} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Diagnostic Médical / Constat :</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ex: Diabète T2 contrôlé, Bilan d'hypertension..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-bold text-[#2D4739]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Résumé du Traitement Prescrit :</label>
                <textarea
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  rows={2}
                  placeholder="Expliquez la prise en charge et conseils hygiéno-diététiques..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div className="space-y-2 p-3 bg-[#E9EDC9]/30 rounded-2xl border border-[#A3B18A]/40">
                <span className="block font-bold text-[#2D4739]">Ordonnance Numérique :</span>
                <input
                  type="text"
                  value={rx1}
                  onChange={(e) => setRx1(e.target.value)}
                  placeholder="Ligne 1: Metformine 850mg - 1 cp matin et soir"
                  className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white"
                />
                <input
                  type="text"
                  value={rx2}
                  onChange={(e) => setRx2(e.target.value)}
                  placeholder="Ligne 2: Amlodipine 5mg - 1 cp le matin"
                  className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes de Laboratoire / Examens complémentaires :</label>
                <input
                  type="text"
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  placeholder="Bilan lipidique et HbA1c prescrits..."
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConsultNoteModal(false)}
                  className="flex-1 py-2.5 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow transition-colors"
                >
                  Valider & Transmettre au Carnet Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
