import { useMemo } from "react";
import { avg, calcCorteNote, calcEncargoNote, isFullyGraded } from "../utils/utils";

export function useCourseAnalytics({ students, grades, encargos }) {
  const evaluated = useMemo(
    () => students.filter(s => grades[s.id] && isFullyGraded(grades[s.id], encargos)),
    [students, grades, encargos]
  );

  const allFinals = useMemo(
    () => evaluated.map(s => calcCorteNote(grades[s.id], encargos)),
    [evaluated, grades, encargos]
  );

  const groupAvg = useMemo(() => avg(allFinals), [allFinals]);

  const ranking = useMemo(
    () => evaluated.map(s => ({ ...s, final: calcCorteNote(grades[s.id], encargos) })).sort((a, b) => b.final - a.final),
    [evaluated, grades, encargos]
  );

  const atRisk = useMemo(() => ranking.filter(s => s.final < 3), [ranking]);

  const avgByEnc = useMemo(() => {
    if (!evaluated.length) return {};
    const r = {};
    encargos.forEach(e => {
      r[e.id] = avg(evaluated.map(s => calcEncargoNote(grades[s.id] && grades[s.id][e.id], e.criterios)));
    });
    return r;
  }, [evaluated, grades, encargos]);

  const avgByCrit = useMemo(() => {
    if (!evaluated.length || !encargos.length) return {};
    const r = {};
    encargos.forEach(e => {
      e.criterios.forEach(cr => {
        const key = e.id + "__" + cr.id;
        const vals = evaluated.map(s => {
          const sg = grades[s.id];
          return (sg && sg[e.id] && sg[e.id][cr.id]) || 0;
        }).filter(v => v > 0);
        r[key] = avg(vals);
      });
    });
    return r;
  }, [evaluated, grades, encargos]);

  const globalCritAvg = useMemo(() => {
    if (!evaluated.length) return {};
    const byName = {};
    encargos.forEach(e => {
      e.criterios.forEach(cr => {
        if (!byName[cr.nombre]) byName[cr.nombre] = [];
        evaluated.forEach(s => {
          const v = (grades[s.id] && grades[s.id][e.id] && grades[s.id][e.id][cr.id]) || 0;
          if (v > 0) byName[cr.nombre].push(v);
        });
      });
    });
    const r = {};
    Object.entries(byName).forEach(([name, vals]) => { r[name] = avg(vals); });
    return r;
  }, [evaluated, grades, encargos]);

  const notesByEncargo = useMemo(() => {
    const r = {};
    encargos.forEach(e => {
      r[e.id] = evaluated
        .map(s => ({ id: s.id, name: s.name, note: calcEncargoNote(grades[s.id] && grades[s.id][e.id], e.criterios) }))
        .sort((a, b) => b.note - a.note);
    });
    return r;
  }, [evaluated, grades, encargos]);

  const strengths = useMemo(
    () => [...Object.entries(avgByEnc)].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => encargos.find(e => e.id === k)).filter(Boolean).map(e => e.nombre),
    [avgByEnc, encargos]
  );

  const weaknesses = useMemo(
    () => [...Object.entries(avgByEnc)].sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k]) => encargos.find(e => e.id === k)).filter(Boolean).map(e => e.nombre),
    [avgByEnc, encargos]
  );

  return {
    evaluated,
    allFinals,
    groupAvg,
    ranking,
    atRisk,
    avgByEnc,
    avgByCrit,
    globalCritAvg,
    notesByEncargo,
    strengths,
    weaknesses,
  };
}
