"use client";

import { Zap, BookOpen, Briefcase, Calendar, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RelevantItem {
  id: string;
  type: "lecture" | "project" | "meeting" | "study";
  title: string;
  subtitle: string;
  icon: any;
  context?: string;
}

export default function HomeScreen({ onOpenPage }: { onOpenPage: (id: string) => void }) {
  const focusNow: RelevantItem[] = [
    {
      id: "bio-respiration",
      type: "study",
      title: "Biology – Cell Respiration",
      subtitle: "Study: 12 cards due",
      icon: BookOpen,
    },
  ];

  const today: RelevantItem[] = [
    {
      id: "brand-identity",
      type: "project",
      title: "Brand Identity Project",
      subtitle: "2 tasks remaining",
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
  ];

  const upcoming: RelevantItem[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="max-w-3xl mx-auto px-8 py-20">
        {/* Greeting */}
        <div className="mb-16">
          <h1 className="text-4xl text-neutral-400 dark:text-neutral-600 font-light mb-3">
            Good evening, Alex
          </h1>
          <p className="text-base text-neutral-500 dark:text-neutral-500">
            Here is what is relevant for you right now.
          </p>
        </div>

        {/* Focus Now Section */}
        {focusNow.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2.5 mb-5">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Focus Now
              </h2>
            </div>

            <div className="space-y-4">
              {focusNow.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => onOpenPage(item.id)}
                  className="p-7 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10 cursor-pointer transition-all border-neutral-200 dark:border-neutral-800 hover:border-amber-200 dark:hover:border-amber-900/30 bg-gradient-to-br from-white to-amber-50/30 dark:from-neutral-900 dark:to-amber-950/10"
                >
                  <div className="flex items-start gap-5">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20">
                      <item.icon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2 font-semibold">
                        {item.type}
                      </div>
                      <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-base text-neutral-600 dark:text-neutral-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Today Section */}
        {today.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2.5 mb-5">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Today
              </h2>
            </div>

            <div className="space-y-4">
              {today.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => onOpenPage(item.id)}
                  className="p-6 hover:shadow-md hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 cursor-pointer transition-all border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-900/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/20">
                      <item.icon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-500 mb-2 font-semibold">
                        {item.type}
                      </div>
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-base text-neutral-600 dark:text-neutral-400">
                        {item.subtitle}
                      </p>
                      {item.context && (
                        <p className="text-sm text-neutral-500 mt-2">{item.context}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Calendar className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Upcoming
              </h2>
            </div>

            <div className="text-center py-16 text-neutral-400 dark:text-neutral-600">
              No lectures scheduled for tomorrow.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
