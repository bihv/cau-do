/**
 * js/main.js
 * Entry point chính của ứng dụng web 500 Câu Đố Logic
 * Quản lý khởi động, nạp cấu hình, router và hệ thống phím tắt toàn cục
 */

import { initConfig } from "./config.js";
import { store } from "./store/state.js";
import { initRouter, navigateToPuzzle } from "./router/router.js";
import { showToast } from "./utils/dom.js";
import { renderHomeView } from "./views/HomeView.js";
import { renderHeader } from "./components/Header.js";
import { renderPuzzleCard } from "./components/PuzzleCard.js";
import { renderNavigationDrawer } from "./components/NavigationDrawer.js";
import { renderImageZoomModal } from "./components/ImageZoomModal.js";
import { renderRandomFAB } from "./components/RandomFAB.js";
import { renderBottomBar } from "./components/BottomBar.js";

async function bootstrap() {
  console.log("🚀 Đang khởi động 500 Câu Đố Trí Tuệ Web App...");

  // 1. Nạp cấu hình từ .env
  await initConfig();

  // 2. Nạp dữ liệu câu đố và trạng thái
  await store.init();

  // 3. Khởi tạo định tuyến Router
  initRouter();

  // 4. Mount các Component vào DOM
  const homeEl = document.getElementById("home-view");
  const puzzleEl = document.getElementById("puzzle-view");
  const headerEl = document.getElementById("header-mount");
  const mainEl = document.getElementById("main-mount");
  const drawerEl = document.getElementById("drawer-mount");
  const zoomEl = document.getElementById("zoom-modal-mount");
  const fabEl = document.getElementById("fab-mount");
  const bottomBarEl = document.getElementById("bottom-bar-mount");

  if (homeEl) renderHomeView(homeEl);
  if (headerEl) renderHeader(headerEl);
  if (mainEl) renderPuzzleCard(mainEl);
  if (drawerEl) renderNavigationDrawer(drawerEl);
  if (zoomEl) renderImageZoomModal(zoomEl);
  if (fabEl) renderRandomFAB(fabEl);
  if (bottomBarEl) renderBottomBar(bottomBarEl);

  // 5. Quản lý chuyển đổi hiển thị giữa Home View và Puzzle View (Fade Transition 150ms)
  function syncView() {
    const isHome = store.currentView === "home";
    if (homeEl) {
      if (isHome) {
        homeEl.style.display = "block";
        requestAnimationFrame(() => {
          homeEl.classList.remove("opacity-0");
          homeEl.classList.add("opacity-100");
        });
      } else {
        homeEl.classList.remove("opacity-100");
        homeEl.classList.add("opacity-0");
        homeEl.style.display = "none";
      }
    }

    if (puzzleEl) {
      if (!isHome) {
        puzzleEl.style.display = "flex";
        requestAnimationFrame(() => {
          puzzleEl.classList.remove("opacity-0");
          puzzleEl.classList.add("opacity-100");
        });
      } else {
        puzzleEl.classList.remove("opacity-100");
        puzzleEl.classList.add("opacity-0");
        puzzleEl.style.display = "none";
      }
    }
  }

  store.subscribe(syncView);
  syncView();

  // 6. Đăng ký phím tắt bàn phím toàn cục (Keyboard Shortcuts)
  setupKeyboardShortcuts();

  console.log("✨ Ứng dụng đã sẵn sàng!");
}

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const isEditing = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

    // Phím Esc: Đóng modal, drawer, hoặc hủy focus ô nhập liệu
    if (e.key === "Escape") {
      const shortcutsModal = document.getElementById("shortcuts-modal");
      if (shortcutsModal) {
        shortcutsModal.remove();
        return;
      }
      if (store.isZoomModalOpen) {
        store.closeZoomModal();
        return;
      }
      if (store.isDrawerOpen) {
        store.setDrawerOpen(false);
        return;
      }
      if (isEditing) {
        activeEl.blur();
        return;
      }
    }

    // Phím Ctrl+K / Cmd+K: Mở / đóng Spotlight tìm kiếm & Danh mục
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      store.setDrawerOpen(!store.isDrawerOpen);
      return;
    }

    // Nếu đang nhập liệu trong ô input hoặc textarea thì bỏ qua các phím tắt chữ cái
    if (isEditing) return;

    // Phím /: Mở nhanh Spotlight tìm kiếm
    if (e.key === "/") {
      e.preventDefault();
      store.setDrawerOpen(true);
      return;
    }

    // Phím D: Bật / Tắt Chế độ Tối (Dark Mode)
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      store.toggleTheme();
      showToast(store.theme === "dark" ? "Đã bật Chế độ Tối 🌙" : "Đã bật Chế độ Sáng ☀️", "info");
      return;
    }

    // Phím M: Mở / đóng Spotlight tìm kiếm & Danh mục
    if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      store.setDrawerOpen(!store.isDrawerOpen);
      return;
    }

    // Phím R: Câu ngẫu nhiên (hoạt động cả ở Home và Puzzle View)
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      const randomId = store.getRandomUnsolvedId();
      navigateToPuzzle(randomId);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Nếu đang ở Trang Chủ (Home View), không kích hoạt các phím điều hướng câu đố bên dưới
    if (store.currentView === "home") return;

    // Nếu drawer hoặc modal đang mở thì không bấm next/prev/space/c/b
    if (store.isDrawerOpen || store.isZoomModalOpen) return;

    // Phím C: Mở / Đóng Bảng nháp & Vẽ hình (chỉ ở Puzzle View)
    if (e.key === "c" || e.key === "C") {
      e.preventDefault();
      if (window.innerWidth < 1024) {
        store.setMobileTab(store.activeMobileTab === "scratchpad" ? "problem" : "scratchpad");
      } else {
        document.getElementById("btn-toggle-scratchpad")?.click();
      }
      return;
    }

    // Phím Mũi tên trái / J / P: Câu trước
    if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J" || e.key === "p" || e.key === "P") {
      e.preventDefault();
      if (store.currentPuzzleId > 1) {
        navigateToPuzzle(store.currentPuzzleId - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Phím Mũi tên phải / K / N: Câu sau
    if (e.key === "ArrowRight" || e.key === "k" || e.key === "K" || e.key === "n" || e.key === "N") {
      e.preventDefault();
      if (store.currentPuzzleId < store.puzzles.length) {
        navigateToPuzzle(store.currentPuzzleId + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Phím Space: Mở / Đóng đáp án
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      store.toggleAnswer();
      return;
    }

    // Phím B: Bookmark
    if (e.key === "b" || e.key === "B") {
      e.preventDefault();
      store.toggleBookmark();
      return;
    }
  });
}

// Bắt đầu khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
