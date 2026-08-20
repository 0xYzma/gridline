import { useState, useEffect, useCallback } from 'react';
import { RaceEngine } from '../core/engine/RaceEngine';
import type { RaceState, CarState, RaceEvent } from '../types';

interface UseRaceSimulationProps {
  engine: RaceEngine;
  initialSpeed?: number;
}

export function useRaceSimulation({ engine, initialSpeed = 1 }: UseRaceSimulationProps) {
  const [raceState, setRaceState] = useState<RaceState>(engine.getState());
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [events, setEvents] = useState<RaceEvent[]>([]);

  const tick = useCallback(() => {
    const newState = engine.tick();
    setRaceState({ ...newState });
    
    // Collect new events
    const newEvents = engine.getRecentEvents(5);
    if (newEvents.length > 0) {
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    }

    if (newState.session.status === 'COMPLETED') {
      setIsRunning(false);
    }
  }, [engine]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      const delays = [2000, 1000, 500, 100]; // Speed 1-4 delays
      const delay = delays[Math.min(speed - 1, 3)];
      
      interval = setInterval(tick, delay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speed, tick]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    engine.reset();
    setRaceState(engine.getState());
    setEvents([]);
    setIsRunning(false);
  };

  const triggerPitStop = (carId: number) => {
    engine.pitStop(carId);
    setRaceState({ ...engine.getState() });
  };

  const deploySafetyCar = () => {
    engine.setRaceState('SAFETY_CAR');
    setRaceState({ ...engine.getState() });
  };

  const clearSafetyCar = () => {
    engine.setRaceState('GREEN');
    setRaceState({ ...engine.getState() });
  };

  return {
    raceState,
    isRunning,
    speed,
    events,
    start,
    pause,
    reset,
    setSpeed,
    triggerPitStop,
    deploySafetyCar,
    clearSafetyCar,
  };
}
