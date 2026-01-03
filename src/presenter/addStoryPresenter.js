import API from "../scripts/data/api.js";
import { initializePushNotification } from "../scripts/utils/push-notification.js";

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.cameraStream = null;
  }

  async init() {
    this.view.initMap();
    await this.initCamera();
    this.initEvents();
  }

  async initCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.view.video.srcObject = this.cameraStream;
    } catch (err) {
      alert("Gagal mengakses kamera.");
      console.error(err);
    }
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
      this.view.video.srcObject = null;
      this.view.video.style.display = "none";
    }
  }

  initEvents() {
    this.view.captureBtn.addEventListener("click", () => {
      const ctx = this.view.canvas.getContext("2d");
      this.view.canvas.width = this.view.video.videoWidth;
      this.view.canvas.height = this.view.video.videoHeight;
      ctx.drawImage(this.view.video, 0, 0);
      this.view.canvas.style.display = "block";

      this.view.canvas.toBlob((blob) => {
        if (blob) this.view.showPreviewImage(blob);
      }, "image/jpeg");
    });

    this.view.closeCameraBtn.addEventListener("click", () => {
      this.stopCamera();
    });

    this.view.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        // Stop kamera ketika user upload gambar dari komputer
        this.stopCamera();
        
        const reader = new FileReader();
        reader.onload = (event) => {
          this.view.previewImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
        this.view.imageBlob = file;
        this.view.canvas.style.display = "none";
      }
    });

    this.view.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { title, content, lat, lon } = this.view.getFormData();
      const image = this.view.imageBlob;

      if (!title || !content || !image) {
        alert("Mohon lengkapi semua data.");
        return;
      }

      const description = `# ${title}\n\n${content}`;

      try {
        await API.addStory(description, image, lat, lon);
        alert("Cerita berhasil dikirim!");

        // Hapus auto subscribe saat post story
        // (tidak ada lagi pemanggilan initializePushNotification di sini)

        if (Notification.permission === "granted") {
          new Notification("LiTera.id", {
            body: "Cerita baru berhasil ditambahkan!",
            icon: "/assets/img/home1.png", // ganti path icon jika perlu
          });
        }
        
        this.view.navigateToStories(); // ⬅️ SPA-style navigasi
      } catch (err) {
        alert("Gagal mengirim cerita.");
        console.error(err);
      }
    });
  }

  destroy() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
    }
  }
}

export default AddStoryPresenter;
