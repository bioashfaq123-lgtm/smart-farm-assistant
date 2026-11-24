import os
import hashlib
import csv
from pypdf import PdfReader

SOURCES_DIR = os.path.join(os.path.dirname(__file__), "..", "agricultural-sources")

def compute_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def audit():
    if not os.path.exists(SOURCES_DIR):
        print(f"Directory not found: {SOURCES_DIR}")
        return

    files = sorted([f for f in os.listdir(SOURCES_DIR) if f.lower().endswith(".pdf")])
    print(f"Total PDF files detected: {len(files)}")

    manifest = []
    seen_hashes = {}
    duplicates = []
    total_pages = 0

    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(SOURCES_DIR, filename)
        size_bytes = os.path.getsize(filepath)
        sha256_hash = compute_sha256(filepath)
        
        integrity_ok = True
        num_pages = 0
        error_msg = ""

        try:
            reader = PdfReader(filepath)
            num_pages = len(reader.pages)
            total_pages += num_pages
            # Test reading first page to verify no unhandled stream encryption or corruption
            if num_pages > 0:
                _ = reader.pages[0].extract_text()
        except Exception as e:
            integrity_ok = False
            error_msg = str(e)

        if sha256_hash in seen_hashes:
            duplicates.append({
                "duplicate_file": filename,
                "original_file": seen_hashes[sha256_hash]["filename"],
                "hash": sha256_hash,
                "pages": num_pages
            })
        else:
            seen_hashes[sha256_hash] = {"filename": filename, "pages": num_pages}

        record = {
            "index": idx,
            "filename": filename,
            "size_bytes": size_bytes,
            "size_mb": round(size_bytes / (1024 * 1024), 2),
            "pages": num_pages,
            "sha256": sha256_hash,
            "integrity_ok": integrity_ok,
            "error": error_msg
        }
        manifest.append(record)
        print(f"[{idx}/{len(files)}] {filename} | {record['size_mb']} MB | {num_pages} pages | OK: {integrity_ok}")

    # Output CSV manifest
    out_csv = os.path.join(SOURCES_DIR, "source_manifest.csv")
    fieldnames = ["index", "filename", "size_bytes", "size_mb", "pages", "sha256", "integrity_ok", "error"]
    with open(out_csv, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for r in manifest:
            writer.writerow(r)

    print("\n" + "="*60)
    print("AUDIT SUMMARY:")
    print(f"Total PDF Files: {len(files)}")
    print(f"Total Pages: {total_pages}")
    print(f"Manifest written to: {out_csv}")
    print(f"Identical Duplicates by SHA-256: {len(duplicates)}")
    for d in duplicates:
        print(f"  -> DUPLICATE: '{d['duplicate_file']}' is identical to '{d['original_file']}'")

    # Also check if any file names indicate duplicates with slight variation
    print("="*60)

if __name__ == "__main__":
    audit()
