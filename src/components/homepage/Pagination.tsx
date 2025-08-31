import { useMemo, useCallback } from "react";
import { formsActions } from "../../store/formsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { AppDispatch } from "../../store/Store";

interface PaginationProps {
  totalPages: number;
  filteredFormsLength: number;
  formsPerPage: number;
}

export default function Pagination({
  totalPages,
  filteredFormsLength,
  formsPerPage,
}: PaginationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPage } = useSelector((state: RootState) => state.forms);
  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(formsActions.setCurrentPage(newPage));
    },
    [dispatch]
  );

  const renderPaginationButtons = useMemo(() => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (filteredFormsLength <= formsPerPage) return [];
    if (totalPages <= 0) return [];

    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(0)}
        className={`px-3 py-1 mx-1 rounded text-black ${
          currentPage === 0
            ? "bg-purple"
            : "bg-black text-purple hover:bg-purple hover:text-black"
        }`}
        disabled={currentPage === 0}
      >
        1
      </button>
    );

    if (totalPages > 1) {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

      if (endPage - startPage < maxVisiblePages - 2) {
        startPage = Math.max(1, endPage - (maxVisiblePages - 2));
      }

      if (startPage > 1) {
        buttons.push(
          <span key="ellipsis-start" className="px-3 py-1">
            ...
          </span>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 mx-1 rounded text-black ${
              currentPage === i
                ? "bg-purple "
                : "bg-black text-purple hover:bg-purple hover:text-black"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="px-3 py-1">
            ...
          </span>
        );
      }

      if (
        totalPages > 5 &&
        currentPage !== totalPages - 1 &&
        currentPage !== totalPages - 2
      ) {
        buttons.push(
          <button
            key="last"
            onClick={() => handlePageChange(totalPages - 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === totalPages - 1
                ? "bg-purple"
                : "bg-black text-purple hover:bg-purple hover:text-black"
            }`}
            disabled={currentPage === totalPages - 1}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  }, [
    currentPage,
    handlePageChange,
    totalPages,
    filteredFormsLength,
    formsPerPage,
  ]);

  return (
    <div className="mt-6 flex justify-center items-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 rounded bg-purple text-black hover:text-purple hover:bg-black disabled:opacity-50 mr-2 disabled:hover:none"
      >
        &lt; Prev
      </button>
      <div className="flex mx-2">{renderPaginationButtons}</div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-1 rounded bg-purple text-black hover:text-purple hover:bg-black disabled:opacity-50 ml-2"
      >
        Next &gt;
      </button>
    </div>
  );
}
