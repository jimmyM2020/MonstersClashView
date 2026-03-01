// src/api/servicioMonstruos.js
import { GET, POST, PUT, DELETE } from "./clienteHttp";

export const servicioMonstruos = {
  async obtenerTodos() {
    const respuesta = await GET("/monstruos");
    return respuesta.datos.map(normalizarMonstruo);
  },

  async obtenerPorId(id) {
    const respuesta = await GET(`/monstruos/${id}`);
    return normalizarMonstruo(respuesta.datos);
  },

  async guardar(datos) {
    const cuerpo = {
      nombre:     datos.nombre,
      vida:       datos.vida,
      ataque:     datos.ataque,
      defensa:    datos.defensa,
      velocidad:  datos.velocidad,
      url_imagen: datos.urlImagen || null,
    };
    const respuesta = await POST("/monstruos", cuerpo);
    return normalizarMonstruo(respuesta.datos);
  },

  async modificar(id, datos) {
    const cuerpo = {
      nombre:     datos.nombre,
      vida:       datos.vida,
      ataque:     datos.ataque,
      defensa:    datos.defensa,
      velocidad:  datos.velocidad,
      url_imagen: datos.urlImagen || null,
    };
    const respuesta = await PUT(`/monstruos/${id}`, cuerpo);
    return normalizarMonstruo(respuesta.datos);
  },

  async borrar(id) {
    return DELETE(`/monstruos/${id}`);
  },
};

// Acepta tanto snake_case como PascalCase que pueda devolver el backend
function normalizarMonstruo(m) {
  return {
    id:        m.id        ?? m.ID,
    nombre:    m.nombre    ?? m.Nombre,
    vida:      Number(m.vida      ?? m.Vida      ?? 0),
    ataque:    Number(m.ataque    ?? m.Ataque    ?? 0),
    defensa:   Number(m.defensa   ?? m.Defensa   ?? 0),
    velocidad: Number(m.velocidad ?? m.Velocidad ?? 0),
    urlImagen: m.url_imagen ?? m.Url_Imagen ?? m.urlImagen ?? null,
    creadoEn:  m.creado_en ?? m.Fecha_Creado ?? null,
  };
}
