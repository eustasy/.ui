/**
 * navbar-ext-indicator.js — Animated coloured tab that slides between nav items.
 *
 * Usage:
 *   Add  data-nav-indicator="vertical"   to vertical / sidebar-style <ul> navs.
 *   Add  data-nav-indicator="horizontal" to horizontal / stacked-style <ul> navs.
 *
 * The active link is denoted by [aria-current] or .is-active on a child <a>.
 * Clicking any <a> inside the marked nav updates the indicator.
 *
 * Progressive enhancement: if this script does not run the static CSS
 * ::before / ::after pseudo-elements remain visible as a fallback.
 */
;(function () {
  function initNavIndicator(nav) {
    const axis = nav.dataset.navIndicator // "vertical" | "horizontal"

    // Tell CSS the animated indicator is live — hides static ::before/::after
    nav.classList.add("has-nav-indicator")

    const indicator = document.createElement("span")
    indicator.className = "nav-indicator"
    indicator.setAttribute("aria-hidden", "true")
    nav.appendChild(indicator)

    function activeLink() {
      return nav.querySelector("a[aria-current], a.is-active")
    }

    function place(link, instant) {
      if (!link) {
        indicator.style.opacity = "0"
        return
      }

      indicator.style.opacity = "1"

      if (instant) {
        indicator.style.transition = "none"
      }

      if (axis === "vertical") {
        const pad = link.offsetHeight * 0.2
        indicator.style.transform = `translateY(${link.offsetTop + pad}px)`
        indicator.style.height = `${link.offsetHeight - pad * 2}px`
      } else {
        // Replicate inset-inline: var(--space-3) using the link's own inline padding
        const inset =
          parseFloat(getComputedStyle(link).paddingInlineStart) || 12
        indicator.style.transform = `translateX(${link.offsetLeft + inset}px)`
        indicator.style.width = `${link.offsetWidth - inset * 2}px`
      }

      if (instant) {
        indicator.getBoundingClientRect() // force reflow before re-enabling transitions
        indicator.style.transition = ""
      }
    }

    // Initial placement without animation
    place(activeLink(), true)

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a")
      if (!link || !nav.contains(link)) return

      // Clear active state in sibling nav-indicator navs within the same navbar
      const navbar = nav.closest(
        ".navbar, .sidebar, .layout-sidebar, .layout-stacked"
      )
      if (navbar) {
        navbar.querySelectorAll("[data-nav-indicator]").forEach((sibling) => {
          if (sibling === nav) return
          const siblingActive = sibling.querySelector(
            "a[aria-current], a.is-active"
          )
          if (siblingActive) {
            siblingActive.removeAttribute("aria-current")
            siblingActive.classList.remove("is-active")
          }
          const siblingIndicator = sibling.querySelector(".nav-indicator")
          if (siblingIndicator) siblingIndicator.style.opacity = "0"
        })
      }

      const prev = activeLink()
      if (prev && prev !== link) {
        prev.removeAttribute("aria-current")
        prev.classList.remove("is-active")
      }
      link.setAttribute("aria-current", "page")
      place(link, false)
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-nav-indicator]").forEach(initNavIndicator)
  })
})()
