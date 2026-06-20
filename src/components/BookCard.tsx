import React from "react";
import { Book, ReadingProgress } from "../types";
import { Sparkles, BookOpen, Feather, Heart, Star, Compass, Coins, Play, Trash2 } from "lucide-react";

interface BookCardProps {
  key?: string;
  book: Book;
  isFavorite: boolean;
  progress: ReadingProgress | undefined;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onDelete?: () => void; // Enabled for custom books
}

export default function BookCard({
  book,
  isFavorite,
  progress,
  onSelect,
  onToggleFavorite,
  onDelete,
}: BookCardProps) {
  // Return the correct icon based on the icon name or the book category
  const renderBookIcon = () => {
    switch (book.coverIcon) {
      case "Sparkles":
        return <Sparkles className="w-10 h-10 text-amber-400" />;
      case "Coins":
        return <Coins className="w-10 h-10 text-yellow-500" />;
      case "Compass":
        return <Compass className="w-10 h-10 text-cyan-400" />;
      case "Feather":
        return <Feather className="w-10 h-10 text-emerald-400" />;
      default:
        return <BookOpen className="w-10 h-10 text-amber-500" />;
    }
  };

  // Compute status details based on chapter indices
  const getProgressStats = () => {
    if (!progress) {
      return { label: "Non commencé", percent: 0, color: "bg-slate-800" };
    }
    const idx = book.chapters.findIndex((c) => c.id === progress.currentChapterId);
    if (idx === -1) {
      return { label: "Non commencé", percent: 0, color: "bg-slate-800" };
    }
    const total = book.chapters.length;
    const progressPercent = Math.round(((idx + 1) / total) * 100);

    return {
      label: progressPercent === 100 ? "Terminé" : `Lecture : ${progressPercent}%`,
      percent: progressPercent,
      color: progressPercent === 100 ? "bg-emerald-500" : "bg-amber-500",
    };
  };

  const progressDetails = getProgressStats();

  return (
    <div id={`book-card-${book.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 hover:border-amber-500/30 transition-all duration-300 relative group overflow-hidden shadow-lg hover:shadow-xl">
      {/* Decorative colored glow backdrop */}
      <div className={`absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br ${book.coverGradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none`} />

      {/* Book Cover header */}
      <div className={`h-44 rounded-xl bg-gradient-to-br ${book.coverGradient} flex flex-col items-center justify-center relative shadow-inner shrink-0 group-hover:scale-[1.01] transition-transform duration-300`}>
        <div className="absolute top-3 left-3 flex items-center gap-1">
          {/* Genre badge */}
          <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm pr-2 text-amber-400">
            {book.category}
          </span>
          {/* Custom book badge */}
          {book.isCustom && (
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 backdrop-blur-sm border border-cyan-500/20 text-cyan-300">
              Perso
            </span>
          )}
        </div>

        {/* Favorite toggle button */}
        <button
          id={`favorite-btn-${book.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all focus:outline-none cursor-pointer ${
            isFavorite 
              ? "bg-amber-500 text-black scale-110" 
              : "bg-black/50 hover:bg-black/80 hover:scale-105 text-slate-300"
          }`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-black" : ""}`} />
        </button>

        {/* Icon representation */}
        <div className="relative transform group-hover:scale-110 transition-transform duration-500 ease-out">
          {renderBookIcon()}
          {/* Small star count ratings */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {Array.from({ length: 5 }).map((_, starIdx) => (
              <Star
                key={starIdx}
                className={`w-2.5 h-2.5 ${
                  starIdx < (book.rating || 4) ? "text-amber-400 fill-amber-400" : "text-slate-650"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Book details description */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1 text-center">
          <h3 className="font-sans font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {book.id === "petit-prince" ? "Le Petit Prince" : book.title}
          </h3>
          <p className="text-xs text-slate-400 font-mono leading-none">
            {book.author}
          </p>
          <p className="text-xs text-slate-450 leading-relaxed text-justify line-clamp-2 md:line-clamp-3 pt-2">
            {book.description}
          </p>
        </div>

        {/* Progress monitor */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>{progressDetails.label}</span>
            <span>{book.chapters.length} chap.</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressDetails.color}`}
              style={{ width: `${progressDetails.percent}%` }}
            />
          </div>
        </div>

        {/* Action controllers */}
        <div className="mt-4 flex gap-1.5 pt-1">
          <button
            id={`read-action-${book.id}`}
            onClick={onSelect}
            className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-black font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md group-hover:shadow-amber-500/10 cursor-pointer focus:outline-none"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Lire le livre
          </button>

          {/* Delete triggers enabled for created novels */}
          {book.isCustom && onDelete && (
            <button
              id={`delete-custom-${book.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 bg-slate-950 hover:bg-red-950/40 border border-slate-850 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer focus:outline-none"
              title="Supprimer ce manuscrit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
