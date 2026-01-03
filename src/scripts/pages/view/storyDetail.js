import StoryDetailPresenter from "../../../presenter/storyDetailPresenter.js";
import Navbar from "../../components/navbar.js";
import { saveLikedStory, getAllLikedStories } from "../../utils/likedb.js";

const StoryDetail = {
  async render() {
    return `
      ${Navbar.render()}
      <style>
        .story-detail-page {
          padding-top: 80px;  /* Sesuaikan dengan tinggi navbar */
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        .detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .story-detail-img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
          margin: 20px 0;
        }
        #story-title {
          font-size: 2em;
          color: #333;
          margin-bottom: 20px;
        }
        #story-desc {
          font-size: 1.1em;
          line-height: 1.6;
          color: #444;
          margin: 20px 0;
        }
        .story-meta {
          display: flex;
          gap: 20px;
          margin: 20px 0;
          color: #666;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .like-btn {
          background: #ff4b6e;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 1em;
          margin: 20px 0;
          transition: background 0.3s;
        }
        .like-btn:hover:not(:disabled) {
          background: #ff2d56;
        }
        .like-btn:disabled {
          background: #ffb3c2;
          cursor: not-allowed;
        }
        .fixed-back-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #333;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .fixed-back-button:hover {
          transform: translateY(-2px);
          background: #444;
        }
      </style>
      <section class="story-detail-page">
        <div class="detail-container">
          <h1 id="story-title">Memuat...</h1>
          <img id="story-photo" src="" alt="Story Image" class="story-detail-img"/>
          <p id="story-desc"></p>
          <button id="like-detail-btn" class="like-btn">❤️ Like</button>
          <div class="story-meta">
            <span id="story-user" class="meta-item">
              <i class="fa fa-user"></i>
              Ditulis oleh: <span class="meta-text"></span>
            </span>
            <span id="story-date" class="meta-item">
              <i class="fa fa-calendar"></i>
              <span class="meta-text"></span>
            </span>
          </div>
        </div>
        <button id="btn-back" class="fixed-back-button">Kembali</button>
      </section>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
    const hash = window.location.hash;
    const id = hash.split("/")[2];
    StoryDetailPresenter.initialize(this, id);

    const backBtn = document.getElementById("btn-back");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.hash = "#/";
      });
    }

    // Like button logic
    const likeBtn = document.getElementById("like-detail-btn");
    if (likeBtn) {
      // Cek status like setelah story dimuat
      const checkLikeStatus = async () => {
        const story = StoryDetailPresenter.currentStory;
        if (!story) return;
        const likedStories = await getAllLikedStories();
        if (likedStories.some(s => s.id === story.id)) {
          likeBtn.textContent = '❤️ Sudah di-Like';
          likeBtn.disabled = true;
        } else {
          likeBtn.textContent = '❤️ Like';
          likeBtn.disabled = false;
        }
      };
      // Cek status like setiap 200ms sampai story tersedia
      let interval = setInterval(async () => {
        if (StoryDetailPresenter.currentStory) {
          await checkLikeStatus();
          clearInterval(interval);
        }
      }, 200);
      likeBtn.addEventListener("click", async () => {
        const story = StoryDetailPresenter.currentStory;
        if (!story) {
          alert("Story belum dimuat!");
          return;
        }
        const likedStories = await getAllLikedStories();
        if (likedStories.some(s => s.id === story.id)) {
          likeBtn.textContent = '❤️ Sudah di-Like';
          likeBtn.disabled = true;
          alert("Story sudah ada di daftar Like!");
          return;
        }
        await saveLikedStory(story);
        likeBtn.textContent = '❤️ Sudah di-Like';
        likeBtn.disabled = true;
        alert("Story disimpan ke daftar Like!");
      });
    }
  },

  renderLoading() {
    // ✅ FIX: Jangan hapus elemen DOM, cukup update teks title
    const titleEl = document.getElementById("story-title");
    if (titleEl) titleEl.textContent = "Memuat cerita...";
  },

  renderError(message) {
    const container = document.querySelector(".detail-container");
    if (container) container.innerHTML = `<p>${message}</p>`;
  },

  renderStoryDetail(story) {
    const description = story.description || "";
    const [firstLine, ...rest] = description.split("\n");
    const title = firstLine.replace(/^#+\s*/, "").trim() || "Tanpa Judul";
    const content = rest.join("\n").trim() || "";
    const image = story.photoUrl || "https://via.placeholder.com/300x200?text=No+Image";
    const author = story.name || "Tidak diketahui";
    const date = story.createdAt
      ? new Date(story.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Tanggal tidak tersedia";

    document.getElementById("story-title").textContent = title;
    const photoEl = document.getElementById("story-photo");
    photoEl.src = image;
    photoEl.alt = title;
    document.getElementById("story-desc").textContent = content;
    document.querySelector("#story-user .meta-text").textContent = author;
    document.querySelector("#story-date .meta-text").textContent = date;
  },
};

export default StoryDetail;
