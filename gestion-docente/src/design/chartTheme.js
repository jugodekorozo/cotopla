import { colors } from "./tokens/colors";
import { typography } from "./tokens/typography";

export const chartTheme = {
  grid: {
    stroke: "rgba(255,255,255,0.16)",
    strokeDasharray: "3 3",
  },
  axisTick: {
    fill: colors.neutral.textMuted,
    fontSize: typography.size.label,
  },
  axisTickSmall: {
    fill: colors.neutral.textMuted,
    fontSize: typography.size.caption,
  },
  tooltip: {
    contentStyle: {
      background: "#1a1a1a",
      border: "1px solid #4b5563",
      color: colors.neutral.textPrimary,
      fontFamily: typography.family.sans,
      fontSize: typography.size.bodySmall,
    },
    labelStyle: {
      color: colors.neutral.textSecondary,
    },
    itemStyle: {
      color: colors.neutral.textPrimary,
    },
  },
};
