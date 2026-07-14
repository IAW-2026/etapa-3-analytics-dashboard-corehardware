'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PEDIDOS_PAGE_LIMIT } from '@/lib/dashboard/pedidos-types';

// Ventana de páginas visibles alrededor de la actual + primera/última siempre
// visibles, con '...' en los huecos. Evita listar decenas de números si hay
// muchas páginas de resultados.
function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push('ellipsis');
    result.push(p);
  });
  return result;
}

export function PedidosPagination({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / PEDIDOS_PAGE_LIMIT));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  if (total === 0) return null;

  const startItem = (page - 1) * PEDIDOS_PAGE_LIMIT + 1;
  const endItem = Math.min(page * PEDIDOS_PAGE_LIMIT, total);
  const pageList = buildPageList(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 font-mono text-xs text-zinc-500">
      <span>
        {startItem}–{endItem} de {total}
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => canGoPrev && onPageChange(page - 1)}
            disabled={!canGoPrev}
            aria-label="Página anterior"
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>

          {pageList.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-zinc-600">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs transition-colors ${item === page
                    ? 'border-violet-500 bg-violet-600/10 text-violet-400'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            onClick={() => canGoNext && onPageChange(page + 1)}
            disabled={!canGoNext}
            aria-label="Página siguiente"
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}