document.addEventListener("DOMContentLoaded", () => {
  // Prevent form submission in demos
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault())
  })

  // Navbar toggle
  const navbarToggle = document.querySelector('[aria-controls="nav-demo"]')
  if (navbarToggle) {
    navbarToggle.addEventListener("click", function () {
      const nav = document.getElementById("nav-demo")
      const open = nav.classList.toggle("is-open")
      this.setAttribute("aria-expanded", open)
    })
  }

  // Alert dismiss
  document.querySelectorAll(".alert-dismiss").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.parentElement.hidden = true
    })
  })

  // Dialog: open via data-dialog-open
  document.querySelectorAll("[data-dialog-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = document.getElementById(btn.dataset.dialogOpen)
      if (dialog) dialog.showModal()
    })
  })

  // Dialog: close via .dialog-close buttons
  document.querySelectorAll(".dialog-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog")
      if (dialog) dialog.close()
    })
  })

  // Dialog: close via data-dialog-close buttons
  document.querySelectorAll("[data-dialog-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog")
      if (dialog) dialog.close()
    })
  })

  // Dropdown toggles
  document.querySelectorAll("[aria-controls='dd-menu'], [aria-controls='dd-menu-end']").forEach((btn) => {
    btn.addEventListener("click", function () {
      const menu = document.getElementById(this.getAttribute("aria-controls"))
      const open = menu.hidden
      menu.hidden = !open
      this.setAttribute("aria-expanded", open)
    })
  })

  // Textarea character count
  const bioTextarea = document.getElementById("ta-bio")
  const bioCount = document.getElementById("ta-bio-count")
  if (bioTextarea && bioCount) {
    bioTextarea.addEventListener("input", function () {
      bioCount.textContent = this.value.length + " / " + this.maxLength
    })
  }
})
