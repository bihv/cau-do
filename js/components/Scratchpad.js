/**
 * js/components/Scratchpad.js
 * Bảng nháp suy luận tương tác đa năng:
 * - Chế độ 1: Bảng vẽ Canvas cảm ứng/chuột (Pen, Eraser, Colors, Undo, Clear)
 * - Chế độ 2: Ghi chú văn bản (Text notes)
 * Tự động lưu độc lập theo từng câu đố vào LocalStorage
 */

import { store } from "../store/state.js";
import { showToast } from "../utils/dom.js";
import { showConfirmModal } from "./ConfirmModal.js";

export function renderScratchpad(container, puzzle) {
  if (!puzzle) {
    container.innerHTML = "";
    return;
  }

  const noteText = store.getNote(puzzle.id);
  const drawingData = store.getDrawing(puzzle.id);
  
  // Tự động mở nếu đã có ghi chú hoặc hình vẽ trước đó
  let isExpanded = Boolean(noteText || drawingData);
  let activeTab = drawingData ? "canvas" : (noteText ? "text" : "canvas");

  // Trạng thái công cụ vẽ
  let currentColor = "#4f46e5"; // Indigo mặc định
  let currentLineWidth = 3;
  let isEraser = false;
  let undoStack = [];
  const MAX_UNDO = 10;

  function render() {
    const hasNote = Boolean(store.getNote(puzzle.id));
    const hasDrawing = Boolean(store.getDrawing(puzzle.id));

    container.innerHTML = `
      <div class="border-t border-slate-100 dark:border-slate-800/80 pt-4 transition-all">
        <!-- Thanh kích hoạt nháp tối giản -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            ${(hasNote || hasDrawing) ? `
              <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Đã có bản nháp câu này
              </span>
            ` : `
              <span class="hidden sm:inline">Cần vẽ hình hoặc ghi chú lập luận?</span>
            `}
          </div>

          <button id="btn-toggle-scratchpad" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            title="Bật/Tắt bảng nháp (Phím C)">
            <span>✏️</span>
            <span>${isExpanded ? 'Thu gọn nháp' : (hasNote || hasDrawing ? 'Mở lại bản nháp' : 'Mở bảng nháp')}</span>
            <span class="text-slate-400 text-2xs font-mono">(C)</span>
          </button>
        </div>

        <!-- Khu vực nội dung khi mở rộng -->
        ${isExpanded ? `
          <div class="mt-3.5 space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 animate-in fade-in duration-200">
            
            <!-- Bộ chuyển Tab: Bảng vẽ / Ghi chú chữ -->
            <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
              <div class="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/90 p-1 rounded-xl">
                <button id="tab-canvas-btn" 
                  class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'canvas' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }">
                  <span>✏️</span>
                  <span>Bảng vẽ</span>
                  ${hasDrawing ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>' : ''}
                </button>
                <button id="tab-text-btn" 
                  class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'text' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }">
                  <span>📝</span>
                  <span>Ghi chú</span>
                  ${hasNote ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' : ''}
                </button>
              </div>

              <span id="scratchpad-status" class="text-2xs text-slate-400 dark:text-slate-500">
                Tự động lưu độc lập cho từng câu
              </span>
            </div>

            <!-- TAB 1: BẢNG VẼ TAY (CANVAS) -->
            <div id="canvas-tab-content" class="${activeTab === 'canvas' ? 'block' : 'hidden'} space-y-2.5">
              
              <!-- Toolbar công cụ vẽ -->
              <div class="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                <!-- Chọn Bút / Tẩy -->
                <div class="flex items-center gap-1">
                  <button id="tool-pen" 
                    class="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      !isEraser ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }" title="Bút vẽ">
                    ✏️ Vẽ
                  </button>
                  <button id="tool-eraser" 
                    class="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      isEraser ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }" title="Bút tẩy">
                    🧹 Tẩy
                  </button>
                </div>

                <!-- Bảng màu nét vẽ -->
                <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <button data-color="${store.theme === 'dark' ? '#f8fafc' : '#0f172a'}" 
                    class="color-picker-btn w-4 h-4 sm:w-5 sm:h-5 rounded-full ${store.theme === 'dark' ? 'bg-white border-slate-300' : 'bg-slate-900 border-white'} border-2 transition-transform cursor-pointer" 
                    title="${store.theme === 'dark' ? 'Trắng sáng' : 'Đen'}"></button>
                  <button data-color="#6366f1" class="color-picker-btn w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 transition-transform cursor-pointer" title="Xanh Indigo"></button>
                  <button data-color="#f59e0b" class="color-picker-btn w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 transition-transform cursor-pointer" title="Vàng Hổ Phách"></button>
                  <button data-color="#10b981" class="color-picker-btn w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 transition-transform cursor-pointer" title="Lục Emerald"></button>
                </div>

                <!-- Kích thước nét -->
                <div class="flex items-center gap-1">
                  <button data-size="2" class="size-picker-btn px-2 py-0.5 rounded text-2xs font-bold border transition-colors cursor-pointer ${currentLineWidth === 2 ? 'bg-slate-200 dark:bg-slate-700 border-slate-400 text-slate-800 dark:text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}">Mảnh</button>
                  <button data-size="4" class="size-picker-btn px-2 py-0.5 rounded text-2xs font-bold border transition-colors cursor-pointer ${currentLineWidth === 4 ? 'bg-slate-200 dark:bg-slate-700 border-slate-400 text-slate-800 dark:text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}">Vừa</button>
                  <button data-size="8" class="size-picker-btn px-2 py-0.5 rounded text-2xs font-bold border transition-colors cursor-pointer ${currentLineWidth === 8 ? 'bg-slate-200 dark:bg-slate-700 border-slate-400 text-slate-800 dark:text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}">Đậm</button>
                </div>

                <!-- Thao tác Hoàn tác & Xóa sạch -->
                <div class="flex items-center gap-1.5 ml-auto">
                  <button id="btn-undo-canvas" 
                    class="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
                    title="Hoàn tác nét vẽ (Undo)">
                    ↩️ Hoàn tác
                  </button>
                  <button id="btn-clear-canvas" 
                    class="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
                    title="Xóa toàn bộ bảng vẽ">
                    🗑️ Xóa
                  </button>
                </div>
              </div>

              <!-- Thẻ Canvas -->
              <div class="relative w-full rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-inner">
                <canvas id="scratchpad-canvas" 
                  class="w-full h-64 sm:h-80 touch-none cursor-crosshair block"
                  style="touch-action: none;"></canvas>
                <div class="absolute bottom-2 right-2 text-3xs text-slate-400 dark:text-slate-500 pointer-events-none select-none">
                  Vẽ bằng chuột hoặc ngón tay
                </div>
              </div>
            </div>

            <!-- TAB 2: GHI CHÚ VĂN BẢN (TEXT) -->
            <div id="text-tab-content" class="${activeTab === 'text' ? 'block' : 'hidden'} space-y-2.5">
              <textarea id="scratchpad-input"
                rows="4"
                placeholder="Ghi nhanh lập luận, giả thiết, phép tính nháp hoặc dự đoán của bạn..."
                class="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-all resize-y text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed">${store.getNote(puzzle.id)}</textarea>

              <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>💾 Tự động lưu</span>
                <button id="btn-clear-note" 
                  class="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer px-2 py-0.5 rounded">
                  Xóa ghi chú
                </button>
              </div>
            </div>

          </div>
        ` : ""}
      </div>
    `;

    // 1. Toggle mở rộng / thu gọn
    container.querySelector("#btn-toggle-scratchpad")?.addEventListener("click", () => {
      isExpanded = !isExpanded;
      render();
    });

    if (!isExpanded) return;

    // 2. Chuyển Tab
    container.querySelector("#tab-canvas-btn")?.addEventListener("click", () => {
      activeTab = "canvas";
      render();
    });
    container.querySelector("#tab-text-btn")?.addEventListener("click", () => {
      activeTab = "text";
      render();
    });

    // 3. Khởi tạo Bảng vẽ Canvas nếu đang ở tab canvas
    if (activeTab === "canvas") {
      setupCanvas();
    }

    // 4. Bắt sự kiện gõ nháp chữ
    if (activeTab === "text") {
      setupTextNote();
    }
  }

  function setupTextNote() {
    const textarea = container.querySelector("#scratchpad-input");
    const statusEl = container.querySelector("#scratchpad-status");
    let saveTimeout = null;

    if (textarea) {
      textarea.addEventListener("input", (e) => {
        if (statusEl) statusEl.textContent = "Đang lưu...";
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          store.saveNote(puzzle.id, e.target.value);
          if (statusEl) statusEl.textContent = "Đã lưu ✓";
        }, 300);
      });
    }

    container.querySelector("#btn-clear-note")?.addEventListener("click", async () => {
      const ok = await showConfirmModal({
        title: "Xóa ghi chú chữ?",
        message: "Toàn bộ nội dung ghi chú chữ của câu đố này sẽ bị xóa sạch.",
        confirmText: "Xóa ghi chú",
        type: "danger",
        icon: "📝"
      });
      if (ok) {
        store.saveNote(puzzle.id, "");
        showToast("Đã xóa ghi chú chữ", "info");
        render();
      }
    });
  }

  function setupCanvas() {
    const canvas = container.querySelector("#scratchpad-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let saveDrawingTimeout = null;

    // Thiết lập độ phân giải cao cho màn hình Retina / HiDPI
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Tạo canvas tạm để giữ hình vẽ khi resize
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Phục hồi lại nét vẽ sau khi resize
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
      }
    }

    resizeCanvas();

    // Tự động điều chỉnh kích thước khi co giãn cửa sổ hoặc xoay màn hình điện thoại
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.isConnected) {
          resizeCanvas();
        } else {
          window.removeEventListener("resize", handleResize);
        }
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    // Nạp hình vẽ đã lưu từ trước nếu có
    const savedDrawing = store.getDrawing(puzzle.id);
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        const rect = canvas.getBoundingClientRect();
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        saveHistoryState();
      };
      img.src = savedDrawing;
    } else {
      saveHistoryState();
    }

    function saveHistoryState() {
      try {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const imgData = ctx.getImageData(0, 0, rect.width * dpr, rect.height * dpr);
        undoStack.push(imgData);
        if (undoStack.length > MAX_UNDO) {
          undoStack.shift();
        }
      } catch (e) {
        console.warn("Không thể lưu lịch sử vẽ:", e);
      }
    }

    function scheduleSave() {
      const statusEl = container.querySelector("#scratchpad-status");
      if (statusEl) statusEl.textContent = "Đang lưu bảng vẽ...";

      clearTimeout(saveDrawingTimeout);
      saveDrawingTimeout = setTimeout(() => {
        const dataUrl = canvas.toDataURL("image/png");
        store.saveDrawing(puzzle.id, dataUrl);
        if (statusEl) statusEl.textContent = "Bảng vẽ đã lưu ✓";
      }, 500);
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    // Pointer Events (Hỗ trợ cả chuột, bút stylus cảm ứng và ngón tay)
    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      isDrawing = true;
      const coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;

      // Vẽ ngay 1 điểm tròn khi chạm
      ctx.beginPath();
      ctx.arc(lastX, lastY, (isEraser ? currentLineWidth * 2 : currentLineWidth) / 2, 0, Math.PI * 2);
      ctx.fillStyle = isEraser ? (store.theme === "dark" ? "#0f172a" : "#ffffff") : currentColor;
      ctx.fill();
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const coords = getCoords(e);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);

      if (isEraser) {
        ctx.strokeStyle = store.theme === "dark" ? "#0f172a" : "#ffffff";
        ctx.lineWidth = currentLineWidth * 3.5;
      } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentLineWidth;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      lastX = coords.x;
      lastY = coords.y;
    });

    const stopDrawing = (e) => {
      if (isDrawing) {
        isDrawing = false;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
        saveHistoryState();
        scheduleSave();
      }
    };

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);

    // Gắn công cụ bút / tẩy
    container.querySelector("#tool-pen")?.addEventListener("click", () => {
      isEraser = false;
      render();
    });

    container.querySelector("#tool-eraser")?.addEventListener("click", () => {
      isEraser = true;
      render();
    });

    // Gắn chọn màu
    container.querySelectorAll(".color-picker-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.getAttribute("data-color");
        isEraser = false;
        render();
      });
    });

    // Gắn chọn kích thước nét
    container.querySelectorAll(".size-picker-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentLineWidth = parseInt(btn.getAttribute("data-size"), 10) || 3;
        render();
      });
    });

    // Gắn Undo
    container.querySelector("#btn-undo-canvas")?.addEventListener("click", () => {
      if (undoStack.length > 1) {
        undoStack.pop(); // Bỏ trạng thái hiện tại
        const prevState = undoStack[undoStack.length - 1];
        if (prevState) {
          ctx.putImageData(prevState, 0, 0);
          scheduleSave();
          showToast("Đã hoàn tác", "info");
        }
      } else if (undoStack.length === 1) {
        // Xóa về trắng
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
        undoStack = [];
        scheduleSave();
        showToast("Đã hoàn tác về trắng", "info");
      }
    });

    // Gắn Xóa bảng vẽ
    container.querySelector("#btn-clear-canvas")?.addEventListener("click", async () => {
      const ok = await showConfirmModal({
        title: "Xóa toàn bộ bảng vẽ?",
        message: "Mọi nét vẽ bạn đã phác thảo cho câu đố này sẽ bị xóa sạch.",
        confirmText: "Xóa bảng vẽ",
        type: "danger",
        icon: "🗑️"
      });
      if (ok) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
        undoStack = [];
        store.saveDrawing(puzzle.id, "");
        showToast("Đã xóa bảng vẽ", "info");
        render();
      }
    });
  }

  render();
}
