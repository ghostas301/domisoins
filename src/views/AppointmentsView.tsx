import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, MapPin, Phone, MessageCircle, AlertCircle, CheckCircle2, XCircle, Plus, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onOpenBookingModal: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onCancelAppointment,
  onOpenBookingModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2D4739] text-white rounded-3xl p-8 border border-[#588157]/30 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-3 py-1 rounded-full border border-[#A3B18A]">
            Gestion de vos Consultations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">Mes Rendez-vous à Domicile</h1>
          <p className="text-xs text-[#DAD7CD]">
            Suivez en temps réel le statut de vos interventions médicales et infirmières.
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="bg-[#588157] hover:bg-[#344E41] text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors shrink-0 border border-[#A3B18A]/30"
        >
          <Plus className="w-4 h-4 text-[#E9EDC9]" />
          <span>Nouveau Rendez-vous</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E0E5DD] pb-2 text-xs font-bold overflow-x-auto">
        {['all', 'Confirmé', 'En cours', 'Terminé', 'Annulé'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filterStatus === st
                ? 'bg-[#344E41] text-white'
                : 'text-[#2D4739] hover:bg-[#E9EDC9]/30'
            }`}
          >
            {st === 'all' ? 'Tous les Rendez-vous' : st}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E0E5DD] p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-[#A3B18A] mx-auto" />
          <h3 className="text-base font-serif font-bold text-[#2D4739]">Aucun rendez-vous trouvé</h3>
          <p className="text-xs text-[#344E41]/70 max-w-sm mx-auto">
            Vous n'avez pas d'intervention médicale enregistrée sous cette catégorie.
          </p>
          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2.5 bg-[#588157] text-white text-xs font-bold rounded-xl shadow hover:bg-[#344E41] transition-colors"
          >
            Prendre rendez-vous maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((appt) => (
            <div 
              key={appt.id}
              className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-[#E0E5DD] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#344E41]/60 uppercase tracking-wider block">
                      Référence RDV
                    </span>
                    <strong className="text-sm text-[#2D4739] font-extrabold">{appt.id}</strong>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    appt.status === 'Confirmé'
                      ? 'bg-[#E9EDC9] text-[#344E41]'
                      : appt.status === 'En cours'
                      ? 'bg-[#D4A373]/20 text-[#2D4739] animate-pulse'
                      : appt.status === 'Terminé'
                      ? 'bg-[#E0E5DD] text-[#344E41]'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {appt.status === 'Confirmé' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {appt.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={appt.doctorImage} 
                    alt={appt.doctorName} 
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E0E5DD]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-[#2D4739] text-sm">{appt.doctorName}</h3>
                    <p className="text-xs text-[#588157] font-semibold">{appt.serviceType}</p>
                    <p className="text-[11px] text-[#344E41]/70">{appt.doctorSpecialty}</p>
                  </div>
                </div>

                <div className="bg-[#F9FAF8] p-3.5 rounded-2xl border border-[#E0E5DD] text-xs space-y-1.5 text-[#2D4739]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#588157] shrink-0" />
                    <span>Date : <strong>{appt.date}</strong> à <strong className="text-[#588157]">{appt.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#588157] shrink-0" />
                    <span>Lieu : {appt.patientAddress}, <strong>{appt.city}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#588157] shrink-0" />
                    <span>Patient : {appt.patientName} ({appt.patientPhone})</span>
                  </div>
                  {appt.notes && (
                    <p className="text-[11px] text-[#344E41]/70 italic pt-1 border-t border-[#E0E5DD]">
                      Motif : "{appt.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E0E5DD] text-xs">
                <a
                  href={`https://wa.me/212728338276?text=Bonjour%2C%20je%20concerne%20mon%20rendez-vous%20${appt.id}%20du%20${appt.date}%20avec%20${encodeURIComponent(appt.doctorName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#588157]" />
                  <span>WhatsApp (+212 728-338276)</span>
                </a>

                {appt.status !== 'Annulé' && appt.status !== 'Terminé' && (
                  <button
                    onClick={() => onCancelAppointment(appt.id)}
                    className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors text-xs border border-rose-200"
                    title="Annuler le RDV"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
