export type AgeCategory = '18-24' | '25-32' | '33-39' | '40-44' | '45-49' | 'none';
export type EnglishProficiencyCategory = 'superior' | 'proficient' | 'competent' | 'less_than_competent' | 'none';
export type EducationCategory = 'phd' | 'bachelor_masters' | 'diploma_trade' | 'recognised_qualification' | 'none';
export type WorkExperienceCategory = 'gte_8' | '5_to_7' | '3_to_4' | '1_to_2' | 'lt_3' | 'lt_1' | 'none';


export interface FormData {
  age: AgeCategory;
  englishProficiency: EnglishProficiencyCategory;
  education: EducationCategory;
  overseasWorkExperience: WorkExperienceCategory; // For 'lt_3', '3_to_4', '5_to_7', 'gte_8'
  australianWorkExperience: WorkExperienceCategory; // For 'lt_1', '1_to_2', '3_to_4', '5_to_7', 'gte_8'
}

export interface PointsBreakdown {
  age: number;
  englishProficiency: number;
  education: number;
  overseasWorkExperience: number;
  australianWorkExperience: number;
  total: number;
}

export const initialFormData: FormData = {
  age: 'none',
  englishProficiency: 'none',
  education: 'none',
  overseasWorkExperience: 'none',
  australianWorkExperience: 'none',
};

export const initialPointsBreakdown: PointsBreakdown = {
  age: 0,
  englishProficiency: 0,
  education: 0,
  overseasWorkExperience: 0,
  australianWorkExperience: 0,
  total: 0,
};

// Mappings for AI input
export const ageToYearsForAI = (ageCategory: AgeCategory): number => {
  const map: Record<AgeCategory, number> = {
    '18-24': 18,
    '25-32': 25,
    '33-39': 33,
    '40-44': 40,
    '45-49': 45,
    'none': 0,
  };
  return map[ageCategory] || 0;
};

export const workExperienceToYearsForAI = (workCategory: WorkExperienceCategory): number => {
  const map: Record<WorkExperienceCategory, number> = {
    'gte_8': 8,
    '5_to_7': 5,
    '3_to_4': 3,
    '1_to_2': 1,
    'lt_3': 0, // or 1, 2 depending on interpretation, for AI we use minimum contribution
    'lt_1': 0,
    'none': 0,
  };
  return map[workCategory] || 0;
};
