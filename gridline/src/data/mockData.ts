import type { Driver, Team, Circuit, TireCompound, TireState } from '../types';

export const mockDrivers: Driver[] = [
  { id: 'VER', number: 1, name: 'Max Verstappen', team: 'Red Bull Racing', countryCode: 'NL', basePace: 74.5, tireSensitivity: 0.8, aggression: 0.9, defense: 0.95, wetSkill: 0.85, consistency: 0.92 },
  { id: 'PER', number: 11, name: 'Sergio Perez', team: 'Red Bull Racing', countryCode: 'MX', basePace: 75.2, tireSensitivity: 0.85, aggression: 0.75, defense: 0.8, wetSkill: 0.78, consistency: 0.85 },
  { id: 'HAM', number: 44, name: 'Lewis Hamilton', team: 'Mercedes', countryCode: 'GB', basePace: 74.8, tireSensitivity: 0.75, aggression: 0.85, defense: 0.9, wetSkill: 0.95, consistency: 0.9 },
  { id: 'RUS', number: 63, name: 'George Russell', team: 'Mercedes', countryCode: 'GB', basePace: 75.0, tireSensitivity: 0.78, aggression: 0.8, defense: 0.85, wetSkill: 0.82, consistency: 0.88 },
  { id: 'LEC', number: 16, name: 'Charles Leclerc', team: 'Ferrari', countryCode: 'MC', basePace: 74.7, tireSensitivity: 0.82, aggression: 0.88, defense: 0.82, wetSkill: 0.8, consistency: 0.87 },
  { id: 'SAI', number: 55, name: 'Carlos Sainz', team: 'Ferrari', countryCode: 'ES', basePace: 74.9, tireSensitivity: 0.8, aggression: 0.82, defense: 0.85, wetSkill: 0.78, consistency: 0.89 },
  { id: 'NOR', number: 4, name: 'Lando Norris', team: 'McLaren', countryCode: 'GB', basePace: 74.6, tireSensitivity: 0.77, aggression: 0.85, defense: 0.83, wetSkill: 0.85, consistency: 0.9 },
  { id: 'PIA', number: 81, name: 'Oscar Piastri', team: 'McLaren', countryCode: 'AU', basePace: 75.1, tireSensitivity: 0.79, aggression: 0.78, defense: 0.8, wetSkill: 0.8, consistency: 0.88 },
  { id: 'ALO', number: 14, name: 'Fernando Alonso', team: 'Aston Martin', countryCode: 'ES', basePace: 75.0, tireSensitivity: 0.75, aggression: 0.9, defense: 0.92, wetSkill: 0.92, consistency: 0.91 },
  { id: 'STR', number: 18, name: 'Lance Stroll', team: 'Aston Martin', countryCode: 'CA', basePace: 75.5, tireSensitivity: 0.82, aggression: 0.72, defense: 0.75, wetSkill: 0.7, consistency: 0.82 },
];

export const mockTeams: Team[] = [
  { id: 'redbull', name: 'Red Bull Racing', color: '#0600EF', drivers: ['VER', 'PER'] },
  { id: 'mercedes', name: 'Mercedes', color: '#00D2BE', drivers: ['HAM', 'RUS'] },
  { id: 'ferrari', name: 'Ferrari', color: '#DC0000', drivers: ['LEC', 'SAI'] },
  { id: 'mclaren', name: 'McLaren', color: '#FF8700', drivers: ['NOR', 'PIA'] },
  { id: 'astonmartin', name: 'Aston Martin', color: '#006F62', drivers: ['ALO', 'STR'] },
];

// Monaco SVG path - simplified but recognizable
const monacoPathSvg = "M 50 350 L 80 350 L 100 330 L 120 300 L 150 280 L 200 280 L 230 300 L 250 330 L 280 350 L 320 350 L 350 330 L 380 300 L 420 280 L 480 280 L 520 300 L 550 330 L 580 380 L 580 450 L 550 500 L 500 520 L 450 520 L 400 500 L 350 480 L 300 480 L 250 500 L 200 520 L 150 520 L 100 500 L 50 480 L 30 450 L 30 400 L 50 350 Z";

export const mockCircuit: Circuit = {
  id: 'port-azure',
  name: 'Port Azure Circuit',
  slug: 'port-azure',
  country: 'Monaco',
  length: 3337,
  turns: 18,
  pathSvg: monacoPathSvg,
  pathLength: 2000, // normalized units
  sectors: [
    { number: 1, startProgress: 0, endProgress: 0.33 },
    { number: 2, startProgress: 0.33, endProgress: 0.66 },
    { number: 3, startProgress: 0.66, endProgress: 1.0 },
  ],
  corners: [
    { number: 1, progress: 0.05, name: 'Sainte Dévote', type: 'RIGHT' },
    { number: 2, progress: 0.12, name: 'Massenet', type: 'RIGHT' },
    { number: 3, progress: 0.18, name: 'Casino Square', type: 'CHICANE' },
    { number: 4, progress: 0.25, name: 'Mirabeau', type: 'RIGHT' },
    { number: 5, progress: 0.33, name: 'Grand Hotel', type: 'LEFT' },
    { number: 6, progress: 0.42, name: 'Piscine', type: 'CHICANE' },
    { number: 7, progress: 0.55, name: 'Rascasse', type: 'RIGHT' },
    { number: 8, progress: 0.62, name: 'Antony Noghes', type: 'RIGHT' },
  ],
  marshalZones: [],
  passingDifficulty: 0.85,
  abrasiveness: 0.72,
  drsZones: [
    { id: 1, detectionPoint: 2800, activationPoint: 3100 },
  ],
  pitWindowStart: 5,
  pitWindowEnd: 70,
  trackMap: generatePortAzureTrack(),
};

function generatePortAzureTrack(): Array<{ x: number; y: number; type: 'STRAIGHT' | 'CORNER_LEFT' | 'CORNER_RIGHT' | 'CHICANE' }> {
  // Fictional Port Azure street circuit
  return [
    { x: 50, y: 350, type: 'STRAIGHT' },
    { x: 100, y: 350, type: 'CORNER_RIGHT' },
    { x: 120, y: 330, type: 'STRAIGHT' },
    { x: 150, y: 300, type: 'CORNER_RIGHT' },
    { x: 200, y: 280, type: 'STRAIGHT' },
    { x: 250, y: 300, type: 'CORNER_LEFT' },
    { x: 280, y: 350, type: 'STRAIGHT' },
    { x: 350, y: 350, type: 'CORNER_RIGHT' },
    { x: 380, y: 300, type: 'STRAIGHT' },
    { x: 450, y: 280, type: 'CORNER_LEFT' },
    { x: 520, y: 300, type: 'STRAIGHT' },
    { x: 550, y: 350, type: 'CORNER_RIGHT' },
    { x: 580, y: 420, type: 'STRAIGHT' },
    { x: 550, y: 500, type: 'CORNER_LEFT' },
    { x: 480, y: 520, type: 'STRAIGHT' },
    { x: 400, y: 500, type: 'CORNER_RIGHT' },
    { x: 320, y: 480, type: 'STRAIGHT' },
    { x: 250, y: 500, type: 'CORNER_LEFT' },
    { x: 180, y: 520, type: 'STRAIGHT' },
    { x: 100, y: 500, type: 'CORNER_RIGHT' },
    { x: 50, y: 480, type: 'STRAIGHT' },
    { x: 30, y: 420, type: 'CORNER_LEFT' },
    { x: 50, y: 350, type: 'STRAIGHT' },
  ];
}

// Helper to create tire state based on PRD tire model
function createTireState(compound: TireCompound, ageLaps: number = 0): TireState {
  const tireProfiles: Record<TireCompound, Omit<TireState, 'ageLaps' | 'wear' | 'temperature'>> = {
    SOFT: {
      compound: 'SOFT',
      optimalTempMin: 88,
      optimalTempMax: 103,
      baseDegRate: 0.012,
      warmupLaps: 2,
      cliffThreshold: 0.75,
      cliffMagnitude: 0.8,
    },
    MEDIUM: {
      compound: 'MEDIUM',
      optimalTempMin: 90,
      optimalTempMax: 105,
      baseDegRate: 0.008,
      warmupLaps: 3,
      cliffThreshold: 0.8,
      cliffMagnitude: 0.6,
    },
    HARD: {
      compound: 'HARD',
      optimalTempMin: 92,
      optimalTempMax: 108,
      baseDegRate: 0.005,
      warmupLaps: 4,
      cliffThreshold: 0.85,
      cliffMagnitude: 0.4,
    },
    INTERMEDIATE: {
      compound: 'INTERMEDIATE',
      optimalTempMin: 60,
      optimalTempMax: 85,
      baseDegRate: 0.006,
      warmupLaps: 2,
      cliffThreshold: 0.7,
      cliffMagnitude: 0.5,
    },
    WET: {
      compound: 'WET',
      optimalTempMin: 50,
      optimalTempMax: 75,
      baseDegRate: 0.004,
      warmupLaps: 2,
      cliffThreshold: 0.65,
      cliffMagnitude: 0.4,
    },
  };

  const profile = tireProfiles[compound];
  
  // Calculate wear based on age and degradation rate
  const wear = Math.min(1, ageLaps * profile.baseDegRate);
  
  // Temperature starts cold and warms up
  const targetTemp = (profile.optimalTempMin + profile.optimalTempMax) / 2;
  const warmupFactor = Math.min(1, ageLaps / profile.warmupLaps);
  const temperature = 40 + (targetTemp - 40) * warmupFactor;

  return {
    ...profile,
    ageLaps,
    wear,
    temperature,
  };
}

export const driverPaceData = new Map();

// Initialize pace data for each driver per PRD deterministic model
mockDrivers.forEach((driver) => {
  driverPaceData.set(driver.id, {
    baseLapTime: driver.basePace,
    tireDegradation: {
      SOFT: 0.08 * driver.tireSensitivity,
      MEDIUM: 0.05 * driver.tireSensitivity,
      HARD: 0.03 * driver.tireSensitivity,
      INTERMEDIATE: 0.04 * driver.tireSensitivity,
      WET: 0.06 * driver.tireSensitivity,
    },
    fuelEffect: 0.3,
    drsGain: 0.4,
    consistency: driver.consistency,
  });
});

// Initial car states for demo scenario (Lap 58/78 as per PRD)
export const initialCarStates = mockDrivers.map((driver, index) => ({
  driverId: driver.id,
  position: index + 1,
  gap: index * 1.2, // ~1.2s gaps
  interval: index === 0 ? 0 : 1.2,
  lap: 58,
  progress: Math.random(),
  sector1Time: null,
  sector2Time: null,
  sector3Time: null,
  lastLapTime: 75 + Math.random() * 2,
  bestLapTime: 74 + Math.random(),
  tire: createTireState(index < 5 ? 'MEDIUM' : 'HARD', index < 5 ? 19 : 31),
  fuel: 65 - index * 0.5,
  inPit: false,
  isOut: false,
  DRS: index < 10,
  status: 'RACING' as const,
}));

export const tireColors: Record<TireCompound, string> = {
  SOFT: '#ff4444',
  MEDIUM: '#ffff44',
  HARD: '#44ff44',
  INTERMEDIATE: '#44aaff',
  WET: '#4444ff',
};
