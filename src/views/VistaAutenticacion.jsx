// src/views/VistaAutenticacion.jsx
// Formulario de login y registro en un mismo componente con pestañas.
import { useState } from "react";
import estilos from "./VistaAutenticacion.module.css";

export default function VistaAutenticacion({ alIniciarSesion, alRegistrarse, cargando, errorServidor }) {
  const [pestana, setPestana] = useState("login"); // "login" | "registro"
  const [form, setForm]       = useState({ nombre: "", email: "", contrasena: "" });
  const [errores, setErrores] = useState({});

  function cambiar(ev) {
    const { name, value } = ev.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errores[name]) setErrores((p) => ({ ...p, [name]: undefined }));
  }

  function validar() {
    const e = {};
    if (pestana === "registro" && !form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email inválido";
    if (!form.contrasena || form.contrasena.length < 6)  e.contrasena = "Mínimo 6 caracteres";
    return e;
  }

  async function enviar(ev) {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) { setErrores(e); return; }
    if (pestana === "login") await alIniciarSesion(form.email, form.contrasena);
    else                     await alRegistrarse(form.nombre, form.email, form.contrasena);
  }

  function cambiarPestana(p) { setPestana(p); setErrores({}); }

  return (
    <div className={estilos.contenedor}>
      <div className={estilos.tarjeta}>
        {/* Logo */}
        <div className={estilos.encabezado}>
          {/* <span className={estilos.icono}>🐉</span> */}
          <h1 className={estilos.titulo}>Monster Clash</h1>
        </div>

        {/* Pestañas */}
        <div className={estilos.pestanas}>
          <button className={`${estilos.pestana} ${pestana === "login" ? estilos.pestanaActiva : ""}`} onClick={() => cambiarPestana("login")}>Iniciar Sesión</button>
          <button className={`${estilos.pestana} ${pestana === "registro" ? estilos.pestanaActiva : ""}`} onClick={() => cambiarPestana("registro")}>Registrarse</button>
        </div>

        {/* Formulario */}
        <form onSubmit={enviar} className={estilos.formulario} noValidate>
          {pestana === "registro" && (
            <div className={estilos.campo}>
              <label className="form-label">Nombre</label>
              <input className="form-input" name="nombre" value={form.nombre} onChange={cambiar} placeholder="Tu nombre" />
              {errores.nombre && <span className={estilos.error}>{errores.nombre}</span>}
            </div>
          )}

          <div className={estilos.campo}>
            <label className="form-label">Correo electrónico</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={cambiar} placeholder="correo@ejemplo.com" />
            {errores.email && <span className={estilos.error}>{errores.email}</span>}
          </div>

          <div className={estilos.campo}>
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" name="contrasena" value={form.contrasena} onChange={cambiar} placeholder="••••••••" />
            {errores.contrasena && <span className={estilos.error}>{errores.contrasena}</span>}
          </div>

          {errorServidor && <div className={estilos.errorServidor}>{errorServidor}</div>}

          <button type="submit" className="btn btn-primary" disabled={cargando} style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
            {cargando ? "Cargando..." : pestana === "login" ? "Entrar al combate" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
