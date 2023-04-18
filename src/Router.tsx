import { Routes, Route, Navigate } from "react-router-dom";
import { AppRoutes } from "./routerTypes";
import { Order, Login, Catalogue } from "./Pages";
import { Product } from "./Pages/Product";
import React from 'react';
import { Registration } from "./Pages/Registration";
import { useAppSelector } from "./redux/hooks";
import { Header } from "./components/Header";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from "./service.helper";
import { PaletteMode } from "@mui/material";


export function Router() {
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice).isAuth
    const page = useAppSelector(state => state.persistedReducer.pageSlice.page)
    const reducerTheme = useAppSelector<PaletteMode>(state => state.persistedReducer.themeSlice.mode)
    let theme = createTheme((getDesignTokens(reducerTheme)))

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Routes >
                <Route path={`Furniture-Shop-app${AppRoutes.LOGIN}`} element={(!tokenState) ? <Login /> : <Navigate to={`Furniture-Shop-app/catalogue/page=${page}`} replace={true} />} />
                <Route path={`Furniture-Shop-app${AppRoutes.REGISTRATION}`} element={(!tokenState) ? <Registration /> : <Navigate to={`Furniture-Shop-app/catalogue/page=${page}`} replace={true} />} />
                <Route path={`Furniture-Shop-app${AppRoutes.CATALOGUE}/page=${page}`} element={(tokenState) ? <Catalogue /> : <Navigate to="Furniture-Shop-app/" replace={true} />} />
                <Route path={`Furniture-Shop-app${AppRoutes.ORDER}`} element={(tokenState) ? <Order /> : <Navigate to="Furniture-Shop-app/" replace={true} />} />
                <Route path={`Furniture-Shop-app${AppRoutes.PRODUCT}/:productID`} element={(tokenState) ? <Product /> : <Navigate to="Furniture-Shop-app/" replace={true} />} />
            </Routes>
        </ThemeProvider>
    )
}