/**
 * Utility functions for the Hacker News MCP server
 */

import axios, { AxiosInstance } from 'axios';
import { Story, Comment } from './types.js';

/**
 * Create and configure axios instance for Hacker News API
 */
export function createAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0',
    timeout: 10000,
  });
}

/**
 * Fetch a single item from the Hacker News API
 */
export async function fetchItem(axiosInstance: AxiosInstance, id: number): Promise<Story | null> {
  try {
    const response = await axiosInstance.get<Story>(`/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

/**
 * Recursively fetch comments with their replies
 */
export async function fetchComments(
  axiosInstance: AxiosInstance,
  commentIds: number[],
  maxDepth: number,
  minScore: number = 0,
  currentDepth: number = 0,
): Promise<Comment[]> {
  if (currentDepth >= maxDepth || commentIds.length === 0) {
    return [];
  }

  const comments = await Promise.all(
    commentIds.map(async (id) => {
      const comment = await fetchItem(axiosInstance, id);
      if (comment && comment.type === 'comment' && !comment.deleted && !comment.dead) {
        const result: Comment = {
          ...comment,
          depth: currentDepth,
          time:
            typeof comment.time === 'number'
              ? new Date(comment.time * 1000).toISOString()
              : comment.time
                ? new Date(Date.parse(comment.time)).toISOString()
                : undefined,
        };

        if (comment.kids && comment.kids.length > 0 && currentDepth < maxDepth - 1) {
          // Fetch child comments recursively
          const childComments = await fetchComments(
            axiosInstance,
            comment.kids.slice(0, 10), // Increased limit for child comments
            maxDepth,
            minScore,
            currentDepth + 1,
          );

          // Sort child comments by score (descending)
          result.replies = childComments.sort((a, b) => (b.score || 0) - (a.score || 0));
        }

        return result;
      }
      return null;
    }),
  );

  const validComments = comments.filter(Boolean) as Comment[];

  // Sort comments by score (descending) while maintaining thread structure
  return validComments.sort((a, b) => (b.score || 0) - (a.score || 0));
}

/**
 * Format comments as readable text
 */
export function formatCommentsAsText(
  comments: Comment[],
  storyTitle: string,
  storyId: number,
  totalComments: number,
): string {
  let output = `# Hacker News Comments for Story ${storyId}\n`;
  output += `## "${storyTitle}"\n`;
  output += `📊 Total Comments: ${totalComments} | Showing: ${comments.length}\n\n`;

  if (comments.length === 0) {
    return output + 'No comments found matching the criteria.\n';
  }

  output += '---\n\n';

  const formatComment = (comment: Comment, depth: number = 0): string => {
    const indent = '  '.repeat(depth);
    const depthIndicator = depth === 0 ? '💬' : '↳'.repeat(depth);
    const scoreText = comment.score ? ` (${comment.score} points)` : '';

    // Clean up HTML entities in text
    const cleanText = (comment.text || '')
      .replace(/&#x2F;/g, '/')
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/<a href="[^"]*"[^>]*>/g, '')
      .replace(/<\/a>/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '\n\n');

    let result = `${indent}${depthIndicator} **${comment.by}**${scoreText}\n`;
    result += `${indent}   ${cleanText.split('\n').join(`\n${indent}   `)}\n\n`;

    // Add replies with increased indentation
    if (comment.replies && comment.replies.length > 0) {
      for (const reply of comment.replies) {
        result += formatComment(reply, depth + 1);
      }
    }

    return result;
  };

  for (const comment of comments) {
    output += formatComment(comment);
    output += '---\n\n';
  }

  return output;
}
