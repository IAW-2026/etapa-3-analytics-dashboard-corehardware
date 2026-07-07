import type { Comprador, Pedido, ForeignSale, EnviosResponse, Pago, Disputa } from "./types";

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

export function fetchPedidos() {
  return fetchJson<Pedido[]>(`${process.env.BUYER_APP_URL}/api/orders/all`, process.env.BUYER_API_KEY);
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

export type SourceFetchResults = {
  compradores: PromiseSettledResult<Comprador[]>;
  pedidos: PromiseSettledResult<Pedido[]>;
  ventas: PromiseSettledResult<ForeignSale[]>;
  envios: PromiseSettledResult<EnviosResponse>;
  pagos: PromiseSettledResult<Pago[]>;
  disputas: PromiseSettledResult<Disputa[]>;
};

export async function fetchAllSources(): Promise<SourceFetchResults> {
  const [compradores, pedidos, ventas, envios, pagos, disputas] = await Promise.allSettled([
    fetchCompradores(),
    fetchPedidos(),
    fetchVentas(),
    fetchEnvios(),
    fetchPagos(),
    fetchDisputas(),
  ]);

  return { compradores, pedidos, ventas, envios, pagos, disputas };
}