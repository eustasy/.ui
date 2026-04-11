document.addEventListener("DOMContentLoaded", () => {
  // Prevent form submission in demos
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault())
  })
})
