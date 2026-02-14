import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function analyzeWeatherStability(
  data: {
    temperature_2m_max: number;
    temperature_2m_min: number;
    time?: string;
  }[],
  options?: {
    stableThreshold?: number;
    expThreshold?: number;
  },
) {
  // defaults: stable = max diff <=2C; exp change >=7C between two days
  const stableThreshold = options?.stableThreshold ?? 2;
  const expThreshold = options?.expThreshold ?? 7;

  if (data.length < 2) {
    return {
      result: "Insufficient data",
      stable: true,
      expIndexes: [],
      dailyDeltas: [],
      details: [],
    };
  }
  const dailyDeltas = [] as {
    idx: number;
    maxDelta: number;
    minDelta: number;
    avgDelta: number;
    date: string | undefined;
  }[];
  const expIndexes = [] as number[];
  let stableCount = 0;
  let expCount = 0;
  for (let i = 1; i < data.length; ++i) {
    const prev = data[i - 1],
      curr = data[i];
    const maxDelta = curr.temperature_2m_max - prev.temperature_2m_max;
    const minDelta = curr.temperature_2m_min - prev.temperature_2m_min;
    const avgDelta =
      (curr.temperature_2m_max +
        curr.temperature_2m_min -
        (prev.temperature_2m_max + prev.temperature_2m_min)) /
      2;
    const date = curr.time;
    dailyDeltas.push({ idx: i, maxDelta, minDelta, avgDelta, date });

    const isStable =
      Math.abs(maxDelta) <= stableThreshold &&
      Math.abs(minDelta) <= stableThreshold;
    const isExp =
      Math.abs(maxDelta) >= expThreshold || Math.abs(minDelta) >= expThreshold;
    if (isStable) stableCount++;
    if (isExp) {
      expCount++;
      expIndexes.push(i);
    }
  }
  let result = "";
  if (expCount === 0 && stableCount === dailyDeltas.length) {
    result =
      "Weather has been stable: temperature changes did not exceed " +
      stableThreshold +
      "°C/day.";
  } else if (expCount > 0) {
    const spikes = expIndexes.map((i) => data[i].time).filter(Boolean);
    result = `Exponential temperature change detected on ${spikes.length > 0 ? spikes.join(", ") : expIndexes.length + " day(s)"}.`;
  } else {
    result = `Weather has mixed periods of stability and fluctuation. ${stableCount} stable / ${dailyDeltas.length} days.`;
  }
  return {
    result,
    stable: stableCount === dailyDeltas.length && expCount === 0,
    unstable: stableCount !== dailyDeltas.length,
    expIndexes,
    dailyDeltas,
    details: dailyDeltas,
  };
}
