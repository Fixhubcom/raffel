
import React, { useState } from 'react';
import type { User, Wallet, WithdrawableWallet, PointsWallet, RaffleTier, Transaction, CoinCharacter, SpinWheelPrize, Referral, TriviaQuestion } from './types';
import { TransactionType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { WalletPage } from './components/WalletPage';
import { ProfilePage } from './components/ProfilePage';
import { PlayPage } from './components/PlayPage';
import { ReferralPage } from './components/ReferralPage';
import { RafflesPage } from './components/RafflesPage';
import { Modal } from './components/Modal';
import { TriviaModal } from './components/TriviaModal';
import { StarstoneMinerModal } from './components/StarstoneMinerModal';
import LandingPage from './components/LandingPage';
import { AdminPage } from './components/AdminPage';


// --- INITIAL MOCKED DATA ---
const getNextDrawTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const nextDrawHour = (Math.floor(hours / 4) + 1) * 4;
  const nextDraw = new Date(now);
  if (nextDrawHour >= 24) {
    nextDraw.setDate(nextDraw.getDate() + 1);
    nextDraw.setHours(0, 0, 0, 0);
  } else {
    nextDraw.setHours(nextDrawHour, 0, 0, 0);
  }
  return nextDraw;
};

const nextDraw = getNextDrawTime();

const MOCK_USERS: User[] = [
    { id: 'usr_12345', name: 'Alex Ryder', email: 'alex.ryder@example.com', avatarUrl: `https://i.pravatar.cc/150?u=a042581f4e29026704d`, kycVerified: true, referralCode: 'ALEXR2024', referrals: [{ id: 'ref1', name: 'Bob K.', status: 'Completed', reward: 5.00, date: '2024-05-20' }] },
    { id: 'usr_67890', name: 'Zane Orbit', email: 'zane.orbit@example.com', avatarUrl: `https://i.pravatar.cc/150?u=b042581f4e29026704e`, kycVerified: true, referralCode: 'ZANEO2024', referrals: [{ id: 'ref3', name: 'Eve A.', status: 'Completed', reward: 5.00, date: '2024-05-21' }, { id: 'ref4', name: 'Frank G.', status: 'Pending', reward: 5.00, date: '2024-05-23' }] },
    { id: 'usr_abcde', name: 'Cora Nova', email: 'cora.nova@example.com', avatarUrl: `https://i.pravatar.cc/150?u=c042581f4e29026704f`, kycVerified: false, referralCode: 'CORAN2024', referrals: [] },
    { id: 'usr_fghij', name: 'Leo Stelar', email: 'leo.stelar@example.com', avatarUrl: `https://i.pravatar.cc/150?u=d042581f4e29026704g`, kycVerified: false, referralCode: 'LEOS2024', referrals: [{ id: 'ref5', name: 'Grace H.', status: 'Completed', reward: 5.00, date: '2024-05-19' }] }
];


const MOCK_TRIVIA_QUESTIONS: TriviaQuestion[] = [
    { question: 'What is the largest planet in our solar system?', options: ['Earth', 'Jupiter', 'Saturn', 'Mars'], correctAnswerIndex: 1, points: 100 },
    { question: 'Which galaxy is closest to the Milky Way?', options: ['Andromeda', 'Triangulum', 'Whirlpool', 'Sombrero'], correctAnswerIndex: 0, points: 150 },
    { question: 'What phenomenon allows for faster-than-light travel in science fiction?', options: ['Wormhole', 'Hyperdrive', 'Quantum Tunneling', 'Solar Sails'], correctAnswerIndex: 1, points: 100 },
];

const ALL_USERS_DATA = {
    'usr_12345': {
        depositWallet: { totalDeposited: 500, totalSpent: 150, availableBalance: 350 },
        withdrawableWallet: { balance: 505.00 },
        pointsWallet: { balance: 2500 },
        transactions: [
            { id: '1', type: TransactionType.DEPOSIT, amount: 100, date: '2024-05-21 10:30 AM', status: 'Completed' },
            { id: '2', type: TransactionType.RAFFLE_WIN, amount: 500, date: '2024-05-21 08:00 AM', status: 'Completed' },
            { id: '3', type: TransactionType.RAFFLE_ENTRY, amount: -10, date: '2024-05-21 07:55 AM', status: 'Completed' },
            { id: '4', type: TransactionType.REFERRAL_BONUS, amount: 5.00, date: '2024-05-20 04:15 PM', status: 'Completed' },
        ],
        coinCharacters: [
            { id: 'c1', name: 'Bronze Bit', rarity: 'Common', icon: 'fas fa-coins', description: 'A common coin found in daily check-ins.', bgColor: 'bg-gradient-to-br from-yellow-800 to-slate-800' },
            { id: 'c2', name: 'Silver Stake', rarity: 'Uncommon', icon: 'fas fa-compact-disc', description: 'Awarded for winning small raffles.', bgColor: 'bg-gradient-to-br from-slate-600 to-slate-800' },
            { id: 'c3', name: 'Raffle Ruby', rarity: 'Rare', icon: 'fas fa-gem', description: 'A rare gem for the dedicated player.', bgColor: 'bg-gradient-to-br from-red-700 to-slate-800' },
            { id: 'c5', name: 'Quantum Quartz', rarity: 'Rare', icon: 'fas fa-atom', description: 'A crystal pulsating with unstable energy.', bgColor: 'bg-gradient-to-br from-purple-700 to-slate-800' },
            { id: 'c4', name: 'Golden Griffin', rarity: 'Mythic', icon: 'fas fa-dragon', description: 'A legendary coin for top performers.', bgColor: 'bg-gradient-to-br from-amber-600 to-slate-800' },
        ],
    },
    'usr_67890': {
        depositWallet: { totalDeposited: 2000, totalSpent: 800, availableBalance: 1200 },
        withdrawableWallet: { balance: 15000.00 },
        pointsWallet: { balance: 12500 },
        transactions: [
            { id: '6', type: TransactionType.DEPOSIT, amount: 1000, date: '2024-05-22 11:00 AM', status: 'Completed' },
            { id: '7', type: TransactionType.RAFFLE_WIN, amount: 10000, date: '2024-05-22 08:00 AM', status: 'Completed' },
            { id: '8', type: TransactionType.RAFFLE_ENTRY, amount: -100, date: '2024-05-22 07:50 AM', status: 'Completed' },
        ],
        coinCharacters: [{ id: 'c4', name: 'Golden Griffin', rarity: 'Mythic', icon: 'fas fa-dragon', description: 'A legendary coin for top performers.', bgColor: 'bg-gradient-to-br from-amber-600 to-slate-800' }],
    },
    'usr_abcde': {
        depositWallet: { totalDeposited: 100, totalSpent: 20, availableBalance: 80 },
        withdrawableWallet: { balance: 0 },
        pointsWallet: { balance: 500 },
        transactions: [
             { id: '9', type: TransactionType.DEPOSIT, amount: 100, date: '2024-05-23 09:00 AM', status: 'Completed' },
             { id: '10', type: TransactionType.RAFFLE_ENTRY, amount: -10, date: '2024-05-23 09:05 AM', status: 'Completed' },
        ],
        coinCharacters: [],
    },
    'usr_fghij': {
        depositWallet: { totalDeposited: 50, totalSpent: 50, availableBalance: 0 },
        withdrawableWallet: { balance: 25.00 },
        pointsWallet: { balance: 1200 },
        transactions: [
            { id: '11', type: TransactionType.DEPOSIT, amount: 50, date: '2024-05-19 01:00 PM', status: 'Completed' },
        ],
        coinCharacters: [{ id: 'c3', name: 'Raffle Ruby', rarity: 'Rare', icon: 'fas fa-gem', description: 'A rare gem for the dedicated player.', bgColor: 'bg-gradient-to-br from-red-700 to-slate-800' }],
    }
};


const STATIC_DATA = {
  raffleTiers: [
    { level: 'Basic', entryFee: 1, prizeRange: '$1k-$10k', prizePool: 8500, drawTime: nextDraw, celestialBody: { name: 'Bronze Asteroid', className: 'animate-spin' } },
    { level: 'Intermediate', entryFee: 5, prizeRange: '$10k-$100k', prizePool: 75000, drawTime: nextDraw, celestialBody: { name: 'Silver Nebula', className: 'animate-pulse' } },
    { level: 'Pro', entryFee: 10, prizeRange: '$100k-$1M', prizePool: 550000, drawTime: nextDraw, celestialBody: { name: 'Golden Galaxy', className: 'animate-spin-slow' } },
  ] as RaffleTier[],
  spinWheelPrizes: [
    { label: '$10', value: 10, type: 'cash', color: '#6366F1'},
    { label: '500 Pts', value: 500, type: 'points', color: '#F59E0B' },
    { label: 'Try Again', value: 0, type: 'none', color: '#4B5563' },
    { label: '$50', value: 50, type: 'cash', color: '#EC4899' },
    { label: '1000 Pts', value: 1000, type: 'points', color: '#F59E0B' },
    { label: 'Bronze Bit', value: 1, type: 'coin', color: '#92400E' },
    { label: '$5', value: 5, type: 'cash', color: '#6366F1' },
    { label: 'Jackpot!', value: 1000, type: 'cash', color: '#10B981' },
  ] as SpinWheelPrize[],
};
// --- END INITIAL MOCKED DATA ---


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [users, setUsers] = useState(MOCK_USERS);
  const [usersData, setUsersData] = useState(ALL_USERS_DATA);
  
  const [currentUser] = useState(MOCK_USERS[0]);
  const currentUserData = usersData[currentUser.id];

  // Modal states
  const [playTier, setPlayTier] = useState<RaffleTier | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showWinSplash, setShowWinSplash] = useState(false);
  const [showLossSplash, setShowLossSplash] = useState(false);
  const [lastRaffleResult, setLastRaffleResult] = useState({ prize: 0, tier: '' });

  // Game states
  const [showTriviaModal, setShowTriviaModal] = useState(false);
  const [showMinerModal, setShowMinerModal] = useState(false);

  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handlePlayRaffle = (tier: RaffleTier) => {
      setPlayTier(tier);
  };
  
  const confirmPlay = () => {
      if (!playTier) return;
      
      if(currentUserData.depositWallet.availableBalance < playTier.entryFee) {
          showNotification('error', 'Insufficient funds to enter raffle.');
          setPlayTier(null);
          return;
      }
      
      const isWin = Math.random() > 0.5; // 50% chance to win
      let prizeAmount = 0;
      if (isWin) {
          prizeAmount = playTier.entryFee * (10 + Math.random() * 10); // Win 10x-20x entry fee
      }
      setLastRaffleResult({ prize: prizeAmount, tier: playTier.level });

      setUsersData(prevData => {
          const newUserData = { ...prevData[currentUser.id] };
          const entryTx: Transaction = {
              id: String(newUserData.transactions.length + 100),
              type: TransactionType.RAFFLE_ENTRY,
              amount: -playTier.entryFee,
              date: new Date().toLocaleString(),
              status: 'Completed',
              result: { type: isWin ? 'win' : 'loss' }
          };
          
          let winTx: Transaction | null = null;
          if (isWin) {
              winTx = {
                id: String(newUserData.transactions.length + 101),
                type: TransactionType.RAFFLE_WIN,
                amount: prizeAmount,
                date: new Date().toLocaleString(),
                status: 'Completed'
              };
          }
          
          const newTransactions = winTx ? [winTx, entryTx, ...newUserData.transactions] : [entryTx, ...newUserData.transactions];

          newUserData.depositWallet.availableBalance -= playTier.entryFee;
          newUserData.depositWallet.totalSpent += playTier.entryFee;
          newUserData.withdrawableWallet.balance += prizeAmount;
          newUserData.transactions = newTransactions;

          return { ...prevData, [currentUser.id]: newUserData };
      });
      
      setPlayTier(null);
      setTimeout(() => {
        isWin ? setShowWinSplash(true) : setShowLossSplash(true);
      }, 300);
  }

  const handleDeposit = (amount: number, currency: string) => {
    // This is a mock, so we just add a pending transaction
    showNotification('info', `Deposit of ${currency === 'USD' ? '$' : ''}${amount} ${currency !== 'USD' ? currency : ''} is processing.`);
    setShowDepositModal(false);
  };

  const handleWithdraw = (amount: number, address: string, currency: string) => {
    if (amount > currentUserData.withdrawableWallet.balance) {
      showNotification('error', 'Withdrawal amount exceeds available balance.');
      return;
    }
    if (amount > 10000 && !currentUser.kycVerified) {
      showNotification('error', 'KYC verification required for withdrawals over $10,000.');
      return;
    }

    showNotification('success', `Withdrawal of ${amount.toFixed(2)} ${currency} to ${address} is processing.`);
    setShowWithdrawModal(false);
  };

  const handleVerifyKyc = () => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, kycVerified: true } : u));
    showNotification('success', 'KYC Verification Successful!');
  };

  const handleConvertPoints = (points: number) => {
    const conversionRate = 1000; // 1000 points = $1
    if (points > currentUserData.pointsWallet.balance) {
      showNotification('error', 'Insufficient points.');
      return;
    }
    const convertedAmount = points / conversionRate;
    setUsersData(prev => {
        const newUserData = { ...prev[currentUser.id] };
        newUserData.pointsWallet.balance -= points;
        newUserData.withdrawableWallet.balance += convertedAmount;
        return { ...prev, [currentUser.id]: newUserData };
    });
    showNotification('success', `${points} points converted to $${convertedAmount.toFixed(2)}!`);
    setShowConvertModal(false);
  }

  const handleSpinWin = (prize: SpinWheelPrize) => {
    if (prize.type === 'none') {
      showNotification('info', 'Better luck next time!');
      return;
    }
    // Logic to update balances based on prize
    showNotification('success', `You won ${prize.label}!`);
  }

  const handleTriviaEnd = (pointsWon: number) => {
    setUsersData(prev => {
        const newUserData = { ...prev[currentUser.id] };
        newUserData.pointsWallet.balance += pointsWon;
        return { ...prev, [currentUser.id]: newUserData };
    });
    showNotification('success', `You earned ${pointsWon} EXP Points from the trivia!`);
    setShowTriviaModal(false);
  }

  const handleMiningEnd = (pointsWon: number) => {
     setUsersData(prev => {
        const newUserData = { ...prev[currentUser.id] };
        newUserData.pointsWallet.balance += pointsWon;
        return { ...prev, [currentUser.id]: newUserData };
    });
    showNotification('success', `You mined ${pointsWon} EXP Points!`);
    setShowMinerModal(false);
  }
  
  const NotificationBanner = () => {
    if(!notification) return null;
    const colors = {
      success: 'bg-nova-green',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    }
    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 ${colors[notification.type]} text-white px-6 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down`}>
            {notification.message}
        </div>
    )
  }

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <Dashboard 
          depositWallet={currentUserData.depositWallet}
          withdrawableWallet={currentUserData.withdrawableWallet}
          pointsWallet={currentUserData.pointsWallet}
          raffleTiers={STATIC_DATA.raffleTiers}
          transactions={currentUserData.transactions}
          coinCharacters={currentUserData.coinCharacters}
          onConvert={() => setShowConvertModal(true)}
          setActiveTab={setActiveTab}
        />;
      case 'raffles':
        return <RafflesPage raffleTiers={STATIC_DATA.raffleTiers} onPlayRaffle={handlePlayRaffle} />;
      case 'play':
        return <PlayPage 
          onSpinWheel={() => setShowSpinWheel(true)}
          onStartTrivia={() => setShowTriviaModal(true)}
          onStartMining={() => setShowMinerModal(true)}
        />;
       case 'referrals':
        return <ReferralPage user={currentUser} />;
      case 'wallet':
        return <WalletPage 
          depositWallet={currentUserData.depositWallet}
          withdrawableWallet={currentUserData.withdrawableWallet}
          pointsWallet={currentUserData.pointsWallet}
          transactions={currentUserData.transactions}
          onDeposit={() => setShowDepositModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
        />;
      case 'profile':
        return <ProfilePage user={currentUser} onVerifyKyc={handleVerifyKyc} setActiveTab={setActiveTab} />;
      case 'admin':
        return <AdminPage users={users} allUsersData={usersData} />;
      default:
        return <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mt-16 text-lg">
            The <span className="font-bold text-white">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> page is under construction.
          </p>
        </div>;
    }
  }

  return (
    <div className="min-h-screen bg-space-dark font-sans">
      <Header setActiveTab={setActiveTab} pointsBalance={currentUserData.pointsWallet.balance} onLogout={handleLogout} />
      <NotificationBanner />
      <main className="pt-20 pb-24 md:pb-8">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* --- Modals & Splashes --- */}
      <SupernovaWinSplash isOpen={showWinSplash} onClose={() => setShowWinSplash(false)} result={lastRaffleResult} />
      <WormholeLossSplash isOpen={showLossSplash} onClose={() => setShowLossSplash(false)} />

      <DepositModal 
        isOpen={showDepositModal} 
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit} 
      />
      <WithdrawModal 
        isOpen={showWithdrawModal} 
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        withdrawableBalance={currentUserData.withdrawableWallet.balance}
        isKycVerified={currentUser.kycVerified}
        onVerifyKyc={() => {
            setShowWithdrawModal(false);
            setActiveTab('profile');
        }}
      />
      <ConvertModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvertPoints}
        pointsBalance={currentUserData.pointsWallet.balance}
      />
       <SpinWheelModal
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        prizes={STATIC_DATA.spinWheelPrizes}
        onSpinEnd={handleSpinWin}
      />
      <TriviaModal
        isOpen={showTriviaModal}
        onClose={() => setShowTriviaModal(false)}
        questions={MOCK_TRIVIA_QUESTIONS}
        onComplete={handleTriviaEnd}
      />
      <StarstoneMinerModal
        isOpen={showMinerModal}
        onClose={() => setShowMinerModal(false)}
        onComplete={handleMiningEnd}
      />
      
      <Modal isOpen={!!playTier} onClose={() => setPlayTier(null)} title="Confirm Hyperdrive Jump">
        {playTier && (
          <div>
            <p className="mb-6">Engage thrusters for the <span className="font-bold text-star-yellow">{playTier.level}</span> raffle? This will consume <span className="font-bold text-star-yellow">${playTier.entryFee}</span> from your Deposit Tanks.</p>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setPlayTier(null)} className="px-4 py-2 bg-space-border rounded-lg hover:bg-gray-600">Cancel</button>
                <button onClick={confirmPlay} className="px-4 py-2 bg-cyber-pink text-white rounded-lg hover:bg-pink-700 shadow-glow-pink">Confirm Jump</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const SupernovaWinSplash: React.FC<{ isOpen: boolean, onClose: () => void, result: { prize: number, tier: string } }> = ({ isOpen, onClose, result }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col justify-center items-center z-50 text-center p-4">
            <div className="animate-supernova">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-star-yellow to-amber-300" style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.8)' }}>SUPERNOVA!</h1>
                <p className="text-2xl text-white mt-2">You won the {result.tier} raffle!</p>
                <p className="text-5xl font-bold text-nova-green mt-6" style={{ textShadow: '0 0 20px rgba(52, 211, 153, 0.7)' }}>+${result.prize.toFixed(2)}</p>
                <p className="text-gray-300 mt-2">The credits have been added to your withdrawable wallet.</p>
            </div>
            <button onClick={onClose} className="mt-12 bg-star-yellow text-space-dark font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition">Continue</button>
        </div>
    )
}

const WormholeLossSplash: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
     if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col justify-center items-center z-50 text-center p-4">
            <div className="animate-wormhole">
                <div className="text-8xl md:text-9xl">👽</div>
                <h1 className="text-4xl md:text-5xl font-bold text-cyber-pink mt-4">Wormhole Collapsed!</h1>
                <p className="text-lg text-gray-300 mt-2">Transmission lost... Better luck on the next jump!</p>
            </div>
            <button onClick={onClose} className="mt-12 bg-cyber-pink text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition">Try Again</button>
        </div>
    )
}


// Deposit Modal Component
const DepositModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, currency: string) => void;
}> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BTC' | 'ETH'>('USD');
  const cryptoDetails = {
      BTC: { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      ETH: { address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      onDeposit(depositAmount, currency);
      setAmount('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Currency</label>
          <div className="flex space-x-2 rounded-lg bg-space-border p-1">
            {(['USD', 'BTC', 'ETH'] as const).map(c => (
                 <button type="button" key={c} onClick={() => setCurrency(c)} className={`flex-1 p-2 text-sm rounded-md font-bold transition ${currency === c ? 'bg-space-blue shadow-md' : 'text-gray-300 hover:bg-space-card'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none"
            placeholder={currency === 'USD' ? 'e.g., 100' : 'e.g., 0.05'}
            step="any"
            min="0.0001"
            required
          />
        </div>
        
        {currency !== 'USD' && (
            <div className="text-center bg-space-border p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Send {currency} to this address</p>
                <img src={cryptoDetails[currency].qr} alt={`${currency} QR Code`} className="mx-auto my-2 rounded-lg" />
                <p className="text-xs text-star-yellow break-all bg-space-dark p-2 rounded-md">{cryptoDetails[currency].address}</p>
                <p className="text-xs text-gray-400 mt-2">Your deposit will be credited after network confirmation.</p>
            </div>
        )}

        <div className="flex justify-end space-x-4 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-space-border rounded-lg hover:bg-gray-600">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-cyber-pink text-white rounded-lg hover:bg-pink-700 shadow-glow-pink">Confirm Deposit</button>
        </div>
      </form>
    </Modal>
  );
};


// Withdraw Modal Component
const WithdrawModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, address: string, currency: string) => void;
  withdrawableBalance: number;
  isKycVerified: boolean;
  onVerifyKyc: () => void;
}> = ({ isOpen, onClose, onWithdraw, withdrawableBalance, isKycVerified, onVerifyKyc }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BTC' | 'ETH'>('USD');
  const withdrawAmount = parseFloat(amount) || 0;
  
  const needsKyc = withdrawAmount > 10000 && !isKycVerified;
  const isApproachingKycLimit = withdrawAmount > 9000 && withdrawAmount <= 10000 && !isKycVerified;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > 0 && address && !needsKyc) {
      onWithdraw(withdrawAmount, address, currency);
      setAmount('');
      setAddress('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-space-border rounded-md text-center">
            <p className="text-sm text-gray-300">Withdrawable Balance</p>
            <p className="text-2xl font-bold text-nova-green">${withdrawableBalance.toFixed(2)}</p>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Currency</label>
          <div className="flex space-x-2 rounded-lg bg-space-border p-1">
            {(['USD', 'BTC', 'ETH'] as const).map(c => (
                 <button type="button" key={c} onClick={() => setCurrency(c)} className={`flex-1 p-2 text-sm rounded-md font-bold transition ${currency === c ? 'bg-space-blue shadow-md' : 'text-gray-300 hover:bg-space-card'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (USD Value)</label>
          <input
            type="number"
            id="withdraw-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none"
            placeholder="0.00"
            max={withdrawableBalance}
            step="any"
            required
          />
        </div>
         <div>
          <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-300 mb-1">
            {currency === 'USD' ? 'Bank Account / E-Wallet' : `${currency} Wallet Address`}
          </label>
          <input
            type="text"
            id="wallet-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none"
            placeholder={currency === 'USD' ? 'Enter your account details' : `Enter your ${currency} wallet address`}
            required
          />
        </div>
        {isApproachingKycLimit && (
            <div className="p-3 bg-blue-900/50 border border-blue-600 rounded-md text-center text-blue-300 space-y-1">
                <p className="font-bold"><i className="fas fa-info-circle mr-2"></i>Heads Up!</p>
                <p className="text-sm">Withdrawals over $10,000 require KYC verification. You can complete it now to avoid future delays.</p>
                <button type="button" onClick={onVerifyKyc} className="mt-2 text-sm font-bold underline hover:text-white">Start KYC Process</button>
            </div>
        )}
        {needsKyc && (
          <div className="p-3 bg-yellow-900/50 border border-yellow-600 rounded-md text-center text-yellow-300">
            <p className="font-bold">KYC Verification Required</p>
            <p className="text-sm">Withdrawals over $10,000 require identity verification.</p>
            <button type="button" onClick={onVerifyKyc} className="mt-2 text-sm font-bold underline hover:text-white">Start KYC Process</button>
          </div>
        )}
        <div className="flex justify-end space-x-4 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-space-border rounded-lg hover:bg-gray-600">Cancel</button>
          <button type="submit" disabled={needsKyc} className="px-4 py-2 bg-cyber-pink text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-glow-pink">Withdraw</button>
        </div>
      </form>
    </Modal>
  );
};

const ConvertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConvert: (points: number) => void;
  pointsBalance: number;
}> = ({ isOpen, onClose, onConvert, pointsBalance }) => {
    const [points, setPoints] = useState('');
    const pointsToConvert = parseInt(points) || 0;
    const conversionRate = 1000; // 1000 points = $1
    const convertedValue = (pointsToConvert / conversionRate).toFixed(2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pointsToConvert > 0) {
            onConvert(pointsToConvert);
            setPoints('');
        }
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Convert Points">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-space-border rounded-md text-center">
                    <p className="text-sm text-gray-300">Available Points</p>
                    <p className="text-2xl font-bold text-star-yellow">{pointsBalance.toLocaleString()}</p>
                </div>
                <div>
                    <label htmlFor="points-amount" className="block text-sm font-medium text-gray-300 mb-1">Points to Convert</label>
                    <input
                        type="number"
                        id="points-amount"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none"
                        placeholder="e.g., 1000"
                        max={pointsBalance}
                        required
                    />
                </div>
                <div className="text-center">
                    <i className="fas fa-arrow-down text-2xl text-gray-400"></i>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Converted Value (USD)</label>
                    <div className="w-full bg-space-border p-2 rounded-md text-nova-green font-bold text-lg">${convertedValue}</div>
                </div>
                <p className="text-xs text-gray-400 text-center">Conversion Rate: {conversionRate} Points = $1.00</p>
                <div className="flex justify-end space-x-4 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-space-border rounded-lg hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-cyber-pink text-white rounded-lg hover:bg-pink-700 shadow-glow-pink">Convert</button>
                </div>
            </form>
        </Modal>
    )
}

const SpinWheelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  prizes: SpinWheelPrize[];
  onSpinEnd: (prize: SpinWheelPrize) => void;
}> = ({ isOpen, onClose, prizes, onSpinEnd }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        const winnerIndex = Math.floor(Math.random() * prizes.length);
        const degreesPerSegment = 360 / prizes.length;
        const randomOffset = Math.random() * degreesPerSegment * 0.8 - (degreesPerSegment * 0.4);
        const finalRotation = (360 * 5) - (winnerIndex * degreesPerSegment) - randomOffset;
        
        setRotation(finalRotation);

        setTimeout(() => {
            setSpinning(false);
            onSpinEnd(prizes[winnerIndex]);
            onClose();
        }, 5000); // Corresponds to animation duration
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Spin & Win">
            <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-72 h-72 md:w-80 md:h-80 mb-6">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-20 text-5xl text-red-500 drop-shadow-lg transform -rotate-45">
                        <i className="fas fa-space-shuttle"></i>
                    </div>
                    <div 
                        className="w-full h-full rounded-full border-8 border-star-yellow shadow-2xl transition-transform duration-[5000ms] ease-out"
                        style={{ 
                            transform: `rotate(${rotation}deg)`,
                            background: `conic-gradient(${prizes.map((p, i) => `${p.color} ${i * (100 / prizes.length)}%, ${p.color} ${(i + 1) * (100 / prizes.length)}%`).join(', ')})`
                        }}
                    >
                        {prizes.map((prize, index) => {
                            const angle = (360 / prizes.length) * index + (360 / prizes.length / 2);
                            return (
                                <div 
                                    key={index}
                                    className="absolute w-full h-full"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                >
                                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-bold text-sm transform -rotate-90 origin-center whitespace-nowrap">
                                        {prize.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button 
                    onClick={handleSpin} 
                    disabled={spinning}
                    className="w-full bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition text-xl disabled:bg-gray-500 disabled:cursor-not-allowed shadow-glow-pink"
                >
                    {spinning ? 'Spinning...' : 'SPIN'}
                </button>
            </div>
        </Modal>
    )
}

export default App;
