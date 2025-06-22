# 📰 Hacker News MCP Server

[![CI](https://github.com/yourusername/hackernews-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/hackernews-mcp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/hackernews-mcp.svg?style=flat)](https://www.npmjs.com/package/hackernews-mcp)

A Model Context Protocol (MCP) server that provides tools to fetch and interact with Hacker News content. This server enables AI assistants to access real-time Hacker News data including top stories, story details, comments, and search functionality.

<a href="https://glama.ai/mcp/servers/@GeorgeNance/hackernews-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@GeorgeNance/hackernews-mcp/badge" alt="Hacker News Server MCP server" />
</a>

## 🚀 Features

### 🛠️ Available Tools

- **`get_top_stories`** - Fetch the latest top stories from Hacker News

  - Configurable count (1-100 stories)
  - Optional text content inclusion
  - Returns story metadata including title, URL, score, author, and comment count

- **`get_story_details`** - Get detailed information about a specific story

  - Fetch complete story metadata
  - Optional comment inclusion with threaded structure
  - Optional markdown content extraction from linked articles

- **`get_story_comments`** - Retrieve popular comments for a story

  - Configurable minimum score filtering
  - Adjustable comment thread depth (1-10 levels)
  - Limit number of comments returned (1-100)
  - Formatted as readable text with thread structure

- **`search_stories`** - Search recent stories by keywords
  - Search through story titles, content, and URLs
  - Configurable time range (1-168 hours)
  - Limit results (1-50 stories)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- An MCP-compatible client (like Claude Desktop)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/hackernews-mcp.git
cd hackernews-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the server

```bash
npm run build
```

## 🎯 Usage

### With Claude Desktop

Add the server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hackernews-mcp": {
      "command": "node",
      "args": ["/path/to/hackernews-mcp/build/index.js"]
    }
  }
}
```

### With Other MCP Clients

The server communicates via stdio and can be used with any MCP-compatible client:

```bash
node build/index.js
```

## 🔍 Example Usage

Once connected, you can ask your AI assistant things like:

- "What are the top stories on Hacker News today?"
- "Get details about Hacker News story 12345678"
- "Show me comments for that viral AI story"
- "Search for recent stories about TypeScript"

## 🛠️ Development

### Build the project

```bash
npm run build
```

### Watch mode for development

```bash
npm run watch
```

### Lint and format the code

```bash
npm run lint
npm run format
```

### Run the MCP Inspector

For debugging and testing:

```bash
npm run inspector
```

This will start the MCP Inspector, providing a web interface to test the server's tools and inspect the communication.

## 📦 Code Quality & Contributing

- **Code Quality:**  
  This project enforces code quality and style using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). All code is checked in CI (GitHub Actions) and must pass linting and formatting before merging.
- **Type Safety:**  
  All tool handlers use explicit type guards for runtime argument validation and robust TypeScript types.
- **CI/CD:**  
  Every push and pull request runs the full build, lint, and (future) test suite via GitHub Actions.
- **How to Contribute:**  
  1. Fork the repository
  2. Create a feature branch (`git checkout -b feature/amazing-feature`)
  3. Commit your changes (`git commit -m 'Add amazing feature'`)
  4. Run `npm run lint` and `npm run format` before pushing
  5. Push to the branch (`git push origin feature/amazing-feature`)
  6. Open a Pull Request

## 📚 API Reference

### get_top_stories

```typescript
{
  count?: number;        // Number of stories (1-100, default: 30)
  include_text?: boolean; // Include story text content (default: false)
}
```

### get_story_details

```typescript
{
  story_id: number;           // Required: HN story ID
  include_comments?: boolean; // Include comments (default: false)
  include_markdown?: boolean; // Extract article as markdown (default: false)
}
```

### get_story_comments

```typescript
{
  story_id: number;    // Required: HN story ID
  min_score?: number;  // Minimum comment score (default: 1)
  max_depth?: number;  // Max thread depth (1-10, default: 3)
  limit?: number;      // Max comments (1-100, default: 20)
}
```

### search_stories

```typescript
{
  query: string;              // Required: Search keywords
  limit?: number;             // Max results (1-50, default: 20)
  time_range_hours?: number;  // Hours to search back (1-168, default: 24)
}
```

## 🏗️ Architecture

The server is built with:

- **TypeScript** for type safety and developer experience
- **@modelcontextprotocol/sdk** for MCP protocol implementation
- **axios** for HTTP requests to Hacker News API
- **jsdom** and **turndown** for HTML to Markdown conversion
- **private-ip** for security (blocks private IP access)

### Key Components

- `src/index.ts` - Main server implementation with tool handlers
- `src/fetcher.ts` - Utility class for fetching and converting web content
- `build/` - Compiled JavaScript output (auto-generated)

## 🔒 Security

- Blocks requests to private IP addresses to prevent local network access
- Rate limiting through Hacker News API natural limits
- Input validation for all tool parameters
- Error handling and graceful degradation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hacker News](https://news.ycombinator.com/) for providing the excellent API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standard
- The open source community for the amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/hackernews-mcp/issues) page
2. Use the MCP Inspector for debugging: `npm run inspector`
3. Create a new issue with detailed information about your problem

---

Made with ❤️ for the MCP community