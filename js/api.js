/**
 * GAS API 通信モジュール — Practice Test (模試) 用
 *
 * Practice Test は当面 Task Training の GAS 配下にデータを集約します
 * （単一の管理画面で受講生を一元管理するため）。録音アップロードは
 * Task Training と同じ doPost エンドポイントへ送信し、`source=pt` 引数
 * でサーバ側に「これは模試の録音」と伝える。GAS は source=pt の時だけ
 *   - ファイル名: TCK_PT_RECORDING_* (vs Task Training の TCK_RECORDING_*)
 *   - シート: RECORDINGS_PT (vs RECORDINGS)
 * に振り分けて、模試と日々のトレーニングを論理的に分離。
 */

// Task Training (集約先) の GAS Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwjI8n86Cu1ar1IsPffyq9mboDrUNpG-SsVpFtURjP6AmCFHD3Zbw5_qcJJUksz_UDyyw/exec';

// Practice Test ローカル GAS（旧 — 必要に応じて使う）
// const PT_API_URL = 'https://script.google.com/macros/s/AKfycbwylm042co9aSzwlQG_nV8ZxyMEFtr0VGhL5i6hqHXoLLfNA8YJOLrpJriw0NdTWvZG2Q/exec';

const API = {
  async login(id, pass) {
    const url = `${API_URL}?action=login&id=${encodeURIComponent(id)}&pass=${encodeURIComponent(pass)}`;
    const res = await fetch(url, { redirect: 'follow' });
    return res.json();
  },

  async getQuestions(section) {
    const url = `${API_URL}?action=getQuestions&section=${encodeURIComponent(section)}`;
    const res = await fetch(url, { redirect: 'follow' });
    return res.json();
  },

  async saveAnswer(userId, section, answers) {
    const res = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({ action: 'saveAnswer', userId, section, answers })
    });
    return res.json();
  },

  async saveAudio(userId, questionId, audioBase64) {
    const res = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({ action: 'saveAudio', userId, questionId, audioBase64 })
    });
    return res.json();
  }
};

/* JSONP helper for cross-origin GAS calls (login/recover/results work
   fine via script-tag injection because they're GET-only and small). */
function _ptJsonp(url) {
  return new Promise(function(resolve, reject){
    var cb = '_ptCb_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    var to = setTimeout(function(){
      delete window[cb];
      if (s.parentNode) s.parentNode.removeChild(s);
      reject(new Error('timeout'));
    }, 15000);
    window[cb] = function(data){
      clearTimeout(to);
      delete window[cb];
      if (s.parentNode) s.parentNode.removeChild(s);
      resolve(data);
    };
    var s = document.createElement('script');
    s.src = url + '&callback=' + cb;
    s.onerror = function(){
      clearTimeout(to);
      delete window[cb];
      if (s.parentNode) s.parentNode.removeChild(s);
      reject(new Error('network'));
    };
    document.head.appendChild(s);
  });
}

/* Lower-case `Api` mirror — speaking-recorder-hook.js looks for this name.
   Uses hidden iframe form-submit POST to bypass the GAS 302 → CORS issue
   that causes plain fetch to lose the body. Same pattern as Task Training. */
var Api = {
  uploadRecording: function(meta, base64Audio){
    var u = JSON.parse(sessionStorage.getItem('kickstart_user') || '{}');
    var data = {
      action:        'uploadRecording',
      source:        'pt',                                // <- Practice Test marker
      userId:        u.userId   || sessionStorage.getItem('practice_test_user') || 'anon',
      userName:      u.userName || '',
      task:          meta.task          || '',
      practiceSet:   String(meta.practiceSet || ''),
      questionIndex: String(meta.questionIndex || 0),
      mime:          meta.mime || 'audio/webm',
      ext:           meta.ext  || 'webm',
      durationSec:   String(meta.durationSec || 0),
      attemptNumber: String(meta.attemptNumber || 1),
      audioB64:      base64Audio || ''
    };
    return new Promise(function(resolve){
      var name = 'gasUpload_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
      var iframe = document.createElement('iframe');
      iframe.name = name;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      var form = document.createElement('form');
      form.method = 'POST';
      form.action = API_URL;
      form.target = name;
      form.enctype = 'application/x-www-form-urlencoded';
      form.acceptCharset = 'UTF-8';
      form.style.display = 'none';
      Object.keys(data).forEach(function(k){
        var inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = k;
        inp.value = data[k];
        form.appendChild(inp);
      });
      document.body.appendChild(form);
      var done = false;
      function cleanup(r){
        if (done) return; done = true;
        setTimeout(function(){
          try { form.parentNode && form.parentNode.removeChild(form); } catch(e){}
          try { iframe.parentNode && iframe.parentNode.removeChild(iframe); } catch(e){}
        }, 250);
        resolve(r);
      }
      iframe.onload = function(){ cleanup({ success: true, transparent: true }); };
      setTimeout(function(){ cleanup({ success: true, timeout: true }); }, 30000);
      form.submit();
    });
  },

  /* Save the current Practice Test result (every attempt — no dedup) */
  savePtResult: function(payload){
    var u = JSON.parse(sessionStorage.getItem('kickstart_user') || '{}');
    var qs = '?action=savePtResult'
      + '&userId='   + encodeURIComponent(u.userId   || '')
      + '&userName=' + encodeURIComponent(u.userName || '')
      + '&sessionId='+ encodeURIComponent(payload.sessionId || '')
      + '&readingCorrect='   + encodeURIComponent(payload.readingCorrect   || 0)
      + '&readingTotal='     + encodeURIComponent(payload.readingTotal     || 0)
      + '&readingScaled='    + encodeURIComponent(payload.readingScaled    || 0)
      + '&listeningCorrect=' + encodeURIComponent(payload.listeningCorrect || 0)
      + '&listeningTotal='   + encodeURIComponent(payload.listeningTotal   || 0)
      + '&listeningScaled='  + encodeURIComponent(payload.listeningScaled  || 0)
      + '&writingSentCorrect=' + encodeURIComponent(payload.writingSentCorrect || 0)
      + '&writingSentTotal='   + encodeURIComponent(payload.writingSentTotal   || 0)
      + '&writingScaled='      + encodeURIComponent(payload.writingScaled || 0)
      + '&speakingLr=' + (payload.speakingLr ? 'true' : 'false')
      + '&speakingTi=' + (payload.speakingTi ? 'true' : 'false')
      + '&total=' + encodeURIComponent(payload.total || 0)
      + '&band='  + encodeURIComponent(payload.band  || '')
      + '&readingPath=' + encodeURIComponent(payload.readingPath || '');
    return _ptJsonp(API_URL + qs);
  },

  /* Fetch all past Practice Test results for the current user */
  listPtResults: function(){
    var u = JSON.parse(sessionStorage.getItem('kickstart_user') || '{}');
    return _ptJsonp(API_URL + '?action=listPtResults&userId=' + encodeURIComponent(u.userId || ''));
  }
};
