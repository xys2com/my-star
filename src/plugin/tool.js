export function arrayEquals(array1, array2) {
  if (!array2) return false;
  if (array1.length != array2.length) return false;
  for (var i = 0, l = array1.length; i < l; i++) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!arrayEquals(array1[i], array2[i])) return false;
    } else if (array1[i] != array2[i]) {
      return false;
    }
  }
  return true;
}

export function radiusSquare(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
}
