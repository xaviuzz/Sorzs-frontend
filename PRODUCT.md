# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Xavier (`xaviuzz`) and a few people he invites, such as `ana`. A tiny circle: no public sign-up, no marketing audience. Each user keeps a personal list of trusted sources and searches from it. One admin (today Xavier) manages users and sees which sources are in use in the backoffice.

## Product Purpose

Sorzs lets a user search the web without leaving the sites they trust. The user registers the sources they trust, and every search returns links to pages from those sources only. Success is a search that never strays beyond the user's own list.

## Positioning

Trust is the user's list. A search never widens to the open web, and it returns links to the original pages, never answers, ranking or copied content. Trust has no degrees: a source is in the list or it is not.

## Operating Context

- Desktop-first web app in a browser: header with brand, search box, health mark and log out; a collapsible side bar with the user's source list; a main area for results.
- Admin-only backoffice with Users and Sorzs sections, reached from an icon button in the header.
- Light and dark themes follow the operating system.
- Search is a stand-in for now (a Google link limited to each source's site); the final design runs search in the frontend through a module the backend serves on demand.

## Capabilities and Constraints

- Register a source by address; Sorzs does not check that the site exists. A duplicate is reported, not added.
- Each user names their sources and renames them freely; names are unique within the list, case-insensitively. The name belongs to the user, not to the source.
- Removal takes effect at once and leaves no trace.
- With no sources or no query, no search happens.
- Roles: admin and user. Users persist for good.
- UI copy is English.
- Out of scope: favorites, history, topics, searching a subset, discovering sources. Open: source suggestions, lists shared between users.
- Functional concepts are defined in `.claude/docs/` (search, source, source-list, session, user, backoffice).

## Brand Commitments

Name: Sorzs. The visual identity so far is the Flexoki palette in light and dark (`.claude/decisions/flexoki-palette-light-and-dark.md`); the user did not state it as a binding commitment during init.

## Evidence on Hand

No testimonials, customers, usage figures or benchmarks exist; none may be invented.

## Product Principles

1. The user's list is the boundary: nothing outside it ever appears.
2. Links, not answers: send the user to the original page.
3. Trust is binary and the user's own call; Sorzs does not judge sources.
4. Quiet utility for a small circle: calm, fast, legible, with no growth or engagement tricks.

## Accessibility & Inclusion

Sensible defaults: keyboard use, accessible names on icon-only buttons, role-based testability. No formal standard (such as WCAG AA) was set.
