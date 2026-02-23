/**
 * GAS API通信モジュール
 * 
 * ★ GASをデプロイしたら、下の API_URL を書き換えてください
 */
const API_URL = 'YOUR_GAS_DEPLOY_URL_HERE';

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
