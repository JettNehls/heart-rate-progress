import Papa from "papaparse";

export interface HeartRateEntry {
  timestamp: Date;
  bpm: number;
}

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlJ2KePVPS_vevJ8IH6eD-u-x7kl--x088_tcwGy9uZvivHp3XgI6hzJj7IxGNyXeqBOXcWZbA4nHs/pub?output=csv";

export async function loadSamsungHeartRate(): Promise<HeartRateEntry[]> {
  const response = await fetch(SHEET_URL);
  const csvText = await response.text();

  // Samsung CSV includes a metadata row we need to remove
  const cleanedCSV = csvText.split("\n").slice(1).join("\n");

  const parsed = Papa.parse(cleanedCSV, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data as any[];

  const cleaned = rows
    .map((row) => {
      const timestamp = row["com.samsung.health.heart_rate.start_time"];
      const heartRate = row["com.samsung.health.heart_rate.heart_rate"];

      if (!timestamp || !heartRate) return null;

      return {
        timestamp: new Date(timestamp),
        bpm: Number(heartRate),
      };
    })
    .filter(Boolean) as HeartRateEntry[];

  console.log("Loaded heart rate entries:", cleaned.length);

  return cleaned;
}
