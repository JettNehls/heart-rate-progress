import { Workout } from "../models/Workout";

export const mockWorkouts: Workout[] = [
  {
    id: "1",
    date: "2026-02-01",
    type: "run",
    durationMinutes: 30,
    heartRate: [
      { timestamp: 0, bpm: 80 },
      { timestamp: 60, bpm: 95 },
      { timestamp: 300, bpm: 120 },
      { timestamp: 600, bpm: 140 },
      { timestamp: 900, bpm: 155 },
      { timestamp: 1200, bpm: 145 },
      { timestamp: 1500, bpm: 120 },
      { timestamp: 1800, bpm: 95 },
    ],
  },
  {
    id: "2",
    date: "2026-02-10",
    type: "run",
    durationMinutes: 30,
    heartRate: [
      { timestamp: 0, bpm: 78 },
      { timestamp: 60, bpm: 92 },
      { timestamp: 300, bpm: 115 },
      { timestamp: 600, bpm: 135 },
      { timestamp: 900, bpm: 150 },
      { timestamp: 1200, bpm: 138 },
      { timestamp: 1500, bpm: 115 },
      { timestamp: 1800, bpm: 90 },
    ],
  },
];
