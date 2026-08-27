import React, { useState } from 'react';
import { Appointment, VitalLog, NurseCareLog } from '../types';
import { Syringe, Calendar, Clock, MapPin, CheckCircle2, UserCheck, Plus, FileText, Activity, HeartHandshake, ShieldCheck, AlertCircle } from 'lucide-react';

interface NurseDashboardViewProps {
  appointments: Appointment[];
  vitals: VitalLog[];
  onAddVitalLog: (log: VitalLog) => void;
  onUpdateApptStatus: (id: string, status: 'Confirmé' | 'En cours' | 'Terminé' | 'Annulé') => void;
  nurseName?: string;
  registrationNumber?: string;
}

export const NurseDashboardView: React.FC<NurseDashboardViewProps> = ({
  appointments,
  vitals,
  onAddVitalLog,
  onUpdateApptStatus,
  nurseName = 'Karim Ziani, IDE',
  registrationNumber = 'Ordre-IDE-8821 (Berkane)'
}) => {
  const [showNurseNoteModal, setShowNurseNoteModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  // Nursing Care Note Modal Form
  const [careType, setCareType] = useState('Soin d\'hygiène & Pansement de plaie');
  const [systolic, setSystolic] = useState<number | ''>(120);
  const [diastolic, setDiastolic] = useState<number | ''>(80);
  const [glycemia, setGlycemia] = useState<number | ''>(1.10);
  const [pulse, setPulse] = useState<number | ''>(72);
  const [nurseObservations, setNurseObservations] = useState('');

  // Filter appointments for Nursing Care or all home visits
  const nurseAppointments = appointments.filter(appt => {
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    const matchesDistrict = !searchDistrict || appt.patientAddress.toLowerCase().includes(searchDistrict.toLowerCase()) || appt.city.toLowerCase().includes(searchDistrict.toLowerCase());
    return matchesStatus && matchesDistrict;
  });

  const handleOpenCareModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setCareType(appt.serviceType);
    setShowNurseNoteModal(true);
  };

  const handleSaveNurseCare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    // Create vital log if recorded
    if (systolic && diastolic) {
      const vitalLog: VitalLog = {
        id: `vital-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bloodPressureSystolic: Number(systolic),
        bloodPressureDiastolic: Number(diastolic),
        bloodSugar: glycemia ? Number(glycemia) * 100 : undefined,
        heartRate: pulse ? Number(pulse) : undefined,
        notes: `Relevé par Infirmière (${nurseName}) lors de l'intervention : ${careType}`
      };
      onAddVitalLog(vitalLog);
    }

    onUpdateApptStatus(selectedAppt.id, 'Terminé');
    setShowNurseNoteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Nurse Badge */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-6 sm:p-8 border border-[#588157]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#588157] rounded-2xl flex items-center justify-center text-white border border-[#A3B18A]/30 shrink-0">
              <Syringe className="w-8 h-8 text-[#E9EDC9]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#344E41] bg-[#E9EDC9] px-2.5 py-0.5 rounded-full border border-[#A3B18A]">
                Espace Pro Infirmier(e) Certifié(e)
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-white mt-1">
                Tableau de Bord des Soins Infirmiers à Domicile
              </h1>
              <p className="text-xs text-[#DAD7CD]">
                Gestion des tourniquets d'interventions, pansements, perfusions et bilan de constantes à Berkane.
              </p>
            </div>
          </div>

          <div className="bg-[#344E41] p-3 rounded-2xl border border-[#588157]/40 text-xs text-[#DAD7CD]">
            <p className="font-semibold text-white">{nurseName}</p>
            <p className="text-[11px] text-[#A3B18A]">{registrationNumber}</p>
            <span className="text-[#E9EDC9] font-bold block mt-1">● Tournée active (Berkane)</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E9EDC9]/60 flex items-center justify-center text-[#588157]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">
              {appointments.filter(a => a.status === 'Confirmé' || a.status === 'En attente').length}
            </span>
            <p className="text-xs text-[#344E41]/70">Soins à Réaliser Aujourd'hui</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#588157]/10 flex items-center justify-center text-[#588157]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">
              {appointments.filter(a => a.status === 'Terminé').length}
            </span>
            <p className="text-xs text-[#344E41]/70">Interventions Validées</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E0E5DD] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/20 flex items-center justify-center text-[#2D4739]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#2D4739]">Berkane</span>
            <p className="text-xs text-[#344E41]/70">Zone de Déplacement Exclusive</p>
          </div>
        </div>
      </div>

      {/* Tournée Infirmière Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E0E5DD] pb-3">
          <h2 className="text-lg font-serif font-bold text-[#2D4739] flex items-center gap-2">
            <Syringe className="w-5 h-5 text-[#588157]" />
            <span>Tournée des Soins Infirmiers à Domicile ({nurseAppointments.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#344E41] text-white'
                  : 'bg-white text-[#344E41] border border-[#E0E5DD]'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('En attente')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                statusFilter === 'En attente'
                  ? 'bg-[#344E41] text-white'
                  : 'bg-white text-[#344E41] border border-[#E0E5DD]'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter('Confirmé')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                statusFilter === 'Confirmé'
                  ? 'bg-[#344E41] text-white'
                  : 'bg-white text-[#344E41] border border-[#E0E5DD]'
              }`}
            >
              Confirmés
            </button>
            <button
              onClick={() => setStatusFilter('Terminé')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                statusFilter === 'Terminé'
                  ? 'bg-[#344E41] text-white'
                  : 'bg-white text-[#344E41] border border-[#E0E5DD]'
              }`}
            >
              Terminés
            </button>
          </div>
        </div>

        {nurseAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E0E5DD] p-8 text-center text-xs text-[#344E41]/70">
            Aucun soin infirmier ne correspond au filtre sélectionné.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nurseAppointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-3xl border border-[#E0E5DD] p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start border-b border-[#E0E5DD] pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#344E41]/60 uppercase">Réf : {appt.id}</span>
                      <h3 className="font-serif font-bold text-[#2D4739] text-base">{appt.patientName}</h3>
                      <p className="text-xs text-[#344E41]/70">Tél : {appt.patientPhone}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      appt.status === 'Confirmé'
                        ? 'bg-[#E9EDC9] text-[#344E41]'
                        : appt.status === 'Terminé'
                        ? 'bg-[#E0E5DD] text-[#344E41]'
                        : 'bg-[#D4A373]/20 text-[#2D4739]'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#2D4739] space-y-1 bg-[#F9FAF8] p-3 rounded-2xl border border-[#E0E5DD]">
                    <p>• <strong>Soin :</strong> {appt.serviceType}</p>
                    <p>• <strong>Horaire :</strong> {appt.date} à {appt.timeSlot}</p>
                    <p className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#588157] shrink-0 mt-0.5" />
                      <span><strong>Adresse :</strong> {appt.patientAddress}, Berkane</span>
                    </p>
                    {appt.notes && (
                      <p className="text-[11px] text-[#588157] italic">Note patient : "{appt.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E0E5DD]">
                  {appt.status !== 'Terminé' && (
                    <button
                      onClick={() => handleOpenCareModal(appt)}
                      className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors text-xs"
                    >
                      <FileText className="w-4 h-4 text-[#E9EDC9]" />
                      <span>Rédiger Fiche de Soin & Validé</span>
                    </button>
                  )}

                  {appt.status === 'En attente' && (
                    <button
                      onClick={() => onUpdateApptStatus(appt.id, 'Confirmé')}
                      className="w-full py-2 bg-[#E9EDC9] text-[#344E41] font-bold rounded-xl hover:bg-[#A3B18A]/40 transition-colors text-xs"
                    >
                      Accepter le Soin à Domicile
                    </button>
                  )}

                  {appt.status === 'Terminé' && (
                    <div className="text-center text-[11px] font-bold text-[#588157] flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Soin Effectué & Transmis au Dossier</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL NURSE CARE NOTE */}
      {showNurseNoteModal && selectedAppt && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-lg w-full p-6 text-[#2D4739] text-xs space-y-4 my-auto">
            <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2 border-b border-[#E0E5DD] pb-3">
              <Syringe className="w-5 h-5 text-[#588157]" />
              <span>Validation du Soin Infirmier — {selectedAppt.patientName}</span>
            </h3>

            <form onSubmit={handleSaveNurseCare} className="space-y-4">
              <div>
                <label className="block font-bold text-[#2D4739] mb-1">Type de Soin / Acte Infirmier Réalisé :</label>
                <input
                  type="text"
                  value={careType}
                  onChange={(e) => setCareType(e.target.value)}
                  placeholder="Ex: Pansement stérile, Perfusion IV, Prélèvement sanguin..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-bold text-[#2D4739]"
                />
              </div>

              {/* Vitals Recording Section */}
              <div className="space-y-2 p-3.5 bg-[#E9EDC9]/30 rounded-2xl border border-[#A3B18A]/40">
                <span className="block font-bold text-[#2D4739] flex items-center gap-1">
                  <Activity className="w-4 h-4 text-[#588157]" />
                  <span>Constantes Vitales Relevées (Carnet Patient) :</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-[#344E41]/70">Systolique (mmHg)</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value ? Number(e.target.value) : '')}
                      placeholder="120"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#344E41]/70">Diastolique (mmHg)</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value ? Number(e.target.value) : '')}
                      placeholder="80"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#344E41]/70">Glycémie (g/L)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={glycemia}
                      onChange={(e) => setGlycemia(e.target.value ? Number(e.target.value) : '')}
                      placeholder="1.10"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#344E41]/70">Pouls (bpm)</label>
                    <input
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : '')}
                      placeholder="72"
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D4739] mb-1">Observations & Transmission au Dossier :</label>
                <textarea
                  value={nurseObservations}
                  onChange={(e) => setNurseObservations(e.target.value)}
                  rows={3}
                  placeholder="État de la plaie, bonne tolérance de la perfusion, conseils donnés au patient..."
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNurseNoteModal(false)}
                  className="flex-1 py-2.5 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Valider & Transmettre au Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
