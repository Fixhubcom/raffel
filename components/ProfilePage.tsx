
import React, { useState, useRef } from 'react';
import type { User, LottoTier, UserData, UserLottoEntry } from '../types';

interface ProfilePageProps {
  user: User;
  userData: UserData;
  onVerifyKyc: () => void;
  setActiveTab: (tab: string) => void;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const ProfileInfoRow: React.FC<{ label: string; value: string; isVerified?: boolean }> = ({ label, value, isVerified }) => (
    <div className="flex justify-between items-center py-4 border-b border-space-border/50">
        <span className="text-gray-400 font-medium">{label}</span>
        <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">{value}</span>
            {isVerified !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isVerified ? 'bg-green-500/20 text-nova-green' : 'bg-yellow-500/20 text-star-yellow'}`}>
                    {isVerified ? 'Verified' : 'Not Verified'}
                </span>
            )}
        </div>
    </div>
);

const KycForm: React.FC<{ onVerify: () => void; onCancel: () => void }> = ({ onVerify, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const canProceedStep1 = formData.fullName && formData.dob && formData.address;

  const handleSubmit = () => {
    onVerify();
  };

  return (
    <section id="kyc-form" className="mt-6 bg-space-card p-5 rounded-lg shadow-lg border border-space-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-star-yellow">KYC Verification</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white text-2xl" aria-label="Cancel verification">&times;</button>
      </div>

      {step === 1 && (
        <div>
          <h3 className="font-semibold mb-1 text-gray-200">Step 1 of 2: Personal Information</h3>
          <p className="text-sm text-gray-400 mb-4">Please enter your details exactly as they appear on your official documents.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
              <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Full Address</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="w-full bg-space-border p-2 rounded-md text-white focus:ring-2 focus:ring-cyber-pink outline-none" placeholder="123 Main St, Anytown, USA" />
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full md:w-auto bg-cyber-pink text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed shadow-glow-pink">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-1 text-gray-200">Step 2 of 2: Document Upload</h3>
          <p className="text-sm text-gray-400 mb-4">Upload a clear image of your government-issued ID and a proof of address.</p>
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proof of Identity (e.g., Passport, ID Card)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-space-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <i className="fas fa-id-card mx-auto h-12 w-12 text-gray-400"></i>
                        <div className="flex text-sm text-gray-400">
                            <label htmlFor="file-upload-id" className="relative cursor-pointer bg-space-card rounded-md font-medium text-star-yellow hover:text-amber-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyber-pink focus-within:ring-offset-space-dark">
                                <span>Upload a file</span>
                                <input id="file-upload-id" name="file-upload-id" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proof of Address (e.g., Utility Bill)</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-space-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <i className="fas fa-file-invoice mx-auto h-12 w-12 text-gray-400"></i>
                        <div className="flex text-sm text-gray-400">
                             <label htmlFor="file-upload-address" className="relative cursor-pointer bg-space-card rounded-md font-medium text-star-yellow hover:text-amber-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyber-pink focus-within:ring-offset-space-dark">
                                <span>Upload a file</span>
                                <input id="file-upload-address" name="file-upload-address" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-2 bg-space-border rounded-lg hover:bg-gray-600">Back</button>
            <button type="button" onClick={handleSubmit} className="bg-cyber-pink text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 transition shadow-glow-pink">
              Submit for Verification
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const NumberBall: React.FC<{ number: number; isWinning?: boolean }> = ({ number, isWinning }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
        ${isWinning ? 'bg-star-yellow text-space-dark' : 'bg-space-border text-white'}`}>
        {number}
    </div>
);

const LottoHistoryEntry: React.FC<{ entry: UserLottoEntry }> = ({ entry }) => {
    const isWin = entry.status === 'Win';
    const isLoss = entry.status === 'Loss';
    const isPending = entry.status === 'Pending';
    
    const statusPill = isWin 
        ? <span className="px-3 py-1 text-sm font-bold rounded-full bg-nova-green/20 text-nova-green">WIN</span>
        : isLoss
            ? <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500/20 text-red-400">LOSS</span>
            : <span className="px-3 py-1 text-sm font-bold rounded-full bg-yellow-500/20 text-star-yellow">PENDING</span>

    return (
        <div className="bg-space-card/70 p-4 rounded-lg border border-space-border/50">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <p className="font-bold text-white">{entry.tier} Tier Draw</p>
                    <p className="text-xs text-gray-400">{entry.drawTime.toLocaleString()}</p>
                </div>
                {statusPill}
            </div>
            <div className="space-y-2">
                <div>
                    <p className="text-xs font-semibold text-gray-300 mb-1">Your Numbers:</p>
                    <div className="flex space-x-2">
                        {entry.userNumbers.map(n => <NumberBall key={n} number={n} isWinning={entry.status !== 'Pending' && entry.winningNumbers?.includes(n)} />)}
                    </div>
                </div>
                 {entry.status !== 'Pending' && (
                     <div>
                        <p className="text-xs font-semibold text-gray-300 mb-1">Winning Numbers:</p>
                        <div className="flex space-x-2">
                            {entry.winningNumbers?.map(n => <NumberBall key={n} number={n} isWinning={true} />)}
                        </div>
                    </div>
                 )}
            </div>
            {isWin && (
                <div className="mt-3 pt-3 border-t border-space-border/50 text-right">
                    <p className="text-lg font-bold text-nova-green">+${entry.prize.toFixed(2)}</p>
                </div>
            )}
        </div>
    )
};


const LottoHistory: React.FC<{ entries: UserLottoEntry[] }> = ({ entries }) => (
    <section id="lotto-history" className="mt-6">
        <h2 className="text-xl font-bold text-star-yellow tracking-wider mb-4">Lotto History</h2>
        <div className="space-y-3">
            {entries.length > 0 ? (
                entries.map(entry => <LottoHistoryEntry key={entry.drawId} entry={entry} />)
            ) : (
                <div className="bg-space-card p-5 rounded-lg text-center text-gray-400 border border-space-border">
                    You haven't participated in any lotteries yet.
                </div>
            )}
        </div>
    </section>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, userData, onVerifyKyc, setActiveTab, onAvatarUpdate }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAvatarUpdate(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <section id="profile-header" className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <img src={user.avatarUrl} alt="User Avatar" className="w-28 h-28 rounded-full ring-4 ring-cyber-pink/50 object-cover" />
                <button onClick={handleCameraClick} className="absolute bottom-0 right-0 w-8 h-8 bg-star-yellow rounded-full flex items-center justify-center text-space-dark hover:scale-110 transition cursor-pointer">
                    <i className="fas fa-camera"></i>
                </button>
            </div>
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
            </div>
        </section>

        <section id="account-details" className="bg-space-card p-5 rounded-lg shadow-lg border border-space-border">
             <h2 className="text-xl font-bold mb-2 tracking-wider">Account Information</h2>
             <ProfileInfoRow label="User ID" value={user.id} />
             <ProfileInfoRow label="Email" value={user.email} />
             <ProfileInfoRow label="KYC Status" value="" isVerified={user.kycVerified} />
        </section>
        
        <LottoHistory entries={userData.lottoEntries} />

        {!user.kycVerified && !isVerifying && (
            <section id="kyc-action" className="mt-6 bg-space-card p-5 rounded-lg shadow-lg text-center border border-space-border">
                 <h2 className="text-xl font-bold mb-2 text-star-yellow">Complete Verification</h2>
                 <p className="text-gray-300 mb-4">Verify your identity to enable withdrawals over $10,000 and enhance your account security.</p>
                 <button onClick={() => setIsVerifying(true)} className="w-full md:w-auto bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition shadow-glow-pink">
                    Start KYC Verification
                 </button>
            </section>
        )}
        
        {!user.kycVerified && isVerifying && (
          <KycForm 
            onVerify={() => {
              onVerifyKyc();
              setIsVerifying(false);
            }}
            onCancel={() => setIsVerifying(false)}
          />
        )}

        <section id="actions" className="mt-6 space-y-3">
            <button onClick={() => setActiveTab('referrals')} className="w-full text-left p-4 bg-space-card rounded-lg hover:bg-space-border transition flex items-center">
                <i className="fas fa-users w-6 mr-3 text-gray-400"></i> Refer & Earn
            </button>
            <button className="w-full text-left p-4 bg-space-card rounded-lg hover:bg-space-border transition flex items-center">
                <i className="fas fa-lock w-6 mr-3 text-gray-400"></i> Change Password
            </button>
             <button className="w-full text-left p-4 bg-space-card rounded-lg hover:bg-space-border transition text-red-400 flex items-center">
                <i className="fas fa-sign-out-alt w-6 mr-3"></i> Logout
            </button>
        </section>

      </div>
    </div>
  );
};