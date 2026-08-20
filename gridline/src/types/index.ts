// Core Types for GRIDLINE - Motorsport Strategy Platform
// Based on GRIDLINE_FINAL_AUTHORITATIVE_PRD.md

export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export type RaceState = 'GREEN' | 'LOCAL_YELLOW' | 'FULL_YELLOW' | 'SAFETY_CAR' | 'VIRTUAL_SAFETY_CAR' | 'RED_FLAG' | 'FINISHED';

export type TrackState = 'DRY' | 'DAMP' | 'WET' | 'HEAVY_WET' | 'DRYING';

export interface Driver {
  id: string;
  number: number;
  name: string;
  team: string;
  countryCode: string;
  basePace: number;
  tireSensitivity: number;
  aggression: number;
  defense: number;
  wetSkill: number;
  consistency: number;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  drivers: string[]; // driver IDs
}

export interface TireState {
  compound: TireCompound;
  ageLaps: number;
  wear: number; // 0..1
  temperature: number;
  optimalTempMin: number;
  optimalTempMax: number;
  baseDegRate: number;
  warmupLaps: number;
  cliffThreshold: number;
  cliffMagnitude: number;
}

export interface CarState {
  driverId: string;
  position: number;
  gap: number; // seconds to leader
  interval: number; // seconds to car ahead
  lap: number;
  progress: number; // 0..1 normalized track progress
  sector1Time: number | null;
  sector2Time: number | null;
  sector3Time: number | null;
  lastLapTime: number | null;
  bestLapTime: number | null;
  tire: TireState;
  fuel: number; // kg
  inPit: boolean;
  pitProgress?: number;
  isOut: boolean;
  DRS: boolean;
  status: 'RACING' | 'PITTING' | 'OUT' | 'STATIONARY';
}

export interface SessionInfo {
  id: string;
  type: 'PRACTICE' | 'QUALIFYING' | 'RACE' | 'SPRINT';
  circuitId: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED' | 'SUSPENDED';
  raceState: RaceState;
  trackState: TrackState;
  currentLap: number;
  totalLaps: number;
  timeRemaining: number | null;
  weather: WeatherCondition;
  seed?: string;
}

export interface WeatherCondition {
  trackTemp: number; // Celsius
  airTemp: number; // Celsius
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: number; // degrees
  rainChance: number; // percentage
  rainfallIntensity: number; // mm/h
  rainEtaMinutes?: number;
  crossoverEstimateLap?: number;
}

export interface PitStop {
  driverId: string;
  lap: number;
  duration: number; // seconds
  tireChange: TireCompound;
  timestamp: Date;
  status: 'PREPARING' | 'READY' | 'INBOUND' | 'STOP_ACTIVE' | 'RELEASED' | 'COMPLETE';
}

export interface RaceEvent {
  type: 'POSITION_CHANGED' | 'PIT_IN' | 'PIT_OUT' | 'PIT_STOP' | 'TYRE_CHANGED' | 'OVERTAKE' | 'CRASH' | 'SAFETY_CAR' | 'VIRTUAL_SAFETY_CAR' | 'RED_FLAG' | 'YELLOW_FLAG' | 'WEATHER_CHANGED' | 'RADIO_MESSAGE' | 'STRATEGY_CHANGED' | 'AI_SIGNAL_CREATED' | 'INCIDENT' | 'FLAG_CHANGED';
  lap: number;
  timestamp: Date;
  driverId?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface StrategyRecommendation {
  driverId: string;
  stops: number;
  compoundSequence: TireCompound[];
  stopLaps: number[];
  predictedFinishPosition: number;
  confidence: number; // 0-1
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CircuitSector {
  number: number;
  startProgress: number;
  endProgress: number;
}

export interface CircuitCorner {
  number: number;
  progress: number;
  name?: string;
  type: 'LEFT' | 'RIGHT' | 'CHICANE';
}

export interface CircuitPath {
  pathSvg: string;
  pathLength: number;
}

export interface MarshalZone {
  startProgress: number;
  endProgress: number;
  flagType: 'GREEN' | 'YELLOW' | 'RED';
}

export interface Circuit {
  id: string;
  name: string;
  slug: string;
  country: string;
  pathSvg: string;
  pathLength: number;
  sectors: CircuitSector[];
  corners: CircuitCorner[];
  pitLane?: CircuitPath;
  marshalZones?: MarshalZone[];
  passingDifficulty: number; // 0..1
  abrasiveness: number; // normalized
  length: number; // meters
  turns: number;
  drsZones: DRSZone[];
  pitWindowStart: number; // lap
  pitWindowEnd: number; // lap
  trackMap: TrackSegment[];
}

export interface DRSZone {
  id: number;
  detectionPoint: number; // meters from start/finish
  activationPoint: number; // meters from start/finish
}

export interface TrackSegment {
  x: number;
  y: number;
  type: 'STRAIGHT' | 'CORNER_LEFT' | 'CORNER_RIGHT' | 'CHICANE';
  elevation?: number;
}

export interface LiveCarPosition {
  carId: string;
  lap: number;
  progress: number; // 0..1
  inPit: boolean;
  pitProgress?: number;
}

export interface RadioMessage {
  id: string;
  sessionId: string;
  timestamp: Date;
  sender: 'DRIVER' | 'ENGINEER' | 'STRATEGIST' | 'PIT';
  driverId?: string;
  text: string;
  tags: ('GRIP' | 'TIRE' | 'WEATHER' | 'FUEL' | 'DAMAGE' | 'STRATEGY' | 'PIT')[];
}

export interface TelemetrySample {
  timestamp: number; // ms from lap start
  speed: number; // km/h
  throttle: number; // 0..1
  brake: number; // 0..1
  gear: number;
  rpm: number;
  steering: number; // -1..1
  tireTempFL: number;
  tireTempFR: number;
  tireTempRL: number;
  tireTempRR: number;
  brakeTempFL: number;
  brakeTempFR: number;
  brakeTempRL: number;
  brakeTempRR: number;
}

export interface TelemetryChunk {
  sessionId: string;
  carId: string;
  lap: number;
  startMs: number;
  endMs: number;
  samples: TelemetrySample[];
}

export interface SimulationConfig {
  seed: string;
  paceVariability: number; // 0-1
  reliabilityFactor: number; // 0-1
  weatherProgression: boolean;
  safetyCarProbability: number; // 0-1
  rainProbability: number;
  incidentProbability: number;
}

export interface PointEstimateResult {
  expectedFinishPosition: number;
  expectedRaceTimeDelta: number;
  projectedTrafficRisk: number;
  projectedPitLoss: number;
  projectedWeatherRisk: number;
}

export interface MonteCarloResult {
  simulations: number;
  winProbabilities: Map<string, number>; // driverId -> probability
  podiumProbabilities: Map<string, number>;
  pointsProbabilities: Map<string, number>;
  medianFinishPositions: Map<string, number>;
  downsideRisk: number;
  upsideRange: number;
}

export interface StrategyVersion {
  id: string;
  name: string;
  creator: string;
  timestamp: Date;
  assumptions: string;
  stints: StrategyStint[];
  quickEstimateResult?: PointEstimateResult;
  monteCarloResult?: MonteCarloResult;
  notes?: string;
}

export interface StrategyStint {
  startLap: number;
  endLap: number;
  compound: TireCompound;
}

export interface AISignal {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: 'UNDERCUT' | 'OVERCUT' | 'TIRE_CLIFF' | 'WEATHER_PIVOT' | 'SAFETY_CAR_OPPORTUNITY' | 'TRAFFIC_RISK';
  recommendation: string;
  confidence: number; // 0..1
  evidence: EvidenceRef[];
  explanation?: string;
}

export interface EvidenceRef {
  source: string;
  value: string | number;
  timestamp: Date;
}

export interface RaceSnapshot {
  sessionId: string;
  timestampMs: number;
  lap: number;
  raceState: RaceState;
  cars: SnapshotCarState[];
  weather: WeatherCondition;
  strategies: StrategyState[];
}

export interface SnapshotCarState {
  driverId: string;
  position: number;
  lap: number;
  progress: number;
  tire: TireState;
  fuel: number;
  inPit: boolean;
}

export interface StrategyState {
  driverId: string;
  currentStint: StrategyStint;
  plannedStints: StrategyStint[];
}

export interface SimulationJob {
  sessionId: string;
  strategyVersionId: string;
  iterations: number;
  seed: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  result?: MonteCarloResult;
}

export interface RaceScenarioConfig {
  seed: string;
  laps: number;
  cars: number;
  circuitId: string;
  baseWeather: WeatherCondition;
  safetyCarProbability: number;
  rainProbability: number;
  incidentProbability: number;
}
