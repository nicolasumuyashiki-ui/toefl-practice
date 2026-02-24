/**
 * GAS API通信モジュール
 * GAS Deploy URL設定済み
 */
const API_URL = 'https://script.google.com/a/macros/tckworkshop.co.jp/s/AKfycbwylm042co9aSzwlQG_nV8ZxyMEFtr0VGhL5i6hqHXoLLfNA8YJOLrpJriw0NdTWvZG2Q/exec';

const API = {
  async login(id, pass) {
    const url = \`\${API_URL}?action=login&id=\${encodeURIComponent(id)}&pass=\${encodeURIComponent(pass)}\`;
    const res = await fetch(url, { redirect: 'follow' });
    return res.json();
  },

  async getQuestions(section) {
    const url = \`\${API_URL}?action=getQuestions&section=\${encodeURIComponent(section)}\`;
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