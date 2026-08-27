export type UserRole = 'guest' | 'pro' | 'admin';

export type ProSpecialtyCategory = 
  | 'Médecin Généraliste / Spécialiste'
  | 'Infirmier(e) Diplômé(e) d\'État'
  | 'Kinésithérapeute'
  | 'Aide-soignant(e)'
  | 'Ambulancier / Transporteur Médical'
  | 'Sage-femme / Soins de Maternité'
  | 'Autre Professionnel de Santé';

export interface UserAccount {
  id: string;
  username?: string;
  name: string;
  email: string;
  role: 'pro' | 'admin';
  proCategory: ProSpecialtyCategory;
  phone: string;
  whatsappPhone?: string;
  city: string; // e.g., Berkane
  address?: string;
  registrationNumber?: string; // Numéro d'ordre CNOM/IDE...
  skillsBio: string; // Description des compétences & parcours professionnel
  profilePictureUrl?: string; // Photo de profil
  diplomaFileName?: string; // Nom du diplôme téléchargé
  diplomaFileUrl?: string; // Content/URL du diplôme
  diplomaUploadedAt?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  balance?: number; // Solde actuel du professionnel (en DH)
  createdAt: string;
}

export type PaymentMethod = 'cashplus' | 'albaridbank' | 'attijariwafabank';

export interface DepositRequest {
  id: string;
  proId: string;
  proName: string;
  amount: number; // minimum 200 DH
  paymentMethod: PaymentMethod;
  bankAccountNumber: string;
  proofFileName: string;
  proofFileUrl: string; // PDF or Image base64 / URL
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  notes?: string;
}

export interface ExecutedAct {
  id: string;
  proId: string;
  proName: string;
  patientName: string;
  patientPhone?: string;
  actName: string;
  totalAmount: number; // Montant total payé par le patient (DH)
  commissionAmount: number; // 15% retenu
  proEarnings: number; // 85% pour le pro
  dateExecuted: string;
  notes?: string;
  createdAt: string;
}

export interface NurseCareLog {
  id: string;
  appointmentId: string;
  patientName: string;
  nurseName: string;
  date: string;
  time: string;
  careDetails: string; // Type de soin réalisé (pansement, perfusion, prise de sang...)
  vitalsObserved?: string; // PA, Glycémie, Température
  comments?: string;
}

export type ServiceCategory = 
  | 'consultation' 
  | 'infirmier' 
  | 'personnes_agees' 
  | 'patients_chroniques' 
  | 'kinesitherapie' 
  | 'teleconsultation'
  | 'transport_medical';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  image: string;
  priceMAD: number;
  cities: string[];
  isCertified: boolean;
  registrationNumber: string; // Numéro d'ordre des médecins
  bio: string;
  availableDays: string[];
  timeSlots: string[];
  languages: string[];
}

export interface CareService {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  image: string;
  features: string[];
  priceMAD: number;
  durationMinutes: number;
  popular?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  city: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'Confirmé' | 'En attente' | 'En cours' | 'Terminé' | 'Annulé';
  notes?: string;
  createdAt: string;
  isHomeVisit: boolean;
  urgentVisit?: boolean;
}

export interface VitalLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number; // mg/dL
  heartRate?: number; // bpm
  oxygenSaturation?: number; // %
  temperature?: number; // °C
  notes?: string;
}

export interface MedicalHistoryRecord {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  treatmentSummary: string;
  prescriptions: string[];
  labNotes?: string;
  recommendedFollowUp?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg", "1 comprimé"
  instructions: string; // e.g. "Après le repas"
  times: string[]; // e.g. ["08:00", "13:00", "20:00"]
  remainingPills: number;
  totalPills: number;
  color: string; // Tailwind hex or class name
  active: boolean;
  startDate: string;
  endDate?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  date: string;
  status: 'taken' | 'snoozed' | 'missed';
  actionTime?: string;
}

export interface CarePackage {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  priceMAD: number;
  billingPeriod: 'visite' | 'semaine' | 'mois';
  features: string[];
  popular?: boolean;
}
