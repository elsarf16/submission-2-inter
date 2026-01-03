// src/scripts/pages/auth/login.js
import loginPresenter from '../../../presenter/loginPresenter.js';
import Utils from '../../utils/index.js';

const Login = {
  async render() {
    return `
      <section class="auth-container">
        <div class="auth-box">
          <h1>Masuk</h1>
          <form id="login-form">
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" required>

            <label for="login-pass">Password:</label>
            <input type="password" id="login-pass" required>

            <div class="auth-buttons">
              <a href="#/" class="btn-back">Kembali</a>
              <button type="submit" class="btn-submit">Masuk</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value;

      if (!email || !pass) {
        alert('Email dan password wajib diisi!');
        return;
      }

      const response = await loginPresenter.login(email, pass);

      if (response && !response.error) {
        alert(`Selamat datang, ${response.loginResult.name}!`);
        window.location.hash = '/';
        window.location.reload();
      } else {
        alert('Login gagal: ' + (response.message || 'Terjadi kesalahan'));
      }
    });
  }
};

export default Login;
