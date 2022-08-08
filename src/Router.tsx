import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./routerTypes";
import { Order, Login, Catalogue } from "./Pages";
import { Product } from "./Pages/Product";
import React from 'react';
import { Registration } from "./Pages/Registration";
export function Router() {
    return (
        <Routes >
            <Route path={AppRoutes.LOGIN} element={<Login />} />
            <Route path={AppRoutes.REGISTRATION} element={<Registration />} />
            <Route path={AppRoutes.CATALOGUE} element={<Catalogue />} />
            <Route path={AppRoutes.ORDER} element={<Order />} />
            <Route path={`${AppRoutes.PRODUCT}/:productID`} element={<Product />} />
        </Routes>
    )
}