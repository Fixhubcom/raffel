
import React from 'react';
import type { User, Referral } from '../types';

const StatCard: React.FC<{ label: string, value: string | number, icon: string }> = ({ label, value, icon }) => (
    <div className="bg-space-card p-4 rounded-lg flex items-center space-x-4 border border-space-border">
        <div className="text-3xl text-star-yellow">
            <i className={icon}></i>
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ReferralRow: React.FC<{ referral: Referral }> = ({ referral }) => (
    <div className="flex justify-between items-center py-3 border-b border-space-border/50">
        <div>
            <p className="font-semibold">{referral.name}</p>
            <p className="text-xs text-gray-500">{referral.date}</p>
        </div>
        <div className="text-right">
            <p className={`font-bold text-sm ${referral.status === 'Completed' ? 'text-nova-green' : 'text-star-yellow'}`}>
                {referral.status}
            </p>
            {referral.status === 'Completed' && (
                 <p className="text-xs text-gray-400">+${referral.reward.toFixed(2)}</p>
            )}
        </div>
    </div>
);

export const ReferralPage: React.FC<{ user: User }> = ({ user }) => {
    const referralLink = `https://luckilotto.com/join?ref=${user.referralCode}`;
    const totalEarnings = user.referrals.reduce((acc, ref) => ref.status === 'Completed' ? acc + ref.reward : acc, 0);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        // Add a toast notification here in a real app
    };
    
    return (
        <div className="container mx-auto px-4">
             <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-wider">REFERRAL HUB</h1>
                <p className="text-gray-400 max-w-xl mx-auto mt-2">Invite new players and earn rewards for growing the community.</p>
            </div>

            <section id="referral-link" className="mb-6">
                 <div className="bg-space-card p-4 rounded-lg shadow-lg border border-space-border">
                    <label className="text-sm text-gray-300 mb-2 block">Your Unique Referral Link</label>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <input type="text" readOnly value={referralLink} className="w-full bg-space-border p-2 rounded-md text-gray-300 outline-none flex-grow" />
                        <button onClick={copyToClipboard} className="bg-cyber-pink text-white font-bold py-2 px-5 rounded-lg hover:bg-pink-700 transition whitespace-nowrap shadow-glow-pink">
                           <i className="fas fa-copy mr-2"></i> Copy Link
                        </button>
                    </div>
                 </div>
            </section>
            
            <section id="referral-stats" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <StatCard label="Total Referrals" value={user.referrals.length} icon="fas fa-users" />
                <StatCard label="Total Commission" value={`$${totalEarnings.toFixed(2)}`} icon="fas fa-dollar-sign" />
            </section>

            <section id="referral-list">
                 <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wider">Your Referrals</h2>
                 <div className="bg-space-card p-4 rounded-lg shadow-lg border border-space-border">
                    {user.referrals.length > 0 
                      ? user.referrals.map(ref => <ReferralRow key={ref.id} referral={ref} />) 
                      : <p className="text-center text-gray-400 py-4">You have no referrals yet. Share your link to start earning!</p>}
                 </div>
            </section>
        </div>
    );
}