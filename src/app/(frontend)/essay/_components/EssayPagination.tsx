"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

interface EssayPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EssayPagination({ currentPage, totalPages, onPageChange }: EssayPaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  const pageNumbers = useMemo(() => {
    const showCount = 5;
    const arr: number[] = [];

    if (totalPages <= showCount + 2) {
      for (let i = 2; i < totalPages; i++) {
        arr.push(i);
      }
      return arr;
    }

    let start = Math.max(2, currentPage - Math.floor((showCount - 3) / 2));
    let end = Math.min(totalPages - 1, start + showCount - 3);

    if (currentPage < showCount - 1) {
      start = 2;
      end = start + showCount - 3;
    }

    if (currentPage > totalPages - (showCount - 2)) {
      end = totalPages - 1;
      start = end - showCount + 3;
    }

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  }, [currentPage, totalPages]);

  const showStartEllipsis = pageNumbers.length > 0 && pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  const goToPage = () => {
    const pageNum = Number.parseInt(jumpPage, 10);
    if (!Number.isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
    setJumpPage("");
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav id="essay-pagination" className="essay-pagination">
      {currentPage > 1 ? (
        <div className="extend prev" onClick={() => onPageChange(currentPage - 1)}>
          <Icon icon="fa6-solid:chevron-left" width={12} />
          <div className="pagination_tips_prev">上页</div>
        </div>
      ) : null}

      <div className="pagination">
        <div className={`page-number ${currentPage === 1 ? "current" : ""}`} onClick={() => onPageChange(1)}>
          1
        </div>

        {showStartEllipsis ? <span className="space">...</span> : null}

        {pageNumbers.map(page => (
          <div
            key={page}
            className={`page-number ${page === currentPage ? "current" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </div>
        ))}

        {showEndEllipsis ? <span className="space">...</span> : null}

        {totalPages > 1 ? (
          <div
            className={`page-number ${totalPages === currentPage ? "current" : ""}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </div>
        ) : null}

        <div className="toPageGroup">
          <div className="extend">
            <Icon icon="fa6-solid:angles-right" width={14} />
          </div>
          <input
            value={jumpPage}
            className="toPageText"
            type="text"
            inputMode="numeric"
            maxLength={3}
            aria-label="toPage"
            onChange={e => setJumpPage(e.target.value.replace(/[^\d]/g, ""))}
            onKeyUp={e => {
              if (e.key === "Enter") {
                goToPage();
              }
            }}
          />
          <div className="toPageButton" onClick={goToPage}>
            <Icon icon="fa6-solid:angles-right" width={14} />
          </div>
        </div>
      </div>

      {currentPage < totalPages ? (
        <div className="extend next" onClick={() => onPageChange(currentPage + 1)}>
          <div className="pagination_tips_next">下页</div>
          <Icon icon="fa6-solid:chevron-right" width={12} />
        </div>
      ) : null}
    </nav>
  );
}
