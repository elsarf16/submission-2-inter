if (
  'serviceWorker' in navigator &&
  location.protocol === 'https:' &&
  location.hostname !== 'localhost'
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered (production):', reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('New Service Worker activated');
            }
          });
        });
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}
