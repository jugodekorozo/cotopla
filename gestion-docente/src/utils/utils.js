export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

export function scaleColor(v) {
  return v >= 4 ? "#6eb42c" : v >= 3 ? "#eab308" : v >= 2 ? "#f2992e" : "#ef4444";
}

export function calcEncargoNote(criterioScores, criterios) {
  if (!criterioScores || !criterios || criterios.length === 0) return 0;
  const vals = criterios.map(cr => criterioScores[cr.id] || 0).filter(v => v > 0);
  return vals.length > 0 ? avg(vals) : 0;
}

export function calcCorteNote(studentGrades, encargos) {
  if (!studentGrades || !encargos || encargos.length === 0) return 0;
  return encargos.reduce((sum, enc) => {
    const note = calcEncargoNote(studentGrades[enc.id], enc.criterios);
    return sum + note * (enc.porcentaje / 100);
  }, 0);
}

export function isFullyGraded(studentGrades, encargos) {
  if (!studentGrades || !encargos || encargos.length === 0) return false;
  return encargos.every(enc => {
    const g = studentGrades[enc.id];
    return g && enc.criterios.length > 0 && enc.criterios.every(cr => g[cr.id] >= 1);
  });
}

export function recText(a) {
  if (a >= 4) return "Desempeño destacado. Elevar exigencia y proponer retos avanzados.";
  if (a >= 3) return "Desempeño aceptable. Reforzar encargos débiles con retroalimentación individual.";
  return "Dificultades generalizadas. Replantear estrategia y ofrecer tutorías.";
}
