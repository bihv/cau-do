/**
 * js/components/ImageZoomModal.js
 * Modal phóng to toàn màn hình hình vẽ minh họa SVG & ảnh sơ đồ
 */

import { store } from "../store/state.js";

export function renderImageZoomModal(container) {
  function update() {
    if (!store.isZoomModalOpen || !store.zoomImageUrl) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div id="zoom-modal-backdrop" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        
        <!-- Nút Đóng góc trên -->
        <button id="btn-close-zoom"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg transition-all cursor-pointer shadow-lg"
          title="Đóng (Phím Esc)">
          ✕
        </button>

        <!-- Khung chứa ảnh -->
        <div class="relative max-w-4xl max-h-[88vh] w-full flex items-center justify-center p-2">
          <img src="${store.zoomImageUrl}" 
            alt="Hình vẽ phóng to"
            class="max-w-full max-h-[85vh] object-contain animate-in zoom-in-95 duration-200" />
        </div>

        <div class="absolute bottom-4 inset-x-0 text-center text-white/70 text-xs pointer-events-none">
          Click ra ngoài hoặc nhấn <kbd class="px-1.5 py-0.5 bg-white/20 rounded font-mono font-bold">Esc</kbd> để đóng
        </div>
      </div>
    `;

    container.querySelector("#btn-close-zoom")?.addEventListener("click", () => {
      store.closeZoomModal();
    });

    container.querySelector("#zoom-modal-backdrop")?.addEventListener("click", (e) => {
      if (e.target.id === "zoom-modal-backdrop") {
        store.closeZoomModal();
      }
    });
  }

  store.subscribe(update);
  update();
}
