import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Search, 
  MapPin, 
  MessageCircle,
  Mail,
  UserCheck,
  Truck
} from 'lucide-react';
import { DOCTORS_DATA, SERVICES_DATA, CARE_PACKAGES, CONTACT_INFO, APP_IMAGES } from '../data/mockData';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenBookingModal: (doctorId?: string, serviceId?: string) => void;
  onOpenQuickContact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenBookingModal,
  onOpenQuickContact
}) => {
  const [searchSpecialty, setSearchSpecialty] = useState('all');
  const [searchCity, setSearchCity] = useState('Rabat');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('doctors');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative bg-[#344E41] text-[#E0E5DD] overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-[#588157]/30 shadow-xl">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#588157]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A3B18A]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2D4739] border border-[#588157]/50 text-[#E9EDC9] text-xs font-bold px-4 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#A3B18A]" />
              <span>Service de Santé à Domicile — Uniquement à Berkane</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
              Vos Soins & Consultations <br />
              <span className="text-[#E9EDC9]">
                Médicales à Domicile à Berkane
              </span>
            </h1>

            <p className="text-[#DAD7CD] text-sm sm:text-base leading-relaxed max-w-xl">
              Interventions médicales et infirmières à domicile dans toute la ville de Berkane. Soins infirmiers, suivi des personnes âgées, téléconsultation et suivi personnalisé.
            </p>

            {/* Quick Search Widget */}
            <form onSubmit={handleSearchSubmit} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg space-y-3 sm:space-y-0 sm:flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#2D4739] px-3.5 py-2.5 rounded-full border border-[#588157]/40">
                <Stethoscope className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <select 
                  value={searchSpecialty}
                  onChange={(e) => setSearchSpecialty(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none w-full"
                >
                  <option value="all" className="bg-[#344E41] text-white">Tous les Soins à Domicile</option>
                  <option value="consultation" className="bg-[#344E41] text-white">Consultation Médicale à Domicile</option>
                  <option value="infirmier" className="bg-[#344E41] text-white">Soins Infirmiers & Pansements</option>
                  <option value="personnes_agees" className="bg-[#344E41] text-white">Garde-malade & Séniors</option>
                  <option value="patients_chroniques" className="bg-[#344E41] text-white">Suivi Diabète & HTA</option>
                  <option value="kinesitherapie" className="bg-[#344E41] text-white">Kinésithérapie à Domicile</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#2D4739] px-4 py-2.5 rounded-full border border-[#588157]/40 text-xs text-white font-bold whitespace-nowrap">
                <MapPin className="w-4 h-4 text-[#E9EDC9] shrink-0" />
                <span>Ville : <strong>Berkane</strong></span>
              </div>

              <button 
                type="submit"
                className="w-full sm:w-auto bg-[#588157] hover:bg-[#A3B18A] text-white hover:text-[#344E41] font-bold px-5 py-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Sélectionner un Soin</span>
              </button>
            </form>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenBookingModal()}
                className="bg-[#588157] hover:bg-[#2D4739] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-2 transition-all hover:scale-105 border border-[#A3B18A]/30"
              >
                <Calendar className="w-4 h-4 text-[#E9EDC9]" />
                <span>Demander un Soin / RDV à Domicile</span>
              </button>

              <button
                onClick={() => setActiveTab('transport')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shadow-md"
              >
                <Truck className="w-4 h-4 text-emerald-200" />
                <span>Transport Médicalisé & Ambulance</span>
              </button>

              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#2D4739] hover:bg-[#23382c] text-[#E9EDC9] border border-[#588157]/50 text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#A3B18A]" />
                <span>WhatsApp : {CONTACT_INFO.phoneDisplay}</span>
              </a>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#588157]/30 text-xs">
              <div>
                <p className="text-lg font-serif font-bold text-[#E9EDC9]">&lt; 45 min</p>
                <p className="text-[#A3B18A] text-[11px]">Temps moyen d'arrivée</p>
              </div>
              <div>
                <p className="text-lg font-serif font-bold text-[#E9EDC9]">24/7</p>
                <p className="text-[#A3B18A] text-[11px]">Disponibilité garantie</p>
              </div>
              <div>
                <p className="text-lg font-serif font-bold text-[#E9EDC9]">100%</p>
                <p className="text-[#A3B18A] text-[11px]">Médecins Certifiés CNOM</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#588157]/40 shadow-xl group">
              <img 
                src={APP_IMAGES.heroDoctor} 
                alt="Consultation médicale à domicile" 
                className="w-full h-[380px] lg:h-[440px] object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D4739] via-transparent to-transparent opacity-85"></div>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#344E41]/90 backdrop-blur-md p-4 rounded-2xl border border-[#588157]/40 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#E9EDC9] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#A3B18A]" /> Consultation à Domicile
                  </span>
                  <span className="text-[10px] bg-[#E9EDC9] text-[#344E41] font-bold px-2 py-0.5 rounded-full">
                    Visite Confirmée
                  </span>
                </div>
                <p className="text-xs font-medium text-[#DAD7CD]">
                  "Examen complet, auscultation, bilan de santé et délivrance d'ordonnance chez vous."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE SERVICES GRID WITH PHOTOGRAPHIC TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-3 py-1 rounded-full uppercase tracking-wider">
            Offre de Soins Complète
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#344E41]">
            Nos Services Médicaux & Infirmiers à Domicile
          </h2>
          <p className="text-xs sm:text-sm text-[#2D4739]/80">
            Des soins adaptés à chaque membre de la famille, assurés par des praticiens diplômés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.slice(0, 4).map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-3xl border border-[#E0E5DD] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#344E41] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-[#E0E5DD]">
                  {service.priceMAD} MAD
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#344E41] text-base group-hover:text-[#588157] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#2D4739]/70 line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <ul className="space-y-1.5 text-[11px] text-[#2D4739]/80 border-t border-[#E0E5DD] pt-3">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#588157] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onOpenBookingModal(undefined, service.id)}
                  className="w-full mt-2 bg-[#F1F3EE] hover:bg-[#588157] text-[#344E41] hover:text-white font-bold py-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all border border-[#E0E5DD]"
                >
                  <span>Réserver ce soin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveTab('services')}
            className="inline-flex items-center gap-2 bg-[#344E41] hover:bg-[#2D4739] text-white font-bold px-6 py-3 rounded-full text-xs shadow-sm transition-colors"
          >
            <span>Voir tous les services & tarifs</span>
            <ArrowRight className="w-4 h-4 text-[#E9EDC9]" />
          </button>
        </div>
      </section>

      {/* ELDERLY CARE SPOTLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#344E41] text-white rounded-3xl p-8 lg:p-12 border border-[#588157]/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-block px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full">
              👴 Prise en Charge des Personnes Âgées
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight text-white">
              Aide au Quotidien & Garde-Malade pour vos Aînés à Domicile
            </h2>

            <p className="text-[#DAD7CD] text-xs sm:text-sm leading-relaxed">
              Conservez l'autonomie de vos parents et grands-parents dans la dignité et le confort de leur foyer. Nos auxiliaires de vie et infirmiers assurent l'hygiène, le suivi strict des médicaments et les visites de santé régulières.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#E0E5DD]">
              <div className="flex items-center gap-2 bg-[#2D4739] p-3 rounded-2xl border border-[#588157]/40">
                <CheckCircle2 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Garde-malade 24/7 & Présence rassurante</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2D4739] p-3 rounded-2xl border border-[#588157]/40">
                <CheckCircle2 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Pilulier hebdomadaire & Rappels stricts</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2D4739] p-3 rounded-2xl border border-[#588157]/40">
                <CheckCircle2 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Kinésithérapie de la marche & mobilité</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2D4739] p-3 rounded-2xl border border-[#588157]/40">
                <CheckCircle2 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Rapports quotidiens envoyés à la famille</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('elderly')}
                className="bg-[#588157] hover:bg-[#2D4739] text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-colors flex items-center gap-2 border border-[#A3B18A]/30"
              >
                <HeartHandshake className="w-4 h-4 text-[#E9EDC9]" />
                <span>Découvrir les Formules Sénior</span>
              </button>

              <button
                onClick={onOpenQuickContact}
                className="bg-[#2D4739] hover:bg-[#23382c] text-white font-bold px-5 py-3 rounded-full text-xs border border-[#588157]/40 transition-colors"
              >
                Demander un Bilan Gratuit
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#588157]/40 shadow-xl">
              <img 
                src={APP_IMAGES.elderlyCare} 
                alt="Accompagnement personne âgée" 
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </section>

      {/* BERKANE SERVICE HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E5DD] pb-4">
          <div>
            <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-3 py-1 rounded-full uppercase tracking-wider">
              Qualité & Proximité à Berkane
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#344E41] mt-2">
              Pourquoi Choisir Notre Service de Soins à Domicile à Berkane ?
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('services')}
            className="text-xs font-bold text-[#588157] hover:text-[#344E41] flex items-center gap-1"
          >
            <span>Voir la liste des soins disponibles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-[#E9EDC9] text-[#588157] rounded-2xl flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#344E41] text-base">Couverture Intégrale de Berkane</h3>
            <p className="text-xs text-[#2D4739]/70 leading-relaxed">
              Déplacement rapide dans tous les quartiers de Berkane (Al Qods, Hay El Hassani, Bouhdila, Bayou, et environs).
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-[#E9EDC9] text-[#588157] rounded-2xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#344E41] text-base">Équipe Médicale Certifiée</h3>
            <p className="text-xs text-[#2D4739]/70 leading-relaxed">
              Professionnels diplômés respectant scrupuleusement les normes d'hygiène, de stérilité et de suivi médical rigoureux.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-[#E9EDC9] text-[#588157] rounded-2xl flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#344E41] text-base">Prise de RDV Simple & Rapide</h3>
            <p className="text-xs text-[#2D4739]/70 leading-relaxed">
              Sélectionnez votre soin en ligne ou contactez-nous directement via WhatsApp (+212 728-338276) pour une réponse immédiate.
            </p>
          </div>
        </div>
      </section>

      {/* CHRONIC CARE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D4739] text-white rounded-3xl p-8 lg:p-12 border border-[#588157]/40 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full">
              <Activity className="w-3.5 h-3.5 text-[#588157]" />
              <span>Carnet de Santé Numérique Sécurisé</span>
            </span>

            <h2 className="text-2xl font-serif font-bold text-white">
              Suivi Régulier des Patients Chroniques (Diabète, Hypertension, Cœur)
            </h2>

            <p className="text-xs sm:text-sm text-[#DAD7CD] leading-relaxed">
              Consignez et analysez vos constantes vitales (glycémie, tension artérielle, saturation O2, rythme cardiaque) en toute sécurité. Téléchargez et imprimez votre carnet médical pour le transmettre à votre médecin.
            </p>

            <button
              onClick={() => setActiveTab('chronic')}
              className="bg-[#588157] hover:bg-[#344E41] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-colors border border-[#A3B18A]/30"
            >
              Accéder au Carnet Médical
            </button>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 bg-[#344E41] rounded-3xl border border-[#588157]/40 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <Activity className="w-12 h-12 text-[#E9EDC9] animate-pulse" />
              <p className="text-xs font-serif font-bold text-white">Graphiques & Alertes</p>
              <p className="text-[10px] text-[#A3B18A]">Relevés enregistrés en temps réel avec export PDF</p>
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT & ASSISTANCE DIRECT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#588157] text-white rounded-3xl p-8 shadow-xl text-center space-y-4 border border-[#A3B18A]/30">
          <h3 className="text-2xl font-serif font-bold">Une Question ou une Urgence Relative ?</h3>
          <p className="text-[#E9EDC9] text-xs sm:text-sm max-w-xl mx-auto">
            Contactez directement notre équipe médicale au Maroc par WhatsApp ou par Email pour organiser votre consultation au plus vite.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-[#344E41] font-extrabold px-6 py-3 rounded-full text-xs shadow-md hover:bg-[#E9EDC9] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#588157]" />
              <span>WhatsApp : +212 728-338276</span>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="bg-[#344E41] hover:bg-[#2D4739] text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-colors flex items-center gap-2 border border-[#A3B18A]/30"
            >
              <Mail className="w-4 h-4 text-[#E9EDC9]" />
              <span>Email : malki.mohammed.inf@gmail.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
