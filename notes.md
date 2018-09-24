change square.js
clicked will be only state

everything else moved into conditional

if clicked or props.gamewon
square = this HTML

if not clicked
square = that html

then if you click, it will still set state to clicked, but the change will have
already occurred, so the user won't see a difference
