"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lightbulb, BarChart3, CheckSquare, ShieldQuestion, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EligibilityIndicator } from "./eligibility-indicator";
import type { PointsBreakdown, FormData, AgeCategory, EnglishProficiencyCategory, EducationCategory, WorkExperienceCategory } from "@/lib/points-types";
import { suggestImprovements, type SuggestImprovementsInput, type SuggestImprovementsOutput } from "@/ai/flows/suggest-improvements";
import { ageToYearsForAI, workExperienceToYearsForAI } from "@/lib/points-types";

interface ResultsDisplayProps {
  pointsBreakdown: PointsBreakdown;
  formData: FormData;
  isLoadingAi: boolean;
  setIsLoadingAi: (loading: boolean) => void;
}

const categoryLabels: Record<Exclude<keyof PointsBreakdown, "total">, string> = {
  age: "Age",
  englishProficiency: "English Proficiency",
  education: "Education",
  overseasWorkExperience: "Overseas Work Experience",
  australianWorkExperience: "Australian Work Experience",
};

// Max points for simplified categories to calculate progress bar percentage
const maxCategoryPoints: Record<Exclude<keyof PointsBreakdown, "total">, number> = {
  age: 30,
  englishProficiency: 20,
  education: 20,
  overseasWorkExperience: 15,
  australianWorkExperience: 20,
};

const VISA_MIN_POINTS = 65;

export function ResultsDisplay({ pointsBreakdown, formData, isLoadingAi, setIsLoadingAi }: ResultsDisplayProps) {
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (pointsBreakdown.total > 0) { // Only fetch suggestions if there's some input
      const fetchSuggestions = async () => {
        setIsLoadingAi(true);
        setAiError(null);
        setAiSuggestions(null);
        try {
          const aiInput: SuggestImprovementsInput = {
            age: ageToYearsForAI(formData.age as AgeCategory),
            englishProficiency: formData.englishProficiency as EnglishProficiencyCategory, // The AI flow takes string
            education: formData.education as EducationCategory, // The AI flow takes string
            // For simplicity, summing the representative years of work experience.
            // The AI prompt is generic "workExperience years".
            workExperience: workExperienceToYearsForAI(formData.overseasWorkExperience as WorkExperienceCategory) + workExperienceToYearsForAI(formData.australianWorkExperience as WorkExperienceCategory),
            currentPoints: pointsBreakdown.total,
          };
          const result: SuggestImprovementsOutput = await suggestImprovements(aiInput);
          setAiSuggestions(result.suggestions);
        } catch (error) {
          console.error("Error fetching AI suggestions:", error);
          setAiError("Failed to load suggestions. Please try again later.");
        } finally {
          setIsLoadingAi(false);
        }
      };
      fetchSuggestions();
    } else {
      setAiSuggestions(null);
      setAiError(null);
      setIsLoadingAi(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsBreakdown.total, formData]); // formData deep comparison handled by react-hook-form trigger

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <CheckSquare className="mr-2" /> Total Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-6xl font-bold text-center text-primary">
            {pointsBreakdown.total}
          </p>
          <Progress value={(pointsBreakdown.total / 130) * 100} className="mt-4 h-3 [&>div]:bg-primary" /> {/* Assuming max possible points around 130-150 for visual scale */}
           <p className="text-sm text-muted-foreground text-center mt-2">Minimum {VISA_MIN_POINTS} points generally required for eligibility.</p>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <ShieldQuestion className="mr-2" /> Visa Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EligibilityIndicator visaSubclass="189 (Skilled Independent)" points={pointsBreakdown.total} />
          <EligibilityIndicator visaSubclass="190 (Skilled Nominated)" points={pointsBreakdown.total} nominationPoints={5} />
          <EligibilityIndicator visaSubclass="491 (Skilled Work Regional)" points={pointsBreakdown.total} nominationPoints={15} />
           <Alert variant="default" className="mt-4 border-primary/50">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Nomination Points</AlertTitle>
            <AlertDescription>
              Visa subclasses 190 and 491 require nomination by a state/territory government or sponsorship by an eligible relative (for 491). This typically grants additional points (5 for 190, 15 for 491). Indicators above show potential eligibility including these points.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
           <BarChart3 className="mr-2" /> Points Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(pointsBreakdown).map(([key, value]) => {
            if (key === "total") return null;
            const categoryKey = key as Exclude<keyof PointsBreakdown, "total">;
            const progressValue = maxCategoryPoints[categoryKey] > 0 ? (value / maxCategoryPoints[categoryKey]) * 100 : 0;
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{categoryLabels[categoryKey]}</span>
                  <span className="font-medium text-primary">{value} points</span>
                </div>
                <Progress value={progressValue} className="h-2 [&>div]:bg-primary/70" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-accent flex items-center">
            <Lightbulb className="mr-2" /> Personalized Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAi && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          {aiError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{aiError}</AlertDescription>
            </Alert>
          )}
          {aiSuggestions && !isLoadingAi && (
            <Alert variant="default" className="bg-accent/10 border-accent/50">
               <Lightbulb className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Recommendations</AlertTitle>
              <AlertDescription className="whitespace-pre-line text-foreground">
                {aiSuggestions}
              </AlertDescription>
            </Alert>
          )}
          {!aiSuggestions && !isLoadingAi && !aiError && pointsBreakdown.total === 0 && (
            <p className="text-muted-foreground">Enter your details to get personalized suggestions.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
