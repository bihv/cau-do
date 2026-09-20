# Nền Tảng Web 500 Câu Đố Trí Tuệ & Tư Duy Logic

Một ứng dụng web tương tác hiện đại, trực quan và tốc độ cao giúp người học thử thách và rèn luyện tư duy logic, toán học và chỉ số IQ thông qua kho tàng **500 câu đố trí tuệ kinh điển** được phân loại khoa học theo 10 phương pháp tư duy.

![Web App](https://img.shields.io/badge/Web_App-Modern_SPA-blue?style=for-the-badge&logo=javascript)
![Số lượng câu đố](https://img.shields.io/badge/Kho_dữ_liệu-500_Câu_Đố_Hoàn_Chỉnh-emerald?style=for-the-badge&logo=target)
![Vector SVG](https://img.shields.io/badge/Đồ_họa_Vector-77+_SVG_Độ_Nét_Cao-indigo?style=for-the-badge&logo=inkscape)
![Styling](https://img.shields.io/badge/Giao_diện-Tailwind_CSS_v4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 🌟 Trải Nghiệm & Tính Năng Nổi Bật Trên Web

Ứng dụng được xây dựng theo kiến trúc **Single Page Application (SPA)** thuần túy (Vanilla ES Modules + Tailwind CSS v4), mang lại tốc độ tải tức thì, giao diện sang trọng và mượt mà:

1. 🗂️ **Thẻ Flashcard Tương Tác:** Trình bày đề bài rõ ràng, mạch lạc, hiển thị đầy đủ chuyên đề, mức độ khó và nguồn trang sách. Lật mở đáp án & lời giải chi tiết mượt mà kèm hiệu ứng pháo hoa chúc mừng (`canvas-confetti`).
2. 🧭 **Ngăn Danh Mục 10 Chuyên Đề (Navigation Drawer):** Dễ dàng duyệt qua 10 phương pháp tư duy logic, theo dõi số lượng câu đố và chuyển nhanh tới bất kỳ câu nào.
3. 🔍 **Tìm Kiếm Tức Thì (Instant Live Search):** Tìm kiếm thông minh theo số câu (ví dụ `#065`, `cau 122`), tên bài toán, từ khóa nội dung hoặc lọc theo mức độ (Dễ, Trung bình, Khó).
4. 🎲 **Khám Phá Ngẫu Nhiên (Random FAB):** Nút tròn nổi bật ở góc dưới màn hình giúp bạn thử thách trí não với một câu đố bất kỳ chỉ bằng một cú click.
5. 📝 **Bảng Vẽ Nháp Trực Tiếp (Scratchpad Canvas):** Hỗ trợ giải toán và tư duy hình học với bảng vẽ tương tác ngay trên màn hình (đổi màu nét vẽ, tẩy, xóa bảng nháp).
6. 🔍 **Phóng To Hình Vẽ (Image Zoom Modal):** Click vào bất kỳ hình vẽ hoặc ma trận IQ nào để mở modal phóng to chi tiết với nền tối sang trọng, xem rõ từng nét vẽ vector.
7. 📐 **Biên Dịch Toán Học KaTeX:** Tự động hiển thị các công thức toán học và ký hiệu logic chuẩn xác theo chuẩn LaTeX.
8. 💬 **Bình Luận Cộng Đồng Disqus:** Thảo luận, chia sẻ góc nhìn và các cách giải sáng tạo dưới mỗi câu đố.
9. ⌨️ **Hệ Thống Phím Tắt Tiện Dụng:**
   - `←` / `→`: Chuyển câu trước / câu kế tiếp
   - `Space`: Mở / đóng xem đáp án & lời giải
   - `R`: Bốc câu đố ngẫu nhiên
   - `N`: Bật / tắt bảng vẽ nháp
   - `Esc`: Đóng ngăn danh mục, modal phóng to hoặc bảng vẽ nháp
10. 💾 **Lưu Trạng Thái Học Tập (LocalStorage):** Tự động ghi nhớ các câu đã xem lời giải, danh sách câu yêu thích (Bookmark) và vị trí câu đang đọc dở.

---

## 🚀 Hướng Dẫn Khởi Chạy Web App

Ứng dụng chạy trực tiếp trên trình duyệt mà không cần cài đặt Node.js hay qua bất kỳ bước build phức tạp nào:

### 1. Khởi động Web Server cục bộ
Bạn có thể sử dụng bất kỳ static server nào. Đơn giản nhất là dùng Python có sẵn trong máy:

```bash
# Chạy static server tại thư mục gốc của dự án
python -m http.server 8080
```

### 2. Trải nghiệm trên trình duyệt
Mở trình duyệt web và truy cập địa chỉ:
```
http://localhost:8080
```

*(Bạn cũng có thể dùng `npx serve`, Live Server trong VS Code, Caddy, Nginx hoặc deploy tĩnh lên GitHub Pages / Vercel / Netlify một cách dễ dàng).*

---

## 🎨 Hệ Thống Đồ Họa Vector SVG Độ Nét Cao

Đối với các câu đố hình học, ma trận IQ, bàn cờ và lối đi mê cung, ứng dụng tích hợp **77+ đồ họa Vector SVG độ nét cao**:

- **Độ nét vô cực:** Hiển thị sắc nét trên mọi kích thước màn hình và màn hình Retina / 4K.
- **Bộ đôi Vector Đề bài & Đáp án:**
  - `cau_xxx_vector.svg`: Thể hiện đề bài với ô trống mục tiêu viền nét đứt vàng hổ phách `#f59e0b` và dấu hỏi `?`.
  - `cau_xxx_dapan_vector.svg`: Thể hiện đáp án hoàn chỉnh với phương án đúng màu xanh ngọc Emerald `#10b981`, huy hiệu checkmark và làm mờ các phương án sai.
- **Giao diện hiện đại (UI Premium):** Bảng màu Indigo Slate / Emerald / Amber sang trọng, bóng đổ đa tầng và triệt tiêu lỗi mất nét W3C SVG trên mọi trình duyệt.

---

## 📚 Kho Dữ Liệu 500 Câu Đố (10 Chuyên Đề)

Toàn bộ 500 câu đố đã được chuẩn hóa đầy đủ và phân loại thành 10 chuyên đề phương pháp luận:

| Tập | Phần | Tên Chuyên Đề Tư Duy | Thư Mục Dữ Liệu | Dải Câu Đố | Số Lượng |
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

## 🛠️ Biên Dịch Dữ Liệu Web

Dữ liệu câu đố hiển thị trên web được tổng hợp tự động từ các file Markdown trong `cau_do/` thành file `data/puzzles.json`.

Khi bạn chỉnh sửa câu đố hoặc bổ sung hình vẽ mới, chỉ cần chạy lệnh sau để cập nhật cơ sở dữ liệu web:

```bash
python scripts/build_web_data.py
```

Output mong đợi:
```
Tim thay 500 file cau do trong .../cau_do
Da xu ly thanh cong: 500/500 cau do
Da xuat thanh cong: .../data/puzzles.json
```

---

## 🗂️ Cấu Trúc Thư Mục Dự Án

```
cau-do/
├── index.html                      # Trang chủ & khung giao diện Web App
├── js/                             # Mã nguồn JavaScript ứng dụng Web (ES Modules)
│   ├── components/                 # Các UI Components độc lập
│   │   ├── Header.js               # Thanh tiêu đề, nút tìm kiếm, menu chuyên đề
│   │   ├── PuzzleCard.js           # Khung flashcard câu đố trung tâm
│   │   ├── NavigationDrawer.js     # Ngăn danh mục 10 chuyên đề bên sườn
│   │   ├── ProblemBox.js           # Hiển thị nội dung đề bài & hình ảnh
│   │   ├── AnswerSection.js        # Khối đáp án, lời giải & hiệu ứng confetti
│   │   ├── Scratchpad.js           # Bảng vẽ nháp tương tác (Canvas)
│   │   ├── ImageZoomModal.js       # Modal phóng to chi tiết hình vẽ SVG
│   │   ├── RandomFAB.js            # Nút tròn nổi chọn câu đố ngẫu nhiên
│   │   ├── DisqusThread.js         # Khung thảo luận cộng đồng Disqus
│   │   └── BottomBar.js            # Thanh điều hướng chuyển câu trước/sau
│   ├── router/                     # Quản lý URL Hash Router (#cau-001)
│   │   └── router.js
│   ├── store/                      # Quản lý State tập trung & LocalStorage
│   │   └── state.js
│   ├── utils/                      # Tiện ích DOM và trợ giúp định dạng
│   │   └── dom.js
│   ├── config.js                   # Cấu hình ứng dụng, Disqus shortname, search
│   └── main.js                     # Điểm khởi động chính của ứng dụng
├── data/
│   └── puzzles.json                # Cơ sở dữ liệu JSON cho Web App (sinh từ scripts)
├── cau_do/                         # Kho nội dung 500 câu đố và đồ họa
│   ├── images/                     # 77+ Vector SVGs và ảnh minh họa
│   ├── tap_1/                      # 232 câu đố Tập 1 (Phần 1 – 4)
│   └── tap_2/                      # 268 câu đố Tập 2 (Phần 5 – 10)
├── scripts/
│   └── build_web_data.py           # Script Python quét Markdown biên dịch ra JSON
├── .agents/
│   └── skills/
│       └── draw-puzzle-svg/        # Hướng dẫn vẽ Vector SVG chuẩn xác
│           └── SKILL.md
├── .env.example                    # Mẫu cấu hình môi trường (Disqus, Site info)
├── GEMINI.md                       # Tài liệu hướng dẫn kỹ thuật cho AI Agent
└── README.md                       # Tài liệu tổng quan dự án
```

---

## 📜 Giấy Phép & Nguồn Gốc

- Nội dung câu đố được số hóa nhằm mục đích học tập và phát triển tư duy phi thương mại.
- Mã nguồn ứng dụng web và hệ thống đồ họa vector được phát triển mở dưới giấy phép MIT.
