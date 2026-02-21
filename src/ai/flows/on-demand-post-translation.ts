'use server';
/**
 * @fileOverview A Genkit flow for on-demand blog post translation.
 *
 * - onDemandPostTranslation - A function that handles the translation of a blog post.
 * - OnDemandPostTranslationInput - The input type for the onDemandPostTranslation function.
 * - OnDemandPostTranslationOutput - The return type for the onDemandPostTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnDemandPostTranslationInputSchema = z.object({
  content: z.string().describe('The original content of the blog post to be translated.'),
  targetLanguage: z.enum(['Bangla', 'English']).describe('The target language for translation. Can be "Bangla" or "English".'),
});
export type OnDemandPostTranslationInput = z.infer<typeof OnDemandPostTranslationInputSchema>;

const OnDemandPostTranslationOutputSchema = z.object({
  translatedContent: z.string().describe('The translated content of the blog post.'),
});
export type OnDemandPostTranslationOutput = z.infer<typeof OnDemandPostTranslationOutputSchema>;

export async function onDemandPostTranslation(input: OnDemandPostTranslationInput): Promise<OnDemandPostTranslationOutput> {
  return onDemandPostTranslationFlow(input);
}

const onDemandPostTranslationPrompt = ai.definePrompt({
  name: 'onDemandPostTranslationPrompt',
  input: {schema: OnDemandPostTranslationInputSchema},
  output: {schema: OnDemandPostTranslationOutputSchema},
  prompt: `You are a highly skilled professional translator. Your task is to translate the provided blog post content into {{targetLanguage}}.

Only return the translated text in the 'translatedContent' field of the JSON output and nothing else.

Content to translate:
---
{{{content}}}
---
`,
});

const onDemandPostTranslationFlow = ai.defineFlow(
  {
    name: 'onDemandPostTranslationFlow',
    inputSchema: OnDemandPostTranslationInputSchema,
    outputSchema: OnDemandPostTranslationOutputSchema,
  },
  async input => {
    const {output} = await onDemandPostTranslationPrompt(input);
    return output!;
  }
);
