# Jivvy Dashboard Implementation Guide
## Refactoring the Home Surface for Trust, Calm, and Control

---

## 0. Dashboard Purpose (Lock This In)

The Jivvy dashboard is NOT:
- A task manager
- A recommendation engine
- A priority system
- A planner

The dashboard IS:
- A calm orientation surface
- A place to resume work
- A reflection of user intent

If the dashboard feels opinionated → it’s wrong.

---

## 1. Remove Implicit System Judgment

### Current Problem
Phrases like:
- “Here is what is relevant for you right now”
- “Focus Now”

Imply:
- System authority
- Hidden logic
- AI decision-making

### Required Changes
- [ ] Remove “relevant for you” language
- [ ] Remove “Focus Now” as a system-generated section

### Replace With
Neutral language only:
- “Continue”
- “Recent”
- “Open”
- “Pinned”

---

## 2. Replace “Focus Now” with “Resume”

### Objective
Show what the user *touched last*, not what the system thinks matters.

### Implementation
- Rename section to: **Resume**
- Populate with:
  - Last opened artifact
  - Last active study set
  - Last edited project

### Rules
- No urgency language
- No scoring
- No recommendations

### Tasks
- [ ] Rename Focus Now → Resume
- [ ] Sort purely by recency
- [ ] Remove “due” language from cards

---

## 3. Neutralize Card Language

### Current Card Issues
- “12 cards due”
- “2 tasks remaining”

This introduces:
- Pressure
- Obligation
- Productivity guilt

### Replace With
Descriptive, not evaluative copy:

Instead of:
- “12 cards due”
Use:
- “12 study cards”

Instead of:
- “2 tasks remaining”
Use:
- “2 tasks”

### Tasks
- [ ] Audit all dashboard copy
- [ ] Remove judgmental verbs (due, remaining, overdue)
- [ ] Use nouns only

---

## 4. Flatten Section Hierarchy

### Problem
“Focus Now” visually dominates the dashboard.

### Fix
All sections should feel equal.

Allowed sections:
- Resume
- Today (optional)
- Pinned
- Recent

### Rules
- No section should visually dominate
- Same card size across sections
- Same typography weight

### Tasks
- [ ] Equalize section spacing
- [ ] Remove visual emphasis hierarchy
- [ ] Make dashboard scannable, not directive

---

## 5. Add Explicit Control for Filtering

### Objective
If prioritization exists, it must be user-triggered.

### Add
A subtle filter control:
- “Show: Recent | Pinned | Scheduled”

### Rules
- Default = Recent
- Filters must be reversible
- No auto-switching

### Tasks
- [ ] Add filter toggle (non-prominent)
- [ ] Persist user choice locally

---

## 6. Make the Dashboard Optional

### Critical Rule
The dashboard must not block work.

### Implementation
- App opens to:
  - Last open artifact OR
  - Dashboard if nothing active

### Tasks
- [ ] Skip dashboard if user was working
- [ ] Allow “Always open to workspace” toggle

---

## 7. Preserve the Desk Metaphor

### Visual Rules
- Keep white space
- Avoid “widgets”
- Avoid analytics visuals
- Avoid progress bars

The dashboard should feel:
- Calm
- Static
- Honest

---

## 8. Validation Checklist (Before Shipping)

Ask:
- Does this tell the user what to do?
- Does this imply urgency?
- Does this rely on hidden logic?
- Would this annoy me at 11pm?

If yes → remove it.

---

## Final North Star

> Jivvy does not prioritize your life.
> It shows you where you left off.

That is enough.

