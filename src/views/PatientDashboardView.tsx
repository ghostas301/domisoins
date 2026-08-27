import React, { useState } from 'react';
import { Appointment, VitalLog, MedicalHistoryRecord, Medication, MedicationLog, UserAccount } from '../types';
import { AppointmentsView } from './AppointmentsView';
import { ChronicCareView } from './ChronicCareView';
import { MedicationManagerView } from './MedicationManagerView';
import { ElderlyCareView } from './ElderlyCareView';
import { User, Calendar, Activity, Pill, HeartHandshake, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

interface PatientDashboardViewProps {
  currentUser: UserAccount | null;
  appointments: Appointment[];
  vitals: VitalLog[];
  medicalHistory: MedicalHistoryRecord[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onCancelAppointment: (id: string) => void;
  onOpenBookingModal: () => void;
  onOpenQuickContact: () => void;
  onAddVitalLog: (log: VitalLog) => void;
  onAddMedication: (med: Medication) => void;
  onTakeMedication: (id: string, time: string) => void;
  onSnoozeMedication: (id: string, time: string) => void;
  onDeleteMedication: (id: string) => void;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  currentUser,
  appointments,
  vitals,
  medicalHistory,
  medications,
  medicationLogs,
  onCancelAppointment,
  onOpenBookingModal,
  onOpenQuickContact,
  onAddVitalLog,
  onAddMedication,
  onTakeMedication,
  onSnoozeMedication,
  onDeleteMedication
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'vitals' | 'medications' | 'elderly'>('appointments');

  const patientName = currentUser?.name || 'Mohammed Malki';
  const patientEmail = currentUser?.email || 'patient@soindomicile.ma';
  const patientPhone = currentUser?.phone || '+212 728-338276';
  const patientAddress = currentUser?.address || 'Quartier Al Qods, Berkane';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Portal Header Banner */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-6 sm:p-8 border border-[#588157]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#588157] rounded-2xl flex items-center justify-center text-white border border-[#A3B18A]/30 shrink-0">
              <User className="w-8 h-8 text-[#E9EDC9]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-2.5 py-0.5 rounded-full border border-[#A3B18A]">
                Carnet de Santé & Espace Patient Personnel
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-white mt-1">
                Bienvenue, {patientName}
              </h1>
              <p className="text-xs text-[#DAD7CD] flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#A3B18A]" />
                <span>Adresse : <strong>{patientAddress} (Berkane)</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBookingModal}
              className="bg-[#588157] hover:bg-[#A3B18A] text-white hover:text-[#2D4739] text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Calendar className="w-4 h-4 text-[#E9EDC9]" />
              <span>Nouveau RDV à Domicile</span>
            </button>
          </div>
        </div>

        {/* Patient Sub Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#588157]/40 text-xs">
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'appointments'
                ? 'bg-[#E9EDC9] text-[#2D4739] shadow-sm'
                : 'bg-[#344E41] text-[#DAD7CD] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mes RDV & Demandes ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('vitals')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'vitals'
                ? 'bg-[#E9EDC9] text-[#2D4739] shadow-sm'
                : 'bg-[#344E41] text-[#DAD7CD] hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Suivi Constantes & Chroniques ({vitals.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('medications')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'medications'
                ? 'bg-[#E9EDC9] text-[#2D4739] shadow-sm'
                : 'bg-[#344E41] text-[#DAD7CD] hover:text-white'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Mes Médicaments ({medications.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('elderly')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'elderly'
                ? 'bg-[#E9EDC9] text-[#2D4739] shadow-sm'
                : 'bg-[#344E41] text-[#DAD7CD] hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Accompagnement Séniors</span>
          </button>
        </div>
      </div>

      {/* Active Sub View Content */}
      <div className="space-y-6">
        {activeSubTab === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            onCancelAppointment={onCancelAppointment}
            onOpenBookingModal={onOpenBookingModal}
          />
        )}

        {activeSubTab === 'vitals' && (
          <ChronicCareView
            vitals={vitals}
            medicalHistory={medicalHistory}
            onAddVitalLog={onAddVitalLog}
          />
        )}

        {activeSubTab === 'medications' && (
          <MedicationManagerView
            medications={medications}
            medicationLogs={medicationLogs}
            onAddMedication={onAddMedication}
            onTakeMedication={onTakeMedication}
            onSnoozeMedication={onSnoozeMedication}
            onDeleteMedication={onDeleteMedication}
          />
        )}

        {activeSubTab === 'elderly' && (
          <ElderlyCareView
            onOpenBookingModal={onOpenBookingModal}
            onOpenQuickContact={onOpenQuickContact}
          />
        )}
      </div>

    </div>
  );
};
