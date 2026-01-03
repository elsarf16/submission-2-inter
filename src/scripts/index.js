import App from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  window.addEventListener("hashchange", async () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => app.renderPage());
    } else {
      app.renderPage();
    }
  });
});
