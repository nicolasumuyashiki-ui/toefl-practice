/**
 * difficulty-badge.js
 *
 * Small fixed-position badge that marks a TOEFL Harder-module item.
 * Two activation modes:
 *
 *   1) Page-wide (simplest) — set `<body data-difficulty="harder">`.
 *      Script reads this on load and shows the badge for the whole page.
 *      Used for: CTW Set 2 (every question is Harder).
 *
 *   2) Per-question (mid-practice switching) — call
 *      `TCKDifficulty.set('harder' | 'standard')` from the task's
 *      render function whenever it advances to a new question.
 *      Used for: Academic Passage (Q2), LCR (Q6-8), Conversation
 *      (Q3-4 = 2nd conv), Academic Talk (Q5-8 = 2nd talk).
 *
 * The badge is deliberately small and out-of-focus so it doesn't
 * distract from the task, but bold enough to signal elevated
 * difficulty. Pointer events disabled so it never interferes with
 * clicks on the problem itself.
 */
(function () {
  if (window.__TCKDifficultyInit) return;
  window.__TCKDifficultyInit = true;

  var style = document.createElement('style');
  style.textContent =
    '.tck-harder-badge{' +
      'position:fixed;top:14px;left:14px;z-index:90;' +
      'display:inline-flex;align-items:center;gap:3px;' +
      'padding:3px 9px 3px 7px;' +
      'background:linear-gradient(135deg,#E07B39,#C05414);' +
      'color:#fff;border-radius:4px;' +
      "font-family:'Manrope',system-ui,sans-serif;" +
      'font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;' +
      'box-shadow:0 2px 6px rgba(192,80,20,.28);' +
      'pointer-events:none;user-select:none;' +
      'transition:opacity .2s ease;' +
    '}' +
    '.tck-harder-badge.hidden{opacity:0}' +
    '.tck-harder-badge .spark{margin-right:2px;font-size:11px}';
  (document.head || document.documentElement).appendChild(style);

  var badge = null;
  function ensureBadge() {
    if (badge) return badge;
    badge = document.createElement('div');
    badge.className = 'tck-harder-badge hidden';
    badge.innerHTML = '<span class="spark">⚡</span>HARDER';
    badge.setAttribute('aria-label', 'Harder module content');
    if (document.body) document.body.appendChild(badge);
    return badge;
  }

  function applyBodyAttr() {
    var b = ensureBadge();
    if (String(document.body.getAttribute('data-difficulty') || '').toLowerCase() === 'harder') {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  }

  window.TCKDifficulty = {
    /** Explicit set — per-question mode. */
    set: function (level) {
      var b = ensureBadge();
      if (String(level).toLowerCase() === 'harder') b.classList.remove('hidden');
      else b.classList.add('hidden');
    },
    /** Returns 'harder' if the page itself is Harder-wide, else 'standard'. */
    getBody: function () {
      return String(document.body && document.body.getAttribute('data-difficulty') || 'standard').toLowerCase();
    },
    /**
     * Convenience for tasks where certain question indexes (0-based)
     * are Harder. Pass the current index + an array of Harder indexes.
     */
    setForIndex: function (idx, harderIndexes) {
      var isHarder = Array.isArray(harderIndexes) && harderIndexes.indexOf(idx) !== -1;
      this.set(isHarder ? 'harder' : 'standard');
    }
  };

  if (document.body) applyBodyAttr();
  else document.addEventListener('DOMContentLoaded', applyBodyAttr);
})();
