import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar, MessageCircle, HeartHandshake, Stethoscope, ShieldCheck } from 'lucide-react';
import { SERVICES_DATA, CONTACT_INFO } from '../data/mockData';
import { CareService, ServiceCategory } from '../types';

interface ServicesViewProps {
  onOpenBookingModal: (doctorId?: string, serviceId?: string) => void;
  onOpenQuickContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onOpenBookingModal,
  onOpenQuickContact
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous les Soins' },
    { id: 'consultation', label: 'Consultations Médecin' },
    { id: 'infirmier', label: 'Soins Infirmiers' },
    { id: 'personnes_agees', label: 'Personnes Âgées' },
    { id: 'patients_chroniques', label: 'Patients Chroniques' },
    { id: 'kinesitherapie', label: 'Kinésithérapie' },
    { id: 'teleconsultation', label: 'Téléconsultation' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 border border-[#588157]/30 shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-3 py-1 rounded-full border border-[#A3B18A]">
          Catalogue de Soins à Domicile
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
          Soins Médicaux & Accompagnement à la Maison
        </h1>
        <p className="text-xs sm:text-sm text-[#DAD7CD] max-w-2xl mx-auto">
          Nos praticiens qualifiés se déplacent chez vous avec le matériel médical stérile nécessaire. Tarifs transparents, sans frais cachés.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#588157] text-white border-[#588157] shadow-md'
                : 'bg-white text-[#2D4739] border-[#E0E5DD] hover:bg-[#E9EDC9]/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-3xl border border-[#E0E5DD] shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-[#588157] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow">
                  {service.priceMAD} MAD
                </div>
                {service.popular && (
                  <div className="absolute top-3 left-3 bg-[#D4A373] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow">
                    ★ Populaire
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-[#2D4739] text-base mb-1">{service.title}</h3>
                  <p className="text-xs text-[#344E41]/80 leading-relaxed">{service.fullDescription}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#344E41]/70 bg-[#F9FAF8] p-2.5 rounded-xl border border-[#E0E5DD]">
                  <Clock className="w-4 h-4 text-[#588157] shrink-0" />
                  <span>Durée estimée : <strong className="text-[#2D4739]">{service.durationMinutes} minutes</strong></span>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-[#2D4739]">Inclus dans la prestation :</span>
                  <ul className="space-y-1.5 text-xs text-[#344E41]/80">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#588157] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <button
                onClick={() => onOpenBookingModal(undefined, service.id)}
                className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver ce soin à domicile</span>
              </button>

              <button
                onClick={onOpenQuickContact}
                className="w-full bg-[#F9FAF8] hover:bg-[#E9EDC9]/30 text-[#2D4739] border border-[#E0E5DD] font-semibold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#588157]" />
                <span>Renseignement / WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
