// src/components/monstruos/FormularioMonstruo.jsx
import { useState } from "react";
import estilos from "./FormularioMonstruo.module.css";

const VACIO = { nombre: "", vida: "", ataque: "", defensa: "", velocidad: "", urlImagen: "" };

export default function FormularioMonstruo({ inicial, alGuardar, alCancelar, cargando }) {
  const [form, setForm] = useState(inicial
    ? { nombre: inicial.nombre, vida: inicial.vida, ataque: inicial.ataque, defensa: inicial.defensa, velocidad: inicial.velocidad, urlImagen: inicial.urlImagen || "" }
    : VACIO);
  const [errores, setErrores] = useState({});

  function validar() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    ["vida", "ataque", "defensa", "velocidad"].forEach((c) => {
      const v = Number(form[c]);
      if (!form[c] && form[c] !== 0) e[c] = "Requerido";
      else if (isNaN(v) || !Number.isInteger(v) || v < 1) e[c] = "Número entero mayor a 0";
      else if (v > 999) e[c] = "Máximo 999";
    });
    return e;
  }

  function manejarCambio(ev) {
    const { name, value } = ev.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errores[name]) setErrores((p) => ({ ...p, [name]: undefined }));
  }

  function manejarEnvio(ev) {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) { setErrores(e); return; }
    alGuardar({ nombre: form.nombre.trim(), vida: Number(form.vida), ataque: Number(form.ataque), defensa: Number(form.defensa), velocidad: Number(form.velocidad), urlImagen: form.urlImagen.trim() });
  }

  const campos = [
    { clave: "vida",      etiqueta: "Vida",  icono: "❤️" },
    { clave: "ataque",    etiqueta: "Ataque",      icono: "⚔️" },
    { clave: "defensa",   etiqueta: "Defensa",     icono: "🛡️" },
    { clave: "velocidad", etiqueta: "Velocidad",   icono: "💨" },
  ];

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }} noValidate>
      <h2 style={{ marginBottom: "0.5rem" }}>{inicial ? "✏️ Editar Monstruo" : "➕ Nuevo Monstruo"}</h2>

      <div className={estilos.campo}>
        <label className="form-label">Nombre</label>
        <input className="form-input" name="nombre" value={form.nombre} onChange={manejarCambio} placeholder="Ej: Dragón de Fuego" />
        {errores.nombre && <span className={estilos.error}>{errores.nombre}</span>}
      </div>

      <div className={estilos.grilla}>
        {campos.map(({ clave, etiqueta, icono }) => (
          <div className={estilos.campo} key={clave}>
            <label className="form-label">{icono} {etiqueta}</label>
            <input className="form-input" type="number" name={clave} value={form[clave]} onChange={manejarCambio} min={1} max={999} placeholder="1–999" />
            {errores[clave] && <span className={estilos.error}>{errores[clave]}</span>}
          </div>
        ))}
      </div>

      <div className={estilos.campo}>
        <label className="form-label">URL de Imagen</label>
        <input className="form-input" name="urlImagen" value={form.urlImagen} onChange={manejarCambio} placeholder="https://..." />
        {form.urlImagen && (
          <div className={estilos.preview}>
            <img src={form.urlImagen} alt="preview" onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-secondary" onClick={alCancelar} disabled={cargando}>Cancelar</button>
        <button type="submit"  className="btn btn-primary"   disabled={cargando}>{cargando ? "Guardando..." : inicial ? "Guardar cambios" : "Crear monstruo"}</button>
      </div>
    </form>
  );
}
