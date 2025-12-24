"use client";

import { BookOpen, Briefcase, Calendar, CheckSquare, ClipboardList, FileText, History, Rocket } from "lucide-react";
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
  // Universal input
  const [query, setQuery] = useState("");
  const [createdItems, setCreatedItems] = useState<CreatedItem[]>([]);
  // Context chips
  const [chips, setChips] = useState<Array<{ id: string; label: string; action: () => void }>>([]);

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
      <div className="max-w-3xl mx-auto px-8 py-20">
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
              <Button
                variant={filter === "Recent" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("Recent")}
                className="text-neutral-700 dark:text-neutral-300"
              >
                Recent
              </Button>
              <Button
                variant={filter === "Pinned" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("Pinned")}
                className="text-neutral-700 dark:text-neutral-300"
              >
                Pinned
              </Button>
              <Button
                variant={filter === "Scheduled" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("Scheduled")}
                className="text-neutral-700 dark:text-neutral-300"
              >
                Scheduled
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {visibleItems.map((item) => (
              <Card
                key={item.id}
                onClick={() => onOpenPage(item.id)}
                className="p-6 hover:shadow-md cursor-pointer transition-all border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900">
                    <item.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 font-semibold">
                      {item.type}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-base text-neutral-600 dark:text-neutral-400">{item.subtitle}</p>
                    )}
                    {item.context && (
                      <p className="text-sm text-neutral-500 mt-2">{item.context}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
