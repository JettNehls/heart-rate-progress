import { Workout } from "../models/Workout";

export function calculateAverageRestingHR(workouts: Workout[]): number {
  const restingSamples = workouts.flatMap((workout) =>
    workout.heartRate.filter((sample) => sample.timestamp < 120),
  );
  const total = restingSamples.reduce((sum, sample) => sum + sample.bpm, 0);
  return Math.round(total / restingSamples.length);
}

export function calculateRecoveryTime(workout: Workout): number | null {
  const peak = Math.max(...workout.heartRate.map((sample) => sample.bpm));
  const target = peak - 20;
  const recoveryPoint = workout.heartRate.find(
    (sample) => sample.bpm <= target && sample.timestamp > 600,
  );
  return recoveryPoint ? recoveryPoint.timestamp : null;
}
