/**
 * Dialog — opens and closes native <dialog> elements.
 *
 * Usage:
 *   <script src="js/dialog.js"></script>
 *
 *   Open:  <button data-dialog-open="my-dialog-id">Open</button>
 *   Close: <button data-dialog-close>Cancel</button>
 *          or add class="dialog-close" to the close button
 */
document.addEventListener("DOMContentLoaded", () => {
  // Open via data-dialog-open="<id>"
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-dialog-open]")
    if (opener) {
      const dialog = document.getElementById(opener.dataset.dialogOpen)
      if (dialog) dialog.showModal()
    }
  })

  // Close via data-dialog-close or .dialog-close
  document.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-dialog-close], .dialog-close")
    if (closer) {
      const dialog = closer.closest("dialog")
      if (dialog) dialog.close()
    }
  })
})
