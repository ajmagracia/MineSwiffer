change square.js
clicked will be only state

everything else moved into conditional

if clicked or props.gamewon
square = this HTML

if not clicked
square = that html

When a bomb is clicked:
All other bombs should be clicked:

Find other bombs,
click the bombs


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


0s to make adjacent 0s click
Send its own value to board
  store as last-clicked state
Send last-clicked as props
Compare its own location to props
  If adjacent, click


ICEBOX: Each number has its own text color
