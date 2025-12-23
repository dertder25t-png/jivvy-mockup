"use client";

import { useState } from "react";
import { X, Highlighter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFHighlight {
  id: string;
  text: string;
  page: number;
  color: string;
}

interface PDFSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractText: (text: string) => void;
  pdfTitle?: string;
}

export default function PDFSidePanel({
  isOpen,
  onClose,
  onExtractText,
  pdfTitle = "Textbook.pdf",
}: PDFSidePanelProps) {
  const [highlights, setHighlights] = useState<PDFHighlight[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");

  const handleHighlight = () => {
    if (selectedText) {
      const newHighlight: PDFHighlight = {
        id: Date.now().toString(),
        text: selectedText,
        page: 42,
        color: "yellow",
      };
      setHighlights([...highlights, newHighlight]);
      onExtractText(selectedText);
      setSelectedText("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - subtle */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Side Panel - Right side */}
      <div className="fixed top-0 right-0 bottom-0 w-[500px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {pdfTitle}
            </span>
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

        {/* PDF Viewer Area */}
        <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 p-4">
          {/* Simulated PDF content */}
          <div className="bg-white dark:bg-neutral-950 shadow-lg rounded-lg p-8 max-w-md mx-auto">
            <div className="space-y-4 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              <h2 className="text-lg font-semibold mb-4">Cellular Respiration Overview</h2>
              
              <p>
                Cellular respiration is the process by which organisms use oxygen to break
                down food molecules to get chemical energy for cell functions.
              </p>

              <div
                className="bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded cursor-pointer"
                onClick={() =>
                  setSelectedText(
                    '"ATP is the main energy currency of the cell."'
                  )
                }
              >
                <p className="italic">
                  "ATP is the main energy currency of the cell."
                </p>
                <p className="text-xs text-neutral-500 mt-1">SOURCE: TEXTBOOK.PDF • PAGE 42</p>
              </div>

              <p>Glycolysis takes place in the cytoplasm.</p>

              <p>
                The cycle consumes acetate (in the form of acetyl-CoA) and water, reducing
                NAD+ to NADH and producing carbon dioxide.
              </p>

              {selectedText && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                        SELECTED TEXT
                      </div>
                      <div className="text-sm text-neutral-700 dark:text-neutral-300">
                        {selectedText}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleHighlight}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Highlighter className="w-3 h-3 mr-2" />
                    Extract to Notes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 text-center">
            Select text and click "Extract to Notes" to add to your page
          </p>
        </div>
      </div>
    </>
  );
}
