import React, { FC, useState } from "react";
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

    const [nameOrEmail, setNameOrEmail] = useState('')
    const handleNameOrEmailInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameOrEmail(event.target.value)
    }
    const [pass, setPass] = useState('')
    const handlePassInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPass(event.target.value)
    }

    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Hello world!</Typography>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 400, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Name or E-mail</Typography>
                    <TextField id="name" variant="outlined" sx={{ background: 'white' }}
                        onChange={handleNameOrEmailInput}
                        value={nameOrEmail} />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="password" variant="outlined" type="password" sx={{ background: 'white' }}
                        onChange={handlePassInput}
                        value={pass} />
                </Box>
                <Button variant='contained' onClick={signIn} color='success' size='large'
                    sx={{ margin: 2 }}
                >Sign in</Button>
                <Button variant='contained' onClick={signUp} color='primary' size='large'
                    sx={{ margin: 2 }}
                >Create an account</Button>
            </Card>
        </Box>

    )
}