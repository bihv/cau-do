/**
 * js/components/RandomFAB.js
 * Nút Nổi Ngẫu Nhiên (Floating Action Button) đặt cố định góc dưới bên phải màn hình
 * Tối ưu vị trí để không che khuất thanh điều hướng BottomBar trên điện thoại
 */

import { store } from "../store/state.js";
import { navigateToPuzzle } from "../router/router.js";

export function renderRandomFAB(container) {
  // Đã tích hợp nút Ngẫu nhiên lên Header và phím tắt R, loại bỏ FAB nổi để giải phóng không gian đọc
  container.innerHTML = "";
}
