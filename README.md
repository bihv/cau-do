# Tuyển Tập 500 Câu Đố Trí Tuệ & Logic

Dự án tổng hợp và số hóa **500 câu đố logic, toán học và tư duy trí tuệ** từ bộ sách *"Các trò chơi trí tuệ dành cho thanh thiếu niên"* (Tập 1 & Tập 2).

Tất cả câu đố được trích xuất thành từng file Markdown độc lập, chuẩn hóa định dạng, bao gồm:
- **Metadata**: Tập, Phần, Mức độ khó, Trang sách gốc, Tóm tắt câu hỏi.
- **Nội dung câu hỏi**: Đề bài đầy đủ, văn phong trong sáng, kèm ảnh minh họa gốc nét cao cho các bài hình học/cắt ghép.
- **Đáp án & Lời giải chi tiết**: Được ẩn trong khối thẻ `<details><summary>💡 Xem đáp án & Lời giải chi tiết</summary></details>` để người đọc tự suy nghĩ trước khi xem giải.

---

## 📚 Cấu Trúc Dữ Liệu

Toàn bộ 500 câu đố được phân loại theo các phương pháp tư duy logic cụ thể:

### 📖 Tập 1 (Câu 001 – Câu 232)
- **Phần 1: Phương pháp Loại trừ** (Câu 001 – Câu 057)
- **Phần 2: Phương pháp Đệ quy** (Câu 058 – Câu 118)
- **Phần 3: Phương pháp Suy diễn ngược** (Câu 119 – Câu 175)
- **Phần 4: Phương pháp Lập bảng** (Câu 176 – Câu 232)

### 📖 Tập 2 (Câu 233 – Câu 500)
- **Phần 5: Phương pháp Tính toán** (Câu 233 – Câu 280)
- **Phần 6: Phương pháp Phân tích** (Câu 281 – Câu 367)
- **Phần 7: Phương pháp Vẽ hình** (Câu 368 – Câu 418)
- **Phần 8: Phương pháp Loại suy** (Câu 419 – Câu 446)
- **Phần 9: Phương pháp Giả thiết** (Câu 447 – Câu 478)
- **Phần 10: Các trò chơi logic khác** (Câu 479 – Câu 500)

### 🖼️ Thư mục Hình Ảnh
- `cau_do/images/`: Chứa toàn bộ 242 ảnh sơ đồ, lưới ô vuông, hình học minh họa cho đề bài và đáp án.

---

## 🎯 Định Dạng File Câu Đố

Mỗi file `cau_xxx.md` tuân thủ mẫu chuẩn:

```markdown
# Câu Đố xxx: [Tên Câu Đố]

**Tập**: Tập x | **Phần**: Phần y - [Tên phương pháp] | **Mức độ**: Trung bình | **Nguồn**: Trang xx
**Tóm tắt**: [Tóm tắt ngắn gọn 1-2 câu nội dung đề bài]

---

### Đề bài
[Nội dung câu đố chi tiết kèm hình vẽ nếu có]

---

<details>
<summary>💡 Xem đáp án & Lời giải chi tiết</summary>

### Đáp án & Lời giải
[Lời giải chi tiết từng bước, phân tích logic và kết luận]

</details>
```

---

## 🛠️ Công Cụ Hỗ Trợ
Thư mục `scripts/` chứa các script Python tự động hóa trích xuất và xử lý hình ảnh scan từ tài liệu gốc.
