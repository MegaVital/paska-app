import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"

type Props = {}

export const Home: FC<Props> = () => {
    const navigate = useNavigate()

    const handlePressButton = () => {
        navigate(AppRoutes.CATALOGUE, { replace: true })
    }

    return (
        <div>
            <Button variant="contained" onClick={handlePressButton} color='success' size='medium' sx={{ marginLeft: '30px', marginBottom: '30px', mt: '30px' }}>Move to catalogue</Button>
        </div>
    )
}