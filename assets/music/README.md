# Scoofyx Music Folder

Drop music files here and list them in `tracks.json`.

Example:

```json
[
  {
    "file": "my-loop.mp3",
    "name": "my-loop.mp3"
  },
  {
    "file": "another-track.mp3",
    "name": "another-track.mp3"
  }
]
```

Current behavior:

- the site plays music in the background
- tracks change automatically
- transitions fade between songs
- a subtle echo effect is applied through the browser audio graph
- there is no visible player box anymore

To add more music later:

1. Drop a new `.mp3` into this folder
2. Add it to `tracks.json`
3. Push to GitHub
