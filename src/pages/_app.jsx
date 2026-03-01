// src/pages/_app.jsx
// Layout principal: barra de nav, protección de rutas y sistema de notificaciones.
import "../styles/globals.css";
import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import BarraNavegacion from "../components/ui/BarraNavegacion";
import Notificacion    from "../components/ui/Notificacion";
import { servicioAuth } from "../api/servicioAuth";

export const ContextoNotificacion = createContext(null);
export function usarNotificacion() { return useContext(ContextoNotificacion); }

const RUTAS_PUBLICAS = ["/login"];

export default function Aplicacion({ Component, pageProps }) {
  const [notificacion, setNotificacion] = useState(null);
  const [usuario, setUsuario]           = useState(null);
  const [verificando, setVerificando]   = useState(true);
  const enrutador = useRouter();

  useEffect(() => {
    const usuarioGuardado = servicioAuth.obtenerUsuarioActual();
    const estaAuth        = servicioAuth.estaAutenticado();
    const esRutaPublica   = RUTAS_PUBLICAS.includes(enrutador.pathname);

    if (!estaAuth && !esRutaPublica) {
      enrutador.replace("/login");
    } else if (estaAuth && esRutaPublica) {
      enrutador.replace("/");
    } else {
      setUsuario(usuarioGuardado);
    }
    setVerificando(false);
  }, [enrutador.pathname]);

  function mostrarNotificacion(mensaje, tipo = "exito") {
    setNotificacion({ mensaje, tipo, id: Date.now() });
  }

  const esRutaPublica = RUTAS_PUBLICAS.includes(enrutador.pathname);
  if (verificando) return null;

  return (
    <ContextoNotificacion.Provider value={mostrarNotificacion}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Monster Clash</title>
      </Head>

      {!esRutaPublica && <BarraNavegacion usuario={usuario} />}

      <main
        className={!esRutaPublica ? "container" : ""}
        style={!esRutaPublica ? { paddingBottom: "3rem" } : {}}
      >
        <Component {...pageProps} />
      </main>

      {notificacion && (
        <Notificacion
          key={notificacion.id}
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          alCerrar={() => setNotificacion(null)}
        />
      )}
    </ContextoNotificacion.Provider>
  );
}
