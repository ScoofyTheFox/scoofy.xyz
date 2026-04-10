# Scoofy Link Hub

A customizable single-page link hub built with plain HTML, CSS, and JavaScript.

## Files

- `index.html`: page structure
- `styles.css`: layout, motion, and visual styling
- `script.js`: rendering, filters, copy action, and 3D effects
- `icons/`: PNG icons used for individual links
- `assets/`: profile GIF, favicon, and badge icon assets

## Customize

1. Edit the embedded `settings-data` block in `index.html`.
2. Edit the embedded `links-data` block in `index.html`.
3. Put PNG icon files in `icons/` and point each link item to the right file.
4. Replace `assets/scoofy-icon.gif` if you want a different animated profile icon.
5. Add as many badge PNG files as you want and list them in the `settings-data` block.
6. Change colors, blur, cursor style, and category names in the `settings-data` block.
7. Add background music and control its default volume from `settings.txt`.

## Embedded Settings Format

The `settings-data` block inside `index.html` has sections for profile values, categories, and decorative badge icons.

```txt
--settings--
name=Scoofy
handle=@scoofy
subtitle=CREATOR HUB
bio=Write your bio here.
discord_username=scoofy
profile_gif=assets/scoofy-icon.gif
favicon=assets/scoofy-icon.gif
theme_mode=light
name_gradient_mode=rainbow
badges_enabled=false
card_blur=18
cursor_mode=dot
cursor_color=#d36e43
snow_enabled=false
music_src=assets/music/theme.mp3
music_autoplay=false
music_volume=0.35
bg=#f4efe7
bg_deep=#d9cdb6
panel=rgba(255, 250, 242, 0.82)
text=#1d1b19
muted=#5d5349
accent=#d36e43
accent_2=#0c7c59

--categories--
all=All
social=Social
content=Content
work=Work

--badges--
assets/badges/star.png
assets/badges/sparkle.png
assets/badges/heart.png
```

You can add as many badge lines as you want. You can also add your own categories here and then use those same category keys in the `links-data` block. Set `badges_enabled=true` if you want the badge row to show.

Music fields:

- `music_src`: path to your audio file
- `music_autoplay`: `true` or `false`
- `music_volume`: value from `0` to `1`

Note: most browsers block audible autoplay. This setup starts the track muted when possible, then the top-right button acts as an unmute control.

Name gradient fields:

- `name_gradient_mode`: `rainbow` or `purple`

## Embedded Links Format

Each link is a block of `key=value` lines separated by `---`.
Use `order=` if you want to manually control where a link appears.
Use `list_descriptions=true` if you want descriptions to show in list view.

```txt
--settings--
default_target=_blank
list_descriptions=false

--links--
title=Instagram
order=1
description=Short supporting text
url=https://instagram.com
icon=icons/instagram.png
category=social
type=web
featured=false
---
title=Discord
description=Tap to copy my username
icon=icons/discord.png
category=social
type=copy
copy_value=scoofy
copy_label=Copy Discord
copy_success=Discord copied
copy_idle=tap to copy
copy_error=copy failed
featured=true
```

Categories are fully customizable now. The page builds the filter buttons from `--categories--` in the embedded settings block, so if nothing new appears there, check that your links use matching category keys.

## Link Types

- `type=web`: opens the `url`
- `type=copy`: copies `copy_value` to the clipboard

For `type=copy`, you can customize:

- `copy_label`: small action label shown on the card
- `copy_success`: text shown after a successful copy
- `copy_idle`: default status text
- `copy_error`: text shown if copying fails

You can also leave a field empty while planning things out and fill it later.

## Notes

- If a PNG icon is missing, the page falls back to initials automatically.
- Badge images are decorative, so they work well for stars, sparkles, silly faces, hearts, or other tiny PNGs.
- The GIF in `assets/` is also used as the site icon in the browser tab.
- If you add music, put the file in an `assets/music/` folder or update the path in `index.html`.
- The page now works when opened directly from `index.html`.

## Editing Flow

- Add profile settings and badge icon paths in the embedded `settings-data` block.
- Add your links in the embedded `links-data` block.
- Put your PNG icons in `icons/`.
- Replace `assets/scoofy-icon.gif` if you want a custom animated profile image.
