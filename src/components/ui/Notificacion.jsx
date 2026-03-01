// src/components/ui/Notificacion.jsx
import { useEffect } from "react";
export default function Notificacion({ mensaje, tipo = "exito", alCerrar }) {
  useEffect(() => { const t = setTimeout(alCerrar, 3500); return () => clearTimeout(t); }, [alCerrar]);
  return (
    <div className={`toast toast-${tipo === "exito" ? "success" : "error"}`}>
      <span style={{ marginRight: "0.5rem", fontWeight: 700 }}>{tipo === "exito" ? "✓" : "✗"}</span>
      {mensaje}
    </div>
  );
}
