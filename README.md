[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l2PpCgMp)

# Analytics Dashboard — CoreHardware

Aplicación **Analytics Dashboard** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión **CoreHardware**.

Herramienta de inteligencia de negocio (Etapa 3): KPIs, gráficos y métricas consolidadas del ecosistema CoreHardware (Buyer, Seller, Shipping, Payments).

> Sólo lectura. No es un CRUD — consulta cada app vía API y visualiza los datos.

## Enlace de deployment:
- https://analytics-dashboard-corehardware.vercel.app/

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Autenticación:** Clerk (rol `admin`)
- **Estilos:** Tailwind CSS v4
- **Deploy:** Vercel
- **Base de Datos:** Prisma + Neon (Solo se utiliza para datos procesados y gráficos, los datos crudos se obtienen a travez de las APIs de las otras apps)


---

## Estructura del proyecto

```
app/                    → páginas Next.js
  ├ page.tsx            → Landing Page
  ├ dashboard/          → Dashboard global (KPIs)
  ├ pedidos/            → Estadísticas y datos de los pedidos
  ├ logistica/          → métricas de envíos (Shipping App)
  ├ ventas/             → datos de las ventas
  ├ finanzas/           → ingresos, pagos, disputas (Payments)
  ├ usuarios/           → compradores, vendedores, operadores
  └ productos/          → productos más vendidos
components/             → React components reutilizables
prisma/                 → Base de datos (Solo estadísticas calculadas)
styles/                 → Estilos
types/                  → Tipos de datos
proxy.ts                → bloquea acceso sin rol admin
```

---

## Branches

| Branch | Uso |
|--------|-----|
| `main` | Produccion |
| `develop` | Integración de features |
| `feature/*` | Features puntuales que se mergean a `develop` |
| `fix/*`     | Fixes de bugs o inconcistencias que se mergean a `develop` | 

---

## Usuarios

- Usuario único (solo administrador puede logearse al Analytics Dashboard) :admin+clerk_test@iaw.com
- Password: iawuser#

---

## Setup local

```bash
git clone git@github.com:IAW-2026/etapa-3-analytics-dashboard-corehardware.git
cd etapa-3-analytics-dashboard-corehardware
git checkout develop
pnpm install
# Crear .env.local siguiendo .env.example
pnpm dev
```

Abrir `http://localhost:3000` y loguearse con un usuario admin de Clerk.

---

## Integraciones

| App | Endpoints stats esperados | Estado |
|-----|--------------------------|--------|
| Shipping | `/api/admin/stats/resumen`, `/api/admin/stats/envios-por-estado`, `/api/admin/stats/operadores-top`, `/api/admin/stats/entregas-recientes` | ✅ Listos |
| Buyer | `/api/control-plane/stats/orders`, `/api/control-plane/stats/buyers` | ✅ Listos |
| Seller | `/api/analytics/sellers`, `/api/analytics/products`, `/api/sales`, `/api/products/best-selling `, `/api/sellers/names-ids` | ✅ Listos |
| Payments | `/api/payments`, `/api/disputes` | ✅ Listos |

A medida que cada app expone sus endpoints, el Dashboard los va consumiendo.

---

## Responsables del ecosistema

| App | Owner |
|-----|-------|
| Buyer | Yanina Rivera |
| Seller | Sebastián Pereda |
| Shipping | Matías Junca |
| Payments | Agustín Ferrante |
| Control Plane | Agustín Ferrante |
| Analytics Dashboard (este) | Agustín Ferrante / Yanina Rivera / Matías Junca / Sebastián Pereda|


