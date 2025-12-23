"use client";

import { useState } from "react";
import { X, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModeProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
}

export default function QuizMode({ isOpen, onClose, pageTitle }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Auto-generated from note structure
  const questions: QuizQuestion[] = [
    {
      id: "1",
      question: "What is the main energy currency of the cell?",
      options: ["Glucose", "ATP", "NADH", "Oxygen"],
      correctAnswer: 1,
      explanation: "ATP (Adenosine Triphosphate) is the primary energy carrier in cells.",
    },
    {
      id: "2",
      question: "Where does glycolysis occur?",
      options: ["Mitochondria", "Nucleus", "Cytoplasm", "Ribosome"],
      correctAnswer: 2,
      explanation: "Glycolysis takes place in the cytoplasm of the cell.",
    },
    {
      id: "3",
      question: "Which design principle is preferred for React components?",
      options: [
        "Inheritance over Composition",
        "Composition over Inheritance",
        "Neither",
        "Both equally",
      ],
      correctAnswer: 1,
      explanation: "Composition over Inheritance allows for more flexible and reusable code.",
    },
  ];

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
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
            Exit Quiz
          </Button>
          <div className="text-sm text-neutral-500">{pageTitle}</div>
        </div>

        {!completed && (
          <div className="text-sm text-neutral-500">
            Score: {score} / {questions.length}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-900">
        <div
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quiz Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-2xl">
          {!completed ? (
            <>
              {/* Question counter */}
              <div className="text-center mb-8">
                <span className="text-neutral-500 text-sm">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-neutral-100 text-center">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <Card
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        showCorrect
                          ? "bg-green-900/20 border-green-600"
                          : showWrong
                          ? "bg-red-900/20 border-red-600"
                          : isSelected
                          ? "bg-blue-900/20 border-blue-600"
                          : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-100">{option}</span>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Explanation (after submit) */}
              {showResult && currentQuestion.explanation && (
                <Card className="p-4 mb-6 bg-neutral-900 border-neutral-800">
                  <div className="text-sm text-neutral-400 mb-1">Explanation:</div>
                  <div className="text-neutral-300">{currentQuestion.explanation}</div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-3">
                {!showResult ? (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            // Results Screen
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-light text-neutral-100 mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-light text-neutral-100 mb-2">
                  {score} / {questions.length}
                </div>
                <div className="text-neutral-400">
                  {score === questions.length
                    ? "Perfect score! 🎉"
                    : score >= questions.length * 0.7
                    ? "Great job!"
                    : "Keep practicing!"}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleRestart}
                  className="border-neutral-800 text-neutral-100 hover:bg-neutral-900"
                >
                  Try Again
                </Button>
                <Button
                  size="lg"
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Back to Notes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
