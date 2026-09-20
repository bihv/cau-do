/**
 * js/config.js
 * Quản lý cấu hình ứng dụng và tải biến môi trường từ file .env
 */

const DEFAULT_CONFIG = {
  DISQUS_SHORTNAME: "quizz-1",
  SITE_TITLE: "500 Câu Đố Trí Tuệ",
  SITE_DESCRIPTION: "Kho tàng 500 câu đố rèn luyện tư duy logic & trí tuệ",
  SITE_URL: window.location.origin || "http://localhost:8080",
  MAX_SEARCH_RESULTS: 20
};

let appConfig = { ...DEFAULT_CONFIG, ...(window.__APP_CONFIG__ || {}) };
let isLoaded = false;

/**
 * Phân tích cú pháp file .env dạng KEY=VALUE
 */
function parseEnv(envText) {
  const result = {};
  const lines = envText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Bỏ dấu ngoặc kép hoặc đơn nếu có
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

/**
 * Khởi tạo và nạp cấu hình từ .env (nếu chạy local) hoặc fallback tĩnh an toàn
 */
export async function initConfig() {
  if (isLoaded) return appConfig;

  // Nếu đã có cấu hình được tiêm từ window.__APP_CONFIG__
  if (window.__APP_CONFIG__) {
    appConfig = { ...DEFAULT_CONFIG, ...window.__APP_CONFIG__ };
  }

  // Thử tải .env trên môi trường dev local
  try {
    const res = await fetch(".env");
    if (res.ok) {
      const text = await res.text();
      const parsed = parseEnv(text);
      appConfig = { ...appConfig, ...parsed };
      console.log("⚙️ Đã nạp cấu hình từ .env:", appConfig.DISQUS_SHORTNAME);
    }
  } catch (_err) {
    // Trên môi trường tĩnh (GitHub Pages) không có .env là hoàn toàn bình thường, dùng DEFAULT_CONFIG
  }

  isLoaded = true;
  return appConfig;
}

/**
 * Lấy giá trị cấu hình theo key
 */
export function getConfig(key, defaultValue = "") {
  return appConfig[key] !== undefined ? appConfig[key] : defaultValue;
}
