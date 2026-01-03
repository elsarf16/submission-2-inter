import Auth from '../utils/auth.js';

const Navbar = {
  render() {
    const loggedIn = Auth.isLoggedIn();
    const token = Auth.getToken();
    console.log('[Navbar] loggedIn:', loggedIn, '| token:', token);
    return `
      <header class="header">
        <nav class="navbar">
          <div class="logo">LiTera.id</div>
          <ul class="nav-menu">
            <li><a href="#/" id="home-link">Beranda</a></li>
            ${loggedIn ? `<li><a href="#/add" id="add-story-link">Tambah Cerita</a></li>` : ''}
            ${loggedIn ? `<li><a href="#/liked" id="liked-link">Liked Stories</a></li>` : ''}
            ${loggedIn ? `<li><button id="subscribe-btn" class="btn-outline" style="margin-left:8px;">Subscribe Notifikasi</button></li>` : ''}
          </ul>
          <div class="auth-buttons">
            ${
              loggedIn
                ? `<a href="#" id="logout-link" class="btn-filled">Keluar</a>`
                : `
                  <a href="#/register" class="btn-outline">Daftar</a>
                  <a href="#/login" class="btn-filled">Masuk</a>
                `
            }
          </div>
        </nav>
      </header>
    `;
  },

  async afterRender() {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout();
        alert("Berhasil logout.");
        window.location.hash = "/login";
        window.location.reload();
      });
    }

    // Subscribe/Unsubscribe logic
    const subscribeBtn = document.getElementById("subscribe-btn");
    if (subscribeBtn) {
      const { initializePushNotification, sendSubscriptionToServer, unsubscribePushNotification } = await import('../utils/push-notification.js');
      const token = Auth.getToken();
      let registration;
      if ('serviceWorker' in navigator) {
        registration = await navigator.serviceWorker.getRegistration();
      }
      let subscription = registration ? await registration.pushManager.getSubscription() : null;
      // Set button text based on subscription status
      subscribeBtn.textContent = subscription ? 'Unsubscribe Notifikasi' : 'Subscribe Notifikasi';

      subscribeBtn.onclick = async () => {
        if (!registration) {
          registration = await navigator.serviceWorker.getRegistration();
        }
        subscription = registration ? await registration.pushManager.getSubscription() : null;
        if (subscription) {
          // Unsubscribe
          const success = await unsubscribePushNotification(subscription, token);
          if (success) {
            subscribeBtn.textContent = 'Subscribe Notifikasi';
          }
        } else {
          // Subscribe
          const newSubscription = await initializePushNotification();
          if (newSubscription) {
            const success = await sendSubscriptionToServer(newSubscription, token);
            if (success) {
              subscribeBtn.textContent = 'Unsubscribe Notifikasi';
            }
          }
        }
      };
    }
  },
};

export default Navbar;