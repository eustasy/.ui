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
 * - Click .navbar-toggle → toggles the linked .navbar-nav via .is-open
 * - Escape → closes all open navs
 */
document.addEventListener("DOMContentLoaded", () => {
  // Toggle on trigger click (event-delegated)
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".navbar-toggle")
    if (!toggle) return
    const navId = toggle.getAttribute("aria-controls")
    const nav = navId ? document.getElementById(navId) : null
    if (!nav) return
    const open = nav.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", String(open))
  })

  // Escape closes all open navs
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return
    document
      .querySelectorAll(".navbar-toggle[aria-expanded='true']")
      .forEach((toggle) => {
        const navId = toggle.getAttribute("aria-controls")
        const nav = navId ? document.getElementById(navId) : null
        if (nav) nav.classList.remove("is-open")
        toggle.setAttribute("aria-expanded", "false")
      })
  })
})
