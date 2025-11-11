
import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: Date;
}

const TimeCard: React.FC<{ value: number; label: string, glowColor: string }> = ({ value, label, glowColor }) => (
  <div className="flex flex-col items-center">
    <div className={`text-2xl md:text-3xl font-bold text-white bg-black/30 rounded-lg px-3 py-1.5 shadow-lg`} style={{ textShadow: `0 0 8px ${glowColor}` }}>
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-xs text-gray-400 uppercase tracking-widest mt-1.5">{label}</div>
  </div>
);

export const CountdownTimer: React.FC<CountdownTimerProps & { glowColor: string }> = ({ targetDate, glowColor }) => {
  const { hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <TimeCard value={hours} label="Hrs" glowColor={glowColor} />
      <span className="text-3xl font-light pb-5 text-gray-500">:</span>
      <TimeCard value={minutes} label="Min" glowColor={glowColor} />
       <span className="text-3xl font-light pb-5 text-gray-500">:</span>
      <TimeCard value={seconds} label="Sec" glowColor={glowColor} />
    </div>
  );
};
