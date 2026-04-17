/**
 * contents-ext-bookmark.js — Scroll-spy and section collapse for .contents nav.
 *
 * Usage:
 *   <script src="js/contents-ext-bookmark.js"></script>
 *
 *   <div class="contents-layout">
 *     <nav class="contents" aria-label="Table of contents" data-contents>
 *       <p class="contents-title">Contents</p>
 *       <ol class="contents-list">
 *         <li class="contents-item">
 *           <a class="contents-link" href="#section-id">Section</a>
 *         </li>
 *       </ol>
 *     </nav>
 *     <main>…sections with id'd headings…</main>
 *   </div>
 *
 * Features:
 *   - Auto-discovers h3 elements within each section and injects sub-links
 *   - Generates IDs for h3 elements that lack them
 *   - Highlights the current section link with .is-active (scroll-spy)
 *   - Collapses h3 sub-lists for sections you are not currently viewing
 */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("[data-contents]")
  if (!nav) return

  const list = nav.querySelector(".contents-list")
  if (!list) return

  // --- Phase 1: Inject h3 sub-items into the TOC ---

  const topItems = [...list.querySelectorAll(":scope > .contents-item")]

  topItems.forEach((item) => {
    const link = item.querySelector(".contents-link")
    if (!link) return

    const sectionId = link.getAttribute("href")?.replace("#", "")
    const section = sectionId ? document.getElementById(sectionId) : null
    if (!section) return

    const h3s = [...section.querySelectorAll(":scope > h3")]
    if (!h3s.length) return

    const sublist = document.createElement("ol")
    sublist.className = "contents-sublist is-collapsed"

    h3s.forEach((h3) => {
      if (!h3.id) {
        const text = h3.textContent.trim().split("—")[0].trim()
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        h3.id = sectionId + "-" + slug
      }

      const li = document.createElement("li")
      li.className = "contents-item"

      const a = document.createElement("a")
      a.className = "contents-link"
      a.href = "#" + h3.id
      a.textContent = h3.textContent.trim().split("—")[0].trim()

      li.appendChild(a)
      sublist.appendChild(li)
    })

    item.appendChild(sublist)
  })

  // --- Phase 2: Build target list and h3→h2 mapping ---

  const allLinks = [...nav.querySelectorAll(".contents-link")]

  const allTargets = allLinks
    .map((link) =>
      document.getElementById(link.getAttribute("href")?.replace("#", "") || "")
    )
    .filter(Boolean)

  const h3ToH2 = new Map()
  topItems.forEach((item) => {
    const h2Link = item.querySelector(":scope > .contents-link")
    const h2Id = h2Link?.getAttribute("href")?.replace("#", "")
    if (!h2Id) return

    item.querySelectorAll(".contents-sublist .contents-link").forEach((sl) => {
      const h3Id = sl.getAttribute("href")?.replace("#", "")
      if (h3Id) h3ToH2.set(h3Id, h2Id)
    })
  })

  let currentId = null

  function setActive(id) {
    if (id === currentId) return
    currentId = id

    // Clear all active states
    allLinks.forEach((l) => l.classList.remove("is-active"))

    // Collapse all sublists
    nav
      .querySelectorAll(".contents-sublist")
      .forEach((sl) => sl.classList.add("is-collapsed"))

    if (!id) return

    // Activate the matching link
    const activeLink = nav.querySelector(
      `.contents-link[href="#${CSS.escape(id)}"]`
    )
    if (activeLink) activeLink.classList.add("is-active")

    // Determine parent h2 section
    const activeH2Id = h3ToH2.get(id) || id

    // Also highlight the parent h2 link when on an h3
    if (h3ToH2.has(id)) {
      const parentLink = nav.querySelector(
        `.contents-link[href="#${CSS.escape(activeH2Id)}"]`
      )
      if (parentLink) parentLink.classList.add("is-active")
    }

    // Expand the active section's sublist
    const parentItem = nav
      .querySelector(`.contents-link[href="#${CSS.escape(activeH2Id)}"]`)
      ?.closest(".contents-item")
    const sublist = parentItem?.querySelector(".contents-sublist")
    if (sublist) sublist.classList.remove("is-collapsed")
  }

  // --- Phase 3: Scroll-spy ---

  let ticking = false
  const scrollOffset = 100

  function updateActive() {
    let active = null

    for (const target of allTargets) {
      if (target.getBoundingClientRect().top <= scrollOffset) {
        active = target.id
      }
    }

    setActive(active || allTargets[0]?.id || null)
    ticking = false
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateActive)
        ticking = true
      }
    },
    { passive: true }
  )

  // Set initial state
  updateActive()
})
