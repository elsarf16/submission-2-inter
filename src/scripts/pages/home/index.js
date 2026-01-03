import HomePresenter from "../../../presenter/homePresenter.js";
import Navbar from "../../components/navbar.js";
import { saveLikedStory, getAllLikedStories, deleteLikedStory } from "../../utils/likedb.js";

const Home = {
  async render() {
    return `
      ${Navbar.render()}
      <main id="main-content">
        <section class="hero">
          <div class="hero-content">
            <h1>
              Setiap orang punya cerita. <br />
              <span class="green">Di LiTera,</span> <span class="highlight">suaramu berarti.</span>
            </h1>
            <p class="sub-highlight">
              Bagikan kisahmu, temukan cerita dari ribuan penulis lain.
            </p>
            <div class="hero-buttons">
              <a href="#/add" class="btn-secondary">✍️ Tulis & Bagikan Ceritamu Sekarang !</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="assets/img/home1.png" alt="Hero Illustration" />
          </div>
        </section>

        <section class="stories-section">
          <div class="section-heading-card">
            <h2>Cerita Terbaru dari Penulis</h2>
          </div>
          <div id="story-list" class="story-list-container"></div>
          <div id="map" class="story-map" style="height: 300px; margin-top: 20px;"></div>
        </section>

        <section class="about-section" id="about">
          <div class="about-container">
            <div class="about-image">
              <img src="assets/img/about-illustration.png" alt="About Illustration" />
            </div>
            <div class="about-text">
              <h2>Tentang LiTera.</h2>
              <h3>Cerita Adalah Kekuatan.</h3>
              <p>
                LiTera hadir dari keyakinan bahwa setiap cerita punya kekuatan untuk mengubah cara kita melihat dunia.
              </p>
              <p>
                Kami menciptakan LiTera sebagai tempat yang aman dan bebas untuk menuangkan pikiran, imajinasi, dan pengalaman.
              </p>
              <p>
                Mari berbagi cerita, karena kisahmu bisa menjadi cahaya bagi orang lain.
              </p>
            </div>
          </div>
        </section>

        <section class="contact-section" id="contact-section">
          <div class="contact-container">
            <div class="contact-text">
              <h2>Kontak Kami</h2>
              <p>Hubungi kami jika kamu punya pertanyaan :)</p>
              <p>📸 Instagram: @literaid</p>
              <p>📱 WhatsApp: 08xx-xxx-xxx</p>
            </div>
            <div class="contact-image">
              <img src="assets/img/contact-illustration.png" alt="Buku dan apel" />
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>&copy; 2025 LiTera.id. Write Here</p>
      </footer>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
    const homeLink = document.querySelector("#home-link");
    const storyList = document.querySelector("#story-list");
    const mapContainer = document.getElementById("map");

    if (!homeLink || !storyList || !mapContainer) {
      console.warn("Elemen belum tersedia di DOM");
      return;
    }

    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = "/";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Setup map hanya sekali
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    try {
      const stories = await HomePresenter.getStories(); // ✅ Panggil hanya data
      this.renderStories(stories); // ✅ Render manual
    } catch (error) {
      console.error("Gagal memuat cerita:", error.message);
      storyList.innerHTML =
        "<p class='error-message'>Gagal memuat cerita. Silakan login atau periksa koneksi.</p>";
    }
  },

  async afterRenderLiked() {
    const likedList = document.getElementById('liked-list');
    if (!likedList) return;
    const likedStories = await getAllLikedStories();
    likedList.innerHTML = '';
    if (likedStories.length === 0) {
      likedList.innerHTML = '<p>Belum ada story yang di-like.</p>';
      return;
    }
    likedStories.forEach((story) => {
      let title = story.description;
      let fullStory = '';
      if (story.description && story.description.startsWith('#')) {
        const lines = story.description.split('\n');
        title = lines[0].replace('# ', '').trim();
        fullStory = lines.slice(1).join('\n').trim();
      }
      const storyItem = document.createElement('div');
      storyItem.className = 'story-card';
      storyItem.innerHTML = `
        <a href="#/story/${story.id}" class="story-link">
          <img class="story-img" src="${story.photoUrl}" alt="Story Photo" />
          <div class="story-body">
            <h2 class="story-title">${title}</h2>
            <p class="story-content">${fullStory}</p>
            <p class="story-author">Penulis : ${story.name || 'Penulis tidak diketahui'}</p>
            <p class="story-date"><small>${new Date(story.createdAt).toLocaleString()}</small></p>
          </div>
        </a>
        <button class="delete-like-btn" data-id="${story.id}">🗑️ Hapus</button>
      `;
      likedList.appendChild(storyItem);
      // Tombol hapus
      const deleteBtn = storyItem.querySelector('.delete-like-btn');
      deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await deleteLikedStory(story.id);
        alert('Story dihapus dari daftar Like!');
        await this.afterRenderLiked();
      });
    });
  },

  renderStories(stories) {
    const storyList = document.getElementById("story-list");
    if (!storyList) return;

    storyList.innerHTML = "";

    stories.forEach((story) => {
      let title = story.description;
      let fullStory = "";

      if (story.description.startsWith("#")) {
        const lines = story.description.split("\n");
        title = lines[0].replace("# ", "").trim();
        fullStory = lines.slice(1).join("\n").trim();
      }

      const storyItem = document.createElement("div");
      storyItem.className = "story-card";
      storyItem.innerHTML = `
        <a href="#/story/${story.id}" class="story-link">
          <img class="story-img" src="${story.photoUrl}" alt="Story Photo" />
          <div class="story-body">
            <h2 class="story-title">${title}</h2>
            <p class="story-content">${fullStory}</p>
            <p class="story-author">Penulis : ${
              story.name || "Penulis tidak diketahui"
            }</p>
            <p class="story-date"><small>${new Date(
              story.createdAt
            ).toLocaleString()}</small></p>
          </div>
        </a>
      `;
      storyList.appendChild(storyItem);

      if (story.lat && story.lon && this.map) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`
          <div style="max-width: 200px; word-wrap: break-word;">
            <strong>${title}</strong><br/>
            <p style="margin: 4px 0;">${fullStory.substring(0, 60)}${
          fullStory.length > 60 ? "..." : ""
        }</p>
            <a href="#/story/${
              story.id
            }" class="btn-filled popup-detail-button">Lihat Detail</a>
          </div>
        `);
      }
    });
  },

  redirectToLogin() {
    window.location.hash = "/login";
  },

  renderError(message) {
    const container = document.getElementById("story-list");
    if (container) {
      container.innerHTML = `<p class="error-message">${message}</p>`;
    }
  },
};

export default Home;
