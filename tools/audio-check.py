#!/usr/bin/env python3
"""
Audio choppiness / stutter audit.

Run BEFORE committing any newly-generated audio (LR / TI / etc).
Flags internal silences >= 0.7s (mid-clip, excluding leading/trailing 0.2s)
as potential stutters. Sub-0.7s gaps are usually natural sentence/comma pauses.

Usage:
    python tools/audio-check.py audio/lr/practice-1 audio/ti/practice-1
    # or no args -> default LR/TI practice-1
"""
import os, re, subprocess, sys

DEFAULT_DIRS = ["audio/lr/practice-1", "audio/ti/practice-1"]
NOISE_DB = "-35dB"
MIN_SILENCE = 0.4         # report internal silences >= this
STUTTER_THRESHOLD = 0.7   # flag as suspicious >= this

def probe(p):
    out = subprocess.run(
        ["ffprobe","-v","error","-show_entries","format=duration",
         "-of","default=noprint_wrappers=1:nokey=1", p],
        capture_output=True, text=True).stdout.strip()
    dur = float(out) if out else 0.0
    out = subprocess.run(
        ["ffmpeg","-hide_banner","-i", p,
         "-af", f"silencedetect=noise={NOISE_DB}:d={MIN_SILENCE}",
         "-f","null","-"],
        capture_output=True, text=True).stderr
    starts = re.findall(r"silence_start: ([\d.]+)", out)
    ends   = re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", out)
    internal = []
    for i,(_,sd) in enumerate(ends):
        s = float(starts[i]); e = s + float(sd)
        if s > 0.2 and e < dur - 0.2:
            internal.append((s, float(sd)))
    return dur, internal

def main(dirs):
    files = []
    for d in dirs:
        if not os.path.isdir(d): continue
        for f in sorted(os.listdir(d)):
            if f.endswith(".mp3") and not f.startswith("_"):
                files.append(os.path.join(d, f))
    if not files:
        print("No mp3 files found."); return 0
    print("{:<48} {:>6}  INTERNAL_SILENCES (>= {}s)".format("FILE","DUR",MIN_SILENCE))
    print("-"*92)
    flagged = 0
    for p in files:
        dur, sil = probe(p)
        sil_str = ", ".join("@{:.2f}={:.2f}s".format(s,d) for s,d in sil) if sil else "-"
        mark = ""
        if sil and max(d for _,d in sil) >= STUTTER_THRESHOLD:
            mark = "  STUTTER?"
            flagged += 1
        print("{:<48} {:>6.2f}  {}{}".format(p, dur, sil_str, mark))
    print()
    print("Suspicious files (>= {}s internal silence): {}".format(STUTTER_THRESHOLD, flagged))
    return 1 if flagged else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or DEFAULT_DIRS))
