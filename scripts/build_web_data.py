import os
import glob
import re
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
CAU_DO_DIR = ROOT_DIR / "cau_do"
OUTPUT_DIR = ROOT_DIR / "data"
OUTPUT_FILE = OUTPUT_DIR / "puzzles.json"

PHAN_ORDER = [
    "Phương pháp loại trừ",
    "Phương pháp đệ quy",
    "Phương pháp suy diễn ngược",
    "Phương pháp giả thiết",
    "Phương pháp tính toán",
    "Phương pháp phân tích",
    "Phương pháp vẽ hình",
    "Phương pháp loại suy",
    "Phương pháp tổng hợp",
    "Thử làm Sherlock Holmes"
]

def clean_text(text):
    if not text:
        return ""
    return text.strip()

def normalize_image_paths(content):
    """
    Chuẩn hóa các đường dẫn hình ảnh trong Markdown về 'cau_do/images/...'
    Ví dụ:
    ![Sơ đồ](../../images/cau_364_vector.svg) -> ![Sơ đồ](cau_do/images/cau_364_vector.svg)
    ![Sơ đồ](../images/cau_015.png) -> ![Sơ đồ](cau_do/images/cau_015.png)
    """
    def replace_img(match):
        alt = match.group(1)
        path = match.group(2)
        filename = Path(path).name
        return f"![{alt}](cau_do/images/{filename})"

    return re.sub(r'!\[(.*?)\]\((.*?)\)', replace_img, content)

def parse_markdown_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        raw_content = f.read()

    # Chuẩn hóa đường dẫn hình ảnh ngay từ đầu
    content = normalize_image_paths(raw_content)

    # 1. Trích xuất ID và Tiêu đề
    m_title = re.search(r'^#\s+(?:Câu(?:\s+đố)?\s+(\d+))[:\s]*(.*)', content, re.MULTILINE)
    if not m_title:
        raise ValueError(f"Không tìm thấy tiêu đề hợp lệ trong file: {filepath}")

    puzzle_id = int(m_title.group(1))
    title = clean_text(m_title.group(2))
    slug = f"cau-{puzzle_id:03d}"

    # 2. Trích xuất Metadata
    # Tập
    m_tap = re.search(r'\*\*Tập:?\*\*:?\s*(\d+)', content)
    if m_tap:
        tap = int(m_tap.group(1))
    else:
        tap = 1 if "tap_1" in str(filepath) else 2

    # Phần
    m_phan = re.search(r'\*\*Phần:?\*\*:?\s*(.+)', content)
    phan_raw = clean_text(m_phan.group(1)) if m_phan else ""
    # Chuẩn hóa tên phần để hiển thị đẹp
    phan_name = phan_raw
    for p in PHAN_ORDER:
        if p.lower() in phan_raw.lower():
            phan_name = p
            break
    if not phan_name:
        phan_name = phan_raw

    # Mức độ
    m_muc_do = re.search(r'\*\*Mức độ:?\*\*:?\s*(.+)', content)
    muc_do = clean_text(m_muc_do.group(1)) if m_muc_do else "Trung bình"

    # Nguồn
    m_nguon = re.search(r'\*\*Nguồn:?\*\*:?\s*(.+)', content)
    nguon = clean_text(m_nguon.group(1)) if m_nguon else ""

    # Tóm tắt
    m_tom_tat = re.search(r'\*\*Tóm tắt(?:\s+câu\s+hỏi)?:?\*\*:?\s*(.+)', content)
    tom_tat = clean_text(m_tom_tat.group(1)) if m_tom_tat else ""

    # 3. Phân tách Đề bài và Đáp án
    # Đáp án nằm trong <details> ... </details>
    m_details = re.search(r'<details>\s*<summary>.*?</summary>(.*?)</details>', content, re.DOTALL)
    if m_details:
        dap_an_raw = m_details.group(1)
        # Bỏ thẻ details khỏi nội dung để lấy đề bài
        de_bai_raw = content[:m_details.start()]
    else:
        # Dự phòng nếu không có thẻ details
        parts = re.split(r'##\s*Đáp án', content, flags=re.IGNORECASE)
        de_bai_raw = parts[0]
        dap_an_raw = parts[1] if len(parts) > 1 else ""

    # Dọn dẹp Đề bài: bỏ phần Header tiêu đề và metadata ban đầu
    m_de_bai = re.search(r'##\s*Đề bài\s*\n+(.*)', de_bai_raw, re.DOTALL)
    if m_de_bai:
        de_bai = clean_text(m_de_bai.group(1))
        de_bai = re.sub(r'\n+---\s*$', '', de_bai).strip()
    else:
        after_sep = re.split(r'\n+---\s*\n+', de_bai_raw)
        if len(after_sep) > 1:
            de_bai = clean_text(after_sep[1])
        else:
            de_bai = clean_text(de_bai_raw)

    # Dọn dẹp Đáp án
    dap_an = clean_text(dap_an_raw)
    dap_an = re.sub(r'^###\s*Đáp án.*?\n+', '', dap_an, flags=re.IGNORECASE).strip()

    # Tìm các hình ảnh liên quan
    images_de_bai = re.findall(r'!\[.*?\]\((cau_do/images/[^)]+)\)', de_bai)
    images_dap_an = re.findall(r'!\[.*?\]\((cau_do/images/[^)]+)\)', dap_an)
    all_images = list(dict.fromkeys(images_de_bai + images_dap_an))

    return {
        "id": puzzle_id,
        "slug": slug,
        "title": title,
        "tap": tap,
        "phan": phan_name,
        "phan_raw": phan_raw,
        "muc_do": muc_do,
        "nguon": nguon,
        "tom_tat": tom_tat,
        "de_bai": de_bai,
        "dap_an": dap_an,
        "has_image": len(all_images) > 0,
        "images": all_images,
        "images_de_bai": images_de_bai,
        "images_dap_an": images_dap_an
    }

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    files = sorted(glob.glob(str(CAU_DO_DIR / "**" / "*.md"), recursive=True))
    print(f"Tim thay {len(files)} file cau do trong {CAU_DO_DIR}")
    
    puzzles = []
    errors = []

    for f in files:
        try:
            p = parse_markdown_file(f)
            puzzles.append(p)
        except Exception as e:
            errors.append((f, str(e)))

    puzzles.sort(key=lambda x: x["id"])

    print(f"Da xu ly thanh cong: {len(puzzles)}/500 cau do")
    if errors:
        print(f"Co {len(errors)} loi:")
        for err_file, err_msg in errors:
            print(f"   - {err_file}: {err_msg}")
        return

    # Lưu file JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(puzzles, f, ensure_ascii=False, indent=2)

    print(f"Da xuat thanh cong: {OUTPUT_FILE} (Dung luong: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
