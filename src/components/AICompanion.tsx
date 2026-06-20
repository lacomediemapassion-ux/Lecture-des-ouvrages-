import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Book } from "../types";
import { Send, Sparkles, BookOpen, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

interface AICompanionProps {
  book: Book;
  currentChapterTitle: string;
  selectedText: string | null;
  clearSelection: () => void;
  onExplainText: (explanation: string) => void;
}

export default function AICompanion({
  book,
  currentChapterTitle,
  selectedText,
  clearSelection,
  onExplainText,
}: AICompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "explain">("chat");
  const [errorStr, setErrorStr] = useState<string | null>(null);

  // For explanation feature
  const [lastExplainedText, setLastExplainedText] = useState<string | null>(null);
  const [explanationResult, setExplanationResult] = useState<string | null>(null);
  const [explainContextOption, setExplainContextOption] = useState<"explain" | "context" | "translate">("explain");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle triggering explanation of selected text
  useEffect(() => {
    if (selectedText) {
      setActiveTab("explain");
      handleExplain(selectedText);
    }
  }, [selectedText]);

  // Call API to explain a highlighted passage
  const handleExplain = async (textToExplain: string, option: typeof explainContextOption = "explain") => {
    setLoading(true);
    setErrorStr(null);
    setLastExplainedText(textToExplain);
    setExplanationResult(null);
    setExplainContextOption(option);

    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToExplain,
          bookTitle: book.title,
          author: book.author,
          contextOption: option,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur d'intelligence artificielle FioBib.");
      }

      const data = await response.json();
      setExplanationResult(data.text);
      onExplainText(data.text); // bubble up if needed
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
      clearSelection();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setErrorStr(null);

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage, timestamp: new Date().toLocaleTimeString() },
    ];
    setMessages(updatedMessages);

    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          bookTitle: book.title,
          author: book.author,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la communication avec le guide de lecture.");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.text, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  // Pre-made prompts for convenience
  const suggestions = [
    `Qui est l'auteur de "${book.title}" ?`,
    `Fais-moi un résumé du chapitre actuel de "${book.title}"`,
    `Quelle est la symbolique clé de cette histoire ?`,
    `Existe-t-il d'autres livres similaires à conseiller ?`,
  ];

  return (
    <div id="ai-companion-panel" className="bg-slate-900 border border-amber-500/10 rounded-xl overflow-hidden flex flex-col h-full text-slate-100 shadow-xl">
      {/* Panel title / tabs */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="font-sans font-semibold text-sm text-amber-500 uppercase tracking-widest">
            Compagnon Littéraire
          </h3>
        </div>
        <div className="flex gap-1 text-xs">
          <button
            id="tab-chat"
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 rounded transition-colors focus:outline-none ${
              activeTab === "chat"
                ? "bg-amber-500 text-black font-semibold"
                : "text-slate-400 hover:text-slate-100 bg-slate-920"
            }`}
          >
            Discuter
          </button>
          <button
            id="tab-explain"
            onClick={() => setActiveTab("explain")}
            className={`px-3 py-1 rounded transition-colors focus:outline-none ${
              activeTab === "explain"
                ? "bg-amber-500 text-black font-semibold"
                : "text-slate-400 hover:text-slate-100 bg-slate-920"
            }`}
          >
            Analyse
          </button>
        </div>
      </div>

      {activeTab === "chat" ? (
        // CHAT TAB
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/60">
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 h-full scrollbar-thin scrollbar-thumb-slate-800"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200">
                    Discutez en direct de <i>{book.title}</i>
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Posez vos questions au guide littéraire intelligent : demandez des interprétations, des analyses de contexte ou des recommandations de lecture. Authentique écho de l'œuvre.
                  </p>
                </div>

                <div className="w-full pt-4 space-y-2 text-left">
                  <p className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider pl-1">
                    Suggestions :
                  </p>
                  <div className="grid gap-2">
                    {suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestPrompt(suggestion)}
                        className="text-left text-xs bg-slate-950 hover:bg-slate-850 p-2.5 rounded-lg border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-amber-400 transition-all focus:outline-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-500 text-black rounded-tr-none font-medium text-right-align shadow-md"
                        : "bg-slate-950 text-slate-200 rounded-tl-none border border-slate-850 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line text-left">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.role === "user" ? "Vous" : "Guide FioBib"} • {msg.timestamp}
                  </span>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="flex space-x-1.5 items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="italic pl-1">Le guide littéraire réfléchit...</span>
              </div>
            )}

            {errorStr && (
              <div className="flex items-start gap-2 bg-red-950/40 border border-red-500/30 p-3 rounded-lg text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Une erreur s'est produite</p>
                  <p>{errorStr}</p>
                  <button
                    onClick={() => handleSendMessage()}
                    className="flex items-center gap-1 mt-1 text-red-400 hover:text-red-200 font-semibold focus:outline-none"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-hover" /> Réessayer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat input footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              id="ai-chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question sur le livre..."
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              id="ai-send-button"
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-black rounded-lg transition-all focus:outline-none shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        // ANALYSE / EXPLAIN TAB
        <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col min-h-0 bg-slate-900/60">
          {!lastExplainedText ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                <BookOpen className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-200">Aucun passage surligné</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Surlignez n'importe quel mot ou paragraphe dans le texte du livre pour obtenir instantanément une explication profonde du style ou du sens caché !
              </p>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col h-full">
              {/* Highlight snippet card */}
              <div className="p-3 bg-slate-950 rounded-lg border-l-4 border-amber-500 text-xs italic text-slate-300 leading-relaxed max-h-32 overflow-y-auto shrink-0">
                "{lastExplainedText}"
              </div>

              {/* Action controller */}
              <div className="flex gap-2 shrink-0 justify-around p-1 bg-slate-950 border border-slate-850 rounded-lg text-xs">
                <button
                  id="btn-opt-explain"
                  onClick={() => handleExplain(lastExplainedText, "explain")}
                  disabled={loading}
                  className={`px-2.5 py-1.5 rounded transition-all focus:outline-none ${
                    explainContextOption === "explain"
                      ? "bg-amber-500 text-black font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Expliquer l'idée
                </button>
                <button
                  id="btn-opt-context"
                  onClick={() => handleExplain(lastExplainedText, "context")}
                  disabled={loading}
                  className={`px-2.5 py-1.5 rounded transition-all focus:outline-none ${
                    explainContextOption === "context"
                      ? "bg-amber-500 text-black font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Contexte clé
                </button>
                <button
                  id="btn-opt-translate"
                  onClick={() => handleExplain(lastExplainedText, "translate")}
                  disabled={loading}
                  className={`px-2.5 py-1.5 rounded transition-all focus:outline-none ${
                    explainContextOption === "translate"
                      ? "bg-amber-500 text-black font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Autres sens / Trad
                </button>
              </div>

              {/* Analysis Result */}
              <div className="flex-1 bg-slate-950 border border-slate-850 p-4 rounded-xl overflow-y-auto min-h-0 space-y-3 leading-relaxed text-sm">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                      <Sparkles className="w-4 h-4 text-amber-500 absolute top-3 left-3 animate-pulse" />
                    </div>
                    <p className="italic">Le guide FioBib rédige les notes de lecture...</p>
                  </div>
                ) : explanationResult ? (
                  <div className="text-slate-200 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyse de l'IA FioBib :
                    </div>
                    <p className="whitespace-pre-line text-xs font-mono bg-slate-900 p-2.5 rounded text-amber-100 leading-normal border border-slate-850 mb-3">
                      {explainContextOption === "explain" 
                        ? "🔍 Explication conceptuelle du contenu." 
                        : explainContextOption === "context" 
                        ? "🌍 Analyse de l'époque et de l'idéologie de l'œuvre."
                        : "💬 Analyse stylistique et métalangage."}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{explanationResult}</p>
                  </div>
                ) : errorStr ? (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 rounded text-red-300 text-xs text-center flex flex-col items-center justify-center h-full space-y-2">
                    <AlertCircle className="w-6 h-6 text-red-500 animate-bounce" />
                    <p className="font-semibold">Impossible de joindre le guide.</p>
                    <p>{errorStr}</p>
                    <button
                      onClick={() => handleExplain(lastExplainedText, explainContextOption)}
                      className="bg-red-500 text-black font-semibold text-xs py-1 px-3 mt-1 rounded hover:bg-red-650"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
