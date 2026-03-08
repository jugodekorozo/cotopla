import { useState, useEffect } from "react";

export function useMedia(query) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const h = (e) => setM(e.matches);
    mq.addEventListener("change", h);
    setM(mq.matches);
    return () => mq.removeEventListener("change", h);
  }, [query]);
  return m;
}
