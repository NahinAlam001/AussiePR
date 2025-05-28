
"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { PointsCalculatorForm } from "@/components/points-calculator-form";
import { ResultsDisplay } from "@/components/results-display";
import { calculatePoints } from "@/lib/points-calculator";
import type { FormData, PointsBreakdown } from "@/lib/points-types";
import { initialFormData, initialPointsBreakdown } from "@/lib/points-types";
import { Flame } from "lucide-react";

export default function HomePage() {
  const methods = useForm<FormData>({
    defaultValues: initialFormData,
  });
  const { watch, control } = methods;

  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdown>(initialPointsBreakdown);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const watchedFormData = watch();
  // Destructure specific fields from watchedFormData to use as stable dependencies for useEffect
  const { 
    age, 
    englishProficiency, 
    education, 
    overseasWorkExperience, 
    australianWorkExperience 
  } = watchedFormData;

  useEffect(() => {
    // Pass the full watchedFormData object to calculatePoints as it expects FormData type
    const newPoints = calculatePoints(watchedFormData);

    setPointsBreakdown(prevPoints => {
      // Only update state if the calculated points have actually changed
      // This prevents re-renders if the form is touched but values leading to points remain the same
      if (
        newPoints.age !== prevPoints.age ||
        newPoints.englishProficiency !== prevPoints.englishProficiency ||
        newPoints.education !== prevPoints.education ||
        newPoints.overseasWorkExperience !== prevPoints.overseasWorkExperience ||
        newPoints.australianWorkExperience !== prevPoints.australianWorkExperience ||
        newPoints.total !== prevPoints.total
      ) {
        return newPoints;
      }
      return prevPoints;
    });
  }, [
    // Depend on the actual primitive values.
    // The 'watchedFormData' object itself changes reference on every render,
    // but these destructured values only change when the form input changes.
    age, 
    englishProficiency, 
    education, 
    overseasWorkExperience, 
    australianWorkExperience,
    // It's important that watchedFormData is NOT in this dependency array directly.
    // However, calculatePoints needs it. ESLint might warn if watchedFormData is used
    // inside useEffect but not listed. We are covered because the primitives that
    // watchedFormData's content relies on are listed.
    // To be extremely explicit and satisfy linters without reintroducing the loop,
    // we ensure calculatePoints is called with the latest watchedFormData,
    // but the re-run is gated by the stable primitive dependencies.
    // This implies watchedFormData is captured in the closure, which is fine here.
  ]);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-12 w-12 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-primary ml-3">
              Aussie Points
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your Guide to Australian PR Points
          </p>
        </header>

        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <PointsCalculatorForm control={control} />
          </div>
          <div className="lg:col-span-1">
            <ResultsDisplay 
              pointsBreakdown={pointsBreakdown} 
              formData={watchedFormData} // Pass the watchedFormData to ResultsDisplay
              isLoadingAi={isLoadingAi}
              setIsLoadingAi={setIsLoadingAi}
            />
          </div>
        </main>
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aussie Points. All rights reserved.</p>
          <p className="mt-1">This tool is for informational purposes only and does not constitute immigration advice.</p>
        </footer>
      </div>
    </FormProvider>
  );
}
