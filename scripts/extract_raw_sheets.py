import pymupdf
from PIL import Image
import io
import os
import time

def extract_intact_sheets(pdf_path, out_dir):
    print(f"=== Extracting intact sheets from {pdf_path} to {out_dir} ===")
    os.makedirs(out_dir, exist_ok=True)
    doc = pymupdf.open(pdf_path)
    total = len(doc)
    t0 = time.time()
    
    for s in range(total):
        page = doc[s]
        il = page.get_images()
        if not il:
            # If no embedded image, render page directly
            pix = page.get_pixmap(dpi=200)
            pix.save(os.path.join(out_dir, f"sheet_{s:03d}.png"))
            continue
            
        largest = max(il, key=lambda it: doc.extract_image(it[0])['width'] * doc.extract_image(it[0])['height'])
        bimg = doc.extract_image(largest[0])
        ext = bimg.get("ext", "png")
        
        # Save exact raw image stream without any alteration or re-compression
        out_path = os.path.join(out_dir, f"sheet_{s:03d}.{ext}")
        with open(out_path, "wb") as f:
            f.write(bimg["image"])
            
        if (s + 1) % 30 == 0 or s == total - 1:
            print(f"  Extracted {s + 1}/{total} sheets ({time.time() - t0:.1f}s)")

if __name__ == '__main__':
    extract_intact_sheets("Cac tro choi tri tue danh cho thanh thieu nien 1.pdf", "sheets/tap_1")
    extract_intact_sheets("Cac tro choi tri tue danh cho thanh thieu nien 2.pdf", "sheets/tap_2")
    print("ALL SHEETS EXTRACTED RAW AND INTACT!")
