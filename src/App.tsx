/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, Appointment, VitalLog, MedicalHistoryRecord, Medication, MedicationLog } from './types';
import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_VITALS, 
  INITIAL_MEDICAL_HISTORY, 
  INITIAL_MEDICATIONS,
  DEMO_REGISTERED_USERS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BookingModal } from './components/BookingModal';
import { QuickContactModal } from './components/QuickContactModal';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { DoctorDashboardView } from './views/DoctorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { TransportMedicalView } from './views/TransportMedicalView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Registered Professionals List (for Admin Verification)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('soindomicile_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fetch Pros from SQLite Backend
  const fetchPros = async () => {
    try {
      const res = await fetch('/api/pros');
      const data = await res.json();
      if (data.success && Array.isArray(data.pros)) {
        setRegisteredUsers(data.pros);
      }
    } catch (err) {
      console.error('Error loading pros:', err);
    }
  };

  // Fetch fresh current user info
  const refreshCurrentUser = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing current user:', err);
    }
  };

  useEffect(() => {
    fetchPros();
  }, [activeTab]);

  useEffect(() => {
    if (currentUser?.id) {
      refreshCurrentUser();
    }
  }, [activeTab]);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Persistence in localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('soindomicile_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [vitals, setVitals] = useState<VitalLog[]>(() => {
    try {
      const saved = localStorage.getItem('soindomicile_vitals');
      return saved ? JSON.parse(saved) : INITIAL_VITALS;
    } catch {
      return INITIAL_VITALS;
    }
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('soindomicile_medical_history');
      return saved ? JSON.parse(saved) : INITIAL_MEDICAL_HISTORY;
    } catch {
      return INITIAL_MEDICAL_HISTORY;
    }
  });

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [quickContactOpen, setQuickContactOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('soindomicile_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('soindomicile_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('soindomicile_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('soindomicile_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('soindomicile_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('soindomicile_medical_history', JSON.stringify(medicalHistory));
  }, [medicalHistory]);

  // Auth Handlers
  const handleOpenAuthModal = () => {
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Add user to registered users list if new
    if (!registeredUsers.some(u => u.id === user.id)) {
      setRegisteredUsers(prev => [user, ...prev]);
    }

    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('pro-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Admin Verification Handlers
  const handleVerifyPro = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/pros/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setRegisteredUsers(prev => prev.map(u => u.id === id ? data.user : u));
        if (currentUser && currentUser.id === id) {
          setCurrentUser(data.user);
        }
      }
    } catch (err) {
      console.error(err);
      setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, verificationStatus: status } : u));
    }
  };

  // Booking handlers
  const handleOpenBookingModal = (doctorId?: string, serviceId?: string) => {
    setPreselectedDoctorId(doctorId);
    setPreselectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const handleBookingComplete = (newAppt: Appointment) => {
    setAppointments([newAppt, ...appointments]);
  };

  const handleUpdateApptStatus = (id: string, status: 'Confirmé' | 'En cours' | 'Terminé' | 'Annulé') => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleAddMedicalHistory = (newRec: MedicalHistoryRecord) => {
    setMedicalHistory([newRec, ...medicalHistory]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {/* PUBLIC VIEWS */}
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onOpenBookingModal={handleOpenBookingModal}
            onOpenQuickContact={() => setQuickContactOpen(true)}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            onOpenBookingModal={handleOpenBookingModal}
            onOpenQuickContact={() => setQuickContactOpen(true)}
          />
        )}

        {activeTab === 'transport' && (
          <TransportMedicalView
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

        {/* AUTHENTICATED & PRO ESPACES */}
        {(activeTab === 'pro-dashboard' || activeTab === 'doctor-dashboard' || activeTab === 'nurse-dashboard') && (
          <DoctorDashboardView
            currentUser={currentUser}
            appointments={appointments}
            vitals={vitals}
            medicalHistory={medicalHistory}
            onAddMedicalHistory={handleAddMedicalHistory}
            onUpdateApptStatus={handleUpdateApptStatus}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardView
            currentUser={currentUser}
            usersList={registeredUsers}
            onVerifyUser={handleVerifyPro}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBookingModal={() => handleOpenBookingModal()}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton />

      {/* Authentication Modal (Connexion Pro / Registration / Admin Login) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Online Appointment Booking Wizard Modal (Accessible Publicly) */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={preselectedDoctorId}
        preselectedServiceId={preselectedServiceId}
        onBookingComplete={handleBookingComplete}
      />

      {/* Quick Direct Email / WhatsApp Contact Modal */}
      <QuickContactModal
        isOpen={quickContactOpen}
        onClose={() => setQuickContactOpen(false)}
      />

    </div>
  );
}
