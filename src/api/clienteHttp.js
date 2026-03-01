// src/api/clienteHttp.js
// Capa HTTP central. Lee el token JWT de localStorage y lo agrega
// automáticamente al header Authorization en todas las peticiones.

const URL_BASE = process.env.NEXT_PUBLIC_URL_API || "http://localhost:3001/api";

function obtenerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bm_token");
}

function construirHeaders(incluirAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (incluirAuth) {
    const token = obtenerToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function manejarRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    error.datos  = datos;
    throw error;
  }
  return datos;
}

// ── Métodos HTTP ────────────────────────────────────────────────

export async function GET(ruta, auth = true) {
  const res = await fetch(`${URL_BASE}${ruta}`, {
    method: "GET",
    headers: construirHeaders(auth),
  });
  return manejarRespuesta(res);
}

export async function POST(ruta, cuerpo, auth = true) {
  const res = await fetch(`${URL_BASE}${ruta}`, {
    method: "POST",
    headers: construirHeaders(auth),
    body: JSON.stringify(cuerpo),
  });
  return manejarRespuesta(res);
}

export async function PUT(ruta, cuerpo) {
  const res = await fetch(`${URL_BASE}${ruta}`, {
    method: "PUT",
    headers: construirHeaders(),
    body: JSON.stringify(cuerpo),
  });
  return manejarRespuesta(res);
}

export async function DELETE(ruta) {
  const res = await fetch(`${URL_BASE}${ruta}`, {
    method: "DELETE",
    headers: construirHeaders(),
  });
  return manejarRespuesta(res);
}
