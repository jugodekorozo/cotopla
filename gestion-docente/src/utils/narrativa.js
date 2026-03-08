/* Narrative helper functions for ReportView — rule-based, no AI */

export function getGeneralReading(groupAvg, evaluated, students, atRisk) {
  const pct = students.length ? Math.round((evaluated.length / students.length) * 100) : 0;
  const riskPct = evaluated.length ? Math.round((atRisk.length / evaluated.length) * 100) : 0;

  let tone = "";
  if (groupAvg >= 4.5) tone = "Los resultados del grupo son sobresalientes.";
  else if (groupAvg >= 4.0) tone = "El grupo muestra un desempeño sólido y por encima del promedio esperado.";
  else if (groupAvg >= 3.5) tone = "El grupo alcanza un nivel satisfactorio, con margen real para avanzar.";
  else if (groupAvg >= 3.0) tone = "El grupo se sitúa en el umbral de suficiencia, lo que exige atención pedagógica sostenida.";
  else if (groupAvg >= 2.5) tone = "El grupo muestra dificultades importantes que requieren intervención directa.";
  else tone = "Los resultados evidencian un rendimiento crítico que demanda una revisión profunda de la estrategia de evaluación.";

  const coverageNote =
    pct === 100
      ? "El curso está completamente evaluado."
      : pct >= 75
      ? `El ${pct} % del curso ha sido evaluado.`
      : `Solo el ${pct} % del curso ha sido evaluado — los resultados deben leerse con cautela.`;

  const riskNote =
    riskPct === 0
      ? "Ningún estudiante se encuentra en riesgo de reprobación."
      : riskPct <= 15
      ? `Un ${riskPct} % de los evaluados está en riesgo — un porcentaje manejable con acompañamiento puntual.`
      : riskPct <= 35
      ? `El ${riskPct} % de los evaluados está en riesgo — una señal que justifica revisar los apoyos disponibles.`
      : `El ${riskPct} % de los evaluados está en riesgo — una proporción alta que requiere acción inmediata.`;

  return `${tone} ${coverageNote} ${riskNote}`;
}

export function getEncargoReading(encargos, avgByEnc) {
  if (!encargos.length) return "No hay encargos configurados para este corte.";

  const sorted = [...encargos]
    .filter(e => avgByEnc[e.id] != null)
    .sort((a, b) => (avgByEnc[b.id] || 0) - (avgByEnc[a.id] || 0));

  if (!sorted.length) return "Sin datos de calificación por encargo.";

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestVal = (avgByEnc[best.id] || 0).toFixed(2);
  const worstVal = (avgByEnc[worst.id] || 0).toFixed(2);

  const gap = (avgByEnc[best.id] || 0) - (avgByEnc[worst.id] || 0);

  let gapNote = "";
  if (sorted.length === 1) {
    gapNote = "Solo existe un encargo evaluado, por lo que no es posible comparar desempeños.";
  } else if (gap < 0.3) {
    gapNote = "El desempeño es homogéneo entre encargos — el grupo responde de forma similar independientemente del tipo de tarea.";
  } else if (gap < 0.8) {
    gapNote = `Hay una diferencia moderada entre encargos (${gap.toFixed(2)} puntos), lo que sugiere variaciones en la apropiación de ciertos contenidos o formatos.`;
  } else {
    gapNote = `La brecha entre el mejor y el peor encargo es de ${gap.toFixed(2)} puntos — una diferencia significativa que merece análisis didáctico.`;
  }

  const bestNote =
    avgByEnc[best.id] >= 4
      ? `"${best.nombre}" destaca con ${bestVal}, lo que indica dominio claro de esa competencia.`
      : avgByEnc[best.id] >= 3
      ? `"${best.nombre}" es el mejor encargo con ${bestVal}, aunque aún existe espacio de mejora.`
      : `Incluso el mejor encargo, "${best.nombre}" (${bestVal}), se mantiene por debajo del nivel esperado.`;

  const worstNote =
    sorted.length > 1
      ? avgByEnc[worst.id] < 2.5
        ? `"${worst.nombre}" es el encargo más débil con ${worstVal} — un resultado que amerita revisar metodología y acompañamiento.`
        : `"${worst.nombre}" es el encargo con menor promedio (${worstVal}) y puede beneficiarse de refuerzo específico.`
      : "";

  return [bestNote, worstNote, gapNote].filter(Boolean).join(" ");
}

export function getCriteriaReading(globalCritAvg) {
  const entries = Object.entries(globalCritAvg);
  if (!entries.length) return "No hay datos de criterios disponibles.";

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const belowThreshold = sorted.filter(([, v]) => v < 3);
  const aboveHigh = sorted.filter(([, v]) => v >= 4);

  let reading = "";

  if (best[1] >= 4) {
    reading += `El criterio con mayor fortaleza es "${best[0]}" (${best[1].toFixed(2)}), lo que refleja habilidades consolidadas en esa dimensión. `;
  } else {
    reading += `El criterio mejor evaluado es "${best[0]}" (${best[1].toFixed(2)}), aunque ninguno supera el nivel de logro alto. `;
  }

  if (worst[1] < 2.5) {
    reading += `"${worst[0]}" presenta el promedio más bajo (${worst[1].toFixed(2)}), un resultado que demanda intervención pedagógica focalizada. `;
  } else if (worst[1] < 3) {
    reading += `"${worst[0]}" es el criterio más débil (${worst[1].toFixed(2)}) y está por debajo del umbral de suficiencia. `;
  } else {
    reading += `"${worst[0]}" es el criterio con menor puntuación (${worst[1].toFixed(2)}), con margen de mejora identificable. `;
  }

  if (aboveHigh.length === entries.length) {
    reading += "Todos los criterios alcanzan un nivel alto, lo cual es un resultado excepcional.";
  } else if (belowThreshold.length === 0) {
    reading += "Ningún criterio está por debajo de la suficiencia — el grupo tiene bases sólidas en todas las dimensiones evaluadas.";
  } else if (belowThreshold.length === 1) {
    reading += `Solo un criterio está por debajo de 3.0: "${belowThreshold[0][0]}". Focalizar el esfuerzo allí puede elevar el promedio grupal de forma rápida.`;
  } else {
    reading += `${belowThreshold.length} criterios están por debajo de 3.0 (${belowThreshold.map(([n]) => `"${n}"`).join(", ")}). Esto indica una dificultad sistemática que trasciende tareas individuales.`;
  }

  return reading;
}

export function getRiskReading(atRisk, evaluated) {
  if (!atRisk.length) return "Ningún estudiante se encuentra en riesgo. El grupo en su conjunto supera el umbral de aprobación.";

  const names = atRisk.map(s => s.name).slice(0, 5);
  const more = atRisk.length > 5 ? ` y ${atRisk.length - 5} más` : "";
  const lowestFinal = Math.min(...atRisk.map(s => s.final));
  const severity = lowestFinal < 2 ? "crítica" : lowestFinal < 2.5 ? "grave" : "moderada";

  return (
    `${atRisk.length === 1 ? "Un estudiante está" : `${atRisk.length} estudiantes están`} por debajo de 3.0: ` +
    `${names.join(", ")}${more}. ` +
    `La situación más ${severity} corresponde a ${atRisk[atRisk.length - 1].name} con ${atRisk[atRisk.length - 1].final.toFixed(2)}. ` +
    `Se recomienda establecer contacto directo, revisar los encargos pendientes y, si aplica, activar los protocolos de apoyo académico disponibles.`
  );
}

export function getPedagogicRecommendation(groupAvg, atRisk, evaluated, encargos, avgByEnc) {
  const weak = [...encargos]
    .filter(e => avgByEnc[e.id] != null && avgByEnc[e.id] < 3)
    .sort((a, b) => avgByEnc[a.id] - avgByEnc[b.id])
    .slice(0, 2);

  let rec = "";

  if (groupAvg >= 4.5) {
    rec =
      "El grupo exhibe un rendimiento excepcional. La estrategia pedagógica ha sido efectiva. Se sugiere profundizar los retos y proponer tareas de mayor complejidad o síntesis para aprovechar el momentum del grupo.";
  } else if (groupAvg >= 4.0) {
    rec =
      "El desempeño es sólido. Para avanzar al siguiente nivel, conviene introducir tareas de transferencia que exijan aplicar lo aprendido en contextos nuevos o interdisciplinarios.";
  } else if (groupAvg >= 3.5) {
    rec =
      "El grupo está en buen camino. Para consolidar el aprendizaje, se recomienda aumentar la frecuencia de retroalimentación formativa y propiciar espacios de autoevaluación entre pares.";
  } else if (groupAvg >= 3.0) {
    rec =
      "El grupo se mantiene sobre el umbral, pero de forma frágil. Se aconseja revisar la estructura de los encargos más débiles, clarificar los criterios de rúbrica con los estudiantes y reservar tiempo de clase para revisión colectiva.";
  } else {
    rec =
      "Los resultados indican dificultades estructurales. Se recomienda una revisión profunda del diseño de evaluación: ¿son los encargos accesibles? ¿están los criterios alineados con lo enseñado? Una retroalimentación masiva y el uso de ejemplos de buen desempeño pueden ser puntos de entrada concretos.";
  }

  const actions = [];

  if (atRisk.length > 0) {
    actions.push(
      `Identificar y contactar a los ${atRisk.length} estudiante${atRisk.length > 1 ? "s" : ""} en riesgo para diseñar un plan de apoyo individualizado.`
    );
  }

  if (weak.length > 0) {
    actions.push(
      `Dedicar sesiones de refuerzo a ${weak.map(e => `"${e.nombre}"`).join(" y ")}, los encargos con menor promedio del corte.`
    );
  }

  actions.push("Compartir los resultados globales con el grupo como insumo de metacognición colectiva.");
  actions.push("Documentar los ajustes realizados para informar el diseño del siguiente corte.");

  return { rec, actions };
}
