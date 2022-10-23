import { Routes, Route, Navigate } from "react-router-dom";
import { AppRoutes } from "./routerTypes";
import { Order, Login, Catalogue } from "./Pages";
import { Product } from "./Pages/Product";
import React from 'react';
import { Registration } from "./Pages/Registration";
import { useAppSelector } from "./redux/hooks";
export function Router() {
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice).isAuth
    const page = useAppSelector(state => state.persistedReducer.pageSlice.page)

    return (

        <Routes >
            <Route path={AppRoutes.LOGIN} element={(!tokenState) ? <Login /> : <Navigate to={`/catalogue/page=${page}`} replace={true} />} />
            <Route path={AppRoutes.REGISTRATION} element={(!tokenState) ? <Registration /> : <Navigate to={`/catalogue/page=${page}`} replace={true} />} />
            <Route path={`${AppRoutes.CATALOGUE}/page=${page}`} element={(tokenState) ? <Catalogue /> : <Navigate to="/" replace={true} />} />
            <Route path={AppRoutes.ORDER} element={(tokenState) ? <Order /> : <Navigate to="/" replace={true} />} />
            <Route path={`${AppRoutes.PRODUCT}/:productID`} element={(tokenState) ? <Product /> : <Navigate to="/" replace={true} />} />
        </Routes>

    )
}