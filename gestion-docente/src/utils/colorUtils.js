import { C } from "../constants/constants";

export function heatColor(v) {
  if (v <= 1) return "#ef4444";
  if (v <= 2) return "#f2992e";
  if (v <= 3) return "#eab308";
  if (v <= 4) return "#6eb42c";
  return "#6eb42c";
}

export function jitter(index, spread) {
  return (Math.sin(index * 9301 + 49297) * 0.5) * spread;
}

export function statusTag(type) {
  if (type === "critical") return { label: "crítico", color: "#ef4444" };
  if (type === "alert") return { label: "alerta", color: "#f2992e" };
  if (type === "improving") return { label: "mejorando", color: C.magenta };
  return { label: "estable", color: "#6eb42c" };
}
