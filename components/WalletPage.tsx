
import React, { useState } from 'react';
import type { Wallet, WithdrawableWallet, PointsWallet, Transaction } from '../types';
import { TransactionType } from '../types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const WalletCard: React.FC<{ title: string, balance: string, icon: string, primary?: boolean }> = ({ title, balance, icon, primary = false}) => (
    <div className={`p-5 rounded-xl shadow-lg ${primary ? 'bg-space-blue shadow-glow-blue' : 'bg-space-card border border-space-border'}`}>
        <div className="flex items-center space-x-4">
            <div className={`text-2xl ${primary ? 'text-white' : 'text-star-yellow'}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className={`text-sm font-semibold uppercase tracking-wider ${primary ? 'text-blue-200' : 'text-gray-400'}`}>{title}</p>
                <p className="text-2xl font-bold text-white">{balance}</p>
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const typeInfo = {
        [TransactionType.DEPOSIT]: { icon: 'fa-download', color: 'text-nova-green' },
        [TransactionType.RAFFLE_WIN]: { icon: 'fa-trophy', color: 'text-star-yellow' },
        [TransactionType.RAFFLE_ENTRY]: { icon: 'fa-ticket-alt', color: 'text-cyber-pink' },
        [TransactionType.REFERRAL_BONUS]: { icon: 'fa-users', color: 'text-blue-400' },
        [TransactionType.WITHDRAWAL]: { icon: 'fa-upload', color: 'text-red-400' },
        [TransactionType.WITHDRAWAL_FEE]: { icon: 'fa-file-invoice-dollar', color: 'text-red-400' },
        [TransactionType.POINTS_CONVERSION]: { icon: 'fa-exchange-alt', color: 'text-purple-400' }
    };

    return (
        <div className="flex items-center justify-between py-3.5 border-b border-space-border/50">
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


interface WalletPageProps {
    depositWallet: Wallet;
    withdrawableWallet: WithdrawableWallet;
    pointsWallet: PointsWallet;
    transactions: Transaction[];
    onDeposit: () => void;
    onWithdraw: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ depositWallet, withdrawableWallet, pointsWallet, transactions, onDeposit, onWithdraw }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | TransactionType>('All');

  const transactionTypes: ('All' | TransactionType)[] = ['All', ...Object.values(TransactionType)];

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'All') return true;
    return tx.type === activeFilter;
  });

  return (
    <div className="container mx-auto px-4 space-y-6">
      <section id="wallet-summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WalletCard title="Deposit Tanks" balance={formatCurrency(depositWallet.availableBalance)} icon="fa-wallet" primary />
        <WalletCard title="Winnable Credits" balance={formatCurrency(withdrawableWallet.balance)} icon="fa-hand-holding-usd" />
        <WalletCard title="EXP Points" balance={pointsWallet.balance.toLocaleString()} icon="fa-star" />
      </section>

      <section id="wallet-actions" className="flex space-x-4">
        <button onClick={onDeposit} className="flex-1 bg-nova-green/80 hover:bg-nova-green transition text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-glow-green">
            <i className="fas fa-plus-circle"></i>
            <span>Deposit</span>
        </button>
        <button onClick={onWithdraw} className="flex-1 bg-cyber-pink/80 hover:bg-cyber-pink transition text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-glow-pink">
            <i className="fas fa-paper-plane"></i>
            <span>Withdraw</span>
        </button>
      </section>

      <section id="full-transaction-history">
        <h2 className="text-2xl font-bold mb-4 tracking-wider">Transaction Log</h2>
        
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
            {transactionTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  activeFilter === type
                    ? 'bg-space-blue text-white shadow-md'
                    : 'bg-space-card text-gray-300 hover:bg-space-border'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-space-card p-4 rounded-lg shadow-lg border border-space-border">
            {filteredTransactions.length > 0 
              ? filteredTransactions.map(tx => <TransactionRow key={tx.id} tx={tx} />) 
              : <p className="text-center text-gray-400 py-4">
                  {transactions.length > 0 ? 'No transactions match the selected filter.' : 'No transactions to display.'}
                </p>}
        </div>
      </section>
    </div>
  );
};
