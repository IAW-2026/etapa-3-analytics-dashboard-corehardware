import type {
  Comprador,
  Pedido,
  PedidosPageResponse,
  ForeignSale,
  EnviosResponse,
  Pago,
  Disputa,
  Producto,
  ProductosResponse,
  Vendedor,
  VendedoresResponse,
  Operador,
  OperadoresResponse,
} from "./types";

async function fetchJson<T>(url: string, apiKey: string | undefined): Promise<T> {
  if (!apiKey) {
    throw new Error("API key no configurada");
  }
  const res = await fetch(url, {
    headers: { "X-API-Key": apiKey },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export function fetchCompradores() {
  return fetchJson<Comprador[]>(`${process.env.BUYER_APP_URL}/api/buyers`, process.env.BUYER_API_KEY);
}

// No reemplaza a fetchPedidos(): esa sigue alimentando la tabla en vivo vía
// /api/dashboard-analytics/orders/all. Esta recorre /api/dashboard-analytics/orders (que pagina,
export function fetchPedidos() {
  return fetchJson<Pedido[]>(`${process.env.BUYER_APP_URL}/api/dashboard-analytics/orders/all`, process.env.BUYER_API_KEY);
}

export function fetchVentas() {
  return fetchJson<ForeignSale[]>(`${process.env.SELLER_APP_URL}/api/sales`, process.env.SELLER_API_KEY);
}

export function fetchEnvios() {
  return fetchJson<EnviosResponse>(`${process.env.SHIPPING_APP_URL}/api/analytics/envios`, process.env.SHIPPING_API_KEY);
}

export function fetchPagos() {
  return fetchJson<Pago[]>(`${process.env.PAYMENTS_APP_URL}/api/payments`, process.env.PAYMENTS_API_KEY);
}

export function fetchDisputas() {
  return fetchJson<Disputa[]>(`${process.env.PAYMENTS_APP_URL}/api/disputes`, process.env.PAYMENTS_API_KEY);
}

export async function fetchProductos(): Promise<Producto[]> {
  const res = await fetchJson<ProductosResponse>(
    `${process.env.SELLER_APP_URL}/api/analytics/products`,
    process.env.SELLER_API_KEY
  );
  return res.items;
}

export async function fetchVendedores(): Promise<Vendedor[]> {
  const res = await fetchJson<VendedoresResponse>(
    `${process.env.SELLER_APP_URL}/api/analytics/sellers`,
    process.env.SELLER_API_KEY
  );
  return res.items.map((s) => ({ ...s, fecha_alta: s.fecha_creacion }));
}

// Endpoint de LISTADO de operadores (distinto de /api/analytics/operators/growth,
// que solo da la serie temporal para el gráfico). Este es el que necesita
// OperatorsTable en usuarios/page.tsx: nombre/dni/mail/celular completos.
export async function fetchOperadores(): Promise<Operador[]> {
  const res = await fetchJson<OperadoresResponse>(
    `${process.env.SHIPPING_APP_URL}/api/analytics/operadores`,
    process.env.SHIPPING_API_KEY
  );
  return res.items.map((o) => ({ ...o, fecha_alta: o.fecha_alta }));
}

// ── Fetch paginado de pedidos por rango de fechas ──────────────────────────
// No reemplaza a fetchPedidos(): esa sigue alimentando la tabla en vivo vía
// /api/orders/all. Esta recorre /api/dashboard-analytics/orders (que pagina,
// máx 100 por página) hasta juntar el total del rango solicitado.
export async function fetchPedidosEnRango(
  fechaDesde: string,
  fechaHasta: string,
  estados?: string[]
): Promise<Pedido[]> {
  const limit = 100;
  let offset = 0;
  const pedidos: Pedido[] = [];

  while (true) {
    const url = new URL(`${process.env.BUYER_APP_URL}/api/dashboard-analytics/orders`);
    url.searchParams.set("fechaDesde", fechaDesde);
    url.searchParams.set("fechaHasta", fechaHasta);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    if (estados && estados.length > 0) {
      url.searchParams.set("estado", estados.join(","));
    }

    const page = await fetchJson<PedidosPageResponse>(url.toString(), process.env.BUYER_API_KEY);
    pedidos.push(...page.items);

    if (page.items.length < limit || pedidos.length >= page.total) break;
    offset += limit;
  }

  return pedidos;
}

export type SourceFetchResults = {
  compradores: PromiseSettledResult<Comprador[]>;
  pedidos: PromiseSettledResult<Pedido[]>;
  ventas: PromiseSettledResult<ForeignSale[]>;
  envios: PromiseSettledResult<EnviosResponse>;
  pagos: PromiseSettledResult<Pago[]>;
  disputas: PromiseSettledResult<Disputa[]>;
  operadores: PromiseSettledResult<Operador[]>;
};

export async function fetchAllSources(): Promise<SourceFetchResults> {
  const [compradores, pedidos, ventas, envios, pagos, disputas, operadores] = await Promise.allSettled([
    fetchCompradores(),
    fetchPedidos(),
    fetchVentas(),
    fetchEnvios(),
    fetchPagos(),
    fetchDisputas(),
    fetchOperadores(),
  ]);

  return { compradores, pedidos, ventas, envios, pagos, disputas, operadores };
}