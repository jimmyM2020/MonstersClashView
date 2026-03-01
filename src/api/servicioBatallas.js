// src/api/servicioBatallas.js
import { GET, POST, DELETE } from "./clienteHttp";

export const servicioBatallas = {
  async obtenerTodas() {
    const r = await GET("/batallas");
    return r.datos.map(normalizarBatalla);
  },

  async obtenerPorId(id) {
    const r = await GET(`/batallas/${id}`);
    return normalizarBatalla(r.datos);
  },

  async iniciarBatalla(idMonstruo1, idMonstruo2) {
    const r = await POST("/batallas", {
      id_monstruo1: idMonstruo1,
      id_monstruo2: idMonstruo2,
    });
    return normalizarBatalla(r.datos);
  },

  async borrar(id) {
    return DELETE(`/batallas/${id}`);
  },
};

// Acepta snake_case y PascalCase del backend
function normalizarBatalla(b) {
  // IDs — soporta ambas convenciones
  const idM1      = b.id_monstruo1       ?? b.ID_Monstruo1;
  const idM2      = b.id_monstruo2       ?? b.ID_Monstruo2;
  const idGanador = b.id_ganador         ?? b.ID_Monstruo_Ganador;
  const idPerdedor= b.id_perdedor        ?? b.ID_Monstruo_Perdedor;

  // Nombres e imágenes
  const nombreM1  = b.nombre_monstruo1   ?? b.nombre_monstruo1;
  const imagenM1  = b.imagen_monstruo1   ?? null;
  const nombreM2  = b.nombre_monstruo2   ?? b.nombre_monstruo2;
  const imagenM2  = b.imagen_monstruo2   ?? null;
  const nombreGanador  = b.nombre_ganador  ?? b.nombre_ganador  ?? "";
  const imagenGanador  = b.imagen_ganador  ?? null;
  const nombrePerdedor = b.nombre_perdedor ?? b.nombre_perdedor ?? "";

  // Estado activo (soft delete)
  const activoM1  = b.activo_monstruo1   ?? 1;
  const activoM2  = b.activo_monstruo2   ?? 1;

  // Turnos: vienen del GET /:id o del POST como "turnos"
  const turnos = (b.turnos ?? []).map((t) => ({
    turno:        t.turno,
    orden:        t.orden        ?? 1,
    idAtacante:   t.idAtacante   ?? t.id_atacante  ?? null,
    atacante:     t.atacante     ?? "",
    idDefensor:   t.idDefensor   ?? t.id_defensor  ?? null,
    defensor:     t.defensor     ?? "",
    dano:         t.dano,
    vidaRestante: t.vidaRestante ?? t.vida_restante_defensor ?? 0,
  }));

  // Objetos monstruo completos para ModalSimulacion (solo en POST o GET /:id)
  const monstruo1 = construirMonstruoAnimacion({
    id:        idM1,
    nombre:    nombreM1,
    imagen:    imagenM1,
    vida:      b.vida_monstruo1,
    ataque:    b.ataque_monstruo1,
    defensa:   b.defensa_monstruo1,
    velocidad: b.velocidad_monstruo1,
  }) ?? (b.monstruo1 ? normalizarMonstruoRaw(b.monstruo1) : null);

  const monstruo2 = construirMonstruoAnimacion({
    id:        idM2,
    nombre:    nombreM2,
    imagen:    imagenM2,
    vida:      b.vida_monstruo2,
    ataque:    b.ataque_monstruo2,
    defensa:   b.defensa_monstruo2,
    velocidad: b.velocidad_monstruo2,
  }) ?? (b.monstruo2 ? normalizarMonstruoRaw(b.monstruo2) : null);

  return {
    id:              b.id            ?? b.ID,
    idMonstruo1:     idM1,
    idMonstruo2:     idM2,
    idGanador,
    idPerdedor,
    nombreMonstruo1: nombreM1,
    imagenMonstruo1: imagenM1,
    activoMonstruo1: activoM1,
    nombreMonstruo2: nombreM2,
    imagenMonstruo2: imagenM2,
    activoMonstruo2: activoM2,
    nombreGanador,
    imagenGanador,
    nombrePerdedor,
    turnos,
    fecha:           b.creado_en ?? b.Fecha_creado ?? null,
    monstruo1,
    monstruo2,
  };
}

function construirMonstruoAnimacion({ id, nombre, imagen, vida, ataque, defensa, velocidad }) {
  if (!nombre || vida == null) return null;
  return {
    id,
    nombre,
    urlImagen: imagen ?? null,
    vida:      Number(vida),
    ataque:    Number(ataque),
    defensa:   Number(defensa),
    velocidad: Number(velocidad),
  };
}

function normalizarMonstruoRaw(m) {
  return {
    id:        m.id,
    nombre:    m.nombre,
    urlImagen: m.url_imagen ?? m.urlImagen ?? null,
    vida:      Number(m.vida),
    ataque:    Number(m.ataque),
    defensa:   Number(m.defensa),
    velocidad: Number(m.velocidad),
  };
}
