import { UserGrowthPoint, UsersGrowthData } from "./types"

type ServiceGrowthResponse = {
  total: number
  items: { fecha: string; cantidad: number }[]
}

/**
 * Fetch genérico a un endpoint de growth de un microservicio. Devuelve
 * null (en vez de lanzar) ante cualquier falla de red, timeout, o
 * respuesta no-ok, porque el caller decide qué hacer con cada servicio
 * caído de forma distinta (Buyer/Seller son críticos, Shipping no).
 */
async function fetchGrowth(
  baseUrl: string | undefined,
  apiKey: string | undefined,
  path: string,
  from: string,
  to: string
): Promise<ServiceGrowthResponse | null> {
  if (!baseUrl || !apiKey) {
    console.error(`[lib/users/growth] Falta baseUrl o apiKey para ${path}`)
    return null
  }
  try {
    const res = await fetch(`${baseUrl}${path}?from=${from}&to=${to}`, {
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    })
    if (!res.ok) {
      console.error(`[lib/users/growth] ${path} respondió ${res.status}`)
      return null
    }
    return (await res.json()) as ServiceGrowthResponse
  } catch (e) {
    console.error(`[lib/users/growth] fetch falló para ${path}`, e)
    return null
  }
}

/**
 * Trae las 3 series (Compradores, Vendedores, Operadores) para el rango
 * [from, to] y las mergea en una única serie por fecha.
 *
 * Compradores y Vendedores son críticos: si ambos fallan, points queda
 * vacío (no hay eje de fechas confiable para armar el gráfico).
 * Operadores es best-effort vía Promise.allSettled: si Shipping falla,
 * el gráfico se arma igual con Compradores/Vendedores, y
 * operadoresDisponible queda en false para que la UI lo indique en vez
 * de mostrar una serie de Operadores en cero (ver comentario en types.ts).
 *
 * from/to en formato YYYY-MM-DD, ya calculados por el caller según
 * granularidad (día/mes/año) — esta función no calcula rangos, solo
 * consume un rango ya resuelto.
 */
export async function getUsersGrowthForRange(
  from: string,
  to: string
): Promise<UsersGrowthData> {
  const [buyerRes, sellerRes, shippingRes] = await Promise.allSettled([
    fetchGrowth(
      process.env.BUYER_APP_URL,
      process.env.BUYER_API_KEY,
      "/api/dashboard-analytics/buyers/growth",
      from,
      to
    ),
    fetchGrowth(
      process.env.SELLER_APP_URL,
      process.env.SELLER_API_KEY,
      "/api/analytics/sellers/growth",
      from,
      to
    ),
    fetchGrowth(
      process.env.SHIPPING_APP_URL,
      process.env.SHIPPING_API_KEY,
      "/api/analytics/operators/growth",
      from,
      to
    ),
  ])

  const buyerData = buyerRes.status === "fulfilled" ? buyerRes.value : null
  const sellerData = sellerRes.status === "fulfilled" ? sellerRes.value : null
  const shippingData = shippingRes.status === "fulfilled" ? shippingRes.value : null

  const operadoresDisponible = shippingData !== null

  // Mapas por fecha en vez de confiar en el índice del array: los 3
  // servicios rellenan huecos con cantidad:0 sobre su propio rango, pero
  // no vale la pena asumir que los arrays vienen alineados 1 a 1.
  const buyerByDay = new Map((buyerData?.items ?? []).map((i) => [i.fecha, i.cantidad]))
  const sellerByDay = new Map((sellerData?.items ?? []).map((i) => [i.fecha, i.cantidad]))
  const shippingByDay = new Map((shippingData?.items ?? []).map((i) => [i.fecha, i.cantidad]))

  // El eje de fechas lo define la unión de Compradores/Vendedores (los
  // servicios críticos). Si ambos fallan, no queda ninguna fecha y el
  // gráfico se muestra vacío en vez de con datos parciales inventados.
  const allDays = new Set<string>([...buyerByDay.keys(), ...sellerByDay.keys()])
  const sortedDays = Array.from(allDays).sort()

  const points: UserGrowthPoint[] = sortedDays.map((fecha) => ({
    fecha,
    compradores: buyerByDay.get(fecha) ?? 0,
    vendedores: sellerByDay.get(fecha) ?? 0,
    operadores: operadoresDisponible ? shippingByDay.get(fecha) ?? 0 : null,
  }))

  return { points, operadoresDisponible }
}