import type { CarState, TireCompound, SessionInfo, WeatherCondition, PitStop, RaceEvent, TireState, RaceState, TrackState } from '../../types';

interface DriverPaceData {
  baseLapTime: number;
  tireDegradation: Record<TireCompound, number>;
  fuelEffect: number;
  drsGain: number;
  consistency: number;
}

// Deterministic PRNG (seeded random number generator)
export class SeededRandom {
  private seed: number;
  
  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  // Returns value between 0 and 1
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  
  // Normal distribution using Box-Muller transform
  normal(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1 + 0.0001)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

// Sigmoid function for cliff modeling
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export class RaceEngine {
  private carStates: Map<string, CarState>;
  private paceData: Map<string, DriverPaceData>;
  private sessionInfo: SessionInfo | null;
  private pitHistory: PitStop[];
  private raceEvents: RaceEvent[];
  private currentLap: number;
  private weather: WeatherCondition;
  private raceState: RaceState;
  private trackState: TrackState;
  private rng: SeededRandom;
  
  // Circuit parameters per PRD
  private passingDifficulty: number = 0.85;
  private abrasiveness: number = 0.72;

  constructor(seed: string = 'default-race') {
    this.carStates = new Map();
    this.paceData = new Map();
    this.sessionInfo = null;
    this.pitHistory = [];
    this.raceEvents = [];
    this.currentLap = 1;
    this.weather = this.getDefaultWeather();
    this.raceState = 'GREEN';
    this.trackState = 'DRY';
    this.rng = new SeededRandom(seed);
  }

  private getDefaultWeather(): WeatherCondition {
    return {
      trackTemp: 32,
      airTemp: 24,
      humidity: 45,
      windSpeed: 12,
      windDirection: 180,
      rainChance: 10,
      rainfallIntensity: 0,
      rainEtaMinutes: undefined,
      crossoverEstimateLap: undefined,
    };
  }

  initializeSession(drivers: string[], paceData: Map<string, DriverPaceData>, totalLaps: number, startLap: number = 1): void {
    this.paceData = paceData;
    this.currentLap = startLap;
    
    // Initialize car states based on grid position with PRD demo scenario
    drivers.forEach((driverId, index) => {
      const pace = paceData.get(driverId);
      if (!pace) throw new Error(`No pace data for driver ${driverId}`);
      
      // Demo scenario: Lap 58/78, top 5 on MEDIUM (19 laps), rest on HARD (31 laps)
      const isTopFive = index < 5;
      const compound: TireCompound = isTopFive ? 'MEDIUM' : 'HARD';
      const tireAge = isTopFive ? 19 : 31;
      
      this.carStates.set(driverId, {
        driverId,
        position: index + 1,
        gap: index * 1.2,
        interval: index === 0 ? 0 : 1.2,
        lap: startLap,
        progress: this.rng.next(),
        sector1Time: null,
        sector2Time: null,
        sector3Time: null,
        lastLapTime: 75 + this.rng.next() * 2,
        bestLapTime: 74 + this.rng.next(),
        tire: this.createTireState(compound, tireAge),
        fuel: 65 - index * 0.5,
        inPit: false,
        pitProgress: undefined,
        isOut: false,
        DRS: index < 10,
        status: 'RACING',
      });
    });

    this.sessionInfo = {
      id: crypto.randomUUID(),
      type: 'RACE',
      circuitId: 'port-azure',
      status: 'LIVE',
      raceState: 'GREEN',
      trackState: 'DRY',
      currentLap: startLap,
      totalLaps,
      timeRemaining: null,
      weather: this.weather,
      seed: 'port-azure-rain-demo-01',
    };
    
    this.raceState = 'GREEN';
    this.trackState = 'DRY';
  }
  
  private createTireState(compound: TireCompound, ageLaps: number): TireState {
    const profiles: Record<TireCompound, Omit<TireState, 'ageLaps' | 'wear' | 'temperature'>> = {
      SOFT: { compound: 'SOFT', optimalTempMin: 88, optimalTempMax: 103, baseDegRate: 0.012, warmupLaps: 2, cliffThreshold: 0.75, cliffMagnitude: 0.8 },
      MEDIUM: { compound: 'MEDIUM', optimalTempMin: 90, optimalTempMax: 105, baseDegRate: 0.008, warmupLaps: 3, cliffThreshold: 0.8, cliffMagnitude: 0.6 },
      HARD: { compound: 'HARD', optimalTempMin: 92, optimalTempMax: 108, baseDegRate: 0.005, warmupLaps: 4, cliffThreshold: 0.85, cliffMagnitude: 0.4 },
      INTERMEDIATE: { compound: 'INTERMEDIATE', optimalTempMin: 60, optimalTempMax: 85, baseDegRate: 0.006, warmupLaps: 2, cliffThreshold: 0.7, cliffMagnitude: 0.5 },
      WET: { compound: 'WET', optimalTempMin: 50, optimalTempMax: 75, baseDegRate: 0.004, warmupLaps: 2, cliffThreshold: 0.65, cliffMagnitude: 0.4 },
    };
    
    const profile = profiles[compound];
    const wear = Math.min(1, ageLaps * profile.baseDegRate);
    const targetTemp = (profile.optimalTempMin + profile.optimalTempMax) / 2;
    const warmupFactor = Math.min(1, ageLaps / profile.warmupLaps);
    const temperature = 40 + (targetTemp - 40) * warmupFactor;
    
    return { ...profile, ageLaps, wear, temperature };
  }

  simulateLap(): void {
    if (!this.sessionInfo || this.sessionInfo.status !== 'LIVE') return;

    const lapTimes = new Map<string, number>();

    // Calculate lap times using PRD deterministic pace model
    this.carStates.forEach((car, driverId) => {
      if (car.isOut || car.inPit) return;

      const pace = this.paceData.get(driverId);
      if (!pace) return;

      // Base lap time with seeded variability
      let lapTime = pace.baseLapTime + this.rng.normal(0, 0.15);
      
      // Tire degradation effect (PRD Section 28-32)
      const tireDeg = pace.tireDegradation[car.tire.compound];
      lapTime += tireDeg * car.tire.ageLaps * 0.01;
      
      // Warm-up penalty for new tires
      if (car.tire.ageLaps < car.tire.warmupLaps) {
        const warmupPenalty = (car.tire.warmupLaps - car.tire.ageLaps) * 0.15;
        lapTime += warmupPenalty;
      }
      
      // Cliff penalty (PRD Section 30)
      if (car.tire.wear > car.tire.cliffThreshold) {
        const cliffExcess = car.tire.wear - car.tire.cliffThreshold;
        const cliffPenalty = sigmoid(cliffExcess * 10) * car.tire.cliffMagnitude;
        lapTime += cliffPenalty;
      }
      
      // Temperature penalty
      const optimalMid = (car.tire.optimalTempMin + car.tire.optimalTempMax) / 2;
      const tempDeviation = Math.abs(car.tire.temperature - optimalMid);
      if (tempDeviation > 10) {
        lapTime += (tempDeviation - 10) * 0.01;
      }
      
      // Fuel effect (lighter = faster)
      lapTime += pace.fuelEffect * (car.fuel / 100);
      
      // Traffic penalty (PRD Section 34)
      const trafficPenalty = this.calculateTrafficPenalty(driverId);
      lapTime += trafficPenalty;
      
      // Weather effect
      if (this.weather.rainChance > 50) {
        const wetPenalty = 1 + (this.weather.rainChance / 100) * 0.1;
        lapTime *= wetPenalty;
      }
      
      // Safety car effect
      if (this.raceState === 'SAFETY_CAR' || this.raceState === 'VIRTUAL_SAFETY_CAR') {
        lapTime *= 1.4;
      }

      lapTimes.set(driverId, lapTime);

      // Update car state
      car.lastLapTime = lapTime;
      if (!car.bestLapTime || lapTime < car.bestLapTime) {
        car.bestLapTime = lapTime;
      }
      
      // Update tire state
      car.tire.ageLaps++;
      const wearIncrement = car.tire.baseDegRate * this.abrasiveness * 0.1;
      car.tire.wear = Math.min(1, car.tire.wear + wearIncrement);
      
      // Update temperature
      const targetTemp = (car.tire.optimalTempMin + car.tire.optimalTempMax) / 2;
      car.tire.temperature += (targetTemp - car.tire.temperature) * 0.1;
      
      // Fuel consumption
      car.fuel = Math.max(0, car.fuel - 1.5);
      
      // Update progress
      car.progress = (car.progress + 1 / 78) % 1;
    });

    // Sort by lap time and update positions
    const sortedDrivers = Array.from(lapTimes.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);

    // Check for overtakes and update positions
    let cumulativeGap = 0;
    sortedDrivers.forEach((driverId, index) => {
      const car = this.carStates.get(driverId);
      if (!car) return;

      const oldPosition = car.position;
      car.position = index + 1;
      car.gap = cumulativeGap;
      
      if (index > 0) {
        const prevDriver = sortedDrivers[index - 1];
        const prevCar = this.carStates.get(prevDriver);
        if (prevCar) {
          car.interval = Math.max(0.3, (lapTimes.get(prevDriver) || 0) - (lapTimes.get(driverId) || 0) + 0.8);
        }
      }
      
      // Record overtake event
      if (oldPosition !== car.position && Math.abs(oldPosition - car.position) > 0) {
        this.raceEvents.push({
          type: 'POSITION_CHANGED',
          lap: this.currentLap,
          timestamp: new Date(),
          driverId,
          description: `${driverId} moves to P${car.position}`,
          metadata: { oldPosition, newPosition: car.position },
        });
      }
      
      cumulativeGap += car.interval;
      car.lap = this.currentLap + 1;
    });

    this.currentLap++;
    if (this.sessionInfo) {
      this.sessionInfo.currentLap = this.currentLap;
    }
    
    // Check for race end
    if (this.currentLap > (this.sessionInfo?.totalLaps || 78)) {
      this.sessionInfo.status = 'FINISHED';
      this.raceState = 'FINISHED';
    }
  }
  
  private calculateTrafficPenalty(driverId: string): number {
    const car = this.carStates.get(driverId);
    if (!car) return 0;
    
    // Find car ahead
    const carsAhead = Array.from(this.carStates.values())
      .filter(c => c.position < car.position && !c.inPit && !c.isOut)
      .sort((a, b) => a.position - b.position);
    
    if (carsAhead.length === 0) return 0;
    
    const carAhead = carsAhead[0];
    const gap = car.gap - carAhead.gap;
    
    // PRD Section 34: Traffic model
    const trafficThreshold = 2.0;
    const gapFactor = Math.max(0, Math.min(1, (trafficThreshold - gap) / trafficThreshold));
    const dirtyAirSensitivity = 0.3;
    
    return gapFactor * dirtyAirSensitivity * this.passingDifficulty * 0.5;
  }

  pitStop(driverId: string, newCompound: TireCompound): void {
    const car = this.carStates.get(driverId);
    if (!car || car.isOut) return;

    car.inPit = true;
    car.status = 'PITTING';
    car.pitProgress = 0;

    const pitDuration = 2.3 + this.rng.next() * 0.4;
    
    this.pitHistory.push({
      driverId,
      lap: this.currentLap,
      duration: pitDuration,
      tireChange: newCompound,
      timestamp: new Date(),
      status: 'STOP_ACTIVE',
    });

    this.raceEvents.push({
      type: 'PIT_IN',
      lap: this.currentLap,
      timestamp: new Date(),
      driverId,
      description: `${driverId} pits for ${newCompound.toLowerCase()} tires`,
    });

    // Simulate pit stop
    setTimeout(() => {
      if (car) {
        car.inPit = false;
        car.tire = this.createTireState(newCompound, 0);
        car.fuel = 60;
        car.pitProgress = undefined;
        car.status = 'RACING';
        car.progress = 0.95; // Rejoin near back
        
        this.raceEvents.push({
          type: 'PIT_OUT',
          lap: this.currentLap,
          timestamp: new Date(),
          driverId,
          description: `${driverId} exits pit lane`,
        });
        
        this.raceEvents.push({
          type: 'TYRE_CHANGED',
          lap: this.currentLap,
          timestamp: new Date(),
          driverId,
          description: `${driverId} changed to ${newCompound} tires`,
        });
      }
    }, 100);
  }

  setRaceState(newState: RaceState): void {
    if (this.raceState === newState) return;
    
    const oldState = this.raceState;
    this.raceState = newState;
    
    if (this.sessionInfo) {
      this.sessionInfo.raceState = newState;
    }
    
    this.raceEvents.push({
      type: 'FLAG_CHANGED',
      lap: this.currentLap,
      timestamp: new Date(),
      description: `Race state changed from ${oldState} to ${newState}`,
      metadata: { oldState, newState },
    });
  }

  getCarState(driverId: string): CarState | undefined {
    return this.carStates.get(driverId);
  }

  getAllCarStates(): CarState[] {
    return Array.from(this.carStates.values()).sort((a, b) => a.position - b.position);
  }

  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  getPitHistory(): PitStop[] {
    return this.pitHistory;
  }

  getRaceEvents(): RaceEvent[] {
    return this.raceEvents;
  }
  
  getRaceState(): RaceState {
    return this.raceState;
  }
  
  getTrackState(): TrackState {
    return this.trackState;
  }
}

export default RaceEngine;
