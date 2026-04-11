document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("stacked-toggle")
  const nav = document.getElementById("stacked-nav")

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", String(open))
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav.classList.remove("is-open")
      toggle.setAttribute("aria-expanded", "false")
    }
  })
})
