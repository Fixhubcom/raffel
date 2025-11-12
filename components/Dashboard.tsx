
import React from 'react';
import type { Wallet, WithdrawableWallet, PointsWallet, LottoTier, Transaction, CoinCharacter, Winner, Ad } from '../types';
import { TransactionType } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { WinnersTicker } from './WinnersTicker';
import { AdsBanner } from './AdsBanner';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const WalletSummaryCard: React.FC<{ title: string; balance: string; icon: string; shadowColor: string }> = ({ title, balance, icon, shadowColor }) => (
    <div className={`p-4 rounded-lg shadow-lg flex-1 bg-space-card border border-space-border/50`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-white mt-1" style={{ textShadow: `0 0 8px ${shadowColor}` }}>{balance}</p>
            </div>
            <div className={`text-3xl text-white opacity-40`} style={{ filter: `drop-shadow(0 0 5px ${shadowColor})` }}>
                <i className={icon}></i>
            </div>
        </div>
    </div>
);

const QuickActionButton: React.FC<{ label: string; icon: string; onClick?: () => void }> = ({ label, icon, onClick }) => (
    <div className="flex flex-col items-center space-y-2">
        <button onClick={onClick} className="w-14 h-14 bg-space-blue rounded-full flex items-center justify-center text-star-yellow text-2xl shadow-lg border border-space-border hover:bg-space-border transition transform hover:scale-110 hover:shadow-glow-yellow">
            <i className={icon}></i>
        </button>
        <span className="text-xs text-gray-300 uppercase tracking-wider">{label}</span>
    </div>
);


const LottoTierCard: React.FC<{ tier: LottoTier, onViewLotto: () => void }> = ({ tier, onViewLotto }) => {
    const tierConfig = {
        Basic: {
            borderColor: 'border-blue-500',
            shadow: 'shadow-glow-blue',
            glowColor: 'rgba(59, 130, 246, 0.8)'
        },
        Intermediate: {
            borderColor: 'border-cyber-pink',
            shadow: 'shadow-glow-pink',
            glowColor: 'rgba(236, 72, 153, 0.8)'
        },
        Pro: {
            borderColor: 'border-star-yellow',
            shadow: 'shadow-glow-yellow',
            glowColor: 'rgba(251, 191, 36, 0.8)'
        },
    };

    const config = tierConfig[tier.level];

    return (
        <div className={`min-w-[85vw] md:min-w-0 md:w-full bg-space-card rounded-2xl ${config.shadow} border ${config.borderColor} p-5 flex flex-col relative overflow-hidden`}>
            <svg className="absolute top-0 left-0 w-full h-full opacity-10" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(58, 66, 125, 0.7)" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold tracking-widest">{tier.level.toUpperCase()}</h3>
                        <p className="text-sm opacity-80 font-semibold">Entry: {formatCurrency(tier.entryFee)}</p>
                    </div>
                    <div className="bg-space-dark/60 px-3 py-1.5 rounded-lg border border-white/20 text-lg font-bold">
                        {formatCurrency(tier.prizePool)}
                    </div>
                </div>
                <div className="my-6 flex-grow flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm opacity-80 uppercase tracking-widest">Next Draw</p>
                    <CountdownTimer targetDate={tier.drawTime} glowColor={config.glowColor} />
                </div>
                <button 
                  onClick={onViewLotto}
                  className={`w-full font-bold text-lg py-3 rounded-lg transition transform hover:scale-105 border ${config.borderColor} bg-black/30 hover:bg-black/50 ${config.shadow}`}
                  style={{ textShadow: `0 0 5px ${config.glowColor}` }}
                >
                    VIEW DRAWS
                </button>
            </div>
        </div>
    );
};

const CoinCharacterCard: React.FC<{ coin: CoinCharacter }> = ({ coin }) => {
    const rarityStyles = {
        Common: { // Bronze
            metal: 'bg-gradient-to-br from-yellow-700 via-amber-800 to-yellow-900',
            shadow: 'shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),_0_4px_10px_rgba(0,0,0,0.5)]',
            iconColor: 'text-amber-200',
            ring: 'ring-amber-800'
        },
        Uncommon: { // Silver
            metal: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500',
            shadow: 'shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),_0_4px_10px_rgba(0,0,0,0.5)]',
            iconColor: 'text-slate-800',
            ring: 'ring-slate-300'
        },
        Rare: { // Gem-like Blue
            metal: 'bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800',
            shadow: 'shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),_0_4px_10px_rgba(0,0,0,0.5)] shadow-glow-blue',
            iconColor: 'text-blue-100',
            ring: 'ring-blue-400'
        },
        Mythic: { // Gold
            metal: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500',
            shadow: 'shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),_0_4px_10px_rgba(251,191,36,0.6)] shadow-glow-yellow',
            iconColor: 'text-yellow-800',
            ring: 'ring-amber-400'
        },
    };
    
    const config = rarityStyles[coin.rarity];
    
    return (
        <div className={`group relative w-full h-56 flex flex-col justify-center items-center p-3 rounded-lg text-white transition-transform transform hover:-translate-y-2`}>
            {/* The 3D coin */}
            <div className={`relative w-36 h-36 rounded-full flex items-center justify-center ${config.metal} ${config.shadow} ring-8 ${config.ring} cursor-pointer transition-transform group-hover:scale-110`}>
                 <i className={`${coin.icon} text-6xl ${config.iconColor} drop-shadow-lg`}></i>
                 {/* Shine effect */}
                 <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-white/20 blur-xl transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                 </div>
            </div>
            <div className="mt-4 text-center">
                <h4 className="font-bold text-lg">{coin.name}</h4>
                <p className={`text-sm font-semibold text-gray-400`}>
                    {coin.rarity}
                </p>
            </div>
        </div>
    );
};


const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const typeInfo = {
        [TransactionType.DEPOSIT]: { icon: 'fa-download', color: 'text-nova-green' },
        [TransactionType.LOTTO_WIN]: { icon: 'fa-trophy', color: 'text-star-yellow' },
        [TransactionType.LOTTO_ENTRY]: { icon: 'fa-ticket-alt', color: 'text-cyber-pink' },
        [TransactionType.REFERRAL_BONUS]: { icon: 'fa-users', color: 'text-blue-400' },
        [TransactionType.WITHDRAWAL]: { icon: 'fa-upload', color: 'text-red-400' },
        [TransactionType.WITHDRAWAL_FEE]: { icon: 'fa-file-invoice-dollar', color: 'text-red-400' },
        [TransactionType.POINTS_CONVERSION]: { icon: 'fa-exchange-alt', color: 'text-purple-400' }
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-space-border/50">
            <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full bg-space-card flex items-center justify-center ${typeInfo[tx.type].color}`}>
                    <i className={`fas ${typeInfo[tx.type].icon}`}></i>
                </div>
                <div>
                    <p className="font-semibold text-white">{tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
            </div>
            <div>
                 <p className={`font-bold ${tx.amount > 0 ? 'text-nova-green' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
                <p className={`text-xs text-right ${tx.status === 'Completed' ? 'text-gray-400' : tx.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>{tx.status}</p>
            </div>
        </div>
    );
};

interface DashboardProps {
  depositWallet: Wallet;
  withdrawableWallet: WithdrawableWallet;
  pointsWallet: PointsWallet;
  lottoTiers: LottoTier[];
  transactions: Transaction[];
  coinCharacters: CoinCharacter[];
  recentWinners: Winner[];
  ads: Ad[];
  onConvert: () => void;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ depositWallet, withdrawableWallet, pointsWallet, lottoTiers, transactions, coinCharacters, recentWinners, ads, onConvert, setActiveTab }) => {
    return (
        <div className="container mx-auto px-4 space-y-6">
            <div className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-wider">PLAYER DASHBOARD</h1>
                <p className="text-gray-400">Overview of your resources and activities.</p>
            </div>

            <section id="wallets" className="space-y-3 md:space-y-0 md:flex md:space-x-4">
                <WalletSummaryCard title="DEPOSIT WALLET" balance={formatCurrency(depositWallet.availableBalance)} icon="fa-wallet" shadowColor="rgba(59, 130, 246, 0.5)" />
                <WalletSummaryCard title="WINNINGS WALLET" balance={formatCurrency(withdrawableWallet.balance)} icon="fa-hand-holding-usd" shadowColor="rgba(52, 211, 153, 0.5)" />
                <WalletSummaryCard title="EXP Points" balance={pointsWallet.balance.toLocaleString()} icon="fa-star" shadowColor="rgba(251, 191, 36, 0.5)" />
            </section>
            
            <section id="quick-actions" className="bg-space-card/70 p-4 rounded-lg shadow-lg border border-space-border">
                 <div className="flex justify-around">
                    <QuickActionButton label="Deposit" icon="fa-plus" onClick={() => setActiveTab('wallet')} />
                    <QuickActionButton label="Games" icon="fa-gamepad" onClick={() => setActiveTab('play')} />
                    <QuickActionButton label="Convert" icon="fa-exchange-alt" onClick={onConvert}/>
                    <QuickActionButton label="Refer" icon="fa-share-alt" onClick={() => setActiveTab('referrals')} />
                 </div>
            </section>
            
            <AdsBanner ads={ads} />

            <WinnersTicker winners={recentWinners} />

            <section id="raffles">
                <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wider">LOTTERY DRAWS</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-6 md:space-x-0 md:mx-0 md:px-0">
                    {lottoTiers.map(tier => <LottoTierCard key={tier.level} tier={tier} onViewLotto={() => setActiveTab('raffles')} />)}
                </div>
            </section>
            
            <section id="coin-collection">
                <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wider">COLLECTION</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {coinCharacters.slice(0, 4).map(coin => <CoinCharacterCard key={coin.id} coin={coin} />)}
                </div>
            </section>

             <section id="transactions">
                <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-wider">ACTIVITY LOG</h2>
                <div className="bg-space-card/70 p-4 rounded-lg shadow-lg border border-space-border">
                    {transactions.length > 0 ? transactions.slice(0, 5).map(tx => <TransactionRow key={tx.id} tx={tx} />) : <p className="text-center text-gray-400 py-4">No recent activity.</p>}
                </div>
            </section>

        </div>
    );
};
