/**
 * Combobox — filterable listbox with full keyboard navigation.
 * Extends the standalone listbox by adding a search input and filtering.
 * Options use .listbox-option (from listbox.css / listbox.js).
 *
 * Usage:
 *   <script src="js/listbox-ext-combobox.js"></script>
 *
 *   <div class="combobox">
 *     <input type="text" role="combobox" aria-expanded="false"
 *            aria-haspopup="listbox" aria-controls="cb-list"
 *            aria-autocomplete="list" autocomplete="off" />
 *     <ul class="combobox-listbox" id="cb-list" role="listbox" hidden>
 *       <li class="listbox-option" role="option" aria-selected="false">Apple</li>
 *     </ul>
 *   </div>
 *
 * Group labels (.listbox-group-label) are shown/hidden automatically
 * based on whether any sibling options match the current query.
 */
document.addEventListener("DOMContentLoaded", () => {
  let uid = 0

  document.querySelectorAll(".combobox").forEach((combobox) => {
    const input = combobox.querySelector("[role='combobox']")
    if (!input) return

    const listId = input.getAttribute("aria-controls")
    const list = listId
      ? document.getElementById(listId)
      : combobox.querySelector("[role='listbox']")
    if (!list) return

    // Ensure each option has an id for aria-activedescendant
    list.querySelectorAll(".listbox-option").forEach((opt) => {
      if (!opt.id) opt.id = `combobox-opt-${++uid}`
      if (!opt.dataset.cbValue) opt.dataset.cbValue = opt.textContent.trim()
      // Build a searchable string from the primary value + any secondary text
      const meta = opt.querySelector(".listbox-option-meta")
      opt.dataset.cbSearch = meta
        ? `${opt.dataset.cbValue} ${meta.textContent.trim()}`
        : opt.dataset.cbValue
    })

    // Inject an empty-state element if not already present
    let emptyEl = list.querySelector(".combobox-empty")
    if (!emptyEl) {
      emptyEl = document.createElement("li")
      emptyEl.className = "combobox-empty"
      emptyEl.setAttribute("role", "presentation")
      emptyEl.textContent = "No results"
      list.appendChild(emptyEl)
    }

    function allOptions() {
      return [...list.querySelectorAll(".listbox-option")]
    }

    function visibleOptions() {
      return allOptions().filter((o) => !o.hidden)
    }

    function activeOption() {
      return list.querySelector(".listbox-option[data-active]")
    }

    function setActive(opt) {
      const prev = activeOption()
      if (prev) delete prev.dataset.active
      if (opt) {
        opt.dataset.active = ""
        input.setAttribute("aria-activedescendant", opt.id)
        opt.scrollIntoView({ block: "nearest" })
      } else {
        input.removeAttribute("aria-activedescendant")
      }
    }

    function open() {
      list.hidden = false
      input.setAttribute("aria-expanded", "true")
    }

    function close() {
      list.hidden = true
      input.setAttribute("aria-expanded", "false")
      setActive(null)
    }

    function select(opt) {
      allOptions().forEach((o) => o.setAttribute("aria-selected", "false"))
      opt.setAttribute("aria-selected", "true")
      input.value = opt.dataset.cbValue
      close()
    }

    function filter(query) {
      const q = query.trim().toLowerCase()
      let anyVisible = false

      allOptions().forEach((opt) => {
        const match = !q || opt.dataset.cbSearch.toLowerCase().includes(q)
        opt.hidden = !match
        if (match) anyVisible = true
      })

      // Show group labels only when they have at least one visible option
      list.querySelectorAll(".listbox-group-label").forEach((label) => {
        let sib = label.nextElementSibling
        let groupVisible = false
        while (sib && !sib.classList.contains("listbox-group-label")) {
          if (sib.classList.contains("listbox-option") && !sib.hidden) {
            groupVisible = true
            break
          }
          sib = sib.nextElementSibling
        }
        label.hidden = !groupVisible
      })

      emptyEl.hidden = anyVisible
    }

    // Input: filter + open
    input.addEventListener("input", () => {
      filter(input.value)
      open()
      setActive(null)
    })

    // Focus: open
    input.addEventListener("focus", () => {
      filter(input.value)
      open()
    })

    // Blur: close (mousedown on list prevents this when clicking options)
    input.addEventListener("blur", close)

    // Keyboard navigation
    input.addEventListener("keydown", (e) => {
      const visible = visibleOptions()
      const active = activeOption()
      const idx = active ? visible.indexOf(active) : -1

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          open()
          setActive(visible[Math.min(idx + 1, visible.length - 1)])
          break
        case "ArrowUp":
          e.preventDefault()
          setActive(idx > 0 ? visible[idx - 1] : null)
          break
        case "Enter":
          e.preventDefault()
          if (active) select(active)
          else close()
          break
        case "Escape":
          e.preventDefault()
          close()
          break
        case "Tab":
          if (active) select(active)
          close()
          break
      }
    })

    // Prevent input blur when clicking inside the listbox
    list.addEventListener("mousedown", (e) => {
      e.preventDefault()
    })

    // Click option to select
    list.addEventListener("click", (e) => {
      const opt = e.target.closest(".listbox-option")
      if (opt) select(opt)
    })

    // Initialise: closed, all options visible
    close()
    filter("")
  })
})
