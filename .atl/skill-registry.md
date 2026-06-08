# Skill Registry - pwatpo2react2

## User Skills
| Skill | Trigger | Location |
|-------|---------|----------|
| skill-creator | "create skill", "add instructions" | C:\Users\hjaga\.gemini\skills\skill-creator\ |
| judgment-day | "judgment day", "review adversarial" | C:\Users\hjaga\.gemini\skills\judgment-day\ |
| issue-creation | "create issue", "github issue" | C:\Users\hjaga\.gemini\skills\issue-creation\ |
| go-testing | "go test", "bubbletea" | C:\Users\hjaga\.gemini\skills\go-testing\ |
| branch-pr | "create pr", "open pr" | C:\Users\hjaga\.gemini\skills\branch-pr\ |

## Project Standards (auto-resolved)

### HEXA Base Conventions
- **Stack**: React 19, Vite 8, Tailwind CSS v4, react-router-dom v7, i18next.
- **Architecture**: Domain services in `src/services/`, reusable components in `src/components/`, pages in `src/pages/`.
- **Styling**: Use Tailwind CSS (v4). File `src/index.css` must maintain `@import "tailwindcss"`.
- **State**: Prefer native hooks (`useState`, `useEffect`).
- **Mode**: Dark Mode by default (`bg-slate-900`, `text-slate-100`).
- **Workflow**: Use separate branches for features.

### Coding Rules
- Never add AI attribution to commits.
- Use conventional commits.
- Verify technical claims before stating them.
