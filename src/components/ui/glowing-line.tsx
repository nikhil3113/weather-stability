"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Thermometer } from "lucide-react";
import type { WeatherData } from "@/types/weather";

export interface GlowingLineChartProps {
  chartData: WeatherData[];
  chartConfig: ChartConfig;
}

export function GlowingLineChart({ chartData, chartConfig }: GlowingLineChartProps) {

  const avgTemp = chartData.reduce((acc, d) => acc + (d.temperature_2m_max + d.temperature_2m_min) / 2, 0) / chartData.length;
  const maxTemp = Math.max(...chartData.map(d => d.temperature_2m_max));
  const minTemp = Math.min(...chartData.map(d => d.temperature_2m_min));

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm px-0">
      <CardHeader className="">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Check 30 days weather stability
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              Showing maximum and minimum temperatures
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-emerald-600 bg-emerald-50 border-emerald-200 px-3 py-1"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-semibold">{avgTemp.toFixed(1)}°C Avg</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Temperature Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
            <div className="p-2 bg-red-100 rounded-lg">
              <Thermometer className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Max Temp</p>
              <p className="text-xl font-bold text-red-600">{maxTemp.toFixed(1)}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Thermometer className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Min Temp</p>
              <p className="text-xl font-bold text-blue-600">{minTemp.toFixed(1)}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Thermometer className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Average</p>
              <p className="text-xl font-bold text-emerald-600">{avgTemp.toFixed(1)}°C</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl p-0 sm:p-4 border border-purple-100">
          <ChartContainer config={chartConfig} className=" h-auto sm:h-[400px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                opacity={0.5}
              />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `${value}°C`}
              />
              <ChartTooltip
                cursor={{ stroke: '#c084fc', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                content={<ChartTooltipContent
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />}
              />
              <Line
                dataKey="temperature_2m_max"
                type="monotone"
                stroke="#ef4444"
                dot={{
                  fill: '#ef4444',
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#fff'
                }}
                activeDot={{
                  r: 7,
                  fill: '#ef4444',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                strokeWidth={3}
                filter="url(#max-temp-glow)"
              />
              <Line
                dataKey="temperature_2m_min"
                type="monotone"
                stroke="#3b82f6"
                dot={{
                  fill: '#3b82f6',
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#fff'
                }}
                activeDot={{
                  r: 7,
                  fill: '#3b82f6',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                strokeWidth={3}
                filter="url(#min-temp-glow)"
              />
              <defs>
                <filter
                  id="max-temp-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#ef4444" floodOpacity="0.5" />
                  <feComposite in2="blur" operator="in" result="colorBlur" />
                  <feMerge>
                    <feMergeNode in="colorBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="min-temp-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood floodColor="#3b82f6" floodOpacity="0.5" />
                  <feComposite in2="blur" operator="in" result="colorBlur" />
                  <feMerge>
                    <feMergeNode in="colorBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </LineChart>
          </ChartContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">Maximum Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">Minimum Temperature</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

}
