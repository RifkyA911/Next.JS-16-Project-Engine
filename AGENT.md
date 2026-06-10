# AGENT.md

## Purpose

This repository is **documentation-first**. AI coding assistants MUST read and understand the documentation before making code changes.

## Required Reading Order

Before editing any code, AI agents MUST read the following documents in order:

1. **README.md** - Project overview and quick start
2. **docs/product-overview.md** - Product positioning and value proposition
3. **docs/product-requirement-document.md** - Detailed PRD with requirements
4. **docs/system-design-description.md** - System architecture and design
5. **docs/architecture.md** - Technical architecture details
6. **docs/engineering-principles.md** - Coding standards and principles

## Documentation-First Development

### Rule 1: Read Before Edit

**ALWAYS** read relevant documentation before editing code:
- For new features: Read PRD and SDD first
- For architecture changes: Read architecture.md first
- For database changes: Read database-design.md first
- For API changes: Read api-design-guidelines.md first

### Rule 2: Update Documentation When Architecture Changes

If you change the architecture, you MUST update:
- docs/architecture.md
- docs/system-design-description.md
- docs/folder-structure.md (if structure changes)
- README.md (if user-facing changes)

### Rule 3: Database Schema Changes

If you modify the database schema:
- Update docs/database-design.md
- Update prisma/schema.prisma
- Generate migration
- Update docs/system-design-description.md if business logic changes
- Update docs/product-requirement-document.md if business requirements change

### Rule 4: New Modules

When introducing new modules:
- Generate documentation FIRST
- Then scaffold code
- Follow existing patterns
- Update folder-structure.md

## Code Standards

### TypeScript Strict Mode

- **NEVER** use `any` types
- Always use explicit return types
- Enable strict mode in tsconfig.json
- Use Zod for runtime validation

### Feature-First Organization

- Organize code by business features, not technical layers
- Keep related code together
- Avoid utility dumping grounds
- Follow folder-structure.md guidelines

### Server-First Approach

- Prefer Server Components over Client Components
- Use Client Components only for interactivity
- Minimize client-side JavaScript
- Leverage Next.js server capabilities

### No Code Duplication

- Don't duplicate logic
- Extract reusable utilities
- Use existing patterns
- Follow DRY principle

## Architecture Principles

### Clean Architecture

Follow the layered architecture defined in docs/architecture.md:
- Presentation Layer (UI components)
- Application Layer (Business logic)
- Domain Layer (Core entities)
- Infrastructure Layer (External integrations)

### SOLID Principles

- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### KISS and YAGNI

- Keep It Simple, Stupid
- You Aren't Gonna Need It
- Avoid over-engineering
- Build what's needed now

## AI Agent Behavior

### Act Like a Senior Engineer

AI agents should behave like senior engineers maintaining a production SaaS platform, not code generators creating isolated snippets.

### Optimize for Maintainability

- Write clean, readable code
- Add comments for complex logic
- Follow naming conventions
- Keep functions small and focused

### Optimize for Scalability

- Consider performance implications
- Use caching appropriately
- Design for horizontal scaling
- Think about database query optimization

### Optimize for Developer Experience

- Write self-documenting code
- Use TypeScript for type safety
- Provide clear error messages
- Follow established patterns

## Common Mistakes to Avoid

### 1. Not Reading Documentation

**Bad**: Jumping straight to code without reading docs
**Good**: Reading relevant documentation before making changes

### 2. Introducing New Technologies Without Justification

**Bad**: Adding a new library because it's "cool"
**Good**: Using existing patterns and libraries unless there's a clear need

### 3. Creating Utility Dumping Grounds

**Bad**: Putting unrelated functions in utils.ts
**Good**: Organizing utilities by domain and feature

### 4. Duplicating Logic

**Bad**: Copy-pasting code instead of extracting to shared utility
**Good**: Extracting reusable functions and components

### 5. Ignoring TypeScript Strict Mode

**Bad**: Using `any` to bypass type checking
**Good**: Writing proper TypeScript types

### 6. Breaking Existing Patterns

**Bad**: Introducing inconsistent patterns
**Good**: Following established conventions

## Decision Framework

### Before Making Changes

1. **Read Documentation**: Read relevant docs first
2. **Understand Context**: Understand why code exists
3. **Check Patterns**: Look for existing patterns
4. **Consider Impact**: Think about downstream effects
5. **Update Docs**: Update documentation if architecture changes

### When to Ask for Clarification

If you're uncertain about:
- Business requirements → Ask user
- Architecture decisions → Reference docs
- Implementation approach → Follow engineering principles
- Breaking changes → Ask user

## Quality Checklist

Before completing a task, verify:

- [ ] Read relevant documentation
- [ ] Followed engineering principles
- [ ] Used TypeScript strict mode
- [ ] No `any` types
- [ ] Followed naming conventions
- [ ] No code duplication
- [ ] Updated documentation if needed
- [ ] Tests added (if applicable)
- [ ] Code is readable and maintainable

## Emergency Procedures

### If Documentation is Outdated

1. Note the discrepancy
2. Update documentation to match reality
3. Inform user about the update
4. Proceed with implementation

### If Patterns Conflict

1. Reference engineering-principles.md
2. Choose the more maintainable approach
3. Document the decision
4. Inform user about the conflict

## Final Reminder

This repository is designed to be a **production-ready SaaS Foundation**. Every change should maintain:
- Code quality
- Architecture integrity
- Documentation accuracy
- Developer experience

AI agents are expected to uphold these standards and contribute to maintaining a world-class enterprise platform.
