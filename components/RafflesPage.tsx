

import React, { useState, useEffect, useMemo } from 'react';
import type { LottoTier, AdminSettings, LottoDraw, UserData } from '../types';
import { CountdownTimer } from './CountdownTimer';

// RaffleBall component for animation
const RaffleBall: React.FC<{ number?: number | string; isRevealed: boolean }> = ({ number, isRevealed }) => (
  <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/50 flex items-center justify-center text-3xl md:text-4xl font-bold transition-all duration-500
    ${isRevealed ? 'bg-star-yellow text-space-dark shadow-glow-yellow scale-110' : 'bg-gradient-to-br from-space-blue to-cyber-pink/50'}`}>
    <span className={`transition-opacity duration-500 ${isRevealed || typeof number === 'string' ? 'opacity-100' : 'opacity-80'}`}>{number}</span>
  </div>
);

// Main drawing animation component
const RaffleDrawingAnimation: React.FC<{ draw: LottoDraw | undefined, participants: number }> = ({ draw, participants }) => {
  const [rollingNumbers, setRollingNumbers] = useState<string[]>(['00', '00', '00']);
  
  useEffect(() => {
    if (!draw || draw.status !== 'Upcoming') {
      return;
    }
    
    const interval = setInterval(() => {
        setRollingNumbers([
            String(Math.floor(Math.random() * 50) + 1).padStart(2, '0'),
            String(Math.floor(Math.random() * 50) + 1).padStart(2, '0'),
            String(Math.floor(Math.random() * 50) + 1).padStart(2, '0'),
        ]);
    }, 100);

    return () => clearInterval(interval);
  }, [draw]);


  if (!draw) {
    return (
        <div className="bg-space-card/70 border border-space-border rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm shadow-lg mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-star-yellow">MAIN DRAW</h2>
            <p className="text-lg text-gray-400 mb-4">No upcoming draws available.</p>
        </div>
    )
  }

  const isUpcoming = draw.status === 'Upcoming';
  const isDrawing = draw.status === 'Drawing';
  const isFinished = draw.status === 'Finished';
  
  const getBallNumber = (index: number) => {
      if (isFinished) return String(draw.winningNumbers[index] || '00').padStart(2, '0');
      if (isDrawing) return '??';
      return rollingNumbers[index];
  }

  return (
    <div className="bg-space-card/70 border border-space-border rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-star-yellow">MAIN DRAW</h2>
      <p className="text-lg text-gray-400 mb-4">{participants.toLocaleString()} players in this draw</p>

      <div className={`flex items-center justify-center space-x-4 md:space-x-6 my-6 p-4 bg-space-dark/50 rounded-lg border border-space-border/50 transition-all duration-500 ${isDrawing && 'animate-pulse'}`}>
        <RaffleBall number={getBallNumber(0)} isRevealed={isFinished} />
        <RaffleBall number={getBallNumber(1)} isRevealed={isFinished} />
        <RaffleBall number={getBallNumber(2)} isRevealed={isFinished} />
      </div>

      <div className="w-full">
        {isFinished ? (
          <div className="text-2xl font-bold text-nova-green">WINNING NUMBERS ANNOUNCED!</div>
        ) : isDrawing ? (
           <div className="text-2xl font-bold text-nova-green">DRAWING IN PROGRESS...</div>
        ) : (
          <>
            <p className="text-sm text-gray-400 uppercase">Next Draw In</p>
            <CountdownTimer targetDate={draw.drawTime} glowColor={'rgba(251, 191, 36, 0.8)'} />
          </>
        )}
      </div>
    </div>
  );
};


const NumberSelection: React.FC<{ onPlay: (draw: LottoDraw, tier: LottoTier, numbers: number[], amount: number, autoPlay: boolean) => void, tiers: LottoTier[], draws: LottoDraw[] }> = ({ onPlay, tiers, draws }) => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [amount, setAmount] = useState<number>(1);
    const [autoPlay, setAutoPlay] = useState(false);
    const upcomingDraws = draws.filter(d => d.status === 'Upcoming');
    const [selectedDrawId, setSelectedDrawId] = useState<string | null>(upcomingDraws[0]?.id || null);

    const toggleNumber = (num: number) => {
        setSelectedNumbers(prev => {
            if (prev.includes(num)) return prev.filter(n => n !== num);
            if (prev.length < 3) return [...prev, num].sort((a,b) => a-b);
            return prev;
        });
    }

    const handleQuickPick = () => {
        const numbers = new Set<number>();
        while(numbers.size < 3) {
            numbers.add(Math.floor(Math.random() * 50) + 1);
        }
        setSelectedNumbers(Array.from(numbers).sort((a,b) => a-b));
    };
    
    const selectedDraw = upcomingDraws.find(d => d.id === selectedDrawId);
    const canPlay = selectedNumbers.length === 3 && amount > 0 && selectedDraw;
    
    const handlePlay = (tier: LottoTier) => {
        if (canPlay && selectedDraw) {
            onPlay(selectedDraw, tier, selectedNumbers, amount, autoPlay);
        }
    }

    return (
        <div className="bg-space-card/70 border border-space-border rounded-2xl p-6 backdrop-blur-sm shadow-lg">
             <h2 className="text-xl md:text-2xl font-bold tracking-wider text-center mb-4">PLACE YOUR BET</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div>
                    <h3 className="font-semibold mb-2">1. Pick 3 Lucky Numbers (1-50)</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-space-dark/50 p-3 rounded-lg">
                        {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                            <button key={num} onClick={() => toggleNumber(num)} className={`aspect-square rounded-full transition-all text-sm font-bold flex items-center justify-center ${selectedNumbers.includes(num) ? 'bg-cyber-pink text-white scale-110 shadow-glow-pink' : 'bg-space-border hover:bg-space-blue'}`}>
                                {num}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleQuickPick} className="w-full mt-3 text-sm bg-space-border hover:bg-space-blue transition py-2 rounded-lg font-semibold">
                       <i className="fas fa-random mr-2"></i> Quick Pick
                    </button>
                </div>
                <div>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">2. Choose Draw Time</h3>
                         <div className="flex flex-wrap gap-2">
                             {upcomingDraws.length > 0 ? upcomingDraws.map(draw => (
                                <button key={draw.id} onClick={() => setSelectedDrawId(draw.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${selectedDrawId === draw.id ? 'bg-space-blue text-white shadow-md' : 'bg-space-border hover:bg-space-blue/70'}`}>
                                    {draw.drawTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </button>
                            )) : <p className="text-sm text-gray-400">No upcoming draws to schedule.</p>}
                         </div>
                    </div>
                    <h3 className="font-semibold mb-2">3. Set Amount & Schedule</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Play Amount ($)</label>
                            <input type="number" value={amount} onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-space-border p-2 rounded-md text-white mt-1 focus:ring-2 focus:ring-cyber-pink outline-none" min="1"/>
                        </div>
                        <div className="flex justify-between items-center bg-space-dark/50 p-3 rounded-lg">
                            <label htmlFor="autoPlay" className="font-semibold text-gray-200">Enable Auto-Play</label>
                            <button onClick={() => setAutoPlay(!autoPlay)} className={`relative w-12 h-6 rounded-full transition-colors ${autoPlay ? 'bg-nova-green' : 'bg-space-border'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoPlay ? 'translate-x-6' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                     <div className="mt-4">
                        <h3 className="font-semibold mb-2">4. Confirm Your Tier</h3>
                         <div className="space-y-2">
                            {tiers.map(tier => (
                                <button key={tier.level} disabled={!canPlay} onClick={() => handlePlay(tier)}
                                 className="w-full font-bold text-lg p-3 rounded-lg transition transform hover:scale-105 border bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                 style={{
                                    borderColor: tier.level === 'Basic' ? '#3B82F6' : tier.level === 'Intermediate' ? '#EC4899' : '#FBBF24',
                                    textShadow: `0 0 8px ${tier.level === 'Basic' ? 'rgba(59, 130, 246, 0.8)' : tier.level === 'Intermediate' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(251, 191, 36, 0.8)'}`
                                 }}
                                >
                                    Play {tier.level} Tier
                                </button>
                            ))}
                         </div>
                    </div>
                </div>
             </div>
        </div>
    )
}

const AutoPlayStatus: React.FC<{ 
    config: UserData['autoPlayConfig']; 
    onDisable: () => void; 
}> = ({ config, onDisable }) => {
    if (!config || !config.enabled) return null;

    return (
        <div className="bg-space-blue/50 border border-nova-green rounded-xl p-4 text-center shadow-glow-green">
            <div className="flex justify-center items-center gap-2 mb-2">
                <i className="fas fa-robot text-nova-green text-xl animate-pulse"></i>
                <h3 className="text-xl font-bold text-white">Auto-Play Active</h3>
            </div>
            <p className="text-gray-300 text-sm">
                You will be automatically entered into upcoming draws with the following settings:
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 my-3 text-sm">
                <span><span className="font-semibold text-gray-400">Tier:</span> {config.tier}</span>
                <span><span className="font-semibold text-gray-400">Amount:</span> ${config.amount}</span>
                <span><span className="font-semibold text-gray-400">Numbers:</span> {config.numbers.join(', ')}</span>
            </div>
            <button 
                onClick={onDisable}
                className="bg-red-500/80 hover:bg-red-500 text-white font-bold py-2 px-5 rounded-lg transition text-sm shadow-lg"
            >
                <i className="fas fa-stop-circle mr-2"></i> Disable Auto-Play
            </button>
        </div>
    );
}

interface RafflesPageProps {
    raffleTiers: LottoTier[];
    onPlayScheduledRaffle: (draw: LottoDraw, tier: LottoTier, numbers: number[], amount: number, autoPlay: boolean) => void;
    adminSettings: AdminSettings;
    raffleDraws: LottoDraw[];
    currentUserData: UserData;
    onDisableAutoPlay: () => void;
}

export const RafflesPage: React.FC<RafflesPageProps> = ({ raffleTiers, onPlayScheduledRaffle, adminSettings, raffleDraws, currentUserData, onDisableAutoPlay }) => {
    
    const nextUpcomingDraw = useMemo(() => {
        return raffleDraws.slice().sort((a,b) => new Date(a.drawTime).getTime() - new Date(b.drawTime).getTime()).find(d => new Date(d.drawTime) > new Date()) || raffleDraws[raffleDraws.length -1];
    }, [raffleDraws]);
    
    return (
        <div className="container mx-auto px-4 space-y-6">
            <AutoPlayStatus config={currentUserData.autoPlayConfig} onDisable={onDisableAutoPlay} />
            <RaffleDrawingAnimation draw={nextUpcomingDraw} participants={adminSettings.raffleParticipants} />
            <NumberSelection onPlay={onPlayScheduledRaffle} tiers={raffleTiers} draws={raffleDraws} />
        </div>
    );
};
