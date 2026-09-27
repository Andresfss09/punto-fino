# 💈 Roadmap & Tareas Pendientes — Punto Fino Barbería

Este documento consolida el estado del proyecto, el análisis de identidad visual actual y las tareas a desarrollar para las próximas sesiones de trabajo.

---

## 📌 Contexto: ¿Por qué la app es idéntica a `barberiasteelhouse.com`?

En el commit [`45a5163`](file:///c:/Users/USUARIO/Desktop/Proyectos/PuntoFino) (*`feat(branding): transformar identidad visual completa a Steel House Barberia's con logo oficial y catálogo real`*), se importó directamente la identidad de **Steel House Barberia's (Cali)** para usarla como maqueta/demo:
* **Logo oficial y favicon:** `/logo.png` extraído de la barbería real.
* **Catálogo de servicios:** *Experiencia White*, *Experiencia Black*, *Experiencia Gold VIP 👑*, *Perfilado de Barba*.
* **Nombres del equipo:** *Juan Muñeton*, *Carlos Mendoza*.
* **Textos, dirección y metadatos SEO:** Datos directos de dicha barbería en Cali.

Dado que **el proyecto final no es para esa barbería**, se debe programar un cambio total de marca y diseño.

---

## 🚀 Tareas Prioritarias

### 1. 🎨 Rediseño & Desvinculación de Marca (Prioridad Alta)
- [ ] **Sustituir Logo & Favicon:** Cambiar `/public/logo.png` y favicon por la identidad visual del negocio real (**Punto Fino** o la barbería del cliente).
- [ ] **Actualizar Textos y Metadatos:**
  - Editar [frontend/index.html](file:///c:/Users/USUARIO/Desktop/Proyectos/PuntoFino/frontend/index.html) (título, meta descriptions, open graph).
  - Actualizar textos de bienvenida, banners, pie de página ([Footer.jsx](file:///c:/Users/USUARIO/Desktop/Proyectos/PuntoFino/frontend/src/components/layout/Footer.jsx)) y navbar.
- [ ] **Definir Paleta de Colores y Estilo:**
  - Evaluar si se mantiene la estética *neo-brutalista* actual o si se adopta un diseño más minimalista, sobrio o moderno según el gusto del cliente.
  - Ajustar colores primarios en [tailwind.config.js](file:///c:/Users/USUARIO/Desktop/Proyectos/PuntoFino/frontend/tailwind.config.js) (actualmente dominado por negro `#0a0a0a` y dorado `#d4af37`).
- [ ] **Configurar Catálogo y Barberos Reales:**
  - Reemplazar los servicios dummy de Steel House por la carta real de cortes y precios del cliente.
  - Actualizar nombres, fotos de perfil y especialidades del equipo real de barberos.

---

### 2. 🔌 Conexión de Backend & Base de Datos (Inmediato)
- [ ] **Configurar Variables de Entorno:**
  - Crear archivo `backend/.env` con las variables proporcionadas por el equipo (`MONGODB_URI`, `JWT_SECRET`, `PORT=5000`, `CLIENT_URL=http://localhost:5173`).
- [ ] **Poblar Base de Datos (Seeds):**
  - Ejecutar `npm run seed` en el backend para crear las colecciones de usuarios, roles, servicios y citas iniciales.
- [ ] **Levantar Servidor Backend:**
  - Ejecutar `npm run dev` en la carpeta `backend` en el puerto `5000`.
- [ ] **Verificar Flujos en Vivo:**
  - Confirmar el login real con JWT, el guardado de citas en MongoDB y los eventos de Socket.io en tiempo real.

---

### 3. 🛠️ Nuevas Funcionalidades Recomendadas para la Barbería

#### A. Recordatorios y Notificaciones Automáticas por WhatsApp
- [ ] Integrar webhook / API (Twilio, Baileys o WhatsApp Cloud API) para enviar mensaje recordatorio 2 horas antes de la cita.
- [ ] Mensaje instantáneo de confirmación con botón de ubicación en Google Maps.
- [ ] Opción para que el cliente confirme o cancele directamente desde WhatsApp.

#### B. Módulo de Inventario & Venta de Productos (Mini-POS)
- [ ] Registro de productos de barbería (ceras, pomadas, aceites, tratamientos, minoxidil).
- [ ] Control de stock y alerta de agotamiento.
- [ ] Registro de ventas directas vinculadas al corte o independientes.
- [ ] Inclusión de ventas de productos en la contabilidad y nómina del administrador.

#### C. Pasarela de Pagos Digitales
- [ ] Integrar pasarela colombiana (Wompi, MercadoPago, Bold o ePayco) para cobrar anticipos/señas al agendar.
- [ ] Registro automático del comprobante en el estado de pago de la cita (`pagado`).

#### D. Ficha Técnica / Historial Privado del Cliente
- [ ] Sección de notas privadas por barbero en el perfil del cliente (ej. *"Corte fade con peine #1.5, desvanecido a navaja, navaja delicada por piel sensible"*).
- [ ] Historial de visitas y frecuencia del cliente.

#### E. Gestión de Ausencias, Festivos y Descansos del Barbero
- [ ] Permitir al barbero o administrador bloquear días específicos (vacaciones, citas médicas, días cívicos) sin tener que desactivar todo el horario semanal.
- [ ] Visualización de días no laborales en el calendario de reserva del cliente.

---

## 📊 Estado Actual del Proyecto (Cierre de Sesión)

* **Rama activa:** `Nicolas` (al día).
* **Frontend:** Corriendo en [http://localhost:5173](http://localhost:5173).
* **Compilación:** `npm run build` sin errores (0 errores de Vite / Tailwind).
* **Dashboards testeados y operativos en modo demostración:**
  * ✅ Agendamiento público de citas sin registro (`/reservar`).
  * ✅ Dashboard del barbero con agenda, cambio de estados y descarga de reportes Excel (`/barber`).
  * ✅ Dashboard de super administrador con nómina, comisiones, métricas contables y exportación a PDF y Excel (`/admin`).
