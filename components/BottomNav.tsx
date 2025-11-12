
import React from 'react';
import { StarshipIcon, GalaxyIcon, CreditChipIcon, JoystickIcon, AstronautIcon } from './icons';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-star-yellow' : 'text-gray-400 hover:text-white'}`}>
    {isActive && <div className="absolute top-0 w-10 h-1 bg-star-yellow rounded-full shadow-glow-yellow"></div>}
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-space-card/80 backdrop-blur-sm border-t border-space-border z-40 md:hidden">
      <div className="flex justify-around items-center h-full">
        <NavItem icon={<StarshipIcon className="w-6 h-6" />} label="Deck" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<GalaxyIcon className="w-6 h-6" />} label="Lotto" isActive={activeTab === 'raffles'} onClick={() => setActiveTab('raffles')} />
        <NavItem icon={<CreditChipIcon className="w-6 h-6" />} label="Wallet" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
        <NavItem icon={<JoystickIcon className="w-6 h-6" />} label="Games" isActive={activeTab === 'play'} onClick={() => setActiveTab('play')} />
        <NavItem icon={<AstronautIcon className="w-6 h-6" />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>
    </div>
  );
};