"use client";

import { useState, useRef, useEffect } from "react";
import { X, Pencil, Eraser, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: string;
  initialData?: string;
}

export default function CanvasOverlay({
  isOpen,
  onClose,
  blockId,
  initialData,
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set default styles
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#171717";
        ctx.lineWidth = 2;

        // Fill with white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "pen") {
      ctx.strokeStyle = "#171717";
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 20;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Canvas container - click doesn't propagate */}
        <div
          className="bg-white dark:bg-neutral-950 rounded-lg shadow-2xl w-[90vw] max-w-4xl h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <Button
                variant={tool === "pen" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("pen")}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("eraser")}
              >
                <Eraser className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />

              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearCanvas}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <X className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>

          {/* Canvas area */}
          <div className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-900">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full bg-white dark:bg-neutral-950 rounded-lg shadow-inner cursor-crosshair"
            />
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 text-center">
              Quick sketch for visual thinking • Close to return to notes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
