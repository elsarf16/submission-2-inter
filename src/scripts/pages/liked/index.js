import Navbar from "../../components/navbar.js";
import { getAllLikedStories, deleteLikedStory } from "../../utils/likedb.js";

const Liked = {
  async render() {
    return `
      ${Navbar.render()}
      <style>
        .liked-section {
          padding-top: 80px;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        .section-heading-card {
          max-width: 800px;
          margin: 0 auto 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-heading-card h1 {
          color: #333;
          margin: 0;
          font-size: 1.8em;
        }
        #liked-list {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .story-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          overflow: hidden;
        }
        .story-link {
          text-decoration: none;
          color: inherit;
        }
        .story-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .story-body {
          padding: 20px;
        }
        .story-title {
          color: #333;
          margin: 0 0 10px;
          font-size: 1.5em;
        }
        .story-content {
          color: #666;
          margin: 10px 0;
          line-height: 1.6;
        }
        .story-author {
          color: #888;
          margin: 10px 0;
          font-size: 0.9em;
        }
        .story-date {
          color: #999;
          margin: 5px 0;
          font-size: 0.8em;
        }
        .delete-like-btn {
          width: 100%;
          padding: 12px;
          background: #ff4b6e;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1em;
          transition: background 0.3s;
        }
        .delete-like-btn:hover {
          background: #ff2d56;
        }
      </style>
      <main id="main-content">
        <section class="liked-section">
          <div class="section-heading-card">
            <h1>Daftar Liked Stories</h1>
          </div>
          <div id="liked-list" class="story-list-container"></div>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 2025 LiTera.id. Write Here</p>
      </footer>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
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
        await this.afterRender();
      });
    });
  }
};

export default Liked; 