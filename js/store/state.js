/**
 * js/store/state.js
 * Quản lý trạng thái toàn cục (Reactive State) và lưu trữ LocalStorage
 */

import { normalizePuzzleId } from "../utils/dom.js";

const STORAGE_KEYS = {
  SOLVED: "cau_do_solved_ids",
  REVIEW: "cau_do_review_ids",
  BOOKMARKS: "cau_do_bookmark_ids",
  NOTES: "cau_do_scratchpad_notes",
  DRAWINGS: "cau_do_scratchpad_drawings",
  THEME: "cau_do_theme",
  LAST_ID: "cau_do_last_viewed_id"
};

class Store {
  constructor() {
    this.puzzles = [];
    this.currentPuzzleId = 1;
    this.isAnswerRevealed = false;
    this.isDrawerOpen = false;
    this.isZoomModalOpen = false;
    this.zoomImageUrl = "";
    this.searchQuery = "";
    this.selectedPart = "all";
    this.selectedDifficulty = "all";
    this.selectedStatus = "all"; // 'all' | 'unsolved' | 'solved' | 'bookmarked'
    this.theme = "light"; // 'light' | 'dark'
    this.activeMobileTab = "problem"; // 'problem' | 'answer' | 'scratchpad'
    this.currentView = "home"; // 'home' | 'puzzle'

    // LocalStorage sets
    this.solvedSet = new Set();
    this.reviewSet = new Set();
    this.bookmarkSet = new Set();
    this.notesMap = {};
    this.drawingsMap = {};

    this.listeners = new Set();
  }

  /**
   * Khởi tạo store: nạp dữ liệu từ LocalStorage và tải puzzles.json
   */
  async init() {
    this.loadFromStorage();
    this.applyTheme();

    try {
      const res = await fetch("data/puzzles.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("Không thể tải data/puzzles.json");
      this.puzzles = await res.json();
      console.log(`📚 Đã nạp ${this.puzzles.length} câu đố vào Store`);
    } catch (err) {
      console.error("Lỗi nạp dữ liệu câu đố:", err);
    }

    // Khôi phục câu đố xem gần nhất nếu có (khi URL chưa có ?cau=...)
    const savedLastId = localStorage.getItem(STORAGE_KEYS.LAST_ID);
    const urlParams = new URLSearchParams(window.location.search);
    if (savedLastId && !urlParams.get("cau") && !window.location.hash) {
      this.currentPuzzleId = normalizePuzzleId(savedLastId, this.puzzles.length || 500, 1);
    }

    this.notify();
    return this.puzzles;
  }

  loadFromStorage() {
    try {
      const solved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED) || "[]");
      this.solvedSet = new Set(solved);

      const review = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEW) || "[]");
      this.reviewSet = new Set(review);

      const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]");
      this.bookmarkSet = new Set(bookmarks);

      this.notesMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || "{}");
      this.drawingsMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAWINGS) || "{}");

      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === "dark" || savedTheme === "light") {
        this.theme = savedTheme;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        this.theme = "dark";
      }
    } catch (e) {
      console.warn("Lỗi đọc LocalStorage, khởi tạo rỗng:", e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.SOLVED, JSON.stringify([...this.solvedSet]));
      localStorage.setItem(STORAGE_KEYS.REVIEW, JSON.stringify([...this.reviewSet]));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...this.bookmarkSet]));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.notesMap));
      localStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(this.drawingsMap));
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
      localStorage.setItem(STORAGE_KEYS.LAST_ID, this.currentPuzzleId.toString());
    } catch (e) {
      console.warn("Lỗi ghi LocalStorage:", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  // Quản lý Giao diện Sáng / Tối
  setTheme(theme) {
    this.theme = theme === "dark" ? "dark" : "light";
    this.applyTheme();
    this.saveToStorage();
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === "dark" ? "light" : "dark");
  }

  applyTheme() {
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Lấy câu đố hiện tại
  getCurrentPuzzle() {
    if (!this.puzzles.length) return null;
    return this.puzzles.find((p) => p.id === this.currentPuzzleId) || this.puzzles[0];
  }

  // Đổi câu đố hiện tại
  setCurrentPuzzleId(id) {
    const num = normalizePuzzleId(id, this.puzzles.length || 500, null);
    if (!num) return;
    if (this.currentPuzzleId !== num) {
      this.currentPuzzleId = num;
      this.isAnswerRevealed = false; // Luôn ẩn đáp án khi sang câu mới
      this.activeMobileTab = "problem"; // Reset về tab đề bài khi sang câu mới
      this.saveToStorage();
      this.notify();
    }
  }

  // Chuyển đổi tab trên màn hình di động ('problem' | 'answer' | 'scratchpad')
  setMobileTab(tab) {
    if (tab === "answer") {
      this.isAnswerRevealed = true; // Tự động mở lời giải ngay lập tức khi người dùng chọn tab Lời giải
    }
    const tabChanged = this.activeMobileTab !== tab;
    this.activeMobileTab = tab;
    this.notify();
  }

  // Bật / tắt đáp án
  toggleAnswer(forceState) {
    if (typeof forceState === "boolean") {
      this.isAnswerRevealed = forceState;
    } else {
      this.isAnswerRevealed = !this.isAnswerRevealed;
    }
    // Khi mở đáp án, nếu đang ở mobile (< 1024px) thì tự động chuyển sang tab đáp án
    if (this.isAnswerRevealed && window.innerWidth < 1024) {
      this.activeMobileTab = "answer";
    }
    this.notify();
  }

  // Tự chấm điểm: Giải đúng
  markSolved(id = this.currentPuzzleId) {
    this.solvedSet.add(id);
    this.reviewSet.delete(id);
    this.saveToStorage();
    this.notify();
  }

  // Tự chấm điểm: Cần ngẫm lại
  markReview(id = this.currentPuzzleId) {
    this.reviewSet.add(id);
    this.solvedSet.delete(id);
    this.saveToStorage();
    this.notify();
  }

  // Bật / tắt Bookmark
  toggleBookmark(id = this.currentPuzzleId) {
    if (this.bookmarkSet.has(id)) {
      this.bookmarkSet.delete(id);
    } else {
      this.bookmarkSet.add(id);
    }
    this.saveToStorage();
    this.notify();
  }

  // Quản lý ô nháp văn bản
  getNote(id = this.currentPuzzleId) {
    return this.notesMap[id] || "";
  }

  saveNote(id, text) {
    this.notesMap[id] = text;
    this.saveToStorage();
  }

  // Quản lý bảng vẽ nháp Canvas
  getDrawing(id = this.currentPuzzleId) {
    return this.drawingsMap[id] || "";
  }

  saveDrawing(id, dataUrl) {
    if (!dataUrl) {
      delete this.drawingsMap[id];
    } else {
      this.drawingsMap[id] = dataUrl;
    }
    this.saveToStorage();
  }

  // Drawer & Spotlight
  setDrawerOpen(isOpen, phanName = null) {
    this.isDrawerOpen = isOpen;
    if (phanName !== null) {
      this.selectedPart = phanName;
    }
    this.notify();
  }

  // Mở Drawer với chuyên đề cụ thể
  openDrawerWithTopic(phanName) {
    this.selectedPart = phanName || "Tất cả chuyên đề";
    this.isDrawerOpen = true;
    this.notify();
  }

  // Modal Zoom ảnh
  openZoomModal(imageUrl) {
    this.zoomImageUrl = imageUrl;
    this.isZoomModalOpen = true;
    this.notify();
  }

  closeZoomModal() {
    this.isZoomModalOpen = false;
    this.zoomImageUrl = "";
    this.notify();
  }

  // Lấy câu ngẫu nhiên chưa giải (hoặc ngẫu nhiên bất kỳ nếu đã giải hết)
  getRandomUnsolvedId() {
    if (!this.puzzles.length) return 1;
    const unsolved = this.puzzles.filter((p) => !this.solvedSet.has(p.id));
    const pool = unsolved.length > 0 ? unsolved : this.puzzles;
    // Tránh câu hiện tại nếu pool > 1
    const eligible = pool.filter((p) => p.id !== this.currentPuzzleId);
    const chosen = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : pool[0];
    return chosen.id;
  }

  // Thống kê tiến độ
  getStats() {
    const total = this.puzzles.length || 500;
    const solved = this.solvedSet.size;
    const review = this.reviewSet.size;
    const bookmarked = this.bookmarkSet.size;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, review, bookmarked, percent };
  }

  // Quản lý chuyển đổi View ('home' | 'puzzle')
  setView(view) {
    const target = view === "puzzle" ? "puzzle" : "home";
    if (this.currentView !== target) {
      this.currentView = target;
      this.notify();
    }
  }

  // Lấy câu chưa giải gần nhất của một chuyên đề
  getNearestUnsolvedForTopic(phanName) {
    if (!this.puzzles.length) return 1;
    const topicPuzzles = this.puzzles.filter(
      (p) => p.phan && p.phan.toLowerCase() === phanName.toLowerCase()
    );
    if (!topicPuzzles.length) return 1;
    const unsolved = topicPuzzles.find((p) => !this.solvedSet.has(p.id));
    return unsolved ? unsolved.id : topicPuzzles[0].id;
  }

  // Thống kê chi tiết cho một chuyên đề
  getTopicStats(phanName) {
    const topicPuzzles = this.puzzles.filter(
      (p) => p.phan && p.phan.toLowerCase() === phanName.toLowerCase()
    );
    const total = topicPuzzles.length;
    if (total === 0) return { total: 0, solved: 0, percent: 0 };
    let solved = 0;
    for (const p of topicPuzzles) {
      if (this.solvedSet.has(p.id)) solved++;
    }
    const percent = Math.round((solved / total) * 100);
    return { total, solved, percent };
  }

  // Lấy câu đang đọc dở (lịch sử) hoặc câu 1
  getLastViewedOrFirstId() {
    const savedLastId = localStorage.getItem(STORAGE_KEYS.LAST_ID);
    if (savedLastId) {
      return normalizePuzzleId(savedLastId, this.puzzles.length || 500, 1);
    }
    return this.currentPuzzleId || 1;
  }
}

export const store = new Store();
