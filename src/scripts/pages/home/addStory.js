import Navbar from "../../components/navbar.js";
import Auth from "../../utils/auth.js";
import AddStoryView from "../view/addStoryView.js";
import AddStoryPresenter from "../../../presenter/addStoryPresenter.js";
import HomePresenter from "../../../presenter/homePresenter.js";

let hashChangeListener = null;

const AddStoryPage = {
  async render() {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "/login";
      return "<p>Redirecting...</p>";
    }

    return `
      ${Navbar.render()}
      <main class="add-story" id="add-story-container"></main>
    `;
  },

  async afterRender() {
    Navbar.afterRender();

    const container = document.getElementById("add-story-container");
    const view = new AddStoryView();
    view.render(container);

    const presenter = new AddStoryPresenter(view);
    await presenter.init();

    // Hapus listener lama jika ada supaya gak numpuk
    if (hashChangeListener) {
      window.removeEventListener("hashchange", hashChangeListener);
    }

    hashChangeListener = () => presenter.destroy();
    window.addEventListener("hashchange", hashChangeListener);
  },

  async handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("add-story-form");
    const formData = new FormData(form);

    const response = await HomePresenter.addStory(formData);
    if (response.error) {
      throw new Error(response.message);
    }
    alert("Story berhasil ditambahkan!");
    window.location.hash = "/"; // Arahkan ke halaman beranda
  },
};

export default AddStoryPage;
