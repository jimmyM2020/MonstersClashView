# 🐉 Batalla de Monstruos — Frontend

Next.js + React + JavaScript conectado a la API REST.

---

## 📁 Estructura

```
src/
├── api/
│   ├── clienteHttp.js           ← GET/POST/PUT/DELETE + token automático
│   ├── servicioAuth.js          ← Login, registro, logout (localStorage)
│   ├── servicioMonstruos.js     ← CRUD monstruos → API
│   └── servicioBatallas.js      ← CRUD batallas  → API
├── components/
│   ├── monstruos/
│   │   ├── TarjetaMonstruo.jsx
│   │   └── FormularioMonstruo.jsx
│   ├── batallas/
│   │   ├── TarjetaBatalla.jsx
│   │   ├── ModalSimulacionBatalla.jsx  ← animación turno a turno
│   │   └── ModalRegistroBatalla.jsx
│   └── ui/
│       ├── BarraNavegacion.jsx
│       ├── BarraEstadistica.jsx
│       ├── ModalConfirmacion.jsx
│       └── Notificacion.jsx
├── views/
│   ├── VistaAutenticacion.jsx   ← login + registro en pestañas
│   ├── VistaMonstruos.jsx
│   └── VistaBatallas.jsx
├── pages/
│   ├── _app.jsx      ← layout + protección de rutas + notificaciones
│   ├── _document.jsx
│   ├── login.jsx     ← ruta pública
│   ├── index.jsx     ← "/" monstruos (requiere sesión)
│   └── batallas.jsx  ← "/batallas" (requiere sesión)
└── styles/globals.css
```

---

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar URL de la API
cp .env.local.ejemplo .env.local
# Editar .env.local → NEXT_PUBLIC_URL_API=http://localhost:3001/api

# 3. Iniciar en desarrollo
npm run dev
# → http://localhost:3000
```

Asegúrate de que el backend esté corriendo en el puerto 3001 antes de iniciar el frontend.

---

## 🔑 Autenticación

- El token JWT se guarda en `localStorage` bajo la clave `bm_token`.
- El `clienteHttp.js` lo adjunta automáticamente en cada petición.
- Las rutas protegidas redirigen a `/login` si no hay sesión activa.
