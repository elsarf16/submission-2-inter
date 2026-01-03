import registerPresenter from '../../../presenter/registerPresenter.js';

const Register = {
  async render() {
    return `
      <section class="auth-container">
        <div class="auth-box">
          <h1>Halaman Register</h1>
          <h2>Silahkan Masukkan Data Anda.</h2>
          <form id="register-form">
            <label for="register-name">Nama:</label>
            <input type="text" id="register-name" required>

            <label for="register-email">Email:</label>
            <input type="email" id="register-email" required>

            <label for="register-pass">Password:</label>
            <input type="password" id="register-pass" required>

            <div class="auth-buttons">
              <a href="#/" class="btn-back">Kembali</a>
              <button type="submit" class="btn-submit">Daftar</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const pass = document.getElementById('register-pass').value;

      const response = await registerPresenter.register(name, email, pass);

      if (!response.error) {
        alert(`Akun ${name} berhasil didaftarkan.`);
        window.location.hash = '/login';
      } else {
        alert('Gagal daftar: ' + response.message);
      }
    });
  }
};

export default Register;
