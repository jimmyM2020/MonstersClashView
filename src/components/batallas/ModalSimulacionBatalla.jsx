// src/components/batallas/ModalSimulacionBatalla.jsx
// Anima la batalla turno a turno. Lee "batalla.turnos" (nuevo nombre del campo,
// equivale al antiguo "registro").
import { useState, useEffect, useRef } from "react";
import estilos from "./ModalSimulacionBatalla.module.css";

const DEMORA_INICIO = 600;
const DEMORA_TURNO  = 900;

export default function ModalSimulacionBatalla({ batalla, alFinalizar }) {
  const m1 = batalla.monstruo1;
  const m2 = batalla.monstruo2;

  const [vida1, setVida1]             = useState(m1.vida);
  const [vida2, setVida2]             = useState(m2.vida);
  const [indiceTurno, setIndiceTurno] = useState(-1);
  const [textoTurno, setTextoTurno]   = useState("⚔️ ¡La batalla comienza!");
  const [idAtacante, setIdAtacante]   = useState(null);
  const [flash1, setFlash1]           = useState(false);
  const [flash2, setFlash2]           = useState(false);
  const [finalizado, setFinalizado]   = useState(false);
  const refLog = useRef(null);

  // Usar "turnos" (nuevo) con fallback a "registro" (compatibilidad)
  const pasos  = batalla.turnos ?? batalla.registro ?? [];
  const ganador = batalla.idGanador === m1.id ? m1 : m2;

  useEffect(() => {
    if (indiceTurno === -1) {
      const t = setTimeout(() => setIndiceTurno(0), DEMORA_INICIO);
      return () => clearTimeout(t);
    }
    if (indiceTurno >= pasos.length) {
      setTextoTurno(`🏆 ¡${ganador.nombre} ha ganado!`);
      setIdAtacante(null);
      setFinalizado(true);
      return;
    }

    const paso = pasos[indiceTurno];
    const atacaM1 = paso.idAtacante === m1.id;

    setIdAtacante(paso.idAtacante);
    setTextoTurno(`Turno ${paso.turno}: ${paso.atacante} → ${paso.defensor} (−${paso.dano} HP)`);

    if (atacaM1) {
      setFlash2(true);
      setTimeout(() => setFlash2(false), 400);
      setVida2(paso.vidaRestante);
    } else {
      setFlash1(true);
      setTimeout(() => setFlash1(false), 400);
      setVida1(paso.vidaRestante);
    }

    if (refLog.current) refLog.current.scrollTop = refLog.current.scrollHeight;

    const t = setTimeout(() => setIndiceTurno((i) => i + 1), DEMORA_TURNO);
    return () => clearTimeout(t);
  }, [indiceTurno]);

  function pct(actual, max) { return Math.max(0, Math.min(100, (actual / max) * 100)); }
  function colorVida(p) { return p > 60 ? "#27ae60" : p > 30 ? "#e8b84b" : "#c0392b"; }

  const p1 = pct(vida1, m1.vida);
  const p2 = pct(vida2, m2.vida);
  const pasosVistos = pasos.slice(0, Math.max(0, indiceTurno));

  return (
    <div className="modal-overlay">
      <div className={`modal-box ${estilos.modal}`}>
        <h2 className={estilos.titulo}>⚔️ Simulación de Batalla</h2>

        {/* Arena */}
        <div className={estilos.arena}>
          {/* Monstruo 1 */}
          <div className={[
            estilos.combatiente,
            idAtacante === m1.id  ? estilos.atacando   : "",
            flash1                ? estilos.dano        : "",
            finalizado && ganador.id === m1.id ? estilos.victorioso : "",
            finalizado && ganador.id !== m1.id ? estilos.derrotado  : "",
          ].join(" ")}>
            <img
              src={m1.urlImagen || "https://via.placeholder.com/80?text=?"}
              alt={m1.nombre} className={estilos.imgCombatiente}
            />
            <span className={estilos.nombreCombatiente}>{m1.nombre}</span>
            <div className={estilos.vidaContenedor}>
              <div className={estilos.vidaRiel}>
                <div className={estilos.vidaRelleno} style={{ width:`${p1}%`, background:colorVida(p1) }} />
              </div>
              <span className={estilos.vidaTexto}>{vida1} / {m1.vida}</span>
            </div>
            {flash1 && <div className={estilos.explosion}>💥</div>}
            {finalizado && ganador.id === m1.id && <div className={estilos.corona}>👑</div>}
          </div>

          {/* VS central */}
          <div className={estilos.centroVs}>
            <span className={estilos.textoVs}>VS</span>
            {indiceTurno >= 0 && !finalizado && indiceTurno < pasos.length && (
              <span className={estilos.etiquetaTurno}>T{pasos[indiceTurno]?.turno}</span>
            )}
          </div>

          {/* Monstruo 2 */}
          <div className={[
            estilos.combatiente, estilos.derechaCombatiente,
            idAtacante === m2.id  ? estilos.atacando   : "",
            flash2                ? estilos.dano        : "",
            finalizado && ganador.id === m2.id ? estilos.victorioso : "",
            finalizado && ganador.id !== m2.id ? estilos.derrotado  : "",
          ].join(" ")}>
            <img
              src={m2.urlImagen || "https://via.placeholder.com/80?text=?"}
              alt={m2.nombre}
              className={`${estilos.imgCombatiente} ${estilos.invertido}`}
            />
            <span className={estilos.nombreCombatiente}>{m2.nombre}</span>
            <div className={estilos.vidaContenedor}>
              <div className={estilos.vidaRiel}>
                <div className={estilos.vidaRelleno} style={{ width:`${p2}%`, background:colorVida(p2) }} />
              </div>
              <span className={estilos.vidaTexto}>{vida2} / {m2.vida}</span>
            </div>
            {flash2 && <div className={estilos.explosion}>💥</div>}
            {finalizado && ganador.id === m2.id && <div className={estilos.corona}>👑</div>}
          </div>
        </div>

        {/* Mensaje de turno */}
        <div className={estilos.mensajeTurno}>
          <p key={indiceTurno} className={estilos.textoMensaje}>{textoTurno}</p>
        </div>

        {/* Log progresivo */}
        {pasosVistos.length > 0 && (
          <div className={estilos.log} ref={refLog}>
            {pasosVistos.map((p, i) => (
              <div key={i} className={estilos.entradaLog}>
                <span className={estilos.etiquetaLog}>T{p.turno}</span>
                <span>
                  <strong>{p.atacante}</strong> → {p.defensor}:{" "}
                  <span style={{ color:"#c0392b" }}>−{p.dano}</span>{" "}
                  <span className="text-muted">(queda: {p.vidaRestante})</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pantalla de victoria */}
        {finalizado && (
          <div className={estilos.victoria}>
            <img
              src={ganador.urlImagen || "https://via.placeholder.com/72?text=?"}
              alt={ganador.nombre} className={estilos.imgGanador}
            />
            <h3 className={estilos.tituloVictoria}>¡{ganador.nombre} ganó!</h3>
            <button className="btn btn-primary" onClick={alFinalizar} style={{ marginTop:"0.75rem" }}>
              Ver historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
