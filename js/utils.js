/**
 * ==========================================================================
 * LONTARA TECH — UTILITIES & HELPER FUNCTIONS
 * Lokasi: js/utils.js
 * Fungsi: Kumpulan fungsi bantuan global (Format data, Debounce, dll)
 * ==========================================================================
 */

const LontaraUtils = {
  /**
   * 1. DEBOUNCE FUNCTION
   * Mencegah suatu fungsi dieksekusi brutal berkali-kali dalam waktu singkat.
   * Sangat krusial untuk fitur pencarian agar browser tidak nge-lag saat user mengetik cepat.
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 2. FORMATTER KOORDINAT SPASIAL (GIS UTILITY)
   * Mengubah format Decimal Degrees (DD) menjadi Degrees Minutes Seconds (DMS).
   * Sangat berguna saat lo nampilin titik stasiun hujan atau lokasi DAS Tanralili di WebGIS.
   */
  formatKoordinat(lat, lng) {
    const toDMS = (coordinate, type) => {
      const absolute = Math.abs(coordinate);
      const degrees = Math.floor(absolute);
      const minutesNotTruncated = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesNotTruncated);
      const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

      let direction = "";
      if (type === "lat") direction = coordinate >= 0 ? "N" : "S";
      if (type === "lng") direction = coordinate >= 0 ? "E" : "W";

      return `${degrees}°${minutes}'${seconds}"${direction}`;
    };

    return `${toDMS(lat, "lat")}, ${toDMS(lng, "lng")}`;
  },

  /**
   * 3. FORMATTER TANGGAL LOKAL (INDONESIA)
   * Mengubah format tanggal mentah ("2026-03-14") menjadi estetik ("14 Maret 2026").
   * Cocok dipake buat nampilin tanggal rilis di halaman Publikasi atau Artikel.
   */
  formatTanggal(dateString) {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", options);
  },

  /**
   * 4. FORMATTER UKURAN FILE (DIGITAL ASSET UTILITY)
   * Mengubah angka bytes yang panjang jadi ukuran yang gampang dibaca (KB, MB, GB).
   * Wajib dipake di halaman Katalog Aset Digital pas lo mau jual/share data GeoJSON atau SHP.
   */
  formatUkuranFile(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },

  /**
   * 5. SAFE LOCAL STORAGE
   * Pembungkus (wrapper) biar pas nyimpen atau ngambil data dari browser nggak kena error JSON.
   * Dipake buat nyimpen preferensi user kayak Dark Mode atau history pencarian.
   */
  storage: {
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn("Lontara Storage Save Error:", e);
      }
    },
    get(key) {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn("Lontara Storage Read Error:", e);
        return null;
      }
    },
    remove(key) {
      window.localStorage.removeItem(key);
    },
  },
};

// Ekspos ke global window agar bisa dipanggil langsung dari modul JS mana aja
window.LontaraUtils = LontaraUtils;
