import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, Divider, IconButton, InputAdornment, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"
import { LogInFields } from "../types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch } from "../redux/hooks";
import { addToken } from "../redux/tokenReducer";
import JWT from 'jsonwebtoken'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
const axios = require('axios').default
const clientId = '20193487866-88r5prmk0l03f52dsel598o3ts2udeti.apps.googleusercontent.com'

type Props = {}

export const Login: FC<Props> = () => {

    const navigate = useNavigate()
    const dispatcher = useAppDispatch()
    const signUp = () => {
        navigate(`Furniture-Shop-app/${AppRoutes.REGISTRATION}`)
    }
    const theme = useTheme()
    const [errorText, setErrorText] = useState('')

    const initialFields: LogInFields = {
        nameOrEmail: '',
        password: ''
    }

    const [logInFields, setLogInFields] = useState<LogInFields>(initialFields)
    const handleLogInFieldsInput = (fieldValue: string, propertyName: string) => {
        setLogInFields({
            ...logInFields,
            [`${propertyName}`]: fieldValue
        })
        setErrorText('')
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        const initClient = () => {
            gapi.auth2.init({
                clientId: clientId,
                scope: '',
            });
        };
        gapi.load('client:auth2', initClient);

    }, []);

    const signIn = () => {
        axios.post('http://localhost:1111/login', {
            login: logInFields.nameOrEmail.split(' ').join(''),
            password: logInFields.password
        }).then(function (response: any) {
            const currentToken = response['data']['token'];
            const userData = JWT.verify(currentToken, 'secretKey1')
            const jwtData = userData as JWT.JwtPayload
            delete jwtData.exp
            delete jwtData.iat
            const name = jwtData['name']
            const id = jwtData['id']
            dispatcher(addToken({ id, name, currentToken, isAuth: true }))
        })
            .catch(function (error: any) {
                setErrorText(error.response.data.error.message)
            });
    }

    const onSuccess = async (response: any) => {
        const id = response['googleId']
        const name = response['wt']['Ad']
        const email = response['profileObj']['email']
        axios.post('http://localhost:1111/googlelogin', {
            google_id: id,
            name: name,
            email: email
        }).then(function (response: any) {
            const currentToken = response['data']['token'];
            const userData = JWT.verify(currentToken, 'secretKey1')
            const jwtData = userData as JWT.JwtPayload
            delete jwtData.exp
            delete jwtData.iat
            dispatcher(addToken({ id, name, currentToken, isAuth: true }))
        })
            .catch(function (error: any) {
                setErrorText(error.response.data.error.message)
            });
    }

    const onFailure = (error: any) => {
        setErrorText(error.response.data.error.message);
    };

    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', pt: { md: 15, xs: 4 } }}>
            <Card variant='elevation' raised sx={{ maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 22, mt: 3, justifyContent: 'center' }}>Hello! You need to sign in.</Typography>
                <Box sx={{ margin: 5, mt: 0, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>E-mail</Typography>
                    <TextField id="email" variant="outlined" label='Type your e-mail'
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'nameOrEmail')}
                        value={logInFields.nameOrEmail}
                        error={(errorText) ? true : false}
                        inputProps={{
                            style: {
                                WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
                            }
                        }}
                    />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="password" type={showPassword ? "text" : "password"} label='Type your password'
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'password')}
                        value={logInFields.password}
                        error={(errorText) ? true : false}
                        inputProps={{
                            style: {
                                WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
                            }
                        }}
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
                    <Snackbar
                        open={errorText ? true : false}
                        key={errorText}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert severity="error" variant="filled" >{errorText}</Alert>
                    </Snackbar>
                    <Button variant='contained' onClick={signIn} size='large' sx={{ margin: 2, mt: 4 }}>
                        Sign in
                    </Button>
                    <Box
                        sx={{ margin: 2, mt: 0, display: 'grid' }}
                    >
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Box>
                    <Divider sx={{ display: 'flex', alignItems: 'flex-start' }}>or</Divider>
                    <Button variant='contained' onClick={signUp} size='large'
                        sx={{ margin: 2 }}
                    >Sign up
                    </Button>
                </Box>
            </Card >
        </Box >
    )
}