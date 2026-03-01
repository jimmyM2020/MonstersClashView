// src/api/servicioAuth.js
// Maneja registro, login y cierre de sesión.
// Guarda/elimina el JWT en localStorage.

import { POST, GET } from "./clienteHttp";

export const servicioAuth = {
  async registrar(nombre, email, contrasena) {
    const respuesta = await POST("/auth/registro", { nombre, email, contrasena }, false);
    localStorage.setItem("bm_token",   respuesta.datos.token);
    localStorage.setItem("bm_usuario", JSON.stringify(respuesta.datos.usuario));
    return respuesta.datos;
  },

  async iniciarSesion(email, contrasena) {
    const respuesta = await POST("/auth/login", { email, contrasena }, false);
    localStorage.setItem("bm_token",   respuesta.datos.token);
    localStorage.setItem("bm_usuario", JSON.stringify(respuesta.datos.usuario));
    return respuesta.datos;
  },

  cerrarSesion() {
    localStorage.removeItem("bm_token");
    localStorage.removeItem("bm_usuario");
  },

  obtenerUsuarioActual() {
    if (typeof window === "undefined") return null;
    const datos = localStorage.getItem("bm_usuario");
    return datos ? JSON.parse(datos) : null;
  },

  estaAutenticado() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("bm_token");
  },

  async obtenerPerfil() {
    const respuesta = await GET("/auth/perfil");
    return respuesta.datos;
  },
};
