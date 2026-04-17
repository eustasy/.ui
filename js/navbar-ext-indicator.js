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
 * Paired navs: navs sharing the same data-nav-group="<name>" stay in sync —
 * selecting an item in one updates the matching item (by trimmed text) in
 * all others in the group.
 *
 * Progressive enhancement: if this script does not run the static CSS
 * ::before / ::after pseudo-elements remain visible as a fallback.
 */
;(function () {
  /** All initialised navs, keyed by element for quick lookup */
  const instances = new Map()

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

      // If the nav (or an ancestor) is hidden, defer until it becomes visible
      if (!link.offsetHeight) {
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

    /** Activate a link by reference (called by group sync) */
    function activate(link, instant) {
      const prev = activeLink()
      if (prev && prev !== link) {
        prev.removeAttribute("aria-current")
        prev.classList.remove("is-active")
      }
      link.setAttribute("aria-current", "page")
      place(link, instant)
    }

    /** Re-place the indicator for the current active link (e.g. after show) */
    function refresh(instant) {
      place(activeLink(), instant)
    }

    // Store instance for group sync and external refresh
    const instance = { nav, activate, refresh, activeLink }
    instances.set(nav, instance)

    // Initial placement without animation
    place(activeLink(), true)

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a")
      if (!link || !nav.contains(link)) return

      // Clear active state in sibling nav-indicator navs within the same navbar
      const navbar = nav.closest(
        ".navbar, .navbar-drawer, .sidebar, .layout-sidebar, .layout-stacked"
      )
      if (navbar) {
        navbar.querySelectorAll("[data-nav-indicator]").forEach((sibling) => {
          if (sibling === nav) return
          const siblingInst = instances.get(sibling)
          if (!siblingInst) return
          const siblingActive = siblingInst.activeLink()
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

      // Sync paired navs in the same group
      const group = nav.dataset.navGroup
      if (group) {
        const linkText = link.textContent.trim()
        document
          .querySelectorAll(`[data-nav-group="${group}"]`)
          .forEach((peer) => {
            if (peer === nav) return
            const peerInst = instances.get(peer)
            if (!peerInst) return
            const match = Array.from(peer.querySelectorAll("a")).find(
              (a) => a.textContent.trim() === linkText
            )
            if (match) {
              peerInst.activate(match, true)
            } else {
              // No matching item — clear peer
              const peerActive = peerInst.activeLink()
              if (peerActive) {
                peerActive.removeAttribute("aria-current")
                peerActive.classList.remove("is-active")
              }
              const peerIndicator = peer.querySelector(".nav-indicator")
              if (peerIndicator) peerIndicator.style.opacity = "0"
            }
          })
      }
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-nav-indicator]").forEach(initNavIndicator)

    // When a drawer or sidebar becomes visible, re-place indicators inside it.
    // The .is-open class is toggled by navbar.js — observe it via MutationObserver.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          m.attributeName === "class" &&
          m.target.classList.contains("is-open")
        ) {
          m.target.querySelectorAll("[data-nav-indicator]").forEach((nav) => {
            const inst = instances.get(nav)
            if (inst) inst.refresh(true)
          })
        }
      }
    })

    document
      .querySelectorAll(".navbar-drawer, .sidebar")
      .forEach((el) =>
        observer.observe(el, { attributes: true, attributeFilter: ["class"] })
      )
  })
})()
