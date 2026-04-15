import { useRef, useState } from "react";

const PAGE_SIZE = 25;

export function usePagination<T>(items: T[]) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the items array reference changes
  // (useMemo in useDeploymentFilters returns a new reference on every filter/sort change)
  const prevItemsRef = useRef(items);
  if (items !== prevItemsRef.current) {
    prevItemsRef.current = items;
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = items.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return {
    page: safePage,
    totalPages,
    totalItems: items.length,
    paginatedItems,
    hasPrevPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    setPage,
  };
}
