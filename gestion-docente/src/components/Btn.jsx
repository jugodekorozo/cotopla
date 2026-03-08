import { C } from "../constants/constants";
import { colors, radius, spacing, typography, uiStates } from "../design";

const BTN_VARIANTS = {
  primary: { bg: C.green, fg: colors.neutral.textPrimary, border: "none" },
  secondary: { bg: C.orange, fg: colors.neutral.textPrimary, border: "none" },
  ghost: { bg: "transparent", fg: colors.neutral.textSecondary, border: "1px solid #3a3a3a" },
  danger: { bg: uiStates.danger.bg, fg: colors.semantic.danger, border: "1px solid " + uiStates.danger.border },
};

export function Btn({
  children,
  onClick,
  variant,
  color = C.green,
  small,
  disabled,
  style: sx,
  ...rest
}) {
  const v = variant ? (BTN_VARIANTS[variant] || BTN_VARIANTS.primary) : null;
  const baseBg = v ? v.bg : color;
  const baseColor = v ? v.fg : colors.neutral.textPrimary;
  const baseBorder = v ? v.border : "none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? `${spacing[1] + 1}px ${spacing[3]}px` : `${spacing[2]}px ${spacing[4] + 2}px`,
        borderRadius: radius.medium,
        border: baseBorder,
        background: disabled ? uiStates.disabled.bg : baseBg,
        color: disabled ? uiStates.disabled.text : baseColor,
        fontWeight: typography.weight.semibold,
        fontSize: small ? typography.size.bodySmall - 1 : typography.size.body,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: typography.family.sans,
        whiteSpace: "nowrap",
        transition: "filter 160ms ease, transform 160ms ease, border-color 160ms ease, opacity 160ms ease",
        opacity: disabled ? 0.6 : 1,
        ...sx,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = "brightness(1)";
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
