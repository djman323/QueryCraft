# Contributing to QueryCraft

Thank you for your interest in contributing to QueryCraft! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- Git installed and configured
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and SQL

### Finding Issues to Work On

1. Check the [Issues](https://github.com/djman323/QueryCraft/issues) page
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on the issue to express your interest
4. Wait for maintainer approval before starting work

### Reporting Bugs

When reporting bugs, please include:

1. **Clear title** describing the bug
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (browser, OS, Node version)

**Bug Report Template**:
```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Node: 18.17.0
```

### Suggesting Features

When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature solves
3. **Provide use cases** and examples
4. **Consider alternatives** you've thought about

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/QueryCraft.git
cd QueryCraft/query-craft
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
```

### 5. Lint Code

```bash
npm run lint
```

## Project Structure

```
query-craft/
├── src/
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── Editor.tsx
│   │   │   ├── ResultsGrid.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── sqlEngine.ts  # Database logic
│   │   ├── types/
│   │   │   └── index.ts      # Type definitions
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main app page
│   └── types/                # Additional types
├── public/
│   └── sql-wasm.wasm        # SQLite WebAssembly
└── ...config files
```

### Key Directories

- **`src/app/components/`** - Reusable React components
- **`src/app/lib/`** - Business logic and utilities
- **`src/app/types/`** - TypeScript type definitions
- **`public/`** - Static assets

## Coding Standards

### TypeScript Guidelines

1. **Use explicit types** for function parameters and return values
```typescript
// ✅ Good
function executeQuery(sql: string): Promise<QueryResult> {
  // ...
}

// ❌ Bad
function executeQuery(sql) {
  // ...
}
```

2. **Avoid `any` type** - use proper types or `unknown`
```typescript
// ✅ Good
const handleError = (error: Error) => {
  console.error(error.message);
};

// ❌ Bad
const handleError = (error: any) => {
  console.error(error.message);
};
```

3. **Use interfaces for objects**
```typescript
interface UserData {
  id: number;
  name: string;
  email: string;
}
```

### React Guidelines

1. **Functional components** with hooks (no class components)
```typescript
// ✅ Good
const MyComponent: React.FC<Props> = ({ data }) => {
  return <div>{data}</div>;
};

// ❌ Bad
class MyComponent extends React.Component {
  // ...
}
```

2. **Props destructuring** for cleaner code
```typescript
// ✅ Good
const Editor: React.FC<EditorProps> = ({ onRun, isExecuting }) => {
  // ...
};

// ❌ Bad  
const Editor: React.FC<EditorProps> = (props) => {
  const sql = props.onRun;
  // ...
};
```

3. **Use meaningful component names** (PascalCase)
```typescript
// ✅ Good
QueryResultsGrid.tsx
TableSchemaViewer.tsx

// ❌ Bad
grid.tsx
viewer.tsx
```

### CSS Guidelines

1. **Use CSS variables** for theming
```css
/* ✅ Good */
color: var(--text-primary);
background: var(--bg-secondary);

/* ❌ Bad */
color: #ffffff;
background: #1a1a1a;
```

2. **Prefer Tailwind utilities** when possible
```tsx
// ✅ Good
<div className="flex items-center gap-2">

// ❌ Bad
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
```

3. **Responsive design** - mobile-first approach
```css
/* ✅ Good */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 50%;
  }
}
```

### Code Documentation

1. **Add JSDoc comments** for functions
```typescript
/**
 * Executes a SQL query and returns formatted results
 * @param sql - The SQL query string to execute
 * @returns Promise resolving to query results
 * @throws Error if query execution fails
 */
export async function executeQuery(sql: string): Promise<QueryResult> {
  // ...
}
```

2. **Comment complex logic**
```typescript
// Calculate initial positions in a grid layout to avoid overlap
const positions = getInitialPositions(schema, width, height);
```

3. **Use meaningful variable names** (comments shouldn't be needed)
```typescript
// ✅ Good
const isQueryExecuting = true;
const userFullName = "John Doe";

// ❌ Bad
const flag = true;
const str = "John Doe";
```

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

**Examples**:
```bash
feature/add-csv-export
fix/chart-rendering-bug
docs/update-readme
refactor/sql-engine
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format**: `type(scope): description`

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples**:
```bash
feat(editor): add CSV export functionality
fix(charts): resolve pie chart rendering issue
docs(readme): update installation instructions
refactor(sqlEngine): simplify query execution logic
```

### Workflow Steps

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and commit**
```bash
git add .
git commit -m "feat(component): add new feature"
```

3. **Keep your branch updated**
```bash
git fetch origin
git rebase origin/main
```

4. **Push your branch**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request** on GitHub

## Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] No linting errors (`npm run lint`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Self-review completed
- [ ] Documentation updated if needed

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Maintainer review** - may request changes
3. **Address feedback** - make requested changes
4. **Approval** - once approved, PR will be merged

## Testing Guidelines

### Manual Testing

Before submitting:

1. **Test your changes** in the browser
2. **Test edge cases** (empty inputs, large datasets, errors)
3. **Cross-browser testing** (Chrome, Firefox, Safari)
4. **Responsive testing** (desktop, tablet, mobile)

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] UI is responsive
- [ ] Existing features still work
- [ ] Error handling works correctly

## Questions or Need Help?

- **GitHub Issues**: Open an issue for questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact maintainer: devansh@example.com

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to QueryCraft! 🚀

---

**Last Updated**: November 2025
