/* TCK Workshop — TOEFL iBT Practice Test
   Shared design tokens + chrome utilities, mirrored from
   toefl-task-training so the practice-test flow reads as the
   exam-mode counterpart of the task-training app. */

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700&display=swap');

:root{
  --green:#007646;
  --green-dark:#004D2E;
  --green-deep:#002817;
  --gold:#C9A961;
  --sky:#4A90B8;
  --terracotta:#B85C3C;
  --paper:#F5E9D3;
  --cream:#FBF6EC;
  --ink-900:#0F1511;
  --ink-500:#5A6861;
  --ink-200:#D6DAD7;
  --white:#FFFFFF;
  --radius:14px;
  --font-jp:"Zen Kaku Gothic New","Noto Sans JP",system-ui,sans-serif;
  --font-en:"Manrope",system-ui,-apple-system,sans-serif;
}

*,*::before,*::after{box-sizing:border-box}
*{margin:0;padding:0}

body{
  font-family:var(--font-en),var(--font-jp);
  background:var(--cream);
  min-height:100vh;
  display:flex;flex-direction:column;
  color:var(--ink-900);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}

/* ── Top Bar (legacy hook still used by some pages) ── */
.top-bar{
  background:var(--cream);
  color:var(--green-deep);
  padding:14px 28px;
  display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid var(--paper);
}
.top-bar-title{
  font-family:var(--font-en);
  font-size:.78em;font-weight:800;
  color:var(--green);
  letter-spacing:.14em;text-transform:uppercase;
}
.top-bar-right{font-size:.85em;color:var(--ink-500)}
.brand-logo{height:28px;width:auto;display:inline-block;vertical-align:middle;flex-shrink:0}
.brand-logo--lg{height:48px}
.brand-logo--xs{height:22px}
.brand-logo--xl{height:72px}

/* Footer brand mark — used on *-end completion pages */
.tck-footer-brand{display:flex;flex-direction:column;align-items:center;gap:6px;margin:48px auto 24px;padding-top:24px;border-top:1px solid var(--paper);max-width:560px;color:var(--ink-500);font-family:var(--font-en);font-size:.7em;letter-spacing:.16em;text-transform:uppercase}
.tck-footer-brand img{height:36px;width:auto;opacity:.85}

/* Print styles — visible logo header on printed results / completion pages */
@media print{
  .top-bar,.section-nav,.reading-nav,.listening-nav,.writing-nav,.speaking-nav{
    background:#fff!important;border-bottom:1px solid #ccc!important;page-break-after:avoid;
  }
  .brand-logo{height:36px!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .btn-logout,.btn-start,.btn-next,.user-pill,.user-badge,.tck-lang-toggle,
  .modal-overlay,.section-footer,.reading-footer,.listening-footer,.writing-footer,.speaking-footer,
  .footer-cta,.btn-footer{display:none!important}
  body{background:#fff!important;color:#000!important}
  .total-inner{background:#fff!important;color:#000!important;border:1px solid #ccc!important}
  .total-label,.total-big,.total-band,.skill-name{color:#000!important}
  a{color:#000!important;text-decoration:none}
}
.user-badge{font-size:.82em;color:var(--ink-500)}
.user-badge strong{color:var(--green-deep);font-weight:700}

/* ── Section / Reading nav (chrome at top of each task page) ── */
.section-nav,
.reading-nav{
  background:var(--white);
  border-bottom:1px solid var(--paper);
  padding:12px 24px;
  display:flex;align-items:center;gap:14px;
}
.section-nav-label,
.reading-nav-label{
  font-family:var(--font-en);
  font-size:.78em;font-weight:800;
  color:var(--green);
  letter-spacing:.14em;text-transform:uppercase;
}
.reading-nav-close{
  width:32px;height:32px;border:none;background:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  border-radius:8px;color:var(--ink-500);font-size:1.2em;
  transition:background .2s;
}
.reading-nav-close:hover{background:var(--cream);color:var(--green-deep)}
.reading-nav-right,.section-nav-right{margin-left:auto;font-size:.82em;color:var(--ink-500)}

/* ── Progress bar ── */
.section-progress,
.reading-progress{height:4px;background:var(--paper);width:100%;flex-shrink:0}
.section-progress-fill,
.reading-progress-fill{height:100%;background:var(--green);border-radius:2px;transition:width .3s ease}

/* ── Main body / cards ── */
.main{flex:1;display:flex;justify-content:center;align-items:center;padding:40px 20px}
.section-body,
.reading-body{flex:1;display:flex;justify-content:center;padding:60px 24px 120px}
.section-content,
.reading-content{width:100%;max-width:640px}
.section-content h2,
.reading-content h2{
  font-family:var(--font-en);
  font-size:1.55em;font-weight:800;
  color:var(--green-deep);
  letter-spacing:-0.01em;
  margin-bottom:18px;
  line-height:1.25;
}
.section-content p,
.reading-content p{
  font-size:.95em;color:var(--ink-500);
  line-height:1.7;margin-bottom:20px;
}

.card{
  background:var(--white);
  border:1px solid var(--paper);
  border-radius:var(--radius);
  box-shadow:0 8px 24px rgba(0,40,23,.06);
  width:100%;max-width:520px;overflow:hidden;
}
.card-header{
  background:var(--cream);
  border-bottom:1px solid var(--paper);
  padding:24px 30px;
  display:flex;align-items:center;gap:16px;
  color:var(--green-deep);
}
.card-body{padding:28px 30px;color:var(--ink-900)}
.card-footer{border-top:1px solid var(--paper);padding:14px 30px;text-align:center;color:var(--ink-500);font-size:.82em}

/* ── Buttons ── */
.btn-primary{
  width:100%;padding:13px 20px;
  font-family:var(--font-en);font-size:1em;font-weight:700;
  color:var(--white);background:var(--green);
  border:none;border-radius:999px;cursor:pointer;
  transition:all .2s;letter-spacing:.01em;
}
.btn-primary:hover{background:var(--green-dark);box-shadow:0 6px 18px rgba(0,118,70,.2);transform:translateY(-1px)}
.btn-primary:disabled{background:var(--ink-200);color:var(--ink-500);cursor:not-allowed;transform:none;box-shadow:none}

.btn-secondary{
  width:100%;padding:11px 20px;
  font-family:var(--font-en);font-size:.92em;font-weight:600;
  color:var(--ink-500);background:transparent;
  border:1px solid var(--paper);border-radius:999px;
  cursor:pointer;transition:all .2s;margin-top:10px;
}
.btn-secondary:hover{background:var(--cream);border-color:var(--green);color:var(--green-deep)}

/* Pill-shaped CTA used in section footers (Continue / Start Practice) */
.btn-start,
.btn-continue{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 28px;
  font-family:var(--font-en);font-size:.95em;font-weight:700;
  color:var(--white);background:var(--green);
  border:none;border-radius:999px;cursor:pointer;
  transition:all .2s;letter-spacing:.01em;
}
.btn-start:hover,
.btn-continue:hover{background:var(--green-dark);box-shadow:0 6px 18px rgba(0,118,70,.22);transform:translateY(-1px)}
.btn-start svg,
.btn-continue svg{width:16px;height:16px;fill:currentColor}

.btn-back,
.btn-review{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 22px;
  font-family:var(--font-en);font-size:.92em;font-weight:600;
  color:var(--ink-500);background:var(--white);
  border:1px solid var(--paper);border-radius:999px;
  cursor:pointer;transition:all .2s;
}
.btn-back:hover,
.btn-review:hover{background:var(--cream);border-color:var(--green);color:var(--green-deep)}

/* ── Footer chrome ── */
.section-footer,
.reading-footer{
  position:fixed;bottom:0;left:0;right:0;
  background:var(--white);
  border-top:1px solid var(--paper);
  padding:14px 24px;
  display:flex;justify-content:space-between;align-items:center;
  z-index:100;
}
.section-footer{justify-content:flex-end}
.footer-left{display:flex;gap:12px}
.footer-right{display:flex;gap:12px}

/* ── Info / caution boxes (transition pages) ── */
.info-box{
  background:var(--white);
  border:1px solid var(--paper);
  border-radius:var(--radius);
  padding:20px 24px;margin-bottom:24px;
}
.info-box h3{
  font-family:var(--font-en);
  font-size:.95em;font-weight:800;
  color:var(--green-deep);
  margin-bottom:10px;letter-spacing:-0.005em;
}
.info-box p{font-size:.9em;color:var(--ink-500);line-height:1.65;margin-bottom:8px}
.info-box p:last-child{margin-bottom:0}
.bold{font-weight:700;color:var(--green-deep)}

.caution-banner{
  display:flex;align-items:flex-start;gap:10px;
  background:#FDF4F0;
  border:1px solid #E5B8A0;
  border-left:4px solid var(--terracotta);
  border-radius:12px;
  padding:14px 18px;margin-bottom:24px;
}
.caution-icon{font-size:1.2em;flex-shrink:0;margin-top:1px}
.caution-text{font-size:.9em;color:#5A2D1A;line-height:1.6}
.caution-text strong{color:#8A3E24}

.action-list{list-style:none;padding:0;margin:0 0 24px 0}
.action-list li{font-size:.92em;color:var(--ink-500);line-height:1.65;padding:6px 0 6px 18px;position:relative}
.action-list li::before{content:"·";position:absolute;left:0;color:var(--green);font-weight:700;font-size:1.4em;line-height:1;top:6px}
.action-list li .label{font-weight:700;color:var(--green-deep);text-decoration:underline;text-decoration-color:var(--green);text-underline-offset:3px}

/* ── Task-table (intros) ── */
.task-table{
  width:100%;border-collapse:collapse;
  border:1px solid var(--paper);
  border-radius:var(--radius);overflow:hidden;
  background:var(--white);
}
.task-table thead th{
  background:var(--cream);
  color:var(--green-deep);
  font-family:var(--font-en);
  font-size:.78em;font-weight:800;
  letter-spacing:.08em;text-transform:uppercase;
  text-align:left;padding:12px 18px;
  border-bottom:1px solid var(--paper);
}
.task-table tbody td{
  padding:14px 18px;font-size:.92em;color:var(--ink-500);
  border-bottom:1px solid var(--paper);vertical-align:top;
}
.task-table tbody td strong{color:var(--green-deep);font-weight:700}
.task-table tbody tr:last-child td{border-bottom:none}
.task-table tbody tr:hover{background:var(--cream)}

/* ── i18n primitives ── */
body[data-lang="jp"] .en{display:none}
body[data-lang="en"] .jp{display:none}
.jp{font-family:var(--font-jp)}
.en{font-family:var(--font-en);letter-spacing:-0.005em}

/* ── Utilities ── */
.hidden{display:none!important}
.exit-link{
  font-size:.85em;color:var(--ink-500);
  background:none;border:none;font-family:inherit;
  cursor:pointer;text-decoration:underline;
  text-underline-offset:3px;
}
.exit-link:hover{color:var(--green-deep)}
