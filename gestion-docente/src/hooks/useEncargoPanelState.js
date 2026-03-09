import { useState } from "react";

export function useEncargoPanelState() {
  const [editEncId, setEditEncId] = useState(null);
  const [showEncForm, setShowEncForm] = useState(false);
  const [newEncargo, setNewEncargo] = useState({ nombre: "", descripcion: "", porcentaje: "" });
  const [showRubricImport, setShowRubricImport] = useState(false);
  const [rubricRaw, setRubricRaw] = useState("");
  const [rubricPreview, setRubricPreview] = useState(null);
  const [rubricImportError, setRubricImportError] = useState("");
  const [rubricImportSuccess, setRubricImportSuccess] = useState("");
  const [showCritForm, setShowCritForm] = useState(null);
  const [newCriterion, setNewCriterion] = useState("");

  return {
    editEncId, setEditEncId,
    showEncForm, setShowEncForm,
    newEncargo, setNewEncargo,
    showRubricImport, setShowRubricImport,
    rubricRaw, setRubricRaw,
    rubricPreview, setRubricPreview,
    rubricImportError, setRubricImportError,
    rubricImportSuccess, setRubricImportSuccess,
    showCritForm, setShowCritForm,
    newCriterion, setNewCriterion,
  };
}
