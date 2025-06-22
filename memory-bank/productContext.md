# Product Context

## Why Does This Project Exist?

Provides a secure MCP server for structured, real-time Hacker News access by AI assistants and MCP clients.

## Problems Solved

- No simple, structured interface for MCP assistants to access Hacker News
- Lack of real-time, programmatic access to HN stories, comments, and metadata for conversational agents
- Need for safe, validated, and rate-limited access to public news data

## How It Works

- MCP client invokes a tool (e.g., get_top_stories) via stdio
- Server validates parameters, fetches data from Hacker News API
- Data is formatted (optionally as markdown/text) and returned to the client
- Security checks (private IP blocking, input validation) on every request
- Errors are reported clearly to the client

## User Experience Goals

- Fast, reliable responses for all tool invocations
- Clear error messages for invalid input or API issues
- Consistent, well-documented tool interfaces
- Safe content fetching with robust validation and security
