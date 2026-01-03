const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const checkNotificationSupport = () => {
  if (!("Notification" in window)) {
    console.log("Browser tidak mendukung notifikasi");
    return false;
  }
  return true;
};

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      console.log("Izin notifikasi ditolak");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saat meminta izin notifikasi:", error);
    return false;
  }
};

const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/sw.js"
    );
    console.log("Service Worker berhasil didaftarkan:", registration);
    return registration;
  } catch (error) {
    console.error("Error saat mendaftarkan Service Worker:", error);
    return null;
  }
};

const subscribePushNotification = async (registration) => {
  try {
    // Cek apakah sudah ada subscription aktif
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("Push Notification sudah terdaftar:", subscription);
      return subscription;
    }
    // Jika belum ada, baru subscribe
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    console.log("Push Notification berhasil didaftarkan:", subscription);
    return subscription;
  } catch (error) {
    console.error("Error saat mendaftarkan Push Notification:", error);
    return null;
  }
};

const initializePushNotification = async () => {
  if (!checkNotificationSupport()) return;

  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) return;

  const registration = await registerServiceWorker();
  if (!registration) return;

  const subscription = await subscribePushNotification(registration);
  if (!subscription) return;

  // Di sini Anda bisa mengirim subscription ke server Anda
  // untuk menyimpan endpoint push notification
  return subscription;
};

const sendSubscriptionToServer = async (subscription, token) => {
  if (!subscription || !token) return;

  const { endpoint, keys } = subscription.toJSON();
  try {
    const response = await fetch(
      "https://story-api.dicoding.dev/v1/notifications/subscribe",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
        }),
      }
    );
    const result = await response.json();
    if (!response.ok || result.error) {
      alert("Gagal subscribe notifikasi ke server.");
      await subscription.unsubscribe();
      return false;
    }
    alert("Berhasil subscribe notifikasi!");
    return true;
  } catch (err) {
    alert("Gagal subscribe notifikasi ke server.");
    console.error(err);
    return false;
  }
};

const unsubscribePushNotification = async (subscription, token) => {
  if (!subscription || !token) return;

  const { endpoint } = subscription.toJSON();
  try {
    const response = await fetch(
      "https://story-api.dicoding.dev/v1/notifications/subscribe",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      }
    );
    const result = await response.json();
    if (!response.ok || result.error) {
      alert("Gagal unsubscribe notifikasi ke server.");
      return false;
    }
    // Pastikan subscription dihapus di browser
    await subscription.unsubscribe();
    // Cek ulang dan hapus jika masih ada (edge case)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const currentSub = await registration.pushManager.getSubscription();
        if (currentSub) {
          await currentSub.unsubscribe();
        }
      }
    }
    alert("Berhasil unsubscribe notifikasi!");
    return true;
  } catch (err) {
    alert("Gagal unsubscribe notifikasi ke server.");
    console.error(err);
    return false;
  }
};

// Debug: log status subscription setiap load file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      registration.pushManager.getSubscription().then(sub => {
        console.log('[DEBUG] Status subscription saat load:', sub);
      });
    }
  });
}

export {
  initializePushNotification,
  checkNotificationSupport,
  requestNotificationPermission,
  sendSubscriptionToServer,
  unsubscribePushNotification,
};