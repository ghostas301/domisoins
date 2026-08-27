import React, { useState, useEffect } from 'react';
import { Pill, Bell, Check, Clock, Volume2, VolumeX, AlertTriangle, X } from 'lucide-react';
import { Medication, MedicationLog } from '../types';

interface MedicationReminderBarProps {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onTakeMedication: (medicationId: string, scheduledTime: string) => void;
  onSnoozeMedication: (medicationId: string, scheduledTime: string) => void;
  onOpenMedicationManager: () => void;
}

export const MedicationReminderBar: React.FC<MedicationReminderBarProps> = ({
  medications,
  medicationLogs,
  onTakeMedication,
  onSnoozeMedication,
  onOpenMedicationManager
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [activeAlert, setActiveAlert] = useState<{ med: Medication; time: string } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      setCurrentTimeStr(timeString);

      // Check if any medication time matches current time and not taken yet today
      const todayStr = now.toISOString().split('T')[0];
      
      for (const med of medications) {
        if (!med.active) continue;
        for (const time of med.times) {
          if (time === timeString) {
            // Check if already logged today
            const alreadyLogged = medicationLogs.some(
              log => log.medicationId === med.id && log.date === todayStr && log.scheduledTime === time && log.status === 'taken'
            );
            if (!alreadyLogged && (!activeAlert || activeAlert.med.id !== med.id)) {
              setActiveAlert({ med, time });
              if (audioEnabled) {
                playChimeSound();
              }
            }
          }
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [medications, medicationLogs, activeAlert, audioEnabled]);

  // Audio synthesizer for alarm chime using Web Audio API
  const playChimeSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
      // Play a dual medical bell chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);
    } catch {
      // Audio autoplay may be muted by browser
    }
  };

  // Find next upcoming medication
  const getNextMedication = () => {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    let closest: { med: Medication; time: string; diff: number } | null = null;

    medications.forEach(med => {
      if (!med.active) return;
      med.times.forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const medMin = h * 60 + m;
        let diff = medMin - currentMin;
        if (diff < 0) diff += 1440; // Next day
        if (!closest || diff < closest.diff) {
          closest = { med, time, diff };
        }
      });
    });

    return closest;
  };

  const nextMed = getNextMedication();

  return (
    <>
      {/* Real-time Medication Alarm Popup Modal */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-[#344E41]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#588157] max-w-md w-full overflow-hidden p-6 text-center relative">
            <button 
              onClick={() => setActiveAlert(null)}
              className="absolute top-4 right-4 text-[#344E41]/50 hover:text-[#344E41] p-1 rounded-full hover:bg-[#F1F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-[#E9EDC9] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce border border-[#A3B18A]">
              <Pill className="w-8 h-8 text-[#344E41]" />
            </div>

            <span className="inline-block px-3 py-1 bg-[#E9EDC9] text-[#344E41] text-xs font-bold rounded-full mb-2">
              Rappel Médicament en Temps Réel • {activeAlert.time}
            </span>

            <h3 className="text-xl font-serif font-bold text-[#344E41] mb-1">
              {activeAlert.med.name}
            </h3>
            <p className="text-sm font-semibold text-[#588157] mb-2">
              Dosage : {activeAlert.med.dosage}
            </p>
            <p className="text-xs text-[#2D4739]/80 mb-6 italic bg-[#F1F3EE] p-2.5 rounded-2xl border border-[#E0E5DD]">
              "{activeAlert.med.instructions}"
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSnoozeMedication(activeAlert.med.id, activeAlert.time);
                  setActiveAlert(null);
                }}
                className="py-3 px-4 bg-[#F1F3EE] hover:bg-[#DAD7CD] text-[#344E41] font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-[#588157]" />
                <span>Rappeler (+10 min)</span>
              </button>

              <button
                onClick={() => {
                  onTakeMedication(activeAlert.med.id, activeAlert.time);
                  setActiveAlert(null);
                }}
                className="py-3 px-4 bg-[#588157] hover:bg-[#344E41] text-white font-bold text-xs rounded-full shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Marquer Pris</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bar Widget in Top App Body */}
      <div className="bg-[#2D4739] text-[#E0E5DD] border-b border-[#588157]/30 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#344E41] border border-[#588157]/40 px-3 py-1 rounded-full text-[#E9EDC9] font-semibold">
              <span className="w-2 h-2 bg-[#A3B18A] rounded-full animate-ping"></span>
              <Clock className="w-3.5 h-3.5 text-[#A3B18A]" />
              <span>{currentTimeStr || '10:00'}</span>
            </div>

            {nextMed ? (
              <div className="flex items-center gap-2 text-[#DAD7CD]">
                <Pill className="w-4 h-4 text-[#A3B18A]" />
                <span>
                  Prochain rappel : <strong className="text-white font-bold">{nextMed.med.name}</strong> à <span className="text-[#E9EDC9] font-bold">{nextMed.time}</span> ({nextMed.med.dosage})
                </span>
              </div>
            ) : (
              <span className="text-[#A3B18A]">Aucun rappel programmé aujourd'hui.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (!audioEnabled) playChimeSound();
              }}
              className="p-1.5 rounded-full bg-[#344E41] hover:bg-[#588157] text-[#DAD7CD] transition-colors"
              title={audioEnabled ? 'Sonnerie activée' : 'Sonnerie coupée'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-[#E9EDC9]" /> : <VolumeX className="w-4 h-4 text-[#A3B18A]" />}
            </button>

            <button
              onClick={() => {
                playChimeSound();
              }}
              className="px-2.5 py-1 bg-[#344E41] hover:bg-[#588157] text-[#E0E5DD] rounded-full text-[11px] font-medium border border-[#588157]/40"
            >
              Tester l'alarme
            </button>

            <button
              onClick={onOpenMedicationManager}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#344E41] text-white px-3 py-1 rounded-full font-bold transition-colors shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Pilulier & Alarmes</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
