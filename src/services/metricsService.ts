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
