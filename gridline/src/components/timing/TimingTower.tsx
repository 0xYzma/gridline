import React from 'react';
import type { CarState, SessionInfo } from '../../types';
import { tireColors } from '../../data/mockData';

interface TimingTowerProps {
  carStates: CarState[];
  sessionInfo: SessionInfo | null;
}

export const TimingTower: React.FC<TimingTowerProps> = ({ carStates, sessionInfo }) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--.---';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
  };

  const formatGap = (gap: number): string => {
    if (gap === 0) return 'LEADER';
    if (gap < 10) return `+${gap.toFixed(3)}`;
    return `+${gap.toFixed(1)}`;
  };

  return (
    <div className="bg-gridline-dark rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gridline-lighter">
        <h2 className="text-xl font-bold text-white">Timing Tower</h2>
        {sessionInfo && (
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>Lap {sessionInfo.currentLap}/{sessionInfo.totalLaps}</span>
            <span>{sessionInfo.type}</span>
            <span className={sessionInfo.status === 'LIVE' ? 'text-gridline-success' : 'text-gray-400'}>
              {sessionInfo.status}
            </span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gridline-light text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Driver</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">Tire</th>
              <th className="px-4 py-3 text-right">Gap</th>
              <th className="px-4 py-3 text-right">Interval</th>
              <th className="px-4 py-3 text-right">Last Lap</th>
              <th className="px-4 py-3 text-right">Best Lap</th>
              <th className="px-4 py-3 text-center">Pit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {carStates.sort((a, b) => a.position - b.position).map((car) => (
              <tr key={car.driverId} className="hover:bg-gridline-light transition-colors">
                <td className="px-4 py-3 text-white font-mono">{car.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{car.driverId}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{car.driverId.split('')[0]}</td>
                <td className="px-4 py-3 text-center">
                  <span 
                    className="inline-block px-2 py-1 rounded text-xs font-bold"
                    style={{ backgroundColor: tireColors[car.tire.compound], color: '#000' }}
                  >
                    {car.tire.compound.charAt(0)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">L{car.tire.ageLaps}</span>
                </td>
                <td className={`px-4 py-3 text-right font-mono ${car.gap === 0 ? 'text-gridline-success' : 'text-gray-400'}`}>
                  {formatGap(car.gap)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-400">
                  {car.interval > 0 ? `+${car.interval.toFixed(3)}` : '-'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-white">
                  {formatTime(car.lastLapTime)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gridline-accent">
                  {formatTime(car.bestLapTime)}
                </td>
                <td className="px-4 py-3 text-center">
                  {car.inPit ? (
                    <span className="text-gridline-warning text-xs font-bold animate-pulse">PIT</span>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimingTower;
