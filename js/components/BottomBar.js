/**
 * js/components/BottomBar.js
 * Thanh điều hướng Câu trước / Câu sau trực quan, tối ưu cho cả Mobile & Desktop
 * Tương thích mượt mà với Chế độ Tối (Dark Mode)
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";

export function renderBottomBar(container, puzzle) {
  if (!puzzle) {
    container.innerHTML = "";
    return;
  }

  const prevId = puzzle.id > 1 ? puzzle.id - 1 : null;
  const nextId = puzzle.id < store.puzzles.length ? puzzle.id + 1 : null;

  container.innerHTML = `
    <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors">
      
      <!-- Nút Câu trước -->
      <button id="btn-nav-prev"
        ${!prevId ? "disabled" : ""}
        class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
          prevId
            ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
        }">
        <span>←</span>
        <span>Câu trước</span>
      </button>

      <!-- Nút Câu sau -->
      <button id="btn-nav-next"
        ${!nextId ? "disabled" : ""}
        class="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
          nextId
            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
        }">
        <span>Câu tiếp theo</span>
        <span>→</span>
      </button>

    </div>
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
