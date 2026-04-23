import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  HeartRateEntry,
  loadSamsungHeartRate,
} from "../services/samsungHealthService";

import {
  calculateAverageRestingHR,
  calculateHeartScore,
  calculateMaxHR,
  calculateMinHR,
} from "../services/metricsService";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  const [avgRestingHR, setAvgRestingHR] = useState<number | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);
  const [minHR, setMinHR] = useState<number | null>(null);
  const [heartScore, setHeartScore] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const data: HeartRateEntry[] = await loadSamsungHeartRate();

      const avg = calculateAverageRestingHR(data);
      const max = calculateMaxHR(data);
      const min = calculateMinHR(data);

      setAvgRestingHR(avg);
      setMaxHR(max);
      setMinHR(min);
      setHeartScore(calculateHeartScore(avg, max, min));
      setLoading(false);
    }

    loadData();
  }, []);

  function getScoreColor(score: number | null) {
    if (score === null) return { backgroundColor: "#999" };
    if (score >= 90) return { backgroundColor: "#2e7d32" };
    if (score >= 75) return { backgroundColor: "#f9a825" };
    return { backgroundColor: "#c62828" };
  }

  function getScoreStatus(score: number) {
    if (score >= 90) return "Elite";
    if (score >= 75) return "Good";
    return "Needs Improvement";
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heart Dashboard</Text>

      <View style={[styles.scoreCard, getScoreColor(heartScore)]}>
        <Text style={styles.scoreLabel}>Heart Score</Text>
        <Text style={styles.scoreValue}>{heartScore ?? "--"}</Text>
        {heartScore !== null && (
          <Text style={styles.scoreStatus}>{getScoreStatus(heartScore)}</Text>
        )}
      </View>

      <View style={styles.grid}>
        <MetricCard label="Resting" value={avgRestingHR} icon="💙" />
        <MetricCard label="Max" value={maxHR} icon="🔥" />
        <MetricCard label="Min" value={minHR} icon="🌙" />
      </View>
    </ScrollView>
  );
}

function MetricCard({ label, value, icon }: any) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value ?? "N/A"}</Text>
      <Text style={styles.metricUnit}>bpm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#babbbd",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  scoreCard: {
    paddingVertical: 40,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  scoreLabel: { fontSize: 16, color: "white" },
  scoreValue: { fontSize: 64, fontWeight: "bold", color: "white" },
  scoreStatus: { fontSize: 18, color: "white" },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  icon: { fontSize: 20 },
  metricLabel: { fontSize: 14, color: "#777" },
  metricValue: { fontSize: 24, fontWeight: "bold" },
  metricUnit: { fontSize: 12, color: "#999" },
});
