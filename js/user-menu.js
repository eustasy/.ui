document.addEventListener("DOMContentLoaded", () => {
  const userTrigger = document.getElementById("user-menu-trigger")
  const userMenu = document.getElementById("user-menu")
  const userChevron = document.getElementById("user-menu-chevron")

  if (!userTrigger || !userMenu) return

  function openUserMenu() {
    userMenu.classList.add("is-open")
    userTrigger.setAttribute("aria-expanded", "true")
    if (userChevron) userChevron.style.transform = "rotate(180deg)"
  }

  function closeUserMenu() {
    userMenu.classList.remove("is-open")
    userTrigger.setAttribute("aria-expanded", "false")
    if (userChevron) userChevron.style.transform = ""
  }

  // Expose for external use (e.g. layout Escape key handlers)
  window.closeUserMenu = closeUserMenu

  userTrigger.addEventListener("click", (e) => {
    e.stopPropagation()
    userMenu.classList.contains("is-open") ? closeUserMenu() : openUserMenu()
  })

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && e.target !== userTrigger) {
      closeUserMenu()
    }
  })

  userMenu.addEventListener("click", () => closeUserMenu())
})
