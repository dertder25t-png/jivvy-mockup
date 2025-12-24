"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Circle, CheckCircle2, Image, ArrowLeft, Map, BookOpen, ClipboardList, BarChart3, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

interface Block {
  id: string;
  type: "text" | "task" | "canvas";
  content: string;
  completed?: boolean;
  canvasData?: string;
  indent?: number;
}

interface PageWorkspaceProps {
  pageId: string;
  pageTitle: string;
  onBack: () => void;
  onOpenPDF?: () => void;
  onOpenCanvas?: (blockId: string) => void;
  onOpenStudyMode?: () => void;
  onOpenQuizMode?: () => void;
  onOpenVisualization?: () => void;
  collaborators?: { id: string; name: string; color: string }[];
  isProject?: boolean;
}

export default function PageWorkspace({
  pageId,
  pageTitle,
  onBack,
  onOpenPDF,
  onOpenCanvas,
  onOpenStudyMode,
  onOpenQuizMode,
  onOpenVisualization,
  collaborators = [],
  isProject = false,
}: PageWorkspaceProps) {
  const [projectMapOpen, setProjectMapOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Mock project structure
  const projectStructure = [
    { id: "custom-hooks", name: "Custom Hooks Deep Dive", type: "page" as const, icon: FileText },
    {
      id: "react-patterns", name: "Advanced React Patterns", type: "folder" as const, icon: FileText, children: [
        { id: "hoc-vs-hooks", name: "HOC vs Hooks", type: "page" as const, icon: FileText },
        { id: "composition", name: "Composition Patterns", type: "page" as const, icon: FileText },
      ]
    },
    { id: "bio-respiration", name: "Biology - Cell Respiration", type: "page" as const, icon: FileText },
    { id: "brand-identity", name: "Brand Identity Project", type: "page" as const, icon: FileText },
  ];
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "text",
      content: "Today we discussed Higher Order Components vs Hooks",
    },
    {
      id: "2",
      type: "text",
      content: "The key takeaway was that hooks composition is generally preferred for logic reuse",
      indent: 1,
    },
    {
      id: "3",
      type: "text",
      content: "Key Concepts:",
    },
    {
      id: "4",
      type: "text",
      content: "Composition over Inheritance",
      indent: 1,
    },
    {
      id: "5",
      type: "text",
      content: "Custom Hooks are just functions",
      indent: 1,
    },
    {
      id: "6",
      type: "task",
      content: 'Review the "useAuth" implementation',
      completed: false,
    },
    {
      id: "7",
      type: "canvas",
      content: "Component hierarchy sketch",
      canvasData: "/placeholder-sketch.svg",
    },
  ]);

  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const handleBlockChange = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const handleTaskToggle = (id: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id && block.type === "task"
          ? { ...block, completed: !block.completed }
          : block
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, blockId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      const newBlock: Block = {
        id: Date.now().toString(),
        type: "text",
        content: "",
        indent: blocks[blockIndex].indent || 0,
      };
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      setBlocks(newBlocks);

      setTimeout(() => {
        inputRefs.current[newBlock.id]?.focus();
      }, 0);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      const currentIndent = blocks[blockIndex].indent || 0;
      const newIndent = e.shiftKey
        ? Math.max(0, currentIndent - 1)
        : Math.min(3, currentIndent + 1);

      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId ? { ...block, indent: newIndent } : block
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex">
      {/* Project Map Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 overflow-auto transition-transform duration-300 ease-in-out ${projectMapOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Project Map</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProjectMapOpen(false)}
              className="h-7 w-7 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            {projectStructure.map((item) => (
              <div key={item.id}>
                {item.type === "folder" ? (
                  <>
                    <button
                      onClick={() => toggleFolder(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      {expandedFolders.has(item.id) ? (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      )}
                      <item.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="flex-1 text-left">{item.name}</span>
                    </button>
                    {expandedFolders.has(item.id) && item.children && (
                      <div className="ml-7 mt-1.5 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${child.id === pageId
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-400 shadow-sm"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              }`}
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{child.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${item.id === pageId
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-400 shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${projectMapOpen ? "ml-72" : "ml-0"
          }`}
      >
        {/* Minimal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-950 border-b-2 border-neutral-400 dark:border-neutral-700 shadow-md">
          <div className={`${isProject ? 'max-w-5xl' : 'w-[98%]'} mx-auto px-8 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-400 font-black text-sm uppercase tracking-widest"
              >
                <ArrowLeft className="w-5 h-5 mr-2 stroke-[3]" />
                Back
              </Button>
              <div className="w-px h-5 bg-neutral-400 dark:bg-neutral-600" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProjectMapOpen(!projectMapOpen)}
                className={`font-medium transition-colors ${projectMapOpen
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  }`}
                title="Project Map"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode Icons */}
              {onOpenPDF && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenPDF}
                  className="text-neutral-600 hover:text-purple-600 dark:text-neutral-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                  title="Open PDF"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              )}
              {onOpenStudyMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenStudyMode}
                  className="text-neutral-600 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Study Mode"
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
              )}
              {onOpenQuizMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenQuizMode}
                  className="text-neutral-600 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                  title="Quiz Mode"
                >
                  <ClipboardList className="w-4 h-4" />
                </Button>
              )}
              {onOpenVisualization && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenVisualization}
                  className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
                  title="Visualization"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              )}

              {/* Collaboration Avatars - Subtle */}
              {collaborators.length > 0 && (
                <>
                  <div className="w-px h-5 bg-neutral-500 dark:bg-neutral-500 mx-1" />
                  <div className="flex -space-x-2">
                    {collaborators.map((collab) => (
                      <Avatar
                        key={collab.id}
                        className="w-8 h-8 border-2 border-black dark:border-white ring-2 ring-neutral-200 dark:ring-neutral-800 shadow-md"
                      >
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-xs font-black text-white"
                          style={{ backgroundColor: collab.color }}
                        >
                          {collab.name[0]}
                        </div>
                      </Avatar>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Workspace - Clean, minimal */}
        <div className={`${isProject ? 'max-w-4xl' : 'w-[96%]'} mx-auto px-8 pt-10 pb-32`}>
          {/* Page Title */}
          <h1 className="text-7xl font-black text-black dark:text-white mb-20 outline-none leading-tight tracking-[calc(-0.04em)]">
            {pageTitle}
          </h1>

          {/* Blocks - Invisible block system */}
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="group relative"
                style={{ paddingLeft: `${(block.indent || 0) * 24}px` }}
              >
                {/* Task Block */}
                {block.type === "task" && (
                  <div className="flex items-start gap-3 py-2">
                    <button
                      onClick={() => handleTaskToggle(block.id)}
                      className="mt-1 text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {block.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-800" />
                      ) : (
                        <Circle className="w-6 h-6 border-[3px] border-black dark:border-white rounded-full" />
                      )}
                    </button>
                    <textarea
                      ref={(el) => { inputRefs.current[block.id] = el; }}
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, block.id)}
                      onFocus={() => setFocusedBlock(block.id)}
                      onBlur={() => setFocusedBlock(null)}
                      className={`flex-1 bg-transparent border-none outline-none resize-none overflow-hidden text-black dark:text-white font-black text-lg ${block.completed ? "line-through text-neutral-500 shadow-none border-none" : "shadow-none border-none"
                        }`}
                      rows={1}
                      style={{
                        minHeight: "24px",
                        lineHeight: "24px",
                      }}
                    />
                  </div>
                )}

                {/* Canvas Block */}
                {block.type === "canvas" && (
                  <div className="flex items-start gap-3 py-2">
                    <div className="text-neutral-400 mt-1">•</div>
                    <div className="flex-1">
                      <div className="text-neutral-700 dark:text-neutral-300 mb-2">
                        {block.content}
                      </div>
                      <button
                        onClick={() => onOpenCanvas?.(block.id)}
                        className="group/canvas relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                      >
                        <div className="w-48 h-32 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                          <Image className="w-8 h-8 text-neutral-400" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover/canvas:bg-black/5 transition-colors" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Text Block */}
                {block.type === "text" && (
                  <div className="flex items-start gap-3 py-2">
                    <div className="text-neutral-400 mt-1">•</div>
                    <textarea
                      ref={(el) => { inputRefs.current[block.id] = el; }}
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, block.id)}
                      onFocus={() => setFocusedBlock(block.id)}
                      onBlur={() => setFocusedBlock(null)}
                      className="flex-1 bg-transparent border-none outline-none resize-none overflow-hidden text-black dark:text-white font-black text-lg leading-relaxed shadow-none"
                      rows={1}
                      style={{
                        minHeight: "24px",
                        lineHeight: "24px",
                      }}
                    />
                  </div>
                )}

                {/* Collaboration indicator - subtle */}
                {focusedBlock === block.id && collaborators.length > 0 && (
                  <div
                    className="absolute -left-1 top-0 bottom-0 w-0.5 rounded-full"
                    style={{ backgroundColor: collaborators[0].color }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
