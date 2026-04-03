# Scoofy.xyz

Scoofyx's personal multi-page site, built as a static GitHub Pages-friendly project.

## What is in here

- Dark-only theme
- Multiple root-level pages for easy local opening and easy GitHub Pages hosting
- Gallery pages using Scoofyx art, renders, gifs, and logos
- Background music with automatic track changes, fades, and subtle echo
- A file-driven live feed page you can update from GitHub
- Relative paths everywhere, so the site works from a repo subpath

## Site files

- `index.html` - home page
- `docs.html` - creator notes, style, and project info
- `fursona.html` - fursona page
- `gallery.html` - art and gif gallery
- `live.html` - GitHub-editable live update page
- `furries.html` - furry-themed page
- `links.html` - socials and external links
- `assets.html` - asset/music notes page
- `styles.css` - shared styling
- `script.js` - shared interactions, live feed loading, toys, and background audio
- `.nojekyll` - tells GitHub Pages to serve the site as a plain static site

## Asset folders

- `assets/images/` - logos, drawings, renders, banners, icons
- `assets/gifs/` - Scoofyx gifs and animated gallery media
- `assets/music/` - music files, `tracks.json`, and music notes
- `assets/live/` - live page JSON template and live images
- `assets/settings/` - shared site settings

## Music setup

- Music files live in `assets/music/`
- Playlist data lives in `assets/music/tracks.json`
- The site also has a built-in playlist fallback in `script.js`
- Tracks change automatically
- Music uses fade transitions and a subtle echo effect
- The visible player UI has been removed

## Live page setup

- Edit `assets/live/live.json` to change the content of `live.html`
- Add images to `assets/live/images/`
- Push to GitHub and the live page updates
- Shared site settings live in `assets/settings/site.json`

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Upload every file from this folder to the root of that repository.
3. Keep the HTML files at the repo root:
   - `index.html`
   - `docs.html`
   - `fursona.html`
   - `gallery.html`
   - `live.html`
   - `furries.html`
   - `links.html`
   - `assets.html`
4. Push the repo to GitHub.
5. On GitHub, open `Settings` -> `Pages`.
6. Under `Build and deployment`, set:
   - `Source: Deploy from a branch`
   - `Branch: main`
   - `Folder: / (root)`
7. Save and wait for GitHub Pages to publish the site.

## Resulting URLs

- Project site: `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`
- User site: `https://YOUR-USERNAME.github.io/`

If you want the user-site version, name the repo:

- `YOUR-USERNAME.github.io`

## Notes

- The site is designed to work both locally and on GitHub Pages.
- All links use file-based pages instead of nested `index.html` folders.
- If a browser blocks autoplay on a first visit, the music resumes after interaction.
