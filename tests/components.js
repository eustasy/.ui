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

  // Textarea character count
  const bioTextarea = document.getElementById("ta-bio")
  const bioCount = document.getElementById("ta-bio-count")
  if (bioTextarea && bioCount) {
    bioTextarea.addEventListener("input", function () {
      bioCount.textContent = this.value.length + " / " + this.maxLength
    })
  }
})
