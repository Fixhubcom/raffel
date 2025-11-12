

export interface Wallet {
  totalDeposited: number;
  totalSpent: number;
  availableBalance: number;
}

export interface ReferralWallet {
  balance: number;
}

export interface WithdrawableWallet {
  balance: number;
}

export interface PointsWallet {
  balance: number;
}

export interface Referral {
    id: string;
    name: string;
    status: 'Pending' | 'Completed';
    reward: number;
    date: string;
}

export interface User {
  id:string;
  name: string;
  email: string;
  avatarUrl: string;
  kycVerified: boolean;
  referralCode: string;
  referrals: Referral[];
}

export interface LottoTier {
  level: 'Basic' | 'Intermediate' | 'Pro';
  entryFee: number;
  prizeRange: string;
  prizePool: number;
  drawTime: Date;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  LOTTO_WIN = 'Lotto Win',
  LOTTO_ENTRY = 'Lotto Entry',
  REFERRAL_BONUS = 'Referral Bonus',
  WITHDRAWAL = 'Withdrawal',
  WITHDRAWAL_FEE = 'Withdrawal Fee',
  POINTS_CONVERSION = 'Points Conversion'
}


export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  result?: {
      type: 'win' | 'loss';
      prize?: number;
  };
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export interface CoinCharacter {
  id:string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Mythic';
  icon: string; // font-awesome icon class
  description: string;
  bgColor: string;
}

export interface SpinWheelPrize {
    label: string;
    value: number;
    type: 'points' | 'cash' | 'coin' | 'none';
    color: string;
}

export interface Game {
    title: string;
    description: string;
    icon: string;
    buttonText: string;
    theme: 'pink' | 'yellow' | 'green';
    action: () => void;
}

export interface TriviaQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
}

export interface ScholarshipQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface Winner {
  id: string;
  name: string;
  avatarUrl: string;
  prize: number;
  tier: 'Basic' | 'Intermediate' | 'Pro';
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  theme: 'pink' | 'yellow' | 'green' | 'blue';
}

export interface AdminSettings {
    raffleWinRate: number;
    spinWinRate: number;
    triviaWinRate: number;
    scholarshipWinRate: number;
    raffleParticipants: number;
    spinParticipants: number;
    triviaParticipants: number;
    scholarshipParticipants: number;
}

export interface UserLottoEntry {
    drawId: string;
    drawTime: Date;
    userNumbers: number[];
    tier: 'Basic' | 'Intermediate' | 'Pro';
    amount: number;
    status: 'Pending' | 'Win' | 'Loss';
    prize: number;
    winningNumbers?: number[];
}

export interface LottoDraw {
    id: string; // ISO string of the draw time
    drawTime: Date;
    winningNumbers: number[];
    status: 'Upcoming' | 'Drawing' | 'Finished';
    processedForAutoPlay?: boolean;
}

export interface UserData {
    depositWallet: Wallet;
    withdrawableWallet: WithdrawableWallet;
    pointsWallet: PointsWallet;
    transactions: Transaction[];
    coinCharacters: CoinCharacter[];
    lottoEntries: UserLottoEntry[];
    autoPlayConfig?: {
        enabled: boolean;
        amount: number;
        numbers: number[];
        tier: 'Basic' | 'Intermediate' | 'Pro';
    } | null;
}