/**
 * js/views/HomeView.js
 * Trang chủ (Home Page) độc lập của ứng dụng 500 Câu Đố Trí Tuệ
 * Gồm:
 * 1. Home Header độc lập (Logo, Menu cuộn, Spotlight Search, Dark Mode, CTA Tiếp tục)
 * 2. Hero Banner truyền cảm hứng (Slogan, CTA Bắt đầu/Tiếp tục/Ngẫu nhiên)
 * 3. Progress Dashboard (Thống kê tiến độ giải đố cá nhân)
 * 4. Lưới 10 Chuyên đề (Topic Grid với thanh tiến độ và nút vào câu chưa giải)
 * 5. Lối tắt nhanh & Bộ sưu tập (Đã lưu ⭐, Cần ôn tập 🔄, Thử thách nhanh ⚡)
 * 6. Home Footer độc lập (Giới thiệu dự án, thống kê, bản quyền, back to top)
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";
import { escapeHtml } from "../utils/dom.js";

// Metadata 10 Chuyên Đề Chuẩn Xác
export const TOPICS = [
  {
    id: 1,
    tap: 1,
    phan: "Phương pháp loại trừ",
    title: "Phương pháp Loại trừ",
    range: "Câu 001 – 057",
    startId: 1,
    count: 57,
    icon: "🎯",
    color: "from-blue-500 to-indigo-600",
    borderHover: "hover:border-blue-400 dark:hover:border-blue-500",
    desc: "Loại bỏ dần các khả năng mâu thuẫn để tìm ra sự thật duy nhất."
  },
  {
    id: 2,
    tap: 1,
    phan: "Phương pháp đệ quy",
    title: "Phương pháp Đệ quy",
    range: "Câu 058 – 118",
    startId: 58,
    count: 61,
    icon: "🔄",
    color: "from-cyan-500 to-blue-600",
    borderHover: "hover:border-cyan-400 dark:hover:border-cyan-500",
    desc: "Giải bài toán lớn bằng cách quy về bài toán con tương tự đơn giản hơn."
  },
  {
    id: 3,
    tap: 1,
    phan: "Phương pháp suy diễn ngược",
    title: "Phương pháp Suy diễn ngược",
    range: "Câu 119 – 172",
    startId: 119,
    count: 54,
    icon: "⏪",
    color: "from-teal-500 to-emerald-600",
    borderHover: "hover:border-teal-400 dark:hover:border-teal-500",
    desc: "Lần ngược từ kết quả đã biết để khám phá nguyên nhân và khởi đầu ban đầu."
  },
  {
    id: 4,
    tap: 1,
    phan: "Phương pháp giả thiết",
    title: "Phương pháp Giả thiết",
    range: "Câu 173 – 232",
    startId: 173,
    count: 60,
    icon: "💡",
    color: "from-amber-500 to-orange-600",
    borderHover: "hover:border-amber-400 dark:hover:border-amber-500",
    desc: "Đặt ra các giả định hợp lý rồi đối chiếu kiểm chứng tính đúng đắn logic."
  },
  {
    id: 5,
    tap: 2,
    phan: "Phương pháp tính toán",
    title: "Phương pháp Tính toán",
    range: "Câu 233 – 285",
    startId: 233,
    count: 53,
    icon: "🔢",
    color: "from-emerald-500 to-green-600",
    borderHover: "hover:border-emerald-400 dark:hover:border-emerald-500",
    desc: "Áp dụng tư duy số học, đại số và phương trình để tìm giải pháp tối ưu."
  },
  {
    id: 6,
    tap: 2,
    phan: "Phương pháp phân tích",
    title: "Phương pháp Phân tích",
    range: "Câu 286 – 367",
    startId: 286,
    count: 82,
    icon: "🔍",
    color: "from-violet-500 to-purple-600",
    borderHover: "hover:border-violet-400 dark:hover:border-violet-500",
    desc: "Mổ xẻ từng chi tiết phức tạp thành các yếu tố logic đơn giản, mạch lạc."
  },
  {
    id: 7,
    tap: 2,
    phan: "Phương pháp vẽ hình",
    title: "Phương pháp Vẽ hình",
    range: "Câu 368 – 390",
    startId: 368,
    count: 23,
    icon: "📐",
    color: "from-pink-500 to-rose-600",
    borderHover: "hover:border-pink-400 dark:hover:border-pink-500",
    desc: "Trực quan hóa dữ kiện trừu tượng bằng sơ đồ hình học và bảng biểu quan hệ."
  },
  {
    id: 8,
    tap: 2,
    phan: "Phương pháp loại suy",
    title: "Phương pháp Loại suy",
    range: "Câu 391 – 437",
    startId: 391,
    count: 47,
    icon: "⚖️",
    color: "from-indigo-500 to-violet-600",
    borderHover: "hover:border-indigo-400 dark:hover:border-indigo-500",
    desc: "So sánh các mô hình tương đồng để rút ra kết luận chuẩn xác, thuyết phục."
  },
  {
    id: 9,
    tap: 2,
    phan: "Phương pháp tổng hợp",
    title: "Phương pháp Tổng hợp",
    range: "Câu 438 – 464",
    startId: 438,
    count: 27,
    icon: "🧩",
    color: "from-orange-500 to-red-600",
    borderHover: "hover:border-orange-400 dark:hover:border-orange-500",
    desc: "Kết hợp linh hoạt đa dạng phương pháp để chinh phục các câu đố đa tầng."
  },
  {
    id: 10,
    tap: 2,
    phan: "Thử làm Sherlock Holmes",
    title: "Thử làm Sherlock Holmes",
    range: "Câu 465 – 500",
    startId: 465,
    count: 36,
    icon: "🕵️‍♂️",
    color: "from-rose-500 to-red-700",
    borderHover: "hover:border-rose-400 dark:hover:border-rose-500",
    desc: "Hóa thân thành thám tử đại tài phá giải các vụ án hóc búa, ly kỳ kinh điển."
  }
];

export function renderHomeView(container) {
  let activeShortcutTab = "bookmarks"; // 'bookmarks' | 'review' | 'challenge'

  function update() {
    // Chỉ render khi store đang ở view 'home'
    if (store.currentView !== "home") {
      container.style.display = "none";
      return;
    }
    container.style.display = "block";

    const lastViewedId = store.getLastViewedOrFirstId();
    const stats = store.getStats();
    const isDark = store.theme === "dark";

    // 1. Dữ liệu Bookmark & Review
    const bookmarkedPuzzles = store.puzzles.filter((p) => store.bookmarkSet.has(p.id));
    const reviewPuzzles = store.puzzles.filter((p) => store.reviewSet.has(p.id));

    // 2. Dữ liệu Thử thách nhanh (3 câu chưa giải ngẫu nhiên)
    const unsolvedPuzzles = store.puzzles.filter((p) => !store.solvedSet.has(p.id));
    let challengePuzzles = [];
    if (unsolvedPuzzles.length >= 3) {
      // Chọn 3 câu phân bố đều
      const step = Math.floor(unsolvedPuzzles.length / 3);
      challengePuzzles = [
        unsolvedPuzzles[0],
        unsolvedPuzzles[step],
        unsolvedPuzzles[unsolvedPuzzles.length - 1]
      ];
    } else if (unsolvedPuzzles.length > 0) {
      challengePuzzles = unsolvedPuzzles;
    } else {
      challengePuzzles = store.puzzles.slice(0, 3);
    }

    container.innerHTML = `
      <!-- ==========================================================================
           1. HOME HEADER ĐỘC LẬP (Sticky Blur Bar)
           ========================================================================== -->
      <header class="fixed top-0 inset-x-0 z-40 bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <!-- Trái: Logo & Brand -->
          <div class="flex items-center gap-3">
            <a href="./" id="home-logo-link" class="flex items-center gap-2.5 group">
              <span class="text-2xl sm:text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🧩</span>
              <div>
                <span class="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">500 Câu Đố</span>
                <span class="hidden md:inline-block ml-2 px-2 py-0.5 text-2xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 rounded-full border border-orange-200/80 dark:border-orange-800/60">Tư Duy Logic</span>
              </div>
            </a>
          </div>

          <!-- Giữa: Menu cuộn nhanh Desktop -->
          <nav class="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600 dark:text-slate-300">
            <a href="#section-hero" class="px-3 py-1.5 rounded-lg hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Trang chủ</a>
            <a href="#section-progress" class="px-3 py-1.5 rounded-lg hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Tiến độ</a>
            <a href="#section-topics" class="px-3 py-1.5 rounded-lg hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">10 Chuyên đề</a>
            <a href="#section-shortcuts" class="px-3 py-1.5 rounded-lg hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Bộ sưu tập</a>
          </nav>

          <!-- Phải: Spotlight Search, Theme & Nút CTA Vào giải đố -->
          <div class="flex items-center gap-2">
            <!-- Nút tìm kiếm Spotlight -->
            <button id="home-btn-search"
              class="flex items-center gap-2 px-3 py-2 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/70 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Tìm kiếm câu đố (Ctrl+K / /)">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="hidden sm:inline">Tìm kiếm</span>
              <kbd class="hidden sm:inline-flex px-1.5 py-0.5 text-2xs font-mono font-semibold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">⌘K</kbd>
            </button>

            <!-- Nút Theme -->
            <button id="home-btn-theme"
              class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-sm"
              title="Chuyển chế độ Sáng / Tối (Phím D)">
              ${isDark ? "☀️" : "🌙"}
            </button>

            <!-- Nút CTA Chính: Tiếp tục câu đố -->
            <button id="home-btn-continue"
              class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer transform active:scale-95">
              <span>${stats.solved > 0 ? `Tiếp tục câu #${lastViewedId}` : "Bắt đầu ngay"}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      <!-- ==========================================================================
           2. HERO BANNER SECTION (Khối giới thiệu & Kêu gọi hành động)
           ========================================================================== -->
      <section id="section-hero" class="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <!-- Hiệu ứng vầng sáng trang trí background -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-gradient-to-tr from-orange-400/15 via-amber-300/10 to-transparent dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div class="absolute top-2/3 right-10 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <!-- Tiêu đề lớn Hero -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-[1.25] lg:leading-[1.25] max-w-4xl mx-auto">
            Rèn Luyện Tư Duy Logic & <br class="hidden sm:inline" />
            <span class="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">Đỉnh Cao Trí Tuệ</span>
          </h1>

          <!-- Mô tả ngắn -->
          <p class="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chinh phục 10 phương pháp tư duy toán học và hình học đỉnh cao. Từ suy luận loại trừ, giải bài toán đệ quy đến nghệ thuật suy đoán của Sherlock Holmes.
          </p>

          <!-- 3 Nút Hành Động Nổi Bật -->
          <div class="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <!-- Nút Bắt đầu / Tiếp tục -->
            <button id="hero-btn-start"
              class="px-6 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
              <span>${stats.solved > 0 ? `Tiếp tục câu #${lastViewedId}` : "Bắt đầu từ câu #1"}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Nút Ngẫu Nhiên -->
            <button id="hero-btn-random"
              class="px-6 py-3.5 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
              <span class="text-base">🎲</span>
              <span>Thử thách ngẫu nhiên</span>
            </button>

            <!-- Nút Khám phá Chuyên đề -->
            <a href="#section-topics"
              class="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-semibold text-sm sm:text-base hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
              <span>Xem 10 Chuyên đề</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          <!-- Feature Badges -->
          <div class="mt-12 sm:mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <div class="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span class="text-emerald-500">✔</span>
              <span>500 Câu đố chọn lọc</span>
            </div>
            <div class="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span class="text-emerald-500">✔</span>
              <span>10 Phương pháp tư duy</span>
            </div>
            <div class="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span class="text-emerald-500">✔</span>
              <span>100% Vector SVG độ nét cao</span>
            </div>
            <div class="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span class="text-emerald-500">✔</span>
              <span>Lời giải chi tiết & Bảng vẽ nháp</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ==========================================================================
           3. PROGRESS DASHBOARD SECTION (Thống kê tiến độ cá nhân)
           ========================================================================== -->
      <section id="section-progress" class="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">Thống Kê Cá Nhân</div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hành Trình Rèn Luyện Của Bạn</h2>
            </div>
            <div class="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Đã hoàn thành: <span class="text-orange-600 dark:text-orange-400 font-extrabold text-lg">${stats.solved}</span> / ${stats.total} câu (${stats.percent}%)
            </div>
          </div>

          <!-- Thanh tiến độ lớn -->
          <div class="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-8 shadow-inner">
            <div class="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style="width: ${Math.max(stats.percent, 1)}%"></div>
          </div>

          <!-- 4 Card Thống Kê -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <!-- Card 1: Đã giải -->
            <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Đã giải đúng</span>
                <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">✓</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">${stats.solved}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">${stats.percent}% toàn bộ kho câu đố</div>
            </div>

            <!-- Card 2: Đã lưu Bookmark -->
            <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Đã lưu yêu thích</span>
                <span class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">⭐</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">${stats.bookmarked}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Câu đố cần xem lại</div>
            </div>

            <!-- Card 3: Cần ôn tập -->
            <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Cần ngẫm lại</span>
                <span class="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">🔄</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">${stats.review}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Cần rèn luyện thêm</div>
            </div>

            <!-- Card 4: Còn lại -->
            <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Chưa thử sức</span>
                <span class="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">⚡</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">${stats.total - stats.solved}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Sẵn sàng chờ bạn khám phá</div>
            </div>

          </div>

        </div>
      </section>

      <!-- ==========================================================================
           4. TOPICS GRID SECTION (Lưới 10 Chuyên Đề)
           ========================================================================== -->
      <section id="section-topics" class="py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">Trọn Bộ 10 Chuyên Đề</div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hệ Thống Phương Pháp Giải Đố</h2>
            <p class="mt-3 text-base text-slate-600 dark:text-slate-300">
              Phân bổ từ Tập 1 (Phần 1 - 4) đến Tập 2 (Phần 5 - 10). Nhấp vào chuyên đề để tiếp tục các câu chưa giải hoặc mở danh mục tra cứu.
            </p>
          </div>

          <!-- Lưới 10 Card -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${TOPICS.map((topic) => {
              const topicStat = store.getTopicStats(topic.phan);
              const nearestId = store.getNearestUnsolvedForTopic(topic.phan);
              const isCompleted = topicStat.solved === topicStat.total && topicStat.total > 0;

              return `
                <div class="topic-card group relative bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-orange-400 dark:hover:border-orange-500/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                  data-phan="${escapeHtml(topic.phan)}"
                  data-nearest-id="${nearestId}">
                  
                  <div>
                    <!-- Top row: Tập badge & Icon -->
                    <div class="flex items-center justify-between mb-4">
                      <span class="px-2.5 py-1 text-2xs font-bold uppercase tracking-wide rounded-full ${
                        topic.tap === 1
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60'
                          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/60'
                      }">
                        Tập ${topic.tap} · Phần ${topic.id}
                      </span>
                      <span class="text-3xl group-hover:scale-110 transition-transform">${topic.icon}</span>
                    </div>

                    <!-- Tiêu đề & Dải câu -->
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
                      ${escapeHtml(topic.title)}
                    </h3>
                    <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      ${topic.range} (${topic.count} câu)
                    </div>

                    <!-- Mô tả phương pháp -->
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-2">
                      ${escapeHtml(topic.desc)}
                    </p>
                  </div>

                  <!-- Bottom: Tiến độ chuyên đề & Nút tác vụ -->
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    
                    <div class="flex items-center justify-between text-2xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <span>Tiến độ: ${topicStat.solved}/${topicStat.total}</span>
                      <span class="${isCompleted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}">
                        ${isCompleted ? 'Hoàn thành ✓' : `${topicStat.percent}%`}
                      </span>
                    </div>

                    <!-- Progress bar -->
                    <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                      <div class="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                        style="width: ${topicStat.percent}%"></div>
                    </div>

                    <!-- Nút thao tác -->
                    <div class="flex items-center gap-2">
                      <!-- Nút chính: Vào học ngay -->
                      <button class="btn-jump-topic flex-1 py-2 px-3 bg-slate-900 hover:bg-orange-600 dark:bg-slate-800 dark:hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        data-id="${nearestId}">
                        <span>${topicStat.solved > 0 ? `Tiếp tục (#${nearestId})` : "Vào học ngay"}</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <!-- Nút phụ: Mở mục lục -->
                      <button class="btn-open-drawer-topic p-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
                        title="Mở danh sách câu đố của ${escapeHtml(topic.title)}"
                        data-phan="${escapeHtml(topic.phan)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </button>
                    </div>

                  </div>

                </div>
              `;
            }).join("")}
          </div>

        </div>
      </section>

      <!-- ==========================================================================
           5. QUICK SHORTCUTS & COLLECTIONS SECTION (Lối tắt & Bộ sưu tập)
           ========================================================================== -->
      <section id="section-shortcuts" class="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/70 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">Lối Tắt Nhanh</div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Bộ Sưu Tập Của Bạn</h2>
            </div>

            <!-- Tab Switcher -->
            <div class="inline-flex p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/70 shadow-2xs self-start sm:self-auto">
              <button class="shortcut-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeShortcutTab === 'bookmarks'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }" data-tab="bookmarks">
                ⭐ Đã lưu (${bookmarkedPuzzles.length})
              </button>
              <button class="shortcut-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeShortcutTab === 'review'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }" data-tab="review">
                🔄 Cần ôn tập (${reviewPuzzles.length})
              </button>
              <button class="shortcut-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeShortcutTab === 'challenge'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }" data-tab="challenge">
                ⚡ Thử thách nhanh
              </button>
            </div>
          </div>

          <!-- Nội dung theo Tab -->
          <div class="min-h-[220px]">
            ${
              activeShortcutTab === "bookmarks"
                ? renderPuzzleList(bookmarkedPuzzles, "Chưa có câu đố nào được lưu. Hãy bấm biểu tượng ⭐ khi giải câu đố để lưu lại tại đây!", "⭐")
                : activeShortcutTab === "review"
                ? renderPuzzleList(reviewPuzzles, "Chưa có câu đố nào cần ôn tập. Hãy bấm 'Cần ngẫm lại' khi giải xong một câu đố hóc búa!", "🔄")
                : renderPuzzleList(challengePuzzles, "Tuyệt vời! Bạn đã hoàn thành toàn bộ 500 câu đố!", "⚡")
            }
          </div>

        </div>
      </section>

      <!-- ==========================================================================
           6. HOME FOOTER ĐỘC LẬP (Thông tin dự án, Thống kê, Bản quyền)
           ========================================================================== -->
      <footer class="bg-white dark:bg-[#070b13] border-t border-slate-200/80 dark:border-slate-800/80 pt-12 pb-16 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <!-- Cột 1: Thông tin thương hiệu -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-2.5 mb-4">
                <span class="text-3xl">🧩</span>
                <span class="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">500 Câu Đố Trí Tuệ</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-4">
                Nền tảng rèn luyện tư duy logic, toán học và hình học trực quan hàng đầu. Trọn bộ 500 câu đố kinh điển được biên soạn chuẩn xác và minh họa bằng đồ họa Vector SVG độ nét cao.
              </p>
              <div class="flex items-center gap-2 text-2xs text-slate-500 dark:text-slate-400">
                <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Vanilla JS ES6+</span>
                <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Tailwind CSS v4</span>
                <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">KaTeX Math</span>
              </div>
            </div>

            <!-- Cột 2: Điều hướng nhanh -->
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Khám Phá</div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                <li><a href="#section-hero" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Trang chủ</a></li>
                <li><a href="#section-topics" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">10 Chuyên đề</a></li>
                <li><a href="#section-progress" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Tiến độ giải đố</a></li>
                <li><a href="#section-shortcuts" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Bộ sưu tập cá nhân</a></li>
              </ul>
            </div>

            <!-- Cột 3: Tiện ích & Hỗ trợ -->
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Tiện Ích</div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                <li>
                  <button id="footer-btn-search" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                    Mở Spotlight tìm kiếm (⌘K)
                  </button>
                </li>
                <li>
                  <button id="footer-btn-random" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                    Câu đố ngẫu nhiên (Phím R)
                  </button>
                </li>
                <li>
                  <button id="footer-btn-theme" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                    Chuyển giao diện (Phím D)
                  </button>
                </li>
                <li>
                  <button id="footer-btn-back-top" class="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1">
                    <span>Lên đầu trang</span>
                    <span>↑</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <!-- Dòng bản quyền cuối -->
          <div class="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs sm:text-xs text-slate-500 dark:text-slate-400">
            <div>
              © 2026 <strong class="text-slate-700 dark:text-slate-200">500 Câu Đố Trí Tuệ & Tư Duy Logic</strong>. All rights reserved.
            </div>
            <div class="flex items-center gap-4">
              <span>500 Câu Đố</span>
              <span>·</span>
              <span>10 Chuyên Đề</span>
              <span>·</span>
              <span>100% Vector SVG</span>
            </div>
          </div>

        </div>
      </footer>
    `;

    // ==========================================================================
    // GẮN SỰ KIỆN TƯƠNG TÁC CHO HOME VIEW
    // ==========================================================================

    // 1. Nút Vào câu đố / Tiếp tục
    container.querySelector("#home-btn-continue")?.addEventListener("click", () => {
      navigateToPuzzle(lastViewedId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    container.querySelector("#hero-btn-start")?.addEventListener("click", () => {
      navigateToPuzzle(lastViewedId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 2. Nút Ngẫu nhiên
    const handleRandom = () => {
      const randomId = store.getRandomUnsolvedId();
      navigateToPuzzle(randomId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    container.querySelector("#hero-btn-random")?.addEventListener("click", handleRandom);
    container.querySelector("#footer-btn-random")?.addEventListener("click", handleRandom);

    // 3. Nút Spotlight Tìm kiếm
    const handleOpenSearch = () => {
      store.openDrawerWithTopic("Tất cả chuyên đề");
    };
    container.querySelector("#home-btn-search")?.addEventListener("click", handleOpenSearch);
    container.querySelector("#footer-btn-search")?.addEventListener("click", handleOpenSearch);

    // 4. Nút Đổi Theme
    const handleToggleTheme = () => {
      store.toggleTheme();
    };
    container.querySelector("#home-btn-theme")?.addEventListener("click", handleToggleTheme);
    container.querySelector("#footer-btn-theme")?.addEventListener("click", handleToggleTheme);

    // 5. Nút Lên đầu trang
    container.querySelector("#footer-btn-back-top")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 6. Nút chuyển Tab trong Bộ sưu tập
    container.querySelectorAll(".shortcut-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        activeShortcutTab = e.currentTarget.dataset.tab;
        update();
      });
    });

    // 7. Nút Click trên từng Chuyên đề
    container.querySelectorAll(".btn-jump-topic").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        if (id) {
          navigateToPuzzle(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    // 8. Nút Mở Mục Lục Chuyên đề
    container.querySelectorAll(".btn-open-drawer-topic").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const phan = e.currentTarget.dataset.phan;
        // Mở Spotlight drawer với đúng chuyên đề được chọn
        store.openDrawerWithTopic(phan);
      });
    });

    // 9. Nút Click mở câu đố trong danh sách lối tắt
    container.querySelectorAll(".btn-open-shortcut-puzzle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        if (id) {
          navigateToPuzzle(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  // Hàm render danh sách câu đố dạng card tinh gọn
  function renderPuzzleList(list, emptyMessage, icon) {
    if (!list || list.length === 0) {
      return `
        <div class="text-center py-12 px-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <span class="text-3xl block mb-2">${icon}</span>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">${escapeHtml(emptyMessage)}</p>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${list.slice(0, 9).map((p) => {
          const isSolved = store.solvedSet.has(p.id);
          const isBookmarked = store.bookmarkSet.has(p.id);

          return `
            <div class="btn-open-shortcut-puzzle group bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/70 hover:border-orange-400 dark:hover:border-orange-500/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              data-id="${p.id}">
              
              <div class="mb-3">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <span class="font-mono font-bold text-xs text-orange-600 dark:text-orange-400">#${p.id}</span>
                  <div class="flex items-center gap-1 text-2xs">
                    ${isSolved ? '<span class="text-emerald-500 font-semibold">✓ Đã giải</span>' : ''}
                    ${isBookmarked ? '<span>⭐</span>' : ''}
                    <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">${p.muc_do || 'Trung bình'}</span>
                  </div>
                </div>
                <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                  ${escapeHtml(p.title)}
                </h4>
                <p class="text-2xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  ${escapeHtml(p.tom_tat || p.de_bai || '')}
                </p>
              </div>

              <div class="flex items-center justify-between text-2xs font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>${escapeHtml(p.phan || '')}</span>
                <span class="text-orange-500 group-hover:translate-x-0.5 transition-transform">Giải ngay →</span>
              </div>

            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // Đăng ký lắng nghe thay đổi store
  store.subscribe(update);

  // Render lần đầu
  update();
}
