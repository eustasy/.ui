document.addEventListener("DOMContentLoaded", () => {
  // Prevent form submission in demos
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault())
  })

  // Dialog: open via data-dialog-open
  document.querySelectorAll("[data-dialog-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = document.getElementById(btn.dataset.dialogOpen)
      if (dialog) dialog.showModal()
    })
  })

  // Dialog: close via data-dialog-close
  document.querySelectorAll("[data-dialog-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog")
      if (dialog) dialog.close()
    })
  })
})
