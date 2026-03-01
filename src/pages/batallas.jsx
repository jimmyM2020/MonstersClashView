// src/pages/batallas.jsx — "Mis Batallas"
import { useState, useEffect } from "react";
import { servicioMonstruos } from "../api/servicioMonstruos";
import { servicioBatallas }  from "../api/servicioBatallas";
import VistaBatallas from "../views/VistaBatallas";
import { usarNotificacion } from "./_app";

export default function PaginaBatallas() {
  const [monstruos, setMonstruos] = useState([]);
  const [batallas, setBatallas]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const notificar = usarNotificacion();

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    try {
      // servicioMonstruos.obtenerTodos() ya normaliza los campos
      const [listaMonstruos, listaBatallas] = await Promise.all([
        servicioMonstruos.obtenerTodos(),
        servicioBatallas.obtenerTodas(),
      ]);
      setMonstruos(listaMonstruos);
      setBatallas(listaBatallas);
    } catch (err) {
      notificar(err.message || "Error al cargar datos", "error");
    } finally {
      setCargando(false);
    }
  }

  async function manejarIniciarBatalla(idM1, idM2) {
    try {
      const resultado = await servicioBatallas.iniciarBatalla(idM1, idM2);
      setBatallas((prev) => [resultado, ...prev]);
      notificar(`🏆 ¡${resultado.nombreGanador} ganó la batalla!`);
      return resultado;
    } catch (err) {
      notificar(err.message || "Error al crear batalla", "error");
      return null;
    }
  }

  async function manejarEliminarBatalla(id) {
    try {
      await servicioBatallas.borrar(id);
      setBatallas((prev) => prev.filter((b) => b.id !== id));
      notificar("🗑 Batalla eliminada de tu historial");
    } catch (err) {
      notificar(err.message || "Error al eliminar batalla", "error");
    }
  }

  if (cargando) {
    return (
      <section style={{ padding: "3rem 0", textAlign: "center" }}>
        <p className="text-muted" style={{ fontFamily: "Cinzel,serif", fontSize: "0.9rem" }}>
          ⏳ Cargando tus datos...
        </p>
      </section>
    );
  }

  return (
    <VistaBatallas
      batallas={batallas}
      monstruos={monstruos}
      alIniciarBatalla={manejarIniciarBatalla}
      alEliminarBatalla={manejarEliminarBatalla}
    />
  );
}
