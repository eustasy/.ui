/**
 * Theme toggle — persists user preference to localStorage.
 * Inline this script in <head> to prevent FOUC (flash of unstyled content).
 *
 * Usage:
 *   <script src="js/theme-toggle.js"></script>
 *   <button data-theme-toggle aria-label="Toggle dark mode">🌓</button>
 */
(function () {
  var STORAGE_KEY = "ui-theme";
  var root = document.documentElement;

  // Apply saved preference immediately (before paint)
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    root.classList.add("theme-" + saved);
  }

  // After DOM ready, wire up toggle buttons
  document.addEventListener("DOMContentLoaded", function () {
    var toggles = document.querySelectorAll("[data-theme-toggle]");

    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var isDark =
          root.classList.contains("theme-dark") ||
          (!root.classList.contains("theme-light") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

        root.classList.remove("theme-light", "theme-dark");

        if (isDark) {
          root.classList.add("theme-light");
          localStorage.setItem(STORAGE_KEY, "light");
        } else {
          root.classList.add("theme-dark");
          localStorage.setItem(STORAGE_KEY, "dark");
        }
      });
    });
  });
})();
