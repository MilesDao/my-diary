import React, { useState, useRef } from 'react';
import { DiaryEntry, DiaryMetadata, MOODS, BookReview } from '../types';
import { X, Save, ShieldAlert, Download, Upload, BarChart2, User, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  metadata: DiaryMetadata;
  entries: DiaryEntry[];
  reviews: BookReview[];
  onSave: (metadata: DiaryMetadata) => void;
  onClose: () => void;
  onImport: (importedEntries: DiaryEntry[], importedReviews?: BookReview[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  metadata,
  entries,
  reviews,
  onSave,
  onClose,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'backup'>('profile');
  const [title, setTitle] = useState(metadata.title);
  const [tagline, setTagline] = useState(metadata.tagline);
  const [authorName, setAuthorName] = useState(metadata.authorName);
  const [avatarUrl, setAvatarUrl] = useState(metadata.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset vintage avatar images (high-quality Unsplash sketch-style portraits or avatars)
  const avatarPresets = [
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200', label: 'Cổ điển B&W' },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200', label: 'Nam Phác thảo' },
    { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200&h=200', label: 'Nữ Vẽ nét' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', label: 'Vintage Sepia' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim() || 'My Diary',
      tagline: tagline.trim() || 'A place for your thoughts and memories',
      authorName: authorName.trim() || 'Nhật ký của tôi',
      avatarUrl,
    });
    onClose();
  };

  // Export diary entries as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify({ entries, reviews }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `nhat_ky_va_ke_sach_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import diary entries from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const parsedData = JSON.parse(fileContent);

        if (Array.isArray(parsedData)) {
          // Legacy format (just entries array)
          const validEntries = parsedData.filter(
            (item) => item && typeof item === 'object' && 'title' in item && 'content' in item
          );

          if (validEntries.length > 0) {
            onImport(validEntries as DiaryEntry[], []);
            alert(`Đã nhập thành công ${validEntries.length} trang nhật ký!`);
            onClose();
          } else {
            alert('Tệp tin không chứa trang nhật ký hợp lệ.');
          }
        } else if (parsedData && typeof parsedData === 'object') {
          // Combined format
          const importedEntries = Array.isArray(parsedData.entries) ? parsedData.entries : [];
          const importedReviews = Array.isArray(parsedData.reviews) ? parsedData.reviews : [];

          const validEntries = importedEntries.filter(
            (item: any) => item && typeof item === 'object' && 'title' in item && 'content' in item
          );
          const validReviews = importedReviews.filter(
            (item: any) => item && typeof item === 'object' && 'title' in item && 'author' in item && 'reviewContent' in item
          );

          if (validEntries.length > 0 || validReviews.length > 0) {
            onImport(validEntries as DiaryEntry[], validReviews as BookReview[]);
            alert(`Đã nhập thành công ${validEntries.length} trang nhật ký và ${validReviews.length} bài review sách!`);
            onClose();
          } else {
            alert('Tệp tin không chứa nhật ký hoặc review sách hợp lệ.');
          }
        } else {
          alert('Định dạng tệp tin không hợp lệ.');
        }
      } catch (err) {
        alert('Có lỗi xảy ra khi đọc tệp tin. Hãy chắc chắn đó là tệp JSON xuất ra từ ứng dụng.');
      }
    };

    reader.readAsText(file);
  };

  // Calculate statistics
  const totalEntries = entries.length;
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const moodDistribution = MOODS.map((m) => {
    const count = entries.filter((e) => e.mood === m.type).length;
    const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
    return { ...m, count, percentage };
  }).sort((a, b) => b.count - a.count);

  // Write streak calculations
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    const uniqueDates = Array.from(new Set(entries.map((e) => e.date)))
      .map((d) => new Date(d as string).getTime())
      .sort((a, b) => b - a); // descending order

    let streak = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    // Check if wrote today or yesterday to continue streak
    const latestDate = uniqueDates[0];
    const diffFromToday = todayMs - latestDate;

    if (diffFromToday > oneDay) {
      return 0; // Streak broken if latest entry was more than 1 day ago
    }

    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = uniqueDates[i] - uniqueDates[i + 1];
      if (diff === oneDay) {
        streak++;
      } else if (diff > oneDay) {
        break; // Streak broken
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm select-none" id="settings-modal">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg p-6 md:p-8 flex flex-col gap-5 text-vintage-dark z-10 overflow-hidden">
        {/* Background layer with filter */}
        <div
          className="absolute inset-0 bg-vintage-cream rounded shadow-2xl border border-stone-300 pointer-events-none"
          style={{ filter: 'url(#torn-paper)' }}
        />

        <div className="relative z-10 flex flex-col gap-5 w-full">
          {/* Subtle binder rings */}
          <div className="flex justify-around absolute top-0 left-0 right-0 -translate-y-3 pointer-events-none opacity-30 px-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-3 h-6 rounded-full border border-stone-400 bg-gradient-to-b from-stone-300 to-stone-500 shadow-sm" />
              </div>
            ))}
          </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-stone-200/80 hover:bg-stone-300/80 rounded border border-stone-300 cursor-pointer"
          id="btn-close-settings"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="pt-2 select-none">
          <h3 className="text-xl font-bold font-serif text-vintage-sepia flex items-center gap-2">
            ⚙️ Cấu hình & Kỷ niệm
          </h3>
          <p className="text-xs text-stone-500 font-mono mt-1">Cài đặt nhật ký cá nhân</p>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-stone-300/60 font-typewriter text-xs font-bold gap-1 mt-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 -mb-px border-t border-x rounded-t transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-vintage-cream border-stone-300 border-b-transparent text-vintage-dark'
                : 'bg-stone-200/50 border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            Cá nhân
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 -mb-px border-t border-x rounded-t transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-vintage-cream border-stone-300 border-b-transparent text-vintage-dark'
                : 'bg-stone-200/50 border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 inline mr-1" />
            Thống kê
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 -mb-px border-t border-x rounded-t transition-colors cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-vintage-cream border-stone-300 border-b-transparent text-vintage-dark'
                : 'bg-stone-200/50 border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
            Sao lưu
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 min-h-[260px] overflow-y-auto pr-1">
          {/* TAB 1: PROFILE SETUP */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 select-none">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia">
                  Tên Nhật Ký (Tiêu đề chính):
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-1.5 rounded border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-vintage-sepia text-stone-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia">
                  Châm ngôn / Lời tựa nhật ký:
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="px-3 py-1.5 rounded border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-vintage-sepia text-stone-800"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-typewriter font-bold text-vintage-sepia">
                  Ảnh đại diện chủ nhật ký (Link ảnh):
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL hình ảnh đại diện..."
                  className="px-3 py-1.5 rounded border border-stone-300 bg-stone-50 text-xs focus:outline-none focus:border-vintage-sepia text-stone-800 font-mono"
                  required
                />
              </div>

              {/* Avatar Preset Buttons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-typewriter text-stone-500">Hoặc chọn mẫu ảnh ký họa:</span>
                <div className="flex gap-2">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`flex-1 text-[10px] py-1 rounded border transition-all ${
                        avatarUrl === preset.url
                          ? 'bg-vintage-sepia text-vintage-cream border-vintage-sepia font-bold'
                          : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-vintage-dark hover:bg-vintage-sepia text-vintage-cream font-typewriter font-bold text-xs shadow transition-all rounded cursor-pointer"
                id="btn-save-profile"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông tin cá nhân</span>
              </button>
            </form>
          )}

          {/* TAB 2: JOURNAL STATS */}
          {activeTab === 'stats' && (
            <div className="flex flex-col gap-4 select-text">
              {/* Quick stats board */}
              <div className="grid grid-cols-2 gap-3 select-none">
                <div className="bg-stone-200/40 p-3 rounded border border-stone-300/40 text-center">
                  <div className="text-2xl font-bold font-mono text-vintage-sepia">{totalEntries}</div>
                  <div className="text-[10px] font-typewriter uppercase text-stone-500 mt-1">Trang nhật ký</div>
                </div>
                <div className="bg-stone-200/40 p-3 rounded border border-stone-300/40 text-center">
                  <div className="text-2xl font-bold font-mono text-emerald-800">
                    🔥 {currentStreak}
                  </div>
                  <div className="text-[10px] font-typewriter uppercase text-stone-500 mt-1">Chuỗi viết liên tục (ngày)</div>
                </div>
              </div>

              {/* Book reviews stats board */}
              <div className="grid grid-cols-2 gap-3 select-none mt-1">
                <div className="bg-stone-200/40 p-3 rounded border border-stone-300/40 text-center">
                  <div className="text-2xl font-bold font-mono text-amber-800">📚 {totalReviews}</div>
                  <div className="text-[10px] font-typewriter uppercase text-stone-500 mt-1">Sách đã review</div>
                </div>
                <div className="bg-stone-200/40 p-3 rounded border border-stone-300/40 text-center">
                  <div className="text-2xl font-bold font-mono text-amber-600">
                    ⭐ {averageRating}
                  </div>
                  <div className="text-[10px] font-typewriter uppercase text-stone-500 mt-1">Đánh giá trung bình</div>
                </div>
              </div>

              {/* Rating distribution */}
              {totalReviews > 0 && (
                <div className="flex flex-col gap-2 mt-1 select-none">
                  <h4 className="text-xs font-typewriter font-bold text-vintage-sepia flex items-center gap-1">
                    ⭐ Phân bố điểm đánh giá sách:
                  </h4>
                  <div className="flex flex-col gap-1.5 bg-stone-100/50 p-3 rounded border border-stone-200">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter((r) => r.rating === stars).length;
                      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                      if (count === 0) return null;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <span className="w-16 font-serif text-stone-700">{stars} sao</span>
                          <div className="flex-1 h-2.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right font-mono text-[10px] text-stone-500">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mood breakdown */}
              <div className="flex flex-col gap-2 mt-1">
                <h4 className="text-xs font-typewriter font-bold text-vintage-sepia flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Biểu đồ cảm xúc của bạn:
                </h4>
                {totalEntries === 0 ? (
                  <p className="text-xs text-stone-500 italic text-center py-4">Nhật ký trống, chưa có thống kê cảm xúc.</p>
                ) : (
                  <div className="flex flex-col gap-2 bg-stone-100/50 p-3 rounded border border-stone-200">
                    {moodDistribution.map((m) => {
                      if (m.count === 0) return null;
                      return (
                        <div key={m.type} className="flex items-center gap-2 text-xs">
                          <span className="w-16 font-serif text-stone-700">{m.emoji} {m.label}</span>
                          <div className="flex-1 h-3 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-vintage-sepia/70 to-vintage-dark/90 rounded-full transition-all duration-500"
                              style={{ width: `${m.percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right font-mono text-[11px] text-stone-500">
                            {m.count} ({m.percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP / JSON IMPORT */}
          {activeTab === 'backup' && (
            <div className="flex flex-col gap-4 select-none">
              <div className="bg-stone-100/70 p-4 rounded border border-stone-200 text-xs text-stone-600 leading-relaxed">
                <span className="font-bold text-vintage-sepia flex items-center gap-1 mb-1">
                  💡 Vì sao dữ liệu chỉ lưu trên máy?
                </span>
                Nhật ký của bạn được lưu hoàn toàn trên trình duyệt của thiết bị này nhằm bảo vệ 100% quyền riêng tư. Hãy xuất tệp tin dự phòng định kỳ để lưu trữ hoặc nhập sang thiết bị khác mà không lo mất dữ liệu.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {/* Export button */}
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={entries.length === 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-vintage-dark font-typewriter font-bold text-xs border border-stone-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất Nhật Ký (JSON)</span>
                </button>

                {/* Import trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-vintage-dark font-typewriter font-bold text-xs border border-stone-300 rounded transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Nhập Nhật Ký (JSON)</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
