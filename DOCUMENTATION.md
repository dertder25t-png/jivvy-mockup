# UI Mockup Documentation

## Overview

This document provides detailed specifications for each screen and interaction in the Jivvy UI mockup.

---

## 🏠 HOME SCREEN

**File**: `components/HomeScreen.tsx`

### Purpose
A Netflix-style relevance feed that shows only what's important right now. This is NOT a full list of everything—it's a curated, intelligent surface.

### Design Principles
- **Quiet**: Lots of whitespace, minimal visual noise
- **Focused**: Only shows 3-5 items maximum
- **Self-maintaining**: No user organization required

### Layout
```
┌──────────────────────────────────────┐
│  Good evening, Alex                  │
│  Here is what is relevant...         │
│                                      │
│  ⚡ Focus Now                        │
│  ┌──────────────────────────────┐  │
│  │ 📖 Biology - Cell Respiration │  │
│  │ Study: 12 cards due           │  │
│  └──────────────────────────────┘  │
│                                      │
│  ☑️ Today                            │
│  ┌──────────────────────────────┐  │
│  │ 💼 Brand Identity Project     │  │
│  │ 2 tasks remaining             │  │
│  └──────────────────────────────┘  │
│                                      │
│  📅 Upcoming                         │
│  No lectures scheduled               │
└──────────────────────────────────────┘
```

### Sections

#### Focus Now
- **1-2 items only**
- Most urgent/important right now
- Usually studying, active projects, or overdue tasks
- Amber lightning bolt icon

#### Today
- **2-4 items**
- Things relevant for today
- Projects with tasks, recent meeting notes
- Checkmark icon

#### Upcoming
- **0-3 items**
- Tomorrow's schedule
- Often empty = good design
- Calendar icon

### Interaction
- Click any card → Opens that page
- Hover → Card lifts slightly
- No right-click menus, no complexity

---

## 📄 PAGE/WORKSPACE SCREEN

**File**: `components/PageWorkspace.tsx`

### Purpose
The primary work surface. Everything happens here: note-taking, tasks, sketching, thinking.

### Design Principles
- **Invisible UI**: No visible blocks, toolbars, or chrome
- **Flow state**: Natural typing experience
- **One surface**: Everything coexists on the same page

### Layout
```
┌────────────────────────────────────────┐
│ ← Back              [PDF] [Study] (•••) │ ← Minimal header (on hover)
├────────────────────────────────────────┤
│                                        │
│   Advanced React Patterns              │ ← Page title
│                                        │
│   • Today we discussed HOC vs Hooks   │ ← Bullet
│     • Hooks are preferred             │ ← Indented
│   • Key Concepts:                     │
│     • Composition over Inheritance    │
│   ○ Review the "useAuth" impl         │ ← Task (unchecked)
│   • Component hierarchy sketch        │
│     [thumbnail]                       │ ← Canvas inline
│                                        │
└────────────────────────────────────────┘
```

### Block Types

#### Text Block
- Simple bullet point
- Press Enter → New block
- Press Tab → Indent
- Press Shift+Tab → Outdent

#### Task Block
- Circle icon → Click to complete
- Green checkmark when done
- Strikethrough text

#### Canvas Block
- Shows thumbnail preview
- Click thumbnail → Opens full canvas
- Caption text above

### Keyboard Shortcuts
- **Enter**: New block below
- **Tab**: Increase indent
- **Shift+Tab**: Decrease indent
- **Backspace** (on empty block): Delete block

### Header (Appears on Hover)
- **Back button**: Return to home
- **PDF button**: Open PDF side panel
- **Study button**: Enter study mode
- **Collaborator avatars**: Who's online (subtle)

### Collaboration Indicators
- Subtle colored line on left when someone is editing
- No intrusive presence
- No chat bubbles or notifications

---

## 📑 PDF SIDE-PANEL

**File**: `components/PDFSidePanel.tsx`

### Purpose
Quick PDF reference while taking notes. The PDF is NEVER the primary focus—notes are.

### Design Principles
- **Side-car, not primary**: Panel on right, notes on left
- **Extract, don't annotate**: Pull text into notes
- **Temporary**: Easy to close

### Layout
```
┌──────────────┬─────────────────────┐
│              │ 📄 Textbook.pdf   × │
│              ├─────────────────────┤
│   NOTES      │                     │
│   (main)     │   [PDF content]     │
│              │                     │
│              │   "ATP is the main  │
│              │   energy currency"  │
│              │                     │
│              │   [Extract to Notes]│
└──────────────┴─────────────────────┘
```

### Interaction Flow
1. User clicks "PDF" button in workspace
2. Panel slides in from right (500px width)
3. User highlights text in PDF
4. Clicks "Extract to Notes"
5. Text appears as bullet in main notes
6. User closes panel → Back to full notes

### Features
- Text selection
- Highlight → Extract
- Page navigation
- Close button

### What It's NOT
- Not a full PDF editor
- Not an annotation tool
- Not a separate app

---

## 🎨 CANVAS OVERLAY

**File**: `components/CanvasOverlay.tsx`

### Purpose
Quick visual thinking. Disposable sketches for ideas, not finished art.

### Design Principles
- **Fast**: Opens instantly
- **Disposable**: Not meant to be perfect
- **Non-modal**: Closes cleanly back to notes

### Layout
```
┌────────────────────────────────────────┐
│ ✏️ 🧹 | ↶ ↷ Clear          Done   × │
├────────────────────────────────────────┤
│                                        │
│                                        │
│        [White canvas for drawing]      │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  Quick sketch • Close to return        │
└────────────────────────────────────────┘
```

### Tools
- **Pen**: Black stroke, 2px width
- **Eraser**: White stroke, 20px width
- **Undo/Redo**: Basic history
- **Clear**: Wipe canvas

### Interaction
1. Click canvas thumbnail in notes
2. Full-screen overlay appears
3. Draw with mouse/stylus
4. Click "Done" → Returns to notes
5. Thumbnail updates automatically

---

## 📚 STUDY MODE

**File**: `components/StudyMode.tsx`

### Purpose
Instant flashcards from your notes. No deck creation, no setup.

### Design Principles
- **Auto-generated**: Uses existing note content
- **Full-screen**: Immersive, distraction-free
- **Minimal chrome**: Just the cards

### Layout
```
┌────────────────────────────────────────┐
│ × Exit Study Mode    Biology    🔄     │
│ [█████████░░░░░░░░░░░░░░] 3/12        │
├────────────────────────────────────────┤
│                                        │
│         Card 3 of 12                  │
│                                        │
│   ┌──────────────────────────────┐   │
│   │                              │   │
│   │  Where does glycolysis       │   │
│   │  take place?                 │   │
│   │                              │   │
│   │  Click or press Space to     │   │
│   │  reveal                      │   │
│   └──────────────────────────────┘   │
│                                        │
│        ← Previous    Next →           │
│                                        │
│  ← → arrows  |  Space flip  |  Esc    │
└────────────────────────────────────────┘
```

### Card Generation
Cards are auto-created from:
- Headings → Question
- Bullets under heading → Answer
- Canvas blocks → Visual answer

### Keyboard Navigation
- **Arrow Right**: Next card (or flip if not flipped)
- **Arrow Left**: Previous card
- **Space**: Flip current card
- **Esc**: Exit study mode

### Progress
- Progress bar at top
- Card counter
- No "correct/incorrect" tracking (this is preview, not quiz)

---

## 🎯 QUIZ MODE

**File**: `components/QuizMode.tsx`

### Purpose
Practice testing with auto-generated MCQs. No quiz builder required.

### Design Principles
- **Auto-generated**: Creates questions from notes
- **Temporary overlay**: Not a separate feature
- **Immediate feedback**: Shows correct answer

### Layout
```
┌────────────────────────────────────────┐
│ × Exit Quiz    Biology    Score: 2/3   │
│ [███████████░░░░░░░░] 75%             │
├────────────────────────────────────────┤
│                                        │
│         Question 3 of 3                │
│                                        │
│   What is composition preferred over?  │
│                                        │
│   ○ Aggregation                       │
│   ✓ Inheritance          ✓            │ ← Selected (correct)
│   ○ Encapsulation                     │
│   ○ Polymorphism                      │
│                                        │
│   ┌────────────────────────────────┐  │
│   │ Explanation:                   │  │
│   │ Composition over Inheritance   │  │
│   │ allows flexible code reuse     │  │
│   └────────────────────────────────┘  │
│                                        │
│          [Next Question →]             │
└────────────────────────────────────────┘
```

### Question Generation
- Uses heading + bullets to create MCQs
- Generates plausible distractors
- Includes explanations

### Flow
1. User clicks "Quiz Mode" demo button
2. Full-screen overlay appears
3. User selects answer
4. Clicks "Submit"
5. Sees correct/incorrect + explanation
6. Clicks "Next"
7. After all questions → Shows score
8. Option to retry or return to notes

---

## 📊 VISUALIZATION OVERLAY

**File**: `components/VisualizationOverlay.tsx`

### Purpose
Turn structured data in notes into charts. No spreadsheet import needed.

### Design Principles
- **Inline creation**: Highlight data, convert
- **Temporary view**: Not permanently embedded
- **Multiple formats**: Bar, pie, table

### Layout
```
┌────────────────────────────────────────┐
│  Revenue Analysis   📊 🥧 📋        × │
├────────────────────────────────────────┤
│                                        │
│   Q1 Revenue          45000           │
│   ████████████████░░░░                │
│                                        │
│   Q2 Revenue          52000           │
│   ███████████████████░                │
│                                        │
│   Q3 Revenue          48000           │
│   █████████████████░░░                │
│                                        │
│   Q4 Revenue          61000           │
│   ████████████████████                │
│                                        │
├────────────────────────────────────────┤
│  Data visualization • Close to return  │
└────────────────────────────────────────┘
```

### View Types

#### Bar Chart
- Horizontal bars
- Value labels on right
- Responsive widths

#### Pie Chart
- SVG-based donut chart
- Legend with percentages
- Color-coded segments

#### Table View
- Clean spreadsheet layout
- Value + Percentage columns
- Total row at bottom

### Interaction
1. User highlights data in notes (future feature)
2. Clicks "Visualize" (future)
3. Overlay appears with bar chart
4. User switches between bar/pie/table
5. Clicks × → Returns to notes
6. Notes unchanged (chart not embedded)

---

## ⚙️ SETTINGS PANEL

**File**: `components/SettingsPanel.tsx`

### Purpose
Configuration that's out of the way until needed.

### Design Principles
- **Hidden by default**: Not visible during daily use
- **Quick access**: Slide-in panel
- **Essential only**: No overwhelming options

### Layout
```
┌─────────────────────────────────────────┐
│                               ⚙️ Settings × │
├─────────────────────────────────────────┤
│  Sync & Storage                         │
│                                         │
│  ☁️ Google Drive         [Connected]   │
│  💾 Local Only                          │
│  🗄️ WebDAV                              │
│                                         │
│  What to Sync                           │
│                                         │
│  ☑️ Notes & Pages                       │
│  ☑️ Canvas Sketches                     │
│  ☑️ PDF Annotations                     │
│  ☐ Study Progress                       │
│                                         │
│  Appearance                             │
│                                         │
│  ☑️ Dark Mode                           │
│                                         │
├─────────────────────────────────────────┤
│  Version 1.0.0 • Auto-save              │
└─────────────────────────────────────────┘
```

### Categories

#### Sync & Storage
- Choose provider: Google Drive, Local, WebDAV
- Connection status
- One-click setup

#### What to Sync
- Granular control over data types
- Notes (always on)
- Canvas, PDFs, study data (optional)

#### Appearance
- Dark mode toggle
- Font size (future)
- Language (future)

### Access
- Hover top-right on home screen
- Settings icon appears
- Click → Panel slides in from right

---

## 👥 COLLABORATION (Subtle Presence)

**Implementation**: Integrated into `PageWorkspace.tsx`

### Design Principles
- **Invisible until relevant**: No permanent presence UI
- **Non-intrusive**: No chat, no notifications
- **Contextual**: Only shows when someone is actively editing

### Visual Indicators

#### Avatars in Header
- Small circles (24px)
- Initials shown
- Color-coded per user
- Appears in workspace header

#### Editing Indicator
- Thin colored line on left of block being edited
- Color matches user's avatar
- Disappears when user stops typing

### What It's NOT
- Not a chat system
- Not a notification center
- Not a presence bar
- Not Figma-style cursors everywhere

### Philosophy
Collaboration should feel like working in the same room, not like being watched.

---

## 🎨 DESIGN TOKENS

### Colors

#### Neutrals (Primary UI)
- `neutral-50`: Background light
- `neutral-100`: Subtle hover states
- `neutral-500`: Secondary text
- `neutral-900`: Primary text (dark mode)
- `neutral-950`: Background dark

#### Accent Colors
- **Blue** (`blue-600`): Primary actions, interactive
- **Green** (`green-600`): Success, completed
- **Amber** (`amber-500`): Attention, focus
- **Red** (`red-600`): Destructive actions

### Typography
- **Headings**: Light weight (300-400)
- **Body**: Regular (400)
- **UI**: Medium (500)
- Sizes: Restrained, hierarchical

### Spacing
- Generous whitespace
- 12px, 16px, 24px, 32px rhythm
- Cards: 16px-24px padding

### Transitions
- **Fast**: 150ms for interactions
- **Medium**: 300ms for overlays
- **Ease-out**: For natural feel

---

## 🚀 USAGE SCENARIOS

### Scenario 1: Student in Lecture
1. Opens "Biology" from Focus Now
2. Types bullet notes as professor speaks
3. Sketches diagram → Canvas expands
4. Highlight in textbook → PDF panel, extract text
5. Lecture ends → Clicks "Study" → 12 flashcards ready

**Result**: Zero friction from capture to review.

### Scenario 2: Designer Brainstorming
1. Creates new page "Brand Concepts"
2. Bullets for ideas
3. Canvas for quick logo sketches (multiple)
4. Tasks for follow-ups
5. Never leaves one surface

**Result**: Visual + text thinking in harmony.

### Scenario 3: Business Meeting
1. Opens "Client Sync" page
2. Takes notes with action items (tasks)
3. Budget numbers → Highlight → Visualize
4. Shares link with team
5. Collaborators see subtle presence

**Result**: Meeting notes that are instantly useful.

---

## 🔑 KEY DESIGN DECISIONS

### Why No Sidebar?
Sidebars create navigation overhead. Users spend time managing structure instead of working. The home screen provides all needed navigation.

### Why Overlays?
Features appear when needed, disappear when done. No permanent real estate cost. Users stay in flow state.

### Why Auto-Generation?
Manual setup creates friction. Auto-generating flashcards and quizzes from notes means zero maintenance.

### Why No Tags/Folders?
Organization is work. The relevance algorithm handles discoverability without user effort.

### Why Single Surface?
Context switching kills productivity. One workspace with inline everything keeps users focused.

---

## 📏 CONSTRAINTS & LIMITATIONS

This is a **UI mockup**, not a production app. Missing:

- Real data persistence
- Backend sync logic
- Full PDF renderer
- Canvas save/load
- Search functionality
- Keyboard shortcut system
- Mobile responsive design
- Accessibility features (partial)
- Performance optimization

These would be required for a real implementation.

---

## 🎓 INSPIRATION SOURCES

- **Logseq**: Outline flow, no hierarchy
- **Zettlr**: Clean writing experience
- **ToToDo**: Radical simplicity
- **Linear**: Fast, keyboard-first
- **Superhuman**: Invisible features

## ❌ ANTI-PATTERNS AVOIDED

- Notion's endless configuration
- ClickUp's feature bloat
- Obsidian's visible file system
- Evernote's notebook hierarchy
- Roam's steep learning curve

---

**Philosophy**: The best UI is no UI. The best feature is invisible. The best organization is none.
