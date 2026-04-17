/**
 * Listbox — keyboard navigation, selection, and dropdown behaviour.
 *
 * Inline mode (default):
 *   Targets .listbox[role="listbox"] elements. The list is always visible.
 *
 * Dropdown mode:
 *   Targets .listbox-dropdown wrappers. A trigger button opens/closes a
 *   .listbox-popup list. Click-outside and Escape close the popup.
 *   On single-select, choosing an option closes the popup and updates
 *   the trigger text.
 *
 * Single-select:
 *   Arrow keys / Home / End → move and immediately select
 *   Click → select
 *
 * Multi-select (aria-multiselectable="true"):
 *   Arrow keys / Home / End → move active without selecting
 *   Space / Enter → toggle active option
 *   Shift+Arrow / Shift+Space → range select from anchor
 *   Click → toggle; Shift+Click → range select from last clicked
 *
 * Live region: if aria-describedby points to an [aria-live] element,
 * selection changes are announced (multi-select only).
 */
document.addEventListener("DOMContentLoaded", () => {
  let uid = 0

  /* ------------------------------------------------------------------ */
  /*  Shared listbox behaviour — works for inline and popup listboxes   */
  /* ------------------------------------------------------------------ */

  function initListbox(listbox, { onSelect } = {}) {
    const isMulti = listbox.getAttribute("aria-multiselectable") === "true"

    function allOpts() {
      return [...listbox.querySelectorAll("[role='option']")]
    }

    function enabledOpts() {
      return allOpts().filter((o) => o.getAttribute("aria-disabled") !== "true")
    }

    // Ensure all options have ids for aria-activedescendant
    allOpts().forEach((opt) => {
      if (!opt.id) opt.id = `listbox-opt-${++uid}`
    })

    function setActive(opt) {
      allOpts().forEach((o) => delete o.dataset.active)
      if (opt) {
        opt.dataset.active = ""
        listbox.setAttribute("aria-activedescendant", opt.id)
        opt.scrollIntoView({ block: "nearest" })
      } else {
        listbox.removeAttribute("aria-activedescendant")
      }
    }

    function selectSingle(opt) {
      allOpts().forEach((o) => o.setAttribute("aria-selected", "false"))
      opt.setAttribute("aria-selected", "true")
      if (onSelect) onSelect(opt)
    }

    function toggleSelect(opt) {
      const was = opt.getAttribute("aria-selected") === "true"
      opt.setAttribute("aria-selected", String(!was))
    }

    function rangeSelect(anchor, target) {
      const opts = allOpts()
      const a = opts.indexOf(anchor)
      const b = opts.indexOf(target)
      const [lo, hi] = a < b ? [a, b] : [b, a]
      opts.forEach((o, i) => {
        if (i >= lo && i <= hi && o.getAttribute("aria-disabled") !== "true") {
          o.setAttribute("aria-selected", "true")
        }
      })
    }

    function announce() {
      const ref = listbox.getAttribute("aria-describedby")
      if (!ref) return
      const el = document.getElementById(ref)
      if (!el || !el.hasAttribute("aria-live")) return
      const selected = allOpts().filter(
        (o) => o.getAttribute("aria-selected") === "true"
      )
      const count = selected.length
      el.textContent =
        count === 0
          ? "None selected"
          : `${count} selected: ${selected.map((o) => o.textContent.trim()).join(", ")}`
    }

    let anchor = null

    listbox.addEventListener("click", (e) => {
      const opt = e.target.closest("[role='option']")
      if (!opt || opt.getAttribute("aria-disabled") === "true") return

      setActive(opt)

      if (isMulti) {
        if (e.shiftKey && anchor) {
          rangeSelect(anchor, opt)
        } else {
          toggleSelect(opt)
          anchor = opt
        }
        announce()
      } else {
        selectSingle(opt)
      }
    })

    listbox.addEventListener("keydown", (e) => {
      const enabled = enabledOpts()
      if (!enabled.length) return

      const active = listbox.querySelector("[data-active]")
      const idx = active ? enabled.indexOf(active) : -1
      const clamp = (i) => Math.max(0, Math.min(i, enabled.length - 1))

      let next = null

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          next = enabled[clamp(idx + 1)]
          break
        case "ArrowUp":
          e.preventDefault()
          next = enabled[clamp(idx - 1)]
          break
        case "Home":
          e.preventDefault()
          next = enabled[0]
          break
        case "End":
          e.preventDefault()
          next = enabled[enabled.length - 1]
          break
        case " ":
        case "Enter":
          e.preventDefault()
          if (active && isMulti) {
            if (e.shiftKey && anchor) {
              rangeSelect(anchor, active)
            } else {
              toggleSelect(active)
              anchor = active
            }
            announce()
          } else if (active && !isMulti) {
            selectSingle(active)
          }
          return
        default:
          return
      }

      if (!next) return
      setActive(next)

      if (!isMulti) {
        selectSingle(next)
      } else if (e.shiftKey && anchor) {
        rangeSelect(anchor, next)
        announce()
      }
    })

    // Init: activate first selected option (or first enabled option)
    const initSelected = listbox.querySelector(
      "[role='option'][aria-selected='true']"
    )
    const initOpt = initSelected || enabledOpts()[0]
    if (initOpt) {
      setActive(initOpt)
      anchor = initOpt
    }

    if (isMulti) announce()
  }

  /* ------------------------------------------------------------------ */
  /*  Inline listboxes — always-visible, no wrapper                     */
  /* ------------------------------------------------------------------ */

  document
    .querySelectorAll(".listbox[role='listbox']:not(.listbox-popup)")
    .forEach((listbox) => {
      initListbox(listbox)
    })

  /* ------------------------------------------------------------------ */
  /*  Dropdown listboxes — .listbox-dropdown wrapper                    */
  /* ------------------------------------------------------------------ */

  function closeAllDropdowns(except) {
    document.querySelectorAll(".listbox-dropdown").forEach((wrapper) => {
      if (wrapper === except) return
      const trigger = wrapper.querySelector(".listbox-trigger")
      const popup = wrapper.querySelector(".listbox-popup")
      if (trigger) trigger.setAttribute("aria-expanded", "false")
      if (popup) popup.hidden = true
    })
  }

  document.querySelectorAll(".listbox-dropdown").forEach((wrapper) => {
    const trigger = wrapper.querySelector(".listbox-trigger")
    const popup = wrapper.querySelector(".listbox-popup")
    if (!trigger || !popup) return

    function open() {
      closeAllDropdowns(wrapper)
      trigger.setAttribute("aria-expanded", "true")
      popup.hidden = false
      popup.focus()
    }

    function close() {
      trigger.setAttribute("aria-expanded", "false")
      popup.hidden = true
    }

    function isOpen() {
      return trigger.getAttribute("aria-expanded") === "true"
    }

    function updateTriggerText(opt) {
      // Use .listbox-option-label text if available, otherwise full text
      const label = opt.querySelector(".listbox-option-label")
      trigger.textContent = label
        ? label.textContent.trim()
        : opt.textContent.trim()
    }

    // Set initial trigger text from the selected option
    const selected = popup.querySelector(
      "[role='option'][aria-selected='true']"
    )
    if (selected) updateTriggerText(selected)

    // Init listbox behaviour with an onSelect callback
    initListbox(popup, {
      onSelect(opt) {
        updateTriggerText(opt)
        close()
        trigger.focus()
      },
    })

    // Trigger click toggles the popup
    trigger.addEventListener("click", (e) => {
      e.stopPropagation()
      if (isOpen()) {
        close()
      } else {
        open()
      }
    })

    // Keyboard on trigger
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        if (!isOpen()) open()
      }
    })

    // Escape inside popup
    popup.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        trigger.focus()
      }
    })

    // Prevent blur when clicking inside the popup
    popup.addEventListener("mousedown", (e) => {
      e.preventDefault()
    })
  })

  // Click outside closes all dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".listbox-dropdown")) {
      closeAllDropdowns()
    }
  })
})
