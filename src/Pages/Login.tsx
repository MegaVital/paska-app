import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"

type Props = {}

export const Login: FC<Props> = () => {
    const navigate = useNavigate()

    const signIn = () => {
        navigate(AppRoutes.CATALOGUE, { replace: true })
    }
    const signUp = () => {
        navigate(AppRoutes.REGISTRATION, { replace: true })
    }

    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Hello world!</Typography>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 400, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Name or E-mail</Typography>
                    <TextField id="outlined-basic" variant="outlined" />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="outlined-basic" variant="outlined" type="password" />
                </Box>
                <Button variant='contained' onClick={signIn} color='success' size='medium'
                    sx={{ margin: 5 }}
                >Sign in</Button>
                <Button variant='contained' onClick={signUp} color='primary' size='medium'
                    sx={{ margin: 5 }}
                >Create an account</Button>
            </Card>
        </Box>

    )
}