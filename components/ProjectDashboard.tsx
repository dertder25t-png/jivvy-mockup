"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Database, BookOpen, MoreHorizontal, Plus, Link as LinkIcon, Download, SlidersHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectDashboardProps {
    projectId: string;
    projectTitle: string;
    onBack: () => void;
}

export default function ProjectDashboard({
    projectId,
    projectTitle,
    onBack,
}: ProjectDashboardProps) {

    // Mock Widgets Data
    const widgets = [
        {
            id: "syllabus",
            title: "Syllabus / Brief",
            icon: BookOpen,
            content: "1. Phase 1: Research (Due Jan 10)\n2. Phase 2: Design (Due Jan 20)\n3. Phase 3: Development (Due Feb 15)",
            type: "text"
        },
        {
            id: "database",
            title: "Database Schemas",
            icon: Database,
            content: "User Table: id, name, email\nProjects Table: id, name, owner_id",
            type: "code"
        }
    ];

    const files = [
        { name: "Brand_Guidelines_v2.pdf", size: "2.4 MB", date: "Yesterday" },
        { name: "Logo_Assets.zip", size: "15 MB", date: "Jan 12" },
        { name: "UX_Research_Report.docx", size: "800 KB", date: "Jan 10" },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-neutral-500 hover:text-neutral-900 -ml-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-px h-4 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-600 block" />
                        <h1 className="text-[15px] font-bold text-neutral-900">{projectTitle}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-neutral-500 font-medium text-xs gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-900">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">

                    {/* Top Stats / Overview Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Widget 1: Description/Syllabus */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col h-64 relative group hover:border-neutral-300 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-neutral-900 font-bold text-sm uppercase tracking-wide opacity-50">
                                <BookOpen className="w-4 h-4" /> Syllabus
                            </div>
                            <textarea
                                className="flex-1 w-full bg-transparent resize-none border-none focus:ring-0 p-0 text-sm leading-relaxed text-neutral-700"
                                defaultValue={widgets[0].content}
                            />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* Widget 2: Database / Technical Info */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col h-64 relative group hover:border-neutral-300 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-neutral-900 font-bold text-sm uppercase tracking-wide opacity-50">
                                <Database className="w-4 h-4" /> Database Info
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-3 font-mono text-xs text-neutral-600 overflow-auto">
                                {widgets[1].content}
                            </div>
                        </div>

                        {/* Widget 3: Project Files */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col h-64 relative group hover:border-neutral-300 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 text-neutral-900 font-bold text-sm uppercase tracking-wide opacity-50">
                                    <FileText className="w-4 h-4" /> Files
                                </div>
                                <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 bg-white">
                                    <Plus className="w-3 h-3 mr-1" /> Upload
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-white border border-neutral-200 rounded-lg group/file hover:border-neutral-400 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-medium text-neutral-900 truncate">{file.name}</p>
                                                <p className="text-[11px] text-neutral-400">{file.date}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover/file:opacity-100">
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Task List Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-neutral-900">Tasks</h2>
                            <Button size="sm" className="bg-neutral-900 text-white hover:bg-black rounded-lg text-xs font-bold px-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Task
                            </Button>
                        </div>

                        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-12 text-center text-neutral-400">
                                <p>Task list for {projectTitle} goes here...</p>
                                <p className="text-xs mt-2 opacity-50">(Re-use InlineRow component here ideally)</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
