import Navbar from "../components/navbar.js";

const NotFound = {
  async render() {
    return `
      ${Navbar.render()}
      <style>
        .not-found {
          padding-top: 80px;
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .not-found-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 40px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .not-found h1 {
          font-size: 6em;
          color: #ff4b6e;
          margin: 0;
          line-height: 1;
        }
        .not-found h2 {
          font-size: 2em;
          color: #333;
          margin: 20px 0;
        }
        .not-found p {
          color: #666;
          margin: 20px 0;
          font-size: 1.1em;
          line-height: 1.6;
        }
        .back-home {
          display: inline-block;
          background: #ff4b6e;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 25px;
          margin-top: 20px;
          transition: background 0.3s, transform 0.2s;
        }
        .back-home:hover {
          background: #ff2d56;
          transform: translateY(-2px);
        }
      </style>
      <section class="not-found">
        <div class="not-found-container">
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.</p>
          <a href="#/" class="back-home">Kembali ke Beranda</a>
        </div>
      </section>
    `;
  },

  async afterRender() {
    Navbar.afterRender();
  }
};

export default NotFound; 