import aboutPresenter from '../../../presenter/aboutPresenter.js';
import Navbar from "../../components/navbar.js";

const About = {
  async render() {
    return `
      ${Navbar.render()}
      <main id="main-content" tabindex="-1">
        <section class="about-list">
          <h1>Cerita Pengguna</h1>
          <div id="user-story-list" class="story-grid"></div>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 2025 LiTera.id</p>
      </footer>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
    const mainContent = document.querySelector("#main-content");
    const skipLink = document.querySelector(".skip-link");

    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    });

    const container = document.getElementById("user-story-list");

    const { listStory, error } = await aboutPresenter.getAllStories();

    if (error || !listStory.length) {
      container.innerHTML = "<p>Belum ada cerita pengguna atau terjadi kesalahan.</p>";
      return;
    }

    listStory.forEach((story) => {
      let title = story.description;
      let fullStory = "";

      if (story.description && story.description.startsWith("#")) {
        const lines = story.description.split("\n");
        title = lines[0].replace("# ", "").trim();
        fullStory = lines.slice(1).join("\n").trim();
      }

      const storyCard = document.createElement("div");
      storyCard.className = "story-card";
      storyCard.innerHTML = `
        <img class="story-img" src="${story.photoUrl}" alt="Foto Cerita">
        <div class="story-body">
          <h2 class="story-title">${title}</h2>
          <p class="story-content">${fullStory || "Deskripsi tidak tersedia"}</p>
          <p class="story-date"><small>${new Date(story.createdAt).toLocaleString()}</small></p>
          ${
            story.lat !== undefined && story.lon !== undefined
              ? `<p class="story-location"><small>Lokasi: ${story.lat.toFixed(2)}, ${story.lon.toFixed(2)}</small></p>`
              : ""
          }
        </div>
      `;
      container.appendChild(storyCard);
    });
  },
};

export default About;
