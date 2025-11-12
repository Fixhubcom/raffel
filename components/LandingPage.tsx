
import React from 'react';

const CharacterCard: React.FC<{ icon: string, name: string, description: string, animationClass: string, themeColor: string }> = ({ icon, name, description, animationClass, themeColor }) => (
  <div className={`relative w-64 h-40 p-4 bg-space-card/80 border border-space-border rounded-lg flex flex-col items-center justify-center text-center overflow-hidden ${animationClass}`}>
    <i className={`absolute -top-2 -left-2 text-6xl opacity-10 ${themeColor}`}>{icon}</i>
    <i className={`text-4xl mb-2 ${themeColor}`}>{icon}</i>
    <h3 className="font-bold text-lg text-white">{name}</h3>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);


const LandingPage: React.FC<{ onLogin: (role: 'user' | 'admin') => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4 overflow-hidden relative font-sans">
      <div className="stars-animation"></div>
      
      {/* Animated celestial bodies */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyber-pink/20 rounded-full blur-2xl animate-float-delay"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-star-yellow/30 rounded-full blur-lg animate-float-slow"></div>

      <div className="relative z-10">
        <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-widest glitch" data-text="LuckiLotto">
          LuckiLotto
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Your gateway to a world of gamified finance. Participate in exciting lotteries, complete missions, and earn amazing rewards.
        </p>

        <div className="hidden lg:flex flex-col md:flex-row items-center justify-center gap-8 my-10">
          <CharacterCard 
            icon="fas fa-user-astronaut"
            name="The High-Roller"
            description="Take on the challenge of high-stake lotteries."
            animationClass="animate-float"
            themeColor="text-cyber-pink"
          />
          <CharacterCard 
            icon="fas fa-brain"
            name="The Strategist"
            description="Master trivia and claim intellectual victory."
            animationClass="animate-float-delay"
            themeColor="text-star-yellow"
          />
          <CharacterCard 
            icon="fas fa-gem"
            name="The Collector"
            description="Collect rare items and gather valuable EXP."
            animationClass="animate-float-slow"
            themeColor="text-nova-green"
          />
        </div>
        
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => onLogin('user')} 
            className="px-10 py-4 bg-cyber-pink/80 border border-cyber-pink text-white font-bold text-lg rounded-lg uppercase tracking-wider transform transition hover:scale-105 hover:bg-cyber-pink shadow-glow-pink animate-pulse-slow"
          >
            Enter as Player
          </button>
           <button 
            onClick={() => onLogin('admin')} 
            className="px-8 py-3 bg-space-border/50 border border-space-border text-gray-300 font-bold rounded-lg uppercase tracking-wider transform transition hover:scale-105 hover:bg-space-border hover:text-white"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;