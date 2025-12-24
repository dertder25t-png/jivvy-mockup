"use client";

import { Inbox, Calendar, Clock, Hash, Plus, Pin, ChevronRight, Layout, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    icon?: any;
    label: string;
    active?: boolean;
    onClick?: () => void;
    symbol?: string;
    symbolColor?: string;
    count?: number;
}

function SidebarItem({ icon: Icon, label, active, onClick, symbol, symbolColor, count }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group flex items-centergap-2.5 w-full px-3 py-1.5 rounded-lg text-[13px] transition-all duration-200",
                active
                    ? "bg-neutral-100 text-neutral-950 font-bold shadow-sm"
                    : "text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900"
            )}
        >
            {Icon && <Icon className={cn("w-4 h-4 transition-colors", active ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-700")} strokeWidth={active ? 2.5 : 2} />}
            {symbol && <span className={cn("text-lg leading-none font-bold translate-y-[0px] w-4 text-center", symbolColor, active && "opacity-100")}>{symbol}</span>}
            <span className="truncate flex-1 text-left">{label}</span>
            {count !== undefined && count > 0 && (
                <span className="text-[10px] text-neutral-400 font-semibold group-hover:text-neutral-500">{count}</span>
            )}
        </button>
    );
}

export default function NavigationSidebar({
    activeFilter,
    onFilterChange
}: {
    activeFilter: string;
    onFilterChange: (filter: any) => void
}) {
    const projects = [
        { name: "Brand Identity", color: "text-purple-600" },
        { name: "Horizon Sync", color: "text-blue-600" },
        { name: "Quarterly Goals", color: "text-emerald-600" },
    ];

    return (
        <aside className="w-[240px] h-screen bg-[#FBFBFB] border-r border-neutral-200 flex flex-col pt-4 overflow-y-auto">
            <div className="px-4 mb-6">
                <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <div className="w-5 h-5 rounded bg-neutral-900 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">J</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">Jivvy Workspace</span>
                    <ChevronRight className="w-3 h-3 text-neutral-400 ml-auto" />
                </div>
            </div>

            <div className="px-3 space-y-0.5 mb-8">
                <SidebarItem
                    icon={Inbox}
                    label="Inbox"
                    active={activeFilter === "Inbox"}
                    onClick={() => onFilterChange("Inbox")}
                    count={3}
                />
                <SidebarItem
                    icon={Calendar}
                    label="Today"
                    active={activeFilter === "Recent"}
                    onClick={() => onFilterChange("Recent")}
                    count={5}
                />
                <SidebarItem
                    icon={Clock}
                    label="Upcoming"
                    active={activeFilter === "Scheduled"}
                    onClick={() => onFilterChange("Scheduled")}
                />
                <SidebarItem
                    icon={Pin}
                    label="Pinned"
                    active={activeFilter === "Pinned"}
                    onClick={() => onFilterChange("Pinned")}
                />
            </div>

            <div className="px-3 py-2">
                <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer">
                    <h3 className="text-[11px] font-bold text-neutral-500 hover:text-neutral-800 uppercase tracking-wider transition-colors">Projects</h3>
                    <Plus className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-neutral-950 transition-all" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                    {projects.map((p) => (
                        <SidebarItem
                            key={p.name}
                            label={p.name}
                            symbol="#"
                            symbolColor={p.color}
                            onClick={() => onFilterChange(p.name)} // Simplified navigation
                            active={activeFilter === p.name}
                        />
                    ))}
                    <button className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-[13px] text-neutral-400 hover:text-neutral-600 transition-colors mt-2">
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Add Project</span>
                    </button>
                </div>
            </div>

            <div className="px-3 py-2 mt-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Workspaces</h3>
                </div>
                <div className="space-y-0.5">
                    <SidebarItem icon={FolderKanban} label="Design System" />
                    <SidebarItem icon={Layout} label="Research" />
                </div>
            </div>
        </aside>
    );
}
