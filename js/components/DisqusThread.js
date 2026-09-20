/**
 * js/components/DisqusThread.js
 * Tự động nạp Disqus khi cuộn tới gần vùng bình luận (IntersectionObserver Lazy-load)
 * Khi chuyển câu đố: sử dụng DISQUS.reset() nhẹ nhàng và tức thì
 * Khi đổi theme Sáng / Tối: tái tạo Disqus embed sạch sẽ để hiển thị đúng Dark / Light theme mà không bị biến mất
 * URL dạng Query Parameter (?cau=X) không dấu '#' - tương thích 100% GitHub Pages
 */

import { getConfig } from "../config.js";
import { store } from "../store/state.js";

let isDisqusScriptInjected = false;
let currentLoadedPuzzleId = null;
let currentLoadedTheme = null;
let currentObserver = null;

export function renderDisqusThread(container, puzzle) {
  if (!puzzle) {
    container.innerHTML = "";
    return;
  }

  const shortname = getConfig("DISQUS_SHORTNAME", "quizz-1");
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168.");

  const puzzleIdentifier = `cau-do-${puzzle.id}`;
  const puzzleUrl = `${window.location.origin}${window.location.pathname}?cau=${puzzle.id}`;
  const puzzleTitle = `Câu ${puzzle.id}: ${puzzle.title}`;

  // Đảm bảo DOM khung Disqus tồn tại
  if (!container.querySelector("#disqus_thread")) {
    container.innerHTML = `
      <div class="bg-white dark:bg-[#0b0f19] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm transition-colors space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xl">💬</span>
            <h3 id="disqus-header-title" class="font-bold text-slate-800 dark:text-white text-base sm:text-lg">
              Thảo Luận & Góc Nhìn Câu #${puzzle.id}
            </h3>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline font-medium">
            Cùng trao đổi và tìm nhiều cách giải thú vị từ cộng đồng
          </span>
        </div>
        
        <!-- Khung nhúng Disqus tự động tải -->
        <div id="disqus_thread" class="min-h-[220px] pt-2 relative">
          <div id="disqus-placeholder" class="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></span>
            <span>Đang tải bình luận...</span>
          </div>
        </div>
      </div>
    `;
  } else {
    // Đã có DOM, cập nhật lại tiêu đề nếu đổi câu
    const titleEl = container.querySelector("#disqus-header-title");
    if (titleEl) {
      titleEl.textContent = `Thảo Luận & Góc Nhìn Câu #${puzzle.id}`;
    }
  }

  function injectDisqusScript() {
    window.disqus_config = function () {
      if (isLocalhost) {
        this.page.developer = 1;
      }
      this.page.url = puzzleUrl;
      this.page.identifier = puzzleIdentifier;
      this.page.title = puzzleTitle;
    };

    const d = document;
    const s = d.createElement("script");
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute("data-timestamp", (+new Date()).toString());
    s.async = true;

    s.onerror = () => {
      const placeholder = container.querySelector("#disqus-placeholder");
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="py-6 text-center text-slate-500 text-xs space-y-2">
            <p class="font-bold text-amber-600 text-sm">⚠️ Không thể kết nối với Disqus (${shortname})</p>
            <p class="text-slate-400 max-w-md mx-auto">
              Nếu bạn đang dùng trình duyệt chặn quảng cáo (AdBlock / Brave Shields), hãy tạm tắt để hiển thị khung bình luận.
            </p>
            <p class="text-slate-400">
              Cấu hình hiện tại: <code>DISQUS_SHORTNAME=${shortname}</code>
            </p>
          </div>
        `;
      }
    };

    (d.head || d.body).appendChild(s);
    isDisqusScriptInjected = true;
    currentLoadedPuzzleId = puzzle.id;
    currentLoadedTheme = store.theme;
  }

  // Tái tạo hoàn toàn embed Disqus khi đổi theme (vì DISQUS.reset không hỗ trợ đổi theme query param)
  function reinitDisqusForNewTheme() {
    const thread = document.getElementById("disqus_thread");
    if (thread) {
      thread.innerHTML = `
        <div id="disqus-placeholder" class="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <span class="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></span>
          <span>Đang nạp lại bình luận theo giao diện mới...</span>
        </div>
      `;
    }

    // Xóa mọi iframe và script cũ của Disqus để tránh xung đột
    document.querySelectorAll('iframe[src*="disqus.com"]').forEach((el) => el.remove());
    const oldScript = document.querySelector('script[src*="disqus.com/embed.js"]');
    if (oldScript) oldScript.remove();

    try {
      delete window.DISQUS;
    } catch (_) {
      window.DISQUS = undefined;
    }

    isDisqusScriptInjected = false;
    injectDisqusScript();
  }

  function loadOrResetDisqus() {
    if (isLocalhost) {
      window.disqus_developer = 1;
    }

    const isPuzzleChanged = currentLoadedPuzzleId !== puzzle.id;
    const isThemeChanged = currentLoadedTheme !== store.theme;

    if (!isDisqusScriptInjected) {
      injectDisqusScript();
    } else if (window.DISQUS && isThemeChanged) {
      // Khi đổi Theme: Tái tạo sạch sẽ để nạp Dark/Light theme của Disqus
      reinitDisqusForNewTheme();
    } else if (window.DISQUS && isPuzzleChanged) {
      // Khi đổi câu đố: DISQUS.reset chạy mượt mà tức thì
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            if (isLocalhost) {
              this.page.developer = 1;
            }
            this.page.url = puzzleUrl;
            this.page.identifier = puzzleIdentifier;
            this.page.title = puzzleTitle;
          }
        });
        currentLoadedPuzzleId = puzzle.id;
      } catch (err) {
        console.warn("Lỗi khi reset Disqus thread:", err);
      }
    }
  }

  // Tự động tải hoặc cập nhật Disqus ngay khi render
  loadOrResetDisqus();
}
