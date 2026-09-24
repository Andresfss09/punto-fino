# 📚 Documentación del Proyecto — Punto Fino

> Sistema de agendamiento de citas para barbería
> Stack: React 19 + Express 5 + MongoDB

---

## Documentos

| Documento | Descripción |
|-----------|-------------|
| [Plan de Implementación](./implementation_plan.md) | Plan maestro con las 4 fases del proyecto, diagnóstico, cambios propuestos y verificación |
| [Guía de Estilo](./style_guide.md) | Dirección visual neo-brutalista: paleta, tipografía, componentes, layout mobile-first |

---

## Estructura del Proyecto

```
punto-fino/
├── docs/                    ← 📚 Documentación (este directorio)
├── backend/
│   └── src/
│       ├── config/          # Configuración (DB, Cloudinary)
│       ├── controllers/     # Lógica de negocio
│       ├── middlewares/      # Auth, rate-limit, upload
│       ├── models/          # Esquemas Mongoose
│       ├── routes/          # Definición de endpoints
│       ├── seeders/         # Datos iniciales
│       ├── services/        # Email, notificaciones
│       ├── sockets/         # WebSocket handlers
│       └── utils/           # Helpers y validadores
├── frontend/
│   └── src/
│       ├── components/      # Componentes reutilizables
│       │   ├── booking/     # Subcomponentes del flujo de reserva
│       │   ├── home/        # Secciones de la landing
│       │   ├── layout/      # Navbar, Sidebar, Footer, DashboardLayout
│       │   └── ui/          # Primitivos: Button, Input, Card, Modal...
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Vistas por rol (admin/, barber/, client/)
│       ├── services/        # Llamadas API (Axios)
│       ├── store/           # Estado global (Zustand)
│       └── utils/           # Formatters, validators
└── .env                     # Variables de entorno
```

---

## Quick Start

```bash
# 1. Clonar
git clone https://github.com/Andresfss09/punto-fino.git
cd punto-fino

# 2. Backend
cd backend
cp .env.example .env    # Configurar variables
npm install
npm run dev

# 3. Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

---

## Convenciones

- **Estilo:** Neo-brutalismo oscuro + dorado (ver [style_guide.md](./style_guide.md))
- **Enfoque:** Mobile-first (375px base)
- **Componentes:** Funcionales con hooks, no clases
- **Estado:** Zustand para global, React Query para server state
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion (respetar `prefers-reduced-motion`)

