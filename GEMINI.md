# Nền Tảng Web 500 Câu Đố Trí Tuệ & Tư Duy Logic

## Hướng Dẫn Kỹ Thuật & Vận Hành Cho AI Agent

Dự án này là một **Nền tảng Ứng dụng Web tương tác hiện đại** dành cho việc học tập, rèn luyện tư duy logic và giải 500 câu đố trí tuệ kinh điển. 

Trọng tâm cốt lõi hiện tại của dự án là **phát triển, tối ưu hóa giao diện Web App**, **nâng cao trải nghiệm người dùng (UI/UX)**, **hoàn thiện hệ thống đồ họa Vector SVG độ nét cao**, và **duy trì tính toàn vẹn của dữ liệu**.

---

### 1. Kiến Trúc Ứng Dụng Web (`/` & `/js`)

Ứng dụng web được xây dựng theo kiến trúc **Single Page Application (SPA)** thuần túy, không dùng framework nặng, tải nhanh tức thì và không cần bước build phức tạp:

- **Công nghệ nền tảng:**
  - HTML5 chuẩn SEO, ngữ nghĩa rõ ràng.
  - Vanilla JavaScript ES Modules (ES6+).
  - Tailwind CSS v4 browser runtime (`@tailwindcss/browser@4`).
  - Google Fonts: `Plus Jakarta Sans`.
- **Thư viện tích hợp:**
  - `KaTeX`: Tự động biên dịch công thức toán học và ký hiệu logic trong đề bài và lời giải.
  - `Marked.js`: Render định dạng Markdown sang HTML an toàn.
  - `Canvas Confetti`: Hiệu ứng chúc mừng khi người dùng mở đáp án hoặc giải đúng.
  - `Disqus`: Hệ thống bình luận và tương tác cộng đồng tích hợp dưới mỗi câu đố.
- **Cấu trúc Module JavaScript (`js/`):**
  - `js/main.js`: Khởi tạo ứng dụng, tải dữ liệu từ `data/puzzles.json`, khởi động store và router.
  - `js/store/state.js`: Quản lý reactive state tập trung (câu đố hiện tại, danh sách yêu thích, trạng thái mở đáp án, lịch sử đọc dở) và đồng bộ với `localStorage`.
  - `js/router/router.js`: Điều hướng URL hash dạng `#cau-001`.
  - `js/components/`: Các thành phần giao diện độc lập:
    - `Header.js`: Thanh tiêu đề, nút tìm kiếm nhanh, nút mở danh mục chuyên đề.
    - `PuzzleCard.js`: Khung flashcard câu đố trung tâm.
    - `NavigationDrawer.js`: Ngăn danh mục 10 chuyên đề bên sườn.
    - `ProblemBox.js`: Khối nội dung đề bài và hình minh họa.
    - `AnswerSection.js`: Khối đáp án & lời giải chi tiết (hỗ trợ toggle xem đáp án).
    - `Scratchpad.js`: Bảng vẽ nháp tương tác trên Canvas (chọn màu, tẩy, xóa nháp).
    - `ImageZoomModal.js`: Modal phóng to chi tiết hình vẽ vector SVG.
    - `RandomFAB.js`: Nút tròn nổi chọn câu đố ngẫu nhiên.
    - `DisqusThread.js`: Tích hợp thảo luận cộng đồng Disqus.
    - `BottomBar.js`: Thanh điều hướng câu trước/sau.
  - `js/config.js`: Cấu hình ứng dụng, shortname Disqus và tùy chọn tìm kiếm.
  - `js/utils/dom.js`: Tiện ích tạo DOM, format text, debounce, v.v.

---

### 2. Quy Định Bắt Buộc Khi Thao Tác (CRITICAL CONSTRAINTS)

#### 2.1. Phát triển & Tinh chỉnh Giao diện Web:
1. **Thiết kế cao cấp (UI Premium):** Tuân thủ bảng màu Slate / Orange (Vibrant Orange) / Emerald hiện đại, bo góc mượt mà, shadow nhiều tầng, micro-interactions sống động.
2. **Khả năng tương thích responsive:** Giao diện phải hiển thị hoàn hảo trên cả điện thoại di động (mobile), máy tính bảng (tablet) và màn hình máy tính để bàn (desktop).
3. **Phím tắt tiện dụng:** Đảm bảo hệ thống phím tắt (`←`, `→`, `Space`, `R`, `N`, `Esc`) luôn hoạt động nhịp nhàng và không xung đột khi người dùng đang nhập liệu trong ô tìm kiếm.

#### 2.2. Quy chuẩn Đồ họa Vector SVG (draw-puzzle-svg):
Khi vẽ hoặc cập nhật hình minh họa câu đố:
1. **Sạch chữ tiếng Việt:** KHÔNG đưa chữ tiêu đề, đề bài, lời giải tiếng Việt vào trong file SVG. Chỉ giữ lại ký hiệu hình học toán học ($A, B, C, D$, tên phòng $R, S, T...$ hoặc dấu hỏi `?`).
2. **Bộ đôi Vector Đề bài & Đáp án:**
   - Đề bài: `cau_xxx_vector.svg` (thể hiện ô trống mục tiêu viền nét đứt màu hổ phách `#f59e0b`).
   - Đáp án: `cau_xxx_dapan_vector.svg` (thể hiện phương án đúng màu xanh ngọc Emerald `#10b981`, huy hiệu checkmark, làm mờ các phương án sai).
3. **Tách nền trong suốt & Đa theme:** KHÔNG vẽ thẻ `<rect>` bao toàn bộ canvas. Dùng `<style><![CDATA[ ... ]]></style>` hỗ trợ `@media (prefers-color-scheme: dark)` để card/badge tự thích ứng cả Light & Dark mode.
4. **Chuẩn XML tuyệt đối:** Bắt buộc bọc `<style>` trong `<![CDATA[ ... ]]>`, tuyệt đối không để ký tự `&` tự do (thay bằng `and`/`&amp;`). Kiểm tra hợp lệ bằng `xml.etree.ElementTree` trước khi bàn giao.
5. **Bố cục đường nét & chữ:** Khi có badge nằm trên tia số/đường thẳng, phải ngắt đường kẻ quanh badge hoặc đặt nền đục 100% để chữ không bao giờ bị đường kẻ cắt ngang hay đè lên.
6. **Tránh bẫy W3C Zero-Area Bounding Box Trap:** Đoạn thẳng ngang hoặc dọc đơn lẻ KHÔNG dùng `<line>` có filter mà PHẢI dùng `<rect rx="...">` để tránh lỗi biến mất đường nét trên trình duyệt.

#### 2.3. Quy trình Đồng Bộ Dữ Liệu Web:
- **BẮT BUỘC CHẠY SCRIPT BIÊN DỊCH:** Sau khi thêm, sửa bất kỳ file Markdown hay ảnh SVG nào trong `cau_do/`, AI Agent phải chạy lệnh sau để cập nhật `data/puzzles.json`:
  ```bash
  python scripts/build_web_data.py
  ```

---

### 3. Bảng Phân Bố 10 Chuyên Đề Dữ Liệu

Toàn bộ 500 câu đố đã hoàn thành 100% và được phân loại thành 10 chuyên đề:

| Tập | Phần | Tên Chuyên Đề | Thư Mục Dữ Liệu | Dải Câu Đố | Số Lượng |
| :---: | :---: | :--- | :--- | :---: | :---: |
| **Tập 1** | **Phần 1** | Phương pháp Loại trừ | `cau_do/tap_1/phan_1_phuong_phap_loai_tru` | Câu 001 – 057 | 57 câu |
| **Tập 1** | **Phần 2** | Phương pháp Đệ quy | `cau_do/tap_1/phan_2_phuong_phap_de_quy` | Câu 058 – 118 | 61 câu |
| **Tập 1** | **Phần 3** | Phương pháp Suy diễn ngược | `cau_do/tap_1/phan_3_phuong_phap_suy_dien_nguoc` | Câu 119 – 172 | 54 câu |
| **Tập 1** | **Phần 4** | Phương pháp Giả thiết | `cau_do/tap_1/phan_4_phuong_phap_gia_thiet` | Câu 173 – 232 | 60 câu |
| **Tập 2** | **Phần 5** | Phương pháp Tính toán | `cau_do/tap_2/phan_5_phuong_phap_tinh_toan` | Câu 233 – 285 | 53 câu |
| **Tập 2** | **Phần 6** | Phương pháp Phân tích | `cau_do/tap_2/phan_6_phuong_phap_phan_tich` | Câu 286 – 367 | 82 câu |
| **Tập 2** | **Phần 7** | Phương pháp Vẽ hình | `cau_do/tap_2/phan_7_phuong_phap_ve_hinh` | Câu 368 – 390 | 23 câu |
| **Tập 2** | **Phần 8** | Phương pháp Loại suy | `cau_do/tap_2/phan_8_phuong_phap_loai_suy` | Câu 391 – 437 | 47 câu |
| **Tập 2** | **Phần 9** | Phương pháp Tổng hợp | `cau_do/tap_2/phan_9_phuong_phap_tong_hop` | Câu 438 – 464 | 27 câu |
| **Tập 2** | **Phần 10** | Thử làm Sherlock Holmes | `cau_do/tap_2/phan_10_thu_lam_sherlock_holmes` | Câu 465 – 500 | 36 câu |
| **Tổng** | **10 Phần** | **Trọn Bộ 2 Tập** | | **Câu 001 – 500** | **500 câu** |

---

### 4. Kích Hoạt Kỹ Năng (Skills)

1. **Skill Vẽ lại ảnh Vector SVG:**
   - Hướng dẫn chi tiết kỹ thuật dựng hình, tính toán tọa độ ma trận và bảng màu UI Premium:
   - [.agents/skills/draw-puzzle-svg/SKILL.md](.agents/skills/draw-puzzle-svg/SKILL.md)
