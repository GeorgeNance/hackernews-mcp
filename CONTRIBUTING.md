# Contributing to Hacker News MCP Server

Thank you for your interest in contributing to the Hacker News MCP Server! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- An MCP-compatible client for testing (like Claude Desktop)

### Setting up the development environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/hackernews-mcp.git
   cd hackernews-mcp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Test the server:
   ```bash
   npm run inspector
   ```

## 🔧 Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Build and test your changes:

   ```bash
   npm run build
   npm run inspector
   ```

4. Test with a real MCP client if possible

### Code Style

- We use TypeScript for type safety
- Follow existing code patterns and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add story search by author functionality
fix: handle network timeouts gracefully
docs: update API documentation for new parameters
refactor: extract comment formatting logic
```

## 🧪 Testing

### Manual Testing

1. Use the MCP Inspector:

   ```bash
   npm run inspector
   ```

2. Test each tool with various parameters:

   - `get_top_stories` with different counts
   - `get_story_details` with real story IDs
   - `get_story_comments` with different filters
   - `search_stories` with various queries

3. Test error handling:
   - Invalid story IDs
   - Network failures
   - Invalid parameters

### Integration Testing

Test with actual MCP clients:

- Claude Desktop
- Other MCP-compatible tools

## 🐛 Reporting Issues

Before creating an issue:

1. Check if the issue already exists
2. Try the latest version
3. Test with the MCP Inspector
4. Gather relevant information (OS, Node.js version, error messages)

Use our issue templates:

- Bug Report for bugs
- Feature Request for new features

## 📝 Documentation

When contributing:

- Update the README.md if you add new features
- Document new tool parameters in the API Reference section
- Add examples for new functionality
- Update the CHANGELOG.md (if we add one)

## 🏗️ Architecture Guidelines

### Adding New Tools

1. Define the tool schema in `setupToolHandlers()`
2. Implement the handler function
3. Add proper error handling
4. Update documentation

### Code Organization

- `src/index.ts` - Main server logic and tool handlers
- `src/fetcher.ts` - Web content fetching utilities
- Keep related functionality together
- Extract reusable logic into utility functions

### Error Handling

- Use `McpError` for MCP-specific errors
- Provide meaningful error messages
- Handle network failures gracefully
- Validate input parameters

## 🔍 API Design Principles

When designing new tools or modifying existing ones:

1. **Consistency** - Follow existing parameter naming patterns
2. **Flexibility** - Provide sensible defaults but allow customization
3. **Safety** - Validate inputs and handle edge cases
4. **Performance** - Be mindful of API rate limits and response times
5. **Documentation** - Clear descriptions and examples

## 📚 Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Hacker News API Documentation](https://github.com/HackerNews/API)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

## 🤝 Pull Request Process

1. Ensure your code builds successfully
2. Test your changes thoroughly
3. Update documentation if needed
4. Create a clear pull request description
5. Link any related issues

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] Tested with MCP Inspector
- [ ] Tested with real MCP client
- [ ] All builds pass

## Checklist

- [ ] Code follows project style
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues and discussions
- Review the documentation and examples

Thank you for contributing! 🙏
