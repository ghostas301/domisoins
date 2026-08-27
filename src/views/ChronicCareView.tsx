import React, { useState } from 'react';
import { VitalLog, MedicalHistoryRecord } from '../types';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Plus, 
  FileText, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Stethoscope,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import { CONTACT_INFO, APP_IMAGES } from '../data/mockData';

interface ChronicCareViewProps {
  vitals: VitalLog[];
  medicalHistory: MedicalHistoryRecord[];
  onAddVitalLog: (newVital: VitalLog) => void;
}

export const ChronicCareView: React.FC<ChronicCareViewProps> = ({
  vitals,
  medicalHistory,
  onAddVitalLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'history' | 'report'>('vitals');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Vital Form State
  const [sysBP, setSysBP] = useState<number>(120);
  const [diaBP, setDiaBP] = useState<number>(80);
  const [sugar, setSugar] = useState<number>(110);
  const [pulse, setPulse] = useState<number>(72);
  const [spo2, setSpo2] = useState<number>(98);
  const [temp, setTemp] = useState<number>(36.6);
  const [notes, setNotes] = useState('');

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const log: VitalLog = {
      id: `v-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      bloodPressureSystolic: Number(sysBP),
      bloodPressureDiastolic: Number(diaBP),
      bloodSugar: Number(sugar),
      heartRate: Number(pulse),
      oxygenSaturation: Number(spo2),
      temperature: Number(temp),
      notes
    };
    onAddVitalLog(log);
    setShowAddModal(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Header */}
      <div className="bg-[#2D4739] text-white rounded-3xl p-8 border border-[#588157]/30 shadow-xl space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full border border-[#A3B18A]">
              <Activity className="w-3.5 h-3.5 text-[#588157]" />
              <span>Suivi Médical Sécurisé & Confidentialité</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white mt-2">
              Suivi des Patients Chroniques & Carnet de Santé
            </h1>
            <p className="text-xs sm:text-sm text-[#DAD7CD]">
              Journalisation en temps réel du diabète, de l'hypertension et des constantes respiratoires.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#588157] hover:bg-[#344E41] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-colors border border-[#A3B18A]/30"
            >
              <Plus className="w-4 h-4 text-[#E9EDC9]" />
              <span>Saisir Mes Constantes</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#588157]/30 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('vitals')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'vitals'
                ? 'bg-[#588157] text-white shadow-md'
                : 'text-[#DAD7CD] hover:text-white'
            }`}
          >
            Constantes Vitales ({vitals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#588157] text-white shadow-md'
                : 'text-[#DAD7CD] hover:text-white'
            }`}
          >
            Historique & Consultations ({medicalHistory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'report'
                ? 'bg-[#588157] text-white shadow-md'
                : 'text-[#DAD7CD] hover:text-white'
            }`}
          >
            🖨️ Bilan Médical Imprimable
          </button>
        </div>
      </div>

      {/* MODAL ADD VITAL LOG */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 text-slate-800 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Enregistrer une Mesure de Santé</span>
            </h3>

            <form onSubmit={handleSaveVital} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tension Systolique (mmHg) :</label>
                  <input
                    type="number"
                    value={sysBP}
                    onChange={(e) => setSysBP(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tension Diastolique (mmHg) :</label>
                  <input
                    type="number"
                    value={diaBP}
                    onChange={(e) => setDiaBP(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Glycémie (mg/dL) :</label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rythme Cardiaque (bpm) :</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Saturation Oxygène SpO2 (%) :</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Température (°C) :</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Contexte :</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: A jeun, avant le petit déjeuner..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: VITALS DASHBOARD */}
      {activeSubTab === 'vitals' && (
        <div className="space-y-6">
          {/* Latest Overview Cards */}
          {vitals.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs">
                  <span>Pression Artérielle</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {vitals[0].bloodPressureSystolic}/{vitals[0].bloodPressureDiastolic} <span className="text-xs font-medium text-slate-400">mmHg</span>
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Dans la norme
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs">
                  <span>Glycémie</span>
                  <Droplet className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {vitals[0].bloodSugar} <span className="text-xs font-medium text-slate-400">mg/dL</span>
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Équilibré
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs">
                  <span>Fréquence Cardiaque</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {vitals[0].heartRate} <span className="text-xs font-medium text-slate-400">bpm</span>
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Rythme Régulier
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs">
                  <span>Saturation SpO2</span>
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {vitals[0].oxygenSaturation}%
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Oxygénation Excellente
                </span>
              </div>
            </div>
          )}

          {/* Table of Relevés */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Journal des Constantes Récentes</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                + Ajouter une mesure
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Date & Heure</th>
                    <th className="p-4">Tension (mmHg)</th>
                    <th className="p-4">Glycémie (mg/dL)</th>
                    <th className="p-4">Pouls (bpm)</th>
                    <th className="p-4">SpO2 (%)</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {vitals.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{v.date} à {v.time}</td>
                      <td className="p-4 text-emerald-700 font-bold">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</td>
                      <td className="p-4 font-bold">{v.bloodSugar}</td>
                      <td className="p-4">{v.heartRate}</td>
                      <td className="p-4 text-cyan-700 font-bold">{v.oxygenSaturation}%</td>
                      <td className="p-4 text-slate-500 italic">{v.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MEDICAL HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          {medicalHistory.map((rec) => (
            <div key={rec.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {rec.specialty}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{rec.diagnosis}</h3>
                  <p className="text-xs text-slate-500">Par {rec.doctorName} • Le {rec.date}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <strong className="block text-slate-900 mb-0.5">Résumé du Traitement :</strong>
                  <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100">{rec.treatmentSummary}</p>
                </div>

                <div>
                  <strong className="block text-slate-900 mb-0.5">Ordonnance Médicamenteuse :</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    {rec.prescriptions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {rec.labNotes && (
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Résultats de Laboratoire / Examens :</strong>
                    <p className="text-slate-600">{rec.labNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: PRINTABLE MEDICAL SUMMARY REPORT */}
      {activeSubTab === 'report' && (
        <div className="bg-white rounded-3xl border border-slate-300 p-8 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Printable Header */}
          <div className="flex justify-between items-center border-b-2 border-emerald-600 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src={APP_IMAGES.logo} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl object-cover" 
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">SoinDomicile.ma</h2>
                <p className="text-xs text-slate-500">Bilan Médical & Carnet de Santé Patient</p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <p><strong>Date d'Émission :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
              <p><strong>Contact Service :</strong> {CONTACT_INFO.phoneDisplay}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p><strong>Patient :</strong> Mohammed Malki</p>
              <p><strong>Téléphone :</strong> {CONTACT_INFO.phoneDisplay}</p>
            </div>
            <div>
              <p><strong>Email :</strong> {CONTACT_INFO.email}</p>
              <p><strong>Pathologies Suivies :</strong> Diabète T2, Hypertension Artérielle</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">Dernières Constantes Enregistrées</h3>
            {vitals.length > 0 && (
              <div className="grid grid-cols-4 gap-2 text-xs text-center">
                <div className="bg-slate-100 p-2 rounded-xl">
                  <span className="block text-slate-500">Tension</span>
                  <strong className="text-slate-900">{vitals[0].bloodPressureSystolic}/{vitals[0].bloodPressureDiastolic} mmHg</strong>
                </div>
                <div className="bg-slate-100 p-2 rounded-xl">
                  <span className="block text-slate-500">Glycémie</span>
                  <strong className="text-slate-900">{vitals[0].bloodSugar} mg/dL</strong>
                </div>
                <div className="bg-slate-100 p-2 rounded-xl">
                  <span className="block text-slate-500">Rythme</span>
                  <strong className="text-slate-900">{vitals[0].heartRate} bpm</strong>
                </div>
                <div className="bg-slate-100 p-2 rounded-xl">
                  <span className="block text-slate-500">SpO2</span>
                  <strong className="text-slate-900">{vitals[0].oxygenSaturation}%</strong>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">Dernières Directives Médicales</h3>
            <p className="text-slate-700">
              Traitement bien toléré. Recommandation de poursuite du suivi hebdomadaire de la glycémie à jeun et visites infirmières régulières.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p>Cachet et Signature du Praticien Coordinateur :</p>
              <div className="h-16 w-48 border border-dashed border-slate-300 rounded-xl mt-2 flex items-center justify-center text-slate-400">
                [Signature Numérique Certifiée]
              </div>
            </div>

            <button
              onClick={handlePrintReport}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow flex items-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimer ce Rapport PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
