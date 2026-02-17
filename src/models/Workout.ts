export type HeartRateSample = {
  timestamp: number; // tracks seconds from workout start
  bpm: number;
};

export type Workout = {
  id: string;
  date: string;
  type: "run" | "bike" | "walk" | "lift";
  durationMinutes: number;
  heartRate: HeartRateSample[];
};
