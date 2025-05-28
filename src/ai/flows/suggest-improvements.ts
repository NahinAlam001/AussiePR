// This is an AI-powered tool that provides personalized suggestions to users on how to improve their points score for Australian PR, recommending further studies or work experience.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  age: z.number().describe('The age of the applicant.'),
  englishProficiency: z
    .string()
    .describe(
      'The English proficiency level of the applicant (e.g., IELTS score).' 
    ),
  education: z.string().describe('The education level of the applicant.'),
  workExperience: z
    .number()
    .describe('The years of work experience of the applicant.'),
  currentPoints: z.number().describe('The current points score of the applicant.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z.string().describe('Personalized suggestions to improve the points score.'),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(input: SuggestImprovementsInput): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an expert consultant on Australian immigration. Given the following information about an applicant, provide personalized suggestions on how they can improve their points score to increase their chances of eligibility for Australian PR.

Applicant Information:
- Age: {{{age}}}
- English Proficiency: {{{englishProficiency}}}
- Education: {{{education}}}
- Work Experience: {{{workExperience}}} years
- Current Points: {{{currentPoints}}}

Consider suggesting further studies, specific work experience, or other relevant strategies. Be specific and actionable.`,
});

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
