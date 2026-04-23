import { HeartRateEntry } from "./samsungHealthService";

/*
Calculate average resting heart rate.
For now we treat resting HR as anything under 80 bpm.
*/
export function calculateAverageRestingHR(
  data: HeartRateEntry[],
): number | null {
  if (data.length === 0) return null;

  const resting = data.filter((entry) => entry.bpm < 80);

  if (resting.length === 0) return null;

  const total = resting.reduce((sum, entry) => sum + entry.bpm, 0);

  return Math.round(total / resting.length);
}

/*
Calculate maximum heart rate in dataset
*/
export function calculateMaxHR(data: HeartRateEntry[]): number | null {
  if (data.length === 0) return null;

  return Math.max(...data.map((entry) => entry.bpm));
}

/*
Calculate minimum heart rate in dataset
*/
export function calculateMinHR(data: HeartRateEntry[]): number | null {
  if (data.length === 0) return null;

  return Math.min(...data.map((entry) => entry.bpm));
}

export function calculateHeartScore(
  avgRestingHR: number | null,
  maxHR: number | null,
  minHR: number | null,
): number | null {
  if (avgRestingHR === null || maxHR === null || minHR === null) return null;

  // Resting HR score (lower is better)
  let restingScore = 0;
  if (avgRestingHR < 60) restingScore = 100;
  else if (avgRestingHR < 70) restingScore = 85;
  else if (avgRestingHR < 80) restingScore = 70;
  else restingScore = 50;

  // Max HR score (higher = more effort)
  let maxScore = 0;
  if (maxHR > 180) maxScore = 100;
  else if (maxHR > 160) maxScore = 85;
  else if (maxHR > 140) maxScore = 70;
  else maxScore = 50;

  // Min HR score (lower = better recovery)
  let minScore = 0;
  if (minHR < 55) minScore = 100;
  else if (minHR < 65) minScore = 85;
  else minScore = 70;

  const finalScore = restingScore * 0.5 + maxScore * 0.3 + minScore * 0.2;

  return Math.round(finalScore);
}
