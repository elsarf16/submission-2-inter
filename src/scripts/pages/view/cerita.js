import CeritaPresenter from "../../../presenter/ceritaPresenter.js";
import API from "../../data/api.js";
import Navbar from "../../components/navbar.js";

const Cerita = {
  async render() {
    return `
      ${Navbar.render()}
      <section class="cerita-page">
        <h2>Daftar Cerita</h2>
        <div id="story-list" class="story-list">Loading...</div>
      </section>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
    CeritaPresenter.initialize(this); // Kirim referensi view ke presenter
  },

  renderLoading() {
    const container = document.getElementById("story-list");
    if (container) container.innerHTML = "<p>Loading...</p>";
  },

  renderError(message) {
    const container = document.getElementById("story-list");
    if (container) container.innerHTML = `<p>${message}</p>`;
  },

  renderStories(stories) {
  const container = document.getElementById("story-list");
  if (!container) return;

  container.innerHTML = "";

  stories.forEach((story) => {
    // Ambil deskripsi (bisa kosong)
    const desc = story.description || story.content || "";
    const lines = desc.split("\n").map(line => line.trim());

    // Judul: pakai story.title dulu, kalau tidak ada baru ambil dari baris pertama deskripsi
    const title = story.title || lines[0] || "Tanpa Judul";

    // Ambil snippet isi cerita, skip baris pertama jika judul dari situ
    const snippet = lines.length > 1 ? lines.slice(1).join(" ").substring(0, 100) : "";
    const storySnippet = snippet || "Deskripsi tidak tersedia";

    const author = story.name || "Tidak diketahui";

    const storyItem = document.createElement("div");
    storyItem.className = "story-card";

    storyItem.innerHTML = `
      <a href="#/story/${story.id}" class="card-link">
        <img src="${story.photoUrl}" alt="${title}" class="story-thumbnail" />
        <h3 class="story-title">${title}</h3>
        <p class="story-snippet">${storySnippet}...</p>
        <p class="story-author"><strong>Penulis:</strong> ${author}</p>
        <p class="story-date">${new Date(story.createdAt).toLocaleString('id-ID')}</p>
      </a>
    `;

    container.appendChild(storyItem);
  });
},
};

export default Cerita;
