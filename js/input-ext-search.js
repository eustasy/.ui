/**
 * Input extension — Search
 *
 * Expands `.input-search` on focus and collapses it on blur when empty.
 * Keyboard shortcut: press "/" when focus is not inside a text entry element
 * to jump to the first `.input-search-field` on the page.
 *
 * Usage:
 *   <script src="js/input-ext-search.js"></script>
 *
 *   <div class="input-search">
 *     <span class="input-search-icon" aria-hidden="true"><!-- SVG --></span>
 *     <input class="input-search-field" type="search" aria-label="Search" />
 *     <kbd class="input-search-shortcut" aria-hidden="true">/</kbd>
 *   </div>
 */
document.addEventListener("DOMContentLoaded", () => {
  const TEXT_ENTRY = new Set(["INPUT", "TEXTAREA", "SELECT"])

  document.querySelectorAll(".input-search").forEach((wrapper) => {
    const field = wrapper.querySelector(".input-search-field")
    if (!field) return

    field.addEventListener("focus", () => {
      wrapper.classList.add("is-open")
    })

    field.addEventListener("blur", () => {
      if (!field.value.trim()) {
        wrapper.classList.remove("is-open")
      }
    })
  })

  // "/" shortcut — focus the first search field when not already typing
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
    const active = document.activeElement
    if (TEXT_ENTRY.has(active.tagName) || active.isContentEditable) return

    const field = document.querySelector(".input-search-field")
    if (!field) return

    e.preventDefault()
    field.focus()
  })
})
