/**
 * ==========================================================================
 * LONTARA TECH — MAIN UI ENGINE
 * Lokasi: js/main.js
 * Fungsi: Mengatur interaksi global (Tema, Header, Menu Mobile, Nav Aktif)
 * ==========================================================================
 */

const LontaraUI = {
  init() {
    console.log("Lontara Main UI Engine: Active");

    // Cache DOM Elements
    this.header = document.getElementById("master-header");
    this.themeBtn = document.getElementById("theme-toggle");
    this.navToggle = document.getElementById("mobile-toggle");
    this.navMenu = document.getElementById("main-nav");
    this.navOverlay = document.getElementById("nav-overlay");

    // Initialize Features
    this.initTheme();
    this.initHeaderScroll();
    this.initMobileMenu();
  },

  // --- 1. THEME ENGINE (Dark Mode Persistence) ---
  initTheme() {
    if (!this.themeBtn) return;

    // Baca preferensi sebelumnya dari Local Storage
    const savedTheme = localStorage.getItem("lontara_theme") || "light";

    // Aplikasikan tema awal
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
    this.updateThemeIcon(savedTheme);

    // Event Listener untuk Tombol Toggle
    this.themeBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-theme");
      const newTheme = isDark ? "dark" : "light";

      // Simpan pilihan user
      localStorage.setItem("lontara_theme", newTheme);
      this.updateThemeIcon(newTheme);
    });
  },

  // Ganti ikon bulan/matahari dan LOGO sesuai tema
  updateThemeIcon(theme) {
    const icon = this.themeBtn.querySelector("i");
    const mainLogo = document.getElementById("main-logo"); // <-- Tangkap elemen logonya

    if (icon) {
      if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
        if (mainLogo) mainLogo.src = "aset/logo/logo-putih.png"; // Logo putih untuk mode gelap
      } else {
        icon.className = "fa-solid fa-moon";
        if (mainLogo) mainLogo.src = "aset/logo/logo-hitam.png"; // Logo hitam untuk mode terang
      }
    }
  },

  // --- 2. HEADER INTERACTION (Shrink on Scroll) ---
  initHeaderScroll() {
    if (!this.header) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 50) {
          this.header.classList.add("shrink");
        } else {
          this.header.classList.remove("shrink");
        }
      },
      { passive: true },
    ); // passive: true untuk performa scroll lebih mulus
  },

  // --- 3. MOBILE MENU LOGIC ---
  initMobileMenu() {
    if (!this.navToggle || !this.navMenu || !this.navOverlay) return;

    const toggleMenu = () => {
      this.navToggle.classList.toggle("active");
      this.navMenu.classList.toggle("active");
      this.navOverlay.classList.toggle("active");

      // Matikan scroll pada body saat menu terbuka
      if (this.navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    // Buka/Tutup lewat tombol hamburger dan overlay
    this.navToggle.addEventListener("click", toggleMenu);
    this.navOverlay.addEventListener("click", toggleMenu);

    // Tutup menu otomatis jika user mengklik salah satu link (Sangat penting untuk SPA)
    this.navMenu.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link-ajax") || e.target.closest(".nav-cta")) {
        if (this.navMenu.classList.contains("active")) {
          toggleMenu();
        }
      }
    });
  },

  // --- 4. NAVIGATION MAPPING (Highlighter Menu Aktif) ---
  // Fungsi ini DIBUKA KE GLOBAL agar bisa dipanggil oleh app-shell.js setiap pindah halaman
  updateActiveLinks(currentPath) {
    const links = document.querySelectorAll(".nav-links .nav-link-ajax");

    links.forEach((link) => {
      // Hapus status aktif dari semua menu
      link.classList.remove("active");

      const href = link.getAttribute("href");

      // Cocokkan path konten yang sedang dimuat dengan href di navbar
      // Misal: buka folder "sumber-konten/layanan/monitoring.html" akan menyalakan menu "layanan"
      if (currentPath.includes(href.split("/")[1])) {
        link.classList.add("active");
      }
    });

    // Default: Jika di root atau path beranda
    if (
      currentPath.includes("beranda") ||
      currentPath === "" ||
      currentPath === "/"
    ) {
      const berandaLink = document.querySelector(
        '.nav-links a[href*="beranda"]',
      );
      if (berandaLink) berandaLink.classList.add("active");
    }
  },
};

// Ekspos ke object window agar bisa diakses file JS lain
window.LontaraUI = LontaraUI;

// Jalankan sistem saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  LontaraUI.init();
});
