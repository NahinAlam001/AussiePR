"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cake, GraduationCap, Briefcase, Languages } from "lucide-react";
import type { FormData, AgeCategory, EnglishProficiencyCategory, EducationCategory, WorkExperienceCategory } from "@/lib/points-types";

interface PointsCalculatorFormProps {
  control: Control<FormData>;
}

const ageOptions: { value: AgeCategory; label: string }[] = [
  { value: 'none', label: 'Select Age Group' },
  { value: '18-24', label: '18 - 24 years' },
  { value: '25-32', label: '25 - 32 years' },
  { value: '33-39', label: '33 - 39 years' },
  { value: '40-44', label: '40 - 44 years' },
  { value: '45-49', label: '45 - 49 years' },
];

const englishOptions: { value: EnglishProficiencyCategory; label: string }[] = [
  { value: 'none', label: 'Select English Proficiency' },
  { value: 'superior', label: 'Superior English (e.g., IELTS 8+)' },
  { value: 'proficient', label: 'Proficient English (e.g., IELTS 7)' },
  { value: 'competent', label: 'Competent English (e.g., IELTS 6)' },
  { value: 'less_than_competent', label: 'Less than Competent English' },
];

const educationOptions: { value: EducationCategory; label: string }[] = [
  { value: 'none', label: 'Select Education Level' },
  { value: 'phd', label: 'Doctorate (PhD)' },
  { value: 'bachelor_masters', label: 'Bachelor or Masters Degree' },
  { value: 'diploma_trade', label: 'Diploma or Trade Qualification' },
  { value: 'recognised_qualification', label: 'Other Recognised Qualification/Award' },
];

const overseasWorkExpOptions: { value: WorkExperienceCategory; label: string }[] = [
  { value: 'none', label: 'Select Overseas Experience' },
  { value: 'lt_3', label: 'Less than 3 years' },
  { value: '3_to_4', label: '3 to 4 years' },
  { value: '5_to_7', label: '5 to 7 years' },
  { value: 'gte_8', label: '8 years or more' },
];

const australianWorkExpOptions: { value: WorkExperienceCategory; label: string }[] = [
  { value: 'none', label: 'Select Australian Experience' },
  { value: 'lt_1', label: 'Less than 1 year' },
  { value: '1_to_2', label: '1 to 2 years' },
  { value: '3_to_4', label: '3 to 4 years' },
  { value: '5_to_7', label: '5 to 7 years' },
  { value: 'gte_8', label: '8 years or more' },
];

export function PointsCalculatorForm({ control }: PointsCalculatorFormProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Your Details</CardTitle>
        <CardDescription>
          Enter your information to calculate your potential PR points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField control={control} name="age" label="Age" icon={<Cake className="text-primary" />} options={ageOptions} />
        <FormField control={control} name="englishProficiency" label="English Proficiency" icon={<Languages className="text-primary" />} options={englishOptions} />
        <FormField control={control} name="education" label="Highest Education" icon={<GraduationCap className="text-primary" />} options={educationOptions} />
        <FormField control={control} name="overseasWorkExperience" label="Overseas Skilled Work Experience" icon={<Briefcase className="text-primary" />} options={overseasWorkExpOptions} />
        <FormField control={control} name="australianWorkExperience" label="Australian Skilled Work Experience" icon={<Briefcase className="text-primary" />} options={australianWorkExpOptions} />
      </CardContent>
    </Card>
  );
}

interface FormFieldProps<TValue extends string> {
  control: Control<FormData>;
  name: keyof FormData;
  label: string;
  icon: React.ReactNode;
  options: { value: TValue | 'none'; label: string }[];
}

function FormField<TValue extends string>({ control, name, label, icon, options }: FormFieldProps<TValue>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center text-sm font-medium text-foreground">
        {icon}
        <span className="ml-2">{label}</span>
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger id={name} className="w-full bg-background border-border hover:border-primary focus:ring-primary">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
