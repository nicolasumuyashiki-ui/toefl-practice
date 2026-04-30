"""
One-shot migration to add to all Practice Test pages:
  1) HubSpot chat embed (before </head>)
  2) Terms / Privacy footer (only on results.html for now — test pages
     deliberately have no footer to mimic the real TOEFL test UI)

Idempotent: skips files that already include the embed/footer markers.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HUBSPOT_TAG = '<!-- Start of HubSpot Embed Code --><script type="text/javascript" id="hs-script-loader" async defer src="//js-na2.hs-scripts.com/242729130.js"></script><!-- End of HubSpot Embed Code -->'

# A subtle, dark-on-cream footer that links to terms + privacy
FOOTER_HTML = '''
<footer class="pt-tos-footer" style="margin-top:48px;padding:18px 24px 28px;border-top:1px solid #F5E9D3;text-align:center;font-size:.78em;color:#5A6861;font-family:'Manrope',system-ui,sans-serif">
  <span>© TCK Workshop · </span>
  <a href="https://apps.tckworkshop.co.jp/toefl-task-training/terms.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:1px solid #D6DAD7"><span class="jp">利用規約</span><span class="en">Terms</span></a>
  <span> · </span>
  <a href="https://www.tckwshop.com/privacypolicy/" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:1px solid #D6DAD7"><span class="jp">プライバシー</span><span class="en">Privacy</span></a>
</footer>
'''.strip()

# HubSpot: add to ALL HTML files (33 of them)
hubspot_added = []
hubspot_skipped = []
for path in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
    with open(path, 'r', encoding='utf-8') as f: html = f.read()
    if 'hs-script-loader' in html:
        hubspot_skipped.append(path); continue
    if '</head>' not in html:
        hubspot_skipped.append(path + ' (no </head>)'); continue
    new = html.replace('</head>', HUBSPOT_TAG + '\n</head>', 1)
    with open(path, 'w', encoding='utf-8', newline='') as f: f.write(new)
    hubspot_added.append(path)

# Terms footer: results.html only
footer_target = os.path.join(ROOT, 'results.html')
footer_added = False
if os.path.exists(footer_target):
    with open(footer_target, 'r', encoding='utf-8') as f: html = f.read()
    if 'pt-tos-footer' in html:
        pass  # already added
    else:
        # Insert before the first </script> at end of body — safer than </body>
        # actually just before </body>
        if '</body>' in html:
            new = html.replace('</body>', FOOTER_HTML + '\n</body>', 1)
            with open(footer_target, 'w', encoding='utf-8', newline='') as f: f.write(new)
            footer_added = True

def rel(p): return os.path.relpath(p, ROOT).replace('\\','/')
print(f'HubSpot added to {len(hubspot_added)} files')
for p in hubspot_added: print('  +', rel(p))
print(f'HubSpot skipped: {len(hubspot_skipped)}')
for p in hubspot_skipped: print('  =', rel(p))
print(f'Terms footer added to results.html: {footer_added}')
