# Jivvy Mock UI Implementation Guide
## Bridging Simplicity, Automation, and Power Users

> Goal: Implement mock advanced features (automation, formatting, databases, AI)
> without violating user trust, speed, or cognitive simplicity.

---

## 0. Core Product Laws (Do Not Break)

These rules override *all* feature ideas.

1. No setup before use
2. No structure visible without user intent
3. No AI runs automatically (unless user wants it to)
4. Everything must be reversible
5. Offline works by default
6. Speed > Power in the default state

If a UI change breaks one of these → do not ship.

---

## 1. Define the Primary Surface (Layer 1 UI)

### Objective
The default UI must feel like:
- A blank desk
- A fast capture surface
- Zero learning curve

### Requirements
- Single main canvas
- Immediate typing on load
- No visible schemas, fields, or modes
- No toolbars visible by default

### Implementation Tasks
- [ ] Ensure app opens directly into writable space
- [ ] Remove persistent sidebars from default view
- [ ] Add subtle placeholder text (first run only)
  - Example: “Start typing or drop a file”

---

## 2. Contextual Controls (Progressive Disclosure)

### Objective
Controls appear only when the user *needs* them.

### Rules
- No permanent formatting bars
- Controls appear via:
  - Hover
  - Text selection
  - Right-click
  - Command palette

### Implementation Tasks
- [ ] Add formatting menu on text selection
- [ ] Add hover affordances for blocks/artifacts
- [ ] Add right-click context menu:
  - Format
  - Convert
  - Analyze
  - Reveal structure

---

## 3. Invisible Automatic Formatting (Latent Structure)

### Objective
Jivvy detects structure without showing it.

### Examples
- Lists inferred from repeated dashes or bullets
- Headings inferred from spacing / capitalization
- Dates inferred from natural language

### Rules
- Formatting applies on blur, not live typing
- Never move the cursor unexpectedly
- One undo reverses all formatting

### Implementation Tasks
- [ ] Add background parser for structure detection
- [ ] Delay formatting until user pauses typing
- [ ] Ensure plain text appearance remains intact

---

## 4. Automatic Databases (Without Database UI)

### Objective
Everything is structured, but nothing *looks* structured.

### Mental Model
Artifacts → indexed automatically  
Databases → views, not containers

### Rules
- No “Create Database” button
- No schemas shown by default
- No property panels unless requested

### Implementation Tasks
- [ ] Treat every note/artifact as indexable data
- [ ] Infer fields silently (date, title, tags, lists)
- [ ] Add action:
  - “Show structured view”
- [ ] Ensure structured view is:
  - Optional
  - Reversible
  - Non-destructive

---

## 5. Explicit Power Reveal (Layer 3 UI)

### Objective
Give power users everything — but only when summoned.

### Entry Points
- Command palette
- Right-click → “Advanced”
- Inspector toggle

### Power Features (Hidden by Default)
- Field inspector
- Schema locking
- Manual field overrides
- Table / Kanban / Timeline views

### Implementation Tasks
- [ ] Add “Reveal detected fields” option
- [ ] Add inspector drawer (collapsed by default)
- [ ] Allow users to lock inferred fields manually
- [ ] Ensure changes never affect base text view

---

## 6. AI as a Tool, Not a Presence

### Objective
AI must feel like a utility, not a collaborator.

### Rules
- AI never auto-runs
- AI never rewrites silently
- AI actions are explicit and labeled

### Approved AI Actions
- Summarize
- Explain
- Quiz
- Extract key points
- Convert to structured view

### Implementation Tasks
- [ ] Remove AI from default UI
- [ ] Place AI actions in:
  - Right-click menu
  - Command palette
- [ ] Add preview before applying AI output

---

## 7. Mode Transitions Without Mode Switching

### Objective
Users should feel like they never leave the desk.

### Design Pattern
- Overlays instead of page switches
- Workspace remains visible underneath

### Implementation Tasks
- [ ] Convert study / quiz views to overlays
- [ ] Use bottom sheets or side panels
- [ ] Add subtle animations (fade / slide)

---

## 8. Pro User Efficiency Layer

### Objective
Make power users fast without hurting casual users.

### Features
- Keyboard shortcuts
- Command palette
- Text-first workflows

### Implementation Tasks
- [ ] Add global command palette (Cmd/Ctrl + K)
- [ ] Document keyboard shortcuts
- [ ] Ensure all UI actions are keyboard-accessible

---

## 9. Visual Polish Without Complexity

### Objective
Minimal ≠ boring. Give personality carefully.

### Allowed Customization
- Light / dark
- Font toggle (serif / sans)
- Accent color (limited set)
- Focus mode (hide UI chrome)

### Implementation Tasks
- [ ] Add focus mode toggle
- [ ] Limit customization options intentionally
- [ ] Avoid theme/plugin systems in V1

---

## 10. Validation Checklist (Before Shipping Any UI Change)

Ask these questions:

- Can a new user use this without explanation?
- Does this interrupt thinking?
- Does this introduce setup?
- Is this reversible?
- Is this fast offline?

If any answer is “no” → revise.

---

## Final North Star

> Jivvy is not a tool you manage.  
> It is a surface that adapts when asked.

If users notice the system, you’ve gone too far.

