export function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdDev(arr) {
  if (!arr.length) return 0;
  const m = mean(arr);
  return Math.sqrt(mean(arr.map(v => (v - m) ** 2)));
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
