# CLAUDE.md — toefl-practice

## 音声生成時の必須チェック (Before every audio commit)

LR / TI など ElevenLabs で音声を生成・差し替えた場合は **コミット前に必ず**
choppy / stutter 監査を走らせること:

```bash
python tools/audio-check.py
# 個別フォルダ指定も可:
python tools/audio-check.py audio/lr/practice-1
```

- 0.7 秒以上の中間無音 (`STUTTER?` フラグ) があれば **再生成**
- 0.4–0.7 秒の中間無音は文末・カンマ後の自然な間なら OK
- 何もフラグが出なければそのままコミット

## 重複チェック

新規 Writing / Speaking 問題を作成したら、`toefl-task-training/docs/topic-history.md`
および `toefl-task-training/docs/scripts/*.md` と照合し、トピック・センテンス
パターンが被っていないか確認すること。被ったら表現を変えて差し替える。

## バックアップ規則

既存音声を上書きする際は、その問題フォルダ配下に
`_backup_original/` を作成し、上書き前のファイルを退避してからコピーすること。
