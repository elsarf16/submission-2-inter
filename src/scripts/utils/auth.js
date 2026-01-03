const Auth = {
  saveUser(name) {
    // Simpan user berupa objek dengan properti name
    localStorage.setItem('user', JSON.stringify({ name }));
  },
  getUser() {
    // Ambil data user, parsing JSON, kembalikan objek atau null kalau tidak ada
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isLoggedIn() {
    // Cek apakah ada token yang disimpan
    return !!this.getToken();
  },
  setToken(token) {
    localStorage.setItem('authToken', token);
  },
  getToken() {
    return localStorage.getItem('authToken');
  },
  logout() {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

export default Auth;
