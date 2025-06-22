# System Patterns

## System Architecture

- CLI-based MCP server in TypeScript
- Communicates via stdio for MCP client compatibility
- Main server class (HackerNewsServer) registers and dispatches tool handlers
- Central Fetcher utility for all data fetching and content conversion

## Key Technical Decisions

- TypeScript for type safety and maintainability
- axios for HTTP requests to Hacker News API
- jsdom and turndown for HTML→markdown conversion
- private-ip for security (blocks private IP access)
- Strict parameter validation for all tool inputs
- Code quality enforced via ESLint, Prettier, and CI (GitHub Actions)

## Design Patterns

- Tool handler pattern: each MCP tool is a method on the main server class
- Type guard pattern: each tool handler uses a type guard function for runtime argument validation and type safety
- Centralized Fetcher utility for network/content operations
- Functional error handling and input validation
- Separation of concerns: fetching, formatting, and tool logic are modular

## Component Relationships

- HackerNewsServer: entry point, registers/dispatches tool handlers
- Fetcher: static methods for fetching/converting HN/API/web content
- Utility functions: axios instance creation, comment formatting, etc.
- Types: shared type definitions for stories, comments, requests

## Critical Implementation Paths

- Tool invocation → parameter validation → Fetcher fetches data → data formatted/converted → response returned to client
- Security checks (private IP, input validation) and error handling applied before any external request
- Errors are reported clearly to the client; system degrades gracefully on failure
