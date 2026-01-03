// src/presenter/aboutPresenter.js
import API from '../scripts/data/api.js';

const aboutPresenter = {
  async getAllStories() {
    try {
      const { listStory } = await API.getStories();
      return { listStory, error: false };
    } catch (error) {
      console.error("Gagal mengambil stories:", error);
      return { listStory: [], error: true };
    }
  }
};

export default aboutPresenter;
