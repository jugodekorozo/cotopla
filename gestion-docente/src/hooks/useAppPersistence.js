import { useEffect, useState } from "react";

export function useAppPersistence(defaultCourses) {
  const [courses, setCourses] = useState(defaultCourses);
  const [selCourseId, setSelCourseId] = useState("c1");
  const [loaded, setLoaded] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("eval-dash-v4");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.courses && d.courses.length) {
          const ids = new Set(d.courses.map(c => c.id));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCourses([...d.courses, ...defaultCourses.filter(c => !ids.has(c.id))]);
        }
        if (d.selCourseId) setSelCourseId(d.selCourseId);
      }
    } catch {
      // first run or malformed storage
    }
    setLoaded(true);
  }, [defaultCourses]);

  useEffect(() => {
    if (!loaded) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutosaveStatus("saving");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("eval-dash-v4", JSON.stringify({ courses, selCourseId }));
        setAutosaveStatus("saved");
        setLastSavedAt(new Date());
      } catch {
        setAutosaveStatus("error");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [courses, selCourseId, loaded]);

  return {
    courses,
    setCourses,
    selCourseId,
    setSelCourseId,
    loaded,
    autosaveStatus,
    lastSavedAt,
  };
}
