/**
 * js/components/Header.js
 * Thanh điều hướng trên cùng với:
 * - Logo & Nút mở danh mục
 * - Ô nhảy nhanh số câu (#1 đến #500)
 * - Tiến độ giải đố
 * - Bộ nút tác vụ: Lưu (Bookmark), Chia sẻ (Share), Chế độ Sáng/Tối (Dark Mode) và Phím tắt
 */

import { store } from "../store/state.js";
import { navigateToPuzzle, navigateToHome } from "../router/router.js";
import { showToast } from "../utils/dom.js";

export function renderHeader(container) {
  function update() {
    const currentPuzzle = store.getCurrentPuzzle();
    const currentId = currentPuzzle ? currentPuzzle.id : 1;
    const totalPuzzles = store.puzzles.length || 500;
    const isBookmarked = currentPuzzle ? store.bookmarkSet.has(currentPuzzle.id) : false;
    const isDark = store.theme === "dark";

    container.innerHTML = `
      <header class="fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 transition-colors">
        <div class="w-full max-w-[96%] xl:max-w-[1700px] 2xl:max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-2">
          
          <!-- Trái: Logo & Tên web gọn -->
          <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a href="./" id="header-logo-link" class="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm tracking-tight hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              <span class="text-xl">🧩</span>
              <span class="hidden sm:inline font-extrabold text-slate-900 dark:text-white text-base">500 Câu Đố</span>
            </a>
          </div>

          <!-- Giữa: Thanh tìm kiếm Spotlight trung tâm -->
          <div class="flex items-center flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-2">
            <button id="btn-open-spotlight" 
              class="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/70 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-xl text-xs transition-all cursor-pointer shadow-2xs group"
              title="Mở Spotlight tìm kiếm & Mục lục (Ctrl+K / / / M)">
              <div class="flex items-center gap-2 min-w-0 truncate">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-orange-500 dark:group-hover:text-orange-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">#${currentId}</span>
                <span class="text-slate-300 dark:text-slate-600">·</span>
                <span class="truncate text-slate-400 dark:text-slate-500 font-medium">Tìm câu đố...</span>
              </div>
              <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-2xs font-mono font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shrink-0 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          <!-- Phải: Random 🎲, Bookmark ⭐, Theme ☀️/🌙, Menu Phím tắt ⌨️ -->
          <div class="flex items-center gap-0.5 sm:gap-1">
            <!-- Nút Ngẫu Nhiên -->
            <button id="btn-random-puzzle"
              class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
              title="Câu ngẫu nhiên (Phím R)">
              <span class="text-base leading-none">🎲</span>
            </button>

            <!-- Nút Bookmark -->
            <button id="btn-toggle-bookmark"
              class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                isBookmarked ? 'text-amber-500 dark:text-amber-400' : ''
              }"
              title="${isBookmarked ? 'Đã lưu câu đố' : 'Lưu câu đố'} (Phím B)">
              <span class="text-base leading-none">${isBookmarked ? "⭐" : "☆"}</span>
            </button>

            <!-- Nút Đổi Theme -->
            <button id="btn-toggle-theme"
              class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-sm"
              title="Chuyển chế độ Sáng / Tối (Phím D)">
              ${isDark ? "☀️" : "🌙"}
            </button>

            <!-- Nút Trợ giúp phím tắt & Tiện ích -->
            <button id="btn-help-shortcuts"
              class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Phím tắt & Trợ giúp">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>

        </div>
      </header>
    `;

    // Gắn sự kiện Logo
    container.querySelector("#header-logo-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToHome();
    });

    // Gắn sự kiện mở Spotlight
    container.querySelector("#btn-open-spotlight")?.addEventListener("click", () => {
      store.setDrawerOpen(true);
    });

    // Gắn sự kiện Ngẫu nhiên
    container.querySelector("#btn-random-puzzle")?.addEventListener("click", () => {
      const randomId = store.getRandomUnsolvedId();
      navigateToPuzzle(randomId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Gắn sự kiện Bookmark
    container.querySelector("#btn-toggle-bookmark")?.addEventListener("click", () => {
      store.toggleBookmark();
      const nowBookmarked = store.bookmarkSet.has(store.currentPuzzleId);
      showToast(nowBookmarked ? "Đã lưu vào danh sách yêu thích ⭐" : "Đã bỏ lưu câu đố", "info");
    });

    // Gắn sự kiện Đổi Theme
    container.querySelector("#btn-toggle-theme")?.addEventListener("click", () => {
      store.toggleTheme();
    });

    // Gắn sự kiện Phím tắt
    container.querySelector("#btn-help-shortcuts")?.addEventListener("click", () => {
      showShortcutsModal();
    });
  }

  store.subscribe(update);
  update();
}

/**
 * Hiển thị Modal hướng dẫn phím tắt nâng cấp
 */
function showShortcutsModal() {
  const existing = document.getElementById("shortcuts-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "shortcuts-modal";
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm";
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 class="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2">
          ⌨️ Phím Tắt Nhanh
        </h3>
        <button id="close-shortcuts-modal" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">✕</button>
      </div>

      <div class="mt-4 space-y-3 text-sm">
        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Câu trước / Câu sau</span>
          <div class="flex gap-1">
            <kbd class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">←</kbd>
            <kbd class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">→</kbd>
          </div>
        </div>

        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Mở / Đóng đáp án</span>
          <kbd class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">Space</kbd>
        </div>

        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Spotlight tìm kiếm & Nhảy câu</span>
          <div class="flex gap-1">
            <kbd class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">Ctrl+K</kbd>
            <kbd class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">/</kbd>
            <kbd class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">M</kbd>
          </div>
        </div>

        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Lưu / Bỏ lưu câu đố</span>
          <kbd class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">B</kbd>
        </div>

        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Góc nháp & Vẽ hình</span>
          <kbd class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">C</kbd>
        </div>

        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-300">Bật / Tắt Chế độ Tối</span>
          <kbd class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">D</kbd>
        </div>

        <div class="flex items-center justify-between py-1.5">
          <span class="text-slate-600 dark:text-slate-300">Câu đố ngẫu nhiên</span>
          <kbd class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-200">R</kbd>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button id="btn-modal-share" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
          <span>🔗</span>
          <span>Sao chép link chia sẻ</span>
        </button>
        <button id="btn-ack-shortcuts" class="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer">
          Đóng
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector("#close-shortcuts-modal")?.addEventListener("click", close);
  modal.querySelector("#btn-ack-shortcuts")?.addEventListener("click", close);
  modal.querySelector("#btn-modal-share")?.addEventListener("click", async () => {
    const puzzle = store.getCurrentPuzzle();
    const shareUrl = `${window.location.origin}${window.location.pathname}?cau=${store.currentPuzzleId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Đã sao chép link câu đố! 📋", "success");
    } catch (_) {
      showToast("Không thể sao chép liên kết", "error");
    }
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}
