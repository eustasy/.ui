/**
 * Dialog — opens and closes native <dialog> elements.
 *
 * Usage:
 *   <script src="js/dialog.js"></script>
 *
 *   Open:  <button data-dialog-open="my-dialog-id">Open</button>
 *   Close: <button data-dialog-close>Cancel</button>
 *          or add class="dialog-close" to the close button
 *
 * Autofocus:
 *   Add the autofocus attribute to any element inside the dialog and it will
 *   receive focus when the dialog opens. Falls back to the first focusable
 *   element, then to the dialog itself.
 */
document.addEventListener("DOMContentLoaded", () => {
  const FOCUSABLE =
    "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), " +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function focusDialog(dialog) {
    // Prefer an explicit autofocus element, then first focusable, then dialog itself.
    const target =
      dialog.querySelector("[autofocus]") ||
      dialog.querySelector(FOCUSABLE) ||
      dialog
    target.focus()
  }

  // Open via data-dialog-open="<id>"
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-dialog-open]")
    if (opener) {
      const dialog = document.getElementById(opener.dataset.dialogOpen)
      if (dialog) {
        dialog.showModal()
        // Use a microtask so the dialog is visible before we move focus,
        // which is required for some screen readers to announce it correctly.
        Promise.resolve().then(() => focusDialog(dialog))
      }
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
