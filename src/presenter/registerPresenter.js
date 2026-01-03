// src/presenter/registerPresenter.js
import API from '../scripts/data/api.js';

const registerPresenter = {
  async register(name, email, password) {
    if (!name || !email || !password) {
      return { error: true, message: 'Semua kolom wajib diisi.' };
    }

    if (password.length < 8) {
      return { error: true, message: 'Password harus minimal 8 karakter.' };
    }

    try {
      const response = await API.register(name, email, password);
      return response;
    } catch (error) {
      return { error: true, message: 'Terjadi kesalahan saat mendaftar.' };
    }
  }
};

export default registerPresenter;
