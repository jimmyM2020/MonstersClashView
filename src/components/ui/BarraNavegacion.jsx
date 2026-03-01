// src/components/ui/BarraNavegacion.jsx
// Responsiva: menú hamburguesa en móvil, barra horizontal en desktop🏆
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { servicioAuth } from "../../api/servicioAuth";
import estilos from "./BarraNavegacion.module.css";

export default function BarraNavegacion({ usuario }) {
  const enrutador = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlaces = [
    { ruta: "/",         etiqueta: "Mis Monstruos", icono: "⚔️" },
    { ruta: "/batallas", etiqueta: "Mis Batallas",   icono: "🏆" },
  ];

  function cerrarSesion() {
    servicioAuth.cerrarSesion();
    enrutador.push("/login");
  }

  function cerrarMenu() { setMenuAbierto(false); }

  return (
    <nav className={estilos.nav}>
      <div className={`container ${estilos.interior}`}>
        {/* Logo */}
        <Link href="/" className={estilos.logo} onClick={cerrarMenu}>
          {/* <span className={estilos.iconoLogo}>🐉</span> */}
          <span className={estilos.textoLogo}>Monster Clash</span>
        </Link>

        {/* Botón hamburguesa — solo móvil */}
        <button
          className={estilos.hamburguesa}
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          <span className={`${estilos.linea} ${menuAbierto ? estilos.lineaTop : ""}`} />
          <span className={`${estilos.linea} ${menuAbierto ? estilos.lineaMid : ""}`} />
          <span className={`${estilos.linea} ${menuAbierto ? estilos.lineaBot : ""}`} />
        </button>

        {/* Panel de navegación */}
        <div className={`${estilos.panel} ${menuAbierto ? estilos.panelAbierto : ""}`}>
          <ul className={estilos.enlaces}>
            {enlaces.map((e) => (
              <li key={e.ruta}>
                <Link
                  href={e.ruta}
                  onClick={cerrarMenu}
                  className={`${estilos.enlace} ${enrutador.pathname === e.ruta ? estilos.activo : ""}`}
                >
                  <span>{e.icono}</span>
                  <span>{e.etiqueta}</span>
                </Link>
              </li>
            ))}
          </ul>

          {usuario && (
            <div className={estilos.usuarioInfo}>
              <span className={estilos.nombreUsuario}>👤 {usuario.nombre}</span>
              <button className={`btn btn-ghost ${estilos.btnSalir}`} onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar el menú al tocar fuera */}
      {menuAbierto && (
        <div className={estilos.overlay} onClick={cerrarMenu} aria-hidden />
      )}
    </nav>
  );
}
