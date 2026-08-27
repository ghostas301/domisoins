import React, { useState } from 'react';
import { X, Mail, MessageCircle, Phone, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickContactModal: React.FC<QuickContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Demande de consultation / Soins à domicile');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Nom: ${name}\nTéléphone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    window.location.href = mailtoUrl;
    setSentSuccess(true);
  };

  const handleWhatsApp = () => {
    const msg = `Bonjour SoinDomicile,\n\nNom: ${name || 'Patient'}\nTéléphone: ${phone || CONTACT_INFO.phoneDisplay}\nSujet: ${subject}\nMessage: ${message}`;
    window.open(`https://wa.me/212728338276?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#344E41] text-white p-5 flex justify-between items-center border-b border-[#588157]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#588157] rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm">Contact Direct & Demande de Soins</h3>
              <p className="text-[11px] text-[#E9EDC9]">Assistance Médicale Rapide 24h/24</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-[#DAD7CD] hover:text-white hover:bg-[#588157]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 text-xs text-[#2D4739] space-y-4">
          {sentSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-[#E9EDC9] text-[#588157] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-serif font-bold text-[#2D4739]">Message Préparé avec Succès !</h4>
              <p className="text-[#344E41]/80">
                Votre client de messagerie a été ouvert avec les coordonnées pré-remplies vers <strong className="text-[#2D4739]">{CONTACT_INFO.email}</strong>.
              </p>
              <button
                onClick={() => {
                  setSentSuccess(false);
                  onClose();
                }}
                className="px-5 py-2 bg-[#344E41] hover:bg-[#2D4739] text-white font-bold rounded-xl text-xs"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitEmail} className="space-y-3">
              <div className="p-3 bg-[#E9EDC9]/40 rounded-2xl border border-[#A3B18A]/40 text-[#2D4739] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#588157]" />
                  <span>Coordonnées Officielles du Service Médical</span>
                </p>
                <div className="text-[11px] text-[#344E41] space-y-0.5 pt-1">
                  <p>• <strong>WhatsApp Direct :</strong> +212 728-338276</p>
                  <p>• <strong>Email Officiel :</strong> malki.mohammed.inf@gmail.com</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Votre Nom & Prénom :</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mohammed Malki"
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white focus:ring-2 focus:ring-[#588157] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Téléphone :</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212728338276"
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white focus:ring-2 focus:ring-[#588157] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email :</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="malki.mohammed.inf@gmail.com"
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white focus:ring-2 focus:ring-[#588157] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Sujet de la demande :</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white focus:ring-2 focus:ring-[#588157] focus:outline-none"
                >
                  <option value="Demande de consultation / Soins à domicile">Consultation médicale à domicile</option>
                  <option value="Soins infirmiers / Prise de sang">Soins infirmiers & Prise de sang</option>
                  <option value="Prise en charge personne âgée">Prise en charge personne âgée</option>
                  <option value="Suivi patient chronique">Suivi patient chronique (Diabète / HTA)</option>
                  <option value="Kinésithérapie à domicile">Kinésithérapie à domicile</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Détails de votre demande :</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Expliquez brièvement votre besoin ou le problème de santé..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white focus:ring-2 focus:ring-[#588157] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#588157]" />
                  <span>WhatsApp (+212 728-338276)</span>
                </button>

                <button
                  type="submit"
                  className="w-full bg-[#344E41] hover:bg-[#2D4739] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors border border-[#588157]/30"
                >
                  <Send className="w-4 h-4 text-[#E9EDC9]" />
                  <span>Envoyer par Email</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
