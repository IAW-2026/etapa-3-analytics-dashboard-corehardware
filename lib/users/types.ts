/**
 * Un punto de la serie temporal combinada de crecimiento (Compradores +
 * Vendedores + Operadores) para un día puntual.
 *
 * `operadores` es `number | null`, NO `number` con default 0, porque hay
 * una diferencia real entre "Shipping respondió y hubo 0 altas ese día"
 * y "Shipping falló y no sabemos cuántas altas hubo". Si se usara 0 para
 * ambos casos, un fallo silencioso de Shipping se vería como una línea
 * plana en cero en el gráfico, indistinguible de un día real sin altas.
 * El componente de gráfico decide cómo renderizar null (ver
 * UsersGrowthChart.tsx: la serie de Operadores no se dibuja si
 * operadoresDisponible es false, en vez de dibujar una línea de ceros).
 */
export type UserGrowthPoint = {
  fecha: string // YYYY-MM-DD
  compradores: number
  vendedores: number
  operadores: number | null
}

/**
 * Resultado de armar la serie combinada. `operadoresDisponible` es la señal
 * explícita de si Shipping respondió correctamente en este request — el
 * componente de UI la usa para decidir si mostrar la línea de Operadores
 * en la leyenda como "sin datos" en vez de simplemente omitirla sin avisar.
 */
export type UsersGrowthData = {
  points: UserGrowthPoint[]
  operadoresDisponible: boolean
}

export type UsersGranularity = "day" | "month" | "year"