import { BarChart3, TrendingUp, Zap } from "lucide-react";
import type { WeatherData } from "../types/weather";
import { analyzeWeatherStability } from "../lib/utils";

interface WeatherStabilitySummaryProps {
  chartData: WeatherData[];
}

export function WeatherStabilitySummary({ chartData }: WeatherStabilitySummaryProps) {
  const summary = analyzeWeatherStability(chartData);
  return (
    <div className="mb-10 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 px-6 py-4 shadow-md w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          {summary.stable ? (
            <BarChart3 className="h-7 w-7 text-green-500 animate-pulse" />
          ) : summary.expIndexes.length > 0 ? (
            <Zap className="h-7 w-7 text-red-500 animate-bounce" />
          ) : (
            <TrendingUp className="h-7 w-7 text-yellow-500 animate-pulse" />
          )}
          <span className="text-lg font-semibold text-gray-800">
            {summary.result}
          </span>
        </div>
        {summary.expIndexes.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center ml-4">
            {summary.expIndexes.map((idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-1 bg-red-100 text-xs text-red-700 rounded-full">
                Spike: {chartData[idx]?.time ? new Date(chartData[idx].time).toLocaleDateString() : `Day ${idx + 1}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
