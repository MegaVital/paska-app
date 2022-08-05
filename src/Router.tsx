import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./routerTypes";
import { Order, Home, Catalogue } from "./Pages";
import { Product } from "./Pages/Product";
import React from 'react';
export function Router() {
    return (
        <Routes >
            <Route path={AppRoutes.HOME} element={<Home />} />
            <Route path={AppRoutes.CATALOGUE} element={<Catalogue />} />
            <Route path={AppRoutes.ORDER} element={<Order />} />
            <Route path={`${AppRoutes.PRODUCT}/:productID`} element={<Product />} />
        </Routes>
    )
}