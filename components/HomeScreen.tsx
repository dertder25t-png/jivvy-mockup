"use client";

import { BookOpen, Briefcase, Calendar, CheckSquare, ClipboardList, FileText, History, Rocket, LayoutGrid, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

interface RelevantItem {
  id: string;
  type: "lecture" | "project" | "meeting" | "study" | "task" | "page";
  title: string;
  subtitle?: string;
  icon: any;
  context?: string;
}

type CreatedKind = "task" | "page" | "project";
interface CreatedItem {
  id: string;
  kind: CreatedKind;
  title: string;
  ts: number;
}

export default function HomeScreen({ onOpenPage }: { onOpenPage: (id: string) => void }) {
  // Filter control: Recent | Pinned | Scheduled (persisted locally)
  const [filter, setFilter] = useState<"Recent" | "Pinned" | "Scheduled">("Recent");
  // View mode: List | Grid | Calendar
  const [viewMode, setViewMode] = useState<"list" | "grid" | "calendar">("list");
  // Universal input
  const [query, setQuery] = useState("");
  const [createdItems, setCreatedItems] = useState<CreatedItem[]>([]);
  // Context chips
  const [chips, setChips] = useState<Array<{ id: string; label: string; action: () => void }>>([]);

  // Calendar State: Item ID -> Day Index (0-6) or null (Unscheduled)
  const [itemAssignments, setItemAssignments] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("dashboardFilter") : null;
    if (saved === "Recent" || saved === "Pinned" || saved === "Scheduled") {
      setFilter(saved);
    }
    // Load created items
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("createdItems");
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) {
          setCreatedItems(arr);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dashboardFilter", filter);
    }
  }, [filter]);

  // Resume section: last touched artifacts from local storage
  const [resumeItems, setResumeItems] = useState<RelevantItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("lastOpenedItems");
    if (!raw) return;
    try {
      const parsed: Array<{ id: string; type: RelevantItem["type"]; title: string; subtitle?: string; icon?: string; ts: number }> = JSON.parse(raw);
      // Map to icons by type
      const iconByType: Record<RelevantItem["type"], any> = {
        lecture: Calendar,
        project: Briefcase,
        meeting: Calendar,
        study: BookOpen,
        task: ClipboardList,
        page: FileText,
      };
      // Sort by recency (ts desc) and normalize copy
      const items: RelevantItem[] = parsed
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 3)
        .map((x) => ({
          id: x.id,
          type: x.type,
          title: x.title,
          subtitle: x.subtitle ? x.subtitle : x.type === "study" ? "Study: 12 study cards" : x.type === "project" ? "2 tasks" : "",
          icon: iconByType[x.type],
        }));
      setResumeItems(items);
    } catch {
      // ignore parsing errors
    }
  }, []);

  // Example datasets (neutral copy) + user-created items surfaced as recent
  const createdAsRelevant: RelevantItem[] = createdItems
    .sort((a, b) => b.ts - a.ts)
    .map((x) => ({
      id: x.id,
      type: x.kind === "page" ? "page" : x.kind === "task" ? "task" : "project",
      title: x.title,
      subtitle: x.kind === "task" ? "Task" : x.kind === "project" ? "Project" : "Page",
      icon: x.kind === "task" ? ClipboardList : x.kind === "project" ? Briefcase : FileText,
    }));

  const today: RelevantItem[] = [
    {
      id: "brand-identity",
      type: "project",
      title: "Brand Identity Project",
      subtitle: "2 tasks",
      icon: Briefcase,
    },
    {
      id: "horizon-sync",
      type: "meeting",
      title: "Client Sync: Horizon Corp",
      subtitle: "Meeting Notes • Yesterday",
      icon: Calendar,
      context: "3 action items",
    },
    ...createdAsRelevant,
  ];
  const pinned: RelevantItem[] = [
    {
      id: "bio-respiration",
      type: "study",
      title: "Biology – Cell Respiration",
      subtitle: "Study: 12 study cards",
      icon: BookOpen,
    },
  ];
  const scheduled: RelevantItem[] = [];

  const visibleItems = useMemo(() => {
    switch (filter) {
      case "Pinned":
        return pinned.length > 0 ? pinned : today;
      case "Scheduled":
        return scheduled.length > 0 ? scheduled : today;
      default:
        return today;
    }
  }, [filter]);

  // Initialize Item Assignments for Calendar Demo
  useEffect(() => {
    setItemAssignments((prev) => {
      const next = { ...prev };
      let changed = false;
      visibleItems.forEach((item, idx) => {
        if (next[item.id] === undefined) {
          // 20% chance of being unscheduled for demo
          next[item.id] = Math.random() > 0.8 ? null : idx % 7;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [visibleItems]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number | null) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      setItemAssignments((prev) => ({
        ...prev,
        [itemId]: dayIndex,
      }));
    }
  };

  // Suggestion chips based on time and (optional) current class from localStorage
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const list: Array<{ id: string; label: string; action: () => void }> = [];

    const createAndOpenPage = (title: string) => {
      const id = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const entry: CreatedItem = { id, kind: "page", title, ts: Date.now() };
      setCreatedItems((prev) => {
        const next = [entry, ...prev].slice(0, 50);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("createdItems", JSON.stringify(next));
          // Also add to last opened for Jump-Back tape
          const lastRaw = window.localStorage.getItem("lastOpenedItems");
          const lastArr = lastRaw ? JSON.parse(lastRaw) : [];
          const tapeEntry = { id, type: "study", title, subtitle: "Study: 12 study cards", ts: Date.now() };
          const filtered = Array.isArray(lastArr) ? lastArr.filter((x: any) => x.id !== id) : [];
          window.localStorage.setItem("lastOpenedItems", JSON.stringify([tapeEntry, ...filtered].slice(0, 10)));
        }
        return next;
      });
      onOpenPage(id);
    };

    if (hour >= 6 && hour <= 10) {
      list.push({ id: "daily-plan", label: "Daily Plan", action: () => createAndOpenPage("Daily Plan") });
    }
    if (hour >= 17 && hour <= 21) {
      list.push({ id: "daily-review", label: "Daily Review", action: () => createAndOpenPage("Daily Review") });
    }
    try {
      if (typeof window !== "undefined") {
        const scheduledClass = window.localStorage.getItem("scheduledClass");
        if (scheduledClass) {
          list.push({ id: "class-notes", label: `${scheduledClass} Notes`, action: () => createAndOpenPage(`${scheduledClass} Notes`) });
        } else {
          // Fallback demo chip
          list.push({ id: "bio-notes", label: "Biology 101 Notes", action: () => createAndOpenPage("Biology 101 Notes") });
        }
      }
    } catch {
      // ignore
    }
    setChips(list);
  }, [onOpenPage]);

  const parseAndCreate = () => {
    const raw = query.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    let kind: CreatedKind = "task";
    let title = raw;

    if (lower.startsWith("/project ")) {
      kind = "project";
      title = raw.slice(9);
    } else if (lower.includes("notes")) {
      kind = "page";
    } else if (lower.startsWith("/page ")) {
      kind = "page";
      title = raw.slice(6);
    } else if (lower.startsWith("/task ")) {
      kind = "task";
      title = raw.slice(6);
    }

    const id = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const entry: CreatedItem = { id, kind, title, ts: Date.now() };
    setCreatedItems((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("createdItems", JSON.stringify(next));
        // Add pages/projects to Jump-Back tape immediately
        if (kind === "page" || kind === "project") {
          const lastRaw = window.localStorage.getItem("lastOpenedItems");
          const lastArr = lastRaw ? JSON.parse(lastRaw) : [];
          const tapeEntry = {
            id,
            type: kind === "page" ? "study" : "project",
            title,
            subtitle: kind === "page" ? "Study: 12 study cards" : "2 tasks",
            ts: Date.now(),
          };
          const filtered = Array.isArray(lastArr) ? lastArr.filter((x: any) => x.id !== id) : [];
          window.localStorage.setItem("lastOpenedItems", JSON.stringify([tapeEntry, ...filtered].slice(0, 10)));
        }
      }
      return next;
    });

    // For pages/projects, jump into the workspace for speed
    if (kind === "page" || kind === "project") {
      onOpenPage(id);
    }
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className={`${viewMode === 'calendar' ? 'max-w-[95%]' : 'max-w-3xl'} mx-auto px-8 py-20 transition-all duration-500`}>
        {/* Jump-Back Tape */}
        {resumeItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-neutral-500">
              <History className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Jump Back</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto">
              {resumeItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onOpenPage(item.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs"
                  title={item.title}
                >
                  <item.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-800 dark:text-neutral-200 truncate max-w-[160px]">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Universal Torpedo Input */}
        <div className="mb-6">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  parseAndCreate();
                }
              }}
              placeholder="Type anything… e.g. 'Buy milk', 'Biology 101 Notes', '/project Food Cart'"
              className="h-14 text-xl px-5 rounded-2xl border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 shadow-sm"
            />
            <div className="absolute right-2 top-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={parseAndCreate}
                className="rounded-xl"
              >
                <Rocket className="w-4 h-4 mr-1" />
                Go
              </Button>
            </div>
          </div>
        </div>

        {/* Context Chips */}
        {chips.length > 0 && (
          <div className="mb-12 flex items-center gap-2 flex-wrap">
            {chips.map((chip) => (
              <Button key={chip.id} variant="ghost" size="sm" onClick={chip.action} className="rounded-full border border-neutral-200 dark:border-neutral-800">
                {chip.label}
              </Button>
            ))}
          </div>
        )}

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl text-neutral-400 dark:text-neutral-600 font-light">Good evening, Alex</h1>
        </div>

        {/* Today Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-neutral-500" />
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {filter === "Recent" ? "Recent" : filter === "Pinned" ? "Pinned" : "Scheduled"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1 mr-2">
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("list")} aria-label="List view" className={viewMode === "list" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("grid")} aria-label="Grid view" className={viewMode === "grid" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("calendar")} aria-label="Calendar view" className={viewMode === "calendar" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}>
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              <Button variant={filter === "Recent" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Recent")}>Recent</Button>
              <Button variant={filter === "Pinned" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Pinned")}>Pinned</Button>
              <Button variant={filter === "Scheduled" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Scheduled")}>Scheduled</Button>
            </div>
          </div>

          {viewMode === "calendar" ? (
            <div className="space-y-6">
              <div className="overflow-x-auto pb-4">
                <div className="grid grid-cols-7 gap-2 min-w-[1000px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div
                      key={day}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, i)}
                      className="min-h-[300px] p-2 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-900"
                    >
                      <div className="text-xs font-medium text-neutral-400 mb-3 text-center sticky top-0 bg-transparent uppercase tracking-widest">{day}</div>
                      {visibleItems
                        .filter((item) => itemAssignments[item.id] === i)
                        .map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onClick={() => onOpenPage(item.id)}
                            className="mb-2 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm text-xs cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:cursor-grabbing group"
                          >
                            <div className="font-medium truncate text-neutral-900 dark:text-neutral-100 mb-1">{item.title}</div>
                            <div className="text-[10px] text-neutral-500 truncate">{item.subtitle}</div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unscheduled Items Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
                className="border-t-2 border-dashed border-neutral-200 dark:border-neutral-800 pt-6 mt-4"
              >
                <div className="flex items-center gap-2 mb-4 text-neutral-500 px-2">
                  <ClipboardList className="w-4 h-4" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">Unscheduled</h3>
                </div>
                <div className="flex flex-wrap gap-3 min-h-[100px] p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/30 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900/50">
                  {visibleItems
                    .filter((item) => itemAssignments[item.id] === null)
                    .map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onClick={() => onOpenPage(item.id)}
                        className="w-48 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm text-xs cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:cursor-grabbing"
                      >
                        <div className="font-medium truncate text-neutral-900 dark:text-neutral-100 mb-1">{item.title}</div>
                        <div className="text-[10px] text-neutral-500 truncate">{item.subtitle}</div>
                      </div>
                    ))}
                  {visibleItems.filter((item) => itemAssignments[item.id] === null).length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 italic text-sm py-8">
                      Drop unscheduled items here
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
              {visibleItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => onOpenPage(item.id)}
                  className={`cursor-pointer transition-all border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 ${viewMode === 'grid' ? 'p-4 flex flex-col items-start h-full' : 'p-6 flex items-start gap-4'}`}
                >
                  <div className={`rounded-xl bg-neutral-100 dark:bg-neutral-900 ${viewMode === 'grid' ? 'p-2 mb-3' : 'p-2.5'}`}>
                    <item.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">
                      {item.type}
                    </div>
                    <h3 className={`font-medium text-neutral-900 dark:text-neutral-100 ${viewMode === 'grid' ? 'text-base mb-1 line-clamp-2' : 'text-lg mb-2'}`}>
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className={`text-neutral-600 dark:text-neutral-400 ${viewMode === 'grid' ? 'text-sm line-clamp-2' : 'text-base'}`}>{item.subtitle}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
