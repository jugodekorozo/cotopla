import { colors } from "./tokens/colors";

export const uiStates = {
  success: { text: colors.semantic.success, border: "rgba(110,180,44,0.45)", bg: "rgba(110,180,44,0.12)" },
  warning: { text: colors.semantic.warning, border: "rgba(242,153,46,0.45)", bg: "rgba(242,153,46,0.12)" },
  danger: { text: colors.semantic.danger, border: "rgba(239,68,68,0.45)", bg: "rgba(239,68,68,0.12)" },
  selected: { text: colors.semantic.selected, border: "rgba(231,2,124,0.45)", bg: "rgba(231,2,124,0.14)" },
  disabled: { text: colors.neutral.textMuted, border: "#2f3139", bg: "#16171c" },
};
