import type { WeatherData } from "@/types/weather";
import { analyzeWeatherData } from "@/lib/weatherAnalysis";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WeatherAnalysisProps {
  chartData: WeatherData[];
}

export function WeatherAnalysis({ chartData }: WeatherAnalysisProps) {
  const analysis = analyzeWeatherData(chartData);

  const getStabilityColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStabilityText = (score: number) => {
    if (score >= 80) return "Very Stable";
    if (score >= 60) return "Moderately Stable";
    return "Unstable";
  };

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm ">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Weather Analysis
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`px-4 py-1.5 text-sm font-semibold ${analysis.isStable
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : "text-orange-600 bg-orange-50 border-orange-200"
              }`}
          >
            {analysis.isStable ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Stable Weather
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                Unstable Weather
              </>
            )}
          </Badge>
        </div>
        <CardDescription className="text-base">
          Comprehensive analysis of temperature stability and trends
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Stability Score</span>
            <span className="text-2xl font-bold text-gray-900">{analysis.stabilityScore}%</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-1000 ${getStabilityColor(analysis.stabilityScore)}`}
              style={{ width: `${analysis.stabilityScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            {getStabilityText(analysis.stabilityScore)}
          </p>
        </div>

        <Separator />

        <div className={`grid grid-cols-1 sm:grid-cols-${analysis.trend === "increasing" ? 2 : 3} gap-4`}>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              {analysis.trend === "increasing" ? (
                <TrendingUp className="h-5 w-5 text-blue-600" />
              ) : analysis.trend === "decreasing" ? (
                <TrendingDown className="h-5 w-5 text-blue-600" />
              ) : (
                <Minus className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Trend</p>
              <p className="text-lg font-bold text-blue-600 capitalize">{analysis.trend}</p>
              <p className="text-xs text-gray-500">Strength: {analysis.trendStrength.toFixed(1)}°C/day</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Volatility</p>
              <p className="text-lg font-bold text-orange-600">{analysis.volatility.toFixed(1)}°C</p>
              <p className="text-xs text-gray-500">Daily variation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Range</p>
              <p className="text-lg font-bold text-purple-600">{analysis.temperatureRange.toFixed(1)}°C</p>
              <p className="text-xs text-gray-500">Max - Min</p>
            </div>
          </div>
        </div>

        <Separator />

        {analysis.exponentialChanges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Exponential Temperature Changes
            </h4>
            <div className="space-y-2">
              {analysis.exponentialChanges.map((change, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    {change.type === "heating" ? (
                      <div className="p-1.5 bg-red-100 rounded-lg">
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <ArrowDownRight className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {change.type === "heating" ? "Rapid Warming" : "Rapid Cooling"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(change.startDay).toLocaleDateString()} - {new Date(change.endDay).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${change.change > 0 ? "text-red-600" : "text-blue-600"}`}>
                      {change.change > 0 ? "+" : ""}{change.change.toFixed(1)}°C
                    </p>
                    <p className="text-xs text-gray-500">
                      {change.rate.toFixed(1)}°C/day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.anomalies.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sudden Temperature Shifts
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {analysis.anomalies.slice(0, 4).map((anomaly, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${anomaly.magnitude === "high"
                    ? "bg-red-50 border-red-200"
                    : anomaly.magnitude === "medium"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-yellow-50 border-yellow-200"
                    }`}
                >
                  <div className={`p-1.5 rounded-lg ${anomaly.type === "spike" ? "bg-red-100" : "bg-blue-100"
                    }`}>
                    {anomaly.type === "spike" ? (
                      <TrendingUp className={`h-4 w-4 ${anomaly.magnitude === "high" ? "text-red-600" : "text-orange-600"
                        }`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${anomaly.magnitude === "high" ? "text-red-600" : "text-blue-600"
                        }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(anomaly.day).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className={`text-sm font-bold ${anomaly.change > 0 ? "text-red-600" : "text-blue-600"
                      }`}>
                      {anomaly.change > 0 ? "+" : ""}{anomaly.change.toFixed(1)}°C
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${anomaly.magnitude === "high"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : anomaly.magnitude === "medium"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                  >
                    {anomaly.magnitude}
                  </Badge>
                </div>
              ))}
            </div>
            {analysis.anomalies.length > 4 && (
              <p className="text-sm text-gray-500 text-center">
                +{analysis.anomalies.length - 4} more anomalies detected
              </p>
            )}
          </div>
        )}

        {analysis.exponentialChanges.length === 0 && analysis.anomalies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-emerald-100 rounded-full mb-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Weather is Stable
            </h4>
            <p className="text-sm text-gray-600 max-w-md">
              No significant temperature fluctuations or exponential changes detected in the forecast period.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
