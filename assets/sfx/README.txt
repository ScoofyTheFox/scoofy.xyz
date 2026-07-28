scoofy.xyz - custom sound effects
=================================

Drop your own audio files in THIS folder, then point to them in ../../config.js
under `sfx`. mp3 / wav / ogg all work.

Current slots (see config.js):
  dialup  ->  the modem screech that plays on the FIRST click
  click   ->  every button / link click blip
  sign    ->  when a guestbook signature posts

If a file is missing, the site plays a built-in synthesized beep instead, so it is
never silent. Add a real file to override the beep.

Keep them SHORT: a click should be a few milliseconds, the dialup can run a second
or two. Default filenames (match these or update config.js): dialup.mp3, click.mp3,
sign.mp3.
