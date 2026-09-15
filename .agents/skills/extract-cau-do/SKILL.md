---
name: extract-cau-do
description: >-
  Hướng dẫn quy trình đọc ảnh scan thủ công và trích xuất 500 câu đố logic tiếng Việt từ 2 cuốn sách PDF
  sang các file Markdown độc lập chuẩn chỉnh (kèm đề bài, metadata tóm tắt và lời giải chi tiết).
  Kích hoạt khi người dùng yêu cầu tiếp tục trích xuất câu đố, xử lý các batch tiếp theo, hoặc xử lý sách scan.
---

# Quy trình trích xuất câu đố từ sách scan (extract-cau-do)

## 1. Tổng quan dự án & Hiện trạng
- **Bộ sách:** "Các trò chơi trí tuệ dành cho thanh thiếu niên" (Tập 1 & Tập 2), gồm 500 câu đố chia thành 9 Phần.
- **Tiến độ hiện tại:** Đã hoàn thành 10 câu đầu tiên (**Câu 001 – 010**) tại `cau_do/tap_1/phan_1_phuong_phap_loai_tru/`.
- **Dữ liệu ảnh scan nguyên gốc (KHÔNG CẮT ĐÔI):**
  - Tập 1: `sheets/tap_1/sheet_000.jpeg` đến `sheet_140.jpeg` (141 file ảnh nguyên bản).
  - Tập 2: `sheets/tap_2/sheet_000.jpeg` đến `sheet_151.jpeg` (152 file ảnh nguyên bản).

---

## 2. Các nguyên tắc bắt buộc (CRITICAL CONSTRAINTS)

1. **TUYỆT ĐỐI KHÔNG DÙNG CÔNG CỤ / THƯ VIỆN OCR:**
   - Không dùng Tesseract, EasyOCR hay bất kỳ script OCR tự động nào.
   - Bản scan có nhiều chỗ mép cong, mờ nét, đốm đen, rách hoặc mất dấu tiếng Việt. Bắt buộc mô hình AI phải trực tiếp xem ảnh bằng `view_file` và sử dụng năng lực thị giác kết hợp tư duy ngữ cảnh/ngữ pháp tiếng Việt để đọc và suy đoán chính xác từng từ.
2. **GIỮ NGUYÊN TỜ SCAN, KHÔNG CẮT ĐÔI:**
   - Không được cắt đôi ảnh theo tỷ lệ 50/50 vì sẽ gây lệch dòng và cắt mất chữ ở phần gáy sách. Đọc trực tiếp trên toàn bộ tờ scan nguyên vẹn.
3. **MỖI CÂU ĐỐ LÀ 1 FILE MARKDOWN RIÊNG BIỆT:**
   - Lưu đúng cấu trúc thư mục theo tập và phần.
   - Bắt buộc có đầy đủ đề bài, metadata (bao gồm tóm tắt ngắn câu hỏi), và đáp án/lời giải ẩn trong thẻ `<details>`.

---

## 3. Công thức tra cứu trang sách và tờ scan (Mapping Guide)

Đối với cả Tập 1 và Tập 2 (bắt đầu từ sheet 5):
$$\text{Trang sách bên trái} = 14 + (\text{sheet\_index} - 5) \times 2$$
$$\text{Trang sách bên phải} = \text{Trang sách bên trái} + 1$$

### Bảng phân bố toàn bộ 9 Phần (500 câu đố)

#### Tập 1 (`Cac tro choi tri tue danh cho thanh thieu nien 1.pdf` - 141 sheets):
- **Phần 1: Phương pháp loại trừ (Câu 001 – 057)**
  - Đề bài: Trang 14 – 73 (`sheet_005` đến `sheet_034`)
  - Đáp án: Trang 74 – 113 (`sheet_034` đến `sheet_053`)
  - Thư mục: `cau_do/tap_1/phan_1_phuong_phap_loai_tru/`
- **Phần 2: Phương pháp đệ quy (Câu 058 – 118)**
  - Đề bài: Trang 114 – 142 (`sheet_054` đến `sheet_068`)
  - Đáp án: Trang 143 – 168 (`sheet_069` đến `sheet_081`)
  - Thư mục: `cau_do/tap_1/phan_2_phuong_phap_de_quy/`
- **Phần 3: Phương pháp suy diễn ngược (Câu 119 – 172)**
  - Đề bài: Trang 169 – 191 (`sheet_082` đến `sheet_093`)
  - Đáp án: Trang 192 – 211 (`sheet_094` đến `sheet_103`)
  - Thư mục: `cau_do/tap_1/phan_3_phuong_phap_suy_dien_nguoc/`
- **Phần 4: Phương pháp giả thiết (Câu 173 – 223)**
  - Đề bài: Trang 210 – 238 (`sheet_102` đến `sheet_116`)
  - Đáp án: Trang 239 – 275 (`sheet_117` đến `sheet_134`)
  - Thư mục: `cau_do/tap_1/phan_4_phuong_phap_gia_thiet/`
- Mục lục Tập 1: `sheet_135` đến `sheet_140`

#### Tập 2 (`Cac tro choi tri tue danh cho thanh thieu nien 2.pdf` - 152 sheets):
- **Phần 5: Phương pháp tính toán (Câu 233 – 285)** *(đánh số tiếp từ 233)*
  - Đề bài: Trang 14 – 33 (`sheet_005` đến `sheet_014`)
  - Đáp án: Trang 34 – 55 (`sheet_015` đến `sheet_025`)
  - Thư mục: `cau_do/tap_2/phan_5_phuong_phap_tinh_toan/`
- **Phần 6: Phương pháp phân tích (Câu 286 – 367)**
  - Đề bài: Trang 56 – 94 (`sheet_026` đến `sheet_045`)
  - Đáp án: Trang 95 – 117 (`sheet_046` đến `sheet_056`)
  - Thư mục: `cau_do/tap_2/phan_6_phuong_phap_phan_tich/`
- **Phần 7: Phương pháp vẽ hình (Câu 368 – 390)**
  - Đề bài: Trang 118 – 132 (`sheet_057` đến `sheet_064`)
  - Đáp án: Trang 133 – 151 (`sheet_065` đến `sheet_073`)
  - Thư mục: `cau_do/tap_2/phan_7_phuong_phap_ve_hinh/`
- **Phần 8: Phương pháp loại suy (Câu 391 – 430)**
  - Đề bài: Trang 152 – 166 (`sheet_074` đến `sheet_081`)
  - Đáp án: Trang 167 – 203 (`sheet_082` đến `sheet_099`)
  - Thư mục: `cau_do/tap_2/phan_8_phuong_phap_loai_suy/`
- **Phần 9: Phương pháp tổng hợp (Câu 431 – 500)**
  - Đề bài: Trang 204 – 244 (`sheet_100` đến `sheet_120`)
  - Đáp án: Trang 245 – 288 (`sheet_121` đến `sheet_142`)
  - Thư mục: `cau_do/tap_2/phan_9_phuong_phap_tong_hop/`
- Mục lục Tập 2: `sheet_145` đến `sheet_150`

---

## 4. Chuẩn định dạng file Markdown (`cau_xxx.md`)

```markdown
# Câu [Số câu: ví dụ 011]: [Tên câu đố]

- **Tập:** [1 hoặc 2]
- **Phần:** [Tên phần tương ứng]
- **Mức độ:** [Dễ / Trung bình / Khó]
- **Nguồn:** Trang [x] (Tập [1 hoặc 2])
- **Tóm tắt câu hỏi:** [1-2 câu tóm tắt nội dung cốt lõi của bài toán và câu hỏi cần giải quyết]

---

## Đề bài

[Nội dung đề bài chi tiết, trình bày rõ ràng, không viết tắt, giữ đúng các số liệu và đại từ xưng hô]

[Nếu có các giả thiết hoặc điều kiện, định dạng danh sách số hoặc gạch đầu dòng rõ ràng]

[Nếu là câu hỏi trắc nghiệm, trình bày các lựa chọn A, B, C, D trên từng dòng riêng]

*(Nếu câu đố có hình vẽ/que diêm/bàn cờ, dùng Pillow crop hình lưu vào `cau_do/images/cau_xxx.png` rồi chèn: `![minh họa](../../images/cau_xxx.png)`)*

---

<details>
<summary><b>💡 Xem đáp án & Lời giải chi tiết</b></summary>

### Đáp án & Lời giải:

[Nội dung đáp án trích xuất từ phần đáp án tương ứng của Phần đó]
[Trình bày rõ ràng từng bước phân tích và kết luận cuối cùng]

</details>
```

---

## 5. Quy trình từng bước khi tiếp tục thực hiện (Action Runbook)

Khi bắt đầu một phiên chat mới hoặc làm đợt tiếp theo:

1. **Kiểm tra tiến độ hiện tại:**
   - Dùng `list_dir` kiểm tra thư mục `cau_do/` để xem câu đố gần nhất đã làm đến đâu.
2. **Xác định phạm vi đợt tiếp theo (Batch Scope):**
   - Ví dụ: Đợt tiếp theo là Câu 011 – 025 (15 câu).
3. **Tra cứu ảnh scan:**
   - Tính toán sheet index chứa đề bài và sheet index chứa đáp án dựa trên bảng phân bố ở Mục 3.
   - Dùng `view_file` xem trực tiếp các file ảnh trong `sheets/tap_x/sheet_xxx.jpeg`.
4. **Trích xuất nội dung & Viết file:**
   - Đọc bằng AI Vision, suy đoán phục hồi các chữ ở mép gáy sách hoặc bị mờ.
   - Viết từng file `cau_xxx.md` vào đúng thư mục của Phần tương ứng.
   - Kiểm tra xem câu nào có hình vẽ minh họa thì cắt hình lưu vào `cau_do/images/`.
5. **Cập nhật báo cáo & Thông báo cho người dùng:**
   - Cập nhật tiến độ vào `walkthrough.md` và thông báo ngắn gọn cho người dùng.
