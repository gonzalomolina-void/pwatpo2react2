# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\hjaga\.gemini\skills\branch-pr\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\hjaga\.gemini\skills\go-testing\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\hjaga\.gemini\skills\issue-creation\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | C:\Users\hjaga\.gemini\skills\judgment-day\SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | C:\Users\hjaga\.gemini\skills\skill-creator\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Cada PR debe enlazar una issue aprobada (formato: `Closes #N`, `Fixes #N` o `Resolves #N`).
- Cada PR debe tener exactamente un label `type:*` (`type:bug`, `type:feature`, `type:docs`, `type:refactor`, `type:chore`, `type:breaking-change`).
- Los nombres de las ramas deben seguir el patrón: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`.
- Los mensajes de commit deben seguir la especificación de Commits Convencionales: `type(scope): description` o `type: description`.
- No usar trailers `Co-Authored-By` ni atribuciones de IA en commits.

### go-testing
- Usar Table-Driven Tests para funciones puras en Go.
- Testear transiciones de estado de modelos Bubbletea directamente llamando a `Model.Update(msg)`.
- Utilizar `teatest.NewTestModel(t, m)` de Charmbracelet para pruebas de integración TUI interactivas.
- Usar Golden File Testing (`testdata/*.golden`) para verificar representaciones de vistas complejas.
- Organizar archivos de prueba junto al código (`model.go` junto a `model_test.go`).
- Comandos comunes: `go test ./...` para todos los tests, `go test -update ./...` para actualizar golden files.

### issue-creation
- No crear issues vacías; usar plantillas de Bug Report (`bug_report.yml`) o Feature Request (`feature_request.yml`).
- Completar todos los campos requeridos en la plantilla.
- Las nuevas issues reciben automáticamente el label `status:needs-review`.
- Se requiere que un mantenedor asigne el label `status:approved` antes de poder abrir un PR.
- Para preguntas o soporte general, usar GitHub Discussions en lugar de issues.

### judgment-day
- Ejecutar la resolución de skills (`skill-resolver`) antes de lanzar revisores para inyectar estándares del proyecto (`## Project Standards`).
- Lanzar DOS sub-agentes jueces ciegos en paralelo (`delegate` asincrónicos) para el mismo objetivo.
- El orquestador compara los resultados tras finalizar ambas delegaciones (clasificándolas en: Confirmed, Suspect A/B, Contradiction).
- Clasificar WARNINGs en: `real` (genera fallos reales en producción, bloqueante) o `theoretical` (caso extremo o improbable, no bloqueante, reportado como INFO).
- Si hay CRITICALs o WARNINGs reales confirmados en la Ronda 1, pedir confirmación para lanzar un Fix Agent y luego re-juzgar en Ronda 2.
- En Ronda 2+, resolver no-críticos inline sin re-lanzar jueces. APPROVED = 0 CRITICALs + 0 WARNINGs reales.
- Detenerse e interrogar al usuario tras 2 iteraciones de solución. No declarar APPROVED antes de cumplir los criterios de salida.

### skill-creator
- Crear un skill en `skills/{skill-name}/SKILL.md` solo para patrones repetitivos, configuraciones complejas o decisiones.
- No duplicar documentación existente (usar referencias locales a archivos reales en `references/`).
- La estructura obligatoria de SKILL.md incluye YAML frontmatter (`name`, `description` con Trigger, `license: Apache-2.0`, `metadata.author: gentleman-programming`, `metadata.version: "1.0"`) y secciones específicas (`When to Use`, `Critical Patterns`, `Code Examples`, `Commands`, `Resources`).
- Registrar el nuevo skill en `AGENTS.md` tras su creación.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| GEMINI.md | GEMINI.md | Index — referencias a los archivos de abajo |
| docs/Planning.md | docs/Planning.md | Referenciado por GEMINI.md |
| docs/hexa.md | docs/hexa.md | Referenciado por GEMINI.md |
| docs/Issues_para_Lautaro.md | docs/Issues_para_Lautaro.md | Referenciado por GEMINI.md |
| docs/Forja_AI_Plan.md | docs/Forja_AI_Plan.md | Referenciado por GEMINI.md |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
