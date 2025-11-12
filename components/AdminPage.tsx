

import React, { useState, useMemo } from 'react';
import type { User, Transaction, UserData, AdminSettings } from '../types';
import { TransactionType } from '../types';
import { Modal } from './Modal';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const AdminStatCard: React.FC<{ title: string; value: string; icon: string; theme: 'blue' | 'green' | 'yellow' | 'pink' }> = ({ title, value, icon, theme }) => {
    const themes = {
        blue: 'text-blue-400 shadow-glow-blue',
        green: 'text-nova-green shadow-glow-green',
        yellow: 'text-star-yellow shadow-glow-yellow',
        pink: 'text-cyber-pink shadow-glow-pink'
    }
    return (
        <div className={`bg-space-card p-5 rounded-lg border border-space-border flex items-center space-x-4 ${themes[theme]}`}>
            <div className="text-4xl">
                <i className={`fas ${icon}`}></i>
            </div>
            <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
};


const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const isCredit = tx.amount > 0;
    return (
        <div className="flex items-center justify-between py-2 border-b border-space-border/30">
            <div className="flex items-center space-x-3">
                <i className={`fas ${isCredit ? 'fa-plus-circle text-nova-green' : 'fa-minus-circle text-cyber-pink'}`}></i>
                <div>
                    <p className="font-semibold text-sm text-white">{tx.type}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
            </div>
            <p className={`font-bold text-sm ${isCredit ? 'text-nova-green' : 'text-red-400'}`}>
                {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
            </p>
        </div>
    );
};

const UserDetailModal: React.FC<{ user: User; userData: UserData, onClose: () => void }> = ({ user, userData, onClose }) => (
    <Modal isOpen={!!user} onClose={onClose} title={`User Details: ${user.name}`}>
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full ring-2 ring-cyber-pink" />
                <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.id}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-space-border p-2 rounded-md">
                    <p className="text-xs text-gray-300">Deposit</p>
                    <p className="font-bold text-white">{formatCurrency(userData.depositWallet.availableBalance)}</p>
                </div>
                <div className="bg-space-border p-2 rounded-md">
                    <p className="text-xs text-gray-300">Withdrawable</p>
                    <p className="font-bold text-nova-green">{formatCurrency(userData.withdrawableWallet.balance)}</p>
                </div>
                 <div className="bg-space-border p-2 rounded-md">
                    <p className="text-xs text-gray-300">Points</p>
                    <p className="font-bold text-star-yellow">{userData.pointsWallet.balance.toLocaleString()}</p>
                </div>
            </div>
            <div>
                 <h4 className="font-bold mb-2">Transaction History</h4>
                 <div className="max-h-64 overflow-y-auto bg-space-dark p-3 rounded-lg">
                    {userData.transactions.length > 0 ? (
                        userData.transactions.map((tx: Transaction) => <TransactionRow key={tx.id} tx={tx} />)
                    ) : <p className="text-sm text-gray-500 text-center py-4">No transactions found.</p>}
                 </div>
            </div>
             <div className="flex justify-end space-x-4 pt-4">
                 <button className="px-4 py-2 bg-red-600/50 text-red-300 rounded-lg hover:bg-red-600/80">Suspend User</button>
                 <button onClick={onClose} className="px-4 py-2 bg-space-border rounded-lg hover:bg-gray-600">Close</button>
            </div>
        </div>
    </Modal>
);

const SettingsCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-space-card p-5 rounded-lg border border-space-border">
        <h3 className="text-lg font-bold mb-4 tracking-wider text-star-yellow">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


interface AdminPageProps {
    users: User[];
    allUsersData: Record<string, UserData>;
    adminSettings: AdminSettings;
    setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
    showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ users, allUsersData, adminSettings, setAdminSettings, showNotification }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dummyWinnerUser, setDummyWinnerUser] = useState<string>(users[0]?.id || '');
  const [dummyWinnerGame, setDummyWinnerGame] = useState<string>('Raffle');

  const stats = useMemo(() => {
    let totalDeposited = 0;
    let totalWithdrawable = 0;
    let kycVerified = 0;
    Object.values(allUsersData).forEach((data: UserData) => {
        totalDeposited += data.depositWallet.totalDeposited;
        totalWithdrawable += data.withdrawableWallet.balance;
    });
    users.forEach(u => {
        if (u.kycVerified) kycVerified++;
    });
    return { totalDeposited, totalWithdrawable, kycVerified };
  }, [users, allUsersData]);
  
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAdminSettings(prev => ({...prev, [name]: parseInt(value, 10)}));
  };

  const assignDummyWinner = () => {
    const user = users.find(u => u.id === dummyWinnerUser);
    if(user) {
        showNotification('success', `${user.name} has been assigned as a dummy winner for the ${dummyWinnerGame}.`);
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-8">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider">ADMIN CONTROL</h1>
            <p className="text-gray-400">System-wide overview and user management.</p>
        </div>

        <section id="admin-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard title="Total Users" value={users.length.toString()} icon="fa-users" theme="blue" />
            <AdminStatCard title="Total Deposits" value={formatCurrency(stats.totalDeposited)} icon="fa-wallet" theme="green" />
            <AdminStatCard title="KYC Verified" value={`${stats.kycVerified} / ${users.length}`} icon="fa-user-check" theme="yellow" />
            <AdminStatCard title="Total Withdrawable" value={formatCurrency(stats.totalWithdrawable)} icon="fa-hand-holding-usd" theme="pink" />
        </section>

        <section id="admin-settings" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <SettingsCard title="Game & Platform Settings">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Raffle Win Rate (1 in X)</label>
                        <input type="range" name="raffleWinRate" min="1" max="1000" value={adminSettings.raffleWinRate} onChange={handleSettingsChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        <span className="text-white font-bold">{adminSettings.raffleWinRate}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Scholarship Win Rate (1 in X)</label>
                        <input type="range" name="scholarshipWinRate" min="1" max="1000" value={adminSettings.scholarshipWinRate} onChange={handleSettingsChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        <span className="text-white font-bold">{adminSettings.scholarshipWinRate}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Raffle Participants (Display)</label>
                        <input type="number" name="raffleParticipants" value={adminSettings.raffleParticipants} onChange={handleSettingsChange} className="w-full bg-space-border p-2 rounded-md text-white mt-1 focus:ring-2 focus:ring-cyber-pink outline-none" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Scholarship Participants (Display)</label>
                        <input type="number" name="scholarshipParticipants" value={adminSettings.scholarshipParticipants} onChange={handleSettingsChange} className="w-full bg-space-border p-2 rounded-md text-white mt-1 focus:ring-2 focus:ring-cyber-pink outline-none" />
                    </div>
                </SettingsCard>
            </div>
            <div>
                 <SettingsCard title="Manual Winner Assignment">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Game</label>
                        <select value={dummyWinnerGame} onChange={e => setDummyWinnerGame(e.target.value)} className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none">
                            <option>Raffle</option>
                            <option>Spin & Win</option>
                            <option>Scholarship Quiz</option>
                            <option>Weekly Trivia</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
                         <select value={dummyWinnerUser} onChange={e => setDummyWinnerUser(e.target.value)} className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none">
                            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                    <button onClick={assignDummyWinner} className="w-full bg-cyber-pink text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 transition shadow-glow-pink">Assign Dummy Winner</button>
                 </SettingsCard>
            </div>
        </section>

        <section id="user-management">
            <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wider">User Management</h2>
            <div className="bg-space-card p-4 rounded-lg shadow-lg border border-space-border overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-space-border">
                            <th className="p-3 text-sm font-semibold uppercase text-gray-400">User</th>
                            <th className="p-3 text-sm font-semibold uppercase text-gray-400 hidden md:table-cell">Email</th>
                            <th className="p-3 text-sm font-semibold uppercase text-gray-400">KYC</th>
                            <th className="p-3 text-sm font-semibold uppercase text-gray-400">Balance</th>
                            <th className="p-3 text-sm font-semibold uppercase text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                             const userData = allUsersData[user.id];
                             const totalBalance = (userData?.depositWallet?.availableBalance || 0) + (userData?.withdrawableWallet?.balance || 0);
                             return (
                                <tr key={user.id} className="border-b border-space-border/50 hover:bg-space-border/30">
                                    <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full"/>
                                            <div>
                                                <p className="font-bold text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-300 hidden md:table-cell">{user.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${user.kycVerified ? 'bg-green-500/20 text-nova-green' : 'bg-yellow-500/20 text-star-yellow'}`}>
                                            {user.kycVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-3 font-semibold text-white">{formatCurrency(totalBalance)}</td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedUser(user)} className="text-sm bg-space-blue text-white px-3 py-1 rounded-md hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>

        {selectedUser && (
            <UserDetailModal
                user={selectedUser}
                userData={allUsersData[selectedUser.id]}
                onClose={() => setSelectedUser(null)}
            />
        )}
    </div>
  );
};