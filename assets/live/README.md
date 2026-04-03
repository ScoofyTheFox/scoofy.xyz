# Live Feed Files

Use this folder to update `live.html` without rewriting the page layout.

## Main file

- `live.json`

Edit the `windows` array in `live.json`.
Each object becomes one live update window on the page.

## Images

Drop update images into:

- `assets/live/images/`

Then reference them in `live.json` like:

- `./assets/live/images/your-image-name.png`

## Window fields

- `tag` - small label at the top
- `title` - main window title
- `date` - date, version, or short status text
- `text` - main update text
- `image` - relative image path
- `linkLabel` - button text
- `linkHref` - button link

## Add another update

1. Copy one window object in `live.json`
2. Paste it below the last one
3. Change the text and image
4. Push to GitHub
