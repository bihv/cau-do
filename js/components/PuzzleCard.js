/**
 * js/components/PuzzleCard.js
 * Thẻ Flashcard trung tâm tích hợp toàn bộ các thành phần hiển thị và giải đố
 * Hỗ trợ cử chỉ vuốt chạm (Touch Swipe) trên mobile để lướt câu trước / sau
 * Tối ưu giữ nguyên vẹn DOM để các component như Disqus không bị hủy và tải lại không cần thiết
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";
import { renderProblemBox } from "./ProblemBox.js";
import { renderScratchpad } from "./Scratchpad.js";
import { renderAnswerSection } from "./AnswerSection.js";
import { renderDisqusThread } from "./DisqusThread.js";
import { renderBottomBar } from "./BottomBar.js";

export function renderPuzzleCard(container) {
  let lastPuzzleId = null;

  function update() {
    const puzzle = store.getCurrentPuzzle();
    if (!puzzle) {
      container.innerHTML = `
        <div class="py-24 text-center">
          <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Đang tải kho câu đố...</p>
        </div>
      `;
      return;
    }

    // Khởi tạo khung DOM một lần duy nhất nếu chưa có
    if (!container.querySelector("#problem-box-container")) {
      container.innerHTML = `
        <main class="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-8 space-y-6 sm:space-y-8">
          
          <!-- Thẻ Flashcard: Ở Mobile loại bỏ khung viền/nền để nội dung thoáng rộng, chỉ giữ Card trên Tablet/Desktop -->
          <article id="puzzle-main-card" 
            class="bg-transparent sm:bg-white dark:bg-transparent sm:dark:bg-[#0b0f19] rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/80 dark:border-slate-800 shadow-none sm:shadow-sm p-0 sm:p-10 space-y-6 sm:space-y-8 transition-colors">
            <!-- 1. Hộp Đề bài & Hình ảnh -->
            <div id="problem-box-container"></div>

            <!-- 2. Khu vực Nháp suy luận (Canvas & Text) -->
            <div id="scratchpad-container"></div>

            <!-- 3. Khu vực Ẩn/Hiện Đáp án & Tự chấm điểm -->
            <div id="answer-section-container"></div>

            <!-- 4. Thanh điều hướng Trước / Sau -->
            <div id="bottom-bar-container"></div>
          </article>

          <!-- 5. Khu vực Bình luận Disqus -->
          <section id="disqus-container" class="mt-8 sm:mt-12"></section>

        </main>
      `;

      // Thiết lập cử chỉ vuốt chạm (Touch Swipe Gestures) cho thẻ Flashcard
      setupSwipeGestures(container.querySelector("#puzzle-main-card"));
    }

    const isPuzzleChanged = lastPuzzleId !== puzzle.id;
    lastPuzzleId = puzzle.id;

    // Lấy các element containers
    const problemBoxEl = container.querySelector("#problem-box-container");
    const scratchpadEl = container.querySelector("#scratchpad-container");
    const answerSectionEl = container.querySelector("#answer-section-container");
    const bottomBarEl = container.querySelector("#bottom-bar-container");
    const disqusEl = container.querySelector("#disqus-container");

    // Chỉ re-render đề bài và nháp khi thực sự chuyển câu đố
    if (isPuzzleChanged && problemBoxEl) {
      renderProblemBox(problemBoxEl, puzzle);
    }
    if (isPuzzleChanged && scratchpadEl) {
      renderScratchpad(scratchpadEl, puzzle);
    }

    // AnswerSection & BottomBar cập nhật theo trạng thái đóng/mở & tiến độ
    if (answerSectionEl) {
      renderAnswerSection(answerSectionEl, puzzle);
    }
    if (bottomBarEl) {
      renderBottomBar(bottomBarEl, puzzle);
    }

    // Disqus cập nhật (giữ nguyên DOM của disqus_thread)
    if (disqusEl) {
      renderDisqusThread(disqusEl, puzzle);
    }
  }

  /**
   * Nhận diện cử chỉ vuốt ngón tay (Swipe Left/Right) trên màn hình cảm ứng
   */
  function setupSwipeGestures(cardEl) {
    if (!cardEl) return;

    let startX = 0;
    let startY = 0;
    let isTouchValid = false;

    cardEl.addEventListener("touchstart", (e) => {
      // Nếu chạm vào bảng vẽ canvas, ô nhập liệu hoặc nút bấm thì bỏ qua vuốt chuyển câu
      const target = e.target;
      if (
        target.closest("#scratchpad-canvas") ||
        target.closest("textarea") ||
        target.closest("input") ||
        target.closest("button") ||
        target.closest(".color-picker-btn")
      ) {
        isTouchValid = false;
        return;
      }

      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isTouchValid = true;
      }
    }, { passive: true });

    cardEl.addEventListener("touchend", (e) => {
      if (!isTouchValid || e.changedTouches.length !== 1) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Điều kiện nhận diện vuốt ngang dứt khoát (khoảng cách > 70px và góc nghiêng phù hợp)
      if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Vuốt sang trái -> Câu tiếp theo
          if (store.currentPuzzleId < store.puzzles.length) {
            navigateToPuzzle(store.currentPuzzleId + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          // Vuốt sang phải -> Câu trước đó
          if (store.currentPuzzleId > 1) {
            navigateToPuzzle(store.currentPuzzleId - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }

      isTouchValid = false;
    }, { passive: true });
  }

  store.subscribe(update);
  update();
}
