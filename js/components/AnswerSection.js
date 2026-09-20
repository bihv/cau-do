/**
 * js/components/AnswerSection.js
 * Cơ chế Ẩn/Hiện Đáp án mượt mà (Accordion Unfold) và Bộ nút Tự chấm điểm
 * Hỗ trợ Chế độ Tối (Dark Mode) và rung phản hồi xúc giác (Haptic feedback)
 */

import { store } from "../store/state.js";
import { renderMath, enhanceImagesWithZoom, enhanceTables, showToast, safeParseMarkdown } from "../utils/dom.js";

export function renderAnswerSection(container, puzzle) {
  if (!puzzle) {
    container.innerHTML = "";
    return;
  }

  const isRevealed = store.isAnswerRevealed;
  const isSolved = store.solvedSet.has(puzzle.id);
  const isReview = store.reviewSet.has(puzzle.id);

  if (!isRevealed) {
    // TRẠNG THÁI ĐÓNG: Nút mở đáp án thanh lịch, êm mắt
    container.innerHTML = `
      <div class="py-6 text-center">
        <button id="btn-reveal-answer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-sm sm:text-base border border-indigo-200/80 dark:border-indigo-800/80 transition-all cursor-pointer">
          <span>💡</span>
          <span>Xem Lời Giải & Đáp Án</span>
          <span class="hidden sm:inline text-xs font-normal opacity-70 ml-1">(Space)</span>
        </button>
      </div>
    `;

    container.querySelector("#btn-reveal-answer")?.addEventListener("click", () => {
      store.toggleAnswer(true);
    });
    return;
  }

  // TRẠNG THÁI MỞ: Hiển thị lời giải chi tiết và nút tự chấm điểm
  const parsedDapAn = safeParseMarkdown(puzzle.dap_an);

  container.innerHTML = `
    <div class="border-t border-slate-200/80 dark:border-slate-800 pt-6 space-y-5 animate-in fade-in duration-300">
      
      <!-- Thanh Tiêu đề Lời giải + Nút đóng nhẹ -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm tracking-wide uppercase">
            💡 Lời Giải & Phân Tích Logic
          </span>
        </div>

        <button id="btn-hide-answer"
          class="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          Ẩn lời giải
        </button>
      </div>

      <!-- Nội dung Lời giải chuẩn typographic -->
      <div class="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 answer-content">
        ${parsedDapAn}
      </div>

      <!-- Khối Tự Chấm Điểm Tinh Gọn -->
      <div class="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span class="text-slate-500 dark:text-slate-400 font-medium">
          Bạn có suy luận đúng câu này không?
        </span>

        <div class="flex items-center gap-2">
          <button id="btn-rate-solved"
            class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isSolved
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'
            }">
            <span>✓</span>
            <span>Tôi giải đúng</span>
          </button>

          <button id="btn-rate-review"
            class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isReview
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
            }">
            <span>🤔</span>
            <span>Cần ngẫm lại</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Render toán học KaTeX trong lời giải nếu có
  renderMath(container);

  // Tối ưu hóa hiển thị bảng dữ liệu Markdown
  enhanceTables(container);

  // Nâng cấp hình ảnh trong lời giải: click để phóng to
  enhanceImagesWithZoom(container, (src) => store.openZoomModal(src), ".answer-content img");

  // Gắn sự kiện đóng
  container.querySelector("#btn-hide-answer")?.addEventListener("click", () => {
    store.toggleAnswer(false);
  });

  // Gắn sự kiện tự chấm điểm
  container.querySelector("#btn-rate-solved")?.addEventListener("click", () => {
    store.markSolved(puzzle.id);
    showToast("Chúc mừng! Bạn đã hoàn thành câu đố này 🎉", "success");
    
    // Rung phản hồi xúc giác nhẹ trên mobile nếu hỗ trợ
    if (navigator.vibrate) {
      try { navigator.vibrate([30, 50, 30]); } catch (_) {}
    }

    // Bắn confetti nhẹ nếu có thư viện
    if (window.confetti) {
      window.confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  });

  container.querySelector("#btn-rate-review")?.addEventListener("click", () => {
    store.markReview(puzzle.id);
    showToast("Đã thêm câu này vào danh sách Cần ngẫm lại 🤔", "info");
  });
}
