import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { currentPage } from "../redux/pageReducer";
import { UsePagination } from "../service.helper";

const usePagination: UsePagination = ({ contentPerPage, count }) => {
    const [page, setPage] = useState(1);
    const dispatcher = useAppDispatch()
    const pageInReducer = useAppSelector(state => state.persistedReducer.pageSlice.page)
    const navigate = useNavigate()
    const pageCount = Math.ceil(count / contentPerPage);
    const lastContentIndex = pageInReducer * contentPerPage;
    const firstContentIndex = lastContentIndex - contentPerPage;

    const changePage = (direction: boolean) => {
        const newPage = () => {
            if (direction) {
                if (pageInReducer === pageCount) {
                    return pageInReducer;
                }
                return pageInReducer + 1;
            } else {
                if (pageInReducer === 1) {
                    return pageInReducer;
                }
                return pageInReducer - 1;
            }
        };
        dispatcher(currentPage(newPage()))
        navigate(`Furniture-Shop-app/catalogue/page=${newPage()}`)

    };

    const setPageSAFE = (num: number) => {
        if (num > pageCount) {
            setPage(pageCount);
        } else if (num < 1) {
            setPage(1);
        } else {
            setPage(num);
        }
        dispatcher(currentPage(num))
        navigate(`Furniture-Shop-app/catalogue/page=${num}`)
    };

    return {
        totalPages: pageCount,
        nextPage: () =>
            changePage(true),
        prevPage: () =>
            changePage(false)
        ,
        setPage: setPageSAFE,
        firstContentIndex,
        lastContentIndex,
        page,
    };
};

export default usePagination