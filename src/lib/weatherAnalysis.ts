import type { WeatherData } from "@/types/weather";

export interface AnalysisResult {
  isStable: boolean;
  stabilityScore: number;
  volatility: number;
  temperatureRange: number;
  trend: "increasing" | "decreasing" | "stable";
  trendStrength: number;
  anomalies: {
    day: string;
    change: number;
    type: "spike" | "drop";
    magnitude: "low" | "medium" | "high";
  }[];
  exponentialChanges: {
    startDay: string;
    endDay: string;
    change: number;
    rate: number;
    type: "heating" | "cooling";
  }[];
}

export function analyzeWeatherData(chartData: WeatherData[]): AnalysisResult {
  if (chartData.length < 2) {
    return {
      isStable: true,
      stabilityScore: 100,
      volatility: 0,
      temperatureRange: 0,
      trend: "stable",
      trendStrength: 0,
      anomalies: [],
      exponentialChanges: [],
    };
  }

  // Calculate daily temperature averages
  const dailyAverages = chartData.map(
    (d) => (d.temperature_2m_max + d.temperature_2m_min) / 2,
  );

  // Calculate volatility (standard deviation)
  const mean = dailyAverages.reduce((a, b) => a + b, 0) / dailyAverages.length;
  const variance =
    dailyAverages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    dailyAverages.length;
  const volatility = Math.sqrt(variance);

  const maxTemp = Math.max(...chartData.map((d) => d.temperature_2m_max));
  const minTemp = Math.min(...chartData.map((d) => d.temperature_2m_min));
  const temperatureRange = maxTemp - minTemp;

  // Calculate trend using linear regression
  const n = dailyAverages.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = dailyAverages.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * dailyAverages[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const trendStrength = Math.abs(slope) * 10; // Scale for readability

  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (Math.abs(slope) > 0.3) {
    trend = slope > 0 ? "increasing" : "decreasing";
  }

  const volatilityScore = Math.max(0, 100 - volatility * 10);
  const rangeScore = Math.max(0, 100 - temperatureRange * 2);
  const stabilityScore = Math.round((volatilityScore + rangeScore) / 2);
  const isStable = stabilityScore >= 70;

  // Detect anomalies (sudden temperature changes)
  const anomalies: AnalysisResult["anomalies"] = [];
  for (let i = 1; i < dailyAverages.length; i++) {
    const change = dailyAverages[i] - dailyAverages[i - 1];
    const absChange = Math.abs(change);

    if (absChange > 3) {
      let magnitude: "low" | "medium" | "high" = "low";
      if (absChange > 6) magnitude = "high";
      else if (absChange > 4) magnitude = "medium";

      anomalies.push({
        day: chartData[i].time,
        change: change,
        type: change > 0 ? "spike" : "drop",
        magnitude,
      });
    }
  }
  const exponentialChanges: AnalysisResult["exponentialChanges"] = [];
  let consecutiveCount = 1;
  let startIndex = 0;

  for (let i = 1; i < dailyAverages.length; i++) {
    const currentDiff = dailyAverages[i] - dailyAverages[i - 1];
    const prevDiff =
      i > 1 ? dailyAverages[i - 1] - dailyAverages[i - 2] : currentDiff;

    if (
      (currentDiff > 0 && prevDiff > 0) ||
      (currentDiff < 0 && prevDiff < 0)
    ) {
      consecutiveCount++;
    } else {
      if (consecutiveCount >= 3) {
        const totalChange = dailyAverages[i - 1] - dailyAverages[startIndex];
        exponentialChanges.push({
          startDay: chartData[startIndex].time,
          endDay: chartData[i - 1].time,
          change: totalChange,
          rate: totalChange / consecutiveCount,
          type: totalChange > 0 ? "heating" : "cooling",
        });
      }
      consecutiveCount = 1;
      startIndex = i;
    }
  }

  if (consecutiveCount >= 3) {
    const lastIndex = dailyAverages.length - 1;
    const totalChange = dailyAverages[lastIndex] - dailyAverages[startIndex];
    exponentialChanges.push({
      startDay: chartData[startIndex].time,
      endDay: chartData[lastIndex].time,
      change: totalChange,
      rate: totalChange / consecutiveCount,
      type: totalChange > 0 ? "heating" : "cooling",
    });
  }

  return {
    isStable,
    stabilityScore,
    volatility,
    temperatureRange,
    trend,
    trendStrength,
    anomalies,
    exponentialChanges,
  };
}
