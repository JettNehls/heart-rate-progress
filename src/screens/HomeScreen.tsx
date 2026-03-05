import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  calculateAverageRestingHR,
  calculateMaxHR,
  calculateMinHR,
} from "../services/metricsService";
import {
  HeartRateEntry,
  loadSamsungHeartRate,
} from "../services/samsungHealthService";

export default function HomeScreen() {
  const [data, setData] = useState<HeartRateEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [avgRestingHR, setAvgRestingHR] = useState<number | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);
  const [minHR, setMinHR] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const heartRateData = await loadSamsungHeartRate();

        setData(heartRateData);

        setAvgRestingHR(calculateAverageRestingHR(heartRateData));
        setMaxHR(calculateMaxHR(heartRateData));
        setMinHR(calculateMinHR(heartRateData));
      } catch (err) {
        console.error("Error loading heart rate data:", err);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading heart rate data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heart Rate Metrics</Text>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Average Resting HR</Text>
        <Text style={styles.metricValue}>{avgRestingHR ?? "N/A"} bpm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Max Heart Rate</Text>
        <Text style={styles.metricValue}>{maxHR ?? "N/A"} bpm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Min Heart Rate</Text>
        <Text style={styles.metricValue}>{minHR ?? "N/A"} bpm</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
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
  card: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 16,
    color: "#555",
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 5,
  },
});
