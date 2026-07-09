import { useState, useEffect } from 'react';
import { DiaryEntry, DiaryMetadata, BookReview } from './types';
import { DiaryForm } from './components/DiaryForm';
import { DiaryList } from './components/DiaryList';
import { BookReviewList } from './components/BookReviewList';
import { BookReviewForm } from './components/BookReviewForm';
import { SettingsModal } from './components/SettingsModal';
import { BookOpen, Settings } from 'lucide-react';
import {
  Pushpin,
  PaperTape,
  MoonIllustration,
  PagodaIllustration,
  HawkIllustration,
  ScrapbookStamp,
  TornPaperFilters,
} from './components/SVGCollage';
import bgImage from '../assets/background.jpg';
import { motion, AnimatePresence } from 'motion/react';

// Default mock entries to make the app look alive immediately!
const DEFAULT_ENTRIES: DiaryEntry[] = [
  {
    id: 'sample-1',
    title: 'Một buổi sáng mùa thu yên ả',
    content: 'Hôm nay tôi thức dậy sớm hơn thường lệ. Tiết trời se se lạnh, sương mù giăng lối nhỏ ngoài ban công. \n\nTôi pha một tách trà sen ấm, lật vài trang sách cũ. Cuộc sống đôi khi chỉ cần những khoảnh khắc lặng im như thế này là đủ để xoa dịu đi những ồn ào ngoài kia.\n\nHy vọng những ngày sắp tới cũng sẽ thật bình yên như sáng nay.',
    date: '2026-07-06',
    mood: 'serene',
    tags: ['bình_yên', 'mùa_thu', 'trà_sáng'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Gặp lại người bạn cũ thời trung học',
    content: 'Chiều nay bất ngờ nhận được cuộc gọi từ Lâm. Hai đứa hẹn nhau ở quán cà phê nhỏ cuối phố.\n\nBao nhiêu kỷ niệm thời nhất quỷ nhì ma ùa về làm hai đứa cười vang cả góc quán. Thật kỳ diệu là dù đã bao năm trôi qua, mỗi người có một hướng đi riêng, nhưng khi ngồi lại vẫn thân thiết như ngày nào.\n\nCảm ơn cuộc đời vì đã cho tôi những tình bạn trân quý.',
    date: '2026-07-07',
    mood: 'nostalgic',
    tags: ['bạn_cũ', 'kỷ_niệm', 'cà_phê'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_REVIEWS: BookReview[] = [
  {
    id: 'review-1',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 5,
    reviewContent: 'Một cuốn sách tuyệt vời về việc theo đuổi ước mơ và lắng nghe tiếng gọi từ trái tim. Câu chuyện kể về hành trình của Santiago đã truyền cảm hứng mạnh mẽ cho tôi. \n\n"Khi bạn khao khát một điều gì đó, cả vũ trụ sẽ hợp lực để giúp bạn đạt được điều đó." Đây là câu nói đắt giá nhất của tác phẩm.',
    dateFinished: '2026-07-05',
    tags: ['triết_lý', 'truyền_cảm_hứng', 'kinh_điển'],
    bookUrl: 'https://vi.wikipedia.org/wiki/Nh%C3%A0_gi%E1%BA%A3_kim_(ti%E1%BB%83u_thuy%E1%BA%BFt)',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-2',
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 5,
    reviewContent: 'Cuốn sách tuy ngắn nhưng chứa đựng những bài học sâu sắc về tình bạn, tình yêu và những giá trị thực sự trong cuộc sống mà người lớn thường lãng quên. \n\nHình ảnh hoàng tử bé và bông hồng của cậu gợi lên trong tôi sự hoài niệm và trân trọng những điều giản đơn xung quanh mình.',
    dateFinished: '2026-07-08',
    tags: ['thiếu_nhi', 'triết_lý', 'hoài_niệm'],
    bookUrl: 'https://vi.wikipedia.org/wiki/Ho%C3%A0ng_t%E1%BB%AD_b%C3%A9',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_METADATA: DiaryMetadata = {
  title: 'Thám hiểm Ooo',
  tagline: 'Truy tìm Đào Trung :)))',
  authorName: 'Đào Trung',
  avatarUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=200&h=200',
};

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [metadata, setMetadata] = useState<DiaryMetadata>(DEFAULT_METADATA);
  const [activeTab, setActiveTab] = useState<'diary' | 'bookshelf'>('diary');
  const [activeView, setActiveView] = useState<'list' | 'write' | 'edit'>('list');
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('my_diary_entries');
    const storedReviews = localStorage.getItem('my_diary_book_reviews');
    const storedMetadata = localStorage.getItem('my_diary_metadata');

    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else {
      // Seed with default entries on first load
      setEntries(DEFAULT_ENTRIES);
      localStorage.setItem('my_diary_entries', JSON.stringify(DEFAULT_ENTRIES));
    }

    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      // Seed with default reviews
      setReviews(DEFAULT_REVIEWS);
      localStorage.setItem('my_diary_book_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }

    if (storedMetadata) {
      setMetadata(JSON.parse(storedMetadata));
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever entries change
  const saveEntries = (newEntries: DiaryEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('my_diary_entries', JSON.stringify(newEntries));
  };

  const saveReviews = (newReviews: BookReview[]) => {
    setReviews(newReviews);
    localStorage.setItem('my_diary_book_reviews', JSON.stringify(newReviews));
  };

  // Save to localStorage whenever metadata changes
  const handleSaveMetadata = (newMetadata: DiaryMetadata) => {
    setMetadata(newMetadata);
    localStorage.setItem('my_diary_metadata', JSON.stringify(newMetadata));
  };

  // Add or Update Entry
  const handleSaveEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();

    if (activeView === 'edit' && editingEntry) {
      // Update existing
      const updated = entries.map((e) =>
        e.id === editingEntry.id
          ? {
            ...e,
            ...entryData,
            updatedAt: timestamp,
          }
          : e
      );
      saveEntries(updated);
    } else {
      // Create new
      const newEntry: DiaryEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      saveEntries([newEntry, ...entries]);
    }

    setActiveView('list');
    setEditingEntry(null);
  };

  // Delete Entry
  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    saveEntries(updated);
  };

  // Triggers editing form
  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setActiveView('edit');
  };

  // Add or Update Book Review
  const handleSaveReview = (reviewData: Omit<BookReview, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();

    if (activeView === 'edit' && editingReview) {
      // Update existing
      const updated = reviews.map((r) =>
        r.id === editingReview.id
          ? {
            ...r,
            ...reviewData,
            updatedAt: timestamp,
          }
          : r
      );
      saveReviews(updated);
    } else {
      // Create new
      const newReview: BookReview = {
        ...reviewData,
        id: `review-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      saveReviews([newReview, ...reviews]);
    }

    setActiveView('list');
    setEditingReview(null);
  };

  // Delete Book Review
  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
  };

  // Triggers editing review form
  const handleEditReview = (review: BookReview) => {
    setEditingReview(review);
    setActiveView('edit');
  };

  // Triggers creating form
  const handleWriteNew = () => {
    if (activeTab === 'diary') {
      setEditingEntry(null);
      setActiveView('write');
    } else {
      setEditingReview(null);
      setActiveView('write');
    }
  };

  // Handle backup JSON file import
  const handleImportEntries = (imported: DiaryEntry[], importedReviews?: BookReview[]) => {
    // Generate new local IDs to avoid conflict, or merge gracefully
    const processed = imported.map((item) => ({
      ...item,
      id: item.id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));

    // Merge without duplication by matching title/date
    const combined = [...processed];
    entries.forEach((existing) => {
      const isDuplicate = processed.some(
        (p) => p.title === existing.title && p.date === existing.date
      );
      if (!isDuplicate) {
        combined.push(existing);
      }
    });

    saveEntries(combined);

    if (importedReviews && importedReviews.length > 0) {
      const processedReviews = importedReviews.map((item) => ({
        ...item,
        id: item.id || `imported-review-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));

      const combinedReviews = [...processedReviews];
      reviews.forEach((existing) => {
        const isDuplicate = processedReviews.some(
          (p) => p.title === existing.title && p.author === existing.author
        );
        if (!isDuplicate) {
          combinedReviews.push(existing);
        }
      });

      saveReviews(combinedReviews);
    }
  };

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-typewriter text-sm text-vintage-dark select-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(43, 24, 16, 0.65), rgba(43, 24, 16, 0.85)), url('${bgImage}')` }}
      >
        <div className="flex flex-col items-center gap-3 bg-vintage-cream/95 p-8 rounded-xl shadow-2xl border border-stone-300 max-w-xs text-center backdrop-blur-sm">
          <div className="text-4xl animate-bounce">⚔️📖</div>
          <span className="font-bold tracking-wide text-vintage-sepia text-base">Hành trình bắt đầu...</span>
          <span className="text-xs text-stone-600">Đang chuẩn bị trang lưu bút Ooo...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen px-4 py-8 md:py-16 overflow-x-hidden flex flex-col justify-start items-center bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(43, 24, 16, 0.45), rgba(43, 24, 16, 0.65)), url('${bgImage}')` }}
    >
      {/* 1. Global Custom Torn-Paper SVG Filters */}
      <TornPaperFilters />

      {/* 2. BACKGROUND COLLAGE DECORATIONS (Floating Vintage Accents) */}
      {/* Top-Left Collage: Newspaper backdrop + Pagoda + Moon */}
      <div className="hidden lg:block absolute top-6 left-6 z-0 pointer-events-none select-none max-w-[240px]">
        {/* Old Newspaper column clippings under layers */}
        <div className="absolute top-10 left-4 w-48 h-56 bg-[#e4dac6] border border-stone-400/20 p-2 opacity-35 rotate-[-8deg] shadow-sm text-[8px] font-serif leading-tight overflow-hidden">
          <p className="font-bold uppercase tracking-wider text-center text-[10px] mb-1">INLAND POST</p>
          <p className="mb-1 text-stone-700 italic">CARTE POSTALE. Correspondence. Address. Address. Address.</p>
          <p className="text-stone-600">The space for writing may be used for correspondence. Address only to be written here. This space can also be used for inland posts! For foreign countries, see instructions elsewhere.</p>
          <div className="w-12 h-12 border border-dashed border-stone-500/40 absolute bottom-2 right-2 flex items-center justify-center text-[9px] text-stone-500">STAMP</div>
        </div>

        {/* Pagoda and Moon */}
        <MoonIllustration className="absolute -top-10 -left-6" />
        <PagodaIllustration className="absolute top-4 -left-12 scale-90" />
      </div>

      {/* Left Center Decoration: Pink Flower Removed */}

      {/* Top-Right Collage: Torn Brown Cardboard with Hawk */}
      <div className="hidden lg:block absolute top-6 right-6 z-0 pointer-events-none select-none max-w-[280px]">
        {/* Cardboard tear background */}
        <div
          className="absolute top-4 right-4 w-44 h-48 bg-[#b49d82] border border-stone-400/30 opacity-70 rotate-[12deg] shadow-md"
          style={{ filter: 'url(#torn-paper)' }}
        >
          {/* Subtle ribbing lines to represent cardboard interior */}
          <div className="absolute inset-0 bg-repeat opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(90deg, #2c251e 1px, transparent 1px)', backgroundSize: '6px 100%' }} />
        </div>

        {/* Flying Hawk and trailing ivy */}
        <HawkIllustration className="absolute -top-2 right-2 scale-110 rotate-[5deg]" />

        {/* Vintage round stamps */}
        <ScrapbookStamp className="absolute top-28 right-28 rotate-[-25deg]" text="LAND OF OOO" date="2026" />
      </div>

      {/* Right Bottom Decoration: Purple Delphiniums Removed */}

      {/* Left Bottom Decoration: Stamp */}
      <ScrapbookStamp className="hidden md:block absolute bottom-8 left-4 lg:left-36 z-10 rotate-[15deg] scale-110" text="MATHEMATICAL" date="2026" />


      {/* 3. MAIN HEADER SECTION (Avatar, Titles, Quick Actions) */}
      <header className="relative z-10 w-full max-w-xl flex flex-col items-center text-center gap-4 mb-8 select-none">
        {/* Avatar Pin collage */}
        <div className="relative group mb-1">
          {/* Metal Pushpin holding the circular picture */}
          <Pushpin className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 z-20 hover:scale-110 transition-transform" />

          {/* Profile Avatar Frame */}
          <div className="w-20 h-20 rounded-full border-4 border-[#e9e2d3] shadow-md overflow-hidden bg-vintage-paper transform rotate-[-3deg] relative z-10">
            <img
              src={metadata.avatarUrl}
              alt="Author Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-125 saturate-50 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Tape Title */}
        <div className="relative flex flex-col items-center">
          <PaperTape className="px-10 py-3 transform rotate-[-1deg] text-vintage-dark select-none shadow-md">
            <h1 className="text-3xl font-bold font-serif tracking-wide lowercase first-letter:uppercase">
              {metadata.title}
            </h1>
          </PaperTape>

          {/* Subtitle Tape */}
          <PaperTape className="px-6 py-1 -mt-1 scale-90 transform rotate-[1deg] text-vintage-sepia select-none shadow-sm">
            <p className="text-xs font-serif italic tracking-wide">
              {metadata.tagline}
            </p>
          </PaperTape>
        </div>

        {/* Action Tape (Open Book Count and Gear icon buttons) */}
        <div className="flex gap-2 justify-center items-center mt-2">
          {/* Pages Book display button */}
          <div
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-stone-700 font-typewriter text-xs"
            id="entry-counter-badge"
          >
            <div className="absolute inset-0 bg-vintage-cream/90 border border-stone-300 pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
            <span className="relative z-10 flex items-center gap-1.5 divide-x divide-stone-300/40">
              <span className="flex items-center gap-1.5 pr-2">
                <BookOpen className="w-3.5 h-3.5 text-vintage-sepia" />
                <span>{entries.length} lưu bút</span>
              </span>
              <span className="pl-2 flex items-center gap-1">
                <span>📚 {reviews.length} sách</span>
              </span>
            </span>
          </div>

          {/* Configuration button */}
          <button
            onClick={() => setShowSettings(true)}
            className="relative p-1.5 text-vintage-sepia hover:text-vintage-dark transition-all rounded group hover:scale-105 cursor-pointer"
            title="Cài đặt nhật ký"
            id="btn-settings-trigger"
          >
            <div className="absolute inset-0 bg-vintage-cream/90 group-hover:bg-vintage-cream border border-stone-300 pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
            <span className="relative z-10 block">
              <Settings className="w-4 h-4" />
            </span>
          </button>
        </div>
      </header>


      {/* 3.5 TABS SWITCHER (Only shown in list mode) */}
      {activeView === 'list' && (
        <div className="relative z-10 flex gap-4 mb-6 font-typewriter select-none">
          <button
            onClick={() => {
              setActiveTab('diary');
            }}
            className={`relative px-6 py-2 cursor-pointer transition-all duration-200 ${activeTab === 'diary'
              ? 'text-vintage-dark font-bold scale-105'
              : 'text-stone-500 hover:text-stone-700 opacity-80'
              }`}
          >
            <div
              className={`absolute inset-0 border pointer-events-none transition-all ${activeTab === 'diary'
                ? 'bg-vintage-cream border-stone-300 shadow-md'
                : 'bg-stone-300/40 border-stone-300/20'
                }`}
              style={{ filter: 'url(#torn-paper-subtle)' }}
            />
            <span className="relative z-10 flex items-center gap-1.5 text-sm md:text-base">
              Nhật ký
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookshelf');
            }}
            className={`relative px-6 py-2 cursor-pointer transition-all duration-200 ${activeTab === 'bookshelf'
              ? 'text-vintage-dark font-bold scale-105'
              : 'text-stone-500 hover:text-stone-700 opacity-80'
              }`}
          >
            <div
              className={`absolute inset-0 border pointer-events-none transition-all ${activeTab === 'bookshelf'
                ? 'bg-vintage-cream border-stone-300 shadow-md'
                : 'bg-stone-300/40 border-stone-300/20'
                }`}
              style={{ filter: 'url(#torn-paper-subtle)' }}
            />
            <span className="relative z-10 flex items-center gap-1.5 text-sm md:text-base">
              Review sách
            </span>
          </button>
        </div>
      )}

      {/* 4. MAIN CENTRAL CONTENT AREA (Responsive Writing Desk) */}
      <main className="relative z-10 w-full max-w-4xl flex justify-center items-start flex-1 px-1">
        <AnimatePresence mode="wait">
          {activeTab === 'diary' ? (
            activeView === 'list' ? (
              <motion.div
                key="diary-list-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <DiaryList
                  entries={entries}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onWriteNew={handleWriteNew}
                />
              </motion.div>
            ) : (
              <motion.div
                key="diary-form-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <DiaryForm
                  entry={editingEntry}
                  onSave={handleSaveEntry}
                  onCancel={() => {
                    setActiveView('list');
                    setEditingEntry(null);
                  }}
                />
              </motion.div>
            )
          ) : (
            activeView === 'list' ? (
              <motion.div
                key="bookshelf-list-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <BookReviewList
                  reviews={reviews}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onWriteNew={handleWriteNew}
                />
              </motion.div>
            ) : (
              <motion.div
                key="bookshelf-form-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <BookReviewForm
                  review={editingReview}
                  onSave={handleSaveReview}
                  onCancel={() => {
                    setActiveView('list');
                    setEditingReview(null);
                  }}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>


      {/* 5. SETTINGS & STATS CONFIG MODAL */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            metadata={metadata}
            entries={entries}
            reviews={reviews}
            onSave={handleSaveMetadata}
            onClose={() => setShowSettings(false)}
            onImport={handleImportEntries}
          />
        )}
      </AnimatePresence>

      {/* Aesthetic Footer copyright or taglines */}
      <footer className="relative z-10 mt-16 text-center select-none opacity-40 hover:opacity-75 transition-opacity duration-300">
        <p className="font-mono text-[10px] text-stone-700 tracking-wider">
          NHẬT KÝ CÁ NHÂN • LƯU TRỮ CỤC BỘ • 100% BẢO MẬT & RIÊNG TƯ
        </p>
      </footer>
    </div>
  );
}
