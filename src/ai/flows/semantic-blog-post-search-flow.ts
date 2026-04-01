'use server';
/**
 * @fileOverview This file implements a Genkit flow for semantic blog post search.
 * It allows users to search for blog posts using natural language queries by converting
 * both the query and blog post content into vector embeddings and finding relevant posts
 * based on semantic similarity.
 *
 * - semanticBlogPostSearch - A function that handles the semantic blog post search process.
 * - SemanticBlogPostSearchInput - The input type for the semanticBlogPostSearch function.
 * - SemanticBlogPostSearchOutput - The return type for the semanticBlogPostSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define a relevance threshold to filter out low-quality matches.
const RELEVANCE_THRESHOLD = 0.5;

// Define the schema for a single blog post
const BlogPostSchema = z.object({
  id: z.string().describe('Unique identifier for the blog post.'),
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The excerpt of the blog post.'),
});

// Define the input schema for the semantic search flow
const SemanticBlogPostSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query from the user.'),
  blogPosts: z.array(BlogPostSchema).describe('A list of blog posts to search through.'),
});

// Define the output schema for the semantic search flow
const SemanticBlogPostSearchOutputSchema = z.object({
  blogPosts: z.array(BlogPostSchema.extend({
      relevanceScore: z.number().optional().describe('Cosine similarity score indicating relevance to the query.')
  })).describe('A list of blog posts semantically relevant to the query, sorted by relevance.'),
});

export type SemanticBlogPostSearchInput = z.infer<typeof SemanticBlogPostSearchInputSchema>;
export type SemanticBlogPostSearchOutput = z.infer<typeof SemanticBlogPostSearchOutputSchema>;

/**
 * Calculates the cosine similarity between two vectors.
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 * @returns The cosine similarity, or 0 if one of the vectors is empty.
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length === 0 || vec2.length === 0) return 0;

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

// Cache for blog post embeddings to avoid re-generating them on every search.
// In a real application, these would be stored in a vector database.
const blogPostEmbeddingsCache: Record<string, number[]> = {};

/**
 * Generates an embedding for a given text using the configured embedding model.
 * @param text The text to embed.
 * @returns A promise that resolves to the embedding vector.
 */
const getEmbedding = async (text: string): Promise<number[]> => {
  if (!text || !text.trim()) {
    return [];
  }
  try {
    const embedResponse = await ai.embed({
      model: 'text-embedding-004',
      content: text,
    });
    if (!embedResponse || !embedResponse.embedding) {
      console.warn('Failed to generate embedding for text, returning empty vector.');
      return [];
    }
    return embedResponse.embedding;
  } catch (error) {
      console.error("Error in getEmbedding:", error);
      return [];
  }
};

/**
 * Defines the Genkit flow for semantic blog post search.
 * This flow takes a natural language query, generates its embedding,
 * and compares it with embeddings of mock blog posts to find the most relevant ones.
 */
const semanticBlogPostSearchFlow = ai.defineFlow(
  {
    name: 'semanticBlogPostSearchFlow',
    inputSchema: SemanticBlogPostSearchInputSchema,
    outputSchema: SemanticBlogPostSearchOutputSchema,
  },
  async (input) => {
    const queryEmbedding = await getEmbedding(input.query);

    if (queryEmbedding.length === 0) {
      // If the query is invalid or fails to produce an embedding, return no results.
      return { blogPosts: [] };
    }

    const relevantPosts: Array<z.infer<typeof SemanticBlogPostSearchOutputSchema>['blogPosts'][0]> = [];

    for (const post of input.blogPosts) {
      let postEmbedding = blogPostEmbeddingsCache[post.id];
      if (!postEmbedding) {
        postEmbedding = await getEmbedding(`${post.title}. ${post.content}`);
        if (postEmbedding.length > 0) {
          blogPostEmbeddingsCache[post.id] = postEmbedding;
        }
      }
      
      if (postEmbedding.length === 0) {
        continue; // Skip posts that failed to get an embedding.
      }

      const relevanceScore = cosineSimilarity(queryEmbedding, postEmbedding);
      
      // Only include posts that meet the relevance threshold.
      if (relevanceScore >= RELEVANCE_THRESHOLD) {
        relevantPosts.push({ ...post, relevanceScore });
      }
    }

    // Sort the truly relevant posts by score in descending order.
    const sortedPosts = relevantPosts
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return { blogPosts: sortedPosts };
  }
);

/**
 * Performs a semantic search for blog posts based on a natural language query.
 * @param input An object containing the search query and the posts to search through.
 * @returns A promise that resolves to an object containing a list of relevant blog posts.
 */
export async function semanticBlogPostSearch(input: SemanticBlogPostSearchInput): Promise<SemanticBlogPostSearchOutput> {
  return semanticBlogPostSearchFlow(input);
}
