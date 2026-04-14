/**
 * Checkbox — select-all with indeterminate state
 *
 * Usage:
 *   Wrap the select-all checkbox and its controlled items in a common ancestor
 *   with [data-checkbox-group]. Mark the controlling checkbox with
 *   [data-select-all]. All other checkboxes inside the same ancestor are
 *   treated as the item set.
 *
 *   <div data-checkbox-group>
 *     <label class="checkbox">
 *       <input type="checkbox" data-select-all />
 *       <span class="checkbox-label">Select all</span>
 *     </label>
 *     <!-- child checkboxes anywhere inside the same [data-checkbox-group] -->
 *   </div>
 *
 * Multiple independent groups on the same page are supported.
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-checkbox-group]").forEach((group) => {
    const selectAll = group.querySelector("[data-select-all]")
    if (!selectAll) return

    const items = () =>
      [...group.querySelectorAll('input[type="checkbox"]')].filter(
        (cb) => cb !== selectAll
      )

    function sync() {
      const all = items()
      const checkedCount = all.filter((cb) => cb.checked).length
      selectAll.checked = checkedCount === all.length
      selectAll.indeterminate = checkedCount > 0 && checkedCount < all.length
    }

    sync()

    selectAll.addEventListener("change", () => {
      items().forEach((cb) => {
        cb.checked = selectAll.checked
      })
    })

    group.addEventListener("change", (e) => {
      if (e.target !== selectAll) sync()
    })
  })
})
