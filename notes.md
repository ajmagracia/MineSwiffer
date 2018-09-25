change square.js
clicked will be only state

everything else moved into conditional

if clicked or props.gamewon
square = this HTML

if not clicked
square = that html

then if you click, it will still set state to clicked, but the change will have
already occurred, so the user won't see a difference




Square:
  Unclicked:
    Ridge border,
    Light grey background,
    Right clicked:
      Flag content
    Twice right clicked:
      Question mark content
    0 or 3 right click:
      No content

  Clicked:
    Dark grey border
    Bomb:
      Red background
      Bomb content
    Number:
      Dark grey background
      Number content
    0:
      No content
      Clicks adjacent 0s (not diagonals)
