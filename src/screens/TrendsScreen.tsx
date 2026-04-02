import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

import {
  HeartRateEntry,
  loadSamsungHeartRate,
} from "../services/samsungHealthService";

const screenWidth = Dimensions.get("window").width;

type Period = "week" | "month" | "year";

export default function TrendsScreen() {
  const [data, setData] = useState<HeartRateEntry[]>([]);
  const [period, setPeriod] = useState<Period>("week");

  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [average, setAverage] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      const result = await loadSamsungHeartRate();
      setData(result);
    }

    loadData();
  }, []);

  // Process data
  useEffect(() => {
    if (data.length === 0) return;

    setAverage(null); // reset each time

    const now = new Date();
    let cutoff = new Date();

    if (period === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (period === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    const filtered = data
      .filter((d) => d.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    let newLabels: string[] = [];
    let newValues: number[] = [];

    // YEAR → BI-WEEKLY AVERAGES
    if (period === "year") {
      if (filtered.length === 0) return;

      const startDate = filtered[0].timestamp;
      const buckets: { [key: number]: number[] } = {};

      filtered.forEach((entry) => {
        const diffMs = entry.timestamp.getTime() - startDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const bucket = Math.floor(diffDays / 14);

        if (!buckets[bucket]) buckets[bucket] = [];
        buckets[bucket].push(entry.bpm);
      });

      Object.keys(buckets).forEach((key) => {
        const readings = buckets[Number(key)];

        const avg =
          readings.reduce((sum, val) => sum + val, 0) / readings.length;

        newValues.push(Math.round(avg));
        newLabels.push(`W${Number(key) * 2 + 1}`);
      });
    }

    // WEEK + MONTH (raw data)
    else {
      newLabels = filtered.map((d) => d.timestamp.toLocaleDateString());
      newValues = filtered.map((d) => d.bpm);
    }

    // Set chart data
    setLabels(newLabels);
    setValues(newValues);

    // ALWAYS calculate average
    if (newValues.length > 0) {
      const avg =
        newValues.reduce((sum, val) => sum + val, 0) / newValues.length;

      setAverage(Math.round(avg));
    }
  }, [data, period]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heart Rate Trends</Text>

      <View style={styles.buttons}>
        {["week", "month", "year"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.button, period === p && styles.activeButton]}
            onPress={() => setPeriod(p as Period)}
          >
            <Text style={period === p ? styles.activeText : styles.buttonText}>
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {average !== null && (
        <Text style={styles.average}>Average: {average} bpm</Text>
      )}

      {values.length > 0 && (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 20}
          height={220}
          yAxisSuffix=" bpm"
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  buttons: {
    flexDirection: "row",
    marginBottom: 20,
  },

  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  activeButton: {
    backgroundColor: "#ff4d4d",
  },

  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },

  activeText: {
    color: "white",
    fontWeight: "bold",
  },

  average: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
