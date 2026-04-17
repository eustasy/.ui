document.addEventListener("DOMContentLoaded", () => {
  // Prevent form submission in demos
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault())
  })

  // Navbar toggles — event-delegated for all .navbar-toggle buttons
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".navbar-toggle")
    if (!toggle) return
    const navId = toggle.getAttribute("aria-controls")
    const nav = navId ? document.getElementById(navId) : null
    if (!nav) return
    const open = nav.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", String(open))
  })
})
