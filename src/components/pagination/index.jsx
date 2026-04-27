import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DOTS = "…";

// definePageRange;
function getPaginationRange(totalPages, currentPage, siblingCount) {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const pages = [];

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    pages.push(...leftRange, DOTS, totalPages);
  } else if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + 1 + i
    );
    pages.push(1, DOTS, ...rightRange);
  } else if (showLeftDots && showRightDots) {
    const middleRange = Array.from(
      { length: siblingCount * 2 + 1 },
      (_, i) => leftSibling + i
    );
    pages.push(1, DOTS, ...middleRange, DOTS, totalPages);
  }

  return pages;
}

const Pagination = ({
  totalItems,
  currentPage,
  pageSize,
  siblingCount = 1,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const paginationRange = getPaginationRange(
    totalPages,
    currentPage,
    siblingCount
  );

  const onNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      {/* Previous */}
      <button
        className="bg-gray-100 h-10 w-10 center rounded-full"
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {paginationRange.map((page, idx) => {
          if (page === DOTS) {
            return (
              <span
                key={idx}
                className="px-2 text-muted-foreground select-none"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={idx}
              className="bg-gray-100 h-10 w-10 center rounded-full"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        className="bg-gray-100 h-10 w-10 center rounded-full"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
