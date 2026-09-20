/**
 * js/components/BottomBar.js
 * Thanh điều hướng Câu trước / Câu sau dạng Sticky Footer cố định ở đáy màn hình
 * Luôn sẵn sàng cho cả Mobile & Desktop, hiển thị tiến độ và hỗ trợ phím tắt
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";

export function renderBottomBar(container) {
  function update() {
    const puzzle = store.getCurrentPuzzle();
    if (!puzzle) {
      container.innerHTML = "";
      return;
    }

    const prevId = puzzle.id > 1 ? puzzle.id - 1 : null;
    const nextId = puzzle.id < store.puzzles.length ? puzzle.id + 1 : null;
    const isSolved = store.solvedSet.has(puzzle.id);

    container.innerHTML = `
      <footer id="sticky-bottom-bar"
        class="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_-4px_rgba(0,0,0,0.4)] transition-colors">
        <div class="w-full max-w-[96%] xl:max-w-[1700px] 2xl:max-w-[1880px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          <!-- Nút Câu trước -->
          <button id="btn-nav-prev"
            ${!prevId ? "disabled" : ""}
            class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all select-none cursor-pointer active:scale-95 ${
              prevId
                ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400"
                : "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
            }">
            <span>←</span>
            <span>Câu trước</span>
            <kbd class="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">←</kbd>
          </button>

          <!-- Thông tin tiến độ ở giữa -->
          <div class="flex items-center gap-2 sm:gap-3 text-center select-none">
            <span class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              Câu ${puzzle.id} <span class="font-normal text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs">/ ${store.puzzles.length || 500}</span>
            </span>

            ${puzzle.phan ? `
              <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                ${puzzle.phan}
              </span>
            ` : ""}

            ${isSolved ? `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                ✓ Đã giải
              </span>
            ` : ""}
          </div>

          <!-- Nút Câu sau -->
          <button id="btn-nav-next"
            ${!nextId ? "disabled" : ""}
            class="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all select-none cursor-pointer active:scale-95 ${
              nextId
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-xs hover:shadow-orange-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
            }">
            <span>Câu tiếp theo</span>
            <span>→</span>
            <kbd class="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-orange-100 bg-orange-700/80 rounded border border-orange-500/40">→</kbd>
          </button>

        </div>
      </footer>
    `;

    container.querySelector("#btn-nav-prev")?.addEventListener("click", () => {
      if (prevId) {
        navigateToPuzzle(prevId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    container.querySelector("#btn-nav-next")?.addEventListener("click", () => {
      if (nextId) {
        navigateToPuzzle(nextId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  store.subscribe(update);
  update();
}

