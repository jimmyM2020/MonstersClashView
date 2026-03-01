// src/components/monstruos/TarjetaMonstruo.jsx
import BarraEstadistica from "../ui/BarraEstadistica";
import estilos from "./TarjetaMonstruo.module.css";

export default function TarjetaMonstruo({ monstruo, alEditar, alEliminar, seleccionable = false, seleccionado = false, alSeleccionar }) {
  return (
    <div
      className={`card ${estilos.tarjeta} ${seleccionable ? estilos.seleccionable : ""} ${seleccionado ? estilos.seleccionado : ""}`}
      onClick={seleccionable ? alSeleccionar : undefined}
    >
      <div className={estilos.contenedorImagen}>
        <img
          src={monstruo.urlImagen || "https://via.placeholder.com/120?text=?"}
          alt={monstruo.nombre}
          className={estilos.imagen}
          onError={(e) => { e.target.src = "https://via.placeholder.com/120?text=?"; }}
        />
        {seleccionado && <div className={estilos.insignia}>✓</div>}
      </div>
      <div className={estilos.cuerpo}>
        <h3 className={estilos.nombre}>{monstruo.nombre}</h3>
        <div className={estilos.estadisticas}>
          <BarraEstadistica estadistica="vida"      valor={monstruo.vida} />
          <BarraEstadistica estadistica="ataque"    valor={monstruo.ataque} />
          <BarraEstadistica estadistica="defensa"   valor={monstruo.defensa} />
          <BarraEstadistica estadistica="velocidad" valor={monstruo.velocidad} />
        </div>
        {(alEditar || alEliminar) && (
          <div className={estilos.acciones}>
            {alEditar && <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); alEditar(monstruo); }}>✏️ Editar</button>}
            {alEliminar && <button className="btn btn-danger"  onClick={(e) => { e.stopPropagation(); alEliminar(monstruo); }}>🗑 Eliminar</button>}
          </div>
        )}
      </div>
    </div>
  );
}
