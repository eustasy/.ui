document.addEventListener("DOMContentLoaded", () => {
  // Prevent form submission in demos
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault())
  })

  // Block bare # links so demos don't jump to top
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href="#"]')
    if (link) e.preventDefault()
  })
})
