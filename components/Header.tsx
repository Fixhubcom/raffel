import React, { useState } from 'react';

interface HeaderProps {
    setActiveTab: (tab: string) => void;
    pointsBalance: number;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, pointsBalance, onLogout }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock notifications
  const notifications = [
    { id: '1', message: 'Your entry for the Pro tier was successful!', time: '5m ago' },
    { id: '2', message: 'You won $500 in the Basic raffle!', time: '4h ago' },
    { id: '3', message: 'New Midweek Q&A is available.', time: '1d ago' },
  ];
  
  const handleProfileClick = () => {
    setActiveTab('profile');
    setIsProfileOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-space-card/80 backdrop-blur-sm z-40 border-b border-space-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-white tracking-wider">
          <span className="text-star-yellow">STAR</span>RAFFLE
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-space-dark px-3 py-1.5 rounded-full border border-space-border shadow-glow-yellow">
              <i className="fas fa-atom text-star-yellow"></i>
              <span className="font-bold text-white">{pointsBalance.toLocaleString()}</span>
              <span className="text-xs text-gray-400">POINTS</span>
          </div>
          <div className="relative">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-gray-300 hover:text-white text-xl">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-pink"></span>
              </span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-space-card border border-space-border rounded-lg shadow-lg z-50">
                <div className="p-3 font-semibold border-b border-space-border">Notifications</div>
                <ul>
                  {notifications.map(n => (
                    <li key={n.id} className="p-3 border-b border-space-border/50 hover:bg-space-border/50 cursor-pointer">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-400 text-right">{n.time}</p>
                    </li>
                  ))}
                </ul>
                <div className="p-2 text-center">
                  <button className="text-sm text-star-yellow hover:underline">View All</button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 bg-space-blue rounded-full flex items-center justify-center ring-2 ring-cyber-pink/50 hover:ring-cyber-pink transition">
                <img src={`https://i.pravatar.cc/150?u=a042581f4e29026704d`} alt="User avatar" className="rounded-full w-full h-full object-cover" />
            </button>
            {isProfileOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-space-card border border-space-border rounded-lg shadow-lg z-50">
                    <ul className="text-gray-200">
                        <li className="p-3 hover:bg-space-border/50 cursor-pointer" onClick={handleProfileClick}>
                           <i className="fas fa-user-astronaut mr-2 w-4"></i> View Profile
                        </li>
                        <li className="p-3 hover:bg-space-border/50 cursor-pointer">
                            <i className="fas fa-cog mr-2 w-4"></i> Settings
                        </li>
                         <li onClick={onLogout} className="p-3 hover:bg-space-border/50 cursor-pointer border-t border-space-border/50">
                            <i className="fas fa-sign-out-alt mr-2 w-4"></i> Logout
                        </li>
                    </ul>
                 </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};