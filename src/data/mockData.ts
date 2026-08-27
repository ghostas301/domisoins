import { Doctor, CareService, CarePackage, VitalLog, MedicalHistoryRecord, Medication, Appointment, UserAccount } from '../types';

// Image references generated specifically for this application
import appLogoImg from '../assets/images/app_logo_1785142375531.jpg';
import heroDoctorImg from '../assets/images/hero_doctor_home_1785142386478.jpg';
import elderlyCareImg from '../assets/images/elderly_care_1785142398871.jpg';
import chronicCareImg from '../assets/images/chronic_care_1785142410371.jpg';
import nursingCareImg from '../assets/images/nursing_care_1785142422644.jpg';

export const APP_IMAGES = {
  logo: appLogoImg,
  heroDoctor: heroDoctorImg,
  elderlyCare: elderlyCareImg,
  chronicCare: chronicCareImg,
  nursingCare: nursingCareImg,
  teleconsultation: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  kinesitherapie: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
};

export const CONTACT_INFO = {
  phone: '+212728338276',
  phoneDisplay: '+212 728-338276',
  whatsappUrl: 'https://wa.me/212728338276?text=Bonjour%2C%20je%20souhaite%20réserver%20un%20soin%20à%20domicile%20à%20Berkane.',
  email: 'malki.mohammed.inf@gmail.com',
  address: 'Berkane, Maroc (Disponibilité Exclusive)',
  workingHours: '24/7 - Prise en charge 7j/7 à Berkane',
  emergencyPhone: '15 / +212 728-338276'
};

export const SERVICES_DATA: CareService[] = [
  {
    id: 'consultation_domicile',
    title: 'Consultation Médicale à Domicile',
    category: 'consultation',
    shortDescription: 'Un médecin généraliste ou spécialiste certifié se déplace à votre domicile en 45 min.',
    fullDescription: 'Examen clinique complet, diagnostic immédiat, ordonnance sécurisée et bilan de santé dans le confort de votre maison. Adapté aux urgences non vitales, personnes à mobilité réduite et familles.',
    image: heroDoctorImg,
    features: [
      'Médecin généraliste ou spécialiste qualifié',
      'Déplacement à domicile avec équipement de diagnostic',
      'Délivrance d’ordonnance médicale sur place',
      'Rapport médical transmis dans l’application',
      'Suivi téléphonique post-consultation'
    ],
    priceMAD: 350,
    durationMinutes: 45,
    popular: true
  },
  {
    id: 'soins_infirmiers',
    title: 'Soins Infirmiers à Domicile',
    category: 'infirmier',
    shortDescription: 'Injections, pansements complexes, perfusions, prises de sang et soins post-opératoires.',
    fullDescription: 'Intervention d’infirmiers diplômés d’État pour l’exécution de soins prescrits ou d’hygiène générale. Respect strict des normes d’asepsie et de sécurité sanitaire.',
    image: nursingCareImg,
    features: [
      'Prélèvements sanguins & examens de laboratoire à domicile',
      'Injections (IV, IM, SC) et perfusions surveillées',
      'Pansements chirurgicaux et escarres',
      'Pose et surveillance de sondes',
      'Soins d’hygiène et confort'
    ],
    priceMAD: 150,
    durationMinutes: 30,
    popular: true
  },
  {
    id: 'personnes_agees',
    title: 'Prise en Charge des Personnes Âgées',
    category: 'personnes_agees',
    shortDescription: 'Accompagnement bienveillant, présence garde-malade, soins de dépendance et gériatrie.',
    fullDescription: 'Un service dédié aux séniors pour préserver leur autonomie à domicile : assistance quotidienne, hygiène, rappel médicamenteux strict, stimulation cognitive et visites gériatriques préventives.',
    image: elderlyCareImg,
    features: [
      'Garde-malade à domicile (8h, 12h ou 24h/24)',
      'Aide à la toilette, à l’habillage et aux repas',
      'Suivi préventif de la perte d’autonomie',
      'Rapport quotidien transmis aux familles',
      'Soutien psychologique et compagnie'
    ],
    priceMAD: 250,
    durationMinutes: 120,
    popular: true
  },
  {
    id: 'suivi_chronique',
    title: 'Suivi des Patients Chroniques',
    category: 'patients_chroniques',
    shortDescription: 'Gestion intégrée du diabète, de l’hypertension, des pathologies cardiaques et respiratoires.',
    fullDescription: 'Un carnet de santé numérique connecté avec visites régulières du médecin et de l’infirmier pour équilibrer les constantes (glycémie, tension), adapter le traitement et éviter les décompensations.',
    image: chronicCareImg,
    features: [
      'Relevé interactif des constantes (Tension, Glycémie, SpO2)',
      'Alertes intelligentes en cas de dérive des chiffres',
      'Bilans biologiques réguliers programmés',
      'Carnet de santé médical sécurisé',
      'Éducation thérapeutique personnalisée'
    ],
    priceMAD: 300,
    durationMinutes: 60,
    popular: true
  },
  {
    id: 'kinesitherapie',
    title: 'Kinésithérapie & Rééducation à Domicile',
    category: 'kinesitherapie',
    shortDescription: 'Séances de rééducation fonctionnelle, respiratoire et orthopédique à la maison.',
    fullDescription: 'Kinésithérapeutes diplômés intervenant à domicile avec le matériel adapté pour accélérer votre rétablissement après une chirurgie, un AVC ou un traumatisme.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    features: [
      'Rééducation à la marche et autonomie',
      'Kinésithérapie respiratoire (adulte et pédiatrique)',
      'Drainage lymphatique et massage thérapeutique',
      'Mobilisation articulaire douce'
    ],
    priceMAD: 200,
    durationMinutes: 45
  },
  {
    id: 'teleconsultation',
    title: 'Téléconsultation Médicale Rapide',
    category: 'teleconsultation',
    shortDescription: 'Avis médical rapide par appel vidéo sécurisé sans déplacement.',
    fullDescription: 'Consultez un médecin certifié en ligne pour un renouvellement d’ordonnance, une interprétation d’analyses biologiques, des conseils de santé ou un premier avis rapide.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    features: [
      'Connexion vidéo sécurisée HD',
      'Ordonnance numérique signée électroniquement',
      'Compte-rendu téléchargeable immédiatement',
      'Sans temps d’attente'
    ],
    priceMAD: 180,
    durationMinutes: 20
  },
  {
    id: 'transport_medical',
    title: 'Transport Médicalisé & Ambulance',
    category: 'transport_medical',
    shortDescription: 'Transport sanitaire sécurisé, transfert d’urgence ou programmé en ambulance équipée à Berkane.',
    fullDescription: 'Ambulance médicalisée avec brancard médical, accompagnement par un infirmier ou secouriste qualifié pour transferts hôpital, clinique, examens de radiologie ou hémodialyse.',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Ambulance équipée (oxygène, brancard, surveillance)',
      'Présence d’un infirmier diplômé / ambulancier qualifié',
      'Transferts programmés (Dialyse, Radiologie, Contrôles)',
      'Déplacement d’urgence 24h/24 & 7j/7 à Berkane et région',
      'Installation et aide au brancardage au domicile'
    ],
    priceMAD: 250,
    durationMinutes: 45,
    popular: true
  }
];

export const DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Mehdi Bennani',
    title: 'Médecin Généraliste & Urgentiste',
    specialty: 'Médecine Générale & Urgences',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 184,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
    priceMAD: 350,
    cities: ['Rabat', 'Salé', 'Témara', 'Casablanca'],
    isCertified: true,
    registrationNumber: 'CNOM-18492',
    bio: 'Ancien praticien hospitalier spécialisé dans la prise en charge des soins d’urgence à domicile, des infections aiguës et du suivi gériatrique.',
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    timeSlots: ['08:30', '10:00', '11:30', '14:00', '16:00', '18:00', '20:00'],
    languages: ['Français', 'Arabe', 'Anglais']
  },
  {
    id: 'doc-2',
    name: 'Dr. Amina El Amrani',
    title: 'Spécialiste en Gériatrie & Maladies Chroniques',
    specialty: 'Gériatrie & Diabétologie',
    experienceYears: 16,
    rating: 4.95,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1594824813566-888242a85e13?auto=format&fit=crop&w=500&q=80',
    priceMAD: 400,
    cities: ['Casablanca', 'Mohammedia', 'Rabat'],
    isCertified: true,
    registrationNumber: 'CNOM-12049',
    bio: 'Experte en santé du sujet âgé et contrôle des maladies métaboliques chroniques (diabète, hypertension). Accompagnement individualisé à domicile.',
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi', 'Samedi'],
    timeSlots: ['09:00', '10:30', '12:00', '15:00', '17:00'],
    languages: ['Français', 'Arabe']
  },
  {
    id: 'doc-3',
    name: 'Dr. Youssef Tazi',
    title: 'Cardiologue & Praticien en Soins à Domicile',
    specialty: 'Cardiologie & Hypertension',
    experienceYears: 18,
    rating: 4.88,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    priceMAD: 450,
    cities: ['Casablanca', 'Rabat', 'Marrakech'],
    isCertified: true,
    registrationNumber: 'CNOM-09381',
    bio: 'Spécialiste de la prévention cardiovasculaire et du suivi de l’insuffisance cardiaque avec électrocardiogramme portable à domicile.',
    availableDays: ['Mardi', 'Mercredi', 'Vendredi', 'Samedi'],
    timeSlots: ['09:30', '11:00', '14:30', '16:30'],
    languages: ['Français', 'Arabe', 'Espagnol']
  },
  {
    id: 'doc-4',
    name: 'Mme. Sarah Malki, IDE',
    title: 'Infirmière Major Diplômée d’État',
    specialty: 'Soins Infirmiers & Perfusion',
    experienceYears: 11,
    rating: 4.97,
    reviewCount: 318,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
    priceMAD: 150,
    cities: ['Rabat', 'Casablanca', 'Fès', 'Agadir'],
    isCertified: true,
    registrationNumber: 'IDE-MOR-5520',
    bio: 'Infirmière chevronnée spécialisée dans les soins post-opératoires, pansements complexes, prises de sang à domicile et accompagnement des patients alités.',
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    timeSlots: ['08:00', '09:30', '11:00', '13:00', '15:00', '17:00', '19:00'],
    languages: ['Français', 'Arabe']
  }
];

export const CARE_PACKAGES: CarePackage[] = [
  {
    id: 'pack-1',
    title: 'Sérénité Sénior',
    subtitle: 'Prise en charge complète à domicile pour personne âgée',
    targetAudience: 'Personnes âgées dépendantes ou isolées',
    priceMAD: 1800,
    billingPeriod: 'semaine',
    features: [
      '3 visites d’infirmier par semaine (hygiène, constantes)',
      '1 visite médicale mensuelle du gériatre',
      'Gestion et pilulier hebdomadaire préparé',
      'Assistance téléphonique prioritaire 24/7',
      'Rapport hebdomadaire envoyé aux enfants par WhatsApp/Email'
    ]
  },
  {
    id: 'pack-2',
    title: 'Suivi Diabète & HTA Pro',
    subtitle: 'Programme d’équilibrage des constantes chroniques',
    targetAudience: 'Patients diabétiques et hypertendus',
    priceMAD: 1200,
    billingPeriod: 'mois',
    popular: true,
    features: [
      'Relevé des constantes automatisé dans l’application',
      '1 bilan médical complet à domicile par mois',
      '2 prises de sang & bilans lipidiques/glycémiques',
      'Alertes en temps réel en cas d’anomalie',
      'Conseils nutritionnels spécialisés'
    ]
  },
  {
    id: 'pack-3',
    title: 'Garde-Malade Continuous',
    subtitle: 'Présence et assistance continue 7j/7',
    targetAudience: 'Retour d’hospitalisation & perte d’autonomie',
    priceMAD: 4500,
    billingPeriod: 'mois',
    features: [
      'Auxiliaire de vie formée aux gestes de santé',
      'Aide aux repas, mobilité et hygiène quotidienne',
      'Suivi strict de la prise des médicaments',
      'Supervision par un médecin coordinateur'
    ]
  }
];

export const INITIAL_VITALS: VitalLog[] = [
  {
    id: 'v-1',
    date: '2026-07-26',
    time: '08:30',
    bloodPressureSystolic: 125,
    bloodPressureDiastolic: 82,
    bloodSugar: 110,
    heartRate: 72,
    oxygenSaturation: 98,
    temperature: 36.6,
    notes: 'A jeun. Sentiment de bonne forme.'
  },
  {
    id: 'v-2',
    date: '2026-07-25',
    time: '19:00',
    bloodPressureSystolic: 130,
    bloodPressureDiastolic: 85,
    bloodSugar: 142,
    heartRate: 76,
    oxygenSaturation: 97,
    temperature: 36.8,
    notes: '2h après le dîner.'
  },
  {
    id: 'v-3',
    date: '2026-07-24',
    time: '08:15',
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    bloodSugar: 105,
    heartRate: 70,
    oxygenSaturation: 99,
    temperature: 36.5,
    notes: 'Visite de contrôle infirmière effectuée.'
  }
];

export const INITIAL_MEDICAL_HISTORY: MedicalHistoryRecord[] = [
  {
    id: 'mh-1',
    date: '2026-07-15',
    doctorName: 'Dr. Amina El Amrani',
    specialty: 'Gériatrie & Diabétologie',
    diagnosis: 'Diabète de Type 2 équilibré, Hypertension Artérielle Modérée',
    treatmentSummary: 'Ajustement du dosage de Metformine 850mg et poursuite de l’Amlodipine 5mg. Régime hygiéno-diététique pauvre en sel et en sucres rapides.',
    prescriptions: [
      'Metformine 850 mg: 1 comprimé au milieu du repas du matin et du soir',
      'Amlodipine 5 mg: 1 comprimé le matin au réveil',
      'Lansoprazole 15 mg: 1 gélule le matin'
    ],
    labNotes: 'HbA1c: 6.8% (Bon contrôle). Bilan rénal normal (Créatinine: 9 mg/L).',
    recommendedFollowUp: 'Consultation de suivi dans 3 mois à domicile ou téléconsultation.'
  },
  {
    id: 'mh-2',
    date: '2026-06-02',
    doctorName: 'Dr. Mehdi Bennani',
    specialty: 'Médecine Générale',
    diagnosis: 'Bronchite aiguë résolue chez sujet à risque',
    treatmentSummary: 'Traitement antibiotique de 7 jours et aérosolthérapie à domicile.',
    prescriptions: [
      'Amoxicilline/Acide Clavulanique 1g: 1 sachet matin et soir (7 jours)',
      'Doliprane 1000 mg: En cas de fièvre ou douleur'
    ],
    labNotes: 'Radiographie pulmonaire à domicile: aucun foyer parenchymateux.',
    recommendedFollowUp: 'Avis si reprise de la toux.'
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Metformine 850mg',
    dosage: '1 comprimé',
    instructions: 'Pendant le repas du matin et du soir',
    times: ['08:30', '20:00'],
    remainingPills: 42,
    totalPills: 60,
    color: '#0d9488', // Emerald
    active: true,
    startDate: '2026-01-10'
  },
  {
    id: 'med-2',
    name: 'Amlodipine 5mg',
    dosage: '1 comprimé',
    instructions: 'Au réveil avec un grand verre d’eau',
    times: ['08:00'],
    remainingPills: 18,
    totalPills: 30,
    color: '#3b82f6', // Blue
    active: true,
    startDate: '2026-02-15'
  },
  {
    id: 'med-3',
    name: 'Doliprane 1000mg',
    dosage: '1 comprimé',
    instructions: 'En cas de douleur ou fièvre (max 3/jour)',
    times: ['12:30'],
    remainingPills: 12,
    totalPills: 20,
    color: '#f59e0b', // Amber
    active: true,
    startDate: '2026-07-20'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const DEMO_REGISTERED_USERS: UserAccount[] = [];

