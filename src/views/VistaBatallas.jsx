// src/views/VistaBatallas.jsx
import { useState } from "react";
import TarjetaMonstruo        from "../components/monstruos/TarjetaMonstruo";
import TarjetaBatalla         from "../components/batallas/TarjetaBatalla";
import ModalSimulacionBatalla from "../components/batallas/ModalSimulacionBatalla";
import ModalRegistroBatalla   from "../components/batallas/ModalRegistroBatalla";
import ModalConfirmacion      from "../components/ui/ModalConfirmacion";
import { servicioBatallas }   from "../api/servicioBatallas";
import estilos from "./VistaBatallas.module.css";

export default function VistaBatallas({ batallas, monstruos, alIniciarBatalla, alEliminarBatalla }) {
  const [seleccionados, setSeleccionados]     = useState([]);
  const [batallaAnimando, setBatallaAnimando] = useState(null);
  const [batallaRegistro, setBatallaRegistro] = useState(null);
  const [batallaBorrando, setBatallaBorrando] = useState(null);
  const [combatiendo, setCombatiendo]         = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  function alternar(id) {
    setSeleccionados((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length < 2)   return [...prev, id];
      // Reemplazar el segundo seleccionado
      return [prev[0], id];
    });
  }

  async function comenzar() {
    if (seleccionados.length !== 2 || combatiendo) return;
    setCombatiendo(true);
    const resultado = await alIniciarBatalla(seleccionados[0], seleccionados[1]);
    setCombatiendo(false);
    setSeleccionados([]);
    if (resultado?.monstruo1 && resultado?.monstruo2) setBatallaAnimando(resultado);
  }

  // Al ver el registro, cargar el detalle si los turnos no están disponibles
  async function verRegistro(batalla) {
    if (batalla.turnos?.length > 0) {
      setBatallaRegistro(batalla);
      return;
    }
    setCargandoDetalle(true);
    try {
      const detalle = await servicioBatallas.obtenerPorId(batalla.id);
      setBatallaRegistro(detalle);
    } catch {
      setBatallaRegistro(batalla); // mostrar aunque sea sin turnos
    } finally {
      setCargandoDetalle(false);
    }
  }

  async function confirmarBorrado() {
    await alEliminarBatalla(batallaBorrando.id);
    setBatallaBorrando(null);
  }

  const m1Sel = monstruos.find((m) => m.id === seleccionados[0]);
  const m2Sel = monstruos.find((m) => m.id === seleccionados[1]);

  return (
    <section className={estilos.seccion}>
      <h1>🏆 Mis Batallas</h1>
      <p className="text-muted" style={{ marginTop: "0.25rem", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
        Selecciona dos de tus monstruos y presiona batallar.
      </p>

      {/* Arena de selección */}
      <div className={estilos.arena}>
        <div className={estilos.ranura}>
          {m1Sel ? (
            <div className={estilos.ranuraOcupada}>
              <img src={m1Sel.urlImagen || "https://via.placeholder.com/60?text=?"} alt="" className={estilos.imgRanura} />
              <span className={estilos.nombreRanura}>{m1Sel.nombre}</span>
            </div>
          ) : (
            <div className={estilos.ranuraVacia}>
              <span className={estilos.interrogacion}>?</span>
              <span>Monstruo 1</span>
            </div>
          )}
        </div>

        <div className={estilos.centroArena}>
          <span className={estilos.textoVs}>VS</span>
          <button
            className="btn btn-primary"
            onClick={comenzar}
            disabled={seleccionados.length !== 2 || combatiendo}
          >
            {combatiendo ? "⚔️ Calculando..." : "⚔️ Batallar"}
          </button>
        </div>

        <div className={estilos.ranura}>
          {m2Sel ? (
            <div className={estilos.ranuraOcupada}>
              <img src={m2Sel.urlImagen || "https://via.placeholder.com/60?text=?"} alt="" className={estilos.imgRanura} />
              <span className={estilos.nombreRanura}>{m2Sel.nombre}</span>
            </div>
          ) : (
            <div className={estilos.ranuraVacia}>
              <span className={estilos.interrogacion}>?</span>
              <span>Monstruo 2</span>
            </div>
          )}
        </div>
      </div>

      {/* Selector de monstruos */}
      <div className="divider">ELIGE TUS COMBATIENTES</div>

      {monstruos.length === 0 ? (
        <p className="text-muted text-center" style={{ padding: "1.5rem", fontSize: "0.9rem" }}>
          No tienes monstruos. Ve a <strong>Mis Monstruos</strong> y crea algunos.
        </p>
      ) : (
        <div className={estilos.cuadriculaMonstruos}>
          {monstruos.map((m) => (
            <TarjetaMonstruo
              key={m.id}
              monstruo={m}
              seleccionable
              seleccionado={seleccionados.includes(m.id)}
              alSeleccionar={() => alternar(m.id)}
            />
          ))}
        </div>
      )}

      {/* Historial */}
      <div className="divider">MI HISTORIAL DE BATALLAS</div>

      {batallas.length === 0 ? (
        <div className={estilos.historialVacio}>
          <span style={{ fontSize: "2.5rem" }}>📜</span>
          <p>Aún no tienes batallas registradas.</p>
        </div>
      ) : (
        <div className={estilos.cuadriculaBatallas}>
          {batallas.map((b) => (
            <TarjetaBatalla
              key={b.id}
              batalla={b}
              alEliminar={setBatallaBorrando}
              alVerRegistro={verRegistro}
            />
          ))}
        </div>
      )}

      {/* Overlay de carga de detalle */}
      {cargandoDetalle && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
          <p style={{ color:"var(--dorado)", fontFamily:"Cinzel,serif", fontSize:"0.9rem" }}>📜 Cargando registro...</p>
        </div>
      )}

      {batallaAnimando && (
        <ModalSimulacionBatalla batalla={batallaAnimando} alFinalizar={() => setBatallaAnimando(null)} />
      )}
      {batallaRegistro && (
        <ModalRegistroBatalla batalla={batallaRegistro} alCerrar={() => setBatallaRegistro(null)} />
      )}
      {batallaBorrando && (
        <ModalConfirmacion
          mensaje={`¿Eliminar la Batalla #${batallaBorrando.id} de tu historial?`}
          alConfirmar={confirmarBorrado}
          alCancelar={() => setBatallaBorrando(null)}
        />
      )}
    </section>
  );
}
