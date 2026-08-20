import { StrategyEngine } from '../core/engine/StrategyEngine';
import type { StrategyVersion, CarState, RaceState } from '../types';

interface StrategyComparisonProps {
  strategyEngine: StrategyEngine;
  carState: CarState;
  raceState: RaceState;
  onStrategySelect?: (strategy: StrategyVersion) => void;
}

export function StrategyComparison({ 
  strategyEngine, 
  carState, 
  raceState,
  onStrategySelect 
}: StrategyComparisonProps) {
  const strategies = strategyEngine.generateAlternatives(carState, raceState);
  const recommended = strategyEngine.getRecommendation(strategies);

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Strategy Analysis - {carState.driver.number}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {strategies.map((strategy, idx) => {
          const isRecommended = recommended?.id === strategy.id;
          return (
            <div
              key={strategy.id}
              onClick={() => onStrategySelect?.(strategy)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                isRecommended 
                  ? 'bg-green-900/50 border-2 border-green-500' 
                  : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-white">Strategy {idx + 1}</span>
                {isRecommended && (
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    RECOMMENDED
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pit Stops:</span>
                  <span className="text-white font-mono">{strategy.pitStops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tires:</span>
                  <span className="text-white font-mono">
                    {strategy.pitStops.map(p => p.newCompound).join(' → ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Time:</span>
                  <span className="text-white font-mono">+{strategy.estimatedTimeLoss.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cliff Risk:</span>
                  <span className={`font-mono ${
                    strategy.cliffRisk > 0.7 ? 'text-red-400' : 
                    strategy.cliffRisk > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(strategy.cliffRisk * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weather Risk:</span>
                  <span className={`font-mono ${
                    strategy.weatherExposure > 0.7 ? 'text-red-400' : 
                    strategy.weatherExposure > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(strategy.weatherExposure * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recommended && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">AI Recommendation</h4>
          <p className="text-gray-300 text-sm">{recommended.aiReasoning}</p>
          <div className="mt-3 flex gap-4 text-xs">
            <div>
              <span className="text-gray-400">Win Prob:</span>
              <span className="text-white ml-2">{(recommended.winProbability! * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">Podium Prob:</span>
              <span className="text-white ml-2">{(recommended.podiumProbability! * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">Points Prob:</span>
              <span className="text-white ml-2">{(recommended.pointsProbability! * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
