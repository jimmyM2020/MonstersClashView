// src/components/ui/ModalConfirmacion.jsx
export default function ModalConfirmacion({ mensaje, alConfirmar, alCancelar }) {
  return (
    <div className="modal-overlay" onClick={alCancelar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <h3 style={{ marginBottom: "1rem" }}>¿Estás seguro?</h3>
        <p style={{ color: "var(--texto-secundario)", marginBottom: "1.5rem" }}>{mensaje}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={alCancelar}>Cancelar</button>
          <button className="btn btn-danger"    onClick={alConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
