import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"

type Props = {}

export const Registration: FC<Props> = () => {
    const navigate = useNavigate()

    const back = () => {
        navigate(AppRoutes.LOGIN, { replace: true })
    }

    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Welcome!</Typography>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 500, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Name</Typography>
                    <TextField id="outlined-basic" variant="outlined" />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>E-mail</Typography>
                    <TextField id="outlined-basic" variant="outlined" />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="outlined-basic" variant="outlined" type="password" />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Repeat password</Typography>
                    <TextField id="outlined-basic" variant="outlined" type="password" />
                </Box>
                <Button variant='contained'
                    // onClick={handlePressButton} 
                    color='primary' size='large'
                    sx={{ margin: 2 }}
                >Create an account</Button>
                <Button variant='contained' onClick={back} color='error' size='large'
                    sx={{ margin: 2 }}
                >I'm stupid, I already have an account</Button>
            </Card>
        </Box>

    )
}