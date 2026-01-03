if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js') // <-- gunakan '/' di depan
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.error('SW registration failed', err));
}