---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Configure MCP server with '...'
2. Run tool '....'
3. With parameters '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Error message/output**
If applicable, paste the error message or unexpected output here.

**Environment (please complete the following information):**

- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- MCP Client: [e.g. Claude Desktop, other]
- MCP Client Version: [e.g. 1.0.0]

**MCP Configuration**
Please share your MCP server configuration (redact any sensitive information):

```json
{
  "mcpServers": {
    "hackernews-mcp": {
      // your configuration here
    }
  }
}
```

**Additional context**
Add any other context about the problem here.

**Debugging steps attempted**

- [ ] Tried using MCP Inspector (`npm run inspector`)
- [ ] Checked server logs for error messages
- [ ] Verified Node.js and npm versions
- [ ] Rebuilt the project (`npm run build`)
