
import React from 'react';

const GameCard: React.FC<{ title: string; description: string; icon: string; buttonText: string; onPlay: () => void; theme: 'pink' | 'yellow' | 'green'; }> = 
({ title, description, icon, buttonText, onPlay, theme }) => {
    const themeClasses = {
        pink: { text: 'text-cyber-pink', shadow: 'shadow-glow-pink' },
        yellow: { text: 'text-star-yellow', shadow: 'shadow-glow-yellow' },
        green: { text: 'text-nova-green', shadow: 'shadow-glow-green' },
    }
    const config = themeClasses[theme];

    return (
        <div className={`relative bg-space-card p-6 rounded-xl shadow-lg border border-space-border overflow-hidden transform transition-transform hover:-translate-y-1 ${config.shadow}`}>
             <div className={`absolute top-4 right-4 text-5xl opacity-10 ${config.text}`}>
                <i className={icon}></i>
            </div>
            <svg className="absolute top-0 left-0 w-full h-full opacity-5" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid-play" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(58, 66, 125, 0.7)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid-play)" /></svg>
            <div className="relative z-10">
                <h3 className={`text-2xl font-bold ${config.text}`}>{title}</h3>
                <p className="text-gray-300 mt-2 text-sm h-10">{description}</p>
                <button onClick={onPlay} className={`mt-6 font-bold text-white py-2 px-5 rounded-lg transition-all bg-gradient-to-r from-space-blue to-space-card border border-space-border hover:brightness-125 ${config.shadow}`}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
}


interface PlayPageProps {
    onSpinWheel: () => void;
    onStartTrivia: () => void;
    onStartMining: () => void;
}

export const PlayPage: React.FC<PlayPageProps> = ({ onSpinWheel, onStartTrivia, onStartMining }) => {
  return (
    <div className="container mx-auto px-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wider">GAME ZONE</h1>
            <p className="text-gray-400">Accept missions, test your skills, and earn rewards.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameCard 
                title="Spin & Win"
                description="A daily chance to spin the wheel for instant cash prizes, points, and rare collectibles."
                icon="fas fa-bullseye"
                buttonText="Spin Now"
                onPlay={onSpinWheel}
                theme="yellow"
            />
             <GameCard 
                title="Astro-Trivia"
                description="Answer cosmic questions to win a share of the prize pool. New quiz every cycle."
                icon="fas fa-brain"
                buttonText="Start Quiz"
                onPlay={onStartTrivia}
                theme="pink"
            />
             <GameCard 
                title="Starstone Miner"
                description="Click the cosmic stone to mine for valuable EXP. Each expedition has limited power!"
                icon="fas fa-gem"
                buttonText="Start Mining"
                onPlay={onStartMining}
                theme="green"
            />
            <div className="md:col-span-2 bg-space-card p-6 rounded-xl shadow-lg border border-space-border text-center">
                <h3 className="text-xl font-bold text-gray-300">More Games Transmitting Soon!</h3>
                <p className="text-gray-400 mt-2">Our engineers are developing new simulations. Stay tuned for the next transmission!</p>
            </div>
        </div>
    </div>
  );
};
