import React, { useState, useEffect } from 'react';
import { BookReview } from '../types';
import { Plus, X, Save, ArrowLeft, Star, Image, BookOpen } from 'lucide-react';
import { BookCover } from './BookReviewList';

interface BookReviewFormProps {
  review?: BookReview | null; // If editing, we pass the existing review
  onSave: (reviewData: Omit<BookReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const BookReviewForm: React.FC<BookReviewFormProps> = ({ review, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [dateFinished, setDateFinished] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [reviewContent, setReviewContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Initialize form if editing
  useEffect(() => {
    if (review) {
      setTitle(review.title);
      setAuthor(review.author);
      setCoverUrl(review.coverUrl || '');
      setBookUrl(review.bookUrl || '');
      setRating(review.rating);
      setDateFinished(review.dateFinished);
      setReviewContent(review.reviewContent);
      setTags(review.tags);
    } else {
      // Clear for new review
      setTitle('');
      setAuthor('');
      setCoverUrl('');
      setBookUrl('');
      setRating(5);
      setDateFinished(new Date().toISOString().split('T')[0]);
      setReviewContent('');
      setTags([]);
    }
  }, [review]);

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
    if (!title.trim() || !author.trim() || !reviewContent.trim()) {
      return;
    }
    onSave({
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim() || undefined,
      bookUrl: bookUrl.trim() || undefined,
      rating,
      reviewContent: reviewContent.trim(),
      dateFinished,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto flex flex-col gap-6" id="book-review-form">
      {/* Form Action Bar on top */}
      <div className="flex justify-between items-center z-10 select-none">
        <button
          type="button"
          onClick={onCancel}
          className="relative flex items-center gap-2 px-4 py-2 text-vintage-dark font-typewriter text-xs transition-all rounded group cursor-pointer"
          id="btn-book-cancel"
        >
          <div className="absolute inset-0 bg-stone-200/90 group-hover:bg-stone-300/90 border border-stone-300 rounded pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </span>
        </button>

        <button
          type="submit"
          disabled={!title.trim() || !author.trim() || !reviewContent.trim()}
          className="relative flex items-center gap-2 px-5 py-2.5 text-vintage-cream font-typewriter font-bold text-sm transition-all rounded disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          id="btn-save-book-review"
        >
          <div className="absolute inset-0 bg-vintage-dark group-hover:bg-vintage-sepia rounded pointer-events-none" style={{ filter: 'url(#torn-paper-subtle)' }} />
          <span className="relative z-10 flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Lưu Review Sách</span>
          </span>
        </button>
      </div>

      {/* Writing Card Sheet */}
      <div className="relative w-full p-6 md:p-8 flex flex-col gap-6 text-vintage-dark">
        {/* Card Background */}
        <div
          className="absolute inset-0 bg-vintage-cream rounded shadow-lg border border-stone-300/50 pointer-events-none"
          style={{ filter: 'url(#torn-paper)' }}
        />

        <div className="relative z-10 flex flex-col gap-6 w-full">
          {/* Notebook binder rings */}
          <div className="flex justify-around absolute top-0 left-0 right-0 -translate-y-3 pointer-events-none opacity-40 px-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-4 h-8 rounded-full border-2 border-stone-400 bg-gradient-to-b from-stone-300 to-stone-500 shadow-md" />
                <div className="w-3 h-3 rounded-full bg-vintage-sepia/20 -mt-1" />
              </div>
            ))}
          </div>

          {/* Form Content Grid: Left side Cover Preview, Right side metadata inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-b border-stone-300/60 pb-6">
            {/* 1. Live Cover Preview on Left (Span 4) */}
            <div className="md:col-span-4 flex flex-col items-center gap-2 select-none border-b md:border-b-0 md:border-r border-stone-300/40 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-typewriter font-bold text-vintage-sepia uppercase tracking-wider mb-2">Xem trước bìa</span>
              <div className="w-32 md:w-40 shadow-xl rounded border border-stone-300/50">
                <BookCover title={title || 'Tên Sách'} author={author || 'Tác Giả'} coverUrl={coverUrl} />
              </div>
              <span className="text-[10px] text-stone-500 italic mt-2 text-center leading-normal">
                Bìa sách sẽ tự động tạo dựa trên tiêu đề nếu không nhập link ảnh bìa.
              </span>
            </div>

            {/* 2. Inputs on Right (Span 8) */}
            <div className="md:col-span-8 flex flex-col gap-4">
              {/* Row 1: Book Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                  Tên sách (bắt buộc):
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sách..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 focus:outline-none focus:border-vintage-sepia text-sm font-serif font-bold"
                  required
                  id="book-title-input"
                />
              </div>

              {/* Row 2: Book Author */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                  Tác giả (bắt buộc):
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên tác giả..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="px-3 py-2 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 focus:outline-none focus:border-vintage-sepia text-sm"
                  required
                  id="book-author-input"
                />
              </div>

              {/* Row 3: Cover Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-vintage-sepia" /> Tải ảnh bìa lên (tùy chọn):
                </label>
                <div className="flex items-center gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => document.getElementById('book-cover-file-input')?.click()}
                    className="px-4 py-2 bg-stone-200/80 hover:bg-stone-300/80 border border-stone-300 text-vintage-dark text-xs font-typewriter font-bold rounded transition-all cursor-pointer"
                  >
                    {coverUrl ? 'Chọn ảnh khác...' : 'Chọn ảnh từ máy...'}
                  </button>
                  <input
                    type="file"
                    id="book-cover-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCoverUrl(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  {coverUrl && (
                    <button
                      type="button"
                      onClick={() => setCoverUrl('')}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 border border-red-200 text-red-700 text-xs font-typewriter font-bold rounded transition-all cursor-pointer"
                    >
                      Xóa ảnh bìa
                    </button>
                  )}
                </div>
              </div>

              {/* Row 3.5: Book URL link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide flex items-center gap-1">
                  🔗 Liên kết sách (tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="Nhập liên kết mua sách hoặc thông tin sách (URL)..."
                  value={bookUrl}
                  onChange={(e) => setBookUrl(e.target.value)}
                  className="px-3 py-2 rounded border border-stone-300/70 bg-stone-100/40 text-stone-700 focus:outline-none focus:border-vintage-sepia text-xs font-mono"
                  id="book-url-input"
                />
              </div>

              {/* Row 4: Rating Selector & Date Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                {/* Rating selection (Stars) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                    Đánh giá của bạn:
                  </label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              isActive ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs text-stone-500 font-mono ml-2 font-bold">({rating}/5 sao)</span>
                  </div>
                </div>

                {/* Date finished picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                    Ngày đọc xong:
                  </label>
                  <input
                    type="date"
                    value={dateFinished}
                    onChange={(e) => setDateFinished(e.target.value)}
                    className="px-3 py-1.5 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 font-mono focus:outline-none focus:border-vintage-sepia text-sm cursor-pointer"
                    required
                    id="book-date-picker"
                  />
                </div>
              </div>

              {/* Row 5: Tag Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide">
                  Thể loại / Thẻ sách:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ví dụ: tiểu thuyết, triết lý, lịch sử..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(e);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded border border-stone-300/70 bg-stone-100/40 text-stone-800 focus:outline-none focus:border-vintage-sepia text-sm"
                    id="book-tag-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-1.5 bg-stone-200/80 hover:bg-stone-300/80 text-vintage-dark border border-stone-300 rounded transition-all cursor-pointer"
                    id="btn-book-add-tag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Render active tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 py-1">
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
              </div>
            </div>
          </div>

          {/* Lined Notebook Content Area for review text */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-typewriter font-bold text-vintage-sepia tracking-wide flex items-center gap-1 select-none">
              <BookOpen className="w-3.5 h-3.5 text-vintage-sepia" /> Viết review cảm nghĩ (bắt buộc):
            </label>
            <div className="relative mt-2 flex-1">
              {/* Vertical notebook red margin line */}
              <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/30 pointer-events-none" />

              <textarea
                placeholder="Hãy ghi lại những suy ngẫm, cảm xúc, bài học rút ra và những điểm đắt giá nhất của cuốn sách..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={12}
                className="notebook-lines w-full pl-10 pr-4 bg-transparent border-none outline-none focus:ring-0 resize-none font-mono text-stone-800 leading-[1.8rem] text-sm placeholder-stone-400/80 focus:outline-none"
                required
                style={{
                  paddingTop: '0.1rem',
                  minHeight: '21.6rem', // 12 lines * 1.8rem
                }}
                id="book-review-content-input"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
