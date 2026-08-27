import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, CheckCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Consultation médicale à domicile');
  const [customMsg, setCustomMsg] = useState('');

  const prefilledTemplates = [
    'Demande de consultation médicale à domicile',
    'Soins infirmiers / Prise de sang à domicile',
    'Prise en charge personne âgée / Garde-malade',
    'Suivi patient chronique (Diabète / HTA)',
    'Séance de Kinésithérapie à domicile'
  ];

  const handleSend = () => {
    const finalMessage = customMsg.trim() 
      ? `Bonjour SoinDomicile, ${customMsg}` 
      : `Bonjour, je souhaite des renseignements pour : ${selectedTopic}.`;
    
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/212728338276?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Quick Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#344E41] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#588157] rounded-full flex items-center justify-center border border-[#A3B18A]/30">
                <MessageCircle className="w-5 h-5 text-[#E9EDC9]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm">Assistance WhatsApp 24/7</h4>
                <p className="text-[11px] text-[#E9EDC9] flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#A3B18A] rounded-full animate-ping"></span>
                  En ligne : +212 728-338276
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[#E0E5DD] hover:text-white p-1 rounded-lg hover:bg-[#588157]/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F9FAF8] text-xs">
            <p className="text-[#344E41] font-medium">
              Besoin d'un médecin ou d'un infirmier rapidement ? Choisissez votre motif :
            </p>

            <div className="space-y-1.5">
              {prefilledTemplates.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left px-3 py-2 rounded-2xl transition-all flex items-center justify-between ${
                    selectedTopic === topic
                      ? 'bg-[#E9EDC9] text-[#344E41] border border-[#A3B18A] font-semibold'
                      : 'bg-white text-[#2D4739] border border-[#E0E5DD] hover:bg-[#F1F3EE]'
                  }`}
                >
                  <span>{topic}</span>
                  {selectedTopic === topic && <CheckCircle className="w-3.5 h-3.5 text-[#588157] shrink-0" />}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[#344E41] font-medium mb-1">Ou précisez votre ville / besoin :</label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Ex: Urgence relative pour mon père à Berkane..."
                className="w-full p-2.5 bg-white border border-[#E0E5DD] rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#588157]"
                rows={2}
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full bg-[#588157] hover:bg-[#344E41] text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Ouvrir WhatsApp (+212 728-338276)</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#588157] hover:bg-[#344E41] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:scale-105 transition-all group font-bold text-xs border border-[#A3B18A]/30"
        title="Contact WhatsApp Direct"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-[#588157]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E9EDC9] rounded-full animate-ping"></span>
        </div>
        <span className="hidden sm:inline">WhatsApp Urgent</span>
      </button>
    </div>
  );
};
