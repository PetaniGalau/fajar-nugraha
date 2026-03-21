/**
 * ==========================================================================
 * LONTARA TECH — SPA ROUTING ENGINE (APP SHELL)
 * Lokasi: js/app-shell.js
 * Fungsi: Mengambil konten HTML tanpa reload (Seamless Navigation)
 * ==========================================================================
 */

const AppShell = {
  init() {
    console.log("Lontara SPA Engine: Memulai Inisialisasi...");

    // Ambil elemen utama
    this.contentArea = document.getElementById("render-konten");
    this.progressBar = document.getElementById("progress-bar");

    // 1. Intersep semua klik pada link yang punya class .nav-link-ajax
    document.body.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-link-ajax");

      if (link) {
        e.preventDefault(); // Cegah browser melakukan reload halaman
        const url = link.getAttribute("href");

        // Ubah rute URL di browser
        this.navigateTo(url);
      }
    });

    // 2. Pantau tombol Back/Forward di browser (Hash Change)
    window.addEventListener("hashchange", () => {
      this.loadContentFromHash();
    });

    // 3. Eksekusi pertama kali web dibuka (Cek apakah ada hash atau langsung ke beranda)
    this.loadContentFromHash();
  },

  // --- FUNGSI NAVIGASI ---
  navigateTo(url) {
    // Mengubah URL menjadi bentuk hash (Contoh: index.html#sumber-konten/layanan/layanan.html)
    // Ini akan otomatis memicu event 'hashchange' di atas
    window.location.hash = url;
  },

  // --- FUNGSI PEMBACA RUTE ---
  async loadContentFromHash() {
    // Ambil path dari URL browser dan hilangkan tanda '#'
    let targetUrl = window.location.hash.substring(1);

    // Jika URL kosong (halaman awal index.html ditarik), paksa ke beranda
    if (!targetUrl || targetUrl === "" || targetUrl === "/") {
      targetUrl = "sumber-konten/beranda.html";
    }

    // ==========================================
    // PROTEKSI BARU (ANTI-ERROR SCROLL)
    // Jika targetUrl TIDAK mengandung tanda garis miring '/'
    // ATAU '.html', berarti ini cuma ID untuk scroll (seperti #features).
    // Jadi, hentikan fungsi agar tidak memuat halaman error.
    // ==========================================
    if (
      !targetUrl.includes("/") &&
      !targetUrl.includes(".html") &&
      targetUrl !== "sumber-konten/beranda.html"
    ) {
      return;
    }

    this.fetchAndRender(targetUrl);
  },

  // --- MESIN FETCH (PENGAMBIL DATA HTML) ---
  async fetchAndRender(url) {
    // A. Animasi Loading Mulai
    if (this.progressBar) {
      this.progressBar.style.opacity = "1";
      this.progressBar.style.width = "30%";
    }

    try {
      // B. Minta file HTML dari server/folder
      const response = await fetch(url);

      // Progress indikator berjalan
      if (this.progressBar) this.progressBar.style.width = "60%";

      // C. Cek apakah file ditemukan
      if (!response.ok) {
        throw new Error(`File tidak ditemukan: ${response.status}`);
      }

      // D. Ekstrak teks HTML dari file
      const htmlContent = await response.text();

      // Progress indikator hampir selesai
      if (this.progressBar) this.progressBar.style.width = "90%";

      // E. Suntikkan HTML ke dalam <main id="render-konten">
      this.contentArea.innerHTML = htmlContent;

      // F. Jalankan pembaruan UI setelah konten terpasang
      this.onContentLoaded(url);
    } catch (error) {
      console.error("Lontara SPA Error:", error);

      // G. Fallback UI Jika File Tidak Ditemukan (Mirip Halaman 404)
      this.contentArea.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 2rem;">
                    <i class="fa-solid fa-satellite-dish" style="font-size: 5rem; color: var(--accent); margin-bottom: 1.5rem;"></i>
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-main);">Radar Spasial Kehilangan Sinyal</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem; max-width: 500px;">
                        Modul atau halaman yang Anda cari tidak ditemukan dalam direktori Lontara. Pastikan struktur folder sudah sesuai.
                    </p>
                    <button onclick="window.location.hash='sumber-konten/beranda.html'" class="btn-primary">
                        Kembali ke Pusat Komando
                    </button>
                </div>
            `;
    } finally {
      // H. Selesai Loading, Sembunyikan Progress Bar
      if (this.progressBar) {
        this.progressBar.style.width = "100%";

        setTimeout(() => {
          this.progressBar.style.opacity = "0";
          setTimeout(() => {
            this.progressBar.style.width = "0%";
          }, 300); // Reset lebar bar setelah benar-benar hilang
        }, 500); // Tahan sebentar di 100% agar user melihatnya selesai
      }
    }
  },

  // --- FUNGSI PEMBARUAN SETELAH RENDER ---
  onContentLoaded(url) {
    // 1. Scroll Instan ke Atas (Penting agar user tidak nyangkut di bawah)
    window.scrollTo({ top: 0, behavior: "instant" });

    // 2. Update Highlighter Menu Navbar agar sesuai dengan halaman yang sedang dibuka
    if (
      window.LontaraUI &&
      typeof window.LontaraUI.updateActiveLinks === "function"
    ) {
      window.LontaraUI.updateActiveLinks(url);
    }

    // 3. Re-Inisialisasi Animasi (Scroll Reveal & Ripple Effect) untuk elemen HTML yang baru disuntikkan
    if (typeof window.reinitAnimations === "function") {
      window.reinitAnimations();
    }
  },
};

// Start the Engine!
document.addEventListener("DOMContentLoaded", () => {
  AppShell.init();
});
