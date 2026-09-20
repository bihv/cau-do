/**
 * js/router/router.js
 * Quản lý định tuyến URL dạng Query Parameter (?cau=1 đến ?cau=500)
 * Hoàn toàn không có dấu '#' - Tương thích 100% với GitHub Pages khi F5 hoặc chia sẻ link
 */

import { store } from "../store/state.js";
import { normalizePuzzleId } from "../utils/dom.js";

/**
 * Xử lý phân tích URL hiện tại để đồng bộ vào store
 */
function handleUrlChange() {
  const url = new URL(window.location.href);
  const paramVal = url.searchParams.get("cau") || url.searchParams.get("id");

  // 1. Kiểm tra query param ?cau=X
  if (paramVal) {
    const validId = normalizePuzzleId(paramVal, store.puzzles.length || 500, null);
    if (validId) {
      store.setCurrentPuzzleId(validId);
      return;
    }
  }

  // 2. Tương thích ngược: Nếu người dùng truy cập link hash cũ (#/cau-123)
  const hash = window.location.hash;
  const hashMatch = hash.match(/^#\/?cau-(\d+)$/i);
  if (hashMatch) {
    const legacyId = normalizePuzzleId(hashMatch[1], store.puzzles.length || 500, null);
    if (legacyId) {
      navigateToPuzzle(legacyId, true);
      return;
    }
  }

  // 3. Nếu chưa có tham số câu đố nào trên URL, gắn câu hiện tại
  navigateToPuzzle(store.currentPuzzleId, true);
}

/**
 * Khởi tạo Router lắng nghe sự kiện popstate
 */
export function initRouter() {
  // Lắng nghe sự kiện người dùng bấm nút Back / Forward trên trình duyệt
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.puzzleId) {
      store.setCurrentPuzzleId(e.state.puzzleId);
    } else {
      handleUrlChange();
    }
  });

  // Khởi động lần đầu
  handleUrlChange();
}

/**
 * Điều hướng tới một câu đố cụ thể qua Query Parameter (?cau=X)
 * @param {number|string} id - Số câu đố
 * @param {boolean} replace - Dùng replaceState thay vì pushState (không tạo lịch sử mới)
 */
export function navigateToPuzzle(id, replace = false) {
  const validId = normalizePuzzleId(id, store.puzzles.length || 500, store.currentPuzzleId);
  const url = new URL(window.location.href);
  const currentParam = url.searchParams.get("cau");

  if (currentParam === String(validId) && !url.hash) {
    store.setCurrentPuzzleId(validId);
    return;
  }

  url.searchParams.set("cau", validId);
  url.hash = ""; // Xóa sạch dấu # nếu có

  if (replace) {
    window.history.replaceState({ puzzleId: validId }, "", url.toString());
  } else {
    window.history.pushState({ puzzleId: validId }, "", url.toString());
  }

  store.setCurrentPuzzleId(validId);
}
