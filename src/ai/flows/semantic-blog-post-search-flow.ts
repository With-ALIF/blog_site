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

// Define the schema for a single blog post
const BlogPostSchema = z.object({
  id: z.string().describe('Unique identifier for the blog post.'),
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The full content of the blog post.'),
  relevanceScore: z.number().optional().describe('Cosine similarity score indicating relevance to the query.'),
});

// Define the input schema for the semantic search flow
const SemanticBlogPostSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query from the user.'),
});

// Define the output schema for the semantic search flow
const SemanticBlogPostSearchOutputSchema = z.object({
  blogPosts: z.array(BlogPostSchema).describe('A list of blog posts semantically relevant to the query, sorted by relevance.'),
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

// In a real application, blog post data and their embeddings would be fetched from a database.
// For this example, we'll use mock data and generate embeddings on the fly.
const mockBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js and Firebase',
    content: 'Learn how to build powerful full-stack applications using Next.js for the frontend and Firebase for backend services like authentication, database, and hosting.',
    category: 'Programming',
  },
  {
    id: '2',
    title: 'The Future of AI in Education',
    content: 'Artificial intelligence is poised to revolutionize the education sector, offering personalized learning experiences and automating administrative tasks.',
    category: 'Education',
  },
  {
    id: '3',
    title: 'Healthy Lifestyle Tips for Developers',
    content: 'Maintaining a healthy work-life balance is crucial for developers. This post covers exercise routines, nutrition advice, and mental well-being strategies.',
    category: 'Lifestyle',
  },
  {
    id: '4',
    title: 'Understanding Modern JavaScript Frameworks',
    content: 'A deep dive into popular JavaScript frameworks like React, Vue, and Angular, exploring their strengths, weaknesses, and ideal use cases.',
    category: 'Programming',
  },
  {
    id: '5',
    title: 'Web Performance Optimization Techniques',
    content: 'Optimize your website for speed and responsiveness. Techniques include image compression, lazy loading, and code splitting.',
    category: 'Tech',
  },
  {
    id: '6',
    title: 'Introduction to Machine Learning Concepts',
    content: 'This article provides a beginner-friendly introduction to machine learning, covering supervised, unsupervised learning, and popular algorithms.',
    category: 'Tech',
  },
];

// Cache for blog post embeddings to avoid re-generating them on every search.
// In a real application, these would be stored in a vector database.
const blogPostEmbeddingsCache: Record<string, number[]> = {};

/**
 * Generates an embedding for a given text using the configured embedding model.
 * @param text The text to embed.
 * @returns A promise that resolves to the embedding vector.
 */
const getEmbedding = async (text: string): Promise<number[]> => {
  const embedResponse = await ai.embed({
    model: 'text-embedding-004',
    content: text,
  });
  // Ensure that embedResponse.embedding.text exists before returning
  if (!embedResponse.embedding?.text) {
    throw new Error('Failed to generate embedding for text.');
  }
  return embedResponse.embedding.text;
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

    const relevantPosts: Array<z.infer<typeof BlogPostSchema>> = [];

    for (const post of mockBlogPosts) {
      let postEmbedding = blogPostEmbeddingsCache[post.id];
      if (!postEmbedding) {
        // Generate embedding if not cached (simulating fetching from DB/indexing)
        postEmbedding = await getEmbedding(`${post.title}. ${post.content}`);
        blogPostEmbeddingsCache[post.id] = postEmbedding;
      }

      const relevanceScore = cosineSimilarity(queryEmbedding, postEmbedding);
      relevantPosts.push({ ...post, relevanceScore });
    }

    // Sort by relevance score in descending order and take the top N (e.g., top 5)
    const sortedPosts = relevantPosts
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 5);

    // Remove the relevanceScore from the final output if it's not part of the external API contract
    // or explicitly keep it if it is.
    // For this exercise, we keep it as optional in schema, so it's fine.

    return { blogPosts: sortedPosts };
  }
);

/**
 * Performs a semantic search for blog posts based on a natural language query.
 * @param input An object containing the search query.
 * @returns A promise that resolves to an object containing a list of relevant blog posts.
 */
export async function semanticBlogPostSearch(input: SemanticBlogPostSearchInput): Promise<SemanticBlogPostSearchOutput> {
  return semanticBlogPostSearchFlow(input);
}
