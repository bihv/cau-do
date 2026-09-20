/**
 * js/components/ConfirmModal.js
 * Component Hộp thoại Xác nhận (Confirm Modal) tái sử dụng cao cấp
 * Thay thế hoàn toàn hàm window.confirm() mặc định của trình duyệt
 * Trả về Promise<boolean> (true khi bấm Xác nhận, false khi Hủy hoặc bấm Esc)
 */

/**
 * Hiển thị Hộp thoại xác nhận tùy biến
 * @param {Object} options
 * @param {string} options.title - Tiêu đề hộp thoại
 * @param {string} options.message - Nội dung thông điệp
 * @param {string} [options.confirmText="Xác nhận"] - Nhãn nút xác nhận
 * @param {string} [options.cancelText="Hủy bỏ"] - Nhãn nút hủy
 * @param {"danger"|"primary"|"warning"} [options.type="danger"] - Phong cách nút xác nhận
 * @param {string} [options.icon="⚠️"] - Biểu tượng
 * @returns {Promise<boolean>}
 */
export function showConfirmModal({
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "danger",
  icon = "⚠️"
} = {}) {
  return new Promise((resolve) => {
    // Xóa modal cũ nếu đang tồn tại
    const existing = document.getElementById("confirm-dialog-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "confirm-dialog-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200";

    const buttonStyles = {
      danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20",
      primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20",
      warning: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
    };

    const iconBgStyles = {
      danger: "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-transparent dark:border-rose-500/30",
      primary: "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-transparent dark:border-orange-500/30",
      warning: "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-transparent dark:border-amber-500/30"
    };

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl ${iconBgStyles[type] || iconBgStyles.danger} flex items-center justify-center text-2xl shrink-0">
            ${icon}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
              ${title}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-200 mt-1.5 leading-relaxed">
              ${message}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-2.5">
          <button id="confirm-btn-cancel" 
            class="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-transparent dark:border-slate-700/80 transition-colors cursor-pointer">
            ${cancelText}
          </button>
          <button id="confirm-btn-ok" 
            class="px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${buttonStyles[type] || buttonStyles.danger}">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btnCancel = modal.querySelector("#confirm-btn-cancel");
    const btnOk = modal.querySelector("#confirm-btn-ok");

    // Focus vào nút Hủy mặc định để tránh vô tình nhấn Enter
    btnCancel?.focus();

    const cleanup = (result) => {
      document.removeEventListener("keydown", handleKeydown);
      modal.classList.add("opacity-0", "transition-opacity", "duration-150");
      setTimeout(() => {
        modal.remove();
        resolve(result);
      }, 150);
    };

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    btnCancel?.addEventListener("click", () => cleanup(false));
    btnOk?.addEventListener("click", () => cleanup(true));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) cleanup(false);
    });
  });
}
