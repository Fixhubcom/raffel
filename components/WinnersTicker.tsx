import React from 'react';
import type { Winner } from '../types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const WinnerCard: React.FC<{ winner: Winner }> = ({ winner }) => {
    const tierColors = {
        Basic: 'border-blue-500',
        Intermediate: 'border-cyber-pink',
        Pro: 'border-star-yellow',
    };

    return (
        <div className={`ticker-item bg-space-card/80 p-3 rounded-lg shadow-lg border-l-4 ${tierColors[winner.tier]} flex items-center space-x-3`}>
            <img src={winner.avatarUrl} alt={winner.name} className="w-10 h-10 rounded-full object-cover border-2 border-space-border" />
            <div>
                <p className="font-bold text-white text-sm whitespace-nowrap">{winner.name}</p>
                <p className="text-nova-green font-semibold text-lg">{formatCurrency(winner.prize)}</p>
            </div>
            <i className="fas fa-trophy text-star-yellow/50 ml-auto text-xl"></i>
        </div>
    );
};

interface WinnersTickerProps {
    winners: Winner[];
}

export const WinnersTicker: React.FC<WinnersTickerProps> = ({ winners }) => {
    // Duplicate the winners list to create a seamless loop
    const extendedWinners = [...winners, ...winners];

    return (
        <section id="winners-ticker">
             <div className="ticker-wrap">
                <div className="ticker-move">
                    {extendedWinners.map((winner, index) => (
                        <WinnerCard key={`${winner.id}-${index}`} winner={winner} />
                    ))}
                </div>
            </div>
        </section>
    );
};