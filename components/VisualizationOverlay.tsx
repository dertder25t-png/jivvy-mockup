"use client";

import { useState } from "react";
import { X, BarChart3, PieChart, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VisualizationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: { label: string; value: number }[];
  title: string;
}

export default function VisualizationOverlay({
  isOpen,
  onClose,
  data,
  title,
}: VisualizationOverlayProps) {
  const [viewType, setViewType] = useState<"bar" | "pie" | "table">("bar");

  if (!isOpen) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Visualization container */}
        <div
          className="bg-white dark:bg-neutral-950 rounded-lg shadow-2xl w-[90vw] max-w-3xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant={viewType === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("bar")}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === "pie" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("pie")}
              >
                <PieChart className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("table")}
              >
                <Table className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Visualization area */}
          <div className="flex-1 p-8 overflow-auto">
            {/* Bar Chart */}
            {viewType === "bar" && (
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all"
                        style={{
                          width: `${(item.value / maxValue) * 100}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pie Chart (simplified representation) */}
            {viewType === "pie" && (
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 mb-8">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {data.reduce((acc, item, index) => {
                      const percentage = (item.value / total) * 100;
                      const dashArray = `${percentage} ${100 - percentage}`;
                      const rotation = acc.offset;

                      acc.elements.push(
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="15.915"
                          fill="transparent"
                          stroke={colors[index % colors.length]}
                          strokeWidth="31.83"
                          strokeDasharray={dashArray}
                          strokeDashoffset={-rotation}
                        />
                      );

                      acc.offset += percentage;
                      return acc;
                    }, { offset: 0, elements: [] as React.ReactElement[] }).elements}
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {data.map((item, index) => {
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Table View */}
            {viewType === "table" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Item
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Value
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                      <tr
                        key={index}
                        className="border-b border-neutral-100 dark:border-neutral-900"
                      >
                        <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">
                          {item.label}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-neutral-100">
                          {item.value}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-medium">
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">
                      Total
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-neutral-100">
                      {total}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-neutral-100">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500 text-center">
              Data visualization • Close to return to notes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
