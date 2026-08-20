import { useState, useEffect, useCallback } from 'react';
import RaceEngine from './core/engine/RaceEngine';
import { CircuitVisualizer } from './components/circuit/CircuitVisualizer';
import { TimingTower } from './components/timing/TimingTower';
import type { CarState, SessionInfo } from './types';
import { mockDrivers, driverPaceData, mockCircuit } from './data/mockData';

function App() {
  const [raceEngine] = useState(() => new RaceEngine('port-azure-rain-demo-01'));
  const [carStates, setCarStates] = useState<CarState[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per lap

  // Initialize race with PRD demo scenario (Lap 58/78)
  useEffect(() => {
    const driverIds = mockDrivers.map(d => d.id);
    raceEngine.initializeSession(driverIds, driverPaceData, 78, 58); // Start at lap 58
    
    setCarStates(raceEngine.getAllCarStates());
    setSessionInfo(raceEngine.getSessionInfo());
  }, [raceEngine]);

  // Simulation loop
  const simulateNextLap = useCallback(() => {
    raceEngine.simulateLap();
    setCarStates([...raceEngine.getAllCarStates()]);
    setSessionInfo(raceEngine.getSessionInfo());
  }, [raceEngine]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      simulateNextLap();
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed, simulateNextLap]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const driverIds = mockDrivers.map(d => d.id);
    raceEngine.initializeSession(driverIds, driverPaceData, 78, 58);
    setCarStates(raceEngine.getAllCarStates());
    setSessionInfo(raceEngine.getSessionInfo());
  };

  const handlePitStop = (driverId: string) => {
    const compounds: Array<'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET'> = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'];
    const randomCompound = compounds[Math.floor(Math.random() * compounds.length)];
    raceEngine.pitStop(driverId, randomCompound);
    setCarStates([...raceEngine.getAllCarStates()]);
  };

  const handleSafetyCar = () => {
    const currentState = raceEngine.getRaceState();
    const newState = currentState === 'SAFETY_CAR' ? 'GREEN' : 'SAFETY_CAR';
    raceEngine.setRaceState(newState);
    setSessionInfo(raceEngine.getSessionInfo());
  };

  return (
    <div className="min-h-screen bg-gridline-darker text-white">
      {/* Header */}
      <header className="bg-gridline-dark border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gridline-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">GRIDLINE</h1>
              <p className="text-xs text-gray-400">Motorsport Strategy Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSafetyCar}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                sessionInfo?.raceState === 'SAFETY_CAR'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {sessionInfo?.raceState === 'SAFETY_CAR' ? 'SC DEPLOYED' : 'DEPLOY SC'}
            </button>
            
            <div className="flex items-center gap-2 bg-gridline-light rounded-lg px-4 py-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <select 
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
              >
                <option value={2000}>Slow (2s)</option>
                <option value={1000}>Normal (1s)</option>
                <option value={500}>Fast (0.5s)</option>
                <option value={200}>Turbo (0.2s)</option>
              </select>
            </div>
            
            <button
              onClick={handleStartStop}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isRunning 
                  ? 'bg-gridline-warning hover:bg-orange-600' 
                  : 'bg-gridline-success hover:bg-green-600'
              }`}
            >
              {isRunning ? 'PAUSE' : 'START'}
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gridline-light hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              RESET
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Session Info Bar */}
        {sessionInfo && (
          <div className="mb-6 flex items-center gap-6 bg-gridline-dark rounded-lg px-6 py-4 border border-gray-800">
            <div>
              <span className="text-gray-400 text-sm">Circuit</span>
              <p className="font-semibold">{mockCircuit.name}</p>
            </div>
            <div className="h-10 w-px bg-gray-800"></div>
            <div>
              <span className="text-gray-400 text-sm">Current Lap</span>
              <p className="font-semibold text-2xl">{sessionInfo.currentLap}<span className="text-gray-500 text-lg">/{sessionInfo.totalLaps}</span></p>
            </div>
            <div className="h-10 w-px bg-gray-800"></div>
            <div>
              <span className="text-gray-400 text-sm">Status</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  sessionInfo.raceState === 'GREEN' ? 'bg-gridline-success animate-pulse' :
                  sessionInfo.raceState === 'SAFETY_CAR' ? 'bg-yellow-500 animate-pulse' :
                  'bg-gray-500'
                }`}></span>
                <p className="font-semibold">{sessionInfo.raceState.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-800"></div>
            <div>
              <span className="text-gray-400 text-sm">Weather</span>
              <p className="font-semibold">{sessionInfo.weather.airTemp}°C • {sessionInfo.weather.rainChance}% rain</p>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Circuit Visualizer */}
          <div className="lg:col-span-1">
            <CircuitVisualizer carStates={carStates} circuit={mockCircuit} />
            
            {/* Pit Controls */}
            <div className="mt-6 bg-gridline-dark rounded-lg border border-gray-800 p-4">
              <h3 className="text-lg font-bold mb-4">Quick Pit Commands</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockDrivers.slice(0, 6).map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => handlePitStop(driver.id)}
                    className="px-3 py-2 bg-gridline-light hover:bg-gridline-lighter rounded text-sm font-mono transition-colors"
                  >
                    {driver.id} - PIT
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Timing Tower */}
          <div className="lg:col-span-2">
            <TimingTower carStates={carStates} sessionInfo={sessionInfo} />
            
            {/* Recent Events */}
            <div className="mt-6 bg-gridline-dark rounded-lg border border-gray-800 p-4">
              <h3 className="text-lg font-bold mb-4">Race Events</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {raceEngine.getRaceEvents().slice(-10).reverse().map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500 font-mono">L{event.lap}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      event.type === 'PIT_IN' || event.type === 'PIT_STOP' ? 'bg-gridline-warning text-black' :
                      event.type === 'PIT_OUT' || event.type === 'TYRE_CHANGED' ? 'bg-gridline-success text-black' :
                      event.type === 'POSITION_CHANGED' ? 'bg-blue-600' :
                      event.type === 'FLAG_CHANGED' ? 'bg-yellow-500 text-black' :
                      'bg-gray-700'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-gray-300">{event.description}</span>
                  </div>
                ))}
                {raceEngine.getRaceEvents().length === 0 && (
                  <p className="text-gray-500 text-sm">No events yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
