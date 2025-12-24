"use client";

import { Calendar, FileText, ChevronRight } from "lucide-react";

export default function DetailPanel() {
    return (
        <aside className="w-[300px] h-screen border-l border-neutral-100 bg-white flex flex-col pt-12 px-6 overflow-y-auto hidden xl:flex">
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Next Meeting</h3>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase">11:30 AM</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 mb-1">Horizon Corp Sync</p>
                    <p className="text-xs text-neutral-500">3 action items pending</p>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Quick Notes</h3>
                    <button className="text-[11px] font-medium text-blue-600 hover:underline">New</button>
                </div>
                <div className="space-y-3">
                    {[
                        "Feedback from deck review",
                        "Colors list for branding",
                        "Q1 Logistics"
                    ].map((note) => (
                        <div key={note} className="flex items-start gap-2 group cursor-pointer">
                            <FileText className="w-4 h-4 text-neutral-400 mt-0.5" />
                            <p className="text-sm text-neutral-600 group-hover:text-neutral-900 hover:underline transition-colors">{note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
