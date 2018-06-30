export const winTop = (function (window) {
  function isValidwin (snWindow) {
    try {
      if (!snWindow || !snWindow.location) {
        return false
      } else {
        snWindow.document
      }
    } catch (e) {
      return false
    }
    return true
  }
  function isWindowParent (win) {
    if (win.parent !== win) {
      if (isValidwin(win.parent)) {
        return win.parent
      }
      return win
    }
    return win
  }
  var win = window
  while (isWindowParent(win) !== win) {
    win = isWindowParent(win)
  }
  return win
}(window))
