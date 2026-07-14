export type SortableField = "fecha" | "monto" | "estado";
export type SortDirection = "asc" | "desc";

export type PedidosFilters = {
  estados: string[];
  fechaDesde: string; // formato yyyy-mm-dd, "" si no está seteado
  fechaHasta: string;
  page: number;
  sortBy: SortableField;
  sortDir: SortDirection;
};

export const PEDIDOS_PAGE_LIMIT = 20;

export const DEFAULT_PEDIDOS_FILTERS: PedidosFilters = {
  estados: [],
  fechaDesde: "",
  fechaHasta: "",
  page: 1,
  sortBy: "fecha",
  sortDir: "desc",
};