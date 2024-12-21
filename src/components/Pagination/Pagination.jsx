import React from "react";
import "./_pagination.scss";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        className="pagination__button pagination__button--prev"
        onClick={() => onPageChange("prev")}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="pagination__info">
        Page <span className="pagination__current">{currentPage}</span> of{" "}
        <span className="pagination__total">{totalPages}</span>
      </span>
      <button
        className="pagination__button pagination__button--next"
        onClick={() => onPageChange("next")}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
