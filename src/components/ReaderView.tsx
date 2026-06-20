import React, { useState, useEffect, useRef } from "react";
import { Book, Chapter, Highlight, ReadingProgress } from "../types";
import { 
  ArrowLeft, BookOpen, Settings, Sliders, ChevronLeft, ChevronRight, 
  Sparkles, Type, Moon, Sun, HelpCircle, FileText, Check, Plus, Trash2, Edit3, Bookmark, Save
} from "lucide-react";
import AICompanion from "./AICompanion";

interface ReaderViewProps {
  book: Book;
  onBack: () => void;
  onUpdateProgress: (bookId: string, chapterId: string) => void;
}

export default function ReaderView({ book, onBack, onUpdateProgress }: ReaderViewProps) {
  // Reading state
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const currentChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Appearance states
  const [fontSize, setFontSize] = useState<"text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl">("text-base");
  const [fontFamily, setFontFamily] = useState<"font-sans" | "font-serif" | "font-mono">("font-serif");
  const [readerTheme, setReaderTheme] = useState<"slate" | "sand" | "paper">("slate");
  const [showSettings, setShowSettings] = useState(false);

  // AI & selection states
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Highlights and Private notes states
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState<Highlight["color"]>("gold");

  // Quiz State (Custom for Harry Potter Guide / Interactive content)
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load progress and highlights from localStorage
  useEffect(() => {
    // Progress loading
    const progressKey = "fiobib_progress";
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      try {
        const list: ReadingProgress[] = JSON.parse(savedProgress);
        const entry = list.find((p) => p.bookId === book.id);
        if (entry) {
          const index = book.chapters.findIndex((c) => c.id === entry.currentChapterId);
          if (index !== -1) {
            setCurrentChapterIndex(index);
          }
        }
      } catch (e) {
        console.error("Error parsing progress", e);
      }
    }

    // Highlights loading
    const highlightsKey = "fiobib_highlights";
    const savedHighlights = localStorage.getItem(highlightsKey);
    if (savedHighlights) {
      try {
        const list: Highlight[] = JSON.parse(savedHighlights);
        setHighlights(list.filter((h) => h.bookId === book.id));
      } catch (e) {
        console.error("Error parsing highlights", e);
      }
    }
  }, [book]);

  // Update progress on chapter change
  const handleChapterChange = (index: number) => {
    if (index >= 0 && index < book.chapters.length) {
      setCurrentChapterIndex(index);
      const targetChapter = book.chapters[index];
      onUpdateProgress(book.id, targetChapter.id);

      // Save to local storage progress
      const progressKey = "fiobib_progress";
      const savedProgress = localStorage.getItem(progressKey);
      let list: ReadingProgress[] = [];
      if (savedProgress) {
        try {
          list = JSON.parse(savedProgress);
        } catch (e) {}
      }
      const existingIdx = list.findIndex((p) => p.bookId === book.id);
      const newProgress: ReadingProgress = {
        bookId: book.id,
        currentChapterId: targetChapter.id,
        lastRead: new Date().toISOString(),
      };
      if (existingIdx !== -1) {
        list[existingIdx] = newProgress;
      } else {
        list.push(newProgress);
      }
      localStorage.setItem(progressKey, JSON.stringify(list));
      
      // Clear selection
      setSelectedText(null);
      setTooltipPosition(null);
    }
  };

  // Capture text selection in the chapter
  const handleTextSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 3) {
      const parent = selection?.anchorNode?.parentElement;
      if (parent && parent.closest(".chapter-content-area")) {
        setSelectedText(text);
        
        // Compute coordinates above selection
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setTooltipPosition({
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY - 45,
          });
        } else {
          setTooltipPosition({ x: e.clientX, y: e.clientY - 20 });
        }
      }
    } else {
      setSelectedText(null);
      setTooltipPosition(null);
    }
  };

  // Direct Highlight creation helper
  const addHighlight = (color: Highlight["color"]) => {
    if (!selectedText) return;

    const newHighlight: Highlight = {
      id: "hl_" + Math.random().toString(36).substr(2, 9),
      bookId: book.id,
      chapterId: currentChapter.id,
      text: selectedText,
      color,
      createdAt: new Date().toLocaleDateString("fr-FR"),
    };

    const highlightsKey = "fiobib_highlights";
    const saved = localStorage.getItem(highlightsKey);
    let allList: Highlight[] = [];
    if (saved) {
      try {
        allList = JSON.parse(saved);
      } catch (e) {}
    }
    allList.push(newHighlight);
    localStorage.setItem(highlightsKey, JSON.stringify(allList));

    setHighlights((prev) => [...prev, newHighlight]);
    setSelectedText(null);
    setTooltipPosition(null);
  };

  const removeHighlight = (hlId: string) => {
    const highlightsKey = "fiobib_highlights";
    const saved = localStorage.getItem(highlightsKey);
    if (saved) {
      try {
        const allList: Highlight[] = JSON.parse(saved);
        const filtered = allList.filter((h) => h.id !== hlId);
        localStorage.setItem(highlightsKey, JSON.stringify(filtered));
      } catch (e) {}
    }
    setHighlights((prev) => prev.filter((h) => h.id !== hlId));
    if (editingHighlightId === hlId) {
      setEditingHighlightId(null);
      setNoteDraft("");
    }
  };

  const savePrivateNote = (hlId: string) => {
    const highlightsKey = "fiobib_highlights";
    const saved = localStorage.getItem(highlightsKey);
    let allList: Highlight[] = [];
    if (saved) {
      try {
        allList = JSON.parse(saved);
      } catch (e) {}
    }

    const itemIdx = allList.findIndex((h) => h.id === hlId);
    if (itemIdx !== -1) {
      allList[itemIdx].note = noteDraft;
      localStorage.setItem(highlightsKey, JSON.stringify(allList));
    }

    setHighlights((prev) =>
      prev.map((h) => (h.id === hlId ? { ...h, note: noteDraft } : h))
    );
    setEditingHighlightId(null);
    setNoteDraft("");
  };

  const startEditingNote = (hl: Highlight) => {
    setEditingHighlightId(hl.id);
    setNoteDraft(hl.note || "");
  };

  // CSS mappings for reader theme
  const getThemeClasses = () => {
    switch (readerTheme) {
      case "paper":
        return {
          background: "bg-[#faf8f5] text-slate-900 border-slate-200",
          controls: "bg-white text-slate-800 border-slate-200",
          cardBg: "bg-[#f3f0e8] border-[#e4dec9]",
          textMuted: "text-slate-500",
          highlightText: "text-amber-900",
        };
      case "sand":
        return {
          background: "bg-[#F4ECD8] text-[#433422] border-[#E6D5B3]",
          controls: "bg-[#EADFBF] text-[#4A3B28] border-[#D9C496]",
          cardBg: "bg-[#EADCB6]",
          textMuted: "text-[#755D40]",
          highlightText: "text-amber-950",
        };
      case "slate":
      default:
        return {
          background: "bg-slate-950 text-slate-100 border-slate-900",
          controls: "bg-slate-900 text-slate-100 border-slate-800",
          cardBg: "bg-slate-900/60 border-slate-850",
          textMuted: "text-slate-400",
          highlightText: "text-amber-100",
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Highlight color badges mapper
  const colorBadges = {
    gold: "bg-amber-400 hover:bg-amber-500 text-black",
    emerald: "bg-emerald-400 hover:bg-emerald-500 text-black",
    sky: "bg-sky-450 hover:bg-sky-500 text-black",
    rose: "bg-rose-400 hover:bg-rose-400 text-black",
  };

  // QUIZ LOGIC (For Harry Potter Guide)
  const triviaQuestions = [
    {
      q: "Quel est le sortilège utilisé pour désarmer un adversaire ?",
      options: ["Stupéfix", "Expelliarmus", "Avada Kedavra", "Wingardium Leviosa"],
      correct: 1,
    },
    {
      q: "Quel est le gardien des clés et des lieux à Poudlard ?",
      options: ["Albus Dumbledore", "Argus Rusard", "Rubeus Hagrid", "Severus Rogue"],
      correct: 2,
    },
    {
      q: "Dans quelle maison le Choixpeau hésite-t-il à placer Harry Potter ?",
      options: ["Serpentard", "Serdaigle", "Poufsouffle", "Gryffondor"],
      correct: 0,
    },
    {
      q: "Quel est l'animal compagnon emblématique d'Harry Potter ?",
      options: ["Une chouette blanche nommée Hedwige", "Un crapaud nommé Trevor", "Un rat nommé Croûtard", "Un chat nommé Miss Teigne"],
      correct: 0,
    }
  ];

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuizAnswers = () => {
    let score = 0;
    triviaQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setSubmittedQuiz(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizScore(null);
    setSubmittedQuiz(false);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${themeClasses.background}`}>
      {/* Upper Navigation/Header Ribbon */}
      <header className={`px-4 py-3 border-b flex justify-between items-center shrink-0 ${themeClasses.controls}`}>
        <div className="flex items-center gap-3">
          <button
            id="reader-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer focus:outline-none"
            title="Revenir à la bibliothèque"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-wide leading-none select-none">
              {book.title}
            </h2>
            <p className="text-[11px] leading-tight mt-0.5 opacity-80 font-mono">
              {book.author}
            </p>
          </div>
        </div>

        {/* Setting Toolbar buttons */}
        <div className="flex items-center gap-2">
          {/* Progress bar info */}
          <div className="text-[11px] font-mono opacity-80 px-2 py-1 rounded bg-slate-500/10 border border-slate-500/10 select-none">
            Chapitre {currentChapterIndex + 1} / {book.chapters.length}
          </div>

          <button
            id="reader-setting-toggle"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors cursor-pointer focus:outline-none ${
              showSettings ? "bg-amber-500 text-black" : "hover:bg-amber-500/10 hover:text-amber-500"
            }`}
            title="Ajuster l'affichage"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Screen layout splits - Book Content vs Companions Sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Chapter content area */}
        <div 
          className="flex-1 flex flex-col overflow-y-auto px-4 py-8 md:px-12 md:py-12 scrollbar-thin h-full"
          ref={containerRef}
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          <div className="max-w-2xl mx-auto w-full space-y-6 chapter-content-area">
            {/* Chapter Header Card */}
            <div className="border-b border-amber-500/20 pb-4 mb-8">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-500/80 block mb-1">
                {book.category} • Écrit en {book.year || "N/A"}
              </span>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-balance tracking-tight">
                {currentChapter.title}
              </h1>
            </div>

            {/* Render formatted blocks/paragraphs */}
            <div className={`space-y-6 ${fontSize} ${fontFamily} leading-relaxed text-slate-200`}>
              {currentChapter.content.split("\n\n").map((para, i) => {
                // If it starts with an em-dash, it is a dialog line, apply indent
                const isDialog = para.trim().startsWith("—") || para.trim().startsWith("-");
                return (
                  <p 
                    key={i} 
                    className={`whitespace-pre-wrap select-text selection:bg-amber-500 selection:text-black ${
                      isDialog ? "pl-4 md:pl-6 italic opacity-95 border-l-2 border-amber-500/20" : ""
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Custom interactive additions for Harry Potter Companion quizz inside chapters */}
            {book.id === "harry-potter" && currentChapterIndex === book.chapters.length - 1 && (
              <div className="mt-12 p-6 bg-slate-900 border border-purple-500/30 rounded-xl space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-sans font-bold text-lg text-purple-300">
                    Grand Quizz Interactive de l'Univers de J.K. Rowling
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Validez votre érudition sur le survivant après votre lecture de notre guide explicatif :
                </p>

                <div className="space-y-5">
                  {triviaQuestions.map((question, qIdx) => (
                    <div key={qIdx} className="space-y-2 border-t border-slate-800/80 pt-3">
                      <p className="text-sm font-semibold text-slate-200">
                        Q{qIdx + 1}. {question.q}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {question.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[qIdx] === oIdx;
                          const showCorrect = submittedQuiz && oIdx === question.correct;
                          const showSelectedWrong = submittedQuiz && isSelected && oIdx !== question.correct;

                          return (
                            <button
                              key={oIdx}
                              disabled={submittedQuiz}
                              onClick={() => handleQuizAnswer(qIdx, oIdx)}
                              className={`text-left p-2 rounded-lg transition-all border ${
                                showCorrect
                                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium"
                                  : showSelectedWrong
                                  ? "bg-rose-950/40 border-red-500 text-red-300"
                                  : isSelected
                                  ? "bg-purple-900/40 border-purple-500 text-purple-200"
                                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                  {!submittedQuiz ? (
                    <button
                      id="submit-quiz-btn"
                      onClick={submitQuizAnswers}
                      disabled={Object.keys(selectedAnswers).length < triviaQuestions.length}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Soumettre mes réponses
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 w-full justify-between">
                      <p className="text-sm font-semibold text-amber-500">
                        Votre Score : {quizScore} / {triviaQuestions.length} sorciers !{" "}
                        {quizScore === triviaQuestions.length ? "🧙‍♂️ Un vrai préfet !" : "🔮 Entraînez-vous encore !"}
                      </p>
                      <button
                        id="reset-quiz-btn"
                        onClick={resetQuiz}
                        className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 focus:outline-none"
                      >
                        Recommencer le Quizz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Chapter and previous chapter controls inside reader */}
            <div className="pt-10 pb-6 flex justify-between border-t border-slate-800 items-center text-xs mt-12 shrink-0">
              <button
                id="prev-chapter-btn"
                onClick={() => handleChapterChange(currentChapterIndex - 1)}
                disabled={currentChapterIndex === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-500/10 hover:bg-amber-500/10 border border-slate-500/10 hover:text-amber-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <span className="font-mono text-slate-500">
                FioBib • {book.category}
              </span>
              <button
                id="next-chapter-btn"
                onClick={() => handleChapterChange(currentChapterIndex + 1)}
                disabled={currentChapterIndex === book.chapters.length - 1}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-500/10 hover:bg-amber-500/10 border border-slate-500/10 hover:text-amber-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all cursor-pointer focus:outline-none"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Left Side / Floating display setting drawer */}
        {showSettings && (
          <div className="absolute right-4 top-4 z-40 p-4 rounded-xl border w-72 bg-slate-900 border-slate-800 text-slate-200 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-semibold text-xs text-amber-500 uppercase tracking-widest">
                Ajustements de Lecture
              </h4>
              <button
                id="close-settings-btn"
                className="text-slate-500 hover:text-slate-300 text-xs focus:outline-none"
                onClick={() => setShowSettings(false)}
              >
                Fermer
              </button>
            </div>

            {/* Adjust themes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">Thème alternatif</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="theme-slate-btn"
                  onClick={() => setReaderTheme("slate")}
                  className={`py-1.5 rounded text-xs font-semibold tracking-wide border transition-all ${
                    readerTheme === "slate" ? "bg-slate-800 border-amber-500 text-amber-400" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Sombre
                </button>
                <button
                  id="theme-sand-btn"
                  onClick={() => setReaderTheme("sand")}
                  className={`py-1.5 rounded text-xs font-semibold tracking-wide border transition-all ${
                    readerTheme === "sand" ? "bg-[#eadfbf] border-amber-600 text-amber-900" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Sépia
                </button>
                <button
                  id="theme-paper-btn"
                  onClick={() => setReaderTheme("paper")}
                  className={`py-1.5 rounded text-xs font-semibold tracking-wide border transition-all ${
                    readerTheme === "paper" ? "bg-white border-amber-500 text-slate-900" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Papier
                </button>
              </div>
            </div>

            {/* Adjust fonts family */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">Police de caractère</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="font-serif-btn"
                  onClick={() => setFontFamily("font-serif")}
                  className={`py-1 px-2 rounded text-xs font-serif border ${
                    fontFamily === "font-serif" ? "bg-slate-800 border-amber-500 text-amber-400" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  Serif
                </button>
                <button
                  id="font-sans-btn"
                  onClick={() => setFontFamily("font-sans")}
                  className={`py-1 px-2 rounded text-xs font-sans border ${
                    fontFamily === "font-sans" ? "bg-slate-800 border-amber-500 text-amber-400" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  Sans
                </button>
                <button
                  id="font-mono-btn"
                  onClick={() => setFontFamily("font-mono")}
                  className={`py-1 px-2 rounded text-xs font-mono border ${
                    fontFamily === "font-mono" ? "bg-slate-800 border-amber-500 text-amber-400" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  Détail
                </button>
              </div>
            </div>

            {/* Adjust fonts sizes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">Grandeur du texte</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-1 px-1.5 rounded uppercase border text-[10px] ${
                      fontSize === size ? "bg-slate-800 border-amber-500 text-amber-400" : "bg-slate-950 border-slate-800"
                    }`}
                  >
                    {size.split("-")[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right side drawer: AI Companion & Surlignages tabs container split */}
        <aside className="hidden lg:flex flex-col w-96 border-l border-slate-800 bg-slate-950 shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 h-full flex flex-col min-h-0 min-w-0">
            {/* AI Companion Embedded in page */}
            <div className="h-[60%] flex flex-col min-h-0 min-w-0">
              <AICompanion
                book={book}
                currentChapterTitle={currentChapter.title}
                selectedText={selectedText}
                clearSelection={() => {
                  setSelectedText(null);
                  setTooltipPosition(null);
                }}
                onExplainText={(explain) => setAiAnalysis(explain)}
              />
            </div>

            {/* Highlights & Notes Tab */}
            <div className="h-[40%] flex flex-col min-h-0 bg-slate-900 border border-amber-500/10 rounded-xl p-4 overflow-hidden min-w-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 shrink-0">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs uppercase font-sans font-bold tracking-wider">
                    Vos Notes (FioBib)
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {highlights.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {highlights.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500 space-y-1">
                    <FileText className="w-5 h-5 text-slate-600 mb-1" />
                    <p>Aucune note enregistrée.</p>
                    <p className="text-[10px] max-w-[200px] text-slate-600">Surlignez du texte pour graver des annotations personnelles !</p>
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div key={hl.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 relative group text-xs text-left">
                      <button
                        onClick={() => removeHighlight(hl.id)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none cursor-pointer"
                        title="Supprimer la note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          hl.color === "gold" ? "bg-amber-400" :
                          hl.color === "emerald" ? "bg-emerald-400" :
                          hl.color === "sky" ? "bg-sky-400" : "bg-rose-400"
                        }`} />
                        <span className="font-mono text-[9px] text-slate-500">{hl.createdAt}</span>
                      </div>

                      <p className="italic text-slate-400 line-clamp-2 pr-4 border-l border-slate-850 pl-2 leading-relaxed">
                        "{hl.text}"
                      </p>

                      {editingHighlightId === hl.id ? (
                        <div className="space-y-1.5 pt-1.5">
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Saisissez votre annotation..."
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded text-slate-100 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => savePrivateNote(hl.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-1 px-2.5 rounded inline-flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Save className="w-3 h-3" /> Enregistrer
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {hl.note ? (
                            <p className="text-slate-200 mt-1 bg-slate-900 p-2 rounded leading-normal border border-slate-900">
                              {hl.note}
                            </p>
                          ) : (
                            <button
                              onClick={() => startEditingNote(hl)}
                              className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1 mt-1 font-semibold focus:outline-none"
                            >
                              <Plus className="w-3 h-3" /> Ajouter une note privée
                            </button>
                          )}
                          {hl.note && (
                            <button
                              onClick={() => startEditingNote(hl)}
                              className="text-[9px] text-slate-500 hover:text-amber-500 inline-flex items-center gap-0.5 mt-1 focus:outline-none"
                            >
                              <Edit3 className="w-2.5 h-2.5" /> Modifier la note
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Action Selection Toolbar (triggered on mouse highlighting text) */}
      {selectedText && tooltipPosition && (
        <div 
          id="reader-selection-tooltip"
          className="absolute z-50 flex items-center bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 px-2 gap-1 animate-fade-in text-xs shrink-0 select-none"
          style={{ 
            left: `${Math.min(window.innerWidth - 300, Math.max(10, tooltipPosition.x - 140))}px`, 
            top: `${Math.max(10, tooltipPosition.y)}px` 
          }}
        >
          {/* Explain button triggering AI Panel */}
          <button
            id="tooltip-ai-explain"
            onClick={() => setSelectedText(selectedText)} // already triggers effect on selectedText prop
            className="flex items-center gap-1 text-amber-400 hover:bg-slate-800 px-2 py-1.5 rounded transition-colors focus:outline-none font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Interpréter (IA)
          </button>

          <div className="w-[1px] h-4 bg-slate-800/80 mx-1 shrink-0" />

          {/* Color Highlight pins */}
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={() => addHighlight("gold")}
              className="w-4 h-4 rounded-full bg-amber-400 hover:scale-110 active:scale-95 transition-transform"
              title="Surligner en or"
            />
            <button
              onClick={() => addHighlight("emerald")}
              className="w-4 h-4 rounded-full bg-emerald-400 hover:scale-110 active:scale-95 transition-transform"
              title="Surligner en émeraude"
            />
            <button
              onClick={() => addHighlight("sky")}
              className="w-4 h-4 rounded-full bg-sky-400 hover:scale-110 active:scale-95 transition-transform"
              title="Surligner en bleu"
            />
            <button
              onClick={() => addHighlight("rose")}
              className="w-4 h-4 rounded-full bg-rose-400 hover:scale-110 active:scale-95 transition-transform"
              title="Surligner en rose"
            />
          </div>

          <div className="w-[1px] h-4 bg-slate-800/80 mx-1 shrink-0" />

          {/* Copy button */}
          <button
            id="tooltip-copy"
            onClick={() => {
              navigator.clipboard.writeText(selectedText);
              setSelectedText(null);
            }}
            className="text-slate-400 hover:text-slate-150 px-2 py-1.5 rounded transition-colors focus:outline-none"
          >
            Copier
          </button>
        </div>
      )}
    </div>
  );
}
