
import React from 'react';

interface StatusBarProps {
  energy: number;
  maxEnergy: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ energy, maxEnergy }) => {
  const energyPercentage = (energy / maxEnergy) * 100;
  let energyColor = 'bg-green-500';
  if (energyPercentage < 25) {
    energyColor = 'bg-red-500';
  } else if (energyPercentage < 50) {
    energyColor = 'bg-yellow-500';
  }

  return (
    <div className="p-2 bg-gray-700 text-sm flex justify-between items-center shadow">
      <div className="font-semibold">
        Energy: <span className={energyPercentage < 25 ? 'text-red-400' : (energyPercentage < 50 ? 'text-yellow-400' : 'text-green-400')}>{energy}</span> / {maxEnergy}
      </div>
      <div className="w-1/3 bg-gray-600 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${energyColor}`}
          style={{ width: `${energyPercentage}%` }}
          role="progressbar"
          aria-valuenow={energy}
          aria-valuemin={0}
          aria-valuemax={maxEnergy}
          aria-label="Player energy"
        ></div>
      </div>
    </div>
  );
};
