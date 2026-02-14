import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Loader2, Search } from "lucide-react" // Icons for visual enhancement
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { UseMutationResult } from "@tanstack/react-query"

interface WeatherFormProps {
    onSubmit: (city: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation?: UseMutationResult<any, Error, string>;
}

const formSchema = z.object({
    city: z.string().min(1, "City Name is Required")
})

type formType = z.infer<typeof formSchema>

export function WeatherForm({ onSubmit, mutation }: WeatherFormProps) {
    const isPending = mutation?.isPending;

    const form = useForm<formType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            city: "Mumbai"
        },
    })

    function handleSubmit(data: formType) {
        onSubmit(data.city)
    }

    return (
        <div className="w-full">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup>
                    <Controller
                        name="city"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="sr-only">
                                    Enter City
                                </FieldLabel>
                                
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    {/* Input Field */}
                                    <div className="relative w-full sm:flex-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <MapPin className="h-5 w-5 text-purple-500" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...field}
                                            id="city"
                                            disabled={isPending}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter city name (e.g., New York, Tokyo, Paris)"
                                            className="block w-full rounded-2xl border-2 border-gray-200 bg-white pl-11 pr-4 py-4 text-base text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full sm:w-auto rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-5 w-5" />
                                                Check Weather
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Error Message */}
                                {fieldState.invalid && (
                                    <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
                                        <FieldError 
                                            errors={[fieldState.error]} 
                                            className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200" 
                                        />
                                    </div>
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>
        </div>
    )
}