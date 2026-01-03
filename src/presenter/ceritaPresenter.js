// Presenter.js
import API from '../scripts/data/api.js';

const CeritaPresenter = {
  async initialize(view) {
    this.view = view;
    this.view.renderLoading();

    try {
      const response = await API.getStories();
      if (response.error) {
        this.view.renderError(response.message);
      } else {
        this.view.renderStories(response.listStory);
      }
    } catch (error) {
      this.view.renderError('Gagal memuat cerita.');
    }
  }
};

export default CeritaPresenter;
