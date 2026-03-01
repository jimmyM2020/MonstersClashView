// src/views/VistaMonstruos.jsx
// Muestra SOLO los monstruos del usuario autenticado.
import { useState } from "react";
import TarjetaMonstruo    from "../components/monstruos/TarjetaMonstruo";
import FormularioMonstruo from "../components/monstruos/FormularioMonstruo";
import ModalConfirmacion  from "../components/ui/ModalConfirmacion";
import estilos from "./VistaMonstruos.module.css";

export default function VistaMonstruos({ monstruos, alAgregar, alEditar, alEliminar, cargando }) {
  const [mostrarForm, setMostrarForm]           = useState(false);
  const [monstruoEditando, setMonstruoEditando] = useState(null);
  const [monstruoBorrando, setMonstruoBorrando] = useState(null);
  const [guardando, setGuardando]               = useState(false);

  async function manejarGuardado(datos) {
    setGuardando(true);
    if (monstruoEditando) await alEditar(monstruoEditando.id, datos);
    else                  await alAgregar(datos);
    setGuardando(false);
    setMostrarForm(false);
    setMonstruoEditando(null);
  }

  function abrirEdicion(m) { setMonstruoEditando(m); setMostrarForm(true); }
  function cerrar()        { setMostrarForm(false); setMonstruoEditando(null); }

  async function confirmarBorrado() {
    await alEliminar(monstruoBorrando.id);
    setMonstruoBorrando(null);
  }

  return (
    <section className={estilos.seccion}>
      {/* Encabezado */}
      <div className={estilos.encabezado}>
        <div>
          <h1>⚔️ Mis Monstruos</h1>
          <p className="text-muted" style={{ marginTop: "0.2rem", fontSize: "0.9rem" }}>
            {cargando
              ? "Cargando..."
              : `${monstruos.length} monstruo${monstruos.length !== 1 ? "s" : ""} en tu colección`}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setMonstruoEditando(null); setMostrarForm(true); }}
        >
          ➕ Nuevo
        </button>
      </div>

      <div className="divider">MI COLECCIÓN</div>

      {/* Estados */}
      {cargando ? (
        <div className={estilos.vacio}>
          <span style={{ fontSize: "2rem" }}>⏳</span>
          <p>Cargando monstruos...</p>
        </div>
      ) : monstruos.length === 0 ? (
        <div className={estilos.vacio}>
          <span style={{ fontSize: "2.5rem" }}>🐾</span>
          <p>No tienes monstruos aún.</p>
          <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
            ➕ Crear mi primer monstruo
          </button>
        </div>
      ) : (
        <div className={estilos.cuadricula}>
          {monstruos.map((m) => (
            <TarjetaMonstruo
              key={m.id}
              monstruo={m}
              alEditar={abrirEdicion}
              alEliminar={setMonstruoBorrando}
            />
          ))}
        </div>
      )}

      {/* Modal formulario */}
      {mostrarForm && (
        <div className="modal-overlay" onClick={cerrar}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <FormularioMonstruo
              inicial={monstruoEditando}
              alGuardar={manejarGuardado}
              alCancelar={cerrar}
              cargando={guardando}
            />
          </div>
        </div>
      )}

      {/* Modal confirmación borrado */}
      {monstruoBorrando && (
        <ModalConfirmacion
          mensaje={`¿Eliminar a "${monstruoBorrando.nombre}"? Esta acción no se puede deshacer.`}
          alConfirmar={confirmarBorrado}
          alCancelar={() => setMonstruoBorrando(null)}
        />
      )}
    </section>
  );
}
