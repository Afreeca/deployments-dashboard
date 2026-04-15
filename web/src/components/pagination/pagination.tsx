import styles from "./pagination.module.scss";

type PaginationProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
  totalItems: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
};

export function Pagination({
  hasNextPage,
  hasPrevPage,
  page,
  totalItems,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        Page {page} of {totalPages} · {totalItems} results
      </span>
      <button
        className={styles.button}
        disabled={!hasPrevPage}
        onClick={onPrev}
        type="button"
      >
        Previous
      </button>
      <button
        className={styles.button}
        disabled={!hasNextPage}
        onClick={onNext}
        type="button"
      >
        Next
      </button>
    </div>
  );
}
