import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { mockWorkouts } from "../data/mockWorkouts";
import {
  calculateAverageRestingHR,
  calculateRecoveryTime,
} from "../services/metricsService";

export default function HomeScreen() {
  const restingHR = calculateAverageRestingHR(mockWorkouts);
  const latestWorkout = mockWorkouts[mockWorkouts.length - 1];
  const recoveryTime = calculateRecoveryTime(latestWorkout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate Progress</Text>

      {/* Display average resting heart rate */}
      <Text style={styles.metric}>Average Resting HR: {restingHR} bpm</Text>

      {/* Display recovery time or 'N/A' if not available */}
      <Text style={styles.metric}>
        Recovery Time: {recoveryTime ? `${recoveryTime} sec` : "N/A"}
      </Text>

      {/* Optional motivational message */}
      {restingHR < 70 && (
        <Text style={styles.motivation}>
          Great job! Your resting heart rate is improving!
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  metric: {
    fontSize: 18,
    marginBottom: 10,
  },
  motivation: {
    fontSize: 18,
    color: "green",
    marginTop: 20,
    fontWeight: "bold",
  },
});
