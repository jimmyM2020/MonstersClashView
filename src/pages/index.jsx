// src/pages/index.jsx — "Mis Monstruos"
import { useState, useEffect } from "react";
import { servicioMonstruos } from "../api/servicioMonstruos";
import VistaMonstruos from "../views/VistaMonstruos";
import { usarNotificacion } from "./_app";

export default function PaginaMonstruos() {
  const [monstruos, setMonstruos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const notificar = usarNotificacion();

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const datos = await servicioMonstruos.obtenerTodos();
      setMonstruos(datos.map(normalizar));
    } catch (err) {
      notificar(err.message || "Error al cargar monstruos", "error");
    } finally {
      setCargando(false);
    }
  }

  // Normaliza snake_case Y PascalCase del backend
  function normalizar(m) {
    return {
      id:        m.id        ?? m.ID,
      nombre:    m.nombre    ?? m.Nombre,
      vida:      m.vida      ?? m.Vida,
      ataque:    m.ataque    ?? m.Ataque,
      defensa:   m.defensa   ?? m.Defensa,
      velocidad: m.velocidad ?? m.Velocidad,
      urlImagen: m.url_imagen ?? m.Url_Imagen ?? m.urlImagen ?? null,
    };
  }

  async function manejarAgregar(datos) {
    try {
      const nuevo = await servicioMonstruos.guardar(datos);
      setMonstruos((prev) => [...prev, nuevo]);
      notificar(`✨ ${nuevo.nombre} añadido a tu colección`);
    } catch (err) {
      notificar(err.message || "Error al crear monstruo", "error");
    }
  }

  async function manejarEditar(id, datos) {
    try {
      const actualizado = await servicioMonstruos.modificar(id, datos);
      setMonstruos((prev) => prev.map((m) => (m.id === id ? actualizado : m)));
      notificar(`✏️ ${actualizado.nombre} actualizado`);
    } catch (err) {
      notificar(err.message || "Error al actualizar monstruo", "error");
    }
  }

  async function manejarEliminar(id) {
    const nombre = monstruos.find((m) => m.id === id)?.nombre;
    try {
      await servicioMonstruos.borrar(id);
      setMonstruos((prev) => prev.filter((m) => m.id !== id));
      notificar(`🗑 ${nombre} eliminado`);
    } catch (err) {
      notificar(err.message || "Error al eliminar monstruo", "error");
    }
  }

  return (
    <VistaMonstruos
      monstruos={monstruos}
      cargando={cargando}
      alAgregar={manejarAgregar}
      alEditar={manejarEditar}
      alEliminar={manejarEliminar}
    />
  );
}
