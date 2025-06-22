# Project Brief

## Purpose

Provide a secure, structured MCP server for real-time Hacker News data, enabling AI assistants and MCP clients to access stories, comments, and metadata.

## Goals

- [x] Implement core MCP tools: get_top_stories, get_story_details, get_story_comments, search_stories
- [x] Robust parameter validation and error handling
- [x] Complete API and usage documentation
- [ ] Implement in-memory caching for repeated HN API requests
- [ ] Expand automated test coverage and CI integration
- [ ] Publish to NPM and MCP registry

## Scope

**In Scope:**

- MCP server for Hacker News data only
- CLI/stdio interface for MCP clients
- Fetching, formatting, and returning HN stories, details, and comments
- Security: block private IPs, strict input validation

**Out of Scope:**

- Web UI or frontend client
- Persistent storage, user accounts, or authentication
- Other news sources or APIs

## Stakeholders

- Developers building AI assistants and MCP clients
- End users accessing Hacker News via conversational interfaces

## Success Criteria

- Server builds and runs without errors
- All MCP tools function as documented
- Used successfully by at least one production MCP client (e.g., Claude Desktop)
- Documentation is clear, accurate, and up to date
