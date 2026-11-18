# Ashkan Zanjani — Portfolio Website

Premium personal portfolio and project website for Ashkan Zanjani.

This repository hosts the public GitHub Pages website at:

```text
https://ashkan77.github.io
```

Official App Store developer profile:

```text
https://apps.apple.com/ca/developer/ashkan-zanjani/id1501855480
```

## Purpose

This website presents selected Apple-platform projects, App Store-facing links, support pages, a shared app privacy policy, and public case studies without exposing private source code.

## Current homepage focus

```text
LocalML                Local-first Apple intelligence project
Solira Health          Distinct health companion project (in development)
Women's Health Journal iPhone health journaling project (in development)
Code IDE Studio        Native macOS code editor (in development)
Published apps         World Guide: Offline AI Travel, DropClear, Watch Audio Player,
                       Converter One, BMI Checker Plus
App Store Profile      Official Apple developer profile link
```

## Structure

```text
index.html                 Homepage
404.html                   Not-found page for GitHub Pages
robots.txt, sitemap.xml    Search engine files
site.js                    Scroll effects and live App Store icon lookup
styles.css + *.css         Visual system (professional-theme.css imports the polish layers)
apps/<app>.html            Product pages for published App Store apps
projects/<project>.html    Case studies for projects in development
support/                   Support Center and one support page per app
privacy/                   Privacy Center and one privacy policy per app
assets/                    Profile image and fallback artwork
```

`projects/world-guide.html` and `projects/watchaudio.html` are redirects to their `apps/` pages.

## Adding or updating an app

1. Add or edit `apps/<app>.html`, `support/<app>.html`, and `privacy/<app>.html`.
2. Add the card to `index.html`, `support/index.html`, and `privacy/index.html`.
3. For App Store apps, add the entry to `appStoreApps` in `site.js` so the icon loads from Apple.
4. Add the new pages to `sitemap.xml`.

## Repository model

Public website repository:

```text
ashkan77.github.io
```

Private code repositories should remain separate and private. This public repository should only contain portfolio, support, privacy, App Store, and marketing-safe project information.

## Notes

- Source code for apps should not be committed here.
- App Store privacy labels should still be reviewed separately for each app.
- The shared privacy page can be used as the general App Store privacy policy URL when it accurately covers the app's behavior.
- Project pages are public case studies, not full code documentation.
