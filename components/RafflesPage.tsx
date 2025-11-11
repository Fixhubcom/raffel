
import React from 'react';
import type { RaffleTier } from '../types';
import { CountdownTimer } from './CountdownTimer';

const CelestialRaffleCard: React.FC<{ tier: RaffleTier, onPlay: (tier: RaffleTier) => void }> = ({ tier, onPlay }) => {
    const tierConfig = {
        Basic: {
            borderColor: 'border-blue-500',
            shadow: 'shadow-glow-blue',
            glowColor: 'rgba(59, 130, 246, 0.8)',
            celestialObject: <div className="w-32 h-32 bg-gray-600 rounded-full bg-cover bg-center" style={{backgroundImage: 'url(https://www.solarsystemscope.com/textures/download/2k_mercury.jpg)', animation: 'spin 20s linear infinite'}}></div>
        },
        Intermediate: {
            borderColor: 'border-cyber-pink',
            shadow: 'shadow-glow-pink',
            glowColor: 'rgba(236, 72, 153, 0.8)',
            celestialObject: <div className="w-40 h-40 bg-pink-500/20 rounded-full flex items-center justify-center animate-pulse"><div className="w-32 h-32 bg-pink-500/50 rounded-full blur-xl"></div></div>
        },
        Pro: {
            borderColor: 'border-star-yellow',
            shadow: 'shadow-glow-yellow',
            glowColor: 'rgba(251, 191, 36, 0.8)',
            celestialObject: <div className="w-48 h-48 bg-yellow-500/10 rounded-full flex items-center justify-center" style={{animation: 'spin 60s linear infinite reverse'}}><div className="w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div></div>
        },
    };
    
    const config = tierConfig[tier.level];

    return (
        <div className={`bg-space-card/70 border ${config.borderColor} ${config.shadow} rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm`}>
            <h2 className="text-3xl font-bold tracking-widest">{tier.level.toUpperCase()}</h2>
            <p className="text-lg font-semibold text-gray-400">{tier.celestialBody.name}</p>

            <div className="my-6 w-48 h-48 flex items-center justify-center">
               {config.celestialObject}
            </div>

            <div className="w-full">
                <div className="bg-space-dark/60 p-3 rounded-lg border border-space-border mb-4">
                    <p className="text-sm text-gray-400 uppercase">Prize Pool</p>
                    <p className="text-3xl font-bold text-star-yellow">${tier.prizePool.toLocaleString()}</p>
                </div>
                <div className="bg-space-dark/60 p-3 rounded-lg border border-space-border mb-6">
                    <p className="text-sm text-gray-400 uppercase">Next Draw</p>
                    <CountdownTimer targetDate={tier.drawTime} glowColor={config.glowColor} />
                </div>

                <button
                    onClick={() => onPlay(tier)}
                    className={`w-full font-bold text-xl py-4 rounded-lg transition transform hover:scale-105 border ${config.borderColor} bg-black/30 hover:bg-black/50 ${config.shadow}`}
                    style={{ textShadow: `0 0 8px ${config.glowColor}` }}
                >
                    ENTER FOR ${tier.entryFee}
                </button>
            </div>
        </div>
    );
};

interface RafflesPageProps {
    raffleTiers: RaffleTier[];
    onPlayRaffle: (tier: RaffleTier) => void;
}

export const RafflesPage: React.FC<RafflesPageProps> = ({ raffleTiers, onPlayRaffle }) => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider">CELESTIAL DRAWS</h1>
                <p className="text-gray-400">Choose your destination and jump into the draw.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {raffleTiers.map(tier => (
                    <CelestialRaffleCard key={tier.level} tier={tier} onPlay={onPlayRaffle} />
                ))}
            </div>
        </div>
    );
};
