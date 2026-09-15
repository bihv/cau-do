import fitz
from PIL import Image
import io
import os

def sample_check(pdf_path, name, indices):
    doc = fitz.open(pdf_path)
    os.makedirs('test_inspect', exist_ok=True)
    for s in indices:
        page = doc[s]
        il = page.get_images()
        largest = max(il, key=lambda it: doc.extract_image(it[0])['width'] * doc.extract_image(it[0])['height'])
        bimg = doc.extract_image(largest[0])
        im = Image.open(io.BytesIO(bimg['image']))
        rotated = False
        if im.height > im.width:
            im = im.rotate(90, expand=True)
            rotated = True
        thumb = im.copy()
        thumb.thumbnail((800, 600))
        thumb.save(f'test_inspect/{name}_s{s}_thumb.jpg', quality=85)
        print(f"{name} s{s}: orig {bimg['width']}x{bimg['height']}, rotated={rotated}")

if __name__ == '__main__':
    sample_check('Cac tro choi tri tue danh cho thanh thieu nien 1.pdf', 't1', [10, 36, 50, 80, 120])
    sample_check('Cac tro choi tri tue danh cho thanh thieu nien 2.pdf', 't2', [10, 36, 50, 80, 120])
