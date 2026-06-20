import React, { useState, useEffect } from "react";
import { Book, ReadingProgress, Highlight } from "./types";
import { CLASSIC_BOOKS } from "./data/booksData";
import BookCard from "./components/BookCard";
import ReaderView from "./components/ReaderView";
import AddBookModal from "./components/AddBookModal";
import { 
  Sparkles, BookOpen, Plus, Search, Heart, Bookmark, Compass, 
  Library, Clock, BookOpenCheck, FileText, CheckCircle2, ChevronDown, ListFilter 
} from "lucide-react";

export default function App() {
  // Books lists
  const [books, setBooks] = useState<Book[]>(CLASSIC_BOOKS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progressList, setProgressList] = useState<ReadingProgress[]>([]);
  const [allNotesCount, setAllNotesCount] = useState(0);

  // Filter criteria states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  // View controllers
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // App notification banner
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Load favorites, custom books, progress list, and total notes from LocalStorage on mount
  useEffect(() => {
    // 1. Favorites
    const savedFavs = localStorage.getItem("fiobib_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }

    // 2. Custom Books
    const savedCustom = localStorage.getItem("fiobib_custom");
    let customList: Book[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
        setBooks([...CLASSIC_BOOKS, ...customList]);
      } catch (e) {}
    }

    // 3. Progress list
    const savedProgress = localStorage.getItem("fiobib_progress");
    if (savedProgress) {
      try {
        setProgressList(JSON.parse(savedProgress));
      } catch (e) {}
    }

    // 4. Notes count
    const savedHighlights = localStorage.getItem("fiobib_highlights");
    if (savedHighlights) {
      try {
        const hls: Highlight[] = JSON.parse(savedHighlights);
        setAllNotesCount(hls.filter((h) => h.note?.trim()).length);
      } catch (e) {}
    }
  }, []);

  // Show a beautifully animated feedback banner
  const triggerNotification = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => {
      setBannerMessage(null);
    }, 4000);
  };

  // Toggle favorite trigger
  const handleToggleFavorite = (bookId: string) => {
    let updated: string[];
    if (favorites.includes(bookId)) {
      updated = favorites.filter((id) => id !== bookId);
      triggerNotification("Livre retiré des favoris.");
    } else {
      updated = [...favorites, bookId];
      triggerNotification("Livre ajouté à vos favoris FioBib ! ❤️");
    }
    setFavorites(updated);
    localStorage.setItem("fiobib_favorites", JSON.stringify(updated));
  };

  // Add custom book to list
  const handleAddCustomBook = (newBook: Book) => {
    const savedCustom = localStorage.getItem("fiobib_custom");
    let customList: Book[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (e) {}
    }
    customList.push(newBook);
    localStorage.setItem("fiobib_custom", JSON.stringify(customList));

    setBooks((prev) => [...prev, newBook]);
    triggerNotification(`Félicitations ! l'œuvre "${newBook.title}" a été publiée dans votre FioBib ! 📚`);
  };

  // Delete custom book
  const handleDeleteCustomBook = (bookId: string) => {
    const savedCustom = localStorage.getItem("fiobib_custom");
    let customList: Book[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (e) {}
    }
    const filteredCustom = customList.filter((b) => b.id !== bookId);
    localStorage.setItem("fiobib_custom", JSON.stringify(filteredCustom));

    setBooks([...CLASSIC_BOOKS, ...filteredCustom]);
    
    // Also remove favorites entries if present
    if (favorites.includes(bookId)) {
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    }
    
    triggerNotification("Livre supprimé de votre collection personnelle.");
  };

  // Update book reading progress callback
  const handleUpdateProgress = (bookId: string, chapterId: string) => {
    const progressKey = "fiobib_progress";
    const savedProgress = localStorage.getItem(progressKey);
    let list: ReadingProgress[] = [];
    if (savedProgress) {
      try {
        list = JSON.parse(savedProgress);
      } catch (e) {}
    }

    const existingIdx = list.findIndex((p) => p.bookId === bookId);
    const newProgress: ReadingProgress = {
      bookId,
      currentChapterId: chapterId,
      lastRead: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      list[existingIdx] = newProgress;
    } else {
      list.push(newProgress);
    }

    setProgressList(list);

    // Refresh highlights notes counter as well
    const savedHighlights = localStorage.getItem("fiobib_highlights");
    if (savedHighlights) {
      try {
        const hls: Highlight[] = JSON.parse(savedHighlights);
        setAllNotesCount(hls.filter((h) => h.note?.trim()).length);
      } catch (e) {}
    }
  };

  // Filter book collection based on search queries and categories
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Tous" ||
      selectedCategory === "Favoris" && favorites.includes(book.id) ||
      book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate statistics overview
  const totalBooks = books.length;
  const startedBooksCount = progressList.filter((p) => 
    books.some((b) => b.id === p.bookId)
  ).length;
  const favoriteBooksCount = favorites.filter((id) =>
    books.some((b) => b.id === id)
  ).length;

  // Render reading room if a book is selected
  if (selectedBook) {
    const currentProgress = progressList.find((p) => p.bookId === selectedBook.id);
    return (
      <ReaderView
        book={selectedBook}
        onBack={() => {
          setSelectedBook(null);
          // Refresh favorites and progress when returning
          const progressKey = "fiobib_progress";
          const savedProgress = localStorage.getItem(progressKey);
          if (savedProgress) {
            try { setProgressList(JSON.parse(savedProgress)); } catch (e) {}
          }
          // Refresh total notes
          const savedHighlights = localStorage.getItem("fiobib_highlights");
          if (savedHighlights) {
            try {
              const hls: Highlight[] = JSON.parse(savedHighlights);
              setAllNotesCount(hls.filter((h) => h.note?.trim()).length);
            } catch (e) {}
          }
        }}
        onUpdateProgress={handleUpdateProgress}
      />
    );
  }

  // Categories list
  const categories = ["Tous", "Roman", "Conte", "Théâtre", "Poésie", "Fantastique", "Favoris"];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans scroll-smooth">
      
      {/* Upper Brand Header Hero Banner */}
      <header className="border-b border-amber-500/10 bg-slate-950 px-6 py-8 md:py-12 relative overflow-hidden shrink-0">
        {/* Subtle decorative glowing background layers to give a premium feels */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                <BookOpen className="w-7 h-7" />
              </span>
              <div>
                <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight text-white flex items-center justify-center md:justify-start gap-2 select-none">
                  FioBib <span className="text-amber-500">.</span>
                </h1>
                <p className="text-xs text-amber-500/80 font-mono tracking-widest uppercase mt-0.5 leading-none">
                  Bibliothèque Numérique interactive
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xl font-sans font-medium">
              Explorez les chefs-d'œuvre éternels de la langue française avec un compagnon de lecture intelligent disponible pour analyser chaque vers, scène ou dialogue avec subtilité.
            </p>
          </div>

          {/* Action triggers */}
          <div className="shrink-0">
            <button
              id="add-manuscript-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 font-bold text-xs text-black px-5 py-3 rounded-xl flex items-center gap-2 transform active:scale-95 transition-all shadow-lg hover:shadow-amber-500/15 cursor-pointer leading-none"
            >
              <Plus className="w-4 h-4 text-black font-extrabold" />
              Publier un manuscrit
            </button>
          </div>
        </div>
      </header>

      {/* Floating alert banner */}
      {bannerMessage && (
        <div id="app-toast-alert" className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-500/35 p-4 rounded-xl text-xs flex items-center gap-2 text-amber-300 shadow-2xl animate-slide-in select-none">
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
          <p className="font-semibold">{bannerMessage}</p>
        </div>
      )}

      {/* Reading Dashboard Statistics ribbon */}
      <section className="bg-slate-920 border-b border-slate-900/60 py-4 px-6 shrink-0 relative select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-900">
            <span className="p-2 bg-slate-800/80 rounded-lg text-slate-400 group-hover:bg-slate-300 inline-block">
              <Library className="w-5 h-5 text-amber-500" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-medium">Œuvres Cataloguées</p>
              <p className="text-lg font-bold font-mono text-slate-100">{totalBooks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-900">
            <span className="p-2 bg-slate-800/80 rounded-lg text-slate-400 group-hover:bg-slate-300 inline-block">
              <BookOpenCheck className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-medium">En cours de lecture</p>
              <p className="text-lg font-bold font-mono text-slate-100">{startedBooksCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-900">
            <span className="p-2 bg-slate-800/80 rounded-lg text-slate-400 group-hover:bg-slate-300 inline-block">
              <Heart className="w-5 h-5 text-rose-400" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-medium font-sans">Coups de Coeur</p>
              <p className="text-lg font-bold font-mono text-slate-100">{favoriteBooksCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-900">
            <span className="p-2 bg-slate-800/80 rounded-lg text-slate-400 group-hover:bg-slate-300 inline-block">
              <FileText className="w-5 h-5 text-cyan-400" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-medium">Annotations de l'IA</p>
              <p className="text-lg font-bold font-mono text-slate-100">{allNotesCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter / Search panel & Books Grid listing */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 flex-1 min-h-0">
        
        {/* Dynamic Controllers container (Filters, Search query input) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6 shrink-0">
          
          {/* Category Tabs list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none scroll-smooth">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-btn-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer focus:outline-none ${
                    isSelected
                      ? "bg-amber-500 border-amber-5ver text-black font-bold shadow-md shadow-amber-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200"
                  }`}
                >
                  {cat === "Tous" ? "Toutes les œuvres" : cat === "Favoris" ? "❤️ Favoris" : cat}
                </button>
              );
            })}
          </div>

          {/* Search bar inputs */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, auteur..."
              className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-350 focus:outline-none"
              >
                Annuler
              </button>
            )}
          </div>
        </div>

        {/* Dynamic List Section of books */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-900 rounded-3xl space-y-4">
            <div className="p-4 bg-slate-900 inline-block rounded-full text-slate-600">
              <Compass className="w-10 h-10 animate-spin-slow" />
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-300">Aucun projet littéraire trouvé</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Il n'y a pas de livres assortis à vos filtres pour le moment. Modifiez vos critères, ou publiez votre propre manuscrit !
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Tous");
              }}
              className="mt-2 text-xs font-bold text-amber-500 hover:text-amber-400 underline focus:outline-none capitalize"
            >
              Réinitialiser l'affichage
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const prog = progressList.find((p) => p.bookId === book.id);
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  isFavorite={favorites.includes(book.id)}
                  progress={prog}
                  onSelect={() => setSelectedBook(book)}
                  onToggleFavorite={() => handleToggleFavorite(book.id)}
                  onDelete={book.isCustom ? () => handleDeleteCustomBook(book.id) : undefined}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Global Book notes summary drawer at bottom of page */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-6 shrink-0 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center md:text-left-align">
          <div>
            <p className="font-semibold text-slate-400">© 2026 FioBib • Le Savoir à Portée de Clic</p>
            <p className="mt-1">Plateforme propulsée par l'Intelligence Artificielle de Google Gemini 3.5 pour enrichir votre culture littéraire.</p>
          </div>
          <p className="text-[11px] font-mono select-none">
            Heure système : UTC-07:00
          </p>
        </div>
      </footer>

      {/* Write / Create custom book Modal */}
      {isAddModalOpen && (
        <AddBookModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomBook}
        />
      )}
    </div>
  );
}
