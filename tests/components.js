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
})
