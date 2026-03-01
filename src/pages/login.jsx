// src/pages/login.jsx
// Ruta pública. Redirige a "/" si ya hay sesión activa.
import { useState } from "react";
import { useRouter } from "next/router";
import { servicioAuth } from "../api/servicioAuth";
import VistaAutenticacion from "../views/VistaAutenticacion";

export default function PaginaLogin() {
  const [cargando, setCargando]       = useState(false);
  const [errorServidor, setError]     = useState("");
  const enrutador = useRouter();

  async function manejarLogin(email, contrasena) {
    setCargando(true);
    setError("");
    try {
      await servicioAuth.iniciarSesion(email, contrasena);
      enrutador.push("/");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  async function manejarRegistro(nombre, email, contrasena) {
    setCargando(true);
    setError("");
    try {
      await servicioAuth.registrar(nombre, email, contrasena);
      enrutador.push("/");
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setCargando(false);
    }
  }

  return (
    <VistaAutenticacion
      alIniciarSesion={manejarLogin}
      alRegistrarse={manejarRegistro}
      cargando={cargando}
      errorServidor={errorServidor}
    />
  );
}
