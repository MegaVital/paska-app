import { Routes, Route, Navigate } from "react-router-dom";
import { AppRoutes } from "./routerTypes";
import { Order, Login, Catalogue } from "./Pages";
import { Product } from "./Pages/Product";
import React, { useState } from 'react';
import { Registration } from "./Pages/Registration";
import { useAppSelector } from "./redux/hooks";
import { Header } from "./components/Header";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext, getDesignTokens } from "./service.helper";
import { PaletteMode } from "@mui/material";
import { useDispatch } from "react-redux";
import { currentTheme } from "./redux/themeReducer";


export function Router() {
    const dispatcher = useDispatch()
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice).isAuth
    const page = useAppSelector(state => state.persistedReducer.pageSlice.page)
    const reducerTheme = useAppSelector<PaletteMode>(state => state.persistedReducer.themeSlice.mode)
    const [mode, setMode] = useState<PaletteMode>(reducerTheme === 'dark' ? 'light' : 'dark');
    const colorMode = ({
        toggleColorMode: () => {
            dispatcher(currentTheme(mode))
            setMode((mode) => (mode === 'light' ? 'dark' : 'light')
            );
        },
    })

    let theme = createTheme((getDesignTokens(reducerTheme)))

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <Routes >
                    <Route path={AppRoutes.LOGIN} element={(!tokenState) ? <Login /> : <Navigate to={`/catalogue/page=${page}`} replace={true} />} />
                    <Route path={AppRoutes.REGISTRATION} element={(!tokenState) ? <Registration /> : <Navigate to={`/catalogue/page=${page}`} replace={true} />} />
                    <Route path={`${AppRoutes.CATALOGUE}/page=${page}`} element={(tokenState) ? <Catalogue /> : <Navigate to="/" replace={true} />} />
                    <Route path={AppRoutes.ORDER} element={(tokenState) ? <Order /> : <Navigate to="/" replace={true} />} />
                    <Route path={`${AppRoutes.PRODUCT}/:productID`} element={(tokenState) ? <Product /> : <Navigate to="/" replace={true} />} />
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}