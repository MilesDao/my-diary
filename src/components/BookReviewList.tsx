import React, { useState } from 'react';
import { BookReview } from '../types';
import { Search, Calendar, Edit2, Trash2, Star, X, Tag, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookReviewListProps {
  reviews: BookReview[];
  onEdit: (review: BookReview) => void;
  onDelete: (id: string) => void;
  onWriteNew: () => void;
}

// Generate a deterministic gradient background based on book title string
const getBookCoverGradient = (title: string) => {
  const themes = [
    { bg: 'from-amber-900 to-amber-950', border: 'border-amber-700/50', accent: 'text-amber-300' }, // Leather brown
    { bg: 'from-emerald-900 to-emerald-950', border: 'border-emerald-700/50', accent: 'text-emerald-300' }, // Forest green
    { bg: 'from-blue-900 to-blue-950', border: 'border-blue-700/50', accent: 'text-blue-300' }, // Navy blue
    { bg: 'from-rose-900 to-rose-950', border: 'border-rose-700/50', accent: 'text-rose-300' }, // Burgundy red
    { bg: 'from-stone-800 to-stone-900', border: 'border-stone-600/50', accent: 'text-stone-300' }, // Charcoal
    { bg: 'from-indigo-950 to-purple-950', border: 'border-indigo-800/50', accent: 'text-purple-300' }, // Deep magic purple
  ];

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
};

// Sub-component to render a book cover (handling custom images or CSS default)
export const BookCover: React.FC<{ title: string; author: string; coverUrl?: string; className?: string }> = ({
  title,
  author,
  coverUrl,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const theme = getBookCoverGradient(title);

  const hasValidImage = coverUrl && coverUrl.trim().startsWith('http') && !imgError;

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded shadow-md overflow-hidden flex flex-col justify-between p-4 border select-none transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl ${className} ${
        hasValidImage ? 'bg-stone-100 border-stone-300/40' : `bg-gradient-to-br ${theme.bg} ${theme.border}`
      }`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* 3D Spine highlight on the left edge of the book cover */}
      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/10 pointer-events-none z-10" />

      {hasValidImage ? (
        <img
          src={coverUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%] contrast-110 saturate-[85%] hover:grayscale-0 transition-all duration-300 z-0"
        />
      ) : (
        <div className="relative z-0 flex flex-col justify-between h-full w-full text-center">
          {/* Decorative gold double border for vintage feel */}
          <div className="absolute inset-1.5 border border-dashed border-white/20 pointer-events-none" />

          {/* Book Title */}
          <div className="flex flex-col items-center mt-6 px-1 z-10">
            <span className={`font-serif text-sm md:text-base font-bold leading-tight line-clamp-3 text-vintage-cream ${theme.accent}`}>
              {title}
            </span>
          </div>

          {/* Author & Decorative Icon */}
          <div className="flex flex-col items-center mb-6 px-1 z-10">
            <div className="w-6 h-[1px] bg-white/30 my-2" />
            <span className="font-typewriter text-[10px] text-stone-300/95 tracking-wide line-clamp-2 uppercase">
              {author}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const BookReviewList: React.FC<BookReviewListProps> = ({
  reviews,
  onEdit,
  onDelete,
  onWriteNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewingReview, setViewingReview] = useState<BookReview | null>(null);

  // Filter reviews
  const filteredReviews = reviews
    .filter((rev) => {
      const matchesSearch =
        rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.reviewContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTag = !selectedTag || rev.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime());

  // Get unique tags across all reviews
  const allTags = Array.from(
    new Set(reviews.flatMap((rev) => rev.tags))
  ).filter(Boolean);

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Render stars helper
  const renderStars = (rating: number, className = 'w-3.5 h-3.5') => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${className} ${
              i < rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6" id="book-reviews-section">
      {/* 1. SEARCH BAR */}
      <div className="relative w-full max-w-2xl mx-auto z-10 select-none">
        <div className="relative flex items-center px-4 py-2.5">
          <div
            className="absolute inset-0 bg-vintage-cream shadow-md border border-stone-300/40 pointer-events-none"
            style={{ filter: 'url(#torn-paper-subtle)' }}
          />
          <div className="relative z-10 flex items-center w-full">
            <Search className="w-4 h-4 text-vintage-sepia/70 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm sách, tác giả, thể loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-typewriter text-sm text-vintage-dark placeholder-vintage-sepia/50 focus:ring-0"
              id="book-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-stone-200/50 rounded text-vintage-sepia shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. CORE ACTION: WRITE A NEW BOOK REVIEW */}
      <div className="flex justify-center select-none">
        <button
          onClick={onWriteNew}
          className="group relative flex items-center justify-center gap-2 px-10 py-3 text-vintage-dark font-typewriter font-bold cursor-pointer text-sm"
          id="btn-write-new-book"
        >
          <div
            className="absolute inset-0 bg-vintage-cream/95 group-hover:bg-vintage-cream border border-stone-300/60 shadow-md pointer-events-none transition-all duration-200"
            style={{ filter: 'url(#torn-paper-subtle)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-vintage-sepia group-hover:scale-115 transition-transform text-base">📚✨</span>
            <span>Review sách mới</span>
          </span>
        </button>
      </div>

      {/* 3. FILTERS BAR (Tags) */}
      {reviews.length > 0 && allTags.length > 0 && (
        <div className="w-full bg-vintage-cream/40 p-4 rounded border border-stone-300/30 shadow-inner flex flex-wrap items-center gap-1.5 select-none">
          <span className="text-xs font-typewriter font-bold text-vintage-sepia/80 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Thể loại:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${!selectedTag
              ? 'bg-vintage-dark/80 text-vintage-cream font-bold'
              : 'bg-stone-200/50 text-stone-600 hover:bg-stone-200'
              }`}
          >
            #tất_cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${tag === selectedTag
                ? 'bg-amber-800 text-amber-50 border-amber-800 font-bold'
                : 'bg-stone-200/50 text-stone-600 border-transparent hover:bg-stone-200/80'
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 4. BOOKSHELF GRID DISPLAY */}
      <div className="w-full mt-2">
        {filteredReviews.length === 0 ? (
          /* EMPTY STATE CARD */
          <div className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center gap-4 text-vintage-dark" id="empty-books-card">
            <div
              className="absolute inset-0 bg-vintage-cream shadow-lg border border-stone-300/50 pointer-events-none"
              style={{ filter: 'url(#torn-paper)' }}
            />
            <div className="relative z-10 flex flex-col items-center gap-4 max-w-md mx-auto font-serif">
              <div className="w-16 h-16 rounded-full bg-stone-200/30 border border-stone-300/50 flex items-center justify-center text-3xl shadow-inner select-none animate-pulse">
                📚
              </div>
              <h3 className="text-xl font-bold tracking-wide text-vintage-sepia select-none">
                {reviews.length === 0 ? 'Kệ sách trống' : 'Không tìm thấy review'}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed select-none">
                {reviews.length === 0
                  ? 'Kệ sách của bạn chưa có đánh giá nào. Hãy ghi lại cảm nhận về những cuốn sách bạn đã đọc để lưu trữ kiến thức và suy ngẫm nhé.'
                  : 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc thể loại.'}
              </p>
              {reviews.length === 0 && (
                <button
                  onClick={onWriteNew}
                  className="relative group mt-2 px-6 py-2 text-vintage-cream font-typewriter text-xs font-bold cursor-pointer"
                  id="btn-write-first-book"
                >
                  <div className="absolute inset-0 bg-vintage-dark group-hover:bg-vintage-sepia pointer-events-none transition-all duration-200" style={{ filter: 'url(#torn-paper-subtle)' }} />
                  <span className="relative z-10">Viết Đánh Giá Đầu Tiên</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* LIST OF BOOKS IN GRID */
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setViewingReview(rev)}
                  className="group relative flex flex-col gap-3 p-4 rounded cursor-pointer transition-all hover:translate-y-[-4px]"
                  id={`book-card-${rev.id}`}
                >
                  {/* Subtle torn paper background for each book review card */}
                  <div
                    className="absolute inset-0 bg-vintage-cream shadow-md group-hover:shadow-xl border border-stone-300/40 rounded pointer-events-none transition-all duration-300"
                    style={{ filter: 'url(#torn-paper)' }}
                  />

                  {/* Book Cover Container */}
                  <div className="relative z-10 w-32 md:w-36 mx-auto">
                    <BookCover title={rev.title} author={rev.author} coverUrl={rev.coverUrl} />
                  </div>

                  {/* Info details under cover */}
                  <div className="relative z-10 flex flex-col gap-1 text-center font-serif mt-1">
                    <h4 className="font-bold text-vintage-dark group-hover:text-amber-950 transition-colors line-clamp-1 text-sm md:text-base leading-snug">
                      {rev.title}
                    </h4>
                    <p className="text-[11px] md:text-xs text-stone-500 uppercase tracking-wide line-clamp-1 font-typewriter">
                      {rev.author}
                    </p>

                    {/* Stars and Date info */}
                    <div className="flex flex-col items-center gap-1 mt-1">
                      {renderStars(rev.rating)}
                      <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{formatDate(rev.dateFinished)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 5. IMMERSIVE DOUBLE-PAGE BOOK READING MODAL */}
      <AnimatePresence>
        {viewingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm select-none">
            {/* Modal backdrop clicks close */}
            <div className="absolute inset-0" onClick={() => setViewingReview(null)} />

            {/* Immersive Opened Book View */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#4a392c] p-3 md:p-4 rounded-xl shadow-2xl border border-amber-950/60 z-10 select-text overflow-hidden"
            >
              {/* Outer leather cover overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10 pointer-events-none" />

              {/* The Inner Double-Page Paper */}
              <div className="relative grid grid-cols-1 md:grid-cols-12 min-h-[480px] max-h-[85vh] text-vintage-dark rounded overflow-hidden">
                {/* Paper background filter */}
                <div
                  className="absolute inset-0 bg-vintage-cream border border-stone-400/50 pointer-events-none"
                  style={{ filter: 'url(#torn-paper)' }}
                />

                {/* Vertical Notebook Middle crease visual for opened book */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/35 to-black/20 pointer-events-none z-20" />
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-amber-950/20 pointer-events-none z-20" />

                {/* Top buttons overlay (floating above pages) */}
                <button
                  onClick={() => setViewingReview(null)}
                  className="absolute top-3 right-3 z-30 p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300 rounded-full transition-colors cursor-pointer select-none"
                  id="btn-close-book-modal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* LEFT PAGE (Book Meta details) - Span 5 of 12 */}
                <div className="relative md:col-span-5 flex flex-col justify-start items-center p-6 md:p-8 md:border-r border-stone-300/40 select-none pb-4 md:pb-8 text-center gap-4">
                  {/* Spine shadow for left page edge */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-stone-400/20 to-transparent pointer-events-none" />

                  {/* Date finish stamp style */}
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-vintage-sepia/70 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Đọc xong: {formatDate(viewingReview.dateFinished)}</span>
                  </div>

                  {/* Book cover projection */}
                  <div className="w-32 md:w-40 shadow-xl rounded border border-stone-300/50 mt-4">
                    <BookCover title={viewingReview.title} author={viewingReview.author} coverUrl={viewingReview.coverUrl} />
                  </div>

                  {/* Titles */}
                  <div className="flex flex-col gap-1 font-serif mt-2 px-1 max-w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-vintage-dark tracking-wide leading-tight">
                      {viewingReview.title}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-xs text-stone-500 font-typewriter font-bold uppercase tracking-wider">
                      <User className="w-3 h-3 text-vintage-sepia/80" />
                      <span>{viewingReview.author}</span>
                    </div>
                  </div>

                  {/* Rating display */}
                  <div className="flex flex-col items-center gap-1.5 border-t border-stone-300/30 w-full pt-3">
                    <span className="text-[10px] font-typewriter font-bold text-stone-500 uppercase tracking-widest">Đánh giá</span>
                    {renderStars(viewingReview.rating, 'w-5 h-5')}
                  </div>

                  {/* Tags list */}
                  {viewingReview.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-1 border-t border-stone-300/30 w-full pt-3">
                      {viewingReview.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-stone-200/60 text-stone-600 border border-stone-300/30 rounded font-mono text-[10px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions overlay for the book review */}
                  <div className="flex gap-2 mt-auto select-none pt-4 border-t border-stone-300/30 w-full justify-center">
                    <button
                      onClick={() => {
                        onEdit(viewingReview);
                        setViewingReview(null);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-blue-800 rounded border border-stone-200 text-xs font-typewriter cursor-pointer transition-all"
                      id={`btn-book-edit-${viewingReview.id}`}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sửa bài</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn xóa bài review sách này?')) {
                          onDelete(viewingReview.id);
                          setViewingReview(null);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-red-700 rounded border border-stone-200 hover:border-red-200 text-xs font-typewriter cursor-pointer transition-all"
                      id={`btn-book-delete-${viewingReview.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT PAGE (Review Content) - Span 7 of 12 */}
                <div className="relative md:col-span-7 flex flex-col p-6 md:p-8 md:pl-10 overflow-y-auto max-h-[50vh] md:max-h-full">
                  {/* Spine shadow for right page edge */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

                  {/* Red notebook margin line on left of right page */}
                  <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-red-400/25 pointer-events-none" />

                  {/* Lined notebook review text */}
                  <div className="pl-6 md:pl-8 relative flex-1 notebook-lines font-mono text-stone-800 text-sm md:text-base leading-[1.8rem] whitespace-pre-wrap py-2">
                    <div className="flex items-center gap-1.5 text-vintage-sepia text-xs font-typewriter font-bold mb-3 border-b border-stone-300/40 pb-1 uppercase tracking-wider select-none">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Suy ngẫm & Review</span>
                    </div>
                    {viewingReview.reviewContent}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
