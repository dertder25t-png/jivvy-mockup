"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: "text" | "canvas";
  canvasData?: string;
}

interface StudyModeProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
}

export default function StudyMode({ isOpen, onClose, pageTitle }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-generated from page content
  const flashcards: Flashcard[] = [
    {
      id: "1",
      front: "What is the main energy currency of the cell?",
      back: "ATP (Adenosine Triphosphate)",
      type: "text",
    },
    {
      id: "2",
      front: "Where does glycolysis take place?",
      back: "In the cytoplasm",
      type: "text",
    },
    {
      id: "3",
      front: "What are the key concepts of React Hooks?",
      back: "• Composition over Inheritance\n• Custom Hooks are just functions",
      type: "text",
    },
    {
      id: "4",
      front: "Component Hierarchy",
      back: "[Canvas sketch would appear here]",
      type: "canvas",
    },
  ];

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      if (isFlipped) {
        handleNext();
      } else {
        setIsFlipped(true);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-950 z-50 flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Study Mode
          </Button>
          <div className="text-sm text-neutral-500">{pageTitle}</div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="text-neutral-400 hover:text-neutral-100"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-900">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card Display Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Card counter */}
          <div className="text-center mb-8">
            <span className="text-neutral-500 text-sm">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
          </div>

          {/* Flashcard */}
          <Card
            className="relative h-[400px] cursor-pointer border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="absolute inset-0 flex items-center justify-center p-12">
              {!isFlipped ? (
                // Front of card
                <div className="text-center">
                  <div className="text-2xl font-light text-neutral-100">
                    {currentCard.front}
                  </div>
                  <div className="mt-8 text-sm text-neutral-500">
                    Click or press Space to reveal
                  </div>
                </div>
              ) : (
                // Back of card
                <div className="text-center">
                  <div className="text-xl text-neutral-300 whitespace-pre-line">
                    {currentCard.back}
                  </div>
                  {currentCard.type === "canvas" && (
                    <div className="mt-6 flex justify-center">
                      <div className="w-64 h-40 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">Canvas Preview</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-neutral-400 hover:text-neutral-100 disabled:opacity-30"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="text-neutral-400 hover:text-neutral-100 disabled:opacity-30"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Keyboard hints */}
          <div className="text-center mt-12 text-xs text-neutral-600">
            <span className="mr-4">← → Arrow keys to navigate</span>
            <span className="mr-4">Space to flip</span>
            <span>Esc to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
