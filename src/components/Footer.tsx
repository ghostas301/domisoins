import React from 'react';
import { Phone, Mail, MessageCircle, ShieldCheck, Heart, MapPin, Clock, Stethoscope } from 'lucide-react';
import { CONTACT_INFO, APP_IMAGES } from '../data/mockData';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenBookingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBookingModal }) => {
  return (
    <footer className="bg-[#344E41] text-[#E0E5DD] pt-12 pb-8 border-t border-[#588157]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#588157] rounded-xl flex items-center justify-center text-white border border-[#A3B18A]/30">
                <img 
                  src={APP_IMAGES.logo} 
                  alt="DomiSoins Logo" 
                  className="w-10 h-10 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-white tracking-tight">DomiSoins<span className="text-[#E9EDC9]">.ma</span></span>
                <p className="text-xs text-[#A3B18A]">Soins & Consultations à Domicile</p>
              </div>
            </div>
            <p className="text-xs text-[#DAD7CD] leading-relaxed">
              Plateforme médicale certifiée dédiée aux consultations à domicile, soins infirmiers, suivi des personnes âgées et patients chroniques au Maroc.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E9EDC9] bg-[#2D4739] p-2.5 rounded-2xl border border-[#588157]/40">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#A3B18A]" />
              <span>Praticiens certifiés inscrits au Conseil National de l’Ordre des Médecins.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#A3B18A]" />
              <span>Nos Services</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DAD7CD]">
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[#E9EDC9] transition-colors">
                  Consultation Médicale à Domicile
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[#E9EDC9] transition-colors">
                  Soins Infirmiers & Prises de Sang
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('elderly')} className="hover:text-[#E9EDC9] transition-colors">
                  Prise en Charge des Personnes Âgées
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chronic')} className="hover:text-[#E9EDC9] transition-colors">
                  Suivi des Patients Chroniques & Carnet
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('medications')} className="hover:text-[#E9EDC9] transition-colors">
                  Rappels Médicaments en Temps Réel
                </button>
              </li>
            </ul>
          </div>

          {/* Cities & Operating Hours */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A3B18A]" />
              <span>Zones de Couverture</span>
            </h4>
            <p className="text-xs text-[#DAD7CD] mb-3">
              Interventions rapides à domicile sur :
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-white mb-4">
              {['Rabat', 'Casablanca', 'Salé', 'Témara', 'Marrakech', 'Agadir', 'Fès', 'Tangier', 'Oujda'].map((city) => (
                <span key={city} className="bg-[#2D4739] px-2.5 py-1 rounded-full border border-[#588157]/40">
                  {city}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#E9EDC9]">
              <Clock className="w-4 h-4 text-[#A3B18A] shrink-0" />
              <span>Disponibilité : 24h/24 & 7j/7</span>
            </div>
          </div>

          {/* Contact Direct Column */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm mb-4">Contact Direct</h4>
            <div className="space-y-3 text-xs">
              <a 
                href={CONTACT_INFO.whatsappUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2.5 bg-[#588157] hover:bg-[#486847] text-white p-2.5 rounded-full font-medium transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#E9EDC9]" />
                <span>WhatsApp : {CONTACT_INFO.phoneDisplay}</span>
              </a>

              <a 
                href={`mailto:${CONTACT_INFO.email}`} 
                className="flex items-center gap-2.5 bg-[#2D4739] hover:bg-[#23382c] text-white p-2.5 rounded-full transition-colors border border-[#588157]/40"
              >
                <Mail className="w-4 h-4 text-[#A3B18A]" />
                <span className="truncate">{CONTACT_INFO.email}</span>
              </a>

              <a 
                href={`tel:${CONTACT_INFO.phone}`} 
                className="flex items-center gap-2.5 bg-[#2D4739] hover:bg-[#23382c] text-white p-2.5 rounded-full transition-colors border border-[#588157]/40"
              >
                <Phone className="w-4 h-4 text-[#A3B18A]" />
                <span>Téléphone : {CONTACT_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#588157]/30 text-xs text-[#A3B18A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 DomiSoins.ma - Tous droits réservés.</p>
          <div className="flex items-center gap-1 text-[#DAD7CD]">
            <span>Conçu avec attention pour la santé des familles au Maroc</span>
            <Heart className="w-3.5 h-3.5 text-[#D4A373] fill-[#D4A373]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
