"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeScreen from "@/components/HomeScreen";
import PageWorkspace from "@/components/PageWorkspace";
import PDFSidePanel from "@/components/PDFSidePanel";
import CanvasOverlay from "@/components/CanvasOverlay";
import StudyMode from "@/components/StudyMode";
import QuizMode from "@/components/QuizMode";
import VisualizationOverlay from "@/components/VisualizationOverlay";
import SettingsPanel from "@/components/SettingsPanel";

type Screen = "home" | "page";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const [currentPageTitle, setCurrentPageTitle] = useState<string>("");

  // Overlay states
  const [pdfOpen, setPdfOpen] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasBlockId, setCanvasBlockId] = useState<string>("");
  const [studyModeOpen, setStudyModeOpen] = useState(false);
  const [quizModeOpen, setQuizModeOpen] = useState(false);
  const [visualizationOpen, setVisualizationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sample visualization data
  const sampleData = [
    { label: "Q1 Revenue", value: 45000 },
    { label: "Q2 Revenue", value: 52000 },
    { label: "Q3 Revenue", value: 48000 },
    { label: "Q4 Revenue", value: 61000 },
  ];

  // Page data mapping
  const pageData: { [key: string]: { title: string; hasStudy: boolean } } = {
    "bio-respiration": {
      title: "Biology – Cell Respiration",
      hasStudy: true,
    },
    "brand-identity": {
      title: "Brand Identity Project",
      hasStudy: false,
    },
    "horizon-sync": {
      title: "Client Sync: Horizon Corp",
      hasStudy: false,
    },
    "custom-hooks": {
      title: "Custom Hooks Deep Dive",
      hasStudy: true,
    },
  };

  const handleOpenPage = (pageId: string) => {
    setCurrentPageId(pageId);
    setCurrentPageTitle(pageData[pageId]?.title || "Untitled");
    setCurrentScreen("page");
    // Persist last opened for Resume + direct open behavior
    if (typeof window !== "undefined") {
      const entry = {
        id: pageId,
        type: pageData[pageId]?.hasStudy ? ("study" as const) : ("project" as const),
        title: pageData[pageId]?.title || "Untitled",
        subtitle: pageData[pageId]?.hasStudy ? "Study: 12 study cards" : "2 tasks",
        ts: Date.now(),
      };
      try {
        const raw = window.localStorage.getItem("lastOpenedItems");
        const arr = raw ? JSON.parse(raw) : [];
        const filtered = Array.isArray(arr) ? arr.filter((x: any) => x.id !== entry.id) : [];
        window.localStorage.setItem("lastOpenedItems", JSON.stringify([entry, ...filtered].slice(0, 10)));
        window.localStorage.setItem("lastPageId", pageId);
        window.localStorage.setItem("lastPageTitle", entry.title);
      } catch {
        // ignore
      }
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setCurrentPageId("");
  };

  const handleOpenCanvas = (blockId: string) => {
    setCanvasBlockId(blockId);
    setCanvasOpen(true);
  };

  const handleExtractText = (text: string) => {
    console.log("Extracted text:", text);
    // In a real app, this would add the text to the current page
  };

  // Collaboration demo data
  const collaborators = [
    { id: "1", name: "Sarah", color: "#3b82f6" },
    { id: "2", name: "Mike", color: "#10b981" },
  ];

  // Dashboard optional: open last active page if available
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const lastId = window.localStorage.getItem("lastPageId");
      const lastTitle = window.localStorage.getItem("lastPageTitle") || "Untitled";
      const alwaysOpen = window.localStorage.getItem("alwaysOpenWorkspace");
      // If user was working before (lastId exists), or they opted to always open workspace
      if (lastId && lastId.length > 0) {
        setCurrentPageId(lastId);
        setCurrentPageTitle(lastTitle);
        setCurrentScreen("page");
      } else if (alwaysOpen === "true") {
        // Open a default workspace when preferred and no last page exists
        const fallbackId = "custom-hooks";
        setCurrentPageId(fallbackId);
        setCurrentPageTitle(pageData[fallbackId]?.title || "Workspace");
        setCurrentScreen("page");
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative">
      {/* Global Settings Button - Top right, appears on hover */}
      {currentScreen === "home" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          className="fixed top-4 right-4 z-20 opacity-40 focus-visible:opacity-100 hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          aria-label="Global Settings"
          title="Global Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      )}

      {/* Main Screens */}
      {currentScreen === "home" && <HomeScreen onOpenPage={handleOpenPage} />}

      {currentScreen === "page" && (
        <PageWorkspace
          pageId={currentPageId}
          pageTitle={currentPageTitle}
          onBack={handleBackToHome}
          onOpenPDF={() => setPdfOpen(true)}
          onOpenCanvas={handleOpenCanvas}
          onOpenStudyMode={() => setStudyModeOpen(true)}
          onOpenQuizMode={() => setQuizModeOpen(true)}
          onOpenVisualization={() => setVisualizationOpen(true)}
          collaborators={collaborators}
        />
      )}

      {/* Overlays and Panels - Only visible when needed */}
      <PDFSidePanel
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        onExtractText={handleExtractText}
        pdfTitle="Textbook.pdf"
      />

      <CanvasOverlay
        isOpen={canvasOpen}
        onClose={() => setCanvasOpen(false)}
        blockId={canvasBlockId}
      />

      <StudyMode
        isOpen={studyModeOpen}
        onClose={() => setStudyModeOpen(false)}
        pageTitle={currentPageTitle}
      />

      <QuizMode
        isOpen={quizModeOpen}
        onClose={() => setQuizModeOpen(false)}
        pageTitle={currentPageTitle}
      />

      <VisualizationOverlay
        isOpen={visualizationOpen}
        onClose={() => setVisualizationOpen(false)}
        data={sampleData}
        title="Revenue Analysis"
      />

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
