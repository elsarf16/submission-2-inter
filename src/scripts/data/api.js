import Auth from '../utils/auth.js';

const API_ENDPOINT = 'https://story-api.dicoding.dev/v1';

const API = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_ENDPOINT}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      console.log("✅ Login berhasil, token:", result.loginResult.token);

      Auth.setToken(result.loginResult.token);
      Auth.saveUser(result.loginResult.name);

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { error: true, message: error.message };
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_ENDPOINT}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      console.log("✅ Register berhasil:", result);
      return result;
    } catch (error) {
      console.error("Register error:", error);
      return { error: true, message: error.message };
    }
  },

  async getStories() {
    try {
      const token = Auth.getToken();
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const response = await fetch(`${API_ENDPOINT}/stories?location=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      console.error('getStories error:', error);
      return { error: true, message: error.message };
    }
  },

  async addStory(description, photoBlob, lat = null, lon = null) {
    try {
      const token = Auth.getToken();
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photoBlob);
      if (lat !== null) formData.append('lat', lat);
      if (lon !== null) formData.append('lon', lon);

      const response = await fetch(`${API_ENDPOINT}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      console.error('addStory error:', error);
      return { error: true, message: error.message };
    }
  },

  // ✅ Tambahan: untuk mendukung detail story
  async getStoryById(id) {
    try {
      const token = Auth.getToken();
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const response = await fetch(`${API_ENDPOINT}/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      return result.story; // ✅ hanya bagian story yang dibutuhkan
    } catch (error) {
      console.error('getStoryById error:', error);
      return { error: true, message: error.message };
    }
  }
};

export default API;
