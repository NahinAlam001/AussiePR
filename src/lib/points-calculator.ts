import type { FormData, PointsBreakdown, AgeCategory, EnglishProficiencyCategory, EducationCategory, WorkExperienceCategory } from './points-types';

export function calculatePoints(formData: FormData): PointsBreakdown {
  const breakdown: PointsBreakdown = {
    age: 0,
    englishProficiency: 0,
    education: 0,
    overseasWorkExperience: 0,
    australianWorkExperience: 0,
    total: 0,
  };

  // Age points
  const agePointsMap: Record<AgeCategory, number> = {
    '18-24': 25,
    '25-32': 30,
    '33-39': 25,
    '40-44': 15,
    '45-49': 0, // No points for 45-49 for skilled migration
    'none': 0,
  };
  breakdown.age = agePointsMap[formData.age] || 0;

  // English proficiency points
  const englishPointsMap: Record<EnglishProficiencyCategory, number> = {
    'superior': 20, // e.g., IELTS 8+
    'proficient': 10, // e.g., IELTS 7
    'competent': 0, // e.g., IELTS 6
    'less_than_competent': 0,
    'none': 0,
  };
  breakdown.englishProficiency = englishPointsMap[formData.englishProficiency] || 0;

  // Education points
  const educationPointsMap: Record<EducationCategory, number> = {
    'phd': 20,
    'bachelor_masters': 15,
    'diploma_trade': 10,
    'recognised_qualification': 10,
    'none': 0,
  };
  breakdown.education = educationPointsMap[formData.education] || 0;

  // Overseas work experience points
  // Valid categories for overseas: 'lt_3', '3_to_4', '5_to_7', 'gte_8', 'none'
  const overseasWorkPointsMap: Record<WorkExperienceCategory, number> = {
    'gte_8': 15,
    '5_to_7': 10,
    '3_to_4': 5,
    'lt_3': 0,
    '1_to_2': 0, // Not applicable for overseas
    'lt_1': 0,   // Not applicable for overseas
    'none': 0,
  };
  breakdown.overseasWorkExperience = overseasWorkPointsMap[formData.overseasWorkExperience] || 0;

  // Australian work experience points
  // Valid categories for Australian: 'lt_1', '1_to_2', '3_to_4', '5_to_7', 'gte_8', 'none'
  const australianWorkPointsMap: Record<WorkExperienceCategory, number> = {
    'gte_8': 20,
    '5_to_7': 15,
    '3_to_4': 10,
    '1_to_2': 5,
    'lt_1': 0,
    'lt_3': 0, // Not applicable for Australian in this breakdown
    'none': 0,
  };
  breakdown.australianWorkExperience = australianWorkPointsMap[formData.australianWorkExperience] || 0;
  
  // Total points
  breakdown.total =
    breakdown.age +
    breakdown.englishProficiency +
    breakdown.education +
    breakdown.overseasWorkExperience +
    breakdown.australianWorkExperience;

  return breakdown;
}
