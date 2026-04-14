---
description: Always follow these instructions when working on files in this repository. They cover coding style, accessibility requirements, and other important guidelines to ensure consistency and quality across the project.
applyTo: "*" # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

# eustasy/.ui — Copilot Instructions

## Philosophy

- **Vanilla first.** HTML, CSS, and absolutely minimal JavaScript. No frameworks, no build-time JS transforms.
- **Themable.** Every visual value is a CSS custom property. Components never use hard-coded colours, sizes, or radii.
- **Accessible.** WCAG 2.2 AA is the baseline, not a stretch goal.
- **Drop-in.** Each component must work in isolation. No inter-component dependencies.

## File Conventions

- Component styles → `components/<name>.css`
- Component behaviour → `js/<name>.js` (one file per component, event-delegated where possible)
- Layout styles → `layouts/<name>.css`, layout behaviour → `layouts/<name>.js`
- Base/reset styles → `base/`
- Theme tokens → `assets/themes/`
- Demo scaffolding only → `*.demo.css` and `tests/*.js` / `layouts/*.js`

New components added to `components/` must also be imported in `assets/main.css`.

## Accessibility Requirements

When writing HTML, CSS, or JS for any component:

- **Colour contrast.** Text must meet 4.5:1 (normal) or 3:1 (large/bold). UI components and focus indicators must meet 3:1 against adjacent colours. Check both light and dark themes.
- **Focus.** Use `:focus-visible` rings, never remove outlines without a replacement. Focus must be visible and logically ordered.
- **ARIA.** Follow the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) patterns. Match roles, states, and properties to the interaction model. Add usage comments to CSS files that have non-obvious ARIA requirements.
- **Keyboard.** Every interactive element must be fully operable by keyboard alone.
- **Motion.** Wrap all transitions and animations in `@media (prefers-reduced-motion: no-preference)` or honour `prefers-reduced-motion: reduce`.
- **Semantic HTML.** Prefer native elements (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<fieldset>`) over `<div>` + ARIA.

## JavaScript Rules

- No frameworks. Vanilla ES2020+.
- Event delegate to `document` or the component root — avoid per-element listeners on long lists.
- Expose `close`/`open` functions on `window` only when cross-component coordination is genuinely needed (e.g. `window.closeUserMenu`).
- JS files in `js/` are reusable component scripts. Demo-only logic belongs in `tests/*.js` or `layouts/*.js`.
- Do not duplicate behaviour that is already handled by another `js/` file.

## CSS Rules

- Use CSS custom properties from the token system. Never hard-code colours, spacing, or radii.
- Logical properties (`inset-block-start`, `padding-inline`) over physical (`top`, `padding-left`).
- Animations must respect `prefers-reduced-motion`.
- Class names follow BEM-lite: `.component`, `.component-element`, `.component-modifier`.

## README

Keep `README.md` up to date whenever:

- A file is added, removed, or renamed in `js/`, `components/`, `layouts/`, or `base/`
- The build process changes
- New theming or accessibility patterns are introduced

The Structure section must reflect the actual directory tree. Descriptions should be one short phrase.
