import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"
import { LogInFields } from "../types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bcrypt from 'bcryptjs'
import { request } from "../service.helper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToken, deleteToken } from "../redux/tokenReducer";
import JWT from 'jsonwebtoken'
const jwt = require('jsonwebtoken')
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import { GoogleAuth } from "google-auth-library";
const axios = require('axios').default

type Props = {}

export const Login: FC<Props> = () => {
    const navigate = useNavigate()
    const dispatcher = useAppDispatch()

    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice)

    const signUp = () => {
        navigate(AppRoutes.REGISTRATION)
    }
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

    const signIn = async () => {
        const { success, token, error } = await request('login', 'POST', {
            login: logInFields.nameOrEmail.split(' ').join(''),
            password: logInFields.password
        })
        const currentToken = jwt.sign({ foo: 'bar' }, 'secretKey1')
        const userData = JWT.verify(token, 'secretKey1')
        const jwtData = userData as JWT.JwtPayload
        delete jwtData.exp
        delete jwtData.iat
        const name = jwtData['name']
        const id = jwtData['id']

        if (success) {
            dispatcher(addToken({ id, name, currentToken, isAuth: true }))
        }
        else {
            setErrorText(error['message'])

        }
    }

    useEffect(() => {
        const initClient = () => {
            gapi.auth2.init({
                clientId: clientId,
                scope: '',
            });
        };
        gapi.load('client:auth2', initClient);

    }, []);


    // const success = () => {
    //     
    //     axios.post('/users', {
    //         ID: googleID
    //     })

    //         .then(function (response: any) {
    //             console.log(response);
    //         })
    //         .catch(function (error: any) {
    //             console.log(error);
    //         });
    // }
    // console.log(success);

    const onSuccess = async (res: any) => {
        const id = res['googleId']
        const name = res['wt']['Ad']
        const email = res['profileObj']['email']
        const { success, token, error } = await request('googlelogin', 'POST', {
            google_id: id,
            name: name,
            email: email
        })
        const currentToken = jwt.sign({ foo: 'bar' }, 'secretKey1')
        const userData = JWT.verify(token, 'secretKey1')
        const jwtData = userData as JWT.JwtPayload
        delete jwtData.exp
        delete jwtData.iat

        if (success) {
            dispatcher(addToken({ id, name, currentToken, isAuth: true }))
        }
        else {
            setErrorText(error['message'])

        }
    }

    const onFailure = (err: any) => {
        setErrorText(err);

    };
    // const logOut = () => {
    //     dispatcher(clearCartSlice())
    //     dispatcher(clearDataSlice())
    //     dispatcher(deleteToken())

    // };
    const clientId = '20193487866-88r5prmk0l03f52dsel598o3ts2udeti.apps.googleusercontent.com'


    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <Card raised sx={{ width: 300, mx: 'auto', mt: 4, py: 1.5, px: 2, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 'sm', boxShadow: 'md', fontSize: 20, backgroundColor: 'whitesmoke', alignItems: 'center' }}>
                Hello! You need to sign in.
            </Card>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 400, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>E-mail</Typography>
                    <TextField id="email" variant="outlined" sx={{ background: 'white' }} label='Type your e-mail'
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'nameOrEmail')}
                        value={logInFields.nameOrEmail}
                        error={(errorText) ? true : false}
                    />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="password" type={showPassword ? "text" : "password"} sx={{ background: 'white' }} label='Type your password'
                        onChange={(event) => handleLogInFieldsInput(event.target.value, 'password')}
                        value={logInFields.password}
                        error={(errorText) ? true : false}
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
                    <Button variant='contained' onClick={signIn} color='success' size='large' sx={{ margin: 2 }}>Sign in</Button>
                    <Button variant='contained' onClick={signUp} color='primary' size='large'
                        sx={{ margin: 2, mb: 0 }}
                    >Create an account</Button>
                    {/* {(tokenState.isAuth) ? <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} /> : */}
                </Box>

                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}

                />
                {/* } */}
            </Card>
        </Box>

    )
}