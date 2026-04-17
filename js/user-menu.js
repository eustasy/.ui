/**
 * User-menu — toggle popover menus inside .user-menu-wrap containers.
 *
 * Each .user-menu-wrap must contain:
 *   - a trigger: [aria-haspopup="menu"][aria-controls="<menu-id>"]
 *   - a menu:    .user-menu#<menu-id>
 *
 * Supports multiple independent instances on the same page.
 * Clicking a trigger toggles its menu; clicking outside or inside closes it.
 * Escape closes all open menus.
 */
document.addEventListener("DOMContentLoaded", () => {
  function getParts(el) {
    const wrap = el.closest(".user-menu-wrap")
    if (!wrap) return null
    const trigger = wrap.querySelector('[aria-haspopup="menu"]')
    const menu = wrap.querySelector(".user-menu")
    return trigger && menu ? { trigger, menu } : null
  }

  function openMenu(parts) {
    parts.menu.classList.add("is-open")
    parts.trigger.setAttribute("aria-expanded", "true")
  }

  function closeMenu(parts) {
    parts.menu.classList.remove("is-open")
    parts.trigger.setAttribute("aria-expanded", "false")
  }

  function closeAll() {
    document.querySelectorAll(".user-menu.is-open").forEach((menu) => {
      const parts = getParts(menu)
      if (parts) closeMenu(parts)
    })
  }

  // Expose for external use (e.g. navbar Escape handler)
  window.closeUserMenu = closeAll

  document.addEventListener("click", (e) => {
    // 1. Trigger click → toggle its menu
    const trigger = e.target.closest('[aria-haspopup="menu"][aria-controls]')
    if (trigger) {
      const parts = getParts(trigger)
      if (parts) {
        e.stopPropagation()
        parts.menu.classList.contains("is-open")
          ? closeMenu(parts)
          : openMenu(parts)
        return
      }
    }

    // 2. Click inside an open menu → close it (item selected)
    const menu = e.target.closest(".user-menu.is-open")
    if (menu) {
      const parts = getParts(menu)
      if (parts) closeMenu(parts)
      return
    }

    // 3. Click outside → close all
    closeAll()
  })
})
