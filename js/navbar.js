/**
 * Navbar — mobile menu toggle via .navbar-toggle buttons.
 *
 * Usage:
 *   <script src="js/navbar.js"></script>
 *
 *   <nav class="navbar">
 *     <button class="navbar-toggle" aria-expanded="false"
 *             aria-controls="main-nav" aria-label="Toggle menu">…</button>
 *     <ul class="navbar-nav" id="main-nav">…</ul>
 *   </nav>
 *
 * Overlay support (for drawer-style sidebars):
 *   <button class="navbar-toggle" aria-controls="sidebar"
 *           data-overlay="sidebar-overlay" …>…</button>
 *   <div class="navbar-overlay" id="sidebar-overlay"></div>
 *
 * - Click .navbar-toggle → toggles the controlled element via .is-open
 * - If data-overlay is set, the overlay is toggled in sync
 * - Click overlay → closes the controlled element
 * - Escape → closes all open toggles, navs, and overlays
 */
document.addEventListener("DOMContentLoaded", () => {
  function openToggle(toggle) {
    const targetId = toggle.getAttribute("aria-controls")
    const target = targetId ? document.getElementById(targetId) : null
    if (target) target.classList.add("is-open")
    toggle.setAttribute("aria-expanded", "true")

    const overlayId = toggle.dataset.overlay
    const overlay = overlayId ? document.getElementById(overlayId) : null
    if (overlay) overlay.classList.add("is-open")
  }

  function closeToggle(toggle) {
    const targetId = toggle.getAttribute("aria-controls")
    const target = targetId ? document.getElementById(targetId) : null
    if (target) target.classList.remove("is-open")
    toggle.setAttribute("aria-expanded", "false")

    const overlayId = toggle.dataset.overlay
    const overlay = overlayId ? document.getElementById(overlayId) : null
    if (overlay) overlay.classList.remove("is-open")
  }

  function closeAll() {
    document
      .querySelectorAll(".navbar-toggle[aria-expanded='true']")
      .forEach(closeToggle)
    if (typeof window.closeUserMenu === "function") {
      window.closeUserMenu()
    }
  }

  // Toggle on trigger click (event-delegated)
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".navbar-toggle")
    if (!toggle) return
    toggle.getAttribute("aria-expanded") === "true"
      ? closeToggle(toggle)
      : openToggle(toggle)
  })

  // Overlay click closes the associated toggle (event-delegated)
  document.addEventListener("click", (e) => {
    const overlay = e.target.closest(".navbar-overlay")
    if (!overlay) return
    document
      .querySelectorAll(
        `.navbar-toggle[data-overlay="${overlay.id}"][aria-expanded="true"]`
      )
      .forEach(closeToggle)
  })

  // Escape closes all open navs and overlays
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll()
  })
})
