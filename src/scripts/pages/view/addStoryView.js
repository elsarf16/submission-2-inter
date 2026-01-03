class AddStoryView {
  constructor() {
    this.map = null;
    this.marker = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.imageBlob = null;
  }

  getTemplate() {
    return `
      <section class="form-container">
        <h1>Tulis Cerita Baru</h1>
        <form id="story-form">
          <label for="title">Judul cerita:</label>
          <input id="title" placeholder="Judul cerita..." required />

          <label for="content">Isi cerita lengkap:</label>
          <textarea id="content" placeholder="Isi cerita lengkap..." required></textarea>

          <label>Ambil Foto dari Kamera:</label>
          <video id="camera" autoplay playsinline width="100%"></video>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <button type="button" id="capture-btn">📸 Ambil Foto</button>
            <button type="button" id="close-camera-btn">❌ Tutup Kamera</button>
          </div>
          <canvas id="photo-preview" style="display:none;"></canvas>

          <label for="upload-image">Atau Upload Gambar dari Komputer:</label>
          <input type="file" id="upload-image" accept="image/*" />
          <img id="preview-image" style="max-width: 100%; margin-top: 10px; alt="Gambar." />

          <label>Pilih Lokasi (klik di peta):</label>
          <div id="map" style="height: 300px;"></div>
          <p id="location-info">Lokasi belum dipilih.</p>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  render(container) {
    container.innerHTML = this.getTemplate();

    this.form = document.getElementById("story-form");
    this.title = document.getElementById("title");
    this.content = document.getElementById("content");
    this.video = document.getElementById("camera");
    this.canvas = document.getElementById("photo-preview");
    this.captureBtn = document.getElementById("capture-btn");
    this.closeCameraBtn = document.getElementById("close-camera-btn");
    this.fileInput = document.getElementById("upload-image");
    this.previewImage = document.getElementById("preview-image");

    // Jangan panggil initMap di sini, biar presenter yang kontrol
    // this.initMap();
  }

  initMap() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.error("Map container tidak ditemukan.");
      return;
    }

    this.map = L.map("map").setView([-6.2, 106.8], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.map.on("click", (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;

      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker([this.selectedLat, this.selectedLon]).addTo(
        this.map
      );

      document.getElementById(
        "location-info"
      ).textContent = `Lokasi dipilih: (${this.selectedLat.toFixed(
        5
      )}, ${this.selectedLon.toFixed(5)})`;
    });
  }

  getFormData() {
    return {
      title: this.title.value.trim(),
      content: this.content.value.trim(),
      lat: this.selectedLat,
      lon: this.selectedLon,
      imageBlob: this.imageBlob,
    };
  }

  showPreviewImage(blob) {
    const url = URL.createObjectURL(blob);
    this.previewImage.src = url;
    this.canvas.style.display = "none";
    this.imageBlob = blob;
  }

  navigateToStories() {
    window.location.hash = "/";
  }
}

export default AddStoryView;
