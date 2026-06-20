import React, { useState } from "react";
import { Book, Chapter } from "../types";
import { Plus, Trash2, X, Sparkles, BookOpen, FileText } from "lucide-react";

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (newBook: Book) => void;
}

export default function AddBookModal({ onClose, onAdd }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Book["category"]>("Roman");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "ch_1", title: "Chapitre 1 : Commencement", content: "" },
  ]);

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [errorStr, setErrorStr] = useState<string | null>(null);

  // Add empty chapter to the list
  const handleAddChapter = () => {
    const nextNum = chapters.length + 1;
    const newCh: Chapter = {
      id: "ch_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      title: `Chapitre ${nextNum} : Sans titre`,
      content: "",
    };
    setChapters([...chapters, newCh]);
    setActiveChapterIndex(chapters.length);
  };

  const handleRemoveChapter = (index: number) => {
    if (chapters.length <= 1) return;
    const updated = chapters.filter((_, i) => i !== index);
    setChapters(updated);
    setActiveChapterIndex(Math.max(0, index - 1));
  };

  const handleUpdateChapter = (field: "title" | "content", value: string) => {
    const updated = [...chapters];
    updated[activeChapterIndex] = {
      ...updated[activeChapterIndex],
      [field]: value,
    };
    setChapters(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr(null);

    if (!title.trim() || !author.trim() || !description.trim()) {
      setErrorStr("Veuillez remplir le titre, l'auteur et la quatrième de couverture.");
      return;
    }

    const hasEmptyChapters = chapters.some((ch) => !ch.title.trim() || !ch.content.trim());
    if (hasEmptyChapters) {
      setErrorStr("Tous les chapitres doivent avoir un titre et du contenu rédigé.");
      return;
    }

    // Assign randomized lovely gradient cover and icon based on category
    const gradients = [
      "from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30",
      "from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30",
      "from-fuchsia-950 via-slate-900 to-purple-950 border border-fuchsia-500/30",
      "from-amber-950 via-slate-900 to-amber-900 border border-amber-500/30",
      "from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/30",
    ];

    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    const categoryIcons: Record<Book["category"], string> = {
      Théâtre: "Masks",
      Conte: "Sparkles",
      Fantastique: "Wand",
      Roman: "BookOpen",
      Poésie: "Feather",
    };

    const newBook: Book = {
      id: "custom_" + Date.now(),
      title: title.trim(),
      author: author.trim(),
      category,
      description: description.trim(),
      coverGradient: randomGradient,
      coverIcon: categoryIcons[category] || "BookOpen",
      chapters,
      rating: 4,
      isCustom: true,
      year: new Date().getFullYear().toString(),
      wordCount: chapters.reduce((acc, ch) => acc + ch.content.split(/\s+/).length, 0),
    };

    onAdd(newBook);
    onClose();
  };

  return (
    <div id="add-book-modal-wrapper" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up text-slate-100">
        {/* Modal headers */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold text-base text-amber-500 uppercase tracking-widest">
              Ajouter un manuscrit à la Bibliothèque
            </h3>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 min-h-0">
          
          {/* Left panel: Book general meta details */}
          <div className="flex-1 space-y-4 max-w-sm shrink-0">
            <h4 className="font-sans font-bold text-xs text-amber-500/80 uppercase tracking-wider border-b border-slate-800 pb-2">
              Informations Générales
            </h4>

            <div className="space-y-1">
              <label htmlFor="book-title-input" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Titre de l'œuvre
              </label>
              <input
                id="book-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Le Comte de Monte-Cristo"
                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="book-author-input" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Auteur / Écrivain
              </label>
              <input
                id="book-author-input"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex. Alexandre Dumas"
                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="book-category-select" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Genre Littéraire
              </label>
              <select
                id="book-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Book["category"])}
                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer transition-colors"
              >
                <option value="Roman">Roman</option>
                <option value="Conte">Conte / Fable</option>
                <option value="Théâtre">Théâtre</option>
                <option value="Poésie">Poésie</option>
                <option value="Fantastique">Fantastique</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="book-desc-input" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Résumé de l'œuvre (Quatrième de couverture)
              </label>
              <textarea
                id="book-desc-input"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Écrivez une quatrième de couverture accrocheuse pour inviter à la lecture..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Right panel: Chapters and internal text contents */}
          <div className="flex-1 flex flex-col min-h-[350px] border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 pt-6 md:pt-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4 shrink-0">
              <h4 className="font-sans font-bold text-xs text-amber-500/80 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Éditeur de Chapitres ({chapters.length})
              </h4>
              <button
                id="add-chapter-tab-btn"
                type="button"
                onClick={handleAddChapter}
                className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 hover:border-amber-500/20 cursor-pointer transition-colors focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            {/* Chapters quick tab selection horizontal panel */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 max-w-full shrink-0 scrollbar-thin">
              {chapters.map((ch, index) => (
                <div
                  key={ch.id}
                  className={`flex items-center gap-1 rounded-lg border text-xs px-2.5 py-1.5 transition-all whitespace-nowrap scroll-mx-4 ${
                    activeChapterIndex === index
                      ? "bg-amber-500 text-black border-amber-500 font-semibold"
                      : "bg-slate-950 text-slate-450 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveChapterIndex(index)}
                    className="focus:outline-none"
                  >
                    Ch. {index + 1}
                  </button>
                  {chapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(index)}
                      className={`ml-1 hover:text-red-500 transition-colors focus:outline-none ${
                        activeChapterIndex === index ? "text-black/60 hover:text-red-800" : "text-slate-500"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Active Chapter content editor fields */}
            <div className="flex-1 flex flex-col space-y-4 min-h-0 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
              <div className="space-y-1 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Titre du Chapitre
                </label>
                <input
                  type="text"
                  required
                  value={chapters[activeChapterIndex]?.title || ""}
                  onChange={(e) => handleUpdateChapter("title", e.target.value)}
                  placeholder="Ex. Chapitre I : Heures Sombres..."
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Contenu du manuscrit
                </label>
                <textarea
                  id="chapter-text-editor"
                  required
                  value={chapters[activeChapterIndex]?.content || ""}
                  onChange={(e) => handleUpdateChapter("content", e.target.value)}
                  placeholder="Rédigez la prose, la poésie, ou les répliques de théâtre de votre chapitre ici. Séparez les paragraphes d'une double ligne vide pour un plus bel effet d'impression dans la liseuse !"
                  className="flex-1 w-full bg-slate-950 border border-slate-800 p-3.5 text-sm rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-serif leading-relaxed overflow-y-auto resize-none"
                />
              </div>
            </div>

          </div>
        </form>

        {/* Modal standard persistent footer errors and submitting triggers */}
        <div className="bg-slate-950 border-t border-slate-850 px-6 py-4 flex flex-col md:flex-row items-center justify-between shrink-0 gap-3">
          {errorStr ? (
            <p className="text-xs text-rose-400 font-bold max-w-md text-left-align flex items-center gap-1.5 shrink-0">
              ⚠️ {errorStr}
            </p>
          ) : (
            <p className="text-xs text-slate-500 max-w-sm md:text-left text-center">
              *Les manuscrits créés sont immédiatement indexés et persistés en cache local sécurisé. L'IA de lecture les interprétera à la perfection !
            </p>
          )}

          <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
            <button
              id="editor-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer focus:outline-none"
            >
              Annuler
            </button>
            <button
              id="editor-submit-btn"
              type="submit"
              onClick={handleSubmit}
              className="px-4.5 py-2 bg-amber-505 hover:bg-amber-600 bg-amber-500 text-black font-bold rounded-lg text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer focus:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5" /> Publier le livre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
