// Monte Carlo Simulation Engine (PRD Section 54-57)
import type {
  SimulationJob,
  MonteCarloResult,
  StrategyVersion,
  CarState,
  SessionInfo,
} from '../../types';
import { SeededRandom } from './RaceEngine';

interface SimulationIteration {
  winner: string;
  podium: string[];
  pointsFinishers: string[];
  finishPositions: Map<string, number>;
  raceTime: number;
  safetyCarDeployed: boolean;
  rainOccurred: boolean;
}

export class MonteCarloEngine {
  private jobs: Map<string, SimulationJob>;
  
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Queue a Monte Carlo simulation job
   */
  queueSimulation(job: SimulationJob): void {
    this.jobs.set(job.sessionId + '_' + job.strategyVersionId, job);
  }

  /**
   * Run Monte Carlo simulation synchronously (for frontend demo)
   * In production, this would be async with worker threads
   */
  runSimulation(
    strategyVersion: StrategyVersion,
    carStates: Map<string, CarState>,
    sessionInfo: SessionInfo,
    iterations: number = 1000,
    seed: string
  ): MonteCarloResult {
    const results: SimulationIteration[] = [];
    
    // Run iterations
    for (let i = 0; i < iterations; i++) {
      const iterationSeed = `${seed}_iter_${i}`;
      const iterationRng = new SeededRandom(iterationSeed);
      
      const result = this.runSingleIteration(
        strategyVersion,
        carStates,
        sessionInfo,
        iterationRng
      );
      results.push(result);
    }

    return this.aggregateResults(results, iterations);
  }

  private runSingleIteration(
    strategyVersion: StrategyVersion,
    carStates: Map<string, CarState>,
    sessionInfo: SessionInfo,
    rng: SeededRandom
  ): SimulationIteration {
    const remainingLaps = sessionInfo.totalLaps - sessionInfo.currentLap + 1;
    const drivers = Array.from(carStates.keys());
    
    // Initialize driver performance for this iteration
    const driverPerformance = new Map<string, {
      basePace: number;
      consistency: number;
      tireWearRate: number;
      wetSkill: number;
    }>();

    drivers.forEach(driverId => {
      driverPerformance.set(driverId, {
        basePace: 74 + rng.normal(0, 0.3),
        consistency: 0.8 + rng.next() * 0.2,
        tireWearRate: 0.9 + rng.next() * 0.2,
        wetSkill: 0.7 + rng.next() * 0.3,
      });
    });

    // Determine if safety car deploys in this iteration
    const safetyCarProbability = 0.15; // 15% per race
    const safetyCarDeployed = rng.next() < safetyCarProbability;
    const safetyCarLap = safetyCarDeployed 
      ? sessionInfo.currentLap + Math.floor(rng.next() * remainingLaps)
      : Infinity;

    // Determine if rain occurs
    const rainProbability = sessionInfo.weather.rainChance / 100;
    const rainOccurred = rng.next() < rainProbability;
    const rainStartLap = rainOccurred
      ? sessionInfo.currentLap + Math.floor(rng.next() * remainingLaps)
      : Infinity;

    // Simulate race
    const driverDistances = new Map<string, number>(drivers.map(d => [d, 0]));
    const driverPitStops = new Map<string, number>(drivers.map(d => [d, 0]));
    
    for (let lap = sessionInfo.currentLap; lap <= sessionInfo.totalLaps; lap++) {
      const isSafetyCar = lap >= safetyCarLap && lap < safetyCarLap + 3;
      const isRaining = lap >= rainStartLap;
      
      drivers.forEach(driverId => {
        const perf = driverPerformance.get(driverId)!;
        
        // Calculate lap time for this lap
        let lapTime = perf.basePace;
        
        // Tire degradation effect
        const stintLength = this.getCurrentStintLength(strategyVersion, lap);
        const tireDegradation = stintLength * 0.008 * perf.tireWearRate;
        lapTime += tireDegradation;
        
        // Pit stop penalty
        const shouldPit = this.shouldPitThisLap(strategyVersion, lap, driverId === strategyVersion.creator);
        if (shouldPit) {
          lapTime += 22.5; // Pit lane loss
          driverPitStops.set(driverId, (driverPitStops.get(driverId) || 0) + 1);
        }
        
        // Safety car effect
        if (isSafetyCar) {
          lapTime *= 1.4;
        }
        
        // Rain effect
        if (isRaining) {
          const tireIsWet = this.isUsingWetTires(strategyVersion, lap);
          if (!tireIsWet) {
            lapTime += 2.5 * (1 - perf.wetSkill);
          } else {
            lapTime -= 0.5 * perf.wetSkill;
          }
        }
        
        // Add variability
        lapTime += rng.normal(0, 0.2 * (1 - perf.consistency));
        
        driverDistances.set(driverId, (driverDistances.get(driverId) || 0) + lapTime);
      });
    }

    // Sort by total race time
    const sortedDrivers = drivers.sort((a, b) => 
      (driverDistances.get(a) || 0) - (driverDistances.get(b) || 0)
    );

    const winner = sortedDrivers[0];
    const podium = sortedDrivers.slice(0, 3);
    const pointsFinishers = sortedDrivers.slice(0, 10);
    const finishPositions = new Map(sortedDrivers.map((d, i) => [d, i + 1]));
    const raceTime = driverDistances.get(winner) || 0;

    return {
      winner,
      podium,
      pointsFinishers,
      finishPositions,
      raceTime,
      safetyCarDeployed,
      rainOccurred,
    };
  }

  private aggregateResults(iterations: SimulationIteration[], totalIterations: number): MonteCarloResult {
    const winCounts = new Map<string, number>();
    const podiumCounts = new Map<string, number>();
    const pointsCounts = new Map<string, number>();
    const positionSums = new Map<string, number>();
    
    let totalDownsideRisk = 0;
    let totalUpsideRange = 0;

    iterations.forEach(iter => {
      // Win probabilities
      iter.podium.forEach((driverId, idx) => {
        if (idx === 0) {
          winCounts.set(driverId, (winCounts.get(driverId) || 0) + 1);
        }
        podiumCounts.set(driverId, (podiumCounts.get(driverId) || 0) + 1);
      });

      iter.pointsFinishers.forEach(driverId => {
        pointsCounts.set(driverId, (pointsCounts.get(driverId) || 0) + 1);
      });

      // Position statistics
      iter.finishPositions.forEach((position, driverId) => {
        positionSums.set(driverId, (positionSums.get(driverId) || 0) + position);
      });

      // Risk metrics
      const bestPosition = Math.min(...Array.from(iter.finishPositions.values()));
      const worstPosition = Math.max(...Array.from(iter.finishPositions.values()));
      totalDownsideRisk += worstPosition;
      totalUpsideRange += (bestPosition - worstPosition);
    });

    const winProbabilities = new Map<string, number>();
    const podiumProbabilities = new Map<string, number>();
    const pointsProbabilities = new Map<string, number>();
    const medianFinishPositions = new Map<string, number>();

    positionSums.forEach((sum, driverId) => {
      const avgPosition = sum / totalIterations;
      medianFinishPositions.set(driverId, Math.round(avgPosition));
    });

    winCounts.forEach((count, driverId) => {
      winProbabilities.set(driverId, count / totalIterations);
    });

    podiumCounts.forEach((count, driverId) => {
      podiumProbabilities.set(driverId, count / totalIterations);
    });

    pointsCounts.forEach((count, driverId) => {
      pointsProbabilities.set(driverId, count / totalIterations);
    });

    return {
      simulations: totalIterations,
      winProbabilities,
      podiumProbabilities,
      pointsProbabilities,
      medianFinishPositions,
      downsideRisk: totalDownsideRisk / totalIterations,
      upsideRange: totalUpsideRange / totalIterations,
    };
  }

  private getCurrentStintLength(strategy: StrategyVersion, currentLap: number): number {
    const currentStint = strategy.stints.find(
      stint => stint.startLap <= currentLap && stint.endLap >= currentLap
    );
    
    if (!currentStint) return 10;
    return currentLap - currentStint.startLap + 1;
  }

  private shouldPitThisLap(strategy: StrategyVersion, lap: number, isFocusDriver: boolean): boolean {
    if (!isFocusDriver) {
      // Other drivers pit randomly for simulation
      return false;
    }
    
    // Check if this is a planned pit stop lap
    for (let i = 1; i < strategy.stints.length; i++) {
      if (strategy.stints[i].startLap === lap) {
        return true;
      }
    }
    return false;
  }

  private isUsingWetTires(strategy: StrategyVersion, lap: number): boolean {
    const currentStint = strategy.stints.find(
      stint => stint.startLap <= lap && stint.endLap >= lap
    );
    
    if (!currentStint) return false;
    return currentStint.compound === 'INTERMEDIATE' || currentStint.compound === 'WET';
  }

  getJobStatus(jobId: string): SimulationJob | undefined {
    return this.jobs.get(jobId);
  }

  cancelJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'CANCELLED';
    }
  }
}

export default MonteCarloEngine;
