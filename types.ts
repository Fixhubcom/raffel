
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
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  kycVerified: boolean;
  referralCode: string;
  referrals: Referral[];
}

export interface RaffleTier {
  level: 'Basic' | 'Intermediate' | 'Pro';
  entryFee: number;
  prizeRange: string;
  prizePool: number;
  drawTime: Date;
  celestialBody: {
      name: string;
      className: string;
  };
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  RAFFLE_WIN = 'Raffle Win',
  RAFFLE_ENTRY = 'Raffle Entry',
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
  id: string;
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
