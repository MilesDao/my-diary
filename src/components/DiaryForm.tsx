import React, { useState, useEffect } from 'react';
import { DiaryEntry, MoodType, MOODS } from '../types';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';

interface DiaryFormProps {
  entry?: DiaryEntry | null; // If editing, we pass the existing entry
  onSave: (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [mood, setMood] = useState<MoodType>('serene');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Initialize form if editing an entry
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setDate(entry.date);
      setMood(entry.mood);
      setTags(entry.tags);
    } else {
      // Clear for new entry
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      setMood('serene');
      setTags([]);
    }
  }, [entry]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }
    onSave({
      title: title.trim(),
      content: content.trim(),
      date,
      mood,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto flex flex-col gap-6" id="diary-form">
      {/* Form Action Bar on top */}
      <div className="flex justify-between items-center z-10 select-none">
        <button
          type="button"
          onClick={onCancel}
          className="relative flex items-center gap-2 px-4 py-2 text-vintage-dark font-typewriter text-xs transition-all rounded group cursor-pointer"
          id="btn-cancel"
        >
          <div className="absolute inset-0 bg-stone-200/90 group-hover:bg-stone-300/90 border border-stone-300 rounded pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </span>
        </button>

        <button
          type="submit"
          disabled={!title.trim() || !content.trim()}
          className="relative flex items-center gap-2 px-5 py-2.5 text-vintage-cream font-typewriter font-bold text-sm transition-all rounded disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          id="btn-save-diary"
        >
          <div className="absolute inset-0 bg-vintage-dark group-hover:bg-vintage-sepia rounded pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
          <span className="relative z-10 flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Lưu Bút Ký</span>
          </span>
        </button>
      </div>

      {/* Writing Pad Card */}
      <div className="relative w-full p-6 md:p-8 flex flex-col gap-4 text-vintage-dark">
        {/* Background layer with filter */}
        <div
          className="absolute inset-0 bg-vintage-cream rounded shadow-lg border border-stone-300/50 pointer-events-none"
          style={{ filter: 'url(#torn-paper)' }}
        />

        <div className="relative z-10 flex flex-col gap-4 w-full">
          {/* Subtle binder rings visual on top of the card */}
          <div className="flex justify-around absolute top-0 left-0 right-0 -translate-y-3 pointer-events-none opacity-40 px-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-4 h-8 rounded-full border-2 border-stone-400 bg-gradient-to-b from-stone-300 to-stone-500 shadow-md" />
                <div className="w-3 h-3 rounded-full bg-vintage-sepia/20 -mt-1" />
              </div>
            ))}
          </div>

          {/* Info row: Date Picker and Mood Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 pb-2 border-b border-stone-300/60 select-none">
            {/* Date Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                Ngày viết:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 font-mono focus:outline-none focus:border-vintage-sepia text-sm cursor-pointer"
                required
                id="diary-date-picker"
              />
            </div>

            {/* Tag input inline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                Từ khóa / Thẻ nhớ:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ví dụ: chuyến đi, gia đình..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 focus:outline-none focus:border-vintage-sepia text-sm"
                  id="diary-tag-input"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-1.5 bg-stone-200/80 hover:bg-stone-300/80 text-vintage-dark border border-stone-300 rounded transition-all"
                  id="btn-add-tag"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Tag list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 py-1 select-none">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-200/70 text-vintage-sepia font-mono text-xs border border-stone-300/50"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:bg-stone-300 rounded-full text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Mood select block */}
          <div className="flex flex-col gap-2 select-none">
            <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
              Cảm xúc lúc này:
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.type;
                return (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => setMood(m.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${isSelected
                        ? `${m.color} ${m.border} scale-105 ring-2 ring-vintage-sepia/10 font-bold shadow-sm`
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    id={`mood-option-${m.type}`}
                  >
                    <span className="text-sm">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paper title */}
          <div className="flex flex-col gap-1 mt-2">
            <input
              type="text"
              placeholder="Đặt tiêu đề kỷ niệm..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b-2 border-dashed border-stone-400/40 py-2 text-xl font-bold font-serif focus:outline-none focus:border-vintage-sepia/70 text-vintage-dark placeholder-stone-400"
              required
              id="diary-title-input"
            />
          </div>

          {/* Lined Notebook Area */}
          <div className="relative mt-2 flex-1">
            {/* Vertical notebook red margin line visual */}
            <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/30" />

            <textarea
              placeholder="Hôm nay của bạn thế nào? Hãy viết lại những suy nghĩ, cảm xúc và kỷ niệm đẹp đẽ..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="notebook-lines w-full pl-10 pr-4 bg-transparent border-none outline-none focus:ring-0 resize-none font-mono text-stone-800 leading-[1.8rem] text-sm placeholder-stone-400/80 focus:outline-none"
              required
              style={{
                paddingTop: '0.1rem',
                minHeight: '21.6rem', // 12 lines * 1.8rem
              }}
              id="diary-content-input"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
