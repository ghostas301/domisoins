import React, { useState } from 'react';
import { DOCTORS_DATA, CONTACT_INFO } from '../data/mockData';
import { Doctor } from '../types';
import { ShieldCheck, Star, MapPin, Calendar, Clock, MessageCircle, Search, UserCheck } from 'lucide-react';

interface DoctorsViewProps {
  onOpenBookingModal: (doctorId?: string) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ onOpenBookingModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredDoctors = DOCTORS_DATA.filter((doc) => {
    const matchesTerm = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || doc.cities.includes(selectedCity);

    return matchesTerm && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 border border-[#588157]/30 shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-3 py-1 rounded-full border border-[#A3B18A]">
          Annuaire Praticiens Certifiés
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
          Nos Médecins & Infirmiers Diplômés d'État
        </h1>
        <p className="text-xs sm:text-sm text-[#DAD7CD] max-w-2xl mx-auto">
          Inscrits au Conseil National de l’Ordre des Médecins, nos professionnels se déplacent chez vous avec empathie et rigueur médicale.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#E0E5DD] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#F9FAF8] px-3 py-2.5 rounded-xl border border-[#E0E5DD]">
          <Search className="w-4 h-4 text-[#344E41]/50 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom (ex: Dr Bennani) ou spécialité..."
            className="w-full bg-transparent text-xs text-[#2D4739] focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#F9FAF8] px-3 py-2.5 rounded-xl border border-[#E0E5DD] sm:w-64">
          <MapPin className="w-4 h-4 text-[#588157] shrink-0" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-transparent text-xs text-[#2D4739] font-semibold focus:outline-none"
          >
            <option value="all">Toutes les villes</option>
            <option value="Rabat">Rabat</option>
            <option value="Casablanca">Casablanca</option>
            <option value="Salé">Salé</option>
            <option value="Témara">Témara</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Agadir">Agadir</option>
            <option value="Fès">Fès</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-md hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-start justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#588157]/40"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#588157] text-white p-1 rounded-full shadow" title="Certifié par l'Ordre">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-[#2D4739] text-base">{doc.name}</h3>
                    <span className="text-[10px] bg-[#E9EDC9] text-[#344E41] font-bold px-2 py-0.5 rounded">
                      Certifié CNOM
                    </span>
                  </div>
                  <p className="text-xs text-[#588157] font-semibold">{doc.title}</p>
                  <p className="text-[11px] text-[#344E41]/70">N° Inscription : {doc.registrationNumber}</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-[#D4A373] font-bold bg-[#D4A373]/10 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                    {doc.rating} ({doc.reviewCount})
                  </span>
                  <span className="text-[#344E41]/70 font-medium">
                    Expérience : {doc.experienceYears} ans
                  </span>
                </div>

                <p className="text-xs text-[#344E41]/80 leading-relaxed line-clamp-2 italic">
                  "{doc.bio}"
                </p>

                <div className="text-xs text-[#344E41]/80 space-y-0.5 pt-1">
                  <p>• <strong>Villes couvertes :</strong> {doc.cities.join(', ')}</p>
                  <p>• <strong>Langues :</strong> {doc.languages.join(', ')}</p>
                  <p>• <strong>Tarif visite :</strong> <strong className="text-[#2D4739]">{doc.priceMAD} MAD</strong></p>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="w-full sm:w-48 shrink-0 space-y-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#E0E5DD] sm:pl-6 flex flex-col justify-between h-full">
              <div>
                <span className="block text-[11px] font-bold text-[#344E41]/70 mb-1.5">Prochains créneaux :</span>
                <div className="flex flex-wrap gap-1">
                  {doc.timeSlots.slice(0, 3).map((slot) => (
                    <span key={slot} className="text-[10px] bg-[#F9FAF8] text-[#2D4739] font-bold px-2 py-1 rounded-md border border-[#E0E5DD]">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onOpenBookingModal(doc.id)}
                  className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prendre RDV</span>
                </button>

                <a
                  href={`https://wa.me/212728338276?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous%20avec%20${encodeURIComponent(doc.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#F9FAF8] hover:bg-[#E9EDC9]/30 text-[#2D4739] font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors border border-[#E0E5DD]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#588157]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
