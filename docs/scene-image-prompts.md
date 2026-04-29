# Scene Image Prompts (Ideogram)

Prompts for the Practice Test Speaking scenes. The Practice Test currently uses emoji placeholders:

- `speaking-lr.html` line ~103: `<div class="image-placeholder" id="imagePlaceholder">&#x1F3EB;</div>` (school building)
- `speaking-ti.html` line ~94-97: `<div class="interviewer-frame">` containing a `.placeholder` div for Dr. Rivera

Reference: `toefl-task-training/speaking/lr/practice-1.html` already wires up a `<img id="scenarioImage">` with alt text "A campus library tour guide welcomes visitors in a book-lined reading room." The aesthetic to match across the app is **warm cream + green + gold**, Manrope/Zen Kaku display, editorial / tasteful / not stocky.

---

## 1. LR practice-1 — Campus Library Tour Guide Training

**One main scene** is sufficient. The audio plays scenario narration; the image holds steady throughout.

### Primary prompt (recommended)

> Editorial photographic illustration of a friendly young university tour guide, warm smile, smart-casual clothes with a small lanyard ID, gesturing welcomingly toward a sunlit, book-lined campus library reading room behind her; tall arched windows letting in afternoon light, oak study tables, students reading in soft focus in the background; warm cream and forest-green color palette with gold accents matching a refined academic brand; calm, inviting, professional atmosphere; shallow depth of field, soft natural lighting, fine grain, no text or logos; aspect ratio 4:3.

### Alt 1 — Wider establishing shot

> Wide editorial shot of a campus library reading room interior, warm cream walls, dark green leather chairs, golden brass reading lamps on long oak tables, tall windows with sheer curtains, rows of leather-bound books along the back wall; in the mid-ground a tour guide stands holding a clipboard, mid-explanation, half-turned toward the camera; small group of students out of focus listening; afternoon light, photographic, gentle film grain, no text or signage; aspect ratio 16:9.

### Alt 2 — Closer, character-forward

> Close, photographic portrait of a confident multicultural university tour guide standing in front of a softly blurred library backdrop, holding a campus map; warm cream and forest-green color grading with gold highlights; natural window light from camera-left; serene, welcoming, unposed expression; editorial magazine quality, shallow depth of field, no text; aspect ratio 4:3.

### Alt 3 — Minimal illustrated style

> Minimal flat-illustrated scene of a campus library tour, single tour guide figure mid-step gesturing toward a wall of books, two visitor silhouettes following; cream background, forest-green and gold accents, restrained linework, generous negative space, contemporary editorial illustration style; no text, no logos; aspect ratio 4:3.

---

## 2. TI practice-1 — Dr. Rivera, Take an Interview

The frame is square-ish (260×260 in the page CSS), so a **square (1:1)** crop is the safest deliverable. One main portrait covers all four interview questions; per-question variants are optional polish.

### Primary prompt (recommended) — Dr. Rivera portrait

> Editorial photographic portrait of "Dr. Rivera," a warm and approachable university professor in her early 50s, neat shoulder-length hair, subtle jewelry, wearing a smart blazer over a cream blouse; seated in a sunlit academic office or quiet study hall with bookshelves softly blurred behind her; warm natural window light from the left, calm and attentive expression as if mid-interview; cream, forest-green, and gold color palette to match a refined education brand; high-end magazine quality, shallow depth of field, no text or logos, no nameplate; aspect ratio 1:1.

### Alt 1 — Slightly wider, environmental

> Environmental editorial portrait of Dr. Rivera, university professor, seated at a polished oak desk with a stack of papers, a steaming ceramic mug, and a leather notebook; tall window behind diffusing afternoon light; bookshelves and a small framed botanical print in the soft-focus background; cream walls, forest-green accents; warm, intelligent, welcoming expression; aspect ratio 1:1, photographic, fine grain, no text.

### Alt 2 — Study hall setting

> Photographic portrait of Dr. Rivera, professor in a tweed blazer, seated in an empty wood-paneled study hall with long communal tables and brass reading lamps in the background; warm afternoon light, cream and forest-green palette with gold highlights; calm, attentive, slightly leaning forward as if listening; editorial magazine style, shallow depth of field, no text; aspect ratio 1:1.

### Optional per-question variants

If the user wants subtle variation per interview question, generate the same character in slightly different poses:

- **Q1 (warm-up):** Dr. Rivera smiling, hands folded on the table, welcoming opening expression.
- **Q2 (probing):** Dr. Rivera leaning slightly forward, pen in hand over notebook, attentive listening.
- **Q3 (reflective):** Dr. Rivera with chin lightly resting on knuckles, thoughtful, mid-nod.
- **Q4 (closing):** Dr. Rivera relaxed, slight smile, hands open in a "thank you" gesture.

Reuse the Primary prompt and append the pose phrase. Maintain identical wardrobe, lighting, and palette across all four for visual continuity.

---

## Where the generated images go

Drop the chosen renders here (create the directory if it doesn't exist):

- `C:\Users\umuyashikin\toefl-practice\images\speaking-lr-1.webp`  (or `.png` / `.jpg`)
- `C:\Users\umuyashikin\toefl-practice\images\speaking-ti-1.webp`

Optional per-question TI variants:
- `images/speaking-ti-1-q1.webp` … `images/speaking-ti-1-q4.webp`

### Wiring them into the HTML

**`speaking-lr.html`** — replace the emoji placeholder (around line 103):

```html
<!-- before -->
<div class="image-placeholder" id="imagePlaceholder">&#x1F3EB;</div>

<!-- after -->
<div class="image-placeholder" id="imagePlaceholder" style="padding:0;overflow:hidden">
  <img src="images/speaking-lr-1.webp"
       alt="A campus library tour guide welcomes visitors in a book-lined reading room."
       style="width:100%;height:100%;object-fit:cover;display:block">
</div>
```

**`speaking-ti.html`** — replace the placeholder div inside `.interviewer-frame` (around line 94-96):

```html
<!-- before -->
<div class="interviewer-frame">
  <div class="placeholder">&#x1F464;</div>
</div>

<!-- after -->
<div class="interviewer-frame">
  <img src="images/speaking-ti-1.webp"
       alt="Dr. Rivera, the interviewer, seated in a sunlit academic office."
       style="width:100%;height:100%;object-fit:cover;display:block">
</div>
```

The existing `.interviewer-frame` CSS (260×260, rounded, bordered) already crops the image correctly — no further style changes needed. If using per-question variants, bind the `<img>` `src` to the current question index in JS instead of hard-coding the path.

### File-format guidance

- Prefer `.webp` for ~30-50% smaller payload than `.png` at equivalent quality.
- Target the export to ~800×800 px for TI (the frame is 260px on screen but retina/large-display-friendly) and ~1200×900 px for LR.
- Keep each file under ~250 KB; the entire app is currently self-contained HTML, and these will be the first true binary assets.
