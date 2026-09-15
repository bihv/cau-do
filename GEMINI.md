# Dự án Trích xuất 500 Câu Đố Logic (Tập 1 & Tập 2)

## Hướng dẫn quan trọng cho AI Agent

Dự án này trích xuất 500 câu đố logic từ 2 cuốn sách scan "Các trò chơi trí tuệ dành cho thanh thiếu niên" thành từng file Markdown độc lập.

### Quy định bắt buộc:
1. **TUYỆT ĐỐI KHÔNG DÙNG OCR:** Không sử dụng Tesseract, EasyOCR hay bất kỳ tool OCR nào. Mọi câu chữ phải được đọc thủ công bằng AI Vision (`view_file`) trên ảnh scan để suy luận ngữ pháp và logic các vị trí mờ/mất nét/nếp gấp sách.
2. **KHÔNG CẮT ĐÔI TỜ SCAN:** Toàn bộ 293 tờ scan đã được trích xuất nguyên vẹn 100% độ phân giải tại `sheets/tap_1/` (141 sheets) và `sheets/tap_2/` (152 sheets). Đọc trực tiếp trên file scan nguyên bản để không bị mất chữ ở phần gáy sách.
3. **CẤU TRÚC FILE CÂU ĐỐ:** Mỗi câu đố là 1 file `cau_xxx.md` nằm trong thư mục của Phần tương ứng (ví dụ: `cau_do/tap_1/phan_1_phuong_phap_loai_tru/cau_001.md`).
4. **ĐỊNH DẠNG FILE:** Bắt buộc có:
   - Metadata: Tập, Phần, Mức độ, Nguồn trang, và **Tóm tắt câu hỏi** (1-2 câu).
   - Đề bài hoàn chỉnh.
   - Đáp án & Lời giải chi tiết được ẩn trong thẻ thu gọn `<details><summary>💡 Xem đáp án & Lời giải chi tiết</summary>...</details>`.

### Kích hoạt Skill:
Mọi thông tin chi tiết về bảng ánh xạ trang sách, số tờ scan, cấu trúc 9 phần và mẫu định dạng markdown đã được ghi đầy đủ trong Skill:
`[.agents/skills/extract-cau-do/SKILL.md](file:///E:/project/cau%20do/.agents/skills/extract-cau-do/SKILL.md)`

### Tiến độ hiện tại:
- **ĐÃ HOÀN THÀNH 100% TOÀN BỘ DỰ ÁN (500/500 câu đố)** trên cả Tập 1 và Tập 2.
- **Tập 1 (Câu 001 - 232):** 232 câu (Phần 1 - 4).
- **Tập 2 (Câu 233 - 500):** 268 câu (Phần 5 - 10).
- Tất cả các file Markdown đều chuẩn chỉnh metadata, tóm tắt đề, đề bài và lời giải chi tiết trong thẻ `<details>`.

