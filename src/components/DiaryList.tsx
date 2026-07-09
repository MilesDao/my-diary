import React, { useState } from 'react';
import { DiaryEntry, MoodType, MOODS } from '../types';
import { Search, Calendar, Edit2, Trash2, BookOpen, Tag, Filter, Eye, X, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiaryListProps {
  entries: DiaryEntry[];
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
  onWriteNew: () => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  entries,
  onEdit,
  onDelete,
  onWriteNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);

  // Filter entries based on search, mood, and tag
  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
      const matchesTag = !selectedTag || entry.tags.includes(selectedTag);

      return matchesSearch && matchesMood && matchesTag;
    })
    // Sort by date descending, then by creation date descending
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getMoodConfig = (type: MoodType) => {
    return MOODS.find((m) => m.type === type) || MOODS[1];
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      // Format as "DD Thg MM, YYYY" in Vietnamese
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Get unique tags across all entries
  const allTags = Array.from(
    new Set(entries.flatMap((entry) => entry.tags))
  ).filter(Boolean);

  return (
    <div className="w-full flex flex-col gap-6" id="diary-list-section">
      {/* 1. SEARCH BAR - Styled like the screenshot torn paper strip */}
      <div className="relative w-full max-w-2xl mx-auto z-10 select-none">
        <div className="relative flex items-center px-4 py-2.5">
          {/* Background layer with filter */}
          <div
            className="absolute inset-0 bg-vintage-cream shadow-md border border-stone-300/40 pointer-events-none"
            style={{ filter: 'url(#torn-paper-subtle)' }}
          />
          <div className="relative z-10 flex items-center w-full">
            <Search className="w-4 h-4 text-vintage-sepia/70 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-typewriter text-sm text-vintage-dark placeholder-vintage-sepia/50 focus:ring-0"
              id="search-input"
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

      {/* 2. CORE ACTION: WRITE A NEW ENTRY - Styled like screenshot torn paper tape */}
      <div className="flex justify-center select-none">
        <button
          onClick={onWriteNew}
          className="group relative flex items-center justify-center gap-2 px-10 py-3 text-vintage-dark font-typewriter font-bold cursor-pointer text-sm"
          id="btn-write-new"
        >
          {/* Background layer with filter */}
          <div
            className="absolute inset-0 bg-vintage-cream/95 group-hover:bg-vintage-cream border border-stone-300/60 shadow-md pointer-events-none transition-all duration-200"
            style={{ filter: 'url(#torn-paper-subtle)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-vintage-sepia group-hover:scale-115 transition-transform text-base">✍️</span>
            <span>Nhật ký mới</span>
          </span>
        </button>
      </div>

      {/* 3. FILTERS BAR (Moods & Tags) */}
      {entries.length > 0 && (
        <div className="w-full bg-vintage-cream/40 p-4 rounded border border-stone-300/30 shadow-inner flex flex-col gap-3 select-none">
          {/* Mood Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-typewriter font-bold text-vintage-sepia/80 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Cảm xúc:
            </span>
            <button
              onClick={() => setSelectedMood('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedMood === 'all'
                ? 'bg-vintage-dark text-vintage-cream border-vintage-dark font-bold'
                : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-white'
                }`}
            >
              Tất cả
            </button>
            {MOODS.map((m) => {
              const count = entries.filter((e) => e.mood === m.type).length;
              if (count === 0) return null; // Only show active moods
              return (
                <button
                  key={m.type}
                  onClick={() => setSelectedMood(m.type)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedMood === m.type
                    ? `${m.color} ${m.border} font-bold ring-1 ring-vintage-sepia/30`
                    : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-white'
                    }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-stone-300/20 pt-2.5">
              <span className="text-xs font-typewriter font-bold text-vintage-sepia/80 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Thẻ nhớ:
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
        </div>
      )}

      {/* 4. ENTRIES DISPLAY SECTION */}
      <div className="w-full flex flex-col gap-5 mt-2">
        {filteredEntries.length === 0 ? (
          /* EMPTY STATE CARD - matches the screenshot large rectangular sheet */
          <div className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center gap-4 text-vintage-dark" id="empty-diary-card">
            {/* Background layer with filter */}
            <div
              className="absolute inset-0 bg-vintage-cream shadow-lg border border-stone-300/50 pointer-events-none"
              style={{ filter: 'url(#torn-paper)' }}
            />

            <div className="relative z-10 flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-stone-200/30 border border-stone-300/50 flex items-center justify-center text-3xl shadow-inner select-none animate-pulse">
                📖
              </div>
              <h3 className="text-xl font-bold font-serif tracking-wide text-vintage-sepia select-none">
                {entries.length === 0 ? 'Nhật ký trống' : 'Không tìm thấy kỷ niệm'}
              </h3>
              <p className="text-sm font-serif text-stone-600 leading-relaxed select-none">
                {entries.length === 0
                  ? 'Hãy bắt đầu ghi lại những trải nghiệm, cảm xúc và suy nghĩ của bạn ngày hôm nay để lưu giữ chúng mãi về sau.'
                  : 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc cảm xúc/thẻ nhớ để tìm lại kỷ niệm cũ.'}
              </p>
              {entries.length === 0 && (
                <button
                  onClick={onWriteNew}
                  className="relative group mt-2 px-6 py-2 text-vintage-cream font-typewriter text-xs font-bold cursor-pointer"
                  id="btn-write-empty"
                >
                  <div className="absolute inset-0 bg-vintage-dark group-hover:bg-vintage-sepia pointer-events-none transition-all duration-200" style={{ filter: 'url(#torn-paper-subtle)' }} />
                  <span className="relative z-10">Viết Kỷ Niệm Đầu Tiên</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* LIST OF ENTRIES */
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredEntries.map((entry) => {
                const moodCfg = getMoodConfig(entry.mood);
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="relative group p-5 md:p-6 rounded flex flex-col md:flex-row gap-4 transition-all"
                    id={`diary-card-${entry.id}`}
                  >
                    {/* Background layer with filter */}
                    <div
                      className="absolute inset-0 bg-vintage-cream shadow-md group-hover:shadow-lg border border-stone-300/40 rounded pointer-events-none transition-all duration-200"
                      style={{ filter: 'url(#torn-paper)' }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row gap-4 w-full">
                      {/* Header/Info section on Left */}
                      <div className="flex md:flex-col justify-between md:justify-start items-center md:items-start gap-2 border-b md:border-b-0 md:border-r border-stone-300/40 pb-3 md:pb-0 md:pr-4 md:w-36 select-none shrink-0">
                        {/* Date */}
                        <div className="flex items-center gap-1 text-vintage-sepia font-typewriter font-bold text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(entry.date)}</span>
                        </div>

                        {/* Mood Badge */}
                        <div className={`mt-1.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${moodCfg.color} ${moodCfg.border}`}>
                          <span className="text-sm">{moodCfg.emoji}</span>
                          <span>{moodCfg.label}</span>
                        </div>
                      </div>

                      {/* Content Section in Center */}
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <h4 className="text-lg font-bold font-serif text-vintage-dark group-hover:text-amber-950 transition-colors truncate">
                          {entry.title}
                        </h4>

                        <p className="text-sm font-serif text-stone-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>

                        {/* Tags */}
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 select-none">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTag(tag === selectedTag ? null : tag);
                                }}
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono text-[11px] cursor-pointer transition-colors ${tag === selectedTag
                                  ? 'bg-amber-800 text-amber-50 font-bold'
                                  : 'bg-stone-200/60 text-stone-500 hover:bg-stone-200'
                                  }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons on Right */}
                      <div className="flex items-center justify-end md:flex-col md:justify-center gap-2 select-none shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => setViewingEntry(entry)}
                          className="p-2 bg-stone-100/80 hover:bg-stone-200/80 text-vintage-sepia rounded border border-stone-200 transition-all hover:scale-105 cursor-pointer"
                          title="Đọc nhật ký"
                          id={`btn-view-${entry.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(entry)}
                          className="p-2 bg-stone-100/80 hover:bg-stone-200/80 text-blue-800 rounded border border-stone-200 transition-all hover:scale-105 cursor-pointer"
                          title="Sửa trang này"
                          id={`btn-edit-${entry.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xé trang nhật ký này? Hành động này không thể hoàn tác!')) {
                              onDelete(entry.id);
                            }
                          }}
                          className="p-2 bg-stone-100/80 hover:bg-red-50 text-red-700 rounded border border-stone-200 hover:border-red-200 transition-all hover:scale-105 cursor-pointer"
                          title="Xóa trang"
                          id={`btn-delete-${entry.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 5. IMMERSIVE DIARY READING MODAL (Flip-Book Style) */}
      <AnimatePresence>
        {viewingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm select-none">
            {/* Modal backdrop clicks close */}
            <div className="absolute inset-0" onClick={() => setViewingEntry(null)} />

            {/* Immersive Book representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-2xl bg-[#5c4a3c] p-3 md:p-4 rounded-xl shadow-2xl border border-amber-950/40 z-10 select-text overflow-hidden"
            >
              {/* Wooden or leather cover border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-transparent to-white/10 pointer-events-none" />

              {/* The Inner Lined Paper */}
              <div className="relative p-6 md:p-10 min-h-[480px] max-h-[85vh] overflow-y-auto flex flex-col gap-4 text-vintage-dark rounded">
                {/* Background layer with filter */}
                <div
                  className="absolute inset-0 bg-vintage-cream shadow-inner border border-stone-300 pointer-events-none"
                  style={{ filter: 'url(#torn-paper)' }}
                />

                <div className="relative z-10 flex flex-col gap-4 w-full h-full">
                  {/* Close Button */}
                  <button
                    onClick={() => setViewingEntry(null)}
                    className="absolute top-0 right-0 z-20 p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300 rounded-full transition-colors cursor-pointer select-none"
                    id="btn-close-view-modal"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Vertical Margin Red line */}
                  <div className="absolute left-8 md:left-14 top-0 bottom-0 w-[1.5px] bg-red-400/30 pointer-events-none" />

                  {/* Header info */}
                  <div className="pl-6 md:pl-10 flex flex-col gap-3 select-none pb-4 border-b border-stone-300/50">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-typewriter">
                      {/* Date */}
                      <div className="flex items-center gap-1 text-vintage-sepia font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(viewingEntry.date)}</span>
                      </div>

                      {/* Mood Badge */}
                      <div className="flex items-center gap-1.5 mr-8 md:mr-10">
                        <span className="text-vintage-sepia font-bold">Cảm xúc:</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-serif font-bold text-xs border ${getMoodConfig(viewingEntry.mood).color} ${getMoodConfig(viewingEntry.mood).border}`}>
                          {getMoodConfig(viewingEntry.mood).emoji} {getMoodConfig(viewingEntry.mood).label}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold font-serif text-vintage-dark tracking-wide pt-2">
                      {viewingEntry.title}
                    </h3>
                  </div>

                  {/* Main Text Content on Lined Notebook */}
                  <div className="pl-6 md:pl-10 relative flex-1 notebook-lines font-mono text-stone-800 text-base leading-[1.8rem] whitespace-pre-wrap py-2">
                    {viewingEntry.content}
                  </div>

                  {/* Footer tags and decorations */}
                  {viewingEntry.tags.length > 0 && (
                    <div className="pl-6 md:pl-10 mt-6 pt-4 border-t border-stone-300/40 flex flex-wrap gap-1.5 select-none">
                      {viewingEntry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-stone-200/60 rounded text-stone-500 font-mono text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
