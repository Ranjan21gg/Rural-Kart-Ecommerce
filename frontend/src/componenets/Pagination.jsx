export default function Pagination({ page, setPage, hasNext, hasPrevious, count, pageSize }) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={!hasPrevious}
        className="rounded-4xl border border-stone-500 px-4 py-2 text-sm
         font-semibold disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-blue-500/50 cursor-pointer"
      >
        Previous
      </button>
      <span className="text-sm text-stone-600">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasNext}
        className="rounded-4xl border border-stone-500 px-4 py-2 text-sm
         font-semibold disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-blue-500/50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}