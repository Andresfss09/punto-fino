# 🔥 Plan de Implementación — Punto Fino
## Sistema de Agendamiento + Frontend Neo-Brutalista Mobile-First

> **Última actualización:** 2026-09-16
> **Enfoque principal:** Mobile-first (375px → 768px → 1440px)
> **Estilo visual:** Neo-brutalismo oscuro con acentos dorados

---

## Tabla de Contenidos

1. [Diagnóstico del Proyecto](#1-diagnóstico-del-proyecto)
2. [Dirección de Diseño: Neo-Brutalismo](#2-dirección-de-diseño-neo-brutalismo)
3. [Fase 1: Backend — Bugs y Completar API](#3-fase-1-backend)
4. [Fase 2: Sistema de Diseño y Layout](#4-fase-2-sistema-de-diseño)
5. [Fase 3: Sistema de Agendamiento](#5-fase-3-agendamiento)
6. [Fase 4: Páginas Restantes y Polish](#6-fase-4-polish)
7. [Verificación](#7-verificación)

---

## 1. Diagnóstico del Proyecto

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Node.js ≥18, Express 5.2, MongoDB, Mongoose 9.6 |
| **Auth** | JWT, bcryptjs, Helmet, rate-limit |
| **Frontend** | React 19, Vite 8, Tailwind CSS 3.4 |
| **Estado** | Zustand 5, TanStack React Query 5 |
| **Formularios** | React Hook Form 7 + Zod 4 |
| **Animaciones** | Framer Motion 12 |
| **Utilidades** | Axios, date-fns, Lucide icons, react-hot-toast |

### ✅ Lo que ya funciona
- Modelos de BD completos (User, Barber, Service, Appointment, Review, Notification)
- Autenticación JWT con 3 roles (cliente, barbero, admin)
- Algoritmo de cálculo de slots libres
- Flujo de reserva en 4 pasos (BookingPage.jsx)
- Dashboards básicos para los 3 roles
- Sistema de fidelización con puntos
- Seeder de servicios iniciales
- Componentes UI base (Button, Input, Badge, Modal, Spinner)

### 🐛 Problemas detectados

| Archivo | Problema |
|---------|----------|
| `barberController.js:61` | `ObjectId()` sin `new` — crash en Mongoose 9 |
| `appointmentController.js` | `sendAppointmentConfirmationEmail` existe pero nunca se invoca |
| `MyAppointments.jsx` | Botón "Enviar reseña" cierra modal sin llamar al backend |
| `server.js` | Socket.io instalado pero nunca inicializado |
| `upload.js` | Vacío — Cloudinary configurado pero sin middleware |
| `.env` frontend | Ubicado en raíz del repo, Vite no lo lee |
| 11 archivos | 0 bytes (controllers, hooks, validators, sockets) |
| 6 páginas | Stubs de 1 línea (AdminServices, AdminUsers, BarberSchedule, etc.) |

---

## 2. Dirección de Diseño: Neo-Brutalismo

### ¿Por qué neo-brutalismo para Punto Fino?

El neo-brutalismo es **crudo, directo y con personalidad** — exactamente la energía de una barbería. No pretende ser elegante en el sentido clásico, sino **confiado y sin excusas**. Combinado con el fondo oscuro y acentos dorados que ya tiene el proyecto, creamos una identidad visual que:

- Se siente **masculina y audaz** sin ser genérica
- Funciona **increíblemente bien en móvil** (elementos grandes, táctiles, claros)
- Es **memorable** — se distingue de apps de salones genéricas
- Tiene **jerarquía visual clara** — perfecto para flujos de reserva

### Sistema Visual Completo

```
╔══════════════════════════════════════════════════════════╗
║  PALETA DE COLORES                                       ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Fondos:                                                 ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐                ║
║  │ #0a0a0a  │ │ #111111  │ │ #1a1a1a  │                ║
║  │  base    │ │  cards   │ │ elevated │                ║
║  └──────────┘ └──────────┘ └──────────┘                ║
║                                                          ║
║  Acento dorado:                                          ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐                ║
║  │ #d4af37  │ │ #b8960c  │ │ #f0d48a  │                ║
║  │ primary  │ │  hover   │ │  light   │                ║
║  └──────────┘ └──────────┘ └──────────┘                ║
║                                                          ║
║  Textos:                                                 ║
║  #ffffff (primary)  #a0a0a0 (secondary)  #555 (muted)   ║
║                                                          ║
║  Status:                                                 ║
║  🟢 #22c55e  🟡 #f59e0b  🔴 #ef4444  🔵 #3b82f6       ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  TIPOGRAFÍA                                              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Headings:  Space Grotesk (bold, geométrica, brutal)     ║
║  Body:      Inter (legible, limpia)                      ║
║  Accent:    JetBrains Mono (monospace para precios,      ║
║             códigos de cita, timestamps)                 ║
║                                                          ║
║  Escala móvil:                                           ║
║  H1: clamp(2rem, 5vw, 3.5rem)                          ║
║  H2: clamp(1.5rem, 4vw, 2.5rem)                        ║
║  H3: clamp(1.25rem, 3vw, 1.75rem)                      ║
║  Body: 1rem (16px base)                                  ║
║  Small: 0.875rem                                         ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  EFECTOS NEO-BRUTALISTAS                                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Bordes gruesos:                                         ║
║  border: 2px solid #d4af37   (cards principales)         ║
║  border: 2px solid #333      (cards secundarias)         ║
║  border: 3px solid #d4af37   (CTAs y elementos hero)     ║
║                                                          ║
║  Sombras duras (sin blur):                               ║
║  box-shadow: 4px 4px 0 #d4af37    (default)             ║
║  box-shadow: 6px 6px 0 #d4af37    (elevated)            ║
║  box-shadow: 2px 2px 0 #d4af37    (pressed/active)      ║
║  box-shadow: 4px 4px 0 #333       (elementos neutros)   ║
║                                                          ║
║  Interacción (press effect):                             ║
║  :active {                                               ║
║    transform: translate(2px, 2px);                       ║
║    box-shadow: 2px 2px 0 #d4af37;                       ║
║  }                                                       ║
║                                                          ║
║  Border-radius:                                          ║
║  Mínimo: 0px (botones, inputs — crudo)                   ║
║  Sutil: 4px-8px (cards — suavizado neo)                  ║
║  NO usar: border-radius grandes (>16px)                  ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  MOBILE-FIRST PRINCIPLES                                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  • Diseño base: 375px (iPhone SE)                        ║
║  • Breakpoints: sm(640) → md(768) → lg(1024) → xl(1280) ║
║  • Touch targets: mínimo 44x44px                         ║
║  • Sticky "Reservar" bottom bar en todas las vistas      ║
║  • Single-column stack por defecto                       ║
║  • Gestos: swipe para cambiar tabs/filtros               ║
║  • Bottom sheet para modals en móvil                     ║
║  • Font sizes con clamp() para escalado fluido           ║
║  • Spacing: 16px padding lateral en móvil                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Ejemplo visual de componentes

```
┌─────────────────────────────────────────┐
│ BOTÓN PRIMARIO (neo-brutal)             │
│                                         │
│  ┌─────────────────────────┐            │
│  │ RESERVAR AHORA  →       │▓▓          │
│  └─────────────────────────┘▓▓          │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│                                         │
│  bg: #d4af37                            │
│  text: #0a0a0a (negro sobre dorado)     │
│  border: 3px solid #0a0a0a             │
│  shadow: 4px 4px 0 #0a0a0a            │
│  font: Space Grotesk Bold UPPERCASE     │
│  radius: 0px                            │
│                                         │
├─────────────────────────────────────────┤
│ CARD DE SERVICIO (neo-brutal)           │
│                                         │
│  ┌─────────────────────────────┐        │
│  │  ┌─────┐                   │▓        │
│  │  │ IMG │  CORTE CLÁSICO    │▓        │
│  │  └─────┘                   │▓        │
│  │  El corte tradicional...    │▓        │
│  │                             │▓        │
│  │  ⏱ 30min    $ 25.000 COP   │▓        │
│  │         [SELECCIONAR]       │▓        │
│  └─────────────────────────────┘▓        │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
│                                         │
│  bg: #111111                            │
│  border: 2px solid #333                 │
│  shadow: 4px 4px 0 #333               │
│  selected → border: #d4af37            │
│  selected → shadow: 4px 4px 0 #d4af37 │
│                                         │
├─────────────────────────────────────────┤
│ SLOT DE HORA (neo-brutal)               │
│                                         │
│  Normal:        Seleccionado:           │
│  ┌────────┐     ┌────────┐              │
│  │ 10:30  │     │ 10:30  │▓▓            │
│  └────────┘     └────────┘▓▓            │
│                  ▓▓▓▓▓▓▓▓▓▓             │
│  border: 1px    border: 2px #d4af37     │
│  #333           bg: #d4af37/10          │
│                 shadow: hard gold       │
│                 text: #d4af37           │
│                                         │
└─────────────────────────────────────────┘
```

### CSS Classes del Sistema de Diseño

```css
/* Clases utilitarias neo-brutalistas para Tailwind @layer */

/* Cards */
.brutal-card        → bg-dark-200 border-2 border-dark-50/30 shadow-[4px_4px_0_#333]
.brutal-card-gold   → bg-dark-200 border-2 border-gold-500 shadow-[4px_4px_0_#d4af37]
.brutal-card-hover  → hover:shadow-[6px_6px_0] hover:-translate-x-[1px] hover:-translate-y-[1px]

/* Botones */
.brutal-btn         → border-2 border-current shadow-[4px_4px_0] active:translate-x-[2px]
                      active:translate-y-[2px] active:shadow-[2px_2px_0]
.brutal-btn-primary → bg-gold-500 text-dark-400 border-dark-400 shadow-[4px_4px_0_#0a0a0a]
.brutal-btn-outline → bg-transparent text-gold-500 border-gold-500 shadow-[4px_4px_0_#d4af37]

/* Inputs */
.brutal-input       → bg-dark-300 border-2 border-dark-50/30 rounded-none
                      focus:border-gold-500 focus:shadow-[3px_3px_0_#d4af37]

/* Badges */
.brutal-badge       → border-2 font-mono text-xs uppercase tracking-wider px-2 py-0.5

/* Dividers */
.brutal-divider     → border-t-2 border-dashed border-dark-50/20
```

---

## 3. Fase 1: Backend — Bugs y Completar API

**Objetivo:** API 100% funcional, 0 archivos vacíos.

### 3.1 Corrección de bugs críticos

| Archivo | Cambio |
|---------|--------|
| `barberController.js` | `ObjectId()` → `new ObjectId()` en línea ~61 |
| `appointmentController.js` | Invocar `sendAppointmentConfirmationEmail()` al crear cita |
| `.env` | Mover de raíz a `frontend/.env` |

### 3.2 Archivos vacíos a implementar

| Archivo | Contenido |
|---------|-----------|
| `upload.js` (middleware) | Multer en memoria + helper `uploadToCloudinary()` |
| `userController.js` | CRUD de usuarios para admin: listar, detalle, toggle activo, subir avatar |
| `userRoutes.js` | Rutas `/api/users` + montar en `app.js` |
| `validators.js` (backend) | Schemas de validación con express-validator |
| `appointmentSocket.js` | Namespace de citas: `nueva_cita`, `cita_actualizada`, `cita_cancelada` |
| `server.js` | Inicializar Socket.io sobre HTTP server |

### 3.3 Mejoras al sistema de citas

- Endpoint de recordatorios automáticos (24h antes)
- Validación de solapamiento mejorada
- Endpoint para reagendar cita (no solo cancelar)

---

## 4. Fase 2: Sistema de Diseño y Layout

**Objetivo:** Estética neo-brutalista cohesiva + layout responsive completo.

### 4.1 Configuración base

| Archivo | Cambio |
|---------|--------|
| `tailwind.config.js` | Reemplazar fuente `Playfair Display` por `Space Grotesk`. Agregar `JetBrains Mono`. Añadir utilidades de sombra dura. Extender con tokens neo-brutalistas |
| `index.css` | Importar fuentes. Definir `@layer components` con clases brutalistas. Scrollbar custom oscuro. Reset brutal (sin border-radius por defecto) |
| `index.html` | Preconnect Google Fonts. Meta tags SEO. Theme-color oscuro |

### 4.2 Componentes UI nuevos

| Componente | Descripción |
|-----------|-------------|
| `BrutalCard.jsx` | Card con bordes gruesos, sombra dura, variantes (default/gold/interactive) |
| `StatsCard.jsx` | Métrica con ícono, counter animado, label. Borde neo-brutal |
| `PageTransition.jsx` | Wrapper Framer Motion: fade+slide al cambiar de ruta |
| `AnimatedCounter.jsx` | Anima números de 0 al valor final |
| `BottomBar.jsx` | **[MOBILE]** Barra fija inferior con CTA "Reservar" + nav rápida |
| `BottomSheet.jsx` | **[MOBILE]** Modal tipo bottom-sheet con drag-to-dismiss |

### 4.3 Layout completo

| Componente | Cambio |
|-----------|--------|
| `DashboardLayout.jsx` | Layout con sidebar (desktop) / bottom-nav (mobile). Header con breadcrumbs y notificaciones. Transiciones entre secciones |
| `Sidebar.jsx` | Navegación contextual por rol. Logo arriba, avatar abajo. Modo colapsado/expandido. **En mobile: se oculta, se usa bottom-nav** |
| `Footer.jsx` | Footer completo para páginas públicas: info, horarios, contacto, redes. Estilo brutal con bordes superiores gruesos |
| `Navbar.jsx` | Efecto de scroll: transparente → fondo sólido con borde inferior brutal. Badge de notificaciones. Menú hamburguesa con bottom-sheet en mobile |

### 4.4 Enrutamiento

| Archivo | Cambio |
|---------|--------|
| `App.jsx` | Envolver rutas dashboard con `DashboardLayout`. Agregar `PageTransition` globales. Layout nesting para público vs. autenticado |

---

## 5. Fase 3: Sistema de Agendamiento

**Objetivo:** Flujo de reserva espectacular + gestión completa de citas para todos los roles.

### 5.1 Refactor del flujo de reserva

| Componente | Implementación |
|-----------|----------------|
| `BookingPage.jsx` | Refactorizar: extraer 4 pasos en subcomponentes. Barra de progreso brutal con iconos. Animaciones slide entre pasos. **Mobile: cada paso es fullscreen** |
| `ServiceSelector.jsx` | Grid de servicios con cards brutalistas. Filtro por categoría con pills. Resumen sticky en bottom (mobile). Precio en font mono |
| `BarberSelector.jsx` | Cards con avatar, rating dorado, especialidades como badges brutales. Selección con borde dorado + sombra. Opción "Sin preferencia" |
| `TimeSlotPicker.jsx` | Calendario dark. Grid de slots con colores brutales: disponible (borde verde), ocupado (tachado, gris), seleccionado (dorado sólido). **Mobile: scroll horizontal de slots** |
| `BookingConfirmation.jsx` | Resumen con línea de tiempo visual. Precio en font mono grande. Método de pago con botones brutales. Animación de éxito tipo "stamp" al confirmar |

### 5.2 Páginas de gestión de citas

| Página | Implementación |
|--------|----------------|
| `AdminAppointments.jsx` | Tabla con filtros (fecha, barbero, estado). Búsqueda por nombre/código. Acciones: cambiar estado, cancelar. Vista calendario semanal. **Mobile: cards apiladas en vez de tabla** |
| `BarberSchedule.jsx` | Agenda tipo timeline del día. Config de horarios laborales. Bloqueo de slots con razón. Programar vacaciones. **Mobile: vista diaria con swipe** |
| `MyAppointments.jsx` | **FIX:** Conectar envío de reseñas al backend. Rediseño con cards brutalistas por cita. Timeline visual de estados. Filtros con tabs brutales |

---

## 6. Fase 4: Páginas Restantes y Polish

**Objetivo:** 0 stubs, WebSocket en tiempo real, polish final.

### 6.1 Perfiles

| Página | Implementación |
|--------|----------------|
| `ClientProfile.jsx` | Edición nombre, teléfono, avatar (upload + preview). Cambio de contraseña. Preferencias de notificación. Stats personales. **Mobile: secciones acordeón** |
| `BarberProfile.jsx` | Bio, especialidades (chips), portfolio (galería con upload). Preview del perfil público. Stats: rating, reseñas, clientes |

### 6.2 Administración

| Página | Implementación |
|--------|----------------|
| `AdminServices.jsx` | CRUD de servicios con modal brutal. Upload de imagen. Toggle activo/inactivo. Reordenar con drag |
| `AdminUsers.jsx` | Tabla/lista de usuarios. Filtros por rol y estado. Acciones: activar/desactivar. **Mobile: cards con swipe actions** |

### 6.3 Rediseño de dashboards

| Dashboard | Mejoras |
|-----------|---------|
| `ClientDashboard.jsx` | Stats cards brutales con counters animados. Próxima cita destacada con countdown. Barra de fidelidad. **Mobile: full-width cards apiladas** |
| `BarberDashboard.jsx` | Métricas del día. Cola de citas en tiempo real (WebSocket). Siguiente cita con timer. Acciones rápidas |
| `AdminDashboard.jsx` | Grid de métricas. Ocupación por barbero (barras). Citas de hoy en tiempo real. Ingresos del mes |

### 6.4 Mejoras al HomePage

| Sección | Mejoras |
|---------|---------|
| `HeroSection.jsx` | Texto con stagger reveal brutal. Counter animado de stats. CTA con efecto press. **Mobile: hero fullscreen con CTA sticky** |
| `ServicesSection.jsx` | Cards brutalistas con hover lift. Filtro animado. Precios en mono |
| `BarbersSection.jsx` | Cards con hover que revela especialidades. Rating dorado. Link directo a reservar |
| `ReviewsSection.jsx` | Scroll horizontal de testimonios. Cards brutales con comillas grandes. Auto-scroll con pausa |

### 6.5 WebSocket real-time

| Archivo | Implementación |
|---------|----------------|
| `useSocket.js` (hook) | Conexión Socket.io, auth JWT, auto-reconnect. Listeners de citas. Toasts automáticos |
| `useAppointments.js` | React Query hooks para citas. Invalidación via WebSocket |
| `useAuth.js` | Wrapper sobre `useAuthStore`. Helpers: `isClient`, `isBarber`, `isAdmin` |

---

## 7. Verificación

### Tests automáticos
```bash
# Backend arranca sin errores
cd backend && npm run dev

# Frontend compila sin errores
cd frontend && npm run build

# Linting limpio
cd frontend && npx eslint src/
```

### Verificación manual
- [ ] **Flujo E2E en mobile (375px):** Registrar → Reservar (4 pasos) → Ver en dashboard barbero
- [ ] **Responsive:** Verificar en 375px, 768px, 1440px
- [ ] **Estilo brutal consistente:** Bordes, sombras duras, tipografía en todas las páginas
- [ ] **Touch targets:** Todos los botones/links ≥ 44x44px
- [ ] **Roles:** Cada rol solo accede a sus rutas
- [ ] **WebSocket:** Cita creada aparece en real-time en dashboard barbero
- [ ] **Accesibilidad:** Navegación por teclado, contraste WCAG AA

---

## Resumen de Archivos por Fase

| Fase | Nuevos | Modificados | Foco |
|------|--------|-------------|------|
| **1** | 0 | ~10 | Backend: bugs, archivos vacíos, API completa |
| **2** | 6 | ~7 | Diseño neo-brutal, layout, componentes UI |
| **3** | 0 | ~8 | Agendamiento, booking refactor, gestión citas |
| **4** | 1 | ~14 | Páginas restantes, WebSocket, polish |

