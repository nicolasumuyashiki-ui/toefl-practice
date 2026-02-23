/**
 * セッション管理 (localStorage)
 */
const Auth = {
  save(user) {
    localStorage.setItem('toefl_user', JSON.stringify(user));
  },
  get() {
    try {
      return JSON.parse(localStorage.getItem('toefl_user'));
    } catch { return null; }
  },
  clear() {
    localStorage.removeItem('toefl_user');
  },
  require() {
    const u = this.get();
    if (!u) { location.href = 'index.html'; return null; }
    return u;
  },
  showBadge(elementId) {
    const u = this.get();
    const el = document.getElementById(elementId);
    if (u && u.name && el) {
      el.innerHTML = 'Welcome, <strong>' + u.name + '</strong>';
    }
  }
};
