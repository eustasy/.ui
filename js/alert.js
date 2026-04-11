/**
 * Alert dismiss — hides the parent .alert when .alert-dismiss is clicked.
 *
 * Usage:
 *   <script src="js/alert.js"></script>
 *   <!-- Inside your alert: -->
 *   <button class="alert-dismiss" aria-label="Dismiss">✕</button>
 */
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".alert-dismiss")) {
      const alert = e.target.closest(".alert")
      if (alert) alert.hidden = true
    }
  })
})
