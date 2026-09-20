/**
 * js/components/NavigationDrawer.js
 * Giao diện Spotlight Command Palette: Tìm kiếm & Điều hướng 500 câu đố
 * Hỗ trợ:
 * - Tìm kiếm tức thì theo số câu (#364), từ khóa tiêu đề, tóm tắt, chuyên đề
 * - Bộ lọc trạng thái: Tất cả, Chưa giải, Đã giải, Cần ngẫm lại, Đã lưu, Có hình
 * - Lọc theo từng Chuyên đề (10 Phần)
 * - Điều hướng bằng bàn phím toàn diện (ArrowUp, ArrowDown, Enter, Esc)
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";
import { normalizePuzzleId } from "../utils/dom.js";

const PHAN_LIST = [
  "Tất cả chuyên đề",
  "Phương pháp loại trừ",
  "Phương pháp đệ quy",
  "Phương pháp suy diễn ngược",
  "Phương pháp giả thiết",
  "Phương pháp tính toán",
  "Phương pháp phân tích",
  "Phương pháp vẽ hình",
  "Phương pháp loại suy",
  "Phương pháp tổng hợp",
  "Thử làm Sherlock Holmes"
];

export function renderNavigationDrawer(container) {
  let activeFilter = "all"; // 'all' | 'unsolved' | 'solved' | 'review' | 'bookmarked' | 'has_image'
  let selectedPhan = "Tất cả chuyên đề";
  let searchQuery = "";
  let selectedIndex = 0;
  let keydownHandler = null;
  let wasOpen = false;

  function update() {
    if (!store.isDrawerOpen) {
      wasOpen = false;
      if (keydownHandler) {
        window.removeEventListener("keydown", keydownHandler);
        keydownHandler = null;
      }
      container.innerHTML = "";
      return;
    }

    // Khi mới mở Spotlight hoặc khi store yêu cầu chọn chuyên đề mới
    const shouldSyncTopic = !wasOpen || (store.selectedPart && store.selectedPart !== "all" && store.selectedPart.toLowerCase() !== selectedPhan.toLowerCase());
    if (shouldSyncTopic) {
      wasOpen = true;

      // Đồng bộ Chuyên đề từ store
      if (store.selectedPart && store.selectedPart !== "all") {
        const matched = PHAN_LIST.find(
          (p) => p.toLowerCase() === store.selectedPart.toLowerCase()
        );
        selectedPhan = matched || "Tất cả chuyên đề";
      } else {
        selectedPhan = "Tất cả chuyên đề";
      }

      // Nếu mở theo chuyên đề cụ thể, xóa tìm kiếm và reset bộ lọc để hiển thị đầy đủ
      if (selectedPhan !== "Tất cả chuyên đề") {
        searchQuery = "";
        activeFilter = "all";
      }
    }

    // Lọc danh sách câu đố
    const filteredPuzzles = store.puzzles.filter((p) => {
      // 1. Lọc theo chuyên đề (so sánh không phân biệt hoa thường)
      if (
        selectedPhan !== "Tất cả chuyên đề" &&
        (!p.phan || p.phan.toLowerCase() !== selectedPhan.toLowerCase())
      ) {
        return false;
      }

      // 2. Lọc theo tìm kiếm
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = p.id.toString() === q || `câu ${p.id}`.includes(q) || `cau ${p.id}`.includes(q) || `#${p.id}` === q;
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTomTat = (p.tom_tat || "").toLowerCase().includes(q);
        const matchesPhan = (p.phan || "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesTomTat && !matchesPhan) return false;
      }

      // 3. Lọc theo trạng thái
      if (activeFilter === "unsolved") return !store.solvedSet.has(p.id);
      if (activeFilter === "solved") return store.solvedSet.has(p.id);
      if (activeFilter === "review") return store.reviewSet.has(p.id);
      if (activeFilter === "bookmarked") return store.bookmarkSet.has(p.id);
      if (activeFilter === "has_image") return p.has_image;

      return true;
    });

    // Sau khi lọc, chọn câu hiện tại nếu có trong danh sách
    const curIdx = filteredPuzzles.findIndex((p) => p.id === store.currentPuzzleId);
    if (curIdx >= 0) {
      selectedIndex = curIdx;
    } else {
      selectedIndex = 0;
    }

    // Giữ selectedIndex trong phạm vi hợp lệ
    if (selectedIndex >= filteredPuzzles.length) {
      selectedIndex = Math.max(0, filteredPuzzles.length - 1);
    }

    const stats = store.getStats();

    container.innerHTML = `
      <div id="spotlight-backdrop" class="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs sm:backdrop-blur-sm transition-opacity animate-in fade-in duration-150"></div>

      <div class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-[6vh] sm:pt-[10vh] pointer-events-none">
        <div id="spotlight-card" class="pointer-events-auto relative w-full max-w-2xl bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[84vh] sm:max-h-[80vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
          
          <!-- Thanh tìm kiếm Spotlight (Search Bar) -->
          <div class="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/90 flex items-center gap-3 bg-slate-50/70 dark:bg-[#111827]/90">
            <span class="text-slate-400 dark:text-slate-400 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>

            <input type="text" id="spotlight-search-input"
              value="${searchQuery}"
              autocomplete="off"
              spellcheck="false"
              placeholder="Tìm kiếm câu đố (nhập 364, 'bánh xe', 'phương pháp')..."
              class="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base font-medium outline-none border-none p-0" />

            ${searchQuery ? `
              <button id="btn-clear-search" class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer transition-colors" title="Xóa tìm kiếm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ` : ""}

            <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-2xs font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-md select-none">
              Esc
            </kbd>

            <button id="btn-close-spotlight" class="sm:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer" title="Đóng">
              ✕
            </button>
          </div>

          <!-- Bộ lọc Pills & Chuyên đề -->
          <div class="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] flex flex-col gap-2">
            <!-- Hàng 1: Bộ lọc trạng thái -->
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button data-filter="all" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                Tất cả (${store.puzzles.length})
              </button>
              <button data-filter="unsolved" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'unsolved'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                Chưa giải (${store.puzzles.length - store.solvedSet.size})
              </button>
              <button data-filter="solved" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'solved'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                Đã giải (${store.solvedSet.size})
              </button>
              <button data-filter="review" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'review'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                🤔 Cần ngẫm (${store.reviewSet.size})
              </button>
              <button data-filter="bookmarked" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'bookmarked'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                ⭐ Đã lưu (${store.bookmarkSet.size})
              </button>
              <button data-filter="has_image" class="filter-pill shrink-0 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeFilter === 'has_image'
                  ? 'bg-orange-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }">
                🖼️ Có hình
              </button>
            </div>

            <!-- Hàng 2: Chọn Chuyên đề & Tiến độ tóm tắt -->
            <div class="flex items-center justify-between gap-2 text-xs pt-0.5">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-slate-400 dark:text-slate-400 shrink-0 font-medium">Chuyên đề:</span>
                <select id="spotlight-phan-select" class="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-0.5 text-xs font-medium outline-none cursor-pointer truncate max-w-[200px] sm:max-w-[280px]">
                  ${PHAN_LIST.map((phan) => `
                    <option value="${phan}" ${phan === selectedPhan ? "selected" : ""}>${phan}</option>
                  `).join("")}
                </select>
              </div>

              <div class="text-2xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
                <span>Tiến độ:</span>
                <span class="text-orange-600 dark:text-orange-400 font-bold">${stats.solved}/${stats.total} (${stats.percent}%)</span>
              </div>
            </div>
          </div>

          <!-- Danh sách câu đố (Spotlight Results) -->
          <div id="spotlight-results-list" class="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 divide-y divide-slate-100/60 dark:divide-slate-800/40">
            ${filteredPuzzles.length === 0 ? `
              <div class="py-12 text-center text-slate-400 dark:text-slate-500">
                <span class="text-3xl block mb-2">🔍</span>
                <p class="text-sm font-medium">Không tìm thấy câu đố nào phù hợp</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Hãy thử tìm theo số câu (#1 đến #500) hoặc đổi bộ lọc</p>
              </div>
            ` : filteredPuzzles.map((p, idx) => {
              const isSelected = idx === selectedIndex;
              const isCurrent = p.id === store.currentPuzzleId;
              const isSolved = store.solvedSet.has(p.id);
              const isReview = store.reviewSet.has(p.id);
              const isBookmarked = store.bookmarkSet.has(p.id);

              let badgeColor = "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30";
              if (p.muc_do.includes("Trung bình")) badgeColor = "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30";
              if (p.muc_do.includes("Khó")) badgeColor = "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30";

              return `
                <button data-puzzle-index="${idx}" data-puzzle-id="${p.id}"
                  class="w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-orange-50/90 dark:bg-orange-500/20 text-orange-950 dark:text-orange-100 ring-1 ring-orange-500/40'
                      : isCurrent
                      ? 'bg-slate-100/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                  }">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="font-mono text-xs font-bold shrink-0 ${
                      isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-400'
                    }">
                      #${String(p.id).padStart(3, '0')}
                    </span>
                    <div class="min-w-0">
                      <div class="text-xs sm:text-sm font-semibold truncate ${
                        isSelected ? 'text-orange-950 dark:text-white font-bold' : ''
                      }">
                        ${p.title}
                      </div>
                      <div class="text-2xs text-slate-400 dark:text-slate-400 truncate mt-0.5">
                        ${p.phan}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 shrink-0">
                    ${p.has_image ? `<span class="text-2xs" title="Có hình ảnh">🖼️</span>` : ""}
                    ${isBookmarked ? `<span class="text-2xs" title="Đã lưu">⭐</span>` : ""}
                    ${isSolved ? `<span class="text-emerald-500 dark:text-emerald-400 text-xs font-bold" title="Đã giải">✓</span>` : ""}
                    ${isReview ? `<span class="text-amber-500 dark:text-amber-400 text-xs font-bold" title="Cần ngẫm lại">🤔</span>` : ""}
                    <span class="text-2xs px-1.5 py-0.5 rounded border font-medium ${badgeColor}">
                      ${p.muc_do}
                    </span>
                  </div>
                </button>
              `;
            }).join("")}
          </div>

          <!-- Footer thông tin phím tắt Spotlight -->
          <div class="p-2.5 px-4 border-t border-slate-100 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between text-2xs text-slate-500 dark:text-slate-400 select-none">
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">↓</kbd>
                <span>di chuyển</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">↵</kbd>
                <span>chọn</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">Esc</kbd>
                <span>đóng</span>
              </span>
            </div>
            <div class="hidden sm:block text-slate-400 dark:text-slate-400">
              Mở lại: <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">Ctrl+K</kbd> hoặc <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-700 dark:text-slate-300">M</kbd>
            </div>
          </div>

        </div>
      </div>
    `;

    // Gắn sự kiện đóng
    container.querySelector("#btn-close-spotlight")?.addEventListener("click", () => {
      store.setDrawerOpen(false);
    });
    container.querySelector("#spotlight-backdrop")?.addEventListener("click", () => {
      store.setDrawerOpen(false);
    });

    // Sự kiện ô tìm kiếm
    const searchInput = container.querySelector("#spotlight-search-input");
    if (searchInput) {
      // Focus và đặt con trỏ cuối
      searchInput.focus();
      searchInput.selectionStart = searchInput.selectionEnd = searchInput.value.length;

      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        selectedIndex = 0;
        update();
      });
    }

    container.querySelector("#btn-clear-search")?.addEventListener("click", () => {
      searchQuery = "";
      selectedIndex = 0;
      update();
    });

    // Sự kiện bộ lọc trạng thái
    container.querySelectorAll(".filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter");
        selectedIndex = 0;
        update();
      });
    });

    // Sự kiện chọn Chuyên đề
    const phanSelect = container.querySelector("#spotlight-phan-select");
    phanSelect?.addEventListener("change", (e) => {
      selectedPhan = e.target.value;
      store.selectedPart = selectedPhan;
      selectedIndex = 0;
      update();
    });

    // Sự kiện click chọn câu đố
    container.querySelectorAll("[data-puzzle-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = normalizePuzzleId(btn.getAttribute("data-puzzle-id"), store.puzzles.length || 500, 1);
        navigateToPuzzle(id);
        store.setDrawerOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Cuộn tới mục đang chọn
    const activeItemEl = container.querySelector(`[data-puzzle-index="${selectedIndex}"]`);
    if (activeItemEl) {
      activeItemEl.scrollIntoView({ block: "nearest", behavior: "auto" });
    }

    // Điều hướng bàn phím toàn cục cho Spotlight
    if (keydownHandler) {
      window.removeEventListener("keydown", keydownHandler);
    }
    keydownHandler = (e) => {
      if (!store.isDrawerOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredPuzzles.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredPuzzles.length;
          update();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredPuzzles.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredPuzzles.length) % filteredPuzzles.length;
          update();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredPuzzles.length > 0 && filteredPuzzles[selectedIndex]) {
          const id = filteredPuzzles[selectedIndex].id;
          navigateToPuzzle(id);
          store.setDrawerOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", keydownHandler);
  }

  store.subscribe(update);
  update();
}
