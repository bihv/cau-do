/**
 * js/components/ProblemBox.js
 * Hiển thị đề bài câu đố, công thức toán học KaTeX và hình ảnh minh họa SVG
 * Tối ưu hóa độ tương phản cho cả chế độ Sáng & Tối (Light & Dark Mode)
 */

import { store } from "../store/state.js";
import { renderMath, enhanceImagesWithZoom, enhanceTables, safeParseMarkdown } from "../utils/dom.js";

export function renderProblemBox(container, puzzle) {
  if (!puzzle) {
    container.innerHTML = "";
    return;
  }

  // Trạng thái đã giải
  const isSolved = store.solvedSet.has(puzzle.id);

  // Mức độ
  let difficultyText = puzzle.muc_do || "Trung bình";

  // Parse markdown đề bài an toàn
  const parsedDeBai = safeParseMarkdown(puzzle.de_bai);

  container.innerHTML = `
    <div class="space-y-5 sm:space-y-6">
      
      <!-- Dòng Metadata thanh lịch, chuẩn mực biên tập -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span class="font-bold text-indigo-600 dark:text-indigo-400">
          ${puzzle.phan}
        </span>
        <span>•</span>
        <span>${difficultyText}</span>
        <span>•</span>
        <span class="font-mono">#${String(puzzle.id).padStart(3, '0')}</span>
        ${isSolved ? `
          <span>•</span>
          <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            ✓ Đã giải đúng
          </span>
        ` : ""}
      </div>

      <!-- Tiêu đề câu đố -->
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
        ${puzzle.title}
      </h1>

      <!-- Đoạn dẫn nhập tóm tắt trang nhã (nếu có) -->
      ${puzzle.tom_tat ? `
        <div class="border-l-2 border-indigo-400/60 dark:border-indigo-500/60 pl-3.5 py-0.5 text-slate-600 dark:text-slate-300 text-sm sm:text-base italic leading-relaxed">
          ${puzzle.tom_tat}
        </div>
      ` : ""}

      <!-- Nội dung đề bài chuẩn typographic -->
      <div class="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 problem-content">
        ${parsedDeBai}
      </div>

    </div>
  `;

  // Render toán học KaTeX nếu có
  renderMath(container);

  // Tối ưu hóa bảng dữ liệu Markdown
  enhanceTables(container);

  // Nâng cấp các hình ảnh trong đề bài: click để phóng to
  enhanceImagesWithZoom(container, (src) => store.openZoomModal(src), ".problem-content img");
}
