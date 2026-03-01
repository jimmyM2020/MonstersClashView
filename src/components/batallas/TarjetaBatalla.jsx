// src/components/batallas/TarjetaBatalla.jsx
import estilos from "./TarjetaBatalla.module.css";

export default function TarjetaBatalla({ batalla, alEliminar, alVerRegistro }) {
  const fecha = batalla.fecha
    ? new Date(batalla.fecha).toLocaleDateString("es", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  // Comparación con == para no fallar si uno es string y otro number
  const esGanador = (id) => id != null && id == batalla.idGanador;

  const combatientes = [
    { id: batalla.idMonstruo1, nombre: batalla.nombreMonstruo1, imagen: batalla.imagenMonstruo1, activo: batalla.activoMonstruo1 },
    { id: batalla.idMonstruo2, nombre: batalla.nombreMonstruo2, imagen: batalla.imagenMonstruo2, activo: batalla.activoMonstruo2 },
  ];

  return (
    <div className={`card ${estilos.tarjeta}`}>
      <div className={estilos.encabezado}>
        <span className="badge badge-gold">⚔️ #{batalla.id}</span>
        <span className={estilos.fecha}>{fecha}</span>
      </div>

      <div className={estilos.combatientes}>
        {combatientes.map((m, i) => {
          const gano       = esGanador(m.id);
          const desactivado = !m.activo;
          return (
            <div key={i} className={[
              estilos.luchador,
              gano        ? estilos.ganador    : estilos.perdedor,
              desactivado ? estilos.desactivado : "",
            ].join(" ")}>
              {i === 1 && <div className={estilos.vs}>VS</div>}
              <div className={estilos.contenedorImagen}>
                {m.imagen
                  ? <img src={m.imagen} alt={m.nombre} className={estilos.imagen} />
                  : <span className={estilos.sinImagen}>👾</span>
                }
              </div>
              <span className={estilos.nombreLuchador} title={m.nombre}>{m.nombre}</span>
              {gano       && <span className="badge badge-gold">👑</span>}
              {desactivado && <span className={estilos.badgeDesactivado}>desactivado</span>}
            </div>
          );
        })}
      </div>

      <p className={estilos.resultado}>
        🏆 <strong className="text-gold">{batalla.nombreGanador}</strong>{" "}
        derrotó a <strong className="text-red">{batalla.nombrePerdedor}</strong>
      </p>

      <div className={estilos.acciones}>
        {/* Siempre mostrar "Ver combate" — si no tiene turnos los cargará el handler */}
        {alVerRegistro && (
          <button className="btn btn-secondary" onClick={() => alVerRegistro(batalla)}>
            📜 Ver combate
          </button>
        )}
        <button className="btn btn-danger" onClick={() => alEliminar(batalla)}>
          🗑 Eliminar
        </button>
      </div>
    </div>
  );
}
