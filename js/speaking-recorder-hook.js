/**
 * speaking-recorder-hook.js — Practice Test version.
 * Lighter sibling of Task Training's hook (no mic-check redirect gate
 * because Practice Test users always reach Speaking after passing
 * through mic-check.html sequentially).
 *
 * Wraps the per-page startTask / startCountdown / playQuestion /
 * showComplete so each response window is recorded and uploaded to
 * Drive via Api.uploadRecording.
 *
 * The page must define `window.PRACTICE_TASK` ('lr' or 'ti') before
 * this script loads. practiceSet defaults to the current Practice
 * Test session id from sessionStorage (or '0').
 *
 * Required script load order:
 *   js/recorder.js
 *   js/api.js   (must export Api.uploadRecording)
 *   js/speaking-recorder-hook.js  ← this file, last
 */
(function(){
  if (typeof TCKRecorder === 'undefined' || typeof Api === 'undefined' || typeof Api.uploadRecording !== 'function') {
    console.warn('[recorder-hook] dependencies missing — recording disabled');
    return;
  }
  if (typeof window.startCountdown !== 'function' || typeof window.showComplete !== 'function') {
    console.warn('[recorder-hook] page hooks missing — recording disabled');
    return;
  }

  var TASK = window.PRACTICE_TASK || 'speaking';
  var SET  = window.PRACTICE_SET  || sessionStorage.getItem('practice_test_session_id') || '0';

  var recordingActive = false;
  var recStartedAt = 0;
  var recQNum = 0;
  var indicator = null;

  function ensureIndicator(){
    if (indicator) return indicator;
    var s = document.createElement('style');
    s.textContent = '@keyframes recPulse{0%,100%{opacity:1}50%{opacity:.25}}';
    document.head.appendChild(s);
    indicator = document.createElement('div');
    indicator.id = 'tckRecIndicator';
    indicator.setAttribute('style',
      'position:fixed!important;top:60px!important;right:20px!important;' +
      'display:none;align-items:center;gap:8px;padding:8px 18px;' +
      'background:#B85C3C!important;color:#fff!important;border-radius:999px;' +
      'font-size:.95em;font-weight:700;z-index:2147483647!important;' +
      'box-shadow:0 6px 20px rgba(184,92,60,.45);font-family:inherit;' +
      'visibility:visible!important;opacity:1!important;pointer-events:none');
    indicator.innerHTML = '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#fff;animation:recPulse 1s infinite;"></span><span>REC</span>';
    (document.body || document.documentElement).appendChild(indicator);
    return indicator;
  }
  function showRec(on){
    var el = ensureIndicator();
    el.style.setProperty('display', on ? 'inline-flex' : 'none', 'important');
  }

  function uploadCurrent(qNum){
    if (!recordingActive) return Promise.resolve();
    var dur = Math.round((Date.now() - recStartedAt) / 1000);
    recordingActive = false; showRec(false);
    return TCKRecorder.stop().then(function(blob){
      return TCKRecorder.blobToBase64(blob).then(function(b64){
        return Api.uploadRecording({
          task:           TASK,
          practiceSet:    SET,
          questionIndex:  qNum,
          mime:           TCKRecorder.getMime(),
          ext:            TCKRecorder.getExt(),
          durationSec:    dur,
          attemptNumber:  1
        }, b64);
      });
    }).catch(function(e){
      console.warn('[recorder-hook] upload failed for q' + qNum + ':', e);
    });
  }

  // Pre-init mic on the user-gesture Start button
  var origStart = window.startTask;
  if (typeof origStart === 'function') {
    window.startTask = function(){
      TCKRecorder.init().catch(function(e){
        console.warn('[recorder-hook] mic init failed:', e);
      });
      return origStart.apply(this, arguments);
    };
  }

  // Begin recording at the start of each response countdown
  var origCountdown = window.startCountdown;
  window.startCountdown = function(qNum){
    if (TCKRecorder.isReady()){
      try {
        TCKRecorder.start();
        recordingActive = true;
        recStartedAt    = Date.now();
        recQNum         = qNum;
        showRec(true);
      } catch(e){
        console.warn('[recorder-hook] rec start failed:', e);
      }
    }
    return origCountdown.apply(this, arguments);
  };

  // Stop + upload right before the next question is played
  var origPlayQuestion = window.playQuestion;
  if (typeof origPlayQuestion === 'function') {
    window.playQuestion = function(qNum){
      var priorQ = qNum - 1;
      if (recordingActive && priorQ >= 1) uploadCurrent(priorQ);
      return origPlayQuestion.apply(this, arguments);
    };
  }

  // Final question / Section Complete: stop, upload, release mic
  var origShowComplete = window.showComplete;
  window.showComplete = function(){
    var lastQ = recQNum || (typeof totalQuestions === 'number' ? totalQuestions : 0);
    var p = recordingActive ? uploadCurrent(lastQ) : Promise.resolve();
    p.then(function(){ TCKRecorder.release(); });
    return origShowComplete.apply(this, arguments);
  };

  window.addEventListener('beforeunload', function(){ TCKRecorder.release(); });
})();
