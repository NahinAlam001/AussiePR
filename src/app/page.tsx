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

  useEffect(() => {
    const newPoints = calculatePoints(watchedFormData);
    setPointsBreakdown(newPoints);
  }, [watchedFormData]);

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
              formData={watchedFormData}
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
