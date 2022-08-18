import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"
import { LogInFields } from "../types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CssVarsProvider, Sheet } from "@mui/joy";
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);

type Props = {}

export const Login: FC<Props> = () => {
    const navigate = useNavigate()

    const signIn = () => {
        navigate(AppRoutes.CATALOGUE, { replace: true })
    }

    const signUp = () => {
        navigate(AppRoutes.REGISTRATION, { replace: true })
    }

    const initialFields: LogInFields = {
        nameOrEmail: '',
        pass: ''
    }

    const [logInFields, setLogInFields] = useState<LogInFields>(initialFields)
    const handleLogInFieldsInput = (fieldValue: string, propertyName: string) => {
        setLogInFields({
            ...logInFields,
            [`${propertyName}`]: fieldValue
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [error, setError] = useState<Boolean>(false)

    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <CssVarsProvider>
                <Sheet sx={{ maxWidth: 400, mx: 'auto', my: 4, py: 3, px: 2, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 'sm', boxShadow: 'md', fontSize: 48 }}>
                    Hello world!

                </Sheet>
            </CssVarsProvider>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 400, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Name or E-mail</Typography>
                    <TextField id="name" variant="outlined" sx={{ background: 'white' }}
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'nameOrEmail')}
                        value={logInFields.nameOrEmail} />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="password" variant="outlined" type={showPassword ? "text" : "password"} sx={{ background: 'white' }}
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'pass')}
                        value={logInFields.pass}
                        error={(error) ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} />
                    {(error === true) ?
                        <Typography color={'red'}>Login or password is incorrect</Typography> : <Box sx={{ height: '24px', p: 0 }} />

                    }
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