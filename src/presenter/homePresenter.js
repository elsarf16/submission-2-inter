import API from "../scripts/data/api.js";
import Auth from "../scripts/utils/auth.js";

const HomePresenter = {
  async getStories() {
    try {
      if (!Auth.getToken()) {
        throw new Error("Token tidak ditemukan. Silakan login.");
      }

      const response = await API.getStories();

      if (response.error) {
        throw new Error(response.message);
      }

      return response.listStory;
    } catch (error) {
      console.error("Gagal mengambil cerita:", error.message);
      throw error;
    }
  }
};

export default HomePresenter;
