# Jivvy UI Mockup

A high-fidelity, interactive UI mockup following a "zero-friction" productivity app design philosophy. Built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## 🎯 Design Philosophy

This mockup demonstrates an app that **disappears during work**:

- ✅ No permanent sidebars or dashboards
- ✅ No cluttered interfaces
- ✅ UI appears only when needed
- ✅ Flow over features
- ✅ Zero maintenance (no folders, tags, or databases)
- ✅ Simple, fast, invisible

Inspired by: **Logseq** (flow), **Zettlr** (invisibility), **ToToDo** (simplicity)

## 📦 Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **lucide-react** icons

## 🚀 Quick Start

```bash
# Navigate to project
cd jivvy-mockup

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Screens & Features

### 1. **Home Screen**
- Netflix-style relevance feed
- Shows only what's relevant **right now**
- Sections: Focus Now / Today / Upcoming
- Quiet, focused, self-maintaining

### 2. **Page/Workspace Screen**
- Free-flow bullet notes
- Inline tasks with checkboxes
- Inline canvas thumbnails
- Invisible block system
- Subtle collaboration presence

### 3. **PDF Side-Panel**
- Temporary side panel
- Highlight and extract text
- Notes remain the primary workspace

### 4. **Canvas Overlay**
- Fast, disposable sketch capture
- Opens as temporary overlay
- Non-modal experience

### 5. **Study Mode**
- Full-screen flashcard overlay
- Auto-generated from note content
- No decks, no setup

### 6. **Quiz Mode**
- Practice quiz overlay
- Auto-generated MCQs from notes
- No quiz builders or forms

### 7. **Visualization Overlay**
- Convert structured data to charts
- Bar, pie, and table views

### 8. **Settings Panel**
- Hidden by default
- Sync settings (Google Drive, Local, WebDAV)

## 🧠 Core Mental Model

- Everything is a **page**
- Pages contain **atomic blocks** (text, canvas, tasks)
- Users only see **what is relevant right now**

## 🎯 User Flows

### Student Flow
1. Open app → See "Biology - Cell Respiration" in Focus Now
2. Click to open → Take bullet notes
3. Click PDF → Extract highlights
4. Click canvas → Quick sketch
5. Click Study → Instant flashcards

### Business Flow
1. Open "Client Sync" from Today
2. Take meeting notes with tasks
3. Highlight data → Convert to chart

## 🔍 Demo Controls

Bottom-right buttons for testing:
- **Demo: Quiz Mode**
- **Demo: Visualization**

## 📂 Project Structure

```
components/
├── HomeScreen.tsx           # Home relevance feed
├── PageWorkspace.tsx        # Note-taking workspace
├── PDFSidePanel.tsx         # PDF reader
├── CanvasOverlay.tsx        # Drawing canvas
├── StudyMode.tsx            # Flashcard overlay
├── QuizMode.tsx             # Quiz overlay
├── VisualizationOverlay.tsx # Data charts
└── SettingsPanel.tsx        # Settings drawer
```

## 💡 Key Innovations

1. **Relevance-based home** - Not a dashboard
2. **Invisible blocks** - Users never see the block system
3. **Temporary panels** - Everything dismisses cleanly
4. **Auto-generation** - Flashcards/quizzes from content
5. **Single surface** - One workspace, multiple modes

## ❌ What We Avoided

- Permanent sidebars
- Navigation trees
- Feature menus
- Toolbars full of icons
- Notion/ClickUp complexity

---

**Remember**: If the UI feels like work, it has failed. The app should disappear.
