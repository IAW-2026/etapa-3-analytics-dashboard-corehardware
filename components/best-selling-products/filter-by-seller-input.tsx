"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SellerNameId } from "@/types/types";

type Props = {
  sellersNamesIds: SellerNameId[] | null;
  selectedSellerId?: string;
  onSelectSeller: (sellerId?: string) => void;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function FilterBySellerInput({ sellersNamesIds, selectedSellerId, onSelectSeller }: Props) {
  const selectedSeller = sellersNamesIds?.find((seller) => seller.id === selectedSellerId);
  const [query, setQuery] = useState(selectedSeller?.name ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSeller?.name && selectedSeller.name !== query) {
      setQuery(selectedSeller.name);
    }
    if (!selectedSellerId) {
      setQuery("");
    }
  }, [selectedSellerId, selectedSeller?.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedQuery = normalize(query);
  const filteredSellers = useMemo(() => {
    if (!sellersNamesIds) {
      return [];
    }

    if (normalizedQuery.length === 0) {
      return sellersNamesIds.slice(0, 8);
    }

    return sellersNamesIds
      .filter((seller) => normalize(seller.name).includes(normalizedQuery))
      .slice(0, 8);
  }, [sellersNamesIds, normalizedQuery]);

  const hasResults = filteredSellers.length > 0;
  const showHint = normalizedQuery.length > 0 && !hasResults;

  const handleSelect = (sellerId?: string, sellerName?: string) => {
    setQuery(sellerName ?? "");
    setIsOpen(false);
    setHighlightedIndex(0);
    onSelectSeller(sellerId);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(0);
    onSelectSeller(undefined);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (event.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.min(current + 1, filteredSellers.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && hasResults) {
      event.preventDefault();
      const seller = filteredSellers[highlightedIndex];
      if (seller) {
        handleSelect(seller.id, seller.name);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-md">
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="seller-autocomplete">
        Filtrar por vendedor
      </label>
      <div className="relative">
        <input
          id="seller-autocomplete"
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar vendedor..."
          disabled={!sellersNamesIds}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
        />

        {(query || selectedSellerId) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Limpiar
          </button>
        )}

        {isOpen && sellersNamesIds && (
          <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-950">
            {showHint ? (
              <div className="p-3 text-sm text-neutral-500 dark:text-neutral-400">No hay vendedores que coincidan.</div>
            ) : (
              <ul role="listbox" className="space-y-1 p-2">
                {filteredSellers.map((seller, index) => (
                  <li
                    key={seller.id}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(seller.id, seller.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`cursor-pointer rounded-2xl px-3 py-2 text-sm transition ${
                      highlightedIndex === index
                        ? "bg-violet-500 text-white"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    }`}
                  >
                    {seller.name}
                  </li>
                ))}
                {!hasResults && normalizedQuery.length === 0 && sellersNamesIds.length === 0 && (
                  <li className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">No hay vendedores disponibles.</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
