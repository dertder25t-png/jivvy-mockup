"use client";

import { BookOpen, Briefcase, Calendar, CheckSquare, ClipboardList, FileText, History, Rocket, LayoutGrid, List, Plus, Pin, MoreHorizontal, Settings2, Check, Flag, Bell, MoreVertical, ChevronDown, Clock, Activity, PanelLeft, Trello, Search, ChevronRight, UserPlus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface RelevantItem {
  id: string;
  type: "lecture" | "project" | "meeting" | "study" | "task" | "page";
  title: string;
  subtitle?: string;
  icon: any;
  context?: string;
  progress?: number; // 0 to 100
  completed?: boolean;
  color?: string; // Tailwind text color class
  projectTitle?: string; // For tasks
  subItems?: RelevantItem[];
}

type CreatedKind = "task" | "page" | "project";
interface CreatedItem {
  id: string;
  kind: CreatedKind;
  title: string;
  ts: number;
  parentId?: string; // Added for sub-tasks
}

function InlineRow({
  item,
  onClick,
  onToggleComplete,
  onAddSubTask
}: {
  item: RelevantItem;
  onClick: () => void;
  onToggleComplete: (id: string) => void;
  onAddSubTask?: (id: string) => void;
}) {
  const Icon = item.icon;
  const isTask = item.type === "task";

  // Cool date color logic
  const getDateColor = (dateText: string) => {
    const lower = dateText.toLowerCase();
    if (lower.includes("today")) return "text-red-600 bg-red-50";
    if (lower.includes("tomorrow")) return "text-orange-600 bg-orange-50";
    if (lower.includes("jan") || lower.includes("feb") || lower.includes("mar")) return "text-blue-600 bg-emerald-50";
    return "text-purple-600 bg-purple-50";
  };

  return (
    <div className="flex flex-col border-b border-neutral-100 last:border-b-0 group/row">
      <div
        onClick={() => {
          if (isTask) onToggleComplete(item.id);
          else onClick();
        }}
        className={cn(
          "relative flex items-center h-[72px] px-5 hover:bg-neutral-50/50 cursor-pointer transition-all duration-300",
          item.completed && "opacity-40"
        )}
      >
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {isTask ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(item.id);
              }}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                item.completed
                  ? "bg-neutral-950 border-neutral-950 shadow-lg shadow-neutral-200"
                  : "border-neutral-300 hover:border-neutral-950 hover:shadow-md"
              )}
            >
              <Check className={cn("w-4 h-4 text-white transition-opacity", item.completed ? "opacity-100" : "opacity-0")} />
            </button>
          ) : item.type === "project" ? (
            <div className={cn(
              "w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 shadow-sm",
              item.color && item.color.replace('text-', 'bg-').replace('-600', '-100')
            )}>
              <span className={cn(
                "text-lg leading-none font-black",
                item.color || "text-neutral-500"
              )}>@</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-4 h-4 text-neutral-600" strokeWidth={2.5} />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[16px] truncate font-black tracking-tight transition-all",
                isTask ? "text-neutral-900" : "text-black",
                item.completed && "line-through text-neutral-400"
              )}>
                {item.title}
              </span>
              {isTask && item.projectTitle && (
                <span className={cn(
                  "text-[10px] px-2.5 py-0.5 rounded-lg font-black tracking-wider shrink-0 uppercase border-2",
                  item.color
                    ? `${item.color.replace('text-', 'bg-').replace('-600', '-50')} ${item.color} ${item.color.replace('text-', 'border-').replace('-600', '/10')}`
                    : "bg-neutral-50 text-neutral-400 border-neutral-200"
                )}>
                  # {item.projectTitle}
                </span>
              )}
            </div>
            {item.subtitle && (
              <div className="flex items-center gap-2.5 mt-1">
                <span className={cn(
                  "text-[11px] px-2 py-0.5 rounded-md font-black uppercase tracking-tight shadow-sm border",
                  getDateColor(item.subtitle),
                  getDateColor(item.subtitle).includes("red") ? "border-red-100" : getDateColor(item.subtitle).includes("orange") ? "border-orange-100" : "border-emerald-100"
                )}>
                  {item.subtitle}
                </span>
                {item.context && (
                  <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-200" />
                    {item.context}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pull-out Action Sidebar Concept */}
        <div className="flex items-center gap-0 shrink-0 h-full relative">
          <div className="flex items-center bg-white border-2 border-neutral-200 rounded-xl overflow-hidden shadow-xl transition-all duration-500 transform translate-x-12 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 absolute right-2 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); if (onAddSubTask) onAddSubTask(item.id); }}
              className="p-2 hover:bg-neutral-50 text-neutral-500 hover:text-black border-r-2 border-neutral-100 transition-colors group/btn"
              title="Sub-task"
            >
              <Layers className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
            <button className="p-2 hover:bg-neutral-50 text-neutral-500 hover:text-black border-r-2 border-neutral-100 transition-colors group/btn" title="Assign">
              <UserPlus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
            <button className="p-2 hover:bg-neutral-50 text-neutral-500 hover:text-black transition-colors group/btn" title="More">
              <MoreVertical className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
          <div className="w-10 h-10 flex items-center justify-center text-neutral-300 group-hover/row:opacity-0 transition-opacity">
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Sub-pages Visual Visualization */}
      {isTask && item.subItems && item.subItems.some(x => x.type === "page") && (
        <div className="flex flex-wrap gap-2 px-16 pb-4">
          {item.subItems.filter(x => x.type === "page").map(page => (
            <button
              key={page.id}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border-2 border-neutral-100 rounded-xl hover:border-neutral-950 hover:bg-white transition-all group/page shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400 group-hover/page:text-neutral-950" />
              <span className="text-[12px] font-black text-neutral-600 group-hover/page:text-neutral-950">{page.title}</span>
              <ChevronRight className="w-3 h-3 text-neutral-300 group-hover/page:text-neutral-950" />
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar (Project Visuals) */}
      {!isTask && item.type === "project" && (
        <div className="mx-5 h-[2.5px] bg-neutral-100 overflow-hidden rounded-full mb-1">
          <div
            className={cn("h-full transition-all duration-700 ease-out", item.color ? item.color.replace('text-', 'bg-') : "bg-neutral-950")}
            style={{ width: `${item.progress || 30}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function HomeScreen({
  onOpenPage,
  externalFilter,
  onToggleSidebar,
  isSidebarVisible
}: {
  onOpenPage: (id: string) => void;
  externalFilter?: string;
  onToggleSidebar?: () => void;
  isSidebarVisible?: boolean;
}) {
  const [displayMode, setDisplayMode] = useState<"list" | "board" | "calendar">("list");
  const [query, setQuery] = useState("");
  const [description, setDescription] = useState("");
  const [createdItems, setCreatedItems] = useState<CreatedItem[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [addingSubTaskId, setAddingSubTaskId] = useState<string | null>(null);
  const [subTaskQuery, setSubTaskQuery] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("createdItems");
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setCreatedItems(arr);

        const rawCompleted = window.localStorage.getItem("completedIds");
        if (rawCompleted) setCompletedIds(new Set(JSON.parse(rawCompleted)));
      } catch { /* ignore */ }
    }
  }, []);

  const handleToggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("completedIds", JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };


  const today_val: RelevantItem[] = useMemo(() => {
    // Base items
    const base: RelevantItem[] = [
      {
        id: "brand-identity",
        type: "project",
        title: "Brand Identity Project",
        subtitle: "2 tasks",
        context: "Active",
        icon: Briefcase,
        progress: 65,
        completed: completedIds.has("brand-identity"),
        color: "text-purple-600",
      },
      {
        id: "horizon-sync",
        type: "meeting",
        title: "Client Sync: Horizon Corp",
        subtitle: "Today 2:00 PM",
        context: "Zoom",
        icon: Calendar,
        completed: completedIds.has("horizon-sync"),
        color: "text-blue-600",
      },
      {
        id: "goals-review",
        type: "task",
        title: "Quarterly Goals Review",
        subtitle: "Tomorrow",
        context: "Brand Identity",
        icon: ClipboardList,
        completed: completedIds.has("goals-review"),
        projectTitle: "Brand Identity Project",
        color: "text-purple-600",
        subItems: [
          { id: "sp-1", type: "page", title: "Review Notes", icon: FileText },
          { id: "sp-2", type: "page", title: "Metrics Deck", icon: FileText }
        ]
      },
      {
        id: "mock-task-1",
        type: "task",
        title: "Develop high-fidelity prototypes",
        subtitle: "Jan 25",
        context: "Design System",
        icon: CheckSquare,
        completed: completedIds.has("mock-task-1"),
      },
    ];

    // Combine with created items
    const allCreated = createdItems.map(x => ({
      id: x.id,
      type: (x.kind === "page" ? "page" : x.kind === "task" ? "task" : "project") as any,
      title: x.title,
      subtitle: x.kind === "task" ? "Task" : x.kind === "project" ? "Project" : "Page",
      icon: x.kind === "task" ? ClipboardList : x.kind === "project" ? Briefcase : FileText,
      progress: x.kind === "project" ? 25 : undefined,
      completed: completedIds.has(x.id),
      parentId: (x as any).parentId,
      color: x.kind === "project" ? "text-emerald-600" : undefined,
      subItems: [] as RelevantItem[]
    }));

    // Nest sub-items
    const parents = [...base, ...allCreated.filter(x => !x.parentId)] as (RelevantItem & { parentId?: string })[];
    const children = allCreated.filter(x => x.parentId) as (RelevantItem & { parentId?: string })[];

    return parents.map(p => ({
      ...p,
      subItems: [...(p.subItems || []), ...children.filter(c => c.parentId === p.id)]
    }));
  }, [createdItems, completedIds]);

  const visibleItems = useMemo(() => {
    const filter = externalFilter || "Recent";
    if (filter === "Pinned") return today_val.filter(x => !x.completed).slice(0, 1);
    if (filter === "Scheduled") return today_val.filter(x => !x.completed).slice(1, 2);
    if (filter === "Inbox") return today_val.filter(x => !x.subtitle?.toLowerCase().includes("today") && !x.subtitle?.toLowerCase().includes("tomorrow"));
    return today_val;
  }, [externalFilter, today_val]);

  // NLP Parsing logic
  const detectNLP = (text: string) => {
    let p: 1 | 2 | 3 | 4 = 4;
    let d: string | null = null;
    let proj: string = "inbox";
    let projColor: string | undefined = undefined;
    let isProjectCreation = false;
    let isDelegated = false;

    const lower = text.toLowerCase();

    // Priority
    if (lower.includes("high priority") || lower.includes("p1") || lower.includes("urgent")) p = 1;
    else if (lower.includes("mid priority") || lower.includes("p2")) p = 2;

    // Due Date Advanced (Regex)
    const dateRegex = /(?:@|by|on)?\s*(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}|today|tomorrow|next week|next month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
    const dateMatch = lower.match(dateRegex);
    if (dateMatch) {
      d = dateMatch[1].charAt(0).toUpperCase() + dateMatch[1].slice(1);
    }

    // Project Creation Detection
    if (lower.startsWith("new project called ") || lower.startsWith("create project ")) {
      isProjectCreation = true;
    }

    // Auto-Delegation to Existing Projects
    const allProjects = today_val.filter(x => x.type === "project");
    const matchedProject = allProjects.find(p => lower.includes(p.title.toLowerCase()) || lower.includes(`#${p.title.toLowerCase().replace(/\s+/g, "").replace("project", "")}`));

    if (matchedProject) {
      proj = matchedProject.title;
      projColor = matchedProject.color;
      isDelegated = true;
    } else {
      const projMatch = text.match(/#(\w+)/);
      if (projMatch) {
        proj = projMatch[1];
        const partial = allProjects.find(p => p.title.toLowerCase().includes(proj.toLowerCase()));
        if (partial) {
          proj = partial.title;
          projColor = partial.color;
        }
      }
    }

    // Intent Color
    let intentColor = "border-neutral-200 shadow-sm";
    if (isProjectCreation) intentColor = "border-emerald-500 shadow-emerald-100";
    else if (isDelegated) {
      const col = projColor || "text-purple-600";
      intentColor = `${col.replace('text-', 'border-')} shadow-purple-50`;
    }
    else if (text.length > 0) intentColor = "border-neutral-950 shadow-neutral-100";

    return { p, d, proj, projColor, isProjectCreation, isDelegated, intentColor };
  };

  const parsed = useMemo(() => detectNLP(query), [query, today_val]);

  // Sync state with NLP unless manually set
  useEffect(() => {
    if (parsed.p !== 4) setPriority(parsed.p);
    if (parsed.d) setDueDate(parsed.d);
  }, [parsed.p, parsed.d]);

  const handleCreateSubTask = (parentId: string) => {
    if (!subTaskQuery.trim()) return;
    const id = `sub-${Date.now()}`;
    const entry: CreatedItem = { id, kind: "task", title: subTaskQuery, ts: Date.now(), parentId };
    setCreatedItems((prev) => [entry, ...prev]);
    setSubTaskQuery("");
    setAddingSubTaskId(null);
  };

  const parseAndCreate = () => {
    const raw = query.trim();
    if (!raw) return;

    let kind: CreatedKind = "task";
    let title = raw;

    if (parsed.isProjectCreation) {
      kind = "project";
      title = raw.replace(/new project called /i, "").replace(/create project /i, "");
    } else if (raw.startsWith("/page ")) {
      kind = "page";
      title = raw.slice(6);
    } else if (raw.includes("@") && (kind as string) !== "project") {
      const parts = raw.split("@");
      const potentialDate = parts[1]?.toLowerCase().trim();
      if (potentialDate && !["today", "tomorrow", "next week", "next month", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(potentialDate)) {
        title = parts[0].trim();
        kind = "project";
      }
    }

    const id = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const entry: CreatedItem = { id, kind, title, ts: Date.now() };
    setCreatedItems((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("createdItems", JSON.stringify(next));
      }
      return next;
    });

    if (kind === "page" || kind === "project") onOpenPage(id);
    setQuery("");
    setDescription("");
    setPriority(4);
    setDueDate(null);
    setIsAddingTask(false);
  };

  const toggleDisplayMode = () => {
    const modes: ("list" | "board" | "calendar")[] = ["list", "board", "calendar"];
    const currentIndex = modes.indexOf(displayMode as any);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDisplayMode(modes[nextIndex]);
  };

  return (
    <div className="flex flex-col h-full bg-white selection:bg-neutral-950 selection:text-white">
      {/* Header bar */}
      <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-[17px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            {externalFilter === "Recent" && <Calendar className="w-5 h-5 text-neutral-500" />}
            {externalFilter === "Inbox" && <LayoutGrid className="w-5 h-5 text-neutral-500" />}
            {externalFilter || "Inbox"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDisplayMode}
            className="h-8 gap-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-3 font-medium text-[13px] rounded-lg transition-all"
          >
            {displayMode === "list" && <List className="w-4 h-4" />}
            {displayMode === "board" && <Trello className="w-4 h-4" />}
            <span className="capitalize">{displayMode}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-900 rounded-lg">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-32 pt-8 scroll-smooth">

        {/* Compact Quick Add */}
        <div className="mb-8 group">
          {!isAddingTask ? (
            <div
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-3 text-neutral-500 cursor-text hover:text-neutral-900 transition-colors py-2"
            >
              <Plus className="w-5 h-5 text-red-500" />
              <span className="text-[14px] font-medium">Add task</span>
            </div>
          ) : (
            <div className="border rounded-xl shadow-lg bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
              <div className="p-3">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      parseAndCreate();
                    }
                    if (e.key === "Escape") setIsAddingTask(false);
                  }}
                  placeholder="What needs to be done?"
                  className="w-full text-[15px] font-medium placeholder:text-neutral-400 border-none focus:ring-0 p-0 text-neutral-900 mb-1"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  rows={1}
                  className="w-full text-[13px] text-neutral-600 placeholder:text-neutral-300 border-none focus:ring-0 p-0 resize-none min-h-[20px]"
                />
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-neutral-500 text-[12px] hover:bg-neutral-100 rounded border border-neutral-200">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> {dueDate || "Today"}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-neutral-500 text-[12px] hover:bg-neutral-100 rounded border border-neutral-200">
                      <Flag className="w-3.5 h-3.5 mr-1.5" /> Priority
                    </Button>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingTask(false)} className="h-7 text-neutral-500 text-[12px]">Cancel</Button>
                    <Button
                      size="sm"
                      onClick={parseAndCreate}
                      disabled={!query.trim()}
                      className={cn("h-7 text-[12px] font-bold px-3 transition-all", query.trim() ? "bg-red-500 hover:bg-red-600 text-white" : "bg-red-200 text-white/80")}
                    >
                      Add task
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action List Section */}
        <div className="max-w-4xl mx-auto">
          {displayMode === "list" ? (
            <div className="flex flex-col bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              {visibleItems.map((item) => (
                <div key={item.id}>
                  <InlineRow
                    item={item}
                    onClick={() => onOpenPage(item.id)}
                    onToggleComplete={handleToggleComplete}
                    onAddSubTask={(id) => setAddingSubTaskId(id)}
                  />

                  {/* Sub-items rendering */}
                  {item.subItems && item.subItems.filter(x => x.type === "task").length > 0 && (
                    <div className="pl-14 bg-neutral-50/20 divide-y divide-neutral-100 border-l-2 border-neutral-200 ml-8">
                      {item.subItems.filter(x => x.type === "task").map(sub => (
                        <InlineRow
                          key={sub.id}
                          item={sub}
                          onClick={() => onOpenPage(sub.id)}
                          onToggleComplete={handleToggleComplete}
                        />
                      ))}
                    </div>
                  )}

                  {/* Simplified Sub-task Add Input */}
                  {addingSubTaskId === item.id && (
                    <div className="pl-16 py-3 pr-5 bg-white border-l-4 border-[#db4c3f] flex items-center gap-3 animate-in slide-in-from-left-2">
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-200 shrink-0" />
                      <input
                        autoFocus
                        value={subTaskQuery}
                        onChange={(e) => setSubTaskQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateSubTask(item.id);
                          if (e.key === "Escape") setAddingSubTaskId(null);
                        }}
                        placeholder="Quickly add a sub-task..."
                        className="flex-1 border-none focus:ring-0 text-[14px] font-bold text-neutral-900 placeholder:text-neutral-300 p-0"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleCreateSubTask(item.id)} className="h-7 bg-neutral-950 text-white font-bold text-[11px] px-3 rounded-lg">Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingSubTaskId(null)} className="h-7 text-neutral-400 font-bold text-[11px]">Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : displayMode === "calendar" ? (
            <div className="p-24 border-3 border-dashed border-neutral-200 rounded-[32px] text-center bg-neutral-50/20">
              <Calendar className="w-20 h-20 mx-auto mb-8 text-neutral-100" strokeWidth={0.5} />
              <h3 className="text-xl font-black text-neutral-950 mb-3 tracking-tight">Calendar visualization coming soon!</h3>
              <p className="text-[15px] text-neutral-500 max-w-sm mx-auto font-medium">We're engineering a pixel-perfect way for you to command your time.</p>
            </div>
          ) : (
            <div className="flex gap-10 overflow-x-auto pb-12 snap-x scroll-px-8 h-[calc(100vh-280px)] no-scrollbar">
              {["To Do", "In Progress", "Done"].map((col) => (
                <div key={col} className="w-[340px] shrink-0 snap-start">
                  <div className="flex items-center justify-between mb-6 px-3">
                    <h3 className="text-[14px] font-black text-neutral-950 tracking-[0.2em] uppercase">{col}</h3>
                    <span className="text-[12px] font-black bg-neutral-950 text-white px-3 py-1 rounded-full shadow-lg">
                      {visibleItems.length}
                    </span>
                  </div>
                  <div className="space-y-5">
                    {visibleItems.map((item) => (
                      <div
                        key={item.id}
                        className="group p-5 bg-white border-2 border-neutral-200 rounded-[24px] shadow-sm hover:border-neutral-950 hover:shadow-[0_15px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer active:scale-[0.97]"
                        onClick={() => onOpenPage(item.id)}
                      >
                        <div className="flex items-start gap-4">
                          <CheckSquare className="w-6 h-6 text-neutral-200 mt-0.5 group-hover:text-black transition-colors" strokeWidth={1.5} />
                          <p className="text-[16px] font-black text-neutral-950 leading-[1.3] group-hover:tracking-tight transition-all">{item.title}</p>
                        </div>
                        {(item.projectTitle || item.subtitle) && (
                          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 px-1">
                            <span className={cn(
                              "text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2",
                              item.color
                                ? `${item.color.replace('text-', 'bg-').replace('-600', '-50')} ${item.color} ${item.color.replace('text-', 'border-').replace('-600', '/10')}`
                                : "bg-neutral-50 text-neutral-500 border-neutral-100"
                            )}>
                              {item.projectTitle || "Inbox"}
                            </span>
                            {item.subtitle && <span className="text-[11px] font-black text-neutral-300 uppercase tracking-widest">{item.subtitle}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="w-full py-5 border-2 border-dashed border-neutral-200 rounded-[24px] text-[15px] font-black text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 hover:border-solid hover:border-neutral-950 transition-all flex items-center justify-center gap-3 group active:scale-95">
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} /> Add Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleItems.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-neutral-200 animate-in fade-in zoom-in-90 duration-1000">
              <div className="relative mb-8">
                <Search className="w-24 h-24 opacity-5 stroke-[0.5]" />
                <Activity className="w-10 h-10 absolute -top-2 -right-2 text-neutral-950/10 animate-pulse" />
              </div>
              <p className="text-[20px] font-black text-neutral-950 tracking-tight">Focus on what matters.</p>
              <p className="text-[15px] text-neutral-400 mt-2 font-bold tracking-tight">Your task list is empty. Take a deep breath.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
