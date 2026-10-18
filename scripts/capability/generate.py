"""Generate the capability statement web page from the PDF.

Usage (from the project root):
    pip install pymupdf pillow
    python scripts/capability/generate.py ["path/to/Capability Statement.pdf"]
    npm run build && npm run preview          # in another terminal
    node scripts/capability/calibrate.mjs     # fine-tunes line widths, then build again

Outputs:
  src/assets/capability/cover.jpg, page-2.jpg … page-8.jpg   page artwork with the text removed
  src/assets/capability/artwork-strip.jpg
  src/data/capability-statement.json  text layout (positions, sizes, weights) + semantic grouping
"""
import io, json, os, re
import pymupdf
from PIL import Image, ImageDraw

import sys

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJECT, "NWCR Capability Statement 2026.pdf")
ASSETS = os.path.join(PROJECT, "src", "assets", "capability")
os.makedirs(ASSETS, exist_ok=True)

PEOPLE_PHOTOS = {(1277, 790), (161, 157), (169, 159)}  # page 2 photos of people (by pixel size) -> placeholder

# Cover artwork file name (changed when the logo was removed, so no cached copy of the old cover is reused)
COVER_FILE = "cover.jpg"
# Headings kept for screen readers and search engines but not shown: (page index, tag)
HIDDEN_HEADINGS = {(0, "h1")}

# Cover: area holding the white card with the logo (vector shapes fully inside it are removed)
COVER_LOGO_CARD = pymupdf.Rect(-70, 200, 240, 420)

FIXES = [  # (pattern, replacement) — glyph repairs first, then minimal wording fixes (see CONTENT_TODO)
    ("Melanie\ufffds", "Melanie’s"), ("clients\ufffd", "clients’"), ("site\ufffds", "site’s"),
    ("EWP\ufffds", "EWP’s"), ("Construction \ufffd rail", "Construction – rail"),
    ("3 \ufffd 12 m", "3 × 12 m"), ("600m\ufffd", "600m²"), ("40\ufffdC", "40°C"),
    ("REMEDIATION \ufffd 100%", "REMEDIATION – 100%"), ("handrails \ufffd Erecting", "handrails – Erecting"),
    (" \ufffd Fast-track", " – Fast-track"), (" \ufffd Whether", " – Whether"),
    ("(nee Lockyer \ufffd", "(née Lockyer-"),
    ("electrical license", "electrical licence"), ("SAIPAM", "SAIPEM"), ("was lead by", "was led by"),
    ("derivable MDR", "deliverable MDR"), ("Endeavor", "Endeavour"),
    ("Utilizing our specialized", "Utilising our specialised"), ("600M2", "600M²"),
]
TOKENS = {  # contact details come from src/config/site.ts at build time
    "0438 039 433": "phone", "admin@nwcr.com.au": "email", "www.nwcr.com.au": "website",
    "ABN: 63 161 195 777": "abn", "PORT HEDLAND | KARRATHA | PERTH": "locations",
}
ISO_LABELS = {"ISO 9001": "Quality", "ISO 14001": "Environmental", "ISO 45001": "Health & Safety"}


def weight(font):
    f = font.lower()
    if "extrabold" in f: return 800
    if "semibold" in f: return 600
    if "bold" in f: return 700
    if "medium" in f: return 500
    return 400


def fix(t):
    for a, b in FIXES:
        t = t.replace(a, b)
    return t


def placeholder(w, h):
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        k = y / h
        d.line([(0, y), (w, y)], fill=(int(24 + (11 - 24) * k), int(69 + (30 - 69) * k), int(148 + (63 - 148) * k)))
    s = min(w, h) // 7
    cx, cy = w // 2, h // 2
    lw = max(3, s // 12)
    d.rounded_rectangle([cx - s, cy - s * 0.7, cx + s, cy + s * 0.7], radius=s // 5, outline="white", width=lw)
    d.ellipse([cx - s * 0.35, cy - s * 0.35, cx + s * 0.35, cy + s * 0.35], outline="white", width=lw)
    return im


src = pymupdf.open(PDF)
pages_out = []

for pi in range(len(src)):
    doc = pymupdf.open()
    doc.insert_pdf(src, from_page=pi, to_page=pi)
    page = doc[0]
    W, H = page.rect.width, page.rect.height

    # --- people photos -> placeholder JPEG (same size; the PDF's blob clip / soft mask still applies) ---
    if pi == 1:
        replaced = 0
        for img in page.get_images(full=True):
            xref = img[0]
            info = doc.extract_image(xref)
            if (info["width"], info["height"]) in PEOPLE_PHOTOS:
                replaced += 1
                buf = io.BytesIO()
                placeholder(info["width"], info["height"]).save(buf, "JPEG", quality=90)
                doc.update_stream(xref, buf.getvalue(), compress=False)
                doc.xref_set_key(xref, "Filter", "/DCTDecode")
                doc.xref_set_key(xref, "ColorSpace", "/DeviceRGB")
                doc.xref_set_key(xref, "DecodeParms", "null")
        assert replaced == 3, replaced

    # --- cover: remove the white card with the NWCR logo (top left), keeping the background ---
    if pi == 0:
        page.add_redact_annot(COVER_LOGO_CARD, fill=False)
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE,
                              graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
                              text=pymupdf.PDF_REDACT_TEXT_NONE)

    # --- page 8: drop the soft drop-shadow layers behind the headline (recreated with CSS text-shadow) ---
    if pi == 7:
        cx = page.get_contents()[0]
        stream = doc.xref_stream(cx)
        for name in (b"/Fm3 Do", b"/Fm4 Do"):
            assert name in stream, name
            stream = stream.replace(name, b"")
        doc.update_stream(cx, stream)

    # --- collect text lines ---
    lines = []
    for b in page.get_text("rawdict")["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                s["text"] = "".join(ch["c"] for ch in s["chars"])
            spans, bullet = [], False
            for s in l["spans"]:
                if s["font"].startswith("Wingdings"):
                    bullet = True
                    continue
                t = s["text"].replace("\t", "").replace("\n", "")
                if not t.strip():
                    continue
                spans.append(s)
                # redact this span's text only (leave Wingdings bullets in the artwork)
                r = pymupdf.Rect(s["bbox"])
                page.add_redact_annot(pymupdf.Rect(r.x0 + 0.4, r.y0, r.x1, r.y1), fill=False)
            if not spans:
                continue
            first = spans[0]
            # exact start/end of the visible glyphs (skips leading tabs/spaces and trailing spaces)
            glyphs = [ch for sx in spans for ch in sx["chars"] if ch["c"].strip()]
            x = glyphs[0]["origin"][0]
            sp = []
            for i, s in enumerate(spans):
                t = s["text"].replace("\t", "").replace("\n", "")
                if i == 0: t = t.lstrip()
                if i == len(spans) - 1: t = t.rstrip()
                if t:
                    sp.append({"t": fix(t), "w": weight(s["font"]), "i": "itali" in s["font"].lower(),
                               "font": s["font"]})
            size = first["size"]
            x1 = glyphs[-1]["bbox"][2]
            lines.append({
                "x": x, "y": first["origin"][1], "x1": x1,
                "size": size, "color": f"#{first['color']:06x}", "spans": sp, "bullet": bullet,
                "font": first["font"],
            })
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                          text=pymupdf.PDF_REDACT_TEXT_REMOVE)

    # --- render artwork without text ---
    # spreads and the cover (also used as the home page hero) at 2400 px wide; the back page at 1600 px
    target = 2400 if (W > 700 or pi == 0) else 1600
    pix = page.get_pixmap(matrix=pymupdf.Matrix(target / W, target / W))
    Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB").save(
        os.path.join(ASSETS, COVER_FILE if pi == 0 else f"page-{pi + 1}.jpg"), quality=88, optimize=True)

    # --- classify + order lines ---
    spread = W > 700
    for ln in lines:
        txt = "".join(s["t"] for s in ln["spans"])
        ln["text"] = txt
        f = ln["font"]
        if f.startswith("Helvetica"):
            k = "iso"
        elif ln["size"] >= 40:
            k = "title"
        elif ln["size"] >= 30:
            k = "bigheading"
        elif ln["size"] >= 19 and ln["color"] == "#005fa4":
            k = "heading"
        elif all(s["w"] == 800 for s in ln["spans"]) and ln["size"] <= 10.5:
            k = "label"
        elif ln["bullet"] or (pi == 4 and ln["spans"][0]["w"] == 700 and ln["size"] == 12 and abs(ln["x"] - 40) < 6):
            k = "bullet"
        else:
            k = "text"
        ln["kind"] = k
        ln["col"] = 1 if spread and ln["x"] >= W / 2 else 0
    lines.sort(key=lambda l: (l["col"], round(l["y"], 1), l["x"]))

    units = []
    for ln in lines:
        k, last = ln["kind"], (units[-1] if units else None)
        near = lambda f: last and ln["col"] == last["col"] and 0 < ln["y"] - last["lastY"] <= ln["size"] * f
        if k in ("title", "bigheading", "heading"):
            if last and last["type"] == k and near(2.2 if k != "heading" else 1.4):
                last["lines"].append(ln)
            else:
                units.append({"type": k, "lines": [ln], "col": ln["col"]})
        elif k == "bullet":
            item = [ln]
            if last and last["type"] == "ul" and near(2.6):
                last["items"].append(item)
            else:
                units.append({"type": "ul", "items": [item], "col": ln["col"]})
        elif k == "text" and last and last["type"] == "ul" and near(1.6) and ln["x"] > last["items"][-1][0]["x"] - 1:
            last["items"][-1].append(ln)  # wrapped line of a bullet item
        elif k == "text" and last and last["type"] == "p" and near(1.6) and abs(ln["x"] - last["lines"][0]["x"]) < 2 \
                and ln["size"] == last["lines"][0]["size"]:
            last["lines"].append(ln)
        elif k == "iso":
            if last and last["type"] == "iso":
                last["lines"].append(ln)
            else:
                units.append({"type": "iso", "lines": [ln], "col": ln["col"]})
        else:
            units.append({"type": "p" if k == "text" else k, "lines": [ln], "col": ln["col"]})
        u = units[-1]
        u["lastY"] = ln["y"]

    # --- emit JSON-friendly structure ---
    def L(ln, nxt=None, center=False):
        t = ln["text"]
        token = TOKENS.get(t.strip())
        out = {
            "x": round(ln["x"] / W * 100, 3), "y": round(ln["y"] / W * 100, 3), "fs": round(ln["size"] / W * 100, 3),
            "pw": round((ln["x1"] - ln["x"]) / W * 100, 3),
            "c": ln["color"], "s": [{k: v for k, v in s.items() if k in ("t", "w", "i") and (k != "i" or v)} for s in ln["spans"]],
        }
        if center:
            out["cx"] = round(((ln["x"] + ln["x1"]) / 2) / W * 100, 3)
        if token:
            out["token"] = token
        out["sep"] = "" if re.search(r"[A-Za-z]-$", t) else " "
        return out

    center = pi == 7
    emitted = []
    for i, u in enumerate(units):
        t = u["type"]
        if t == "ul":
            emitted.append({"tag": "ul", "items": [[L(l, center=center) for l in it] for it in u["items"]]})
            continue
        if t == "iso":
            # labels under the Certified System marks — corrected (the flyer says "Quality" for all three)
            items = []
            byx = {}
            for l in u["lines"]:
                byx.setdefault(round(l["x"]), []).append(l)
            for x, ls in sorted(byx.items()):
                code = next(l["text"] for l in ls if l["text"].startswith("ISO"))
                top = min(l["y"] for l in ls)
                items.append({"x": round(x / W * 100, 3), "y": round(top / W * 100, 3),
                              "fs": round(ls[0]["size"] / W * 100, 3), "label": ISO_LABELS[code], "code": code})
            emitted.append({"tag": "iso", "items": items})
            continue
        if t == "title":
            tag = "h1" if pi == 0 else "h2"
        elif t == "bigheading":
            tag = "h2"
        elif t == "heading":
            tag = "h3"
        elif t == "label":
            nxt = units[i + 1]["type"] if i + 1 < len(units) else None
            tag = "h4" if nxt == "ul" else "p"
        else:
            tag = "p"
        cls = {"title": "title", "bigheading": "big", "heading": "heading", "label": "label"}.get(t, "body")
        if tag == "p" and u["lines"][0]["size"] >= 13 and pi in (0, 7):
            cls = "lead"
        unit = {"tag": tag, "cls": cls, "lines": [L(l, center=center) for l in u["lines"]]}
        if (pi, tag) in HIDDEN_HEADINGS:
            unit["hidden"] = True
        emitted.append(unit)

    pages_out.append({"n": pi + 1, "w": round(W, 2), "h": round(H, 2), "spread": spread,
                      "minFs": min(l["size"] for l in lines if l["kind"] != "iso"), "units": emitted})

# leftover replacement characters would mean a glyph we did not map
dump = json.dumps(pages_out, ensure_ascii=False)
assert "\ufffd" not in dump, [m.start() for m in re.finditer("\ufffd", dump)]
os.makedirs(os.path.join(PROJECT, "src", "data"), exist_ok=True)
with open(os.path.join(PROJECT, "src", "data", "capability-statement.json"), "w", encoding="utf-8") as f:
    json.dump(pages_out, f, ensure_ascii=False, indent=1)

# artwork strip (bottom of the cover background — artwork + sunset only)
cover_bg = src.extract_image(737)
im = Image.open(io.BytesIO(cover_bg["image"])).convert("RGB")
strip = im.crop((0, int(im.height * 0.86), im.width, im.height))
strip.save(os.path.join(ASSETS, "artwork-strip.jpg"), quality=85, optimize=True)

for p in pages_out:
    print(p["n"], "spread" if p["spread"] else "portrait", "minFs", p["minFs"], [u["tag"] for u in p["units"]])
