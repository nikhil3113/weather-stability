import type { FallbackProps } from "react-error-boundary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-orange-50 p-8 shadow-xl">

                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZlZTJlMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

                <div className="relative" role="alert">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                                <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                                    <AlertCircle className="h-7 w-7 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h3>
                            <div className="space-y-3">
                                <p className="text-base text-gray-600">
                                    We encountered an error while fetching the weather data. This could be due to:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                                    <li>Invalid city name or location not found</li>
                                    <li>Network connectivity issues</li>
                                    <li>Service temporarily unavailable</li>
                                </ul>
                                <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl">
                                    <p className="text-sm font-mono text-red-800 break-words">
                                        {error instanceof Error ? error.message : String(error)}
                                    </p>
                                </div>
                                {resetErrorBoundary && (
                                    <div className="mt-6">
                                        <Button
                                            onClick={resetErrorBoundary}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}