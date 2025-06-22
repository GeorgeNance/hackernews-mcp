# Active Context

## Current Work Focus

- Finalizing documentation and memory bank
- Preparing v0.1.0 release: versioning, changelog, release notes
- Planning in-memory caching and expanded test coverage

## Recent Changes

- All core MCP tools implemented (get_top_stories, get_story_details, get_story_comments, search_stories)
- Robust parameter validation and error handling added
- Initial README and API documentation completed
- Security checks (private IP blocking, input validation) integrated

### June 2025: Release Readiness & Code Quality

- ESLint and Prettier fully configured and enforced
- Type safety and runtime validation for all tool handler arguments (type guards)
- CI workflow (GitHub Actions) for lint/build/test
- Lint/format scripts and devDependencies added to package.json
- All critical lint/type errors resolved in src/index.ts

## Next Steps

- Implement in-memory caching for repeated HN API requests
- Expand automated test coverage and set up CI (Vitest/Jest, Inspector fixtures)
- Add README badges, contributor workflow, and architecture diagram
- Publish to NPM and MCP registry
- Gather user feedback and iterate on tool interfaces
- Implement MCP-specific innovations (schema export, health_check, streaming, CLI playground)

## Active Decisions & Considerations

- axios for HTTP requests, private-ip for security
- Strict TypeScript for type safety
- CLI/stdio interface only (no web server)
- Prioritize security and validation over feature bloat
- Lint/type guard pattern for all MCP tool handlers

## Important Patterns & Preferences

- Centralized Fetcher utility for all data fetching/conversion
- Tool handler pattern in main server class
- Consistent parameter validation and error reporting
- Preference for clear, minimal, robust code

## Learnings & Insights

- HN API is fast but has rate limits and occasional missing data
- jsdom + turndown effective for HTML→markdown, but requires sanitization
- Security: blocking private IPs and validating all input is essential
