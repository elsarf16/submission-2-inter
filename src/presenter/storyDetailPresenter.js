import API from "../scripts/data/api.js"; // path sudah benar berdasarkan struktur kamu

const StoryDetailPresenter = {
  async initialize(view, storyId) {
    view.renderLoading();

    try {
      const story = await API.getStoryById(storyId);

      if (!story || story.error) {
        view.renderError("Cerita tidak ditemukan.");
        return;
      }

      this.currentStory = story;
      view.renderStoryDetail(story);
    } catch (error) {
      console.error("Presenter error:", error);
      view.renderError("Terjadi kesalahan saat memuat cerita.");
    }
  },
};

export default StoryDetailPresenter;
