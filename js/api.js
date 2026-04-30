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
  }
};
