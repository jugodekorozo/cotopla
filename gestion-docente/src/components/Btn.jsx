import { C } from "../constants/constants";

export function Btn({ children, onClick, color = C.green, small, style: sx, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "5px 12px" : "8px 18px", borderRadius: 8, border: "none",
        background: color, color: "#fff", fontWeight: 600,
        fontSize: small ? 11 : 13, cursor: "pointer",
        fontFamily: "'Roboto',sans-serif", whiteSpace: "nowrap", ...sx
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
