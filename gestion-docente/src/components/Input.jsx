import { C } from "../constants/constants";

export function Input({ value, onChange, placeholder, style: sx, ...rest }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: C.input, border: "1px solid #333", borderRadius: 8,
        padding: "7px 12px", color: "#eee", fontSize: 13,
        fontFamily: "'Roboto',sans-serif", outline: "none",
        width: "100%", boxSizing: "border-box", ...sx
      }}
      {...rest}
    />
  );
}
