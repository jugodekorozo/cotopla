import { colors } from "./tokens/colors";
import { radius } from "./tokens/radius";
import { shadows } from "./tokens/shadows";
import { spacing } from "./tokens/spacing";

export const panelStyles = {
  primary: {
    background: "transparent",
    borderRadius: radius.large,
    padding: spacing[3],
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: shadows.medium,
  },
  secondary: {
    background: "transparent",
    borderRadius: radius.medium,
    padding: spacing[2],
    border: "1px solid rgba(255,255,255,0.1)",
  },
  minimal: {
    borderRadius: radius.medium,
    padding: spacing[2],
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.018)",
  },
  glassCard: {
    background: "transparent",
    borderRadius: radius.large,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: shadows.medium,
  },
  active: {
    border: "1px solid rgba(231,2,124,0.45)",
    boxShadow: shadows.glow,
    background: "rgba(231,2,124,0.08)",
  },
  accentStripe: {
    height: 3,
    background: colors.gradients.edge,
  },
};
