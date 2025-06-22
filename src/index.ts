#!/usr/bin/env node

/**
 * Hacker News MCP Server
 *
 * This MCP server provides tools to fetch and interact with Hacker News content:
 * - Get top stories with configurable count
 * - Fetch story details and comments
 * - Get popular comments for stories
 * - Search recent stories by keywords
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import { Fetcher } from './fetcher.js';
import { Story } from './types.js';
import { createAxiosInstance, fetchItem, fetchComments, formatCommentsAsText } from './utils.js';

class HackerNewsServer {
  private server: Server;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'hackernews-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.axiosInstance = createAxiosInstance();

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.server.setRequestHandler(ListToolsRequestSchema, () => ({
      tools: [
        {
          name: 'get_top_stories',
          description: 'Get the latest top stories from Hacker News',
          inputSchema: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'Number of stories to fetch (1-100)',
                minimum: 1,
                maximum: 100,
                default: 30,
              },
              include_text: {
                type: 'boolean',
                description: 'Whether to include story text content',
                default: false,
              },
            },
          },
        },
        {
          name: 'get_story_details',
          description: 'Get detailed information about a specific story',
          inputSchema: {
            type: 'object',
            properties: {
              story_id: {
                type: 'number',
                description: 'The Hacker News story ID',
              },
              include_comments: {
                type: 'boolean',
                description: 'Whether to include story comments',
                default: false,
              },
              include_markdown: {
                type: 'boolean',
                description: 'Whether to include story content as markdown',
                default: false,
              },
            },
            required: ['story_id'],
          },
        },
        {
          name: 'get_story_comments',
          description: 'Get popular comments for a story',
          inputSchema: {
            type: 'object',
            properties: {
              story_id: {
                type: 'number',
                description: 'The Hacker News story ID',
              },
              min_score: {
                type: 'number',
                description: 'Minimum score for comments to include',
                default: 1,
              },
              max_depth: {
                type: 'number',
                description: 'Maximum depth of comment threads to traverse',
                default: 3,
                minimum: 1,
                maximum: 10,
              },
              limit: {
                type: 'number',
                description: 'Maximum number of comments to return',
                default: 20,
                minimum: 1,
                maximum: 100,
              },
            },
            required: ['story_id'],
          },
        },
        {
          name: 'search_stories',
          description: 'Search recent stories by keywords',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query keywords',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of stories to return',
                default: 20,
                minimum: 1,
                maximum: 50,
              },
              time_range_hours: {
                type: 'number',
                description: 'How many hours back to search',
                default: 24,
                minimum: 1,
                maximum: 168,
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      return (async () => {
        try {
          switch (request.params.name) {
            case 'get_top_stories':
              return await this.getTopStories(request.params.arguments ?? {});
            case 'get_story_details':
              return await this.getStoryDetails(request.params.arguments ?? {});
            case 'get_story_comments':
              return await this.getStoryComments(request.params.arguments ?? {});
            case 'search_stories':
              return await this.searchStories(request.params.arguments ?? {});
            default:
              throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
          }
        } catch (error) {
          if (error instanceof McpError) {
            throw error;
          }

          console.error('Tool execution error:', error);
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
              },
            ],
            isError: true,
          };
        }
      })();
    });
  }

  private async getTopStories(args: { count?: number; include_text?: boolean }) {
    const count = Math.min(args?.count || 30, 100);
    const includeText = args?.include_text || false;

    try {
      // Get top story IDs
      const response = await this.axiosInstance.get<number[]>('/topstories.json');
      const storyIds = response.data.slice(0, count);

      // Fetch story details
      const stories = await Promise.all(
        storyIds.map(async (id) => {
          const story = await fetchItem(this.axiosInstance, id);
          if (story && story.type === 'story') {
            return {
              id: story.id,
              title: story.title,
              url: story.url,
              by: story.by,
              score: story.score,
              time:
                typeof story.time === 'number'
                  ? new Date(story.time * 1000).toISOString()
                  : story.time
                    ? new Date(Date.parse(story.time)).toISOString()
                    : undefined,
              descendants: story.descendants,
              ...(includeText && story.text ? { text: story.text } : {}),
            };
          }
          return null;
        }),
      );

      const validStories = stories.filter(Boolean);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(validStories, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch top stories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private isGetStoryDetailsArgs(arg: unknown): arg is { story_id: number; include_comments?: boolean; include_markdown?: boolean } {
    return (
      typeof arg === 'object' &&
      arg !== null &&
      typeof (arg as { story_id?: unknown }).story_id === 'number'
    );
  }

  private async getStoryDetails(args: unknown) {
    if (!this.isGetStoryDetailsArgs(args)) {
      throw new McpError(ErrorCode.InvalidParams, 'story_id is required');
    }
    const { story_id, include_comments, include_markdown } = args;
    const storyId = story_id;
    const includeComments = include_comments || false;
    const includeMarkdown = include_markdown || false;

    try {
      const story = await fetchItem(this.axiosInstance, storyId);

      if (!story) {
        throw new McpError(ErrorCode.InvalidParams, `Story ${storyId} not found`);
      }

      const result: Story = {
        ...story,
        time:
          typeof story.time === 'number'
            ? new Date(story.time * 1000).toISOString()
            : story.time
              ? new Date(Date.parse(story.time)).toISOString()
              : undefined,
      };

      if (includeComments && story.kids && story.kids.length > 0) {
        result.comments = await fetchComments(this.axiosInstance, story.kids.slice(0, 10), 2);
      }

      if (includeMarkdown && story.url) {
        const markdown = await Fetcher.markdown({ url: story.url });
        if (markdown.content[0].type === 'text') {
          result.text = markdown.content[0].text;
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch story details: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private isGetStoryCommentsArgs(arg: unknown): arg is { story_id: number; min_score?: number; max_depth?: number; limit?: number } {
    return (
      typeof arg === 'object' &&
      arg !== null &&
      typeof (arg as { story_id?: unknown }).story_id === 'number'
    );
  }

  private async getStoryComments(args: unknown) {
    if (!this.isGetStoryCommentsArgs(args)) {
      throw new McpError(ErrorCode.InvalidParams, 'story_id is required');
    }
    const { story_id, min_score, max_depth, limit } = args;
    const storyId = story_id;
    const minScore = min_score || 1;
    const maxDepth = Math.min(max_depth || 3, 10);
    const limitVal = Math.min(limit || 20, 100);

    try {
      const story = await fetchItem(this.axiosInstance, storyId);

      if (!story || !story.kids) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ story_id: storyId, comments: [] }, null, 2),
            },
          ],
        };
      }

      const comments = await fetchComments(this.axiosInstance, story.kids, maxDepth, minScore);
      const filteredComments = comments.slice(0, limitVal);

      // Format comments as readable text
      const formattedText = formatCommentsAsText(
        filteredComments,
        story.title || 'Unknown Story',
        storyId,
        story.descendants || 0,
      );

      return {
        content: [
          {
            type: 'text',
            text: formattedText,
          },
        ],
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch story comments: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private isSearchStoriesArgs(arg: unknown): arg is { query: string; limit?: number; time_range_hours?: number } {
    return (
      typeof arg === 'object' &&
      arg !== null &&
      typeof (arg as { query?: unknown }).query === 'string'
    );
  }

  private async searchStories(args: unknown) {
    if (!this.isSearchStoriesArgs(args)) {
      throw new McpError(ErrorCode.InvalidParams, 'query is required');
    }
    const { query, limit, time_range_hours } = args;
    const limitVal = Math.min(limit || 20, 50);
    const timeRangeHours = Math.min(time_range_hours || 24, 168);

    try {
      // Get recent stories (using topstories as a proxy for recent)
      const response = await this.axiosInstance.get<number[]>('/topstories.json');
      const recentStoryIds = response.data.slice(0, 200); // Get more stories to search through

      const stories = await Promise.all(
        recentStoryIds.map(async (id) => {
          const story = await fetchItem(this.axiosInstance, id);
          return story;
        }),
      );

      const cutoffTime = Date.now() / 1000 - timeRangeHours * 3600;
      const queryLower = query.toLowerCase();

      const matchingStories = stories
        .filter(Boolean)
        .filter((story) => story!.type === 'story')
        .filter((story) => {
          let storyTime: number = 0;
          if (typeof story!.time === 'number') {
            storyTime = story!.time;
          } else if (typeof story!.time === 'string') {
            // Convert ISO string to UNIX timestamp (seconds)
            storyTime = Math.floor(Date.parse(story!.time) / 1000);
          }
          return storyTime >= cutoffTime;
        })
        .filter((story) => {
          const title = (story!.title || '').toLowerCase();
          const text = (story!.text || '').toLowerCase();
          const url = (story!.url || '').toLowerCase();

          return (
            title.includes(queryLower) || text.includes(queryLower) || url.includes(queryLower)
          );
        })
        .slice(0, limitVal)
        .map((story) => ({
          id: story!.id,
          title: story!.title,
          url: story!.url,
          by: story!.by,
          score: story!.score,
          time:
            typeof story!.time === 'number'
              ? new Date(story!.time * 1000).toISOString()
              : story!.time
                ? new Date(Date.parse(story!.time)).toISOString()
                : undefined,
          descendants: story!.descendants,
        }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                time_range_hours: timeRangeHours,
                results_count: matchingStories.length,
                stories: matchingStories,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to search stories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Hacker News MCP server running on stdio');
  }
}

const server = new HackerNewsServer();
server.run().catch(console.error);
