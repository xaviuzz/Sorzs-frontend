---
name: Sorzs
description: A private library of trusted sites, set in warm Flexoki paper and ink with a handwritten nameplate.
colors:
  paper: "#fffcf0"
  paper-shelf: "#f2f0e5"
  paper-hover: "#e6e4d9"
  ink: "#100f0f"
  ink-soft: "#282726"
  ink-faded: "#6f6e69"
  rule: "#cecdc3"
  library-blue: "#205ea6"
  ledger-green: "#66800b"
  stamp-red: "#af3029"
  night-paper: "#100f0f"
  night-shelf: "#1c1b1a"
  night-hover: "#343331"
  night-ink: "#cecdc3"
  night-ink-faded: "#878580"
  night-rule: "#343331"
  night-blue: "#4385be"
  night-green: "#879a39"
  night-red: "#d14d41"
typography:
  wordmark:
    fontFamily: "Rouge Script, cursive"
    fontSize: "1.25em"
    fontWeight: 600
  headline:
    fontFamily: "system sans-serif"
    fontSize: "1.5rem"
    lineHeight: "2rem"
  title:
    fontFamily: "system sans-serif"
    fontSize: "1.125rem"
    lineHeight: "1.75rem"
  body:
    fontFamily: "system sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "system sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.library-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.library-blue}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.library-blue}"
    rounded: "{rounded.md}"
    size: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.paper-hover}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "4px 12px"
  sidebar:
    backgroundColor: "{colors.paper-shelf}"
    textColor: "{colors.ink}"
    width: "256px"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Sorzs

## Overview

**Creative North Star: "The Private Library"**

Sorzs looks like a small reading room kept by one person: warm paper, dark ink, a handwritten nameplate over the door, and shelves of sites someone chose. Nothing performs. The interface is calm, bookish and understated, and it gets out of the way of the links, which are the whole point.

Density is moderate and chrome is thin. A single header with a hairline rule, a tonal shelf (the side bar) for the user's sources, and an open main area for results. One blue accent does all the pointing; green and red appear only as status. The only flourish is the script wordmark.

The look follows the operating system's light or dark preference, with no toggle. Light is paper and ink; dark is the same room at night.

**Key Characteristics:**
- Warm Flexoki paper and ink, never pure white or pure black.
- One blue accent; green and red are status only.
- Flat: borders and tonal surfaces carry depth, shadows are rare.
- One handwritten element, the wordmark; everything else is system sans.
- Icon-first controls with tooltips and accessible names.

## Colors

A Flexoki palette: tinted neutrals with a single blue accent, mapped onto shadcn's semantic variables and swapped wholesale in dark mode.

### Primary
- **Library Blue** (#205ea6, dark #4385be): primary buttons, focus ring, links styled as actions, active side bar item accent. The only accent.

### Secondary
- **Ledger Green** (#66800b, dark #879a39): the "service is up" mark. Status only.
- **Stamp Red** (#af3029, dark #d14d41): the "service is down" mark, destructive actions and error messages. Status only.

### Neutral
- **Paper** (#fffcf0, dark #100f0f): page and popover background.
- **Paper Shelf** (#f2f0e5, dark #1c1b1a): the side bar and card surfaces, one tonal step off the page.
- **Paper Hover** (#e6e4d9, dark #343331 for accent): hover and accent fill for ghost buttons and menu items; secondary fill.
- **Ink** (#100f0f, dark #cecdc3): body text.
- **Ink Soft** (#282726): text on hover and secondary fills.
- **Ink Faded** (#6f6e69, dark #878580): descriptions, source names, empty and checking states.
- **Rule** (#cecdc3, dark #343331): borders, the header hairline, input outlines.

### Named Rules
**The One Pointer Rule.** Blue is the only accent. It marks what can be acted on and where focus is. Green and red never decorate.
**The No Pure Rule.** No `#fff` or `#000`. Every neutral is tinted warm, in both themes.

## Typography

**Wordmark Font:** Rouge Script (cursive fallback), loaded from Google Fonts for the letters "Sorzs" only.
**Body Font:** the system sans-serif stack (Tailwind default). No other family is loaded.

**Character:** A handwritten nameplate against plain, neutral sans. The contrast is the identity; the sans never competes.

### Hierarchy
- **Wordmark** (600, 1.25em of the heading it sits in): the brand. In the Sorzs header the heading is 3rem, so the nameplate reads about 3.75rem and is the largest thing on the screen; on the entry screen the heading is 1.5rem. It also appears as the "S" of the add button and the "Sorz" in the add dialog's title. Always the script face, never used for anything else.
- **Headline** (400, 1.5rem / 2rem): the page `h1` on screens that show one.
- **Title** (400, 1.25rem for section titles, 1.125rem for a result title): backoffice section title and the title of each search result.
- **Body** (400, 0.875rem): descriptions, rows, form text. Source names above results use the faded ink.
- **Label** (500, 0.875rem): buttons, field labels.

### Named Rules
**The Single Script Rule.** The script face appears only as the brand, never as plain text. Section headings, button labels and results use the sans.

## Layout

An app shell: a full-width header with a bottom hairline, below it a collapsible left side bar (256px open, 48px collapsed to icons, a sheet at 288px on mobile) and a flexible main area with 16px padding. The header is tall and led by the wordmark: 24px above and below, 16px at the sides, 12px between items; the search box is centered, grows to a 672px maximum, and the action icons sit on the right with 8px between them. The backoffice uses the same header without search and add: the wordmark, the health mark, and the back and log out icons pushed to the right.

Spacing is Tailwind's 4px scale; 8px between related controls, 16px around regions, 24px inside dialogs. Results are a plain vertical list with no cards.

## Elevation & Depth

Flat by default. Depth comes from the hairline under the header, the 1px border between regions and the one tonal step between the page and the side bar. Shadows are reserved for floating surfaces: dialogs use the large shadow, outline buttons a faint extra-small one. Dialogs sit over a 50% black scrim.

### Named Rules
**The Flat Shelf Rule.** Surfaces at rest have no shadow. A shadow means the surface floats above the page (dialog, popover, tooltip).

## Shapes

Gently rounded and consistent: a base radius of 8px with steps at 4px, 6px (buttons, inputs, menu items), 8px (dialogs) and 12px. Borders are 1px in the Rule color. Icons are Lucide line icons at 16px in buttons. The favicon of each source is a small image beside its name, with a generic globe when none is known.

## Components

Refined and restrained: small, quiet controls that read as part of the page.

### Buttons
- **Shape:** gently rounded (6px), 36px tall, 16px horizontal padding.
- **Primary:** Library Blue fill with Paper text. Hover dims the fill to 90%.
- **Ghost / icon:** transparent, with a Paper Hover fill on hover. Always icon-only with a tooltip and an accessible name, 32px square. Backoffice, Back to Sorzs and Log out in the header are ghost with the icon in Library Blue, so the only solid blue button in the Sorzs header is the add button (the wordmark "S" with a plus), and the backoffice header has none; the colour marks the one main action and the rest stay quiet.
- **Outline:** 1px Rule border, Paper fill, a faint extra-small shadow.
- **Focus:** a 3px Library Blue ring at 50% opacity with a blue border.
- **Disabled:** 50% opacity, no pointer events.

### Inputs / Fields
- **Style:** 1px Rule border, Paper fill, 6px radius, 36px tall.
- **Focus:** the same 3px blue ring as buttons.
- **Error:** Stamp Red border and ring; the message sits in the field group in red.
- **Labelled on the side:** in the add-source form, each label sits to the left of its control in a 3.5rem column with a 12px gap, and the controls line up. Anything under the control, such as the candidate list, aligns with it. The form's blocks are 16px apart.

### Navigation
- **Side bar:** Paper Shelf fill, 1px border, entries with a favicon or icon and text. The active entry takes the Paper Hover accent. Collapses to icons only; the keyboard shortcut is `b`.
- **Header:** Paper, a bottom hairline, brand and health mark at left.

### Empty source list
In the side bar with no sources: a centered 32px library icon in faded ink with a thin 1.5 stroke, and below it "You have no sources yet" in faded ink at 0.875rem. 24px above and below. Hidden when the side bar collapses to icons.

### Search result
A plain link block: favicon with source name in faded ink, the title at 1.125rem, the description in faded ink below. No card, no border. Opens in a new tab.

### Health mark
A single 16px status icon next to the brand: circle while checking (faded), check in Ledger Green, cross in Stamp Red. It carries `role="status"` with a spoken label.

### Dialog
Paper fill, 1px border, 8px radius, 24px padding, large shadow, a 50% scrim, and a close icon at the top right. Used for adding a source and adding a user.

## Do's and Don'ts

### Do:
- **Do** fill every color from the shadcn variables so light and dark swap together.
- **Do** make header and row actions icon-only with a tooltip and an accessible name.
- **Do** keep results as plain text blocks on the page; the link is the interface.
- **Do** give any hard-coded size a token in `@theme` (as `--text-wordmark`) rather than an arbitrary class.
- **Do** use Lucide line icons.

### Don't:
- **Don't** use pure white or pure black; stay in the tinted Flexoki neutrals.
- **Don't** add a second accent color or use green or red for decoration.
- **Don't** use the script face outside the brand.
- **Don't** add shadows to surfaces at rest, and don't wrap results in cards.
- **Don't** add a theme toggle; the theme follows the operating system.
- **Don't** give the backoffice its own tokens or components; it differs from Sorzs only in what it shows.
- **Don't** make more than one button in a row solid blue.
