import 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
import routes from './routes/routes.js';
import UrlParser from './routes/url-parser.js';
import '../styles/styles.css';
import { initializePushNotification } from './utils/push-notification.js';

const App = {
  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url] || routes['*'];

    // Pastikan page punya render method
    if (typeof page.render !== 'function') {
      console.error(`Page untuk url "${url}" tidak memiliki method render()`);
      return;
    }

    const html = await page.render();
    const appContainer = document.querySelector('#app');
    appContainer.innerHTML = html;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Cek apakah ada afterRender dan jalankan kalau ada
    if (typeof page.afterRender === 'function') {
      await page.afterRender();
    }
  }
};

window.addEventListener('hashchange', () => {
  document.startViewTransition(() => {
    App.renderPage();
  });
});

window.addEventListener('load', () => {
  App.renderPage();
});

// Minta izin notifikasi saat halaman pertama kali dimuat
if ('Notification' in window) {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Izin notifikasi diberikan!');
      } else if (permission === 'denied') {
        console.log('Izin notifikasi ditolak.');
      }
    });
  }
}
