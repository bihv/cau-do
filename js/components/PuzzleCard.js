/**
 * js/components/PuzzleCard.js
 * Thẻ Flashcard trung tâm tích hợp toàn bộ các thành phần hiển thị và giải đố:
 * - Desktop/Tablet ngang (>= 1024px): Bố cục Split View 2 cột song song (Đề bài ghim sticky bên trái, Lời giải & Nháp bên phải)
 * - Mobile/Tablet dọc (< 1024px): Cụm Segmented Tabs ngón tay cái ([ 📖 Đề bài ] ⟷ [ 💡 Lời giải ] ⟷ [ ✏️ Nháp ])
 * - Giữ nguyên cử chỉ vuốt chạm (Touch Swipe) và trạng thái DOM của các component con
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";
import { renderProblemBox } from "./ProblemBox.js";
import { renderScratchpad } from "./Scratchpad.js";
import { renderAnswerSection } from "./AnswerSection.js";
import { renderDisqusThread } from "./DisqusThread.js";

export function renderPuzzleCard(container) {
  let lastPuzzleId = null;
  let lastTab = null;

  function update() {
    const puzzle = store.getCurrentPuzzle();
    if (!puzzle) {
      container.innerHTML = `
        <div class="py-24 text-center">
          <div class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Đang tải kho câu đố...</p>
        </div>
      `;
      return;
    }

    // Khởi tạo khung DOM một lần duy nhất nếu chưa có
    if (!container.querySelector("#problem-box-container")) {
      container.innerHTML = `
        <main id="puzzle-main-wrapper" 
          class="w-full max-w-[96%] xl:max-w-[1700px] 2xl:max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6 space-y-6"
          data-active-tab="problem">
          
          <!-- 1. BỘ ĐIỀU HƯỚNG TABS CHO MOBILE / TABLET DỌC (< lg) -->
          <div class="block lg:hidden sticky top-14 z-30 -mx-3 px-3 py-2 bg-slate-50/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
            <div class="flex items-center justify-center p-1 bg-slate-200/75 dark:bg-slate-800/90 rounded-2xl shadow-inner max-w-md mx-auto" id="mobile-segmented-tabs">
              
              <button data-tab="problem" 
                class="mobile-tab-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer">
                <span>📖</span>
                <span>Đề bài</span>
              </button>

              <button data-tab="answer" 
                class="mobile-tab-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative">
                <span>💡</span>
                <span>Lời giải</span>
                <span id="tab-answer-badge" class="hidden w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400 absolute top-2 right-2"></span>
              </button>

              <button data-tab="scratchpad" 
                class="mobile-tab-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative">
                <span>✏️</span>
                <span>Nháp</span>
                <span id="tab-note-badge" class="hidden w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2"></span>
              </button>

            </div>
          </div>

          <!-- 2. BỐ CỤC CHÍNH: 2 CỘT SPLIT VIEW TRÊN DESKTOP (>= lg) / HIỂN THỊ THEO TAB TRÊN MOBILE (< lg) -->
          <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            
            <!-- CỘT TRÁI: ĐỀ BÀI & HÌNH ẢNH (Sticky trên Desktop >= lg) -->
            <article id="panel-problem" 
              class="lg:col-span-6 xl:col-span-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-8 md:p-10 transition-colors lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto split-scroll">
              <div id="problem-box-container"></div>
            </article>

            <!-- CỘT PHẢI: NHÁP, LỜI GIẢI & ĐIỀU HƯỚNG TRÊN DESKTOP -->
            <div id="panel-right" class="lg:col-span-6 xl:col-span-6 space-y-6">
              
              <!-- KHU VỰC NHÁP -->
              <article id="panel-scratchpad" 
                class="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 transition-colors">
                <div id="scratchpad-container"></div>
              </article>

              <!-- KHU VỰC LỜI GIẢI -->
              <article id="panel-answer" 
                class="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-8 transition-colors">
                <div id="answer-section-container"></div>
              </article>

            </div>

          </div>

          <!-- 3. KHU VỰC BÌNH LUẬN DISQUS (ACCORDION THU GỌN) -->
          <section id="disqus-container" class="mt-8 sm:mt-12"></section>

        </main>
      `;

      // Thiết lập sự kiện chuyển đổi Tabs trên mobile
      setupMobileTabs(container);

      // Thiết lập cử chỉ vuốt chạm (Touch Swipe Gestures)
      setupSwipeGestures(container.querySelector("#puzzle-main-wrapper"));
    }

    const isPuzzleChanged = lastPuzzleId !== puzzle.id;
    lastPuzzleId = puzzle.id;

    const currentTab = store.activeMobileTab || "problem";
    const isTabChanged = lastTab !== currentTab;
    lastTab = currentTab;

    // Lấy các element containers
    const wrapperEl = container.querySelector("#puzzle-main-wrapper");
    const problemBoxEl = container.querySelector("#problem-box-container");
    const scratchpadEl = container.querySelector("#scratchpad-container");
    const answerSectionEl = container.querySelector("#answer-section-container");
    const disqusEl = container.querySelector("#disqus-container");

    // Cập nhật trạng thái Tab Mobile hiện tại
    if (wrapperEl) {
      wrapperEl.setAttribute("data-active-tab", currentTab);
      updateMobileTabButtons(container, puzzle);
    }

    // Chỉ re-render đề bài khi thực sự chuyển câu đố
    if (isPuzzleChanged && problemBoxEl) {
      renderProblemBox(problemBoxEl, puzzle);
    }

    // Re-render bảng nháp khi chuyển câu đố HOẶC khi người dùng chuyển sang tab 'scratchpad'
    if (scratchpadEl && (isPuzzleChanged || (isTabChanged && currentTab === "scratchpad"))) {
      renderScratchpad(scratchpadEl, puzzle, { forceExpand: currentTab === "scratchpad" });
    }

    // AnswerSection cập nhật theo trạng thái đóng/mở & tiến độ
    if (answerSectionEl) {
      renderAnswerSection(answerSectionEl, puzzle);
    }

    // Disqus cập nhật (giữ nguyên DOM của disqus_thread)
    if (disqusEl) {
      renderDisqusThread(disqusEl, puzzle);
    }
  }

  /**
   * Đăng ký sự kiện click cho các nút Segmented Tabs trên mobile
   */
  function setupMobileTabs(root) {
    const tabBtns = root.querySelectorAll(".mobile-tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        if (tab) {
          store.setMobileTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  /**
   * Cập nhật giao diện nút Tab đang active và các badge thông báo
   */
  function updateMobileTabButtons(root, puzzle) {
    const activeTab = store.activeMobileTab || "problem";
    const tabBtns = root.querySelectorAll(".mobile-tab-btn");
    
    tabBtns.forEach((btn) => {
      const isCurrent = btn.dataset.tab === activeTab;
      if (isCurrent) {
        btn.className = "mobile-tab-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm relative";
      } else {
        btn.className = "mobile-tab-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 relative";
      }
    });

    // Badge Lời giải: hiện khi đã mở hoặc đã giải
    const answerBadge = root.querySelector("#tab-answer-badge");
    if (answerBadge) {
      const isSolved = store.solvedSet.has(puzzle.id);
      const isRevealed = store.isAnswerRevealed;
      if (isSolved || isRevealed) {
        answerBadge.classList.remove("hidden");
        answerBadge.className = `w-2 h-2 rounded-full absolute top-2 right-2 ${isSolved ? "bg-emerald-500" : "bg-orange-500"}`;
      } else {
        answerBadge.classList.add("hidden");
      }
    }

    // Badge Nháp: hiện khi đã có nội dung vẽ hoặc note
    const noteBadge = root.querySelector("#tab-note-badge");
    if (noteBadge) {
      const hasNote = Boolean(store.getNote(puzzle.id));
      const hasDrawing = Boolean(store.getDrawing(puzzle.id));
      if (hasNote || hasDrawing) {
        noteBadge.classList.remove("hidden");
      } else {
        noteBadge.classList.add("hidden");
      }
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
