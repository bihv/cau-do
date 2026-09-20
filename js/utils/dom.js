/**
 * js/utils/dom.js
 * Các hàm tiện ích dùng chung cho DOM, toán học KaTeX, hình ảnh và chuẩn hóa ID
 */

/**
 * Chuẩn hóa số ID câu đố về số nguyên an toàn trong khoảng [1, total]
 * @param {any} val - Giá trị đầu vào (string, number...)
 * @param {number} total - Tổng số câu đố tối đa (mặc định 500)
 * @param {number|null} fallback - Giá trị dự phòng nếu không hợp lệ
 * @returns {number|null}
 */
export function normalizePuzzleId(val, total = 500, fallback = 1) {
  if (val === null || val === undefined) return fallback;
  const num = parseInt(val, 10);
  if (Number.isInteger(num) && num >= 1 && num <= total) {
    return num;
  }
  return fallback;
}

/**
 * Chuyển đổi an toàn chuỗi Markdown sang HTML
 * Hỗ trợ fallback khi marked chưa sẵn sàng
 * @param {string} text - Chuỗi văn bản markdown
 * @returns {string} - Chuỗi HTML đã parse
 */
export function safeParseMarkdown(text) {
  if (!text) return "";
  if (window.marked && typeof window.marked.parse === "function") {
    return window.marked.parse(text);
  }
  return text.replace(/\n/g, "<br>");
}

/**
 * Render công thức toán học KaTeX an toàn cho container
 * Tự động bọc trong khối cuộn ngang trên thiết bị di động
 * @param {HTMLElement} container
 */
export function renderMath(container) {
  if (!container || !window.renderMathInElement) return;

  try {
    window.renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });

    // Đảm bảo các công thức KaTeX dạng block không làm vỡ layout mobile
    const displayMathElements = container.querySelectorAll(".katex-display");
    displayMathElements.forEach((el) => {
      if (!el.parentElement.classList.contains("katex-overflow-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "katex-overflow-wrapper overflow-x-auto py-2 my-2 no-scrollbar";
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }
    });
  } catch (e) {
    console.warn("Lỗi render KaTeX:", e);
  }
}

/**
 * Tự động bọc bảng HTML Markdown trong khung cuộn ngang mượt mà (responsive table wrapper)
 * Giúp hiển thị đẹp, rõ ràng, không bị xô lệch trên cả Mobile và Desktop
 * @param {HTMLElement} container
 */
export function enhanceTables(container) {
  if (!container) return;
  const tables = container.querySelectorAll("table");
  tables.forEach((table) => {
    if (!table.parentElement.classList.contains("table-responsive-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}

/**
 * Hiển thị thông báo nổi Toast thanh lịch, tự động biến mất
 * @param {string} message - Nội dung thông báo
 * @param {"success"|"info"|"warning"|"error"} type - Loại thông báo
 */
export function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  const icons = {
    success: "✓",
    info: "💡",
    warning: "⚠️",
    error: "✕"
  };
  const bgStyles = {
    success: "bg-emerald-600 text-white shadow-emerald-500/20",
    info: "bg-orange-600 text-white shadow-orange-500/20",
    warning: "bg-amber-500 text-white shadow-amber-500/20",
    error: "bg-rose-600 text-white shadow-rose-500/20"
  };

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 transform translate-y-2 opacity-0 ${bgStyles[type] || bgStyles.info}`;
  toast.innerHTML = `
    <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
      ${icons[type] || "•"}
    </span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Kích hoạt animation hiện
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // Tự động ẩn và xóa sau 2.6 giây
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("-translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/**
 * Thêm định dạng hiển thị đẹp và sự kiện click phóng to Lightbox cho tất cả ảnh
 * @param {HTMLElement} container
 * @param {(imgSrc: string) => void} onZoom - Callback khi click vào ảnh
 * @param {string} selector - CSS selector ảnh (mặc định 'img')
 */
export function enhanceImagesWithZoom(container, onZoom, selector = "img") {
  if (!container) return;

  const images = container.querySelectorAll(selector);
  images.forEach((img) => {
    img.classList.add(
      "transition-all",
      "cursor-zoom-in",
      "mx-auto",
      "my-4",
      "max-h-96",
      "object-contain"
    );
    img.setAttribute("title", "Click để phóng to ảnh");

    // Tránh gán sự kiện lặp nhiều lần nếu component re-render
    img.onclick = () => {
      if (typeof onZoom === "function") {
        onZoom(img.src);
      }
    };
  });
}

/**
 * Thoát các ký tự HTML nguy hiểm để render an toàn
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

