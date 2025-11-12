
import React, { useState, useMemo } from 'react';
import type { LottoTier, User } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface LiveLottoStatusProps {
  lottoTier: LottoTier;
  participants: Pick<User, 'name' | 'avatarUrl'>[];
}

const ParticipantAvatar: React.FC<{ participant: Pick<User, 'name' | 'avatarUrl'>, isActive: boolean }> = ({ participant, isActive }) => (
    <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-125' : 'scale-90 opacity-50'}`}>
        <img 
            src={participant.avatarUrl} 
            alt={participant.name} 
            className={`w-16 h-16 rounded-full object-cover transition-all duration-300 border-4 ${isActive ? 'border-star-yellow shadow-glow-yellow' : 'border-space-border'}`}
        />
    </div>
);

export const LiveRaffleStatus: React.FC<LiveLottoStatusProps> = ({ lottoTier, participants }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [winner, setWinner] = useState<Pick<User, 'name' | 'avatarUrl'> | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const extendedParticipants = useMemo(() => {
        // Extend the list to make the spinning effect smoother and longer
        if (participants.length === 0) return [];
        const repeated = [];
        for (let i = 0; i < 5; i++) {
            repeated.push(...participants);
        }
        // Shuffle the array
        return repeated.sort(() => Math.random() - 0.5);
    }, [participants]);

    const startDraw = () => {
        if (isDrawing || extendedParticipants.length === 0) return;

        setIsDrawing(true);
        setWinner(null);
        setShowConfetti(false);
        setActiveIndex(0);

        const winnerIndex = Math.floor(extendedParticipants.length * 0.75) + Math.floor(Math.random() * (participants.length));
        let intervalTime = 50;
        let currentIndex = 0;
        
        const drawInterval = setInterval(() => {
            currentIndex++;
            setActiveIndex(currentIndex);

            // Slow down logic
            if (currentIndex > winnerIndex - 10) {
                intervalTime *= 1.2;
                clearInterval(drawInterval);
                const newInterval = setInterval(() => {
                    currentIndex++;
                    setActiveIndex(currentIndex);
                    if (currentIndex >= winnerIndex) {
                        clearInterval(newInterval);
                        setIsDrawing(false);
                        setWinner(extendedParticipants[winnerIndex]);
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 5000);
                    }
                }, intervalTime);
            }
        }, intervalTime);
    };

    return (
        <section id="live-raffle" className="mt-6 bg-space-card p-5 rounded-lg shadow-lg border border-space-border relative overflow-hidden">
            <h2 className="text-xl font-bold text-star-yellow tracking-wider mb-4">Live Lotto Draw: <span className="text-white">{lottoTier.level} Tier</span></h2>
            
            <div className="bg-space-dark/50 p-4 rounded-lg border border-space-border/50 text-center mb-4">
                <p className="text-sm text-gray-400 uppercase">Current Prize Pool</p>
                <p className="text-4xl font-bold text-nova-green" style={{ textShadow: `0 0 15px rgba(52, 211, 153, 0.7)` }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lottoTier.prizePool)}
                </p>
            </div>

            <div className="relative h-48 bg-space-dark rounded-lg flex flex-col items-center justify-center p-4 overflow-hidden border-y-2 border-dashed border-cyber-pink/50">
                {!winner && !isDrawing && (
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-300">Awaiting Next Draw</p>
                        <p className="text-sm text-gray-500">The winner will be revealed here.</p>
                    </div>
                )}
                
                {winner && (
                     <div className="text-center animate-supernova relative">
                        {showConfetti && Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="confetti" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: ['#EC4899', '#FBBF24', '#34D399', '#fff'][Math.floor(Math.random() * 4)]
                            }}></div>
                        ))}
                        <p className="text-sm font-bold uppercase text-star-yellow tracking-widest">WINNER!</p>
                        <img src={winner.avatarUrl} alt={winner.name} className="w-20 h-20 rounded-full mx-auto my-2 ring-4 ring-star-yellow object-cover shadow-glow-yellow" />
                        <p className="text-xl font-bold text-white">{winner.name}</p>
                    </div>
                )}

                {isDrawing && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center">
                        <div className="flex transition-transform duration-100 ease-linear" style={{ transform: `translateX(calc(50% - ${activeIndex * 80 + 40}px))`}}>
                            {extendedParticipants.map((p, i) => (
                                <div key={i} className="px-2">
                                    <ParticipantAvatar participant={p} isActive={i === activeIndex} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                    onClick={startDraw} 
                    disabled={isDrawing}
                    className="w-full md:w-auto bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed shadow-glow-pink flex items-center justify-center gap-2"
                >
                    <i className="fas fa-play-circle"></i>
                    {isDrawing ? 'Drawing...' : 'Watch Live Draw'}
                </button>
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400 mb-1">Next draw begins in:</p>
                    <CountdownTimer targetDate={lottoTier.drawTime} glowColor={'rgba(236, 72, 153, 0.8)'} />
                </div>
            </div>
        </section>
    );
};