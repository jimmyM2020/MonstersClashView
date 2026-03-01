// src/components/ui/BarraEstadistica.jsx
const COLORES = {
  vida:      { relleno: "#27ae60", etiqueta: "VIDA"  },
  ataque:    { relleno: "#c0392b", etiqueta: "ATAQUE" },
  defensa:   { relleno: "#4a90d9", etiqueta: "DEFENSA" },
  velocidad: { relleno: "#e8b84b", etiqueta: "VELOCIDAD" },
};
const MAX = 200;

export default function BarraEstadistica({ estadistica, valor }) {
  const config = COLORES[estadistica] || { relleno: "#9090b0", etiqueta: estadistica };
  const pct    = Math.min(100, (valor / MAX) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.7rem", fontFamily: "Cinzel,serif", letterSpacing: "0.1em", color: "var(--texto-muted)", textTransform: "uppercase" }}>{config.etiqueta}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{valor}</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: config.relleno }} />
      </div>
    </div>
  );
}
