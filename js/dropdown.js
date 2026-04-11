/**
 * Dropdown — toggles .dropdown menus via aria-expanded.
 *
 * Usage:
 *   <script src="js/dropdown.js"></script>
 *
 *   <div class="dropdown">
 *     <button aria-haspopup="menu" aria-expanded="false" aria-controls="my-menu">
 *       Options
 *     </button>
 *     <ul class="dropdown-menu" id="my-menu" role="menu" hidden>…</ul>
 *   </div>
 *
 * - Click trigger → opens/closes its menu
 * - Click outside → closes all open menus
 * - Escape → closes all open menus, returns focus to trigger
 */
document.addEventListener("DOMContentLoaded", () => {
  function closeAll(except = null) {
    document
      .querySelectorAll(".dropdown [aria-haspopup]")
      .forEach((trigger) => {
        if (trigger === except) return
        const menuId = trigger.getAttribute("aria-controls")
        const menu = menuId ? document.getElementById(menuId) : null
        trigger.setAttribute("aria-expanded", "false")
        if (menu) menu.hidden = true
      })
  }

  // Toggle on trigger click
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".dropdown [aria-haspopup]")
    if (!trigger) {
      closeAll()
      return
    }
    e.stopPropagation()
    const menuId = trigger.getAttribute("aria-controls")
    const menu = menuId ? document.getElementById(menuId) : null
    const isOpen = trigger.getAttribute("aria-expanded") === "true"

    closeAll(trigger)

    if (!isOpen) {
      trigger.setAttribute("aria-expanded", "true")
      if (menu) menu.hidden = false
    } else {
      trigger.setAttribute("aria-expanded", "false")
      if (menu) menu.hidden = true
    }
  })

  // Escape closes all and returns focus to the active trigger
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return
    const openTrigger = document.querySelector(
      ".dropdown [aria-haspopup][aria-expanded='true']"
    )
    closeAll()
    if (openTrigger) openTrigger.focus()
  })
})
