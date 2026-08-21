# GRIDLINE — Live Motorsport Strategy & Race Operations Platform
## Final Authoritative Product Requirements Document (PRD)

**Product Name:** GRIDLINE  
**Tagline:** *Every second changes the race.*  
**Product Type:** Full-stack, real-time, multi-role motorsport strategy and race operations platform  
**Primary Goal:** Build a recruiter-grade flagship application that demonstrates elite frontend craft, realtime systems, deterministic simulation, multi-role UX, data visualization, backend architecture, and grounded AI integration  
**Target Platform:** Desktop-first responsive web application, with tablet support and intentionally reduced mobile experiences  
**Primary Demo Mode:** Deterministic seeded fictional race scenario requiring no signup  
**Suggested Stack:** Next.js + TypeScript + Tailwind CSS + GSAP + SVG/D3 + PostgreSQL + Redis + BullMQ + Socket.IO + Better Auth + Drizzle ORM + Zod + TanStack Query  
**Motion Stack:** GSAP, Flip, MotionPathPlugin; ScrollTrigger/Lenis only on marketing or narrative surfaces, not dense operations UI  
**3D Requirement:** None  
**Video Requirement:** None  
**Version:** 2.0 — Final  
**Status:** Authoritative Build Specification

---

# 1. Executive Summary

GRIDLINE is a real-time motorsport strategy and race-operations platform for a fictional professional single-seater championship.

It combines:

- live circuit visualization,
- car positions,
- timing tower,
- tire strategy,
- telemetry,
- weather,
- pit windows,
- race radio,
- pit crew workflow,
- deterministic race simulation,
- async Monte Carlo scenario analysis,
- race replay,
- post-race decision analysis,
- grounded AI strategy explanations,
- realtime collaboration,
- and role-specific operational interfaces.

The defining product idea is:

> **The moving race itself is the application.**

Cars move because race state changes.

Timing rows reorder because overtakes happen.

Strategy windows shift because tire age, traffic, pit loss, and weather change.

Telemetry and circuit state remain linked.

Motion is not decoration.

> **Motion is data.**

GRIDLINE must remain impressive even with AI completely disabled.

The underlying race, strategy, telemetry, simulation, and replay systems must be valuable on their own. AI is a second-layer explanation and recommendation capability built on top of deterministic systems.

---

# 2. Product Vision

Build a browser-based race strategy room that feels like a real operational product rather than a portfolio dashboard.

GRIDLINE should demonstrate the ability to design and engineer:

- dense realtime interfaces,
- meaningful animation,
- state-heavy workflows,
- deterministic simulation,
- asynchronous worker infrastructure,
- role-aware information architecture,
- auditability,
- and structured AI orchestration.

The product should be understandable in five minutes but deep enough to sustain a 30–45 minute technical interview.

---

# 3. Core Product Questions

GRIDLINE should answer five questions continuously:

1. **Where is every car right now?**
2. **What is changing?**
3. **What should we do next?**
4. **What happens if we choose another strategy?**
5. **Why did the race end the way it did?**

---

# 4. Product Principles

## 4.1 The Race Is the Interface

The circuit, timing, tire state, telemetry, radio, race state, and strategy tools should form one coherent workspace.

Avoid a conventional KPI-card dashboard as the primary product.

---

## 4.2 Motion Must Communicate Meaning

Animation is appropriate when it represents:

- position,
- time,
- change,
- causality,
- race-state transition,
- strategy evolution,
- data relationships.

Do not animate merely because an element entered the viewport.

---

## 4.3 Roles Must Feel Like Different Products

Permissions alone are not enough.

Each visible role must receive a distinct default information architecture.

The four showcased roles are:

- Strategist
- Race Engineer
- Pit Crew
- Team Principal

Admin exists for infrastructure and configuration but does not need a showcase-grade workspace.

Race Director controls exist inside a hidden/demo-control surface rather than as a full visible role.

---

## 4.4 AI Must Be Contextual and Grounded

AI must never act as a generic chatbot.

The LLM must not calculate the race strategy, generate probabilities, or invent telemetry.

The architecture is:

```text
Race State
    ↓
Deterministic Analytics
    ↓
Candidate Signal
    ↓
Fast Point Estimate
    ↓
Evidence Package
    ↓
LLM Explanation
    ↓
Human Decision
```

Full Monte Carlo simulation is a separate explicit user action.

---

## 4.5 Simulation Must Be Deterministic

The race engine and recruiter demo must support explicit seeds.

Example:

`port-azure-rain-demo-01`

This provides:

- repeatable demos,
- stable tests,
- reproducible strategy outcomes,
- easier debugging.

---

## 4.6 Fake-but-Coherent Is Better Than Fake Precision

GRIDLINE is not a professional vehicle dynamics simulator.

It is a **deterministic strategy simulation**.

All models should be:

- internally consistent,
- explainable,
- parameterized,
- believable enough to create strategic decisions.

The application must not claim real motorsport-grade physics.

---

## 4.7 Operational Screens Must Be Immediate

Dense race-control interfaces should not use smooth-scroll libraries or cinematic transition systems globally.

Lenis is reserved for:

- marketing landing page,
- portfolio storytelling,
- optional post-race narrative view.

Operational workspaces use native scrolling and direct interaction.

---

## 4.8 Recruiter Signal Beats Production Completeness

The core build prioritizes:

- visible technical depth,
- meaningful interaction,
- reliable demo behavior,
- architectural clarity.

Production-hardening tasks with low portfolio signal are moved to a future-hardening appendix rather than blocking the flagship demo.

---

# 5. Primary Success Criteria

GRIDLINE succeeds when a recruiter can clearly identify:

- advanced React architecture,
- realtime event synchronization,
- SVG motion/path rendering,
- data visualization,
- deterministic modeling,
- queues/workers,
- replay architecture,
- role-based UX,
- audit-aware backend design,
- grounded AI integration,
- testing discipline,
- and strong visual design.

---

# 6. Visible Roles

## 6.1 Strategist

Primary workspace:

- circuit,
- race order,
- tire states,
- pit windows,
- weather,
- competitor strategy,
- simulations,
- AI strategy signals.

---

## 6.2 Race Engineer

Primary workspace:

- assigned driver,
- telemetry,
- car state,
- stint pace,
- radio,
- tire condition,
- driver feedback,
- alerts.

---

## 6.3 Pit Crew

Primary workspace:

- inbound car,
- pit countdown,
- tire set,
- setup/repair instruction,
- crew readiness,
- stop execution,
- pit result.

---

## 6.4 Team Principal

Primary workspace:

- both cars,
- expected points,
- podium probability,
- strategic status,
- major incidents,
- race summary,
- risk overview.

---

# 7. Non-Showcase Roles

## Admin

Exists for:

- organization membership,
- role assignment,
- simulator config,
- audit access,
- demo setup.

Keep UI functional but minimal.

## Race Director

Available in:

- hidden demo-control panel,
- development tools,
- seeded scenario control.

Used to inject:

- safety car,
- weather change,
- incidents,
- flags.

Do not spend major design time on a full public Race Director workspace.

---

# 8. Role Capability Matrix

| Capability | Strategist | Engineer | Pit Crew | Principal | Admin |
|---|---:|---:|---:|---:|---:|
| Live circuit | Full | Full | Compact | Full | Read |
| Timing tower | Full | Full | Compact | Summary | Read |
| Telemetry | Summary | Full | Limited | Summary | Read |
| Radio | Full | Full | Receive/ops | Summary | Read |
| Edit strategy | Full | Limited | No | Read | Config |
| Run quick estimate | Full | Limited | No | Read | Config |
| Run Monte Carlo | Full | Limited | No | Read | Config |
| Manage pit plan | Full | Full | Execute | Read | No |
| AI strategy signals | Full | Engineering subset | Pit subset | Summary | Config |
| Post-race analysis | Full | Full | Summary | Full | Read |
| Manage users | No | No | No | No | Full |
| View audit logs | Limited | Limited | No | Summary | Full |

---

# 9. Product Modes

## 9.1 Live Race

Primary operational state.

---

## 9.2 Replay

Scrub through historical race state.

---

## 9.3 Strategy Lab

Edit strategies and run scenario analysis.

---

## 9.4 Post-Race

Review outcomes, decision quality, pace, tires, incidents, and AI analysis.

---

# 10. Recruiter Demo Mode

Mandatory.

No registration required.

Landing CTA:

> **ENTER LIVE RACE**

Default scenario:

**Port Azure GP — Lap 58 / 78**

Prompt:

> **Rain is approaching. Car 07 is P3. Find a strategy to win.**

Role switcher:

- Strategist
- Race Engineer
- Pit Crew
- Team Principal

A compact hidden demo controller allows scripted event injection.

---

# 11. Deterministic Demo Narrative

Initial state:

- Car 07: P3
- Car 81: P6
- Lap 58 / 78
- Car 07: Medium, 19 laps old
- Car 81: Hard, 31 laps old
- Rain ETA: 8–12 minutes
- Current track state: Dry
- Rival ahead: aging Medium
- Gap behind Car 07: enough for a possible pit window
- Safety-car probability: non-zero

Scripted beats:

1. Car 07 reports rear grip loss.
2. Deterministic analytics detect increasing degradation.
3. Rain approaches.
4. Rival pits early.
5. User edits pit strategy.
6. User runs quick estimate.
7. User optionally runs 1,000-run Monte Carlo.
8. Safety car may be injected.
9. Pit Crew prepares stop.
10. Race resolves.
11. Post-race report explains outcome.

---

# 12. Information Architecture

Primary navigation:

- Race
- Strategy
- Telemetry
- Radio
- Replay
- Analysis

Secondary items shown contextually:

- Weather
- Pit
- Competitors
- Incidents
- Settings

Navigation varies by role.

---

# 13. Main Strategist Workspace

Recommended desktop composition:

```text
┌──────────────┬──────────────────────────────┬────────────────────┐
│ Timing Tower │                              │ Weather / Strategy │
│              │       Circuit Canvas         │ Signals / Pit      │
│              │                              │                    │
├──────────────┴──────────────────────────────┴────────────────────┤
│ Race Timeline / Strategy / Replay Scrubber                      │
└──────────────────────────────────────────────────────────────────┘
```

The circuit remains the central visual anchor.

---

# 14. Circuit Visualization

Render the circuit as SVG.

Support:

- normalized path progress,
- sectors,
- corners,
- pit lane,
- marshal zones,
- braking zones,
- track heatmaps,
- weather overlays,
- car markers.

Use fictional circuit data.

---

# 15. Circuit Data Model

```ts
interface Circuit {
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
  abrasiveness: number;      // normalized
}
```

---

# 16. Live Car Position

```ts
interface LiveCarPosition {
  carId: string;
  lap: number;
  progress: number; // 0..1
  inPit: boolean;
  pitProgress?: number;
}
```

GSAP MotionPathPlugin can animate markers along the circuit path.

---

# 17. Car Marker Design

Marker content:

- driver code,
- team accent,
- race position,
- optional compound shorthand.

Selected marker:

- larger,
- more legible,
- subtle trail,
- linked telemetry highlight.

Avoid literal race-car icons.

---

# 18. Timing Tower

Required:

- Position
- Driver
- Interval
- Tire
- Tire Age
- Last Lap
- Best Lap
- Pit Stops

Optional secondary:

- sector state,
- penalty,
- current status.

---

# 19. Timing Tower Motion

Use GSAP Flip for position changes.

When two drivers exchange position:

- rows reorder smoothly,
- position numbers update,
- changed rows receive a short highlight,
- no flashing or bouncing.

---

# 20. Race States

Support:

- Green
- Local Yellow
- Full Yellow
- Safety Car
- Virtual Safety Car
- Red Flag
- Finished

Race state must affect:

- visual hierarchy,
- pace model,
- strategy calculations,
- pit-loss calculation,
- AI signals.

---

# 21. Safety Car Transition

Signature transition:

1. yellow line sweeps across UI,
2. circuit saturation reduces,
3. gap compression indicator appears,
4. pit-loss estimate recalculates,
5. strategy panel expands,
6. AI opportunity may appear.

Reduced-motion mode uses an immediate state change.

---

# 22. Driver Detail Panel

Selecting a car reveals:

- position,
- gaps,
- tire,
- stint age,
- last laps,
- degradation slope,
- telemetry summary,
- radio,
- strategy,
- active alerts.

The detail surface should appear contextually from the selected marker.

---

# 23. Telemetry Workspace

Required channels:

- Speed
- Throttle
- Brake
- Gear
- RPM
- Steering
- Tire Temperatures
- Brake Temperatures

Optional later:

- energy deployment,
- ride height,
- suspension traces.

---

# 24. Telemetry Comparison

Support:

- Car 07 vs Car 81
- Current lap vs best lap
- Current lap vs previous lap
- Driver vs competitor
- Lap A vs Lap B

All telemetry charts share a synchronized cursor.

---

# 25. Linked Telemetry ↔ Circuit Interaction

Mandatory signature interaction.

When the telemetry cursor moves:

- corresponding circuit location highlights.

When user hovers a circuit section:

- telemetry cursor moves to the corresponding distance.

This must work bidirectionally.

---

# 26. Track Heatmap Modes

Circuit display modes:

- Position
- Speed
- Braking
- Throttle
- Tire Load
- Grip
- Track Temperature
- Weather

Heatmap should update SVG stroke or segment coloring.

---

# 27. Deterministic Pace Model

Expected lap time is modeled as:

```text
Lap Time =
Base Pace
+ Fuel Effect
+ Tire Effect
+ Traffic Effect
+ Weather Effect
+ Driver Effect
+ Damage/Incident Effect
```

Pseudo-code:

```ts
lapTime =
  baseLapTime
  + fuelPenalty
  + tyrePenalty
  + trafficPenalty
  + weatherPenalty
  + driverDelta
  + damagePenalty;
```

All terms must be inspectable in development/debug tooling.

---

# 28. Tire State Model

```ts
interface TireState {
  compound: "soft" | "medium" | "hard" | "intermediate" | "wet";

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
```

---

# 29. Tire Wear Update

Each lap:

```ts
wearIncrement =
  baseDegRate *
  trackAbrasiveness *
  aggressionFactor *
  thermalFactor *
  weatherFactor;
```

Then:

```ts
wear = clamp(wear + wearIncrement, 0, 1);
```

---

# 30. Tire Performance Phases

## Phase A — Warm-Up

New tires have a temporary pace penalty.

Example:

```text
Lap 1   +0.80 s
Lap 2   +0.35 s
Lap 3   +0.05 s
```

Compound-specific.

---

## Phase B — Normal Degradation

Steady decline.

Example:

- Soft: faster, higher degradation
- Medium: balanced
- Hard: slower warm-up, lower degradation

---

## Phase C — Cliff

Once wear passes a threshold, pace deterioration accelerates.

Use sigmoid-style penalty:

```ts
cliffPenalty =
  sigmoid((wear - cliffThreshold) * cliffSharpness) *
  cliffMagnitude;
```

Example sigmoid:

```ts
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
```

---

# 31. Tire Temperature Model

Each compound has an optimal temperature window.

Example conceptual values:

```text
SOFT      88–103°C
MEDIUM    90–105°C
HARD      92–108°C
INTER     60–85°C
WET       50–75°C
```

These are fictional championship parameters, not real-world claims.

Temperature penalty:

```text
below optimum → cold penalty
inside window → minimal penalty
above optimum → overheating penalty
```

Use a smooth piecewise curve.

---

# 32. Tire Temperature Update Inputs

Approximate tire temperature from:

- track temperature,
- compound,
- recent pace,
- braking load,
- cornering load,
- wetness,
- cooling on straights.

The model should remain simple and deterministic.

---

# 33. Fuel Effect

Fuel mass decreases throughout the race.

Model:

```ts
fuelPenalty = remainingFuelKg * secondsPerKg;
```

Remaining fuel:

```ts
remainingFuelKg =
  startFuelKg - lap * burnPerLapKg;
```

This prevents naive comparisons between early and late race pace.

---

# 34. Traffic Model

Traffic must be quantified, not hand-waved.

Each circuit has:

```ts
passingDifficulty: number; // 0 easy → 1 very difficult
dirtyAirSensitivity: number;
```

For a following car:

```ts
gapFactor = clamp((trafficThreshold - gapSeconds) / trafficThreshold, 0, 1);

trafficPenalty =
  gapFactor *
  dirtyAirSensitivity *
  passingDifficulty *
  trafficPenaltyMax;
```

Example:

- gap ≥ 2.0s → almost no traffic penalty,
- gap 1.0s → moderate penalty,
- gap 0.5s → high penalty.

---

# 35. Overtake Opportunity Model

Overtake probability should be deterministic from modeled advantages plus seeded variance.

Inputs:

- pace advantage,
- tire advantage,
- straight-line advantage,
- DRS/slipstream availability if modeled,
- passing difficulty,
- current gap,
- driver aggression,
- defender quality,
- seeded random term.

Normalize:

```ts
attackScore =
  paceAdvantageWeight * paceAdvantage +
  tireAdvantageWeight * tireAdvantage +
  straightAdvantageWeight * straightAdvantage +
  aggressionWeight * attackerAggression -
  defenseWeight * defenderDefense -
  difficultyWeight * circuitPassingDifficulty -
  gapWeight * gapSeconds;
```

Convert to probability:

```ts
overtakeProbability = sigmoid(attackScore + seededNoise);
```

---

# 36. Seeded Overtake Variance

Do not use unseeded `Math.random()`.

Use deterministic PRNG derived from:

```text
sessionSeed
+
lap
+
attackerCarId
+
defenderCarId
+
overtakeAttemptIndex
```

This ensures the same replay/demo produces the same overtake outcome.

---

# 37. Overtake Attempt Trigger

An attempt can occur only if:

- following gap < threshold,
- follower has positive pace delta or strategic advantage,
- car is in a designated overtaking zone,
- race state allows overtaking.

This prevents random position swaps.

---

# 38. Overtake Outcomes

Possible:

- No Attempt
- Attempt Failed
- Position Gained
- Position Lost / Counterattack
- Contact/Incident probability extremely low and separate

For MVP, keep outcomes simple.

---

# 39. Undercut Logic

Undercut value is based on:

```text
old-tire projected laps
vs
new-tire out-lap + subsequent pace
+
pit loss
+
traffic after stop
```

A pit-now strategy should not automatically be better.

---

# 40. Overcut Logic

Overcut can become beneficial if:

- clean air is available,
- old tire remains competitive,
- competitor emerges into traffic,
- pit loss changes under race state.

---

# 41. Weather State Model

Track states:

- Dry
- Damp
- Wet
- Heavy Wet
- Drying

Inputs:

- rain intensity,
- track wetness,
- track temperature,
- drying rate.

Track wetness should lag rainfall.

---

# 42. Tire Suitability Matrix

Conceptual multiplier example:

| Compound | Dry | Damp | Wet | Heavy Wet |
|---|---:|---:|---:|---:|
| Soft | 1.00 | 1.18 | 1.60 | 1.90 |
| Medium | 1.00 | 1.16 | 1.58 | 1.88 |
| Hard | 1.00 | 1.20 | 1.64 | 1.95 |
| Intermediate | 1.14 | 1.00 | 1.12 | 1.35 |
| Wet | 1.35 | 1.11 | 1.00 | 1.05 |

Values are configurable fictional parameters.

---

# 43. Weather Radar

Use SVG/DOM weather cells.

Each cell includes:

- position,
- direction,
- speed,
- intensity,
- ETA to circuit.

Display:

`RAIN ETA 8 MIN`

---

# 44. Strategy Timeline

Horizontal axis:

`Lap 1 → Race End`

Rows:

- Car 07
- Car 81
- selected competitor

Each stint shows:

- compound,
- start lap,
- expected end,
- pit markers.

---

# 45. Strategy Editing

Allow:

- drag pit lap,
- change compound,
- add stop,
- remove stop,
- duplicate strategy,
- save version,
- compare versions.

Invalid strategies should be blocked.

---

# 46. Strategy Validation

Examples:

- cannot pit after race end,
- compound must be valid for conditions,
- no impossible overlapping stints,
- pit stop must transition between stints,
- optional series-specific tire-use rules.

---

# 47. Strategy Versions

Store:

- name,
- creator,
- timestamp,
- assumptions,
- stints,
- quick estimate result,
- Monte Carlo result if run,
- notes.

Examples:

- Baseline
- Early Undercut
- Rain Pivot
- Safety Car Opportunistic

---

# 48. Two Simulation Paths

GRIDLINE must distinguish between:

## 48.1 Fast Point Estimate

Used for:

- live contextual AI signals,
- responsive strategy feedback,
- drag interactions,
- instant “what if” comparison.

Requirements:

- synchronous or sub-200ms where possible,
- deterministic,
- no queue,
- one expected trajectory,
- based on same pace/tire/traffic/weather model.

Output:

```ts
interface PointEstimateResult {
  expectedFinishPosition: number;
  expectedRaceTimeDelta: number;
  projectedTrafficRisk: number;
  projectedPitLoss: number;
  projectedWeatherRisk: number;
}
```

---

## 48.2 Monte Carlo Simulation

Used only when the user explicitly clicks:

`SIMULATE`

Requirements:

- async worker,
- Redis/BullMQ,
- progress reporting,
- persisted result,
- uncertainty distribution.

Default headline run:

`1,000 simulations`

Options:

- Quick: 100
- Standard: 1,000
- Deep: 5,000 optional

Do not make AI wait for Monte Carlo.

---

# 49. Why Two Speeds Exist

The live race needs immediate feedback.

AI contextual signals must not wait several seconds for a queued job.

Therefore:

```text
Live Signal
→ fast point estimate

User Investigation
→ optional Monte Carlo
```

Both use the same underlying deterministic race model.

---

# 50. Monte Carlo Inputs

Vary within controlled distributions:

- driver lap variance,
- pit stop duration,
- rain timing uncertainty,
- safety-car occurrence,
- overtake outcomes,
- traffic interactions,
- small reliability risk.

Use seeded pseudo-randomness.

---

# 51. Monte Carlo Output

Return:

- finishing-position distribution,
- expected points,
- podium probability,
- expected race-time delta,
- downside risk,
- upside range.

---

# 52. Simulation Queue

Use BullMQ.

Queue:

`race-simulations`

Job:

```ts
interface SimulationJob {
  sessionId: string;
  strategyVersionId: string;
  iterations: number;
  seed: string;
}
```

Statuses:

- queued
- running
- completed
- failed
- cancelled

---

# 53. Simulation Progress

Display:

`642 / 1,000`

Progress events delivered via WebSocket.

Result persists so user can leave and return.

---

# 54. AI Architecture

AI does not calculate strategy.

Architecture:

```text
Live Race State
      ↓
Deterministic Analytics
      ↓
Candidate Opportunity
      ↓
Fast Point Estimate
      ↓
Evidence Package
      ↓
LLM
      ↓
Natural-Language Explanation
      ↓
Human Decision
```

Monte Carlo can be invoked after the user presses `SIMULATE`.

---

# 55. AI Candidate Signal Generation

Deterministic system detects:

- tire cliff risk,
- undercut opportunity,
- overcut opportunity,
- weather crossover,
- safety-car pit opportunity,
- driver degradation complaint,
- traffic risk,
- pit window opening.

---

# 56. AI Context Contract

```ts
interface RaceAIContext {
  race: {
    lap: number;
    totalLaps: number;
    raceState: RaceState;
  };

  car: {
    position: number;
    gapAhead: number;
    gapBehind: number;
    compound: TireCompound;
    tyreAge: number;
  };

  pace: {
    lastLap: number;
    threeLapAverage: number;
    degradationSlope: number;
  };

  weather: {
    state: TrackState;
    rainEtaMinutes?: number;
    crossoverEstimateLap?: number;
  };

  strategy: {
    currentStrategy: Strategy;
    candidateStrategies: PointEstimateResult[];
  };

  driverFeedback: RadioSignal[];
  evidence: EvidenceRef[];
}
```

---

# 57. AI Prompt Constraint

The LLM prompt must explicitly state:

> Explain the strongest strategic recommendation using only the supplied race data, deterministic analytics, and simulation results. Do not invent telemetry, probabilities, or events.

---

# 58. AI Confidence

Confidence must be calculated outside the LLM.

Illustrative starting formula:

```ts
confidence =
  simulationAgreement * 0.40 +
  dataFreshness * 0.20 +
  weatherConfidence * 0.20 +
  evidenceConsistency * 0.20;
```

**Important:** These weights are an initial product heuristic, not scientifically derived coefficients.

They must be treated as configurable and explainable rather than authoritative.

---

# 59. Confidence Inputs

## Simulation Agreement

How strongly point estimates / scenario results agree.

## Data Freshness

Age of relevant telemetry and race state.

## Weather Confidence

Confidence range on forecast/crossover.

## Evidence Consistency

Whether multiple signals support the same recommendation.

---

# 60. AI Signal UI

Example:

```text
STRATEGY SIGNAL

BOX THIS LAP

Recommended tire
INTERMEDIATE

Expected gain
+6.8s

Confidence
84%

Evidence
→ Rear degradation slope +0.18s/lap
→ Rain crossover ~2 laps
→ Pit loss under SC 11.4s
→ Gap behind 18.2s

[ SIMULATE ] [ ACCEPT ] [ IGNORE ]
```

---

# 61. AI Evidence Requirement

Every significant signal must show:

- data source,
- current value,
- timestamp/freshness,
- relationship to recommendation.

No black-box recommendation cards.

---

# 62. Race Radio

Realtime feed includes:

- Driver
- Engineer
- Strategy
- Pit

Each message:

- timestamp,
- sender,
- car,
- text,
- tags.

---

# 63. Radio Signals

Deterministic parser or AI classifier can identify:

- rear grip complaint,
- front grip complaint,
- braking issue,
- overheating,
- vibration,
- tire concern,
- weather observation.

For MVP, structured demo messages can be seeded.

---

# 64. Driver Workspace

Minimal:

- Position
- Gap Ahead
- Gap Behind
- Tire
- Tire Age
- Target Pace
- Next Instruction
- Race State

No dense telemetry.

---

# 65. Pit Crew Workspace

Show:

`CAR 07`

`BOX IN 00:18`

- tire set,
- wing adjustment,
- repair instruction,
- crew readiness.

States:

- preparing
- ready
- inbound
- stop active
- released
- complete

---

# 66. Pit Stop Execution

On entry:

- countdown becomes `CAR IN`,
- stop timer starts,
- crew action state locks,
- release state appears.

Example:

`2.41s`

Then:

`RELEASED`

---

# 67. Team Principal Workspace

High-level:

- Car 07 position
- Car 81 position
- projected points
- podium probability
- top strategy risk
- weather risk
- current race state
- major incidents
- strategy summary

This screen should look visually distinct from strategist UI.

---

# 68. Realtime Architecture

Use Socket.IO.

Rooms:

- session
- team
- car
- role-specific channels where useful

Events:

- race-state update
- car-position update
- timing update
- telemetry batch
- weather update
- radio message
- strategy change
- simulation progress
- AI signal
- pit state

---

# 69. Realtime Reliability

Core demo requirements:

- reconnect handling,
- sequence numbers,
- server timestamps,
- stale-state detection,
- REST snapshot resync.

Production-grade offline mode is not required for MVP.

---

# 70. Optimistic UI

Appropriate:

- radio messages,
- strategy notes,
- non-critical annotations.

Not appropriate:

- safety car,
- penalty,
- race-state transition,
- simulation result,
- AI confidence.

---

# 71. Race Replay Architecture

Authoritative choice:

# **Hybrid Snapshots + Append-Only Events**

Not pure event sourcing.

Not snapshots only.

---

# 72. Snapshot Frequency

Create snapshots at:

- start of each completed lap,
- safety-car deployment,
- red-flag transition,
- major weather-state transition.

Optional later:

- every N seconds during critical phases.

---

# 73. Race Snapshot

```ts
interface RaceSnapshot {
  sessionId: string;
  timestampMs: number;
  lap: number;
  raceState: RaceState;
  cars: SnapshotCarState[];
  weather: WeatherState;
  strategies: StrategyState[];
}
```

---

# 74. Append-Only Race Events

Events between snapshots:

- POSITION_CHANGED
- PIT_ENTRY
- PIT_STOP
- PIT_EXIT
- TYRE_CHANGED
- WEATHER_CHANGED
- RADIO_MESSAGE
- FLAG_CHANGED
- INCIDENT
- STRATEGY_CHANGED
- AI_SIGNAL_CREATED

---

# 75. Replay Reconstruction

To seek to timestamp T:

1. find nearest snapshot at or before T,
2. load events after that snapshot up to T,
3. apply deterministic reducers,
4. interpolate current circuit progress,
5. render state.

Do not replay from lap 1 for every seek.

---

# 76. Telemetry Storage Is Separate

Telemetry must not be stored as replay events.

Store independently in chunks.

Example:

```ts
interface TelemetryChunk {
  sessionId: string;
  carId: string;
  lap: number;
  startMs: number;
  endMs: number;
  samples: TelemetrySample[];
}
```

---

# 77. Telemetry Chunking

Recommended chunk boundary:

- one lap per chunk for MVP,
- or 10–20 second chunks if required later.

Replay only loads telemetry for:

- selected car,
- active lap/time region.

---

# 78. Progress Samples for Replay

Store normalized track progress:

```text
time     progress
0.0s     0.000
1.0s     0.014
2.0s     0.031
3.0s     0.048
```

Then:

```ts
point =
  path.getPointAtLength(
    progress * path.getTotalLength()
  );
```

This provides smooth replay scrubbing.

---

# 79. Replay Scrubber

Support:

- drag,
- click seek,
- lap jump,
- play/pause,
- speed 0.5x / 1x / 2x,
- keyboard left/right.

Replay updates:

- car positions,
- order,
- tires,
- weather,
- radio,
- race state,
- pit stops.

---

# 80. Post-Race Analysis

Show:

- final classification,
- position gain/loss,
- strategy timeline,
- key decisions,
- time gained/lost,
- tire performance,
- weather impact,
- pit stops,
- competitor comparison.

---

# 81. Decision Review

Example:

```text
LAP 64
PIT FOR INTERMEDIATE

Estimated gain at decision time
+5.9s

Actual gain
+7.1s

Decision quality
EXCELLENT
```

---

# 82. AI Post-Race Analysis

AI may summarize:

- best decision,
- missed opportunity,
- tire insight,
- competitor insight,
- driver feedback patterns.

AI must cite structured race evidence.

---

# 83. Database Schema

Core tables:

```text
users
organizations
organization_members
roles

teams
drivers
cars
circuits

race_sessions
race_entries
race_events
race_snapshots

laps
sector_times
telemetry_chunks

tyre_sets
tyre_stints
pit_stops

weather_snapshots
track_states

radio_messages

strategies
strategy_versions
strategy_stints

simulation_jobs
simulation_results

ai_signals
ai_runs

notifications
audit_logs
```

---

# 84. Database Priorities

Indexes should prioritize:

- race session + timestamp,
- race session + lap,
- car + lap,
- strategy version lookup,
- simulation job status,
- replay event ordering.

---

# 85. Authentication

Use Better Auth or Auth.js.

Support:

- email/password or magic link,
- OAuth optional,
- recruiter demo session.

Demo session is intentionally isolated from real auth.

---

# 86. Authorization

Server-side RBAC.

Authorization depends on:

- user,
- organization,
- role,
- current session scope.

Never rely only on hiding client controls.

---

# 87. Audit Logging

Audit high-value actions:

- strategy version changes,
- pit instruction changes,
- role changes,
- demo control injections,
- accepted AI recommendations.

Do not overbuild a large audit UI for MVP.

---

# 88. Seeded Race Simulator

Generate:

- 20 cars,
- 78 laps,
- sector times,
- pit stops,
- tire states,
- traffic,
- weather,
- radio,
- safety car,
- overtakes.

---

# 89. Race Scenario Config

```ts
interface RaceScenarioConfig {
  seed: string;
  laps: number;
  cars: number;
  circuitId: string;
  baseWeather: WeatherState;
  safetyCarProbability: number;
  rainProbability: number;
  incidentProbability: number;
}
```

---

# 90. Simulated Car Model

Each car:

- base pace,
- driver pace variance,
- tire sensitivity,
- aggression,
- defense,
- pit-loss sensitivity,
- wet-skill parameter,
- reliability.

---

# 91. Driver Variance

Use deterministic pseudo-random noise centered around driver pace.

Example:

```ts
driverDelta =
  seededNormal(seedContext) *
  driverVarianceSeconds;
```

Keep variance small enough that strategy remains dominant.

---

# 92. Safety Car Model

Safety car:

- compresses gaps,
- reduces racing speed,
- reduces pit-loss cost,
- changes strategy opportunity.

This is essential for demo interest.

---

# 93. Product UI Direction

GRIDLINE should feel:

- technical,
- sharp,
- graphic,
- live,
- original,
- high-contrast.

It should not copy existing motorsport broadcast packages.

---

# 94. Color System

Base:

`#090A0C`

Panel:

`#111318`

Elevated:

`#171A20`

Text:

`#F1F2EE`

Muted:

`#8B909A`

Default accent:

`#D9FF3F`

Alternative team accent:

`#FF6B2C`

Race-state colors only when meaningful.

---

# 95. Typography

Primary:

- Geist or similar modern grotesk.

Display:

- condensed/wide grotesk for race numbers.

Mono:

- IBM Plex Mono / Fragment Mono.

Use large numeric typography:

`LAP 64`

`P03`

`326 KM/H`

---

# 96. Layout Principle

Avoid:

- endless cards,
- oversized rounded surfaces,
- generic admin dashboard modules.

Prefer:

- data rails,
- canvas regions,
- split workspaces,
- strong edge alignment,
- large typographic race states,
- compact contextual drawers.

---

# 97. Motion Categories

## Micro

- hover,
- selection,
- numeric updates,
- timing reorder.

## Functional

- car movement,
- telemetry cursor,
- strategy drag,
- weather movement,
- pit countdown.

## Signature

- safety car transition,
- replay scrub,
- track heatmap transition,
- strategy scenario comparison.

---

# 98. GSAP Usage

Use GSAP for:

- MotionPath car markers,
- Flip timing reorder,
- panel morphs,
- value interpolation,
- safety-car transition,
- shared-coordinate movement.

Do not use GSAP on every React state update.

---

# 99. Lenis Usage

Use Lenis only for:

- public landing page,
- recruiter narrative,
- optional long-form case study.

Do not use Lenis on:

- race workspace,
- telemetry,
- pit crew,
- strategy editor.

---

# 100. Responsive Strategy

Desktop:

- full product.

Tablet:

- compact timing tower,
- collapsible right rail,
- central circuit preserved.

Mobile:

show only selected experiences:

- Team Principal summary,
- Driver-like summary,
- notifications,
- post-race report.

Do not force the full strategist workspace onto phones.

---

# 101. Command Palette

`Ctrl/Cmd + K`

Commands:

- Open Car 07
- Open Strategy
- Run Quick Estimate
- Run Simulation
- Open Replay
- Open Weather
- Switch Demo Role

---

# 102. Keyboard Shortcuts

Suggested:

- `1` Car 07
- `2` Car 81
- `S` Strategy
- `T` Telemetry
- `R` Replay
- `W` Weather
- `Space` Play/Pause Replay
- `← / →` Step replay

---

# 103. Accessibility — Core Scope

MVP must include:

- semantic controls,
- visible focus states,
- sufficient contrast,
- keyboard support for core workflows,
- reduced-motion support for major motion,
- text/status labels in addition to color.

Full textual circuit descriptions and advanced assistive chart narration are future-hardening work, not core portfolio scope.

---

# 104. Reduced Motion

When enabled:

- car positions update without path interpolation,
- Flip reorder becomes immediate,
- safety-car animation becomes direct state change,
- replay updates without animated interpolation,
- heatmaps remain functional.

---

# 105. Performance Targets

Marketing:

- Lighthouse 90+.

Operational app:

- target 60fps for car/circuit motion,
- INP < 200ms,
- no long blocking work on main thread,
- telemetry cursor response < 50ms.

---

# 106. Frontend Performance Strategy

Use:

- selective subscriptions,
- websocket batching,
- telemetry downsampling,
- memoized SVG segments,
- requestAnimationFrame batching,
- worker offload where useful,
- virtualized long lists.

---

# 107. API Architecture

Example:

```text
GET  /api/sessions/:id/state
GET  /api/sessions/:id/replay
GET  /api/cars/:id/telemetry
POST /api/strategies
POST /api/strategies/:id/estimate
POST /api/simulations
POST /api/radio
```

Realtime via Socket.IO.

---

# 108. Validation

Use Zod for:

- REST payloads,
- WebSocket payloads,
- strategy edits,
- simulation config,
- AI context contracts.

---

# 109. Error Types

```text
AUTH_REQUIRED
FORBIDDEN
SESSION_NOT_FOUND
INVALID_STRATEGY
INVALID_STATE_TRANSITION
SIMULATION_FAILED
DATA_STALE
RATE_LIMITED
AI_UNAVAILABLE
```

---

# 110. Testing Strategy

## Unit

- tire degradation,
- tire temperature,
- traffic penalty,
- overtake probability,
- pit loss,
- weather crossover,
- point estimate,
- confidence scoring,
- role permissions.

## Integration

- strategy save,
- simulation queue,
- replay reconstruction,
- websocket resync,
- AI evidence package.

## E2E

- recruiter demo,
- role switching,
- strategy edit,
- point estimate,
- Monte Carlo,
- safety car,
- pit stop,
- replay,
- post-race analysis.

---

# 111. Deterministic Test Seeds

Use:

- `demo-rain-01`
- `demo-safetycar-01`
- `demo-undercut-01`
- `demo-overtake-01`
- `demo-dryrace-01`

---

# 112. Security Scope

Core:

- server-side RBAC,
- organization scoping,
- secure cookies,
- Zod validation,
- WebSocket auth,
- basic rate limiting,
- no secret leakage.

Full production security hardening can follow later.

---

# 113. Fictional Championship

Do not imply affiliation with real motorsport organizations.

Use:

# GRIDLINE WORLD SERIES

Example teams:

- Helix Racing
- Meridian GP
- Vanta Motorsport
- Apex Union
- Northstar Racing

Example drivers:

- LEE-07
- RAI-81
- TAN-22
- VET-12

---

# 114. Fictional Circuit

Primary demo circuit:

# Port Azure Circuit

Characteristics:

- street circuit,
- 18 corners,
- 3 sectors,
- narrow passing zones,
- medium-high passing difficulty,
- high pit-loss sensitivity,
- rain-prone.

---

# 115. MVP — Authoritative Scope

## Must Build

1. Recruiter demo mode
2. Strategist workspace
3. Race Engineer workspace
4. Pit Crew workspace
5. Team Principal summary
6. SVG circuit visualization
7. Live car movement
8. Timing tower with Flip reorder
9. Deterministic pace model
10. Three-phase tire degradation
11. Tire temperature window
12. Quantified traffic model
13. Quantified overtake model
14. Fuel effect
15. Weather crossover
16. Strategy timeline
17. Fast point estimate
18. Async 1,000-run Monte Carlo
19. Redis/BullMQ worker
20. Telemetry charts
21. Telemetry ↔ circuit linking
22. Socket.IO realtime
23. Race radio
24. Pit Crew execution flow
25. Hybrid replay
26. Telemetry chunk storage
27. Post-race analysis
28. Core RBAC
29. Seeded deterministic tests

---

# 116. Phase 2

Add:

- grounded AI strategist,
- AI radio classification,
- AI post-race report,
- richer competitor analysis,
- stronger pit risk analytics,
- strategy evidence panel.

AI is deliberately Phase 2.

The product must already be excellent without it.

---

# 117. Phase 3

Add:

- advanced telemetry overlays,
- richer incidents,
- penalties,
- saved scenario library,
- public replay sharing,
- richer collaborative strategy editing.

---

# 118. Phase 4

Optional:

- real motorsport data import,
- custom circuit builder,
- additional championships,
- team branding,
- advanced statistical modeling.

---

# 119. Explicit Non-Goals

Do not initially build:

- real F1 data integration,
- true vehicle dynamics,
- real team telemetry hardware,
- voice radio,
- full mobile strategist app,
- billing,
- complex admin portal,
- enterprise offline mode,
- complete accessibility narration for every data visualization.

---

# 120. Recommended Build Order

1. Design system
2. Circuit renderer
3. Seeded race engine
4. Car MotionPath
5. Timing tower
6. Tire model
7. Traffic/overtake model
8. Weather model
9. WebSocket race stream
10. Strategy timeline
11. Fast point estimate
12. Telemetry
13. Telemetry ↔ circuit linking
14. Replay snapshot/event system
15. Monte Carlo worker
16. Role workspaces
17. Pit Crew flow
18. Post-race analysis
19. Phase 2 AI
20. Recruiter demo polish

---

# 121. Suggested Project Structure

```text
src/
├── app/
├── components/
│   ├── race/
│   ├── strategy/
│   ├── telemetry/
│   ├── replay/
│   ├── radio/
│   └── ui/
├── features/
├── hooks/
├── lib/
│   ├── auth/
│   ├── realtime/
│   ├── simulator/
│   ├── ai/
│   ├── permissions/
│   └── replay/
├── server/
│   ├── services/
│   ├── repositories/
│   ├── queues/
│   └── events/
└── types/
```

---

# 122. Core Reusable Components

- CircuitMap
- CarMarker
- TimingTower
- RaceStateBanner
- DriverPanel
- TelemetryChart
- TrackHeatmap
- StrategyTimeline
- PitStopMarker
- TireIndicator
- WeatherRadar
- RadioFeed
- AIStrategySignal
- SimulationPanel
- ReplayScrubber
- RoleSwitcher
- CommandPalette

---

# 123. Recruiter Demo Script

### 00:00

Enter live race.

### 00:30

Show cars moving on Port Azure Circuit.

### 01:00

Switch to Strategist.

### 01:20

Driver reports rear grip loss.

### 01:40

Open tire degradation evidence.

### 02:00

Drag pit lap.

### 02:10

Fast point estimate updates instantly.

### 02:30

Run 1,000 simulations.

### 03:00

Simulation result appears.

### 03:15

Safety car is injected.

### 03:30

Switch Pit Crew role.

### 04:00

Execute stop.

### 04:20

Return to race.

### 04:40

Finish race and open post-race analysis.

---

# 124. Definition of Portfolio Ready

GRIDLINE is portfolio-ready when:

- demo requires no signup,
- scenario is deterministic,
- circuit motion is smooth,
- timing reorder is smooth,
- strategy drag works,
- quick estimate feels immediate,
- Monte Carlo queue works,
- replay works,
- telemetry linking works,
- all four visible roles work,
- README explains architecture,
- deployment is stable,
- seeded tests pass.

---

# 125. Acceptance Criteria — Pace Model

- fuel penalty decreases across race,
- tire warm-up exists,
- normal degradation exists,
- cliff exists,
- temperature penalty exists,
- traffic penalty reacts to gap,
- weather changes tire suitability,
- model is deterministic under fixed seed.

---

# 126. Acceptance Criteria — Overtaking

- overtakes only occur in valid zones,
- overtakes depend on pace/tire/gap/difficulty,
- seeded randomness is deterministic,
- difficult tracks produce fewer overtakes,
- stronger tire advantage increases success probability,
- replay reproduces the same overtake.

---

# 127. Acceptance Criteria — Strategy

- pit markers can be dragged,
- invalid strategies are rejected,
- quick estimate updates immediately,
- versions save,
- strategy comparison works,
- Monte Carlo can run from any saved version.

---

# 128. Acceptance Criteria — Simulation

- 100 and 1,000 runs work,
- optional 5,000 run works if enabled,
- jobs queue,
- progress updates realtime,
- seed reproduces result distribution,
- cancellation works,
- result persists.

---

# 129. Acceptance Criteria — AI

- AI is not required for core product operation,
- AI receives only structured context,
- AI does not invent probabilities,
- confidence is deterministic,
- confidence heuristic is documented as configurable,
- AI signals show evidence,
- impactful changes require human confirmation.

---

# 130. Acceptance Criteria — Replay

- seeking starts from nearest snapshot,
- only relevant events are replayed,
- telemetry loads separately,
- car positions scrub smoothly,
- tires/weather/radio reconstruct correctly,
- seeking is responsive.

---

# 131. Acceptance Criteria — Realtime

- reconnect restores current state,
- sequence numbers prevent duplicate/out-of-order application,
- stale state is detectable,
- timing updates without full-page rerender,
- race state syncs across roles.

---

# 132. Acceptance Criteria — Role UX

Strategist:

- can edit and simulate strategy.

Engineer:

- can analyze telemetry and radio.

Pit Crew:

- can prepare and execute stop.

Principal:

- can understand team race state in under 10 seconds.

Each role must look intentionally different.

---

# 133. Acceptance Criteria — Motion

- animation never delays critical interaction,
- motion represents real state change,
- timing reorder stays readable,
- car movement is smooth,
- safety-car transition communicates state,
- reduced-motion mode remains fully functional.

---

# 134. Future Production Hardening

Not required for the initial portfolio build:

- full offline mode,
- exhaustive assistive chart narration,
- enterprise notification routing,
- organization switching,
- billing,
- advanced admin portal,
- long-term telemetry retention policy,
- large-scale observability,
- horizontal infrastructure scaling.

These are legitimate future concerns but intentionally excluded from the flagship demo scope.

---

# 135. Portfolio Interview Talking Points

GRIDLINE should enable credible discussion around:

- why deterministic simulation was chosen,
- why AI does not calculate probabilities,
- why confidence is external to the LLM,
- why quick estimates and Monte Carlo are separate,
- why replay uses snapshots + events,
- why telemetry is chunked separately,
- why MotionPath/Flip are functional,
- how traffic/overtaking is modeled,
- how RBAC changes UX,
- how seeded randomness makes testing reproducible.

---

# 136. Final Product Positioning

GRIDLINE is not:

- a racing game,
- a fake Formula 1 dashboard,
- a generic analytics product,
- an AI chatbot with telemetry around it.

GRIDLINE is:

> **a deterministic race-strategy operations platform designed to make a changing race understandable, explorable, and actionable.**

---

# 137. Final Creative Direction

GRIDLINE must feel:

**Fast.  
Technical.  
Graphic.  
Live.  
Strategic.  
Precise.  
Collaborative.  
Premium.**

GRIDLINE must never feel:

**Like a CRUD admin panel.  
Like copied broadcast graphics.  
Like fake simulation theater.  
Like AI-flavored UI.  
Like motion added for decoration.**

The defining product principle is:

> **Every second changes the race — and every system in GRIDLINE should explain, predict, or respond to that change.**
