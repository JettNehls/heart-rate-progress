import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
    HeartRateEntry,
    loadSamsungHeartRate,
} from "../services/samsungHealthService";

import {
    calculateAverageRestingHR,
    calculateMaxHR,
    calculateMinHR,
} from "../services/metricsService";

export default function HealthInfoScreen() {
  const [data, setData] = useState<HeartRateEntry[]>([]);

  const [avgRestingHR, setAvgRestingHR] = useState<number | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);
  const [minHR, setMinHR] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const result = await loadSamsungHeartRate();

      setData(result);

      setAvgRestingHR(calculateAverageRestingHR(result));
      setMaxHR(calculateMaxHR(result));
      setMinHR(calculateMinHR(result));
    }

    loadData();
  }, []);

  // 🔥 Dynamic insights
  function getRestingInsight() {
    if (avgRestingHR === null) return "No data available.";

    if (avgRestingHR < 60)
      return "Excellent cardiovascular fitness. This is common in well-trained individuals.";

    if (avgRestingHR < 70)
      return "Good fitness level. Your heart is working efficiently.";

    if (avgRestingHR < 80)
      return "Normal range. There is room for improvement with consistent training.";

    return "Elevated resting heart rate. Improving fitness and recovery may help lower this.";
  }

  function getMaxInsight() {
    if (maxHR === null) return "No data available.";

    if (maxHR > 180)
      return "You are reaching high intensity levels during workouts — great for improving performance.";

    if (maxHR > 160) return "You are working at a solid intensity level.";

    return "Your workouts may not be reaching high intensity zones yet.";
  }

  function getMinInsight() {
    if (minHR === null) return "No data available.";

    if (minHR < 55)
      return "Low minimum heart rate — often a sign of good recovery and conditioning.";

    if (minHR < 65) return "Healthy resting range.";

    return "Your baseline heart rate is slightly elevated.";
  }

  function getTrendInsight() {
    if (data.length < 2) return "Not enough data to determine trends.";

    const first = data[0].bpm;
    const last = data[data.length - 1].bpm;

    if (last < first)
      return "Your heart rate trend is improving over time — great consistency.";

    if (last > first)
      return "Your heart rate is trending upward. Monitor recovery and training load.";

    return "Your heart rate trend is stable.";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heart Rate Insights</Text>

      {/* Resting HR */}
      <View style={styles.card}>
        <Text style={styles.header}>Resting Heart Rate</Text>

        <Text style={styles.text}>
          Your resting heart rate is one of the best indicators of
          cardiovascular fitness. A lower resting heart rate generally means
          your heart is more efficient and doesn't need to work as hard to
          circulate blood.
        </Text>

        <Text style={styles.text}>
          • 60–100 bpm: Normal range{"\n"}• Below 70 bpm: Often indicates good
          fitness{"\n"}• 50–60 bpm: Common in well-trained individuals
        </Text>

        {/* 🔥 Your Data */}
        <Text style={styles.metric}>
          Your Average: {avgRestingHR ?? "N/A"} bpm
        </Text>

        <Text style={styles.insight}>{getRestingInsight()}</Text>
      </View>

      {/* Max HR */}
      <View style={styles.card}>
        <Text style={styles.header}>Maximum Heart Rate</Text>

        <Text style={styles.text}>
          Your max heart rate reflects how hard your body is working during
          intense activity. Higher peaks during workouts are normal and help
          improve endurance.
        </Text>

        <Text style={styles.text}>
          Training near your max heart rate improves:
          {"\n"}• Cardiovascular capacity
          {"\n"}• VO₂ max (oxygen efficiency)
        </Text>

        {/* 🔥 Your Data */}
        <Text style={styles.metric}>Your Max: {maxHR ?? "N/A"} bpm</Text>

        <Text style={styles.insight}>{getMaxInsight()}</Text>
      </View>

      {/* Min HR */}
      <View style={styles.card}>
        <Text style={styles.header}>Minimum Heart Rate</Text>

        <Text style={styles.text}>
          Your minimum heart rate reflects how low your heart rate drops during
          rest and recovery periods. Lower values can indicate better
          cardiovascular efficiency.
        </Text>

        {/* 🔥 Your Data */}
        <Text style={styles.metric}>Your Min: {minHR ?? "N/A"} bpm</Text>

        <Text style={styles.insight}>{getMinInsight()}</Text>
      </View>

      {/* Trends */}
      <View style={styles.card}>
        <Text style={styles.header}>Trends Over Time</Text>

        <Text style={styles.text}>
          Looking at trends over time is more important than any single reading.
          Improvements in heart rate patterns show increased fitness and
          recovery ability.
        </Text>

        <Text style={styles.text}>
          Positive signs include:
          {"\n"}• Lower resting heart rate over time
          {"\n"}• More stable heart rate patterns
          {"\n"}• Faster recovery after workouts
        </Text>

        <Text style={styles.insight}>{getTrendInsight()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },

  metric: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  insight: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e7d32",
  },
});
