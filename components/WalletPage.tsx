

import React, { useState, useMemo, useEffect } from 'react';
import type { Wallet, WithdrawableWallet, PointsWallet, Transaction } from '../types';
import { TransactionType } from '../types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

interface WalletCardProps {
    title: string;
    balance: string;
    icon: string;
    theme: 'blue' | 'green' | 'yellow';
}

const WalletCard: React.FC<WalletCardProps> = ({ title, balance, icon, theme }) => {
    const themeClasses = {
        blue: {
            container: 'bg-space-blue shadow-glow-blue',
            iconColor: 'text-white',
            titleColor: 'text-blue-200'
        },
        green: {
            container: 'bg-space-card border border-nova-green/50 shadow-glow-green',
            iconColor: 'text-nova-green',
            titleColor: 'text-gray-400'
        },
        yellow: {
            container: 'bg-space-card border border-star-yellow/50 shadow-glow-yellow',
            iconColor: 'text-star-yellow',
            titleColor: 'text-gray-400'
        }
    };

    const config = themeClasses[theme];

    return (
        <div className={`p-5 rounded-xl shadow-lg ${config.container}`}>
            <div className="flex items-center space-x-4">
                <div className={`text-3xl ${config.iconColor}`}>
                    <i className={icon}></i>
                </div>
                <div>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${config.titleColor}`}>{title}</p>
                    <p className="text-3xl font-bold text-white">{balance}</p>
                </div>
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
        <div className="flex items-center justify-between py-3.5 border-b border-space-border/50 last:border-b-0">
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

type SortKey = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

const SortButton: React.FC<{
  label: string;
  sortKey: SortKey;
  sortConfig: { key: SortKey; order: SortOrder };
  onClick: (key: SortKey) => void;
}> = ({ label, sortKey, sortConfig, onClick }) => {
  const isActive = sortConfig.key === sortKey;
  const icon = isActive ? (sortConfig.order === 'desc' ? 'fa-arrow-down' : 'fa-arrow-up') : '';
  return (
    <button
      type="button"
      onClick={() => onClick(sortKey)}
      className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
        isActive
          ? 'bg-space-blue text-white shadow-md'
          : 'bg-space-border text-gray-300 hover:bg-space-blue/50'
      }`}
    >
      {label}
      {isActive && <i className={`fas ${icon} text-xs`}></i>}
    </button>
  );
};


export const WalletPage: React.FC<WalletPageProps> = ({ depositWallet, withdrawableWallet, pointsWallet, transactions, onDeposit, onWithdraw }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | TransactionType>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'date', order: 'desc' });
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [activeFilter, sortConfig]);

  const handleSort = (key: SortKey) => {
    let order: SortOrder = 'desc';
    if (sortConfig.key === key) {
        order = sortConfig.order === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, order });
  };

  const transactionTypes: ('All' | TransactionType)[] = ['All', ...Object.values(TransactionType)];

  const processedTransactions = useMemo(() => {
    const filtered = transactions.filter(tx => {
      if (activeFilter === 'All') return true;
      return tx.type === activeFilter;
    });

    return filtered.sort((a, b) => {
        if (sortConfig.key === 'amount') {
            if (sortConfig.order === 'asc') {
                return a.amount - b.amount;
            }
            return b.amount - a.amount;
        }
        // Default to date sorting
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (sortConfig.order === 'asc') {
            return dateA - dateB;
        }
        return dateB - dateA;
    });
  }, [transactions, activeFilter, sortConfig]);

  return (
    <div className="container mx-auto px-4 space-y-6">
      <section id="wallet-summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WalletCard 
            title="Deposit Tanks" 
            balance={formatCurrency(depositWallet.availableBalance)} 
            icon="fa-wallet" 
            theme="blue" 
        />
        <WalletCard 
            title="Winnable Credits" 
            balance={formatCurrency(withdrawableWallet.balance)} 
            icon="fa-hand-holding-usd" 
            theme="green"
        />
        <WalletCard 
            title="EXP Points" 
            balance={pointsWallet.balance.toLocaleString()} 
            icon="fa-star" 
            theme="yellow"
        />
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wider">Transaction Log</h2>
        
        <div className="bg-space-card p-4 rounded-lg shadow-lg border border-space-border">
            <div className="pb-3 border-b border-space-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 -mr-4 pr-4">
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
              <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-400">Sort by:</span>
                  <SortButton label="Date" sortKey="date" sortConfig={sortConfig} onClick={handleSort} />
                  <SortButton label="Amount" sortKey="amount" sortConfig={sortConfig} onClick={handleSort} />
              </div>
            </div>

            <div className="mt-1">
                {processedTransactions.length > 0 
                  ? processedTransactions.slice(0, visibleCount).map(tx => <TransactionRow key={tx.id} tx={tx} />) 
                  : <p className="text-center text-gray-400 py-8">
                      {transactions.length > 0 ? 'No transactions match the selected filter.' : 'No transactions to display.'}
                    </p>}
            </div>
             {processedTransactions.length > visibleCount && (
                <div className="mt-4 pt-4 border-t border-space-border/50 text-center">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="bg-space-border hover:bg-space-blue text-white font-bold py-2 px-5 rounded-lg transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
      </section>
    </div>
  );
};
