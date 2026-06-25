[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l2PpCgMp)

# Analytics Dashboard — CoreHardware

Aplicación **Analytics Dashboard** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión **CoreHardware**.

Herramienta de inteligencia de negocio (Etapa 3): KPIs, gráficos y métricas consolidadas del ecosistema CoreHardware (Buyer, Seller, Shipping, Payments).

> Sólo lectura. No es un CRUD — consulta cada app vía API y visualiza los datos.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Autenticación:** Clerk (rol `admin`)
- **Estilos:** Tailwind CSS v4
- **Deploy:** Vercel

Sin base de datos: todos los datos vienen de las APIs de las 4 apps del ecosistema.

---

## Estructura del proyecto

```
app/                    → páginas Next.js
  ├ page.tsx            → Landing Page
  ├ dashboard/          → Dashboard global (KPIs)
  ├ logistica/          → métricas de envíos (Shipping App)
  ├ ventas/             → métricas de pedidos y productos (Buyer + Seller)
  ├ finanzas/           → ingresos, pagos, disputas (Payments)
  └ usuarios/           → compradores, vendedores, operadores
components/             → React components reutilizables
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
| Buyer | `/api/control-plane/stats/orders`, `/api/control-plane/stats/buyers` | ❌ Pendientes |
| Seller | `/api/control-plane/stats/sales`, `/api/control-plane/stats/products` | ❌ Pendientes |
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
| Control Plane | — |
| Analytics Dashboard (este) | Agustín Ferrante |

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
