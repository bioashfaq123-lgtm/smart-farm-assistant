import os
from pypdf import PdfReader

SOURCES_DIR = os.path.join(os.path.dirname(__file__), "..", "agricultural-sources")

test_files = [
    "Vyavasaayam-Diksoochi-2019-2020.pdf",
    "vyavasayam-April-2023.pdf",
    "vyavasayam-june-2023-1.pdf",
    "vyavasayam-july-2023.pdf",
    "Vyavasayam, April 2026.pdf"
]

def check_unicode_telugu(text):
    # Telugu Unicode block is U+0C00 to U+0C7F
    telugu_chars = [c for c in text if '\u0c00' <= c <= '\u0c7f']
    return len(telugu_chars)

for fname in test_files:
    fpath = os.path.join(SOURCES_DIR, fname)
    if not os.path.exists(fpath):
        continue
    reader = PdfReader(fpath)
    print(f"\n==================== {fname} (Pages: {len(reader.pages)}) ====================")
    for p_num in [0, 1, 2]:
        if p_num < len(reader.pages):
            text = reader.pages[p_num].extract_text() or ""
            tel_count = check_unicode_telugu(text)
            sample = text[:300].replace('\n', ' ')
            print(f"Page {p_num+1}: len={len(text)}, Telugu Unicode chars={tel_count}")
            print(f"  Sample: {sample}")
