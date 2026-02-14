import { useMutation } from "@tanstack/react-query"
import { WeatherForm } from "./components/Form";
import { getLongLatFromCity, getWeatherData } from "./api/weather";
import { GlowingLineChart } from "./components/ui/glowing-line";
import { Appbar } from "./components/Appbar";
import { ErrorFallback } from "./components/Error";
import { WeatherAnalysis } from "./components/WeatherAnalysis";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
} from "@/components/ui/empty";
import { Cloud, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const chartConfig = {
  max: { label: "Max", color: "var(--chart-2)" },
  min: { label: "Min", color: "#059669", }
}

function App() {
  const mutation = useMutation({
    mutationFn: async (city: string) => {
      const { latitude, longitude } = await getLongLatFromCity(city)
      return await getWeatherData(latitude, longitude)
    }
  })

  const chartData = mutation.data?.daily?.time?.map((time: string, i: number) => ({
    time,
    temperature_2m_min: mutation.data.daily.temperature_2m_min[i],
    temperature_2m_max: mutation.data.daily.temperature_2m_max[i],
  })) ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <Appbar />
      <main className="mx-auto  px-4 sm:px-6 lg:px-8">

        <div className="pt-12 pb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Discover the Weather
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get accurate 7-day weather forecasts for any city worldwide
          </p>
        </div>


        <div className="flex justify-center mb-12">
          <div className="w-full max-w-3xl">
            <WeatherForm onSubmit={mutation.mutate} mutation={mutation} />
          </div>
        </div>


        {mutation.isError && (
          <div className="mb-8 flex justify-center">
            <ErrorFallback error={mutation.error} resetErrorBoundary={() => mutation.reset()} />
          </div>
        )}


        {/* Weather Analysis and Chart */}
        {chartData.length > 0 && (
          <div className="space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:grid lg:grid-cols-3 gap-5 bg-white">
            <div className="col-span-2">
              <GlowingLineChart chartData={chartData} chartConfig={chartConfig} />
            </div>
            <div className="col-span-1 mx-auto">
              <WeatherAnalysis chartData={chartData} />
            </div>

          </div>
        )}


        {!mutation.isPending && !mutation.isError && chartData.length === 0 && (
          <div className="flex justify-center animate-in fade-in zoom-in-95 duration-500">
            <Empty className="max-w-2xl bg-white/70 backdrop-blur-sm border-2 border-purple-200/50">
              <EmptyMedia
                variant="icon"
                className="size-20 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 [&_svg]:size-10"
              >
                <Cloud className="animate-pulse" />
              </EmptyMedia>

              <EmptyHeader>
                <EmptyTitle className="text-2xl font-bold text-gray-900">
                  Ready to explore the weather?
                </EmptyTitle>
                <EmptyDescription className="text-base text-gray-600 max-w-sm">
                  Enter a city name above to get a detailed 30-day forecast with stability analysis
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="flex flex-row gap-3 mt-4">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  onClick={() => {
                    document.querySelector('input')?.focus();
                  }}
                >
                  <Search className="h-4 w-4" />
                  Search City
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  onClick={() => {
                    mutation.mutate("Mumbai");
                  }}
                >
                  <Compass className="h-4 w-4" />
                  Try Mumbai
                </Button>
              </EmptyContent>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                <span>Popular cities: Tokyo, London, Paris, Sydney</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              </div>
            </Empty>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
