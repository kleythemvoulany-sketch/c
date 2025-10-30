'use server';
/**
 * @fileOverview This file defines a Genkit flow for improving car advertisement descriptions using AI.
 *
 * The flow takes an ad description as input and returns suggestions for improvement to increase engagement and clarity.
 * It exports:
 * - `improveAdDescription` function: The main function to call the flow.
 * - `ImproveAdDescriptionInput` type: The input type for the `improveAdDescription` function.
 * - `ImproveAdDescriptionOutput` type: The output type for the `improveAdDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveAdDescriptionInputSchema = z.object({
  adDescription: z.string().describe('The current description of the car advertisement.'),
});
export type ImproveAdDescriptionInput = z.infer<typeof ImproveAdDescriptionInputSchema>;

const ImproveAdDescriptionOutputSchema = z.object({
  improvedDescription: z.string().describe('The improved description for the car advertisement.'),
  reasoning: z.string().describe('The AI reasoning for the suggested improvements.'),
});
export type ImproveAdDescriptionOutput = z.infer<typeof ImproveAdDescriptionOutputSchema>;

export async function improveAdDescription(input: ImproveAdDescriptionInput): Promise<ImproveAdDescriptionOutput> {
  return improveAdDescriptionFlow(input);
}

const improveAdDescriptionPrompt = ai.definePrompt({
  name: 'improveAdDescriptionPrompt',
  input: {schema: ImproveAdDescriptionInputSchema},
  output: {schema: ImproveAdDescriptionOutputSchema},
  prompt: `You are an expert marketing assistant specializing in writing compelling car advertisement descriptions.

  Your goal is to take an existing ad description and rewrite it to be more engaging, clear, and likely to attract potential buyers.
  Explain your reasoning for the changes.

  Here is the current ad description:
  {{adDescription}}

  Provide an improved description and explain the reasoning behind your changes. Focus on appealing to car buyers in Mauritania and North Africa. Be sure to highlight details which are important to car buyers. Use your knowledge of the Mauritanian and North African car market to tailor your ad improvements.

  Write the output in a way which car buyers find appealing. Include the following fields in your re-written ad:

  -Brand
  -Model
  -Year
  -Kilometers
  -Fuel Type
  -Transmission
  -Condition

  Ensure that the improved ad description includes emojis which enhance readability and visual appeal.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const improveAdDescriptionFlow = ai.defineFlow(
  {
    name: 'improveAdDescriptionFlow',
    inputSchema: ImproveAdDescriptionInputSchema,
    outputSchema: ImproveAdDescriptionOutputSchema,
  },
  async input => {
    const {output} = await improveAdDescriptionPrompt(input);
    return output!;
  }
);

