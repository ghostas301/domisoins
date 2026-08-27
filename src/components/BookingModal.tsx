import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Doctor, CareService, Appointment } from '../types';
import { DOCTORS_DATA, SERVICES_DATA, CONTACT_INFO } from '../data/mockData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedServiceId?: string;
  onBookingComplete: (newAppt: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  onBookingComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || SERVICES_DATA[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-28');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00');
  const [isHomeVisit, setIsHomeVisit] = useState<boolean>(true);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  // Patient Info
  const [patientName, setPatientName] = useState('Mohammed Malki');
  const [patientPhone, setPatientPhone] = useState('+212728338276');
  const [patientEmail, setPatientEmail] = useState('malki.mohammed.inf@gmail.com');
  const [city, setCity] = useState('Berkane');
  const [patientAddress, setPatientAddress] = useState('Quartier Al Qods, Berkane');
  const [medicalNotes, setMedicalNotes] = useState('');

  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const currentService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      // Finalize booking
      const newAppt: Appointment = {
        id: `RDV-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorId: 'soindomicile-berkane',
        doctorName: 'Équipe Médicale SoinDomicile Berkane',
        doctorSpecialty: 'Soins Médicaux & Infirmiers à Domicile',
        doctorImage: currentService.image,
        patientName,
        patientPhone,
        patientEmail,
        patientAddress: isHomeVisit ? patientAddress : 'Téléconsultation en ligne',
        city: 'Berkane',
        serviceType: currentService.title,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'Confirmé',
        notes: medicalNotes,
        createdAt: new Date().toISOString().split('T')[0],
        isHomeVisit,
        urgentVisit: isUrgent
      };

      setConfirmedAppt(newAppt);
      onBookingComplete(newAppt);
      setStep(4);
    }
  };

  const handleWhatsAppNotify = () => {
    if (!confirmedAppt) return;
    const msg = `Bonjour SoinDomicile Berkane! Je viens de réserver un RDV en ligne (Réf: ${confirmedAppt.id}) pour ${confirmedAppt.serviceType} le ${confirmedAppt.date} à ${confirmedAppt.timeSlot}. Adresse à Berkane: ${confirmedAppt.patientAddress}.`;
    window.open(`https://wa.me/212728338276?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const availableTimeSlots = ['08:30', '10:00', '11:30', '14:00', '16:00', '18:00', '20:00'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Wizard Bar */}
        <div className="bg-[#344E41] text-white p-5 flex justify-between items-center relative border-b border-[#588157]/30">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E9EDC9]">
              Réservation en Ligne — Berkane Uniquement
            </span>
            <h3 className="text-lg font-serif font-bold">
              {step === 1 && '1. Choix du Service de Soin'}
              {step === 2 && '2. Date & Créneau Horaire'}
              {step === 3 && '3. Coordonnées & Adresse à Berkane'}
              {step === 4 && '4. Confirmation du Rendez-vous'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#DAD7CD] hover:text-white hover:bg-[#588157]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicator */}
        <div className="bg-[#F9FAF8] px-6 py-3 border-b border-[#E0E5DD] flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Date/Heure' },
            { num: 3, label: 'Adresse (Berkane)' },
            { num: 4, label: 'Confirmation' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === s.num
                  ? 'bg-[#588157] text-white shadow-xs'
                  : step > s.num
                  ? 'bg-[#E9EDC9] text-[#344E41]'
                  : 'bg-[#E0E5DD] text-[#2D4739]/60'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span className={`font-semibold hidden sm:inline ${
                step === s.num ? 'text-[#344E41]' : 'text-[#2D4739]/60'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Body Wizard Content */}
        <div className="p-6 text-slate-700 text-xs sm:text-sm space-y-5 max-h-[70vh] overflow-y-auto">

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-[#E9EDC9]/50 border border-[#A3B18A]/50 p-3 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-[#2D4739] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#588157]" />
                  <span>Ville couverte : <strong>Berkane (100% à domicile)</strong></span>
                </span>
                <span className="bg-[#588157] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Exclusivité Berkane
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4739] mb-3">
                  Sélectionnez le Soin Médical ou Infirmier à Domicile :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES_DATA.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        selectedServiceId === srv.id
                          ? 'border-[#588157] bg-[#E9EDC9]/30 shadow-xs ring-2 ring-[#588157]/20'
                          : 'border-[#E0E5DD] bg-white hover:border-[#A3B18A]'
                      }`}
                    >
                      <img 
                        src={srv.image} 
                        alt={srv.title} 
                        className="w-14 h-14 rounded-xl object-cover shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-[#2D4739] text-xs mb-0.5">{srv.title}</h4>
                        <p className="text-[11px] text-[#344E41]/70 line-clamp-2">{srv.shortDescription}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] font-extrabold text-[#588157]">
                            {srv.priceMAD} MAD
                          </span>
                          <span className="text-[10px] text-[#344E41]/60">
                            ⏱ {srv.durationMinutes} min
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-[#E9EDC9]/40 border border-[#A3B18A]/40 rounded-2xl p-4 flex items-center gap-3">
                <img 
                  src={currentService.image} 
                  alt={currentService.title} 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-[#588157]" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#588157] bg-[#E9EDC9] px-2 py-0.5 rounded-md">
                    Soin sélectionné
                  </span>
                  <h4 className="font-bold text-[#2D4739] text-sm mt-0.5">{currentService.title}</h4>
                  <p className="text-[11px] text-[#344E41]/80">
                    Tarif : <strong className="text-[#2D4739]">{currentService.priceMAD} MAD</strong> • Intervention à Berkane
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4739] mb-2">
                  Sélectionnez la Date d'intervention à Berkane :
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E0E5DD] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#588157] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4739] mb-2">
                  Choisissez un Créneau Horaire Souhaité :
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedTimeSlot === slot
                          ? 'bg-[#588157] text-white border-[#588157] shadow-md'
                          : 'bg-white text-[#2D4739] border-[#E0E5DD] hover:bg-[#F9FAF8]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Type Toggle */}
              <div className="p-3.5 bg-[#F9FAF8] rounded-2xl border border-[#E0E5DD] space-y-2">
                <span className="block font-bold text-[#2D4739] text-xs">Modalité d'intervention :</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsHomeVisit(true)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isHomeVisit
                        ? 'bg-[#588157] text-white border-[#588157]'
                        : 'bg-white text-[#344E41] border-[#E0E5DD]'
                    }`}
                  >
                    🏠 Déplacement à Domicile (Berkane)
                  </button>
                  <button
                    onClick={() => setIsHomeVisit(false)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !isHomeVisit
                        ? 'bg-[#344E41] text-white border-[#344E41]'
                        : 'bg-white text-[#344E41] border-[#E0E5DD]'
                    }`}
                  >
                    💻 Téléconsultation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D4739] mb-1">Nom Complet du Patient :</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#588157]"
                    placeholder="Nom et Prénom"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D4739] mb-1">Téléphone Portable :</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                    className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#588157]"
                    placeholder="+212 6XX-XXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D4739] mb-1">Adresse Email :</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    required
                    className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#588157]"
                    placeholder="exemple@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D4739] mb-1">Ville d'intervention :</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-[#F9FAF8] border border-[#E0E5DD] rounded-xl text-xs font-bold text-[#2D4739] focus:ring-2 focus:ring-[#588157]"
                  >
                    <option value="Berkane">Ville de Berkane (Exclusivement)</option>
                  </select>
                </div>
              </div>

              {isHomeVisit && (
                <div>
                  <label className="block text-xs font-semibold text-[#2D4739] mb-1">Adresse exacte du domicile à Berkane :</label>
                  <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    required
                    className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#588157]"
                    placeholder="Quartier, Boulevard, N° de maison..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2D4739] mb-1">Motif de soin / Informations complémentaires :</label>
                <textarea
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#588157]"
                  placeholder="Infections, bilan d'hypertension, pansement, perfusion..."
                />
              </div>

              {/* Emergency Urgent Visit Toggle */}
              <label className="flex items-center gap-2.5 p-3 bg-[#D4A373]/10 border border-[#D4A373]/40 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-[#D4A373] rounded border-[#D4A373]/40 focus:ring-[#D4A373]"
                />
                <span className="text-xs text-[#2D4739] font-semibold">
                  ⚡ Demande urgente à Berkane (Rappel prioritaire sous 15 min)
                </span>
              </label>
            </div>
          )}

          {/* STEP 4: Confirmation Success */}
          {step === 4 && confirmedAppt && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-[#E9EDC9] rounded-full flex items-center justify-center mx-auto text-[#588157] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block bg-[#E9EDC9] text-[#344E41] text-xs font-bold px-3 py-1 rounded-full mb-1">
                  Référence : {confirmedAppt.id}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2D4739]">
                  Demande de Soin Enregistrée !
                </h3>
                <p className="text-xs text-[#344E41]/70 mt-1">
                  Un SMS et un email de confirmation ont été envoyés à <strong className="text-[#2D4739]">{confirmedAppt.patientEmail}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F9FAF8] border border-[#E0E5DD] rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#E0E5DD] pb-2">
                  <span className="text-[#344E41]/70">Service réservé :</span>
                  <strong className="text-[#2D4739]">{confirmedAppt.serviceType}</strong>
                </div>
                <div className="flex justify-between border-b border-[#E0E5DD] pb-2">
                  <span className="text-[#344E41]/70">Date & Heure :</span>
                  <strong className="text-[#588157]">{confirmedAppt.date} à {confirmedAppt.timeSlot}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E41]/70">Adresse à Berkane :</span>
                  <strong className="text-[#2D4739]">{confirmedAppt.patientAddress}, Berkane</strong>
                </div>
              </div>

              {/* Direct WhatsApp Confirmation Button */}
              <button
                onClick={handleWhatsAppNotify}
                className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#588157]" />
                <span>Confirmer sur WhatsApp (+212 728-338276)</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation Actions */}
        {step < 4 && (
          <div className="bg-[#F9FAF8] px-6 py-4 border-t border-[#E0E5DD] flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="px-4 py-2 bg-white border border-[#E0E5DD] rounded-xl text-xs font-semibold text-[#2D4739] hover:bg-[#E9EDC9]/20 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#588157] hover:bg-[#344E41] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <span>{step === 3 ? 'Valider la Demande de Soin' : 'Continuer'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
