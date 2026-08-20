import { useState, useEffect } from 'react';
import { MonteCarloEngine } from '../core/engine/MonteCarloEngine';
import type { RaceState, MonteCarloResult } from '../types';

interface MonteCarloPanelProps {
  monteCarloEngine: MonteCarloEngine;
  raceState: RaceState;
}

export function MonteCarloPanel({ monteCarloEngine, raceState }: MonteCarloPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [iterations, setIterations] = useState(1000);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate progress updates
    const totalIterations = iterations;
    const batchSize = 100;
    
    for (let i = 0; i < totalIterations; i += batchSize) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(Math.min(((i + batchSize) / totalIterations) * 100, 100));
    }

    const simResult = monteCarloEngine.run(raceState, totalIterations);
    setResult(simResult);
    setIsRunning(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Monte Carlo Simulation
      </h3>

      <div className="mb-4">
        <label className="text-sm text-gray-400 block mb-2">Iterations</label>
        <select
          value={iterations}
          onChange={(e) => setIterations(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white w-full"
          disabled={isRunning}
        >
          <option value={100}>100 (Fast)</option>
          <option value={500}>500 (Medium)</option>
          <option value={1000}>1000 (Standard)</option>
          <option value={5000}>5000 (Detailed)</option>
          <option value={10000}>10000 (Comprehensive)</option>
        </select>
      </div>

      <button
        onClick={runSimulation}
        disabled={isRunning}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isRunning
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isRunning ? 'Running...' : 'Run Simulation'}
      </button>

      {isRunning && (
        <div className="mt-4">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">{progress.toFixed(0)}%</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {result.driverResults.map((driverResult) => (
              <div key={driverResult.carId} className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">
                  #{driverResult.carId} {driverResult.driverName}
                </div>
                <div className="text-lg font-bold text-white">
                  P{driverResult.avgFinish.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Win: {(driverResult.winProbability * 100).toFixed(0)}% | 
                  Podium: {(driverResult.podiumProbability * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Race Scenarios</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Safety Car Probability</span>
                <span className="text-white font-mono">
                  {(result.safetyCarProbability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Rain Probability</span>
                <span className="text-white font-mono">
                  {(result.rainProbability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg. Safety Cars</span>
                <span className="text-white font-mono">
                  {result.avgSafetyCars.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <h4 className="text-yellow-400 text-sm font-semibold mb-2">Key Insights</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {result.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
