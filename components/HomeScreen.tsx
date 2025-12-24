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
    {
      id: "unscheduled-demo",
      type: "task",
      title: "Quarterly Goals Review",
      subtitle: "To be scheduled",
      icon: ClipboardList,
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
          if (item.id === "unscheduled-demo") {
            next[item.id] = null;
          } else {
            // 20% chance of being unscheduled for demo
            next[item.id] = Math.random() > 0.8 ? null : idx % 7;
          }
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-[98%] mx-auto px-8 py-10 transition-all duration-500">
        {/* Header: Greeting + Jump Back */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10">
          <div>
            <h1 className="text-4xl text-neutral-900 dark:text-neutral-100 font-medium tracking-tight">Good evening, Alex</h1>
          </div>

          {resumeItems.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <History className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Jump Back</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {resumeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenPage(item.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 hover:border-neutral-500 dark:hover:border-neutral-500 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                    title={item.title}
                  >
                    <item.icon className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-sm font-bold text-black dark:text-white">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
              className="h-14 text-xl px-5 rounded-2xl border-2 border-neutral-500 dark:border-neutral-600 bg-white dark:bg-neutral-900 shadow-xl focus:ring-4 focus:ring-blue-500/30 transition-all placeholder:text-neutral-500"
            />
            <div className="absolute right-2 top-2">
              <Button
                size="sm"
                onClick={parseAndCreate}
                className="h-10 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg font-bold"
              >
                <Rocket className="w-4 h-4 mr-1" />
                Go
              </Button>
            </div>
          </div>
        </div>

        {/* Today Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-lg font-black text-black dark:text-white uppercase tracking-tighter">
                {filter === "Recent" ? "Recent" : filter === "Pinned" ? "Pinned" : "Scheduled"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-neutral-300 dark:bg-neutral-800 rounded-xl p-1 mr-4 border-2 border-neutral-400 dark:border-neutral-600 shadow-sm">
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("list")} aria-label="List view" className={viewMode === "list" ? "bg-white dark:bg-neutral-700 shadow-inner text-black dark:text-white font-bold" : "text-neutral-700 dark:text-neutral-300 hover:text-black"}>
                  <List className="w-5 h-5 stroke-[2.5]" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("grid")} aria-label="Grid view" className={viewMode === "grid" ? "bg-white dark:bg-neutral-700 shadow-inner text-black dark:text-white font-bold" : "text-neutral-700 dark:text-neutral-300 hover:text-black"}>
                  <LayoutGrid className="w-5 h-5 stroke-[2.5]" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setViewMode("calendar")} aria-label="Calendar view" className={viewMode === "calendar" ? "bg-white dark:bg-neutral-700 shadow-inner text-black dark:text-white font-bold" : "text-neutral-700 dark:text-neutral-300 hover:text-black"}>
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant={filter === "Recent" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Recent")} className={`font-black uppercase tracking-widest text-xs border ${filter === 'Recent' ? 'border-black bg-black text-white' : 'border-neutral-400'}`}>Recent</Button>
                <Button variant={filter === "Pinned" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Pinned")} className={`font-black uppercase tracking-widest text-xs border ${filter === 'Pinned' ? 'border-black bg-black text-white' : 'border-neutral-400'}`}>Pinned</Button>
                <Button variant={filter === "Scheduled" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("Scheduled")} className={`font-black uppercase tracking-widest text-xs border ${filter === 'Scheduled' ? 'border-black bg-black text-white' : 'border-neutral-400'}`}>Scheduled</Button>
                <div className="w-px h-4 bg-neutral-300 mx-2" />
                <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-xs text-blue-700 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-900/50 hover:bg-blue-600 hover:text-white transition-all ml-2 shadow-sm">View All</Button>
              </div>
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
                      className="min-h-[450px] p-0 border-2 border-neutral-400 dark:border-neutral-600 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl overflow-hidden transition-all hover:border-black dark:hover:border-white"
                    >
                      <div className="text-sm font-black text-black dark:text-white text-center bg-neutral-100 dark:bg-neutral-800 py-3 border-b-2 border-neutral-400 dark:border-neutral-600 uppercase tracking-tighter sticky top-0 z-10">{day}</div>
                      <div className="p-2 space-y-2">
                        {visibleItems
                          .filter((item) => itemAssignments[item.id] === i)
                          .map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, item.id)}
                              onClick={() => onOpenPage(item.id)}
                              className="mb-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border-2 border-neutral-400 dark:border-neutral-600 shadow-sm text-xs cursor-pointer hover:border-black dark:hover:border-white hover:shadow-md transition-all active:cursor-grabbing group"
                            >
                              <div className="font-black truncate text-black dark:text-white mb-1.5 text-sm">{item.title}</div>
                              <div className="text-[11px] text-neutral-800 dark:text-neutral-200 font-bold truncate">{item.subtitle}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
                className="border-t-4 border-dashed border-neutral-400 dark:border-neutral-600 pt-8 mt-10"
              >
                <div className="flex items-center gap-3 mb-6 text-black dark:text-white px-2">
                  <ClipboardList className="w-6 h-6 stroke-[3]" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Unscheduled</h3>
                </div>
                <div className="flex flex-wrap gap-4 min-h-[120px] p-6 rounded-2xl bg-neutral-200 dark:bg-neutral-800/50 border-2 border-neutral-300 dark:border-neutral-700 transition-colors">
                  {visibleItems
                    .filter((item) => itemAssignments[item.id] === null)
                    .map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onClick={() => onOpenPage(item.id)}
                        className="w-56 p-4 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-400 dark:border-neutral-600 shadow-md text-xs cursor-pointer hover:border-black dark:hover:border-white transition-all active:cursor-grabbing"
                      >
                        <div className="font-black truncate text-black dark:text-white mb-1.5 text-sm">{item.title}</div>
                        <div className="text-[11px] text-neutral-800 dark:text-neutral-200 font-bold truncate">{item.subtitle}</div>
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
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
              {visibleItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => onOpenPage(item.id)}
                  className={`cursor-pointer transition-all border-2 border-neutral-400 dark:border-neutral-600 hover:border-black dark:hover:border-white shadow-lg hover:shadow-2xl ${viewMode === 'grid' ? 'p-8 flex flex-col items-start h-full' : 'p-8 flex items-start gap-6'}`}
                >
                  <div className={`rounded-2xl bg-black dark:bg-white border-2 border-black dark:border-white ${viewMode === 'grid' ? 'p-4 mb-6' : 'p-4'}`}>
                    <item.icon className="w-7 h-7 text-white dark:text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300 mb-2 font-black">
                      {item.type}
                    </div>
                    <h3 className={`font-black text-black dark:text-white ${viewMode === 'grid' ? 'text-xl mb-2 line-clamp-2 leading-tight' : 'text-2xl mb-3'}`}>
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className={`text-neutral-800 dark:text-neutral-200 font-bold ${viewMode === 'grid' ? 'text-sm line-clamp-3' : 'text-lg'}`}>{item.subtitle}</p>
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
