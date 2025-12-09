export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <button
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={!canNext}
        onClick={() => canNext && onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
