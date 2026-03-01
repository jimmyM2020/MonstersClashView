// src/components/batallas/ModalRegistroBatalla.jsx
// Lee el campo "turnos" (tabla normalizada) en lugar del antiguo "registro" JSON.
// Los nombres siempre están disponibles aunque el monstruo haya sido borrado.
import estilos from "./ModalRegistroBatalla.module.css";

export default function ModalRegistroBatalla({ batalla, alCerrar }) {
  const turnos = batalla.turnos ?? [];

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>

        {/* Encabezado */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
          <h3>📜 Batalla #{batalla.id}</h3>
          <button className="btn btn-ghost" onClick={alCerrar}
            style={{ fontSize:"1.2rem", minHeight:"auto", padding:"0.25rem 0.5rem" }}>✕</button>
        </div>

        {/* Participantes */}
        <div className={estilos.participantes}>
          <div className={estilos.participante}>
            {batalla.imagenMonstruo1
              ? <img src={batalla.imagenMonstruo1} alt="" className={estilos.imgParticipante} />
              : <span className={estilos.sinImg}>👻</span>
            }
            <span className={estilos.nombreParticipante}>{batalla.nombreMonstruo1}</span>
            {batalla.idMonstruo1 == null && <span className={estilos.labelEliminado}>eliminado</span>}
          </div>

          <span className={estilos.vsParticipantes}>VS</span>

          <div className={estilos.participante}>
            {batalla.imagenMonstruo2
              ? <img src={batalla.imagenMonstruo2} alt="" className={estilos.imgParticipante} />
              : <span className={estilos.sinImg}>👻</span>
            }
            <span className={estilos.nombreParticipante}>{batalla.nombreMonstruo2}</span>
            {batalla.idMonstruo2 == null && <span className={estilos.labelEliminado}>eliminado</span>}
          </div>
        </div>

        {/* Log de turnos desde tabla normalizada */}
        <div className={estilos.registro}>
          {turnos.length > 0 ? (
            turnos.map((t, i) => (
              <div key={i} className={estilos.entrada}>
                <span className={estilos.turno}>T{t.turno}</span>
                <span>
                  <strong>{t.atacante}</strong>
                  {" → "}
                  {t.defensor}:{" "}
                  <span style={{ color:"var(--rojo)" }}>−{t.dano} HP</span>{" "}
                  <span className="text-muted">(quedan {t.vidaRestante})</span>
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted" style={{ textAlign:"center", padding:"1rem", fontSize:"0.88rem" }}>
              Sin registro de turnos disponible.
            </p>
          )}
        </div>

        {/* Ganador */}
        <div className={estilos.ganador}>
          {batalla.imagenGanador
            ? <img src={batalla.imagenGanador} alt="" className={estilos.imgGanador} />
            : <span style={{ fontSize:"2rem" }}>👑</span>
          }
          <div>
            <div style={{ fontSize:"0.6rem", color:"var(--texto-muted)", fontFamily:"Cinzel,serif", letterSpacing:"0.1em" }}>GANADOR</div>
            <div className="text-gold" style={{ fontFamily:"Cinzel,serif", fontWeight:700, fontSize:"1rem" }}>
              👑 {batalla.nombreGanador}
            </div>
          </div>
        </div>

        <div style={{ marginTop:"1.25rem", textAlign:"right" }}>
          <button className="btn btn-primary" onClick={alCerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
