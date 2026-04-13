# [eustasy/.ui](https://github.com/eustasy/.ui)

Open, accessible, themable web components — vanilla HTML, CSS, and minimal JavaScript.

## Philosophy

- **Vanilla first.** HTML, CSS, absolutely minimal JavaScript. No frameworks.
- **Themable.** Every color, font, spacing value, border radius, and shadow is a CSS custom property. Swap the theme file to restyle everything.
- **Accessible.** [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) as baseline. Keyboard navigation, focus-visible rings, screen-reader support, `prefers-reduced-motion`, and `prefers-color-scheme` are built in.
- **Drop-in.** Each component works independently. Copy the HTML, link the CSS, done.

## Quick Start

```html
<!-- Option A: Link the built single-file (recommended) -->
<link rel="stylesheet" href="dist/ui.min.css" />

<!-- Option B: Link the source entry (uses @import, fine for dev) -->
<link rel="stylesheet" href="assets/main.css" />
```

For dark/light mode toggling, add the script and a toggle button:

```html
<script src="js/theme-toggle.js"></script>
<button data-theme-toggle aria-label="Toggle dark mode">🌓</button>
```

## Building

Lightning CSS is the sole build dependency — it bundles `@import`s, applies CSS nesting, and minifies.

```bash
npm install
npm run build    # → dist/ui.min.css (bundled + minified)
npm run dev      # → watch mode
```

## Structure

```
assets/
  main.css                    ← source entry point (imports everything)
  themes/
    flexoki.css               ← Flexoki 2.0 palette + semantic tokens + light/dark
base/
  reset.css                   ← modern CSS reset
  typography.css              ← headings, prose, lists, code, links
  forms.css                   ← shared form styles, validation states
  tables.css                  ← striped rows, responsive wrapper
  media.css                   ← images, details, progress, dialog
components/
  alert.css                   ← info, success, warning, danger, dismissible
  avatar.css                  ← image and initials variants
  badge.css                   ← color variants for all accent colors
  button.css                  ← primary, secondary, outline, ghost, danger, sizes
  card.css                    ← header/body/footer, image variant, compact
  checkbox.css                ← styled checkbox with indeterminate state
  combobox.css                ← searchable select with listbox
  description-list.css        ← horizontal and vertical term/definition pairs
  dialog.css                  ← modal and non-modal dialog
  divider.css                 ← horizontal and vertical separators
  dropdown.css                ← trigger + floating menu
  fieldset.css                ← grouped form controls with legend
  heading.css                 ← display and section headings
  input.css                   ← text, number, date, and other input types
  listbox.css                 ← single and multi-select listbox
  navbar.css                  ← responsive nav with mobile toggle
  pagination.css              ← page navigation controls
  radio.css                   ← radio button group
  select.css                  ← native and custom select
  switch.css                  ← toggle switch (checkbox variant)
  table.css                   ← striped, bordered, and compact variants
  text.css                    ← inline text elements
  textarea.css                ← auto-resizing textarea
  user-menu.css               ← avatar dropdown for user account actions
js/
  alert.js                    ← dismiss .alert on .alert-dismiss click
  combobox.js                 ← filter, keyboard nav, aria-activedescendant
  dialog.js                   ← open/close native <dialog> via data attributes
  dropdown.js                 ← toggle .dropdown menus; click-outside + Escape
  listbox.js                  ← single and multi-select keyboard nav + live region
  textarea.js                 ← character count for .textarea-field[maxlength]
  theme-toggle.js             ← dark/light toggle with localStorage persistence
  user-menu.js                ← user menu open/close behaviour
layouts/
  auth.html / auth.css        ← centred authentication layout
  nav-indicator.js            ← animated sliding tab for sidebar/stacked navs
  sidebar.html / sidebar.css  ← sidebar + main content layout (all sidebar classes)
  stacked.html / stacked.css  ← stacked (app shell) layout
tests/
  elements.html               ← living reference of all styled HTML elements
  components.html             ← preview of all components
dist/
  ui.min.css                      ← built output (gitignored)
```

## Theming

The theme system has three layers:

1. **Raw palette** (`--flexoki-red-600`, etc.) — Flexoki 2.0's full extended palette.
2. **Design tokens** (`--space-4`, `--radius-md`, `--font-size-base`) — spacing, typography, borders.
3. **Semantic tokens** (`--color-danger`, `--color-action`, `--color-surface`) — what components actually use.

Light/dark mode is automatic via `prefers-color-scheme`. Override with `.theme-light` or `.theme-dark` on `<html>`.

To create a new theme, define the same semantic token variables in a new CSS file and swap the import.

## Accessibility

- Focus rings via `:focus-visible` (keyboard only, not mouse clicks)
- `aria-invalid`, `aria-required`, `aria-describedby` patterns on forms
- `role="alert"` and `aria-live` for dynamic messages
- `prefers-reduced-motion` disables all animation/transitions
- `color-scheme` declaration for native form control theming
- Semantic HTML throughout: `<nav>`, `<main>`, `<article>`, `<dialog>`, `<details>`

## Credits

Color palette: [Flexoki](https://stephango.com/flexoki) by Steph Ango (MIT License).
