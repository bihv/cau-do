import pymupdf
from PIL import Image
import io
import os
import time

def process_pdf(pdf_path, out_dir):
    print(f"=== Processing {pdf_path} ===")
    os.makedirs(out_dir, exist_ok=True)
    doc = pymupdf.open(pdf_path)
    total_sheets = len(doc)
    print(f"Total sheets: {total_sheets}")
    
    t0 = time.time()
    for s in range(total_sheets):
        page = doc[s]
        il = page.get_images()
        if not il:
            print(f"Warning: Sheet {s} has no images!")
            continue
        largest = max(il, key=lambda it: doc.extract_image(it[0])['width'] * doc.extract_image(it[0])['height'])
        bimg = doc.extract_image(largest[0])
        im = Image.open(io.BytesIO(bimg['image']))
        
        # Rotate if vertical scan of horizontal spread
        if im.height > im.width:
            im = im.rotate(90, expand=True)
            
        w, h = im.size
        left = im.crop((0, 0, w // 2, h))
        right = im.crop((w // 2, 0, w, h))
        
        if s >= 5:
            p_left = 14 + (s - 5) * 2
            p_right = p_left + 1
            left_path = os.path.join(out_dir, f"page_{p_left:03d}.png")
            right_path = os.path.join(out_dir, f"page_{p_right:03d}.png")
        else:
            left_path = os.path.join(out_dir, f"front_s{s:02d}_L.png")
            right_path = os.path.join(out_dir, f"front_s{s:02d}_R.png")
            
        left.save(left_path)
        right.save(right_path)
        
        if (s + 1) % 20 == 0 or s == total_sheets - 1:
            print(f"  Processed {s + 1}/{total_sheets} sheets ({time.time() - t0:.1f}s)")

if __name__ == '__main__':
    process_pdf("Cac tro choi tri tue danh cho thanh thieu nien 1.pdf", "pages/tap_1")
    process_pdf("Cac tro choi tri tue danh cho thanh thieu nien 2.pdf", "pages/tap_2")
    print("ALL DONE!")
