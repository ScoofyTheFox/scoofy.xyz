assets/dropicons/  -  the little icons on the ABOUT-ME dropdowns
================================================================

Right now each dropdown shows an EMOJI as a placeholder. To swap one for
your own art, just drop a PNG in this folder with the matching name:

  where.png   ->  the "where 2 find me" dropdown   (emoji fallback: 📺)
  who.png     ->  the "who even am i" dropdown      (emoji fallback: 🦊)
  lore.png    ->  the "site lore" dropdown          (emoji fallback: 📼)

That's it. No code to touch - the page tries the PNG first and only falls
back to the emoji if the file isn't there.

Tips:
  - square images look best (they render at 22x22 in a 30x30 cyan box)
  - transparent background PNGs sit cleanest on the black tile
  - to change WHICH emoji shows as the fallback, edit the emoji inside the
    onerror="..." on that <span class="drop-ico"> in index.html
