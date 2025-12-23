"use client";

import { Settings as SettingsIcon, X, Cloud, HardDrive, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Settings Panel - Slides in from right */}
      <div className="fixed top-0 right-0 bottom-0 w-[450px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Settings
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Sync Settings */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              Sync & Storage
            </h3>
            <div className="space-y-3">
              <Card className="p-4 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      Google Drive
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Sync all notes and attachments
                    </div>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Connected
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <HardDrive className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      Local Only
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Keep data on this device only
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <Database className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      WebDAV
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Self-hosted sync solution
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Data Management */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              What to Sync
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    Notes & Pages
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    All text content
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    Canvas Sketches
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Drawing data
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    PDF Annotations
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Highlights and extracts
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    Study Progress
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Flashcard scores
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              Appearance
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    Dark Mode
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 text-center">
            Version 1.0.0 • Changes save automatically
          </p>
        </div>
      </div>
    </>
  );
}
