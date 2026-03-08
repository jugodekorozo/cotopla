export function validateRubricJson(data) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, errors: ["El contenido debe ser un objeto JSON."] };
  }

  if (!Array.isArray(data.encargos) || data.encargos.length === 0) {
    errors.push("El campo 'encargos' es obligatorio y debe contener al menos un encargo.");
  } else {
    data.encargos.forEach((enc, idx) => {
      const n = idx + 1;
      if (!enc || typeof enc !== "object" || Array.isArray(enc)) {
        errors.push("El encargo #" + n + " es inválido.");
        return;
      }

      if (typeof enc.nombre !== "string" || enc.nombre.trim() === "") {
        errors.push("El encargo #" + n + " debe tener un 'nombre' no vacío.");
      }

      if (typeof enc.porcentaje !== "number" || Number.isNaN(enc.porcentaje)) {
        errors.push("El encargo #" + n + " debe tener un 'porcentaje' numérico.");
      }

      if (!Array.isArray(enc.criterios) || enc.criterios.length === 0) {
        errors.push("El encargo #" + n + " debe tener 'criterios' como arreglo no vacío.");
      } else {
        enc.criterios.forEach((cr, cIdx) => {
          if (typeof cr !== "string" || cr.trim() === "") {
            errors.push("El criterio #" + (cIdx + 1) + " del encargo #" + n + " debe ser texto no vacío.");
          }
        });
      }
    });
  }

  return { ok: errors.length === 0, errors };
}

export function parseRubricJson(rawText) {
  if (!rawText || !rawText.trim()) {
    return { ok: false, error: "Pega un JSON antes de previsualizar." };
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    return { ok: false, error: "JSON inválido. Revisa la sintaxis." };
  }

  const validation = validateRubricJson(data);
  if (!validation.ok) {
    return { ok: false, error: validation.errors[0], errors: validation.errors };
  }

  return { ok: true, data };
}

export function transformRubricJsonToEncargos(data, uidFn) {
  return data.encargos.map(enc => ({
    id: uidFn(),
    nombre: enc.nombre.trim(),
    descripcion: typeof enc.descripcion === "string" ? enc.descripcion : "",
    porcentaje: Number(enc.porcentaje),
    criterios: enc.criterios.map(cr => ({ id: uidFn(), nombre: cr.trim() })),
  }));
}
