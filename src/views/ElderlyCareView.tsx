import React, { useState } from 'react';
import { CARE_PACKAGES, CONTACT_INFO, APP_IMAGES } from '../data/mockData';
import { HeartHandshake, CheckCircle2, ShieldCheck, Phone, MessageCircle, Mail, Calendar, UserCheck, Heart } from 'lucide-react';

interface ElderlyCareViewProps {
  onOpenBookingModal: () => void;
  onOpenQuickContact: () => void;
}

export const ElderlyCareView: React.FC<ElderlyCareViewProps> = ({
  onOpenBookingModal,
  onOpenQuickContact
}) => {
  const [selectedPack, setSelectedPack] = useState(CARE_PACKAGES[0].id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 lg:p-12 border border-[#588157]/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-block px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full border border-[#A3B18A]">
            👴 Accompagnement & Soins aux Séniors
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold leading-tight text-white">
            Prise en Charge Bienveillante des Personnes Âgées à Domicile
          </h1>
          <p className="text-xs sm:text-sm text-[#DAD7CD] leading-relaxed">
            Offrez à vos aînés une assistance médicale et humaine complète : hygiène, garde-malade, suivi des traitements, kinésithérapie et visites médicales gériatriques régulières.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenBookingModal}
              className="bg-[#588157] hover:bg-[#344E41] text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-lg transition-colors flex items-center gap-2 border border-[#A3B18A]/30"
            >
              <Calendar className="w-4 h-4 text-[#E9EDC9]" />
              <span>Demander une Visite d'Évaluation</span>
            </button>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#E9EDC9]" />
              <span>WhatsApp : {CONTACT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#588157]/40 shadow-2xl">
            <img 
              src={APP_IMAGES.elderlyCare} 
              alt="Personne âgée prise en charge à domicile" 
              className="w-full h-80 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-serif font-extrabold text-[#2D4739]">Formules & Abonnements Sur-Mesure</h2>
          <p className="text-xs text-[#344E41]/70">Choisissez la formule adaptée aux besoins d'autonomie et de santé de vos proches.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARE_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-3xl border p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden ${
                pkg.popular ? 'border-2 border-[#588157] ring-4 ring-[#588157]/10' : 'border-[#E0E5DD]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[#588157] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow">
                  Recommandé par les familles
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#344E41] bg-[#E9EDC9] px-2.5 py-1 rounded-full">
                    {pkg.targetAudience}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2D4739] mt-2">{pkg.title}</h3>
                  <p className="text-xs text-[#344E41]/70 leading-relaxed">{pkg.subtitle}</p>
                </div>

                <div className="bg-[#F9FAF8] p-4 rounded-2xl border border-[#E0E5DD]">
                  <span className="text-2xl font-extrabold text-[#2D4739]">{pkg.priceMAD} MAD</span>
                  <span className="text-xs text-[#344E41]/70 font-medium"> / {pkg.billingPeriod}</span>
                </div>

                <ul className="space-y-2 text-xs text-[#344E41]">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#588157] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenQuickContact}
                className="w-full bg-[#344E41] hover:bg-[#2D4739] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Heart className="w-4 h-4 text-[#E9EDC9] fill-[#E9EDC9]" />
                <span>Souscrire pour un parent</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
