import React from 'react';

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4 overflow-hidden relative font-sans">
      <div className="stars-animation"></div>
      
      {/* Animated celestial bodies */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyber-pink/20 rounded-full blur-2xl animate-float-delay"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-star-yellow/30 rounded-full blur-lg animate-float-slow"></div>

      <div className="relative z-10">
        <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-widest glitch" data-text="STARRAFFLE">
          STARRAFFLE
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Your gateway to a decentralized cosmos of gamified finance. Participate in interstellar raffles, complete missions, and earn stellar rewards.
        </p>
        <button 
          onClick={onLogin} 
          className="mt-12 px-10 py-4 bg-cyber-pink/80 border border-cyber-pink text-white font-bold text-lg rounded-lg uppercase tracking-wider transform transition hover:scale-105 hover:bg-cyber-pink shadow-glow-pink animate-pulse-slow"
        >
          Launch Command Deck
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
