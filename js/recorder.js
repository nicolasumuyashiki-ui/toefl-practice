/**
 * recorder.js — MediaRecorder wrapper for Speaking tasks (LR / TI).
 *
 * Usage:
 *   await TCKRecorder.init();           // request mic once per page
 *   TCKRecorder.start();                // begin recording
 *   const blob = await TCKRecorder.stop();   // stops + returns Blob
 *   const b64  = await TCKRecorder.blobToBase64(blob);
 *
 * Browser support:
 *   - Chrome/Edge/Firefox desktop: webm/opus (default)
 *   - Safari/iOS:                  mp4/aac fallback
 *   We probe MediaRecorder.isTypeSupported() and pick the first that works.
 *   Server-side we trust the browser's chosen MIME — no transcoding.
 */
(function(global){
  var stream = null;
  var rec = null;
  var chunks = [];
  var mimeType = '';
  var stopResolve = null;

  var CANDIDATES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg'
  ];

  function pickMime(){
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
    for (var i = 0; i < CANDIDATES.length; i++){
      try { if (MediaRecorder.isTypeSupported(CANDIDATES[i])) return CANDIDATES[i]; } catch(e){}
    }
    return '';
  }

  function extFromMime(m){
    if (!m) return 'webm';
    if (m.indexOf('mp4')  !== -1) return 'm4a';
    if (m.indexOf('ogg')  !== -1) return 'ogg';
    return 'webm';
  }

  var TCKRecorder = {
    /* Returns true once mic is granted. Call early so the user-gesture
       requirement is satisfied before the timer-driven start(). */
    init: function(){
      if (stream) return Promise.resolve(true);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.reject(new Error('mediaDevices_unsupported'));
      }
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(function(s){
        stream = s;
        mimeType = pickMime();
        return true;
      });
    },

    isReady: function(){ return !!stream; },
    getMime: function(){ return mimeType; },
    getExt:  function(){ return extFromMime(mimeType); },

    start: function(){
      if (!stream) throw new Error('not_initialized');
      chunks = [];
      var opts = mimeType ? { mimeType: mimeType } : {};
      try { rec = new MediaRecorder(stream, opts); }
      catch (e) { rec = new MediaRecorder(stream); }
      rec.ondataavailable = function(ev){ if (ev.data && ev.data.size) chunks.push(ev.data); };
      rec.onstop = function(){
        var blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        if (stopResolve) { stopResolve(blob); stopResolve = null; }
      };
      rec.start();
    },

    /* Returns a Promise<Blob>. Safe to call even if already stopped. */
    stop: function(){
      return new Promise(function(resolve){
        if (!rec || rec.state === 'inactive') {
          var blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          resolve(blob); return;
        }
        stopResolve = resolve;
        try { rec.stop(); } catch(e){
          var b = new Blob(chunks, { type: mimeType || 'audio/webm' });
          resolve(b);
        }
      });
    },

    /* Release the mic stream — call on page exit. */
    release: function(){
      if (rec && rec.state !== 'inactive') { try { rec.stop(); } catch(e){} }
      if (stream) {
        stream.getTracks().forEach(function(t){ try { t.stop(); } catch(e){} });
        stream = null;
      }
      rec = null; chunks = [];
    },

    blobToBase64: function(blob){
      return new Promise(function(resolve, reject){
        var fr = new FileReader();
        fr.onload  = function(){
          // strip "data:audio/...;base64,"
          var s = String(fr.result || '');
          var idx = s.indexOf(',');
          resolve(idx >= 0 ? s.slice(idx + 1) : s);
        };
        fr.onerror = function(){ reject(new Error('read_failed')); };
        fr.readAsDataURL(blob);
      });
    }
  };

  global.TCKRecorder = TCKRecorder;
})(window);
