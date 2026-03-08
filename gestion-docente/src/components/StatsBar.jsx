import { C } from "../constants/constants";
import { colors, spacing, typography } from "../design";

function Stat({ label, value, color }) {
  return (
    <div className="glass-card edge-light interactive-card" style={{ background: "transparent", borderRadius: 10, padding: "10px 12px", flex: "1 1 90px", minWidth: 90, textAlign: "center" }}>
      <div style={{ fontSize: typography.size.label, color: colors.neutral.textLabel, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: typography.weight.bold, color: color || colors.neutral.textPrimary }}>{value}</div>
    </div>
  );
}

export function StatsBar({ evaluated, students, groupAvg, atRisk, selCorte }) {
  return (
    <div style={{ display: "flex", gap: spacing[2], padding: `${spacing[3]}px ${spacing[5]}px`, flexWrap: "wrap" }}>
      <Stat
        label="Promedio"
        value={evaluated.length ? groupAvg.toFixed(2) : "—"}
        color={!evaluated.length ? "#9CA3AF" : groupAvg >= 3 ? C.green : "#ef4444"}
      />
      <Stat label="Evaluados" value={evaluated.length + "/" + students.length} color={C.orange} />
      <Stat label="Riesgo" value={atRisk.length} color={atRisk.length ? "#ef4444" : C.green} />
      <Stat label="Corte" value={"" + selCorte} color={C.magenta} />
    </div>
  );
}
