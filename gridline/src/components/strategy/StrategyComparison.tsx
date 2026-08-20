import React from 'react';
import type { StrategyVersion, PointEstimateResult } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StrategyComparisonProps {
  strategies: StrategyVersion[];
  evaluations: Array<{
    versionId: string;
    pointEstimate: PointEstimateResult;
    totalPitLoss: number;
    tireCliffRisks: number[];
    weatherExposure: number;
    trafficRiskScore: number;
  }>;
  selectedStrategyId: string | null;
  onSelectStrategy: (strategyId: string) => void;
  onCreateNewVersion: () => void;
}

export const StrategyComparison: React.FC<StrategyComparisonProps> = ({
  strategies,
  evaluations,
  selectedStrategyId,
  onSelectStrategy,
  onCreateNewVersion,
}) => {
  const chartData = evaluations.map(evaluation => ({
    name: evaluation.versionId,
    expectedPosition: evaluation.pointEstimate.expectedFinishPosition,
    pitLoss: evaluation.totalPitLoss,
    weatherRisk: evaluation.pointEstimate.projectedWeatherRisk * 10,
    trafficRisk: evaluation.pointEstimate.projectedTrafficRisk * 10,
  }));

  return (
    <div className="bg-gridline-dark rounded-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Strategy Comparison</h2>
        <button
          onClick={onCreateNewVersion}
          className="px-4 py-2 bg-gridline-accent hover:bg-blue-600 text-black rounded-lg font-semibold transition-colors"
        >
          + New Version
        </button>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {strategies.map((strategy) => {
          const evaluation = evaluations.find(e => e.versionId === strategy.id);
          const isSelected = selectedStrategyId === strategy.id;
          
          return (
            <div
              key={strategy.id}
              onClick={() => onSelectStrategy(strategy.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'border-gridline-accent bg-gridline-lighter' 
                  : 'border-gray-700 bg-gridline-light hover:bg-gridline-lighter'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{strategy.name}</h3>
                <span className="text-xs text-gray-400">{strategy.creator}</span>
              </div>
              
              {evaluation && (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected Position:</span>
                      <span className={`font-bold ${
                        evaluation.pointEstimate.expectedFinishPosition <= 3 ? 'text-green-400' :
                        evaluation.pointEstimate.expectedFinishPosition <= 10 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        P{evaluation.pointEstimate.expectedFinishPosition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pit Loss:</span>
                      <span className="font-mono">{evaluation.totalPitLoss.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Delta:</span>
                      <span className={`font-mono ${
                        evaluation.pointEstimate.expectedRaceTimeDelta < 0 ? 'text-green-400' :
                        evaluation.pointEstimate.expectedRaceTimeDelta > 5 ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {evaluation.pointEstimate.expectedRaceTimeDelta >= 0 ? '+' : ''}{evaluation.pointEstimate.expectedRaceTimeDelta.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {strategy.stints.map((stint, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            stint.compound === 'SOFT' ? 'bg-red-900 text-red-200' :
                            stint.compound === 'MEDIUM' ? 'bg-yellow-900 text-yellow-200' :
                            stint.compound === 'HARD' ? 'bg-white text-gray-900' :
                            stint.compound === 'INTERMEDIATE' ? 'bg-green-900 text-green-200' :
                            'bg-blue-900 text-blue-200'
                          }`}
                        >
                          {stint.compound.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      {evaluations.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
              <Legend />
              <Bar dataKey="expectedPosition" name="Expected Position" fill="#3B82F6" />
              <Bar dataKey="pitLoss" name="Pit Loss (s)" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StrategyComparison;
