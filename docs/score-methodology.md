# Practice Test — Score Methodology

This document describes how `results.html` derives the predicted scores shown to the learner. It is the source of truth for the algorithm; if you change the math, update this file.

## 1. Input data

Each section reads from a different storage key. Both `localStorage` and `sessionStorage` are used.

| Section | Storage | Keys |
|---|---|---|
| Reading — Module 1 routing | localStorage | `m1_ctw_correct`/`_total`, `m1_rdl1_*`, `m1_rdl2_*`, `m1_academic_*` (and snapshot fallbacks `results_m1_*` saved by `reading-m2-select.html` before clearing the live keys) |
| Reading — Module 2 Easier | localStorage | `m2e_ctw_*`, `m2e_rdl1_*`, `m2e_rdl2_*` |
| Reading — Module 2 Harder | localStorage | `m2h_ctw_*`, `m2h_academic1_*`, `m2h_academic2_*` |
| Reading — adaptive path tag | localStorage | `results_path` (`'easy'` \| `'hard'`) |
| Listening — per-question answers | sessionStorage | `practice_listening_answers` — JSON object keyed `q1`…`q24`, value `{selected, correct[, isCorrect]}` |
| Writing — Build a Sentence | localStorage | `practice_writing_sentence_correct`/`_total` |
| Writing — submissions | localStorage | `practice_writing_email_words`, `practice_writing_discussion_words` |
| Speaking — completion flags | localStorage | `practice_speaking_lr_completed`, `practice_speaking_ti_completed` |

## 2. Harder-question weighting (Enhancement A)

Harder content is weighted **1.5×** for both correct AND total, so it lifts the percentage only when the learner actually nails the harder item.

```
weighted_correct = standard_correct + harder_correct × 1.5
weighted_total   = standard_total   + harder_total   × 1.5
weighted_pct     = weighted_correct / weighted_total × 100
```

When the learner has no Harder data, the formula reduces to the simple `correct/total` (backwards-compatible).

### Reading — what counts as Harder

| Bucket | Harder? |
|---|---|
| `m1_*` (routing module) | No (standard) |
| `m2e_*` (Easier branch) | No |
| `m2h_*` (Harder branch — m2h_ctw, m2h_academic1, m2h_academic2) | **Yes — all questions** |

### Listening — what counts as Harder

The four listening pages share a global `q1`…`q24` namespace. Per the toefl-task-training convention:

| Section | Global q-indices | Harder (1-indexed within section) | Harder global indices |
|---|---|---|---|
| LCR | q1–q8 | Q6, Q7, Q8 | **q6, q7, q8** |
| Conversation | q9–q12 | Q3, Q4 | **q11, q12** |
| Announcement | q13–q16 | NONE (skipped in Harder Module) | — |
| Academic Talk | q17–q24 | Q5–Q8 | **q21, q22, q23, q24** |

Hardcoded as `LISTENING_HARDER_QS` in `results.html`.

## 3. Adaptive-path scaling (Enhancement B)

The ETS adaptive engine effectively caps Easier-branch reading scores below the upper-band thresholds because the hardest items live in the Harder Module. We mirror that with two combined adjustments applied to the *scaled* reading score:

| Path | Adjustment |
|---|---|
| Harder | None — full 0–30 ceiling |
| Easier | `min(scaled × 0.92, 26)` — soft 0.92× multiplier and hard cap at 26 |
| No Module 2 data | Treat as Easier (conservative) |

Listening is **not** adjusted for path because branching is not implemented in the Practice Test today.

## 4. Band score derivation (Enhancement C)

ETS 2026 specifies that the overall band = the average of the four section bands rounded to the nearest 0.5.

`results.html`:

1. Looks up each available section's band via `sectionToBand(scaledScore)` (Speaking is skipped — unscored).
2. Averages the available bands (Reading + Listening + Writing if all three are present; fewer if not).
3. Rounds to the nearest 0.5 — `Math.round(raw * 2) / 2`.

The legacy projection (`totalToBand(total × 4/3)`) is retained as a fallback (when no sections are scored) and as a transparency footnote so learners can see the difference between the two methods.

`totalToBand()` and `sectionToBand()` are copied verbatim from `toefl-task-training/my-score.html`. Cut-points come from the ETS Japan 2026/01 announcement (see that file's header comment for the upstream reference).

## 5. ETS conversion-table lineage

- Reading raw 0–20 → scaled 0–30 — `READING_TABLE`
- Listening raw 0–28 → scaled 0–30 — `LISTENING_TABLE`

Both tables are copied verbatim from `toefl-task-training/my-score.html`, which sources them from ETS's TOEFL iBT Interactive Sampler scoring guides. Since the practice test's question count differs from 20 / 28, we map the **percentage** through the table (not raw counts) — `percentToScaled()` interpolates between the two nearest rows.

## 6. Unanswered-question handling (Enhancement D)

If `practice_listening_answers` contains fewer than 24 entries, we report what's there as-is (e.g., `4/24 = 16.7%`) and surface a notice on the Listening card:

> Section incomplete — score reflects only answered questions. No extrapolation applied.

This is intentional: extrapolating an unfinished section would systematically inflate or deflate the predicted score depending on which questions the learner happened to answer.

## 7. Limitations

- **Speaking is unscored.** TCK has no automated audio-assessment pipeline. The card always shows "Not auto-scored." Get coach feedback via the private-coaching option.
- **Writing relies on Build a Sentence as a proxy.** Email and Discussion are holistic-graded essays. The predicted Writing scaled score is derived purely from Sentence accuracy mapped through the Reading conversion table — *not* from word counts. Submission word counts are shown for transparency but do not affect the score.
- **Harder weight is fixed at 1.5×.** This is an empirical choice; ETS does not publish their exact item-weighting. If we acquire item-response data we should re-fit.
- **Easier-branch cap is approximate.** 0.92× and a 26 ceiling were chosen to roughly match the published Easier-branch ceiling on adaptive ETS exams. Fine-tune if real outcome data becomes available.
- **Listening doesn't yet branch.** All learners see the same 24 questions, so no path adjustment is applied to Listening.
- **Answer-key trust.** The "correct" field on each listening question is whatever the question page wrote. Bugs in those keys would propagate here.
