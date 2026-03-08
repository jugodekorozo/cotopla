import { avg, calcCorteNote, isFullyGraded } from "./utils";

/**
 * Computes a summary for a course using the corte with the most evaluated students.
 * Returns: totalStudents, evaluatedCount, groupAvg, atRiskCount, progressPct, status
 */
export function getCourseSummary(course) {
  const students = course.students || [];
  const totalStudents = students.length;

  if (!totalStudents) {
    return { totalStudents: 0, evaluatedCount: 0, groupAvg: 0, atRiskCount: 0, progressPct: 0, status: "empty" };
  }

  const cortes = course.cortes && course.cortes.length ? course.cortes : [{ id: 1 }];
  let best = null;

  for (const corte of cortes) {
    const key = "corte-" + corte.id;
    const encargos = (course.encargos && course.encargos[key]) || [];
    const grades = (course.grades && course.grades[key]) || {};
    if (!encargos.length) continue;
    const evaluated = students.filter(s => grades[s.id] && isFullyGraded(grades[s.id], encargos));
    if (!best || evaluated.length > best.evaluatedCount) {
      best = { encargos, grades, evaluatedCount: evaluated.length, evaluated };
    }
  }

  if (!best || best.evaluatedCount === 0) {
    return { totalStudents, evaluatedCount: 0, groupAvg: 0, atRiskCount: 0, progressPct: 0, status: "empty" };
  }

  const finals = best.evaluated.map(s => calcCorteNote(best.grades[s.id], best.encargos));
  const groupAvg = avg(finals);
  const atRiskCount = finals.filter(f => f < 3).length;
  const progressPct = Math.round((best.evaluatedCount / totalStudents) * 100);

  const status =
    best.evaluatedCount < 2 ? "empty" :
    groupAvg >= 3.5 ? "good" :
    groupAvg >= 3 ? "ok" : "risk";

  return { totalStudents, evaluatedCount: best.evaluatedCount, groupAvg, atRiskCount, progressPct, status };
}
