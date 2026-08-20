// Strategy Engine - Point Estimate & Strategy Comparison
import type { 
  StrategyVersion, 
  PointEstimateResult, 
  CarState, 
  SessionInfo, 
  TireCompound,
  WeatherCondition,
  Circuit
} from '../../types';

interface StrategyEvaluation {
  versionId: string;
  pointEstimate: PointEstimateResult;
  totalPitLoss: number;
  tireCliffRisks: number[];
  weatherExposure: number;
  trafficRiskScore: number;
}

export class StrategyEngine {
  private circuit: Circuit;
  
  constructor(circuit: Circuit) {
    this.circuit = circuit;
  }

  /**
   * Quick Point Estimate for a single strategy version (PRD Section 52)
   * Estimates expected finish position and time delta without full simulation
   */
  evaluateStrategy(
    strategy: StrategyVersion,
    currentCarState: CarState,
    sessionInfo: SessionInfo,
    competitorStrategies: Map<string, StrategyVersion>
  ): PointEstimateResult {
    const currentLap = sessionInfo.currentLap;
    const remainingLaps = sessionInfo.totalLaps - currentLap + 1;
    
    // Calculate pit loss time
    let totalPitLoss = 0;
    strategy.stints.forEach((stint, index) => {
      if (index > 0 && stint.startLap >= currentLap) {
        totalPitLoss += this.calculatePitLoss(stint.compound, sessionInfo.weather);
      }
    });

    // Calculate tire cliff risks for each stint
    const tireCliffRisks: number[] = [];
    strategy.stints.forEach((stint) => {
      if (stint.startLap >= currentLap) {
        const stintLength = stint.endLap - stint.startLap + 1;
        const cliffRisk = this.calculateTireCliffRisk(stint.compound, stintLength, sessionInfo.weather);
        tireCliffRisks.push(cliffRisk);
      }
    });

    // Weather risk assessment
    const weatherRisk = this.calculateWeatherRisk(strategy, sessionInfo.weather, remainingLaps);

    // Traffic risk based on pit windows vs competitors
    const trafficRisk = this.calculateTrafficRisk(strategy, competitorStrategies, currentLap);

    // Expected finish position calculation
    const basePosition = currentCarState.position;
    const pitLossPenalty = totalPitLoss * 0.8; // Each ~22s pit loss ≈ 0.8 positions
    const tireRiskPenalty = tireCliffRisks.reduce((a, b) => a + b, 0) * 0.5;
    const weatherPenalty = weatherRisk * 0.3;
    
    const expectedPositionDelta = pitLossPenalty + tireRiskPenalty + weatherPenalty - trafficRisk * 0.2;
    const expectedFinishPosition = Math.max(1, Math.min(20, Math.round(basePosition + expectedPositionDelta)));

    // Expected race time delta vs baseline
    const baselineTime = this.calculateBaselineTime(remainingLaps, currentCarState.tire.compound);
    const strategyTime = this.calculateStrategyTime(strategy, currentLap, sessionInfo.weather);
    const expectedRaceTimeDelta = strategyTime - baselineTime + totalPitLoss;

    return {
      expectedFinishPosition,
      expectedRaceTimeDelta,
      projectedTrafficRisk: trafficRisk,
      projectedPitLoss: totalPitLoss,
      projectedWeatherRisk: weatherRisk,
    };
  }

  /**
   * Compare multiple strategy versions side-by-side
   */
  compareStrategies(
    strategies: StrategyVersion[],
    carStates: Map<string, CarState>,
    sessionInfo: SessionInfo
  ): StrategyEvaluation[] {
    return strategies.map(strategy => {
      const carState = carStates.get(strategy.creator);
      if (!carState) {
        throw new Error(`No car state found for strategy creator: ${strategy.creator}`);
      }

      const pointEstimate = this.evaluateStrategy(
        strategy,
        carState,
        sessionInfo,
        new Map(strategies.filter(s => s.id !== strategy.id).map(s => [s.creator, s]))
      );

      const totalPitLoss = strategy.stints.reduce((acc, stint, idx) => {
        if (idx === 0) return acc;
        return acc + this.calculatePitLoss(stint.compound, sessionInfo.weather);
      }, 0);

      const tireCliffRisks = strategy.stints.map(stint => 
        this.calculateTireCliffRisk(stint.compound, stint.endLap - stint.startLap + 1, sessionInfo.weather)
      );

      const weatherExposure = this.calculateWeatherExposure(strategy, sessionInfo.weather);
      const trafficRiskScore = this.calculateTrafficRiskScore(strategy, sessionInfo.currentLap);

      return {
        versionId: strategy.id,
        pointEstimate,
        totalPitLoss,
        tireCliffRisks,
        weatherExposure,
        trafficRiskScore,
      };
    });
  }

  private calculatePitLoss(_compound: TireCompound, weather: WeatherCondition): number {
    const basePitLoss = 22.5; // Average pit lane loss at Monaco-style circuit
    const wetPenalty = weather.rainChance > 50 ? 3.0 : 0;
    return basePitLoss + wetPenalty;
  }

  private calculateTireCliffRisk(compound: TireCompound, stintLength: number, _weather: WeatherCondition): number {
    const cliffProfiles: Record<TireCompound, { threshold: number; degradation: number }> = {
      SOFT: { threshold: 18, degradation: 0.012 },
      MEDIUM: { threshold: 25, degradation: 0.008 },
      HARD: { threshold: 35, degradation: 0.005 },
      INTERMEDIATE: { threshold: 20, degradation: 0.006 },
      WET: { threshold: 15, degradation: 0.004 },
    };

    const profile = cliffProfiles[compound];
    const wearAtEnd = stintLength * profile.degradation * this.circuit.abrasiveness;
    
    if (wearAtEnd > profile.threshold) {
      return Math.min(1, (wearAtEnd - profile.threshold) * 0.1);
    }
    
    return 0;
  }

  private calculateWeatherRisk(
    _strategy: StrategyVersion, 
    weather: WeatherCondition, 
    _remainingLaps: number
  ): number {
    if (weather.rainChance < 30) return 0;
    
    const crossoverLap = weather.crossoverEstimateLap;
    if (!crossoverLap) return weather.rainChance / 100 * 0.5;

    return 0;
  }

  private calculateWeatherExposure(_strategy: StrategyVersion, weather: WeatherCondition): number {
    if (weather.rainChance < 20) return 0;
    return weather.rainChance / 100;
  }

  private calculateTrafficRisk(
    _strategy: StrategyVersion,
    _competitorStrategies: Map<string, StrategyVersion>,
    _currentLap: number
  ): number {
    return 0;
  }

  private calculateTrafficRiskScore(_strategy: StrategyVersion, _currentLap: number): number {
    return 0;
  }

  private calculateBaselineTime(remainingLaps: number, currentCompound: TireCompound): number {
    const baseLapTimes: Record<TireCompound, number> = {
      SOFT: 73.5,
      MEDIUM: 74.2,
      HARD: 75.0,
      INTERMEDIATE: 76.5,
      WET: 78.0,
    };

    const baseTime = baseLapTimes[currentCompound] * remainingLaps;
    const degradationEffect = remainingLaps * remainingLaps * 0.002;
    
    return baseTime + degradationEffect;
  }

  private calculateStrategyTime(
    strategy: StrategyVersion,
    currentLap: number,
    weather: WeatherCondition
  ): number {
    const baseLapTimes: Record<TireCompound, number> = {
      SOFT: 73.5,
      MEDIUM: 74.2,
      HARD: 75.0,
      INTERMEDIATE: 76.5,
      WET: 78.0,
    };

    let totalTime = 0;
    
    strategy.stints.forEach(stint => {
      if (stint.startLap < currentLap) return;
      
      const stintLength = stint.endLap - stint.startLap + 1;
      const baseTime = baseLapTimes[stint.compound] * stintLength;
      
      // Add degradation effect
      const degRate = this.getDegradationRate(stint.compound);
      const degradationEffect = stintLength * stintLength * degRate * 0.5;
      
      // Weather effect
      const weatherEffect = weather.rainChance > 50 && 
        (stint.compound === 'SOFT' || stint.compound === 'MEDIUM' || stint.compound === 'HARD')
        ? stintLength * 1.5 
        : 0;

      totalTime += baseTime + degradationEffect + weatherEffect;
    });

    return totalTime;
  }

  private getDegradationRate(compound: TireCompound): number {
    const rates: Record<TireCompound, number> = {
      SOFT: 0.012,
      MEDIUM: 0.008,
      HARD: 0.005,
      INTERMEDIATE: 0.006,
      WET: 0.004,
    };
    return rates[compound];
  }

  /**
   * Generate optimal strategy recommendation based on current conditions
   */
  generateRecommendation(
    carState: CarState,
    sessionInfo: SessionInfo,
    _targetPosition: number
  ): { stops: number; compoundSequence: TireCompound[]; stopLaps: number[] } {
    const remainingLaps = sessionInfo.totalLaps - sessionInfo.currentLap + 1;
    const weather = sessionInfo.weather;
    
    // Simple heuristic-based recommendation
    if (weather.rainChance > 70) {
      // Wet strategy
      return {
        stops: 1,
        compoundSequence: ['INTERMEDIATE', 'WET'],
        stopLaps: [sessionInfo.currentLap + Math.floor(remainingLaps / 2)],
      };
    } else if (weather.rainChance > 30) {
      // Mixed strategy
      return {
        stops: 1,
        compoundSequence: ['MEDIUM', 'INTERMEDIATE'],
        stopLaps: [sessionInfo.currentLap + Math.floor(remainingLaps * 0.6)],
      };
    } else {
      // Dry strategy - optimize based on tire age
      const tireAge = carState.tire.ageLaps;
      const maxStintLength = this.getMaxStintLength(carState.tire.compound);
      
      if (tireAge + remainingLaps <= maxStintLength) {
        // One-stop to end
        return {
          stops: 0,
          compoundSequence: [carState.tire.compound],
          stopLaps: [],
        };
      } else {
        // Two-stop strategy
        const stopLap = sessionInfo.currentLap + Math.floor(remainingLaps / 2);
        return {
          stops: 1,
          compoundSequence: ['HARD', 'SOFT'],
          stopLaps: [stopLap],
        };
      }
    }
  }

  private getMaxStintLength(compound: TireCompound): number {
    const lengths: Record<TireCompound, number> = {
      SOFT: 18,
      MEDIUM: 25,
      HARD: 35,
      INTERMEDIATE: 20,
      WET: 15,
    };
    return lengths[compound];
  }
}

export default StrategyEngine;
