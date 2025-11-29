# Contributing to Hampstead Heritage Checker

Thank you for your interest in contributing to the Hampstead Heritage & Planning Checker! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Access to a Supabase project with PostGIS enabled
- Mapbox API token

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rockmrack/the-hampstead-planning-heritage-checker.git
   cd the-hampstead-planning-heritage-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # E2E tests
   ```

## Making Changes

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

Example: `feature/add-street-filtering`

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

Example:
```
feat(street-pages): add filtering by conservation area

- Added new filter component
- Updated street list to respect filter
- Added unit tests for filter logic

Closes #123
```

## Code Standards

### TypeScript

- Use strict TypeScript (`strict: true`)
- Define explicit types for function parameters and returns
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/primitives

```typescript
// ✅ Good
function checkProperty(coords: Coordinates): Promise<PropertyCheckResult> {
  // ...
}

// ❌ Bad
function checkProperty(coords: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Define prop interfaces
- Use named exports for components
- Implement error boundaries for complex components

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── map/            # Map-related components
├── lib/                 # Utility libraries
│   ├── config/         # Configuration
│   ├── services/       # Business logic services
│   └── utils/          # Utility functions
├── services/            # External service integrations
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use the `cn()` utility for conditional classes
- Define custom colors in `tailwind.config.js`

### Documentation

- Add JSDoc comments to exported functions
- Include `@param`, `@returns`, and `@example` where helpful
- Keep README.md updated with new features

## Testing

### Unit Tests (Jest)

- Place tests in `src/__tests__/` or adjacent to source files
- Name test files `*.test.ts` or `*.test.tsx`
- Aim for 70%+ coverage

```typescript
describe('checkProperty', () => {
  it('should return RED status for listed buildings', async () => {
    const result = await checkProperty(listedBuildingCoords, 'Test Address');
    expect(result.status).toBe('RED');
  });
});
```

### E2E Tests (Playwright)

- Place E2E tests in `e2e/` directory
- Name test files `*.spec.ts`
- Test critical user flows

```typescript
test('should search for an address and display results', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="address-search"]', 'NW3');
  await expect(page.locator('[data-testid="results"]')).toBeVisible();
});
```

### Running Tests

```bash
# Unit tests
npm run test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

4. **Open a Pull Request**
   - Use a descriptive title
   - Fill out the PR template
   - Link related issues

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated tests as needed
- [ ] All tests pass locally
- [ ] Updated documentation if needed
- [ ] No security vulnerabilities (run `npm audit`)
- [ ] Snyk security scan passes

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, the PR will be merged
4. Delete your feature branch

## Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Report security vulnerabilities privately to maintainers
- Run `npm run snyk` before submitting PRs

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- General questions

Thank you for contributing! 🏛️
