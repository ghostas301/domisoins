import React, { useState } from 'react';
import { Medication, MedicationLog } from '../types';
import { Pill, Bell, Plus, Check, Clock, Volume2, ShieldCheck, CheckCircle2, Trash2 } from 'lucide-react';

interface MedicationManagerViewProps {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onAddMedication: (newMed: Medication) => void;
  onTakeMedication: (medicationId: string, scheduledTime: string) => void;
  onSnoozeMedication: (medicationId: string, scheduledTime: string) => void;
  onDeleteMedication: (id: string) => void;
}

export const MedicationManagerView: React.FC<MedicationManagerViewProps> = ({
  medications,
  medicationLogs,
  onAddMedication,
  onTakeMedication,
  onSnoozeMedication,
  onDeleteMedication
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // New Medication State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 comprimé');
  const [instructions, setInstructions] = useState('Pendant le repas');
  const [time1, setTime1] = useState('08:00');
  const [time2, setTime2] = useState('20:00');
  const [hasSecondTime, setHasSecondTime] = useState(true);
  const [totalPills, setTotalPills] = useState(30);

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const timesArray = [time1];
    if (hasSecondTime && time2) timesArray.push(time2);

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name,
      dosage,
      instructions,
      times: timesArray,
      remainingPills: totalPills,
      totalPills,
      color: '#0d9488',
      active: true,
      startDate: new Date().toISOString().split('T')[0]
    };

    onAddMedication(newMed);
    setShowAddForm(false);
    setName('');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 border border-[#588157]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full border border-[#A3B18A]">
              <Bell className="w-3.5 h-3.5 text-[#588157]" />
              <span>Système de Rappel en Temps Réel</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white mt-2">
              Pilulier Connecté & Alarmes de Médicaments
            </h1>
            <p className="text-xs sm:text-sm text-[#DAD7CD]">
              Recevez des alertes visuelles et sonores exactes à l'heure prescrite pour ne jamais rater un traitement.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#588157] hover:bg-[#344E41] text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-lg transition-colors shrink-0 border border-[#A3B18A]/30"
          >
            <Plus className="w-4 h-4 text-[#E9EDC9]" />
            <span>Ajouter un Médicament</span>
          </button>
        </div>
      </div>

      {/* MODAL ADD MEDICATION */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-[#2D4739]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E5DD] max-w-lg w-full p-6 text-[#2D4739] text-xs space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2D4739] flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#588157]" />
              <span>Ajouter un Traitement au Pilulier</span>
            </h3>

            <form onSubmit={handleCreateMedication} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nom du Médicament :</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Metformine 850mg, Amlodipine..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white font-semibold text-[#2D4739]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Dosage / Forme :</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="1 comprimé, 2 gélules..."
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nombre de pilules dans la boîte :</label>
                  <input
                    type="number"
                    value={totalPills}
                    onChange={(e) => setTotalPills(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Consignes de prise :</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Au cours du repas avec un verre d'eau..."
                  required
                  className="w-full p-2.5 border border-[#E0E5DD] rounded-xl bg-white"
                />
              </div>

              {/* Time slots */}
              <div className="space-y-2 p-3 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD]">
                <span className="block font-bold text-[#2D4739]">Horaires des alarmes :</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#344E41]/70">Heure 1 :</label>
                    <input
                      type="time"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      required
                      className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                    />
                  </div>

                  {hasSecondTime && (
                    <div>
                      <label className="text-[11px] text-[#344E41]/70">Heure 2 :</label>
                      <input
                        type="time"
                        value={time2}
                        onChange={(e) => setTime2(e.target.value)}
                        className="w-full p-2 border border-[#E0E5DD] rounded-xl bg-white font-bold"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSecondTime}
                    onChange={(e) => setHasSecondTime(e.target.checked)}
                    className="rounded text-[#588157]"
                  />
                  <span>Deuxième prise dans la journée</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-[#F9FAF8] text-[#344E41] font-bold rounded-xl border border-[#E0E5DD]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white font-bold rounded-xl shadow"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medications List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => (
          <div 
            key={med.id}
            className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#E9EDC9] flex items-center justify-center text-[#344E41]">
                    <Pill className="w-5 h-5 text-[#588157]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2D4739] text-base">{med.name}</h3>
                    <p className="text-xs text-[#588157] font-semibold">{med.dosage}</p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMedication(med.id)}
                  className="text-[#344E41]/50 hover:text-rose-600 p-1 rounded-lg transition-colors"
                  title="Supprimer du pilulier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#344E41]/80 italic bg-[#F9FAF8] p-2.5 rounded-xl border border-[#E0E5DD]">
                "{med.instructions}"
              </p>

              <div>
                <span className="block text-xs font-bold text-[#2D4739] mb-1.5">Alarmes quotidiennes :</span>
                <div className="flex flex-wrap gap-2">
                  {med.times.map((t) => {
                    const isTakenToday = medicationLogs.some(
                      log => log.medicationId === med.id && log.date === todayStr && log.scheduledTime === t && log.status === 'taken'
                    );

                    return (
                      <button
                        key={t}
                        onClick={() => !isTakenToday && onTakeMedication(med.id, t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isTakenToday
                            ? 'bg-[#E9EDC9] text-[#344E41] border border-[#A3B18A]'
                            : 'bg-[#D4A373]/20 text-[#2D4739] border border-[#D4A373]/40 hover:bg-[#D4A373]/30'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t}</span>
                        {isTakenToday ? <Check className="w-3.5 h-3.5 text-[#588157]" /> : <span className="text-[10px]">(A prendre)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#344E41]/70 pt-2 border-t border-[#E0E5DD]">
                <span>Stock restant :</span>
                <strong className="text-[#2D4739]">{med.remainingPills} / {med.totalPills} comprimés</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History Log */}
      <div className="bg-white rounded-3xl border border-[#E0E5DD] p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-[#2D4739] text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#588157]" />
          <span>Historique des Prises de Médicaments</span>
        </h3>

        {medicationLogs.length === 0 ? (
          <p className="text-xs text-[#344E41]/70 italic">Aucune prise enregistrée aujourd'hui.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {medicationLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-[#F9FAF8] rounded-xl border border-[#E0E5DD]">
                <div>
                  <strong className="text-[#2D4739]">{log.medicationName}</strong> ({log.dosage})
                  <span className="text-[#344E41]/70 ml-2">Prévu à {log.scheduledTime}</span>
                </div>
                <span className="bg-[#E9EDC9] text-[#344E41] font-bold px-2.5 py-1 rounded-full text-[10px]">
                  ✓ Pris à {log.actionTime}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
