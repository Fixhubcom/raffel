


import React, { useState, useEffect } from 'react';
import type { User, Wallet, WithdrawableWallet, PointsWallet, LottoTier, Transaction, CoinCharacter, SpinWheelPrize, Referral, TriviaQuestion, Winner, Ad, ScholarshipQuestion, AdminSettings, UserData, LottoDraw, UserLottoEntry, PlatformActivity, Notification } from './types';
import { TransactionType, PlatformActivityType } from './types';
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
import { ScholarshipQuizModal } from './components/ScholarshipQuizModal';
import LandingPage from './components/LandingPage';
import { AdminPage } from './components/AdminPage';
import { NotificationsModal } from './components/NotificationsModal';


// --- INITIAL MOCKED DATA ---
const getNextDrawTime = (from = new Date()) => {
  const now = new Date(from);
  const hours = now.getHours();
  const nextDrawHour = (Math.floor(hours / 4) + 1) * 4;
  const nextDraw = new Date(now);

  nextDraw.setMinutes(0, 0, 0);

  if (nextDrawHour >= 24) {
    nextDraw.setDate(nextDraw.getDate() + 1);
    nextDraw.setHours(0);
  } else {
    nextDraw.setHours(nextDrawHour);
  }
  return nextDraw;
};

const getUpcomingDraws = (count: number): LottoDraw[] => {
    const draws: LottoDraw[] = [];
    let lastDrawTime = new Date();
    // Start with the next upcoming draw time
    let nextDrawTime = getNextDrawTime();

    for (let i = 0; i < count; i++) {
        const drawDate = i === 0 ? nextDrawTime : getNextDrawTime(lastDrawTime);
        draws.push({
            id: drawDate.toISOString(),
            drawTime: drawDate,
            status: 'Upcoming',
            winningNumbers: [],
            processedForAutoPlay: false,
        });
        lastDrawTime = new Date(drawDate.getTime() + 1000); // increment slightly to get next block
    }
    return draws;
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

const MOCK_SCHOLARSHIP_QUESTIONS: ScholarshipQuestion[] = [
    { question: 'What is the speed of light in a vacuum?', options: ['299,792 km/s', '150,000 km/s', '1,000,000 km/s', '3,000 km/s'], correctAnswerIndex: 0 },
    { question: 'Who developed the theory of relativity?', options: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'], correctAnswerIndex: 2 },
    { question: 'What is the most abundant element in the universe?', options: ['Oxygen', 'Helium', 'Carbon', 'Hydrogen'], correctAnswerIndex: 3 },
    { question: 'Which NASA mission first landed humans on the Moon?', options: ['Apollo 11', 'Voyager 1', 'Mariner 10', 'Pioneer 10'], correctAnswerIndex: 0 },
    { question: 'What is a black hole?', options: ['A very dense star', 'A region of spacetime where gravity is so strong that nothing can escape', 'A wormhole to another dimension', 'The center of a galaxy'], correctAnswerIndex: 1 },
];

const ALL_USERS_DATA: Record<string, UserData> = {
    'usr_12345': {
        depositWallet: { totalDeposited: 500, totalSpent: 150, availableBalance: 350 },
        withdrawableWallet: { balance: 505.00 },
        pointsWallet: { balance: 2500 },
        transactions: [
            { id: '1', type: TransactionType.DEPOSIT, amount: 100, date: '2024-05-21 10:30 AM', status: 'Completed' },
            { id: '2', type: TransactionType.LOTTO_WIN, amount: 500, date: '2024-05-21 08:00 AM', status: 'Completed' },
            { id: '3', type: TransactionType.LOTTO_ENTRY, amount: -10, date: '2024-05-21 07:55 AM', status: 'Completed' },
            { id: '4', type: TransactionType.REFERRAL_BONUS, amount: 5.00, date: '2024-05-20 04:15 PM', status: 'Completed' },
        ],
        coinCharacters: [
            { id: 'c1', name: 'Bronze Bit', rarity: 'Common', icon: 'fas fa-coins', description: 'A common coin found in daily check-ins.', bgColor: 'bg-gradient-to-br from-yellow-800 to-slate-800' },
            { id: 'c2', name: 'Silver Stake', rarity: 'Uncommon', icon: 'fas fa-compact-disc', description: 'Awarded for winning small raffles.', bgColor: 'bg-gradient-to-br from-slate-600 to-slate-800' },
            { id: 'c3', name: 'Raffle Ruby', rarity: 'Rare', icon: 'fas fa-gem', description: 'A rare gem for the dedicated player.', bgColor: 'bg-gradient-to-br from-red-700 to-slate-800' },
            { id: 'c5', name: 'Quantum Quartz', rarity: 'Rare', icon: 'fas fa-atom', description: 'A crystal pulsating with unstable energy.', bgColor: 'bg-gradient-to-br from-purple-700 to-slate-800' },
            { id: 'c4', name: 'Golden Griffin', rarity: 'Mythic', icon: 'fas fa-dragon', description: 'A legendary coin for top performers.', bgColor: 'bg-gradient-to-br from-amber-600 to-slate-800' },
        ],
        lottoEntries: [],
        notifications: [],
        autoPlayConfig: null,
    },
    'usr_67890': {
        depositWallet: { totalDeposited: 2000, totalSpent: 800, availableBalance: 1200 },
        withdrawableWallet: { balance: 15000.00 },
        pointsWallet: { balance: 12500 },
        transactions: [
            { id: '6', type: TransactionType.DEPOSIT, amount: 1000, date: '2024-05-22 11:00 AM', status: 'Completed' },
            { id: '7', type: TransactionType.LOTTO_WIN, amount: 10000, date: '2024-05-22 08:00 AM', status: 'Completed' },
            { id: '8', type: TransactionType.LOTTO_ENTRY, amount: -100, date: '2024-05-22 07:50 AM', status: 'Completed' },
        ],
        coinCharacters: [{ id: 'c4', name: 'Golden Griffin', rarity: 'Mythic', icon: 'fas fa-dragon', description: 'A legendary coin for top performers.', bgColor: 'bg-gradient-to-br from-amber-600 to-slate-800' }],
        lottoEntries: [],
        notifications: [],
        autoPlayConfig: null,
    },
    'usr_abcde': {
        depositWallet: { totalDeposited: 100, totalSpent: 20, availableBalance: 80 },
        withdrawableWallet: { balance: 0 },
        pointsWallet: { balance: 500 },
        transactions: [
             { id: '9', type: TransactionType.DEPOSIT, amount: 100, date: '2024-05-23 09:00 AM', status: 'Completed' },
             { id: '10', type: TransactionType.LOTTO_ENTRY, amount: -10, date: '2024-05-23 09:05 AM', status: 'Completed' },
        ],
        coinCharacters: [],
        lottoEntries: [],
        notifications: [],
        autoPlayConfig: null,
    },
    'usr_fghij': {
        depositWallet: { totalDeposited: 50, totalSpent: 50, availableBalance: 0 },
        withdrawableWallet: { balance: 25.00 },
        pointsWallet: { balance: 1200 },
        transactions: [
            { id: '11', type: TransactionType.DEPOSIT, amount: 50, date: '2024-05-19 01:00 PM', status: 'Completed' },
        ],
        coinCharacters: [{ id: 'c3', name: 'Raffle Ruby', rarity: 'Rare', icon: 'fas fa-gem', description: 'A rare gem for the dedicated player.', bgColor: 'bg-gradient-to-br from-red-700 to-slate-800' }],
        lottoEntries: [],
        notifications: [],
        autoPlayConfig: null,
    }
};

const MOCK_WINNER_POOL = [
    { name: 'John D.', avatarUrl: `https://i.pravatar.cc/150?u=i042581f4e29026704k` },
    { name: 'Jane S.', avatarUrl: `https://i.pravatar.cc/150?u=j042581f4e29026704l` },
    { name: 'Mike B.', avatarUrl: `https://i.pravatar.cc/150?u=k042581f4e29026704m` },
    { name: 'Sarah P.', avatarUrl: `https://i.pravatar.cc/150?u=l042581f4e29026704n` },
    { name: 'Chris L.', avatarUrl: `https://i.pravatar.cc/150?u=m042581f4e29026704o` },
    { name: 'Emily R.', avatarUrl: `https://i.pravatar.cc/150?u=n042581f4e29026704p` },
];

const MOCK_LOTTO_WINS = [
    { tier: 'Basic', prize: 8500 },
    { tier: 'Pro', prize: 550000 },
    { tier: 'Intermediate', prize: 75000 },
    { tier: 'Basic', prize: 9200 },
    { tier: 'Intermediate', prize: 68000 },
    { tier: 'Pro', prize: 490000 },
] as const;

const MOCK_STATIC_DATA = {
  lottoTiers: [
    { level: 'Basic', entryFee: 1, prizeRange: '$1k-$10k', prizePool: 8500, drawTime: nextDraw },
    { level: 'Intermediate', entryFee: 5, prizeRange: '$10k-$100k', prizePool: 75000, drawTime: nextDraw },
    { level: 'Pro', entryFee: 10, prizeRange: '$100k-$1M', prizePool: 550000, drawTime: nextDraw },
  ] as LottoTier[],
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
  ads: [
    {
        id: 'ad1',
        title: 'PRO LOTTO JACKPOT!',
        description: 'The Pro prize pool has reached a record high of $750,000! Enter now for a chance to win.',
        ctaText: 'Enter Pro Lotto',
        imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop',
        theme: 'yellow',
    },
    {
        id: 'ad2',
        title: 'NEW GAME: TRIVIA CHALLENGE',
        description: 'Test your knowledge and win thousands of EXP Points in our new daily trivia game.',
        ctaText: 'Play Now',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57942428?q=80&w=2072&auto=format&fit=crop',
        theme: 'pink',
    },
    {
        id: 'ad3',
        title: 'DOUBLE REFERRAL REWARDS',
        description: 'For a limited time, get double the rewards for every new player you bring to the platform. Expand your reach!',
        ctaText: 'Refer a Friend',
        imageUrl: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=2070&auto=format&fit=crop',
        theme: 'blue',
    },
  ] as Ad[],
};
// --- END INITIAL MOCKED DATA ---


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [users, setUsers] = useState(MOCK_USERS);
  const [usersData, setUsersData] = useState<Record<string, UserData>>(ALL_USERS_DATA);
  const [lottoDraws, setLottoDraws] = useState<LottoDraw[]>(() => getUpcomingDraws(6));
  
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [platformActivityLog, setPlatformActivityLog] = useState<PlatformActivity[]>([]);
  
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    raffleWinRate: 100,
    spinWinRate: 8,
    triviaWinRate: 3,
    scholarshipWinRate: 200,
    raffleParticipants: 11432,
    spinParticipants: 5890,
    triviaParticipants: 2312,
    scholarshipParticipants: 4567,
  });

  const [recentWinners, setRecentWinners] = useState<Winner[]>([
    { id: 'win-initial-1', name: 'Alex R.', avatarUrl: `https://i.pravatar.cc/150?u=b042581f4e29026704e`, prize: 8500, tier: 'Basic' },
    { id: 'win-initial-2', name: 'Jane S.', avatarUrl: `https://i.pravatar.cc/150?u=c042581f4e29026704f`, prize: 550000, tier: 'Pro' },
    { id: 'win-initial-3', name: 'Sam T.', avatarUrl: `https://i.pravatar.cc/150?u=d042581f4e29026704g`, prize: 75000, tier: 'Intermediate' },
    { id: 'win-initial-4', name: 'Ivy C.', avatarUrl: `https://i.pravatar.cc/150?u=e042581f4e29026704h`, prize: 9200, tier: 'Basic' },
    { id: 'win-initial-5', name: 'Jax P.', avatarUrl: `https://i.pravatar.cc/150?u=f042581f4e29026704i`, prize: 68000, tier: 'Intermediate' },
    { id: 'win-initial-6', name: 'Owen F.', avatarUrl: `https://i.pravatar.cc/150?u=g042581f4e29026704j`, prize: 490000, tier: 'Pro' },
  ]);

  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showWinSplash, setShowWinSplash] = useState(false);
  const [showLossSplash, setShowLossSplash] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [lastLottoResult, setLastLottoResult] = useState({ prize: 0, tier: '' });

  // Game states
  const [showTriviaModal, setShowTriviaModal] = useState(false);
  const [showMinerModal, setShowMinerModal] = useState(false);
  const [showScholarshipQuizModal, setShowScholarshipQuizModal] = useState(false);

  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

    const addActivityLog = (userId: string, type: PlatformActivityType, details: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newActivity: PlatformActivity = {
            id: `act_${Date.now()}`,
            timestamp: new Date(),
            userId,
            userName: user.name,
            userAvatar: user.avatarUrl,
            type,
            details,
        };
        setPlatformActivityLog(prev => [newActivity, ...prev]);
    };

    const addNotification = (userId: string, message: string) => {
        setUsersData(prev => {
            const userData = prev[userId];
            if (!userData) return prev;
            
            const newNotification: Notification = {
                id: `notif_${Date.now()}`,
                message,
                time: new Date().toLocaleString(),
                read: false,
            };

            const updatedUserData = {
                ...userData,
                notifications: [newNotification, ...userData.notifications],
            };
            
            return { ...prev, [userId]: updatedUserData };
        });
    };
  
  useEffect(() => {
    if (!isLoggedIn) return;
    const winnerInterval = setInterval(() => {
        const randomWinnerInfo = MOCK_WINNER_POOL[Math.floor(Math.random() * MOCK_WINNER_POOL.length)];
        const randomWinDetails = MOCK_LOTTO_WINS[Math.floor(Math.random() * MOCK_LOTTO_WINS.length)];
        const newWinner: Winner = { id: `win_${Date.now()}_${Math.random()}`, name: randomWinnerInfo.name, avatarUrl: randomWinnerInfo.avatarUrl, prize: Math.floor(randomWinDetails.prize * (0.8 + Math.random() * 0.4)), tier: randomWinDetails.tier };
        setRecentWinners(prevWinners => [newWinner, ...prevWinners.slice(0, 9)]);
    }, 4000);
    return () => clearInterval(winnerInterval);
  }, [isLoggedIn]);
  
  // Effect to manage and progress lotto draws
  useEffect(() => {
    const interval = setInterval(() => {
        setLottoDraws(currentDraws => {
            let hasChanged = false;
            const now = new Date();
            const updatedDraws = currentDraws.map(draw => {
                if (draw.status === 'Upcoming' && now >= draw.drawTime) {
                    hasChanged = true;
                    return {
                        ...draw,
                        status: 'Finished',
                        winningNumbers: [
                            Math.floor(Math.random() * 50) + 1,
                            Math.floor(Math.random() * 50) + 1,
                            Math.floor(Math.random() * 50) + 1,
                        ]
                    };
                }
                return draw;
            });
            return hasChanged ? updatedDraws : currentDraws;
        });
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  // Effect to process winners when a draw finishes
  useEffect(() => {
    const finishedDraws = lottoDraws.filter(d => d.status === 'Finished');
    if (finishedDraws.length === 0) return;

    setUsersData(currentUsersData => {
        let newUsersData = JSON.parse(JSON.stringify(currentUsersData));
        let dataChanged = false;

        finishedDraws.forEach(draw => {
            Object.keys(newUsersData).forEach(userId => {
                const user = newUsersData[userId];
                user.lottoEntries.forEach((entry: UserLottoEntry) => {
                    if (entry.drawId === draw.id && entry.status === 'Pending') {
                        dataChanged = true;
                        entry.winningNumbers = draw.winningNumbers;
                        const correctNumbers = entry.userNumbers.filter(n => draw.winningNumbers.includes(n)).length;
                        if (correctNumbers >= 2) { // Win condition
                            const prize = (entry.tier === 'Pro' ? 500 : entry.tier === 'Intermediate' ? 50 : 5) * entry.amount;
                            entry.status = 'Win';
                            entry.prize = prize;
                            user.withdrawableWallet.balance += prize;
                            user.transactions.unshift({
                                id: `tx_win_${draw.id}_${userId}`,
                                type: TransactionType.LOTTO_WIN,
                                amount: prize,
                                date: new Date().toLocaleString(),
                                status: 'Completed'
                            });
                             const winMessage = `Congratulations! You won $${prize.toFixed(2)} in the ${entry.tier} lotto.`;
                             addNotification(userId, winMessage);
                             addActivityLog(userId, PlatformActivityType.LOTTO_WIN, `Won $${prize.toFixed(2)} in ${entry.tier} tier.`);
                        } else {
                            entry.status = 'Loss';
                        }
                    }
                });
            });
        });

        return dataChanged ? newUsersData : currentUsersData;
    });
}, [lottoDraws]);

  // Effect to auto-play for users when a draw finishes
  useEffect(() => {
    if (lottoDraws.length === 0) return;

    const justFinishedDraws = lottoDraws.filter(d => d.status === 'Finished' && !d.processedForAutoPlay);
    if (justFinishedDraws.length === 0) return;

    const nextDraw = lottoDraws.slice().sort((a, b) => new Date(a.drawTime).getTime() - new Date(b.drawTime).getTime()).find(d => d.status === 'Upcoming' && new Date(d.drawTime) > new Date());
    if (!nextDraw) return; // No upcoming draws to enter

    setUsersData(currentUsersData => {
        let newUsersData = JSON.parse(JSON.stringify(currentUsersData));
        let dataChanged = false;

        Object.keys(newUsersData).forEach(userId => {
            const user = newUsersData[userId];
            const config = user.autoPlayConfig;

            if (config && config.enabled) {
                if (user.depositWallet.availableBalance >= config.amount) {
                    user.depositWallet.availableBalance -= config.amount;
                    user.depositWallet.totalSpent += config.amount;
                    
                    user.transactions.unshift({
                        id: `tx_auto_${Date.now()}`, type: TransactionType.LOTTO_ENTRY, amount: -config.amount, date: new Date().toLocaleString(), status: 'Completed',
                    });

                    user.lottoEntries.unshift({
                        drawId: nextDraw.id, drawTime: nextDraw.drawTime, userNumbers: config.numbers, tier: config.tier, amount: config.amount, status: 'Pending', prize: 0,
                    });
                    dataChanged = true;
                    
                    if (userId === currentUserId) {
                         const autoPlayMessage = `Auto-play successful! Entered next lotto for $${config.amount}.`;
                         showNotification('success', autoPlayMessage);
                         addNotification(userId, autoPlayMessage);
                         addActivityLog(userId, PlatformActivityType.LOTTO_ENTRY, `Auto-played $${config.amount} for ${config.tier} tier.`);
                    }
                } else {
                    config.enabled = false;
                    dataChanged = true;
                    if (userId === currentUserId) {
                         const insufficientFundsMessage = 'Auto-play disabled due to insufficient funds.';
                         showNotification('error', insufficientFundsMessage);
                         addNotification(userId, insufficientFundsMessage);
                    }
                }
            }
        });

        return dataChanged ? newUsersData : currentUsersData;
    });

    setLottoDraws(currentDraws =>
        currentDraws.map(d =>
            justFinishedDraws.find(fd => fd.id === d.id) ? { ...d, processedForAutoPlay: true } : d
        )
    );
  }, [lottoDraws, currentUserId]);


  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleLogin = (role: 'user' | 'admin') => {
    setUserRole(role);
    const userId = role === 'admin' ? MOCK_USERS[1].id : MOCK_USERS[0].id;
    setCurrentUserId(userId);
    setIsLoggedIn(true);
    setActiveTab(role === 'admin' ? 'admin' : 'admin');
    addActivityLog(userId, PlatformActivityType.LOGIN, 'User logged in.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUserId(null);
  };

  const handlePlayLotto = (draw: LottoDraw, tier: LottoTier, numbers: number[], amount: number, autoPlay: boolean) => {
    if (!currentUserId) return;
    
    addActivityLog(currentUserId, PlatformActivityType.LOTTO_ENTRY, `Entered ${tier.level} lotto for $${amount}.`);

    setUsersData(prevData => {
        const prevUserData = prevData[currentUserId];
        if (prevUserData.depositWallet.availableBalance < amount) {
            showNotification('error', 'Insufficient funds for this entry.');
            return prevData;
        }

        const newUserData = { ...prevUserData };

        const entryTx: Transaction = {
            id: `tx_${Date.now()}`, type: TransactionType.LOTTO_ENTRY, amount: -amount, date: new Date().toLocaleString(), status: 'Completed', result: { type: 'loss' }
        };

        const newEntry: UserLottoEntry = {
            drawId: draw.id, drawTime: draw.drawTime, userNumbers: numbers, tier: tier.level, amount: amount, status: 'Pending', prize: 0,
        };

        newUserData.depositWallet.availableBalance -= amount;
        newUserData.depositWallet.totalSpent += amount;
        newUserData.transactions = [entryTx, ...newUserData.transactions];
        newUserData.lottoEntries = [newEntry, ...newUserData.lottoEntries];

        const playMessage = `Entered ${tier.level} lotto for ${draw.drawTime.toLocaleTimeString()}!`;
        addNotification(currentUserId, playMessage);

        if (autoPlay) {
            newUserData.autoPlayConfig = { enabled: true, amount, numbers, tier: tier.level };
            const autoPlayMsg = 'Auto-play is enabled for subsequent draws.';
            showNotification('info', autoPlayMsg);
            addNotification(currentUserId, autoPlayMsg);
        } else {
             showNotification('success', playMessage);
        }

        return { ...prevData, [currentUserId]: newUserData };
    });
};

const handleDisableAutoPlay = () => {
    if (!currentUserId) return;
    setUsersData(prevData => {
        const currentUserData = { ...prevData[currentUserId] };
        if (currentUserData.autoPlayConfig) {
            currentUserData.autoPlayConfig.enabled = false;
        }
        return { ...prevData, [currentUserId]: currentUserData };
    });
    const msg = 'Auto-play has been disabled.';
    showNotification('info', msg);
    addNotification(currentUserId, msg);
};


  const handleDeposit = (amount: number, currency: string) => {
    const depositMessage = `Deposit of ${currency === 'USD' ? '$' : ''}${amount} ${currency !== 'USD' ? currency : ''} is processing.`;
    showNotification('info', depositMessage);
    if (currentUserId) {
      addActivityLog(currentUserId, PlatformActivityType.DEPOSIT, `Initiated deposit of ${amount} ${currency}.`);
      addNotification(currentUserId, depositMessage);
    }
    setShowDepositModal(false);
  };

  const handleWithdraw = (amount: number, address: string, currency: string) => {
    if (!currentUser || !currentUserData || !currentUserId) return;
    if (amount > currentUserData.withdrawableWallet.balance) {
      showNotification('error', 'Withdrawal amount exceeds available balance.');
      return;
    }
    if (amount > 10000 && !currentUser.kycVerified) {
      showNotification('error', 'KYC verification required for withdrawals over $10,000.');
      return;
    }
    const withdrawMessage = `Withdrawal of ${amount.toFixed(2)} ${currency} to ${address} is processing.`;
    showNotification('success', withdrawMessage);
    addActivityLog(currentUserId, PlatformActivityType.WITHDRAWAL, `Requested withdrawal of ${amount.toFixed(2)} ${currency}.`);
    addNotification(currentUserId, withdrawMessage);
    setShowWithdrawModal(false);
  };

  const handleVerifyKyc = () => {
    if (!currentUserId) return;
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, kycVerified: true } : u));
    const kycMessage = 'KYC Verification Successful!';
    showNotification('success', kycMessage);
    addActivityLog(currentUserId, PlatformActivityType.KYC_VERIFIED, 'User passed KYC verification.');
    addNotification(currentUserId, kycMessage);
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (!currentUserId) return;
    setUsers(prevUsers => 
        prevUsers.map(u => 
            u.id === currentUserId ? { ...u, avatarUrl: newAvatarUrl } : u
        )
    );
    showNotification('success', 'Avatar updated successfully!');
  };

  const handleConvertPoints = (points: number) => {
    if (!currentUserData || !currentUserId) return;
    const conversionRate = 1000;
    if (points > currentUserData.pointsWallet.balance) {
      showNotification('error', 'Insufficient points.');
      return;
    }
    const convertedAmount = points / conversionRate;
    setUsersData(prev => {
        const newUserData = { ...prev[currentUserId] };
        newUserData.pointsWallet.balance -= points;
        newUserData.withdrawableWallet.balance += convertedAmount;
        return { ...prev, [currentUserId]: newUserData };
    });
    showNotification('success', `${points} points converted to $${convertedAmount.toFixed(2)}!`);
    setShowConvertModal(false);
  }

  const handleSpinWin = (prize: SpinWheelPrize) => {
    if (prize.type === 'none') {
      showNotification('info', 'Better luck next time!');
      return;
    }
    showNotification('success', `You won ${prize.label}!`);
  }
  
  const handleMarkAllNotificationsAsRead = () => {
      if (!currentUserId) return;
      setUsersData(prev => {
          const userData = { ...prev[currentUserId] };
          userData.notifications = userData.notifications.map(n => ({ ...n, read: true }));
          return { ...prev, [currentUserId]: userData };
      });
  };

  const handleStartWeeklyTrivia = () => {
    if (!currentUserData) return;
    if (currentUserData.depositWallet.availableBalance < 5) {
      showNotification('error', 'You must have at least $5.00 in your deposit wallet to play.');
      return;
    }
    setShowTriviaModal(true);
  };

  const handleTriviaEnd = (pointsWon: number) => {
    if (!currentUserId) return;
    setUsersData(prev => {
        const newUserData = { ...prev[currentUserId] };
        newUserData.pointsWallet.balance += pointsWon;
        return { ...prev, [currentUserId]: newUserData };
    });
    showNotification('success', `You earned ${pointsWon} EXP Points from the trivia!`);
    setShowTriviaModal(false);
  }
  
  const handleScholarshipQuizEnd = (isWinner: boolean) => {
    if(isWinner) {
        showNotification('success', 'Congratulations! You have won the scholarship! You will be contacted shortly.');
    } else {
        showNotification('info', 'Thank you for participating. Better luck next month!');
    }
    setShowScholarshipQuizModal(false);
  };

  const handleMiningEnd = (pointsWon: number) => {
    if (!currentUserId) return;
     setUsersData(prev => {
        const newUserData = { ...prev[currentUserId] };
        newUserData.pointsWallet.balance += pointsWon;
        return { ...prev, [currentUserId]: newUserData };
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

  if (!isLoggedIn || !currentUserId) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const currentUser = users.find(u => u.id === currentUserId);
  const currentUserData = usersData[currentUserId];

  if (!currentUser || !currentUserData) {
    return <LandingPage onLogin={handleLogin} />;
  }


  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <Dashboard 
          depositWallet={currentUserData.depositWallet}
          withdrawableWallet={currentUserData.withdrawableWallet}
          pointsWallet={currentUserData.pointsWallet}
          lottoTiers={MOCK_STATIC_DATA.lottoTiers}
          transactions={currentUserData.transactions}
          coinCharacters={currentUserData.coinCharacters}
          recentWinners={recentWinners}
          ads={MOCK_STATIC_DATA.ads}
          onConvert={() => setShowConvertModal(true)}
          setActiveTab={setActiveTab}
        />;
      case 'raffles':
        return <RafflesPage 
          raffleTiers={MOCK_STATIC_DATA.lottoTiers} 
          onPlayScheduledRaffle={handlePlayLotto}
          adminSettings={adminSettings}
          raffleDraws={lottoDraws}
          currentUserData={currentUserData}
          onDisableAutoPlay={handleDisableAutoPlay}
        />;
      case 'play':
        return <PlayPage 
          onSpinWheel={() => setShowSpinWheel(true)}
          onStartWeeklyTrivia={handleStartWeeklyTrivia}
          onStartMining={() => setShowMinerModal(true)}
          onStartScholarshipQuiz={() => setShowScholarshipQuizModal(true)}
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
        return <ProfilePage user={currentUser} userData={currentUserData} onVerifyKyc={handleVerifyKyc} setActiveTab={setActiveTab} onAvatarUpdate={handleAvatarUpdate} />;
      case 'admin':
        if (userRole !== 'admin') {
          setActiveTab('home');
          return null;
        }
        return <AdminPage 
            users={users} 
            allUsersData={usersData} 
            adminSettings={adminSettings}
            setAdminSettings={setAdminSettings}
            showNotification={showNotification}
            platformActivity={platformActivityLog}
            addActivityLog={addActivityLog}
         />;
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
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab} 
        pointsBalance={currentUserData.pointsWallet.balance} 
        onLogout={handleLogout}
        currentUser={currentUser}
        userRole={userRole}
        notifications={currentUserData.notifications}
        hasUnreadNotifications={currentUserData.notifications.some(n => !n.read)}
        onViewAllNotifications={() => setShowNotificationsModal(true)}
      />
      <NotificationBanner />
      <main className="pt-20 pb-24 md:pb-8">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* --- Modals & Splashes --- */}
      <SupernovaWinSplash isOpen={showWinSplash} onClose={() => setShowWinSplash(false)} result={lastLottoResult} />
      <WormholeLossSplash isOpen={showLossSplash} onClose={() => setShowLossSplash(false)} />
      
      <NotificationsModal 
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={currentUserData.notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />

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
        prizes={MOCK_STATIC_DATA.spinWheelPrizes}
        onSpinEnd={handleSpinWin}
      />
      <TriviaModal
        isOpen={showTriviaModal}
        onClose={() => setShowTriviaModal(false)}
        questions={MOCK_TRIVIA_QUESTIONS}
        onComplete={handleTriviaEnd}
        title="Weekly Free Trivia"
      />
      <ScholarshipQuizModal
        isOpen={showScholarshipQuizModal}
        onClose={() => setShowScholarshipQuizModal(false)}
        questions={MOCK_SCHOLARSHIP_QUESTIONS}
        onComplete={handleScholarshipQuizEnd}
        winChance={1 / adminSettings.scholarshipWinRate}
      />
      <StarstoneMinerModal
        isOpen={showMinerModal}
        onClose={() => setShowMinerModal(false)}
        onComplete={handleMiningEnd}
      />
    </div>
  );
};

const SupernovaWinSplash: React.FC<{ isOpen: boolean, onClose: () => void, result: { prize: number, tier: string } }> = ({ isOpen, onClose, result }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col justify-center items-center z-50 text-center p-4">
            <div className="animate-supernova">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-star-yellow to-amber-300" style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.8)' }}>JACKPOT!</h1>
                <p className="text-2xl text-white mt-2">You won the {result.tier} lotto!</p>
                <p className="text-5xl font-bold text-nova-green mt-6" style={{ textShadow: '0 0 20px rgba(52, 211, 153, 0.7)' }}>+${result.prize.toFixed(2)}</p>
                <p className="text-gray-300 mt-2">The credits have been added to your winnings wallet.</p>
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
                <div className="text-8xl md:text-9xl">🤔</div>
                <h1 className="text-4xl md:text-5xl font-bold text-cyber-pink mt-4">Better Luck Next Time!</h1>
                <p className="text-lg text-gray-300 mt-2 max-w-sm">Your numbers didn't match this time. Don't worry, another draw is coming soon!</p>
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
    const conversionRate = 1000;
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
        }, 5000);
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