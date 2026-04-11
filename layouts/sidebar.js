document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")

  function openSidebar() {
    sidebar.classList.add("is-open")
    overlay.classList.add("is-open")
    toggle.setAttribute("aria-expanded", "true")
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open")
    overlay.classList.remove("is-open")
    toggle.setAttribute("aria-expanded", "false")
  }

  toggle.addEventListener("click", () => {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar()
  })

  overlay.addEventListener("click", closeSidebar)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar()
      if (typeof window.closeUserMenu === "function") {
        window.closeUserMenu()
      }
    }
  })
})
