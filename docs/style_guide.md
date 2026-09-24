# 📐 Guía de Estilo — Punto Fino
## Neo-Brutalismo Oscuro + Gold · Mobile-First

> Documento vivo que define las reglas visuales del proyecto.
> Todos los componentes y páginas DEBEN seguir estas directrices.

---

## 1. Filosofía de Diseño

**Neo-brutalismo** = honestidad visual + impacto + funcionalidad cruda.

Para Punto Fino significa:
- **Bordes que no se disculpan** — gruesos, visibles, intencionales
- **Sombras que pesan** — duras, sin blur, como estampadas
- **Tipografía que grita** — geométrica, bold, en mayúsculas cuando importa
- **Colores que contrastan** — negro profundo contra dorado vibrante
- **Interacciones que se sienten** — los botones se "hunden" al presionar

> ❌ NO es brutalismo puro (feo a propósito)
> ✅ ES neo-brutalismo (crudo pero con intención y craft)

---

## 2. Paleta de Colores

### Fondos
| Token | Hex | Uso |
|-------|-----|-----|
| `dark-500` | `#080808` | — |
| `dark-400` | `#0a0a0a` | Fondo base de la app |
| `dark-300` | `#0d0d0d` | Fondo de inputs |
| `dark-200` | `#111111` | Fondo de cards |
| `dark-100` | `#141414` | Fondo elevado |
| `dark-50` | `#1a1a1a` | Bordes sutiles, separadores |

### Acento Dorado
| Token | Hex | Uso |
|-------|-----|-----|
| `gold-50` | `#fefce8` | — |
| `gold-100` | `#fef9c3` | — |
| `gold-200` | `#fef08a` | Highlights suaves |
| `gold-300` | `#fde047` | — |
| `gold-400` | `#facc15` | Hover de elementos dorados |
| `gold-500` | `#d4af37` | **Color principal — CTAs, bordes activos, acentos** |
| `gold-600` | `#b8960c` | Hover de botones primarios |
| `gold-700` | `#92750a` | Pressed state |
| `gold-800` | `#78600e` | — |
| `gold-900` | `#713f12` | — |

### Texto
| Color | Uso |
|-------|-----|
| `#ffffff` | Texto principal (headings, body importante) |
| `#a0a0a0` | Texto secundario (descripciones, placeholders) |
| `#555555` | Texto muted (timestamps, metadata) |
| `#0a0a0a` | Texto sobre fondo dorado (botones primarios) |

### Estados
| Estado | Color | Uso |
|--------|-------|-----|
| Éxito | `#22c55e` | Cita confirmada, acción completada |
| Advertencia | `#f59e0b` | Cita pendiente, campos opcionales |
| Error | `#ef4444` | Validación fallida, cita cancelada |
| Info | `#3b82f6` | Información general, tips |

---

## 3. Tipografía

### Fuentes
| Fuente | Peso | Uso |
|--------|------|-----|
| **Space Grotesk** | 700 (Bold) | Headings, CTAs, navigation |
| **Inter** | 400, 500, 600 | Body text, labels, descriptions |
| **JetBrains Mono** | 400, 700 | Precios, códigos de cita, timestamps, datos numéricos |

### Escala (Mobile-First con `clamp()`)
```css
--text-hero:    clamp(2.5rem, 8vw, 4rem);      /* Hero principal */
--text-h1:      clamp(2rem, 5vw, 3.5rem);       /* Títulos de página */
--text-h2:      clamp(1.5rem, 4vw, 2.5rem);     /* Subtítulos */
--text-h3:      clamp(1.25rem, 3vw, 1.75rem);   /* Secciones */
--text-body:    1rem;                             /* 16px - texto base */
--text-sm:      0.875rem;                         /* 14px - labels */
--text-xs:      0.75rem;                          /* 12px - captions */
--text-price:   clamp(1.25rem, 3vw, 1.5rem);    /* Precios (mono) */
```

### Reglas
- Headings: **SIEMPRE** `Space Grotesk Bold`
- CTAs y botones: **UPPERCASE** + `letter-spacing: 0.05em`
- Precios y códigos: **SIEMPRE** `JetBrains Mono`
- Body: `Inter Regular/Medium`
- Line-height: `1.5` para body, `1.2` para headings
- Max-width de texto: `65ch` para legibilidad

---

## 4. Efectos Neo-Brutalistas

### Bordes
```css
/* Bordes estándar */
--border-subtle:    2px solid rgba(26, 26, 26, 0.3);   /* dark-50/30 */
--border-medium:    2px solid #333333;
--border-strong:    2px solid #d4af37;                   /* gold-500 */
--border-hero:      3px solid #d4af37;                   /* CTAs principales */
--border-brutal:    3px solid #0a0a0a;                   /* Sobre fondos claros */
```

### Sombras Duras (SIN blur)
```css
/* Sombras — el blur SIEMPRE es 0 */
--shadow-sm:        2px 2px 0 #333333;
--shadow-md:        4px 4px 0 #333333;
--shadow-lg:        6px 6px 0 #333333;
--shadow-gold-sm:   2px 2px 0 #d4af37;
--shadow-gold-md:   4px 4px 0 #d4af37;
--shadow-gold-lg:   6px 6px 0 #d4af37;
--shadow-black-md:  4px 4px 0 #0a0a0a;    /* Para botones sobre fondo dorado */
```

### Border Radius
```
Botones:     0px          (crudo, brutal)
Inputs:      0px          (consistente con botones)
Cards:       4px - 8px    (suavizado neo, no completamente cuadrado)
Avatares:    9999px       (círculos — excepción intencional)
Badges:      2px          (casi cuadrados)
```

### Efecto Press (interacción táctil)
```css
.brutal-press {
  transition: transform 0.1s, box-shadow 0.1s;
}
.brutal-press:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 currentColor; /* se reduce */
}
```

---

## 5. Componentes Base

### Card
```
┌─────────────────────────────┐
│                             │▓▓
│   Contenido de la card      │▓▓
│                             │▓▓
│                             │▓▓
└─────────────────────────────┘▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

bg: dark-200 (#111111)
border: 2px solid #333
shadow: 4px 4px 0 #333
radius: 4px

Variante GOLD (seleccionada/destacada):
border: 2px solid gold-500
shadow: 4px 4px 0 gold-500
```

### Botón Primario
```
┌──────────────────────┐
│  RESERVAR AHORA  →   │▓▓
└──────────────────────┘▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

bg: gold-500
text: dark-400 (negro)
border: 3px solid dark-400
shadow: 4px 4px 0 #0a0a0a
font: Space Grotesk Bold UPPERCASE
min-height: 48px (mobile touch target)
radius: 0px
```

### Botón Secundario / Outline
```
┌──────────────────────┐
│  VER DETALLES        │▓▓
└──────────────────────┘▓▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

bg: transparent
text: gold-500
border: 2px solid gold-500
shadow: 4px 4px 0 #d4af37
```

### Input
```
┌──────────────────────────────┐
│  placeholder...               │
└──────────────────────────────┘

bg: dark-300 (#0d0d0d)
border: 2px solid #333
radius: 0px
focus → border: gold-500, shadow: 3px 3px 0 #d4af37
min-height: 48px
```

### Badge
```
┌──────────┐
│ BARBERO  │
└──────────┘

border: 2px solid currentColor
font: JetBrains Mono 12px UPPERCASE
letter-spacing: 0.1em
padding: 2px 8px
radius: 2px
```

---

## 6. Layout Mobile-First

### Breakpoints
```
Base (0px):     Mobile — single column, 16px padding
sm (640px):     Mobile grande — igual
md (768px):     Tablet — 2 columnas, sidebar aparece
lg (1024px):    Desktop — sidebar expandida
xl (1280px):    Desktop grande — contenido más ancho
```

### Estructura de Dashboard (Mobile)
```
┌──────────────────────┐
│  ☰  PUNTO FINO    🔔 │  ← Top bar fijo
├──────────────────────┤
│                      │
│                      │
│    Contenido         │
│    scrollable        │
│    full-width        │
│                      │
│                      │
├──────────────────────┤
│ 🏠  📅  ✂️  👤      │  ← Bottom nav fijo
└──────────────────────┘
```

### Estructura de Dashboard (Desktop)
```
┌────────┬──────────────────────────────────┐
│        │  Breadcrumb > Página      🔔 👤  │
│  LOGO  ├──────────────────────────────────┤
│        │                                  │
│  ────  │                                  │
│  🏠    │     Contenido principal          │
│  📅    │     multi-columna                │
│  ✂️    │                                  │
│  👤    │                                  │
│        │                                  │
│  ────  │                                  │
│  avatar│                                  │
│  name  │                                  │
└────────┴──────────────────────────────────┘
```

### Reglas Mobile
- **Touch targets:** Mínimo `44px × 44px` en todos los interactivos
- **Sticky bottom CTA:** En `BookingPage`, botón "Siguiente" siempre visible abajo
- **Bottom sheets:** Modals en mobile se abren desde abajo (no centrados)
- **Swipe navigation:** Tabs y filtros soportan swipe horizontal
- **No hover states en mobile:** Solo `:active` y `:focus-visible`
- **Padding lateral:** `16px` (1rem) en mobile, `24px` en tablet, `32px` en desktop

---

## 7. Animaciones

### Con Framer Motion
| Animación | Uso | Duración |
|-----------|-----|----------|
| `fadeIn` | Entrada de páginas | 0.3s |
| `slideUp` | Entrada de cards y secciones | 0.4s |
| `staggerChildren` | Listas de cards, grids | delay 0.05s |
| `scalePress` | Botones al presionar | 0.1s |
| `slideX` | Transición entre pasos de booking | 0.3s |
| `countUp` | Números en dashboards | 1s ease-out |

### Reglas
- **`prefers-reduced-motion: reduce`** → Desactivar TODAS las animaciones
- NO animar fondos o gradientes (consume batería en mobile)
- Transiciones max `0.4s` — la app debe sentirse **rápida**
- Stagger delay max `0.05s` por item — no hacer esperar al usuario

---

## 8. Iconografía

- **Librería:** Lucide React (ya instalada)
- **Tamaño mobile:** `20px` mínimo para touch targets
- **Tamaño desktop:** `16px-20px`
- **Stroke width:** `2px` (consistente con bordes brutales)
- **Color:** Hereda del texto padre
- **Uso en botones:** Siempre a la izquierda del texto, con `gap-2`

---

## 9. Checklist de Revisión

Antes de dar por terminado cualquier componente o página, verificar:

- [ ] ¿Se ve bien en **375px**? (iPhone SE)
- [ ] ¿Los touch targets son ≥ **44px**?
- [ ] ¿Usa **sombras duras** (sin blur)?
- [ ] ¿Los bordes son **≥ 2px**?
- [ ] ¿La tipografía sigue la **escala definida**?
- [ ] ¿Los precios usan **JetBrains Mono**?
- [ ] ¿Los headings usan **Space Grotesk Bold**?
- [ ] ¿Los botones tienen efecto **press**?
- [ ] ¿Respeta `prefers-reduced-motion`?
- [ ] ¿Contraste WCAG **AA** (4.5:1 texto, 3:1 elementos)?

