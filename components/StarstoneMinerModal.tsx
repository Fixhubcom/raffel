
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface StarstoneMinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (pointsWon: number) => void;
}

const MAX_POWER = 20;

export const StarstoneMinerModal: React.FC<StarstoneMinerModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [miningPower, setMiningPower] = useState(MAX_POWER);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; value: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setMiningPower(MAX_POWER);
      setScore(0);
      setIsFinished(false);
      setFloatingPoints([]);
    }
  }, [isOpen]);

  const handleMineClick = () => {
    if (isFinished || isMining || miningPower <= 0) return;

    setIsMining(true);
    setMiningPower(prev => prev - 1);

    // 70% chance to get points
    if (Math.random() < 0.7) {
      const pointsWon = Math.floor(Math.random() * 20) + 5; // 5 to 24 points
      setScore(prev => prev + pointsWon);
      setFloatingPoints(prev => [...prev, { id: Date.now(), value: pointsWon }]);
    }
    
    setTimeout(() => {
        setIsMining(false);
        if (miningPower - 1 <= 0) {
            setIsFinished(true);
        }
    }, 500); // Cooldown to match animation
    
    setTimeout(() => setFloatingPoints(prev => prev.slice(1)), 1000); // remove floating point after animation
  };

  const handleFinish = () => {
    onComplete(score);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleFinish} title="Starstone Miner Expedition">
      {isFinished ? (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-star-yellow">Expedition Complete!</h3>
          <p className="text-lg mt-2">Your mining power is depleted.</p>
          <div className="my-6">
            <p className="text-gray-400">Total EXP Gathered</p>
            <p className="text-5xl font-bold text-nova-green animate-pulse">{score.toLocaleString()}</p>
          </div>
          <button onClick={handleFinish} className="w-full bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition">
            Return to Game Zone
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center bg-space-border p-3 rounded-lg mb-6">
                <div>
                    <p className="text-sm text-gray-300">Mining Power</p>
                    <p className="text-2xl font-bold text-white">{miningPower} / {MAX_POWER}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-300 text-right">EXP Gathered</p>
                    <p className="text-2xl font-bold text-nova-green">{score.toLocaleString()}</p>
                </div>
            </div>

            <div className="relative w-48 h-48 mb-6">
                 <button onClick={handleMineClick} className={`w-full h-full cursor-pointer transition-transform duration-200 ${isMining ? 'animate-shake' : 'hover:scale-105'}`}>
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg flex items-center justify-center">
                        <i className="fas fa-gem text-6xl text-white/80"></i>
                    </div>
                </button>
                {floatingPoints.map(fp => (
                    <span key={fp.id} className="animate-float-points text-2xl font-bold text-star-yellow" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        +{fp.value}
                    </span>
                ))}
            </div>
           
            <p className="text-gray-400 text-sm h-4">{isMining ? "Mining..." : "Click the stone to mine!"}</p>
        </div>
      )}
    </Modal>
  );
};
