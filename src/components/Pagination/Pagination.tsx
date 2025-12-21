import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number; 
  totalPages: number;
  onPageChange: (page: number) => void; 
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.page}
      nextClassName={css.page}
      breakClassName={css.page}
      disabledClassName={css.disabled}
      pageLinkClassName={css.link}
      previousLinkClassName={css.link}
      nextLinkClassName={css.link}
      breakLinkClassName={css.link}
      previousLabel={"←"}
      nextLabel={"→"}
      breakLabel={"..."}
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
    />
  );
}