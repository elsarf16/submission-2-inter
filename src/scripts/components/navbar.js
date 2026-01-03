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
            ${loggedIn ? `<li><button id="subscribe-btn" class="nav-subscribe-btn">Subscribe Notifikasi</button></li>` : ''}
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
      
      // Function to update button text based on subscription status
      const updateButtonText = async () => {
        if (!('serviceWorker' in navigator)) {
          subscribeBtn.textContent = 'Subscribe Notifikasi (Tidak Didukung)';
          subscribeBtn.disabled = true;
          return;
        }
        
        try {
          let registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            // Try to register service worker if not registered
            registration = await navigator.serviceWorker.register('/sw.js');
          }
          
          if (registration) {
            const subscription = await registration.pushManager.getSubscription();
            subscribeBtn.textContent = subscription ? 'Unsubscribe Notifikasi' : 'Subscribe Notifikasi';
            subscribeBtn.disabled = false;
          } else {
            subscribeBtn.textContent = 'Subscribe Notifikasi';
            subscribeBtn.disabled = false;
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
          subscribeBtn.textContent = 'Subscribe Notifikasi';
          subscribeBtn.disabled = false;
        }
      };

      // Update button text on load
      await updateButtonText();

      subscribeBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!('serviceWorker' in navigator)) {
          alert('Browser Anda tidak mendukung push notification.');
          return;
        }

        if (!token) {
          alert('Anda harus login terlebih dahulu.');
          return;
        }

        try {
          // Ensure service worker is registered
          let registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            console.log('Service worker belum terdaftar, mendaftarkan...');
            registration = await navigator.serviceWorker.register('/sw.js');
            
            // Wait for service worker to be ready
            if (registration.installing) {
              await new Promise((resolve) => {
                registration.installing.addEventListener('statechange', function() {
                  if (this.state === 'activated') {
                    resolve();
                  }
                });
              });
            } else if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              await new Promise(resolve => setTimeout(resolve, 200));
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (!registration || !registration.pushManager) {
            alert('Gagal mendaftarkan service worker atau push manager tidak tersedia.');
            return;
          }

          // Check current subscription status
          let subscription = await registration.pushManager.getSubscription();
          
          if (subscription) {
            // Unsubscribe
            subscribeBtn.disabled = true;
            subscribeBtn.textContent = 'Memproses...';
            const success = await unsubscribePushNotification(subscription, token);
            if (success) {
              await updateButtonText();
            } else {
              subscribeBtn.disabled = false;
              await updateButtonText();
            }
          } else {
            // Subscribe
            subscribeBtn.disabled = true;
            subscribeBtn.textContent = 'Memproses...';
            const newSubscription = await initializePushNotification();
            if (newSubscription) {
              const success = await sendSubscriptionToServer(newSubscription, token);
              if (success) {
                await updateButtonText();
              } else {
                subscribeBtn.disabled = false;
                await updateButtonText();
              }
            } else {
              subscribeBtn.disabled = false;
              await updateButtonText();
            }
          }
        } catch (error) {
          console.error('Error in subscribe/unsubscribe:', error);
          alert('Terjadi kesalahan: ' + (error.message || 'Unknown error'));
          subscribeBtn.disabled = false;
          await updateButtonText();
        }
      };
    }
  },
};

export default Navbar;