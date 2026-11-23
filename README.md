# Dronflow — Frontend

**Dronflow** es un sistema de gestión de flotas de drones (proyecto universitario de Diseño de Software). Permite registrar drones, controlar su estado operativo, planificar y seguir misiones, gestionar alertas y mantenimiento, y administrar los usuarios del sistema con dos roles: **administrador** (`ADMIN`) y **operador** (`OPERATOR`).

Este repositorio contiene la interfaz web. El sistema completo se compone de:

| Parte | Repositorio |
|-------|-------------|
| Backend (API REST, Spring Boot + MongoDB) | [Juanescuaran2041/dronflow-backend](https://github.com/Juanescuaran2041/dronflow-backend) |
| Documentación (requisitos, historias de usuario, mockups) | [Wiki del proyecto](https://github.com/Juanescuaran2041/dronflow/wiki) |
| Frontend (este repo) | [Juanescuaran2041/dronflow-frontend](https://github.com/Juanescuaran2041/dronflow-frontend) |

Las historias de usuario (HU-01…HU-23) viven en `dronflow-backend/docs/historias-usuario/`. El frontend solo implementa las funcionalidades descritas allí.

## Funcionalidades implementadas

| HU | Pantalla | Rol |
|----|----------|-----|
| HU-19 | Inicio de sesión | Todos |
| HU-20 | Registrar operador | Solo `ADMIN` |
| HU-23 | Cerrar sesión (botón en la barra superior) | Todos |
| HU-01 | Registrar dron | Todos |
| — | Listado de drones (sin los dados de baja) | Todos |
| HU-02 | Reportar avería (dron disponible → fuera de servicio) | Todos |
| HU-03 | Dar de baja y reactivar dron | Todos |

## Stack

- React 19 + TypeScript
- Vite (servidor de desarrollo, build y proxy hacia la API)
- React Router 7 (rutas y rutas protegidas)
- `fetch` nativo para HTTP (sin librerías extra)
- ESLint (reglas de TypeScript y React Hooks)

## Cómo correrlo

Requisitos: Node 20 o superior y el backend corriendo (por defecto en `http://localhost:8080`).

```powershell
npm install
```

```powershell
npm run dev
```

La app queda en <http://localhost:5173>. Para apuntar a un backend en otro puerto o host:

```powershell
$env:API_TARGET = "http://localhost:8081"; npm run dev
```

Otros comandos:

| Comando | Qué hace |
|---------|----------|
| `npm run build` | Verifica tipos (`tsc -b`) y genera `dist/` |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Sirve el build en el puerto 5173 (también con proxy a la API) |

> El backend no tiene CORS configurado, por eso el navegador nunca llama directo a la API: el servidor de Vite reenvía todo lo que empiece por `/api` al backend (`API_TARGET`). En un contenedor Node 20 se puede usar `npm run build && npm run preview`, que escucha en `0.0.0.0:5173`.

## Arquitectura

### Estructura por módulos

```
src/
├── App.tsx                 # Definición de rutas
├── main.tsx                # Punto de entrada
├── index.css               # Estilos globales (variables, modo claro/oscuro)
├── shared/                 # Código transversal, sin lógica de negocio
│   ├── api/http.ts         # Cliente HTTP: base /api/v1, token JWT, errores
│   ├── auth/               # Sesión, contexto de autenticación, ruta protegida
│   └── layout/Layout.tsx   # Barra superior + contenido
└── modules/                # Un módulo por área funcional del backend
    ├── users/              # Login, registrar operador, cerrar sesión
    │   ├── types.ts        # Tipos que reflejan los DTOs del backend
    │   ├── api.ts          # Servicios de API del módulo
    │   └── *.tsx           # Pantallas y componentes
    └── fleet/              # Registro, listado, avería, baja y reactivación de drones
```

### Capas

```
Componentes (pantallas)  →  Servicios del módulo (api.ts)  →  Cliente HTTP (shared/api)  →  /api/v1 (proxy Vite)  →  Backend
        ↑                                                            │
        └──────────── ApiError { status, message } ←─────────────────┘
```

1. **Componentes**: solo manejan estado de UI (formularios, carga, mensajes). No conocen URLs ni cabeceras.
2. **Servicios** (`modules/*/api.ts`): una función por endpoint, tipada con los DTOs de `types.ts`.
3. **Cliente HTTP** (`shared/api/http.ts`): agrega `Authorization: Bearer <token>`, serializa JSON y convierte las respuestas de error del backend (`{status, error, message, path}`) en `ApiError` con el mensaje del servidor, que es lo que se muestra al usuario.

### Flujo de autenticación

```
Login ──POST /auth/login──▶ {token, role} ──▶ AuthProvider guarda la sesión (localStorage)
                                                     │
Peticiones ◀── el cliente HTTP lee el token ─────────┘
   │
   ├─ 401 con token  → evento "unauthorized" → se borra la sesión → vuelve a /login
   └─ 403            → mensaje "No tienes permiso…"

Cerrar sesión ──POST /logout (revoca el token en el servidor)──▶ se borra la sesión local ──▶ /login
```

- `RequireAuth` envuelve las rutas privadas: sin sesión redirige a `/login` (y tras iniciar sesión vuelve a la página pedida); con `roles={['ADMIN']}` bloquea la pantalla para otros roles.
- La protección en el frontend es solo de navegación; la autorización real la hace el backend en cada petición.

## Buenas prácticas aplicadas

- **Separación de responsabilidades**: UI, servicios de API y cliente HTTP en capas distintas.
- **Módulos por dominio** que reflejan los módulos del backend; `shared/` no depende de ningún módulo salvo por tipos.
- **Tipado estricto**: los tipos TS replican los DTOs del backend; `tsc -b` corre en cada build.
- **Errores del backend visibles**: se muestra el `message` que devuelve la API en vez de mensajes genéricos.
- **Sin dependencias innecesarias**: `fetch` nativo, CSS plano con variables.
- **Accesibilidad básica**: formularios con `<label>`, mensajes con `role="alert"`, modo oscuro por `prefers-color-scheme`.
- **Código en inglés**, textos de la interfaz y documentación en español.

## Convenciones de trabajo

**Ramas**

- `main`: siempre estable; solo recibe cambios por Pull Request.
- `feature/<módulo>`: una rama por funcionalidad (`feature/users`, `feature/fleet`, …).
- `fix/<descripción>`: correcciones.

**Commits** — [Conventional Commits](https://www.conventionalcommits.org/es/):

```
feat(users): add operator registration page
fix(auth): clear session on 401
docs: update README
```

**Pull Requests**: cada PR indica las HU que cubre, qué se probó (build, lint y flujos contra el backend) y los puntos pendientes de decisión.
