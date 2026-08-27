import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Calendar, 
  HeartHandshake, 
  Stethoscope, 
  Menu, 
  X,
  ShieldCheck,
  Syringe,
  LogIn,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import { UserAccount } from '../types';
import { CONTACT_INFO, APP_IMAGES } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenBookingModal: (doctorId?: string, serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenBookingModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    if (tabId === 'booking') {
      onOpenBookingModal();
    } else {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const handleProEspaceClick = () => {
    if (!currentUser) {
      onOpenAuthModal();
    } else if (currentUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('pro-dashboard');
    }
    setMobileMenuOpen(false);
  };

  const handleAdminEspaceClick = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      onOpenAuthModal();
    } else {
      setActiveTab('admin-dashboard');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E0E5DD]">
      {/* Top Banner */}
      <div className="bg-[#2D4739] text-[#E0E5DD] text-xs py-2 px-4 border-b border-[#588157]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          
          <div className="flex items-center flex-wrap gap-3 text-[#DAD7CD]">
            <a 
              href={`tel:${CONTACT_INFO.phone}`} 
              className="flex items-center gap-1.5 hover:text-[#E9EDC9] transition-colors"
              title="Appeler le service médical"
            >
              <Phone className="w-3.5 h-3.5 text-[#A3B18A]" />
              <span>Urgence Berkane 24/7 : <strong className="text-white font-bold">{CONTACT_INFO.phoneDisplay}</strong></span>
            </a>
            <span className="hidden sm:inline text-[#A3B18A]/40">|</span>
            <span className="flex items-center gap-1 text-[#E9EDC9] font-medium bg-[#588157]/40 px-2.5 py-0.5 rounded-full border border-[#A3B18A]/30 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E9EDC9]" />
              <span>📍 Service Réseau Médical Berkane</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Quick Action */}
            <a 
              href={CONTACT_INFO.whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 bg-[#25D366] hover:bg-[#1ebd59] text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>

            {/* Auth User Status Widget */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#344E41] px-3 py-1 rounded-full border border-[#588157]/50 text-xs">
                {currentUser.verificationStatus === 'verified' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Vérifié par l'Admin" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" title="En attente de validation" />
                )}
                
                <span className="text-white font-bold text-[11px] truncate max-w-[140px]">
                  {currentUser.role === 'admin' ? 'Super Admin' : currentUser.name}
                </span>

                <button
                  onClick={onLogout}
                  title="Déconnexion"
                  className="ml-1 text-[#DAD7CD] hover:text-white hover:bg-white/10 p-0.5 rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 bg-[#E9EDC9] hover:bg-[#A3B18A] text-[#2D4739] px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#588157]" />
                <span>Espace Soignants & Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 bg-[#588157] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-[#344E41] transition-colors">
              <img 
                src={APP_IMAGES.logo} 
                alt="DomiSoins Logo" 
                className="w-11 h-11 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-serif font-bold tracking-tight text-[#344E41]">
                  DomiSoins
                </span>
                <span className="text-xs bg-[#E9EDC9] text-[#344E41] px-1.5 py-0.5 rounded-md font-bold">.ma</span>
              </div>
              <p className="text-[10px] text-[#588157] font-semibold">Soins & Transport Médicalisé • Berkane</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-[#2D4739] text-white shadow-xs'
                  : 'text-[#344E41] hover:bg-[#F9FAF8]'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-[#588157]" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'services'
                  ? 'bg-[#2D4739] text-white shadow-xs'
                  : 'text-[#344E41] hover:bg-[#F9FAF8]'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-[#588157]" />
              <span>Services & Soins</span>
            </button>

            {/* Transport Médicalisé Direct Link */}
            <button
              onClick={() => handleNavClick('transport')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'transport'
                  ? 'bg-[#588157] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Transport Médicalisé</span>
            </button>

            <div className="h-6 w-px bg-[#E0E5DD] mx-1" />

            {/* Espace Pro de Santé */}
            <button
              onClick={handleProEspaceClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'pro-dashboard'
                  ? 'bg-[#588157] text-white shadow-md ring-2 ring-[#588157]/30'
                  : currentUser && currentUser.role === 'pro'
                  ? 'bg-[#E9EDC9] text-[#2D4739] border border-[#A3B18A]'
                  : 'bg-[#F9FAF8] text-[#344E41] border border-[#E0E5DD] hover:border-[#A3B18A]'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-[#588157]" />
              <span>Espace Professionnel de Santé</span>
            </button>

            {/* Espace Admin */}
            <button
              onClick={handleAdminEspaceClick}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'admin-dashboard'
                  ? 'bg-[#2D4739] text-[#E9EDC9] shadow-md border border-[#588157]'
                  : currentUser && currentUser.role === 'admin'
                  ? 'bg-[#344E41] text-white'
                  : 'bg-[#F9FAF8] text-[#344E41] border border-[#E0E5DD] hover:border-[#A3B18A]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#588157]" />
              <span>Espace Admin</span>
            </button>
          </nav>

          {/* Right Action Button for Patients */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="flex items-center gap-2 bg-[#588157] hover:bg-[#2D4739] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-[#E9EDC9]" />
              <span>Demander un Soin / RDV</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenBookingModal()}
              className="bg-[#588157] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>RDV</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#344E41] hover:bg-[#F9FAF8]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E0E5DD] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left font-bold text-xs p-3 rounded-2xl bg-[#F9FAF8] border border-[#E0E5DD] text-[#2D4739] flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-[#588157]" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className="w-full text-left font-bold text-xs p-3 rounded-2xl bg-[#F9FAF8] border border-[#E0E5DD] text-[#2D4739] flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-[#588157]" />
              <span>Services & Soins</span>
            </button>

            <button
              onClick={() => handleNavClick('transport')}
              className="w-full text-left font-bold text-xs p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Transport Médicalisé & Ambulance</span>
            </button>

            <button
              onClick={handleProEspaceClick}
              className="w-full text-left font-bold text-xs p-3 rounded-2xl bg-[#E9EDC9]/60 border border-[#A3B18A] text-[#2D4739] flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-[#588157]" />
              <span>Espace Professionnel de Santé</span>
            </button>

            <button
              onClick={handleAdminEspaceClick}
              className="w-full text-left font-bold text-xs p-3 rounded-2xl bg-[#2D4739] text-[#E9EDC9] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#E9EDC9]" />
              <span>Espace Administration</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#E0E5DD] flex flex-col gap-2">
            {!currentUser ? (
              <button
                onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                className="w-full bg-[#E9EDC9] text-[#2D4739] text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#588157]" />
                <span>Connexion Soignants & Admin</span>
              </button>
            ) : (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full bg-red-50 text-red-700 text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion ({currentUser.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
