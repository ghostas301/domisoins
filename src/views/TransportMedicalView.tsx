import React from 'react';
import { Truck, ShieldCheck, Clock, Phone, MessageCircle, CheckCircle2, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface TransportMedicalViewProps {
  onOpenBookingModal: (doctorId?: string, serviceId?: string) => void;
}

export const TransportMedicalView: React.FC<TransportMedicalViewProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 lg:p-12 border border-[#588157]/30 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold rounded-full">
            <Truck className="w-4 h-4 text-emerald-300" />
            <span>Transport Sanitaire Sécurisé — Berkane & Région</span>
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white leading-tight">
            Transport Médicalisé & Ambulance à Domicile
          </h1>

          <p className="text-xs sm:text-sm text-[#DAD7CD] leading-relaxed">
            Transferts d'urgence ou soins programmés (hémodialyse, radiologie, consultations spécialisées, entrées/sorties d'hôpital) en ambulance médicalisée équipée avec accompagnement infirmier diplômé.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenBookingModal(undefined, 'transport_medical')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-200" />
              <span>Réserver une Ambulance / Transport</span>
            </button>

            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="bg-[#344E41] hover:bg-[#2D4739] text-white font-bold px-5 py-3 rounded-full text-xs border border-[#588157]/40 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#E9EDC9]" />
              <span>Appel Direct : {CONTACT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Ambulance Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E0E5DD] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-[#2D4739] text-base">Ambulance Équipée HD</h3>
          <p className="text-xs text-[#344E41]/70 leading-relaxed">
            Brancard ergonomique, obus d'oxygène médical, matériel de réanimation d'urgence et moniteur de surveillance des constantes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E0E5DD] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-[#2D4739] text-base">Accompagnement Soignant</h3>
          <p className="text-xs text-[#344E41]/70 leading-relaxed">
            Présence obligatoire d'un infirmier ou secouriste qualifié pour surveiller le patient tout au long du trajet.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E0E5DD] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-[#2D4739] text-base">Interventions 24/7 & Dialyse</h3>
          <p className="text-xs text-[#344E41]/70 leading-relaxed">
            Transports réguliers programmés pour les séances de dialyse, chimiothérapie, radiologie et transferts inter-hôpitaux.
          </p>
        </div>
      </div>

      {/* Services Transports Section */}
      <div className="bg-white rounded-3xl border border-[#E0E5DD] p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-[#2D4739]">
            Cas de Transports Sanitaires Pris en Charge à Berkane
          </h2>
          <p className="text-xs text-[#344E41]/70">
            Une prise en charge humaine et sécurisée pour les patients allongés, semi-assis ou en fauteuil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] space-y-1">
            <h4 className="font-bold text-[#2D4739] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transferts Vers Hôpitaux & Cliniques</span>
            </h4>
            <p className="text-[#344E41]/70">Transport depuis votre domicile à Berkane vers les centres hospitaliers d'Oujda, Nador ou Casablanca.</p>
          </div>

          <div className="p-4 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] space-y-1">
            <h4 className="font-bold text-[#2D4739] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Séances Régulières de Hémodialyse</span>
            </h4>
            <p className="text-[#344E41]/70">Navette sanitaire avec horaires fixes assurant l'aller-retour domicile-centre de dialyse.</p>
          </div>

          <div className="p-4 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] space-y-1">
            <h4 className="font-bold text-[#2D4739] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consultations & Examens IRM / Scannographique</span>
            </h4>
            <p className="text-[#344E41]/70">Brancardage attentif et aide au transfert du lit jusqu'à la salle d'examen.</p>
          </div>

          <div className="p-4 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] space-y-1">
            <h4 className="font-bold text-[#2D4739] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Retour à Domicile Post-Hospitalisation</span>
            </h4>
            <p className="text-[#344E41]/70">Accompagnement personnalisé pour réinstaller le patient confortablement dans son lit.</p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => onOpenBookingModal(undefined, 'transport_medical')}
            className="bg-[#588157] hover:bg-[#344E41] text-white font-bold py-3 px-8 rounded-full text-xs shadow-md transition-colors"
          >
            Réserver un Transport Médicalisé
          </button>
        </div>
      </div>

    </div>
  );
};
