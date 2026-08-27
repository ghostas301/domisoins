import React, { useState } from 'react';
import { UserAccount, ProSpecialtyCategory } from '../types';
import { LogIn, UserPlus, ShieldCheck, Stethoscope, Syringe, Lock, Mail, MapPin, X, Upload, CheckCircle2, Phone, MessageCircle, FileText, User, Activity } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSpaceName?: string;
  onLoginSuccess: (user: UserAccount) => void;
  registeredPros: UserAccount[];
}

export const DEFAULT_PRO_ACCOUNTS: UserAccount[] = [];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetSpaceName,
  onLoginSuccess,
  registeredPros
}) => {
  const [activePortal, setActivePortal] = useState<'pro' | 'admin'>('pro');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+212 7XX-XXXXXX');
  const [whatsappPhone, setWhatsappPhone] = useState('212728338276');
  const [city, setCity] = useState('Berkane');
  const [proCategory, setProCategory] = useState<ProSpecialtyCategory>('Médecin Généraliste / Spécialiste');
  const [skillsBio, setSkillsBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [diplomaFileName, setDiplomaFileName] = useState<string>('');
  
  const [diplomaFileUrl, setDiplomaFileUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDiplomaFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDiplomaFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePictureUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (activePortal === 'admin') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.message || 'Identifiants Admin incorrects. Identifiant: admin | Mot de passe: malki115');
        }
        return;
      }

      // Pro Portal
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.message || 'Email ou mot de passe incorrect.');
        }
      } else {
        // Register Mode for Professional
        if (!fullName || !email || !password || !phone) {
          setErrorMsg('Veuillez remplir tous les champs obligatoires (*).');
          setIsSubmitting(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: email.trim(),
            username: email.trim().split('@')[0],
            password,
            proCategory,
            phone,
            whatsappPhone: whatsappPhone.replace(/[^0-9]/g, '') || '212728338276',
            city,
            skillsBio,
            profilePictureUrl,
            diplomaFileName: diplomaFileName || `Diplome_${fullName.replace(/\s+/g, '_')}.pdf`,
            diplomaFileUrl
          })
        });

        const data = await res.json();
        if (data.success && data.user) {
          setSuccessMsg("Inscription enregistrée avec succès dans la base de données ! Votre profil et diplôme sont soumis à l'Administration pour validation.");
          setTimeout(() => {
            onLoginSuccess(data.user);
            onClose();
          }, 1500);
        } else {
          setErrorMsg(data.message || 'Erreur lors de l’inscription.');
        }
      }
    } catch (err: any) {
      setErrorMsg('Erreur de communication avec la base de données: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D4739]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="bg-[#2D4739] text-white p-6 relative border-b border-[#588157]/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#DAD7CD] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9EDC9] bg-[#344E41] px-2.5 py-0.5 rounded-full border border-[#588157]/40">
              📍 Berkane • Réseau Médical Certifié
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#E9EDC9]" />
            <span>
              {activePortal === 'admin' ? 'Espace Administration DomiSoins' : 'Espace Professionnel de Santé'}
            </span>
          </h3>

          <p className="text-xs text-[#DAD7CD] mt-1">
            {activePortal === 'admin' 
              ? 'Validation des diplômes et modération des professionnels de santé.' 
              : mode === 'login' 
              ? 'Accédez à votre espace pro (Médecins, Infirmiers, Kinés, Ambulanciers...)' 
              : 'Rejoignez le réseau des soignants certifiés à Berkane'}
          </p>
        </div>

        {/* Portal Switch Tabs (Pro vs Admin) */}
        <div className="p-3 bg-[#F9FAF8] border-b border-[#E0E5DD] flex justify-center gap-2">
          <button
            type="button"
            onClick={() => { setActivePortal('pro'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activePortal === 'pro'
                ? 'bg-[#344E41] text-white shadow-sm'
                : 'bg-white text-[#344E41] border border-[#E0E5DD] hover:bg-[#E0E5DD]/50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Professionnel de Santé</span>
          </button>

          <button
            type="button"
            onClick={() => { setActivePortal('admin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activePortal === 'admin'
                ? 'bg-[#2D4739] text-[#E9EDC9] shadow-sm border border-[#588157]'
                : 'bg-white text-[#344E41] border border-[#E0E5DD] hover:bg-[#E0E5DD]/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#588157]" />
            <span>Administration Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs text-[#2D4739]">

          {activePortal === 'pro' && (
            <div className="flex justify-center gap-6 text-xs font-bold border-b border-[#E0E5DD] pb-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`pb-1 transition-all ${
                  mode === 'login'
                    ? 'border-b-2 border-[#588157] text-[#2D4739]'
                    : 'text-[#344E41]/50 hover:text-[#344E41]'
                }`}
              >
                Se Connecter
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`pb-1 transition-all ${
                  mode === 'register'
                    ? 'border-b-2 border-[#588157] text-[#2D4739]'
                    : 'text-[#344E41]/50 hover:text-[#344E41]'
                }`}
              >
                S'Inscrire comme Soignant
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {activePortal === 'pro' && mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#2D4739] mb-1">
                    Profil / Fonction Médicale * :
                  </label>
                  <select
                    value={proCategory}
                    onChange={(e) => setProCategory(e.target.value as ProSpecialtyCategory)}
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-bold text-[#2D4739] focus:ring-2 focus:ring-[#588157]"
                  >
                    <option value="Médecin Généraliste / Spécialiste">Médecin Généraliste / Spécialiste</option>
                    <option value="Infirmier(e) Diplômé(e) d'État">Infirmier(e) Diplômé(e) d'État</option>
                    <option value="Kinésithérapeute">Kinésithérapeute</option>
                    <option value="Aide-soignant(e)">Aide-soignant(e) / Garde-malade</option>
                    <option value="Ambulancier / Transporteur Médical">Ambulancier / Transporteur Médical</option>
                    <option value="Sage-femme / Soins de Maternité">Sage-femme / Soins de Maternité</option>
                    <option value="Autre Professionnel de Santé">Autre Professionnel de Santé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4739] mb-1">
                    Nom Complet & Titre * :
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Dr. Ahmed Alami / Amina Tazi, IDE"
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#588157]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2D4739] mb-1">
                {activePortal === 'admin' ? "Nom d'utilisateur / Email Admin * :" : "Adresse Email Professionnelle * :"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A3B18A] absolute left-3 top-3" />
                <input
                  type={activePortal === 'admin' ? "text" : "email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activePortal === 'admin' ? "admin" : "professionnel@soindomicile.ma"}
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-[#E0E5DD] rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#588157]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D4739] mb-1">
                Mot de Passe * :
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A3B18A] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-[#E0E5DD] rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#588157]"
                />
              </div>
            </div>

            {activePortal === 'pro' && mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2D4739] mb-1">
                      Téléphone Appel * :
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 661-000000"
                      required
                      className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D4739] mb-1">
                      WhatsApp (Validation) * :
                    </label>
                    <input
                      type="tel"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="212728338276"
                      required
                      className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4739] mb-1">
                    Ville d'Exercice :
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Berkane"
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4739] mb-1">
                    Présentation des Compétences & Parcours * :
                  </label>
                  <textarea
                    value={skillsBio}
                    onChange={(e) => setSkillsBio(e.target.value)}
                    rows={3}
                    placeholder="Résumez votre expérience, spécialités, diplômes et domaine d'intervention à Berkane..."
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white text-xs"
                  />
                </div>

                {/* Direct File Upload for Profile Photo */}
                <div className="p-3 bg-[#F9FAF8] border border-[#E0E5DD] rounded-2xl space-y-2">
                  <label className="block font-bold text-[#2D4739] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#588157]" />
                      <span>Photo de Profil (Téléchargement Direct) :</span>
                    </span>
                    {photoFileName && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Photo chargée
                      </span>
                    )}
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-[#344E41] hover:bg-[#588157] text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>Choisir une photo</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>

                    <span className="text-xs text-[#344E41]/70 truncate max-w-[200px]">
                      {photoFileName || 'Aucune photo sélectionnée (.jpg, .png)'}
                    </span>
                  </div>
                  {profilePictureUrl && (
                    <div className="mt-1 flex items-center gap-2">
                      <img src={profilePictureUrl} alt="Aperçu" className="w-9 h-9 rounded-full object-cover border border-[#588157]" />
                      <span className="text-[11px] text-emerald-700 font-semibold">Photo prête</span>
                    </div>
                  )}
                </div>

                {/* File Upload for Diploma */}
                <div className="p-3 bg-[#F9FAF8] border border-[#E0E5DD] rounded-2xl space-y-2">
                  <label className="block font-bold text-[#2D4739] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#588157]" />
                      <span>Télécharger Diplôme / Attestation Pro * :</span>
                    </span>
                    {diplomaFileName && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Fichier Reçu
                      </span>
                    )}
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-[#344E41] hover:bg-[#588157] text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>Choisir un fichier</span>
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <span className="text-xs text-[#344E41]/70 truncate max-w-[200px]">
                      {diplomaFileName || 'Aucun fichier sélectionné (Ex: Diplome.pdf)'}
                    </span>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-[#344E41] hover:bg-[#588157] text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-xs"
            >
              {activePortal === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#E9EDC9]" />
                  <span>Connexion Administration</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Accéder à l'Espace Professionnel</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Envoyer mon Dossier pour Validation</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
