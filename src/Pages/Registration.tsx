import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { AppRoutes } from "../routerTypes";
import "./pages.css"
import { request } from "../service.helper";
import { blurInitialStateInterface, RegistrationFields } from "../types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToken } from "../redux/tokenReducer";
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10);

type Props = {}

export const Registration: FC<Props> = () => {
    const navigate = useNavigate()
    const dispatcher = useAppDispatch()
    const back = () => {
        navigate(AppRoutes.LOGIN)
    }
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice)

    const [errorText, setErrorText] = useState('')

    const initialFields: RegistrationFields = {
        name: '',
        email: '',
        password: '',
        passwordCheck: ''
    }


    const [registrationFields, setRegistrationFields] = useState<RegistrationFields>(initialFields)
    const handleRegistrationFieldsInput = (fieldValue: string, propertyName: string) => {
        setRegistrationFields({
            ...registrationFields,
            [`${propertyName}`]: fieldValue
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const handleClickShowPasswordCheck = () => setShowPasswordCheck(!showPasswordCheck);
    const handleMouseDownPasswordCheck = () => setShowPasswordCheck(!showPasswordCheck);

    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email);
    };
    const validatePass = (pass: string) => {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        return re.test(pass);
    };

    const createAccountButton = async () => {
        const { success, token, error } = await request('registration', 'POST', {
            name: registrationFields.name.split(' ').join(''),
            email: registrationFields.email.split(' ').join(''),
            password: bcrypt.hashSync(registrationFields.password, salt)
        })

        if (success) {
            const userData = JWT.verify(token, 'secretKey1')
            const jwtData = userData as JWT.JwtPayload
            delete jwtData.exp
            delete jwtData.iat
            const currentToken = jwt.sign({ foo: 'bar' }, 'secretKey1')
            const name = jwtData['name']
            const id = jwtData['id']

            dispatcher(addToken({ id, name, currentToken, isAuth: true }))
            navigate(AppRoutes.CATALOGUE, { replace: true, state: tokenState.currentToken })
        }
        else setErrorText(error['message'])
    }

    const blurInitialState: blurInitialStateInterface = {
        name: false,
        email: false,
        password: false,
        passwordCheck: false
    }
    const [blur, setBlur] = useState<blurInitialStateInterface>(blurInitialState)
    const onBlur = (propertyName: string, value: boolean) => {
        setBlur({
            ...blur,
            [propertyName]: value
        })
    }

    return (

        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 20 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Welcome!</Typography>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 500, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0, mb: 0 }}>Name</Typography>
                    <Typography sx={{ m: 2, ml: 0, color: "grey", mt: 0, fontStyle: 'italic' }}>(at least 5 symbols)</Typography>
                    <TextField id="name" variant="outlined" sx={{ background: 'white' }} label='Name'
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'name')
                        }}
                        // focused={}
                        error={(blur.name === true && registrationFields.name.length < 5) ? true : false}
                        onBlur={() => { onBlur('name', true) }}
                        value={registrationFields.name} />
                    {((blur.name === true && registrationFields.name.length < 5)) ? <Alert severity="error">Invalid name</Alert>
                        : <Box sx={{ height: '48px' }} />}
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>E-mail</Typography>
                    <TextField id="email" variant="outlined"
                        label='Type your E-mail' sx={{ background: 'white' }}
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'email')
                        }}
                        error={(blur.email === true && !validateEmail(registrationFields.email)) ? true : false}
                        onBlur={() => { onBlur('email', true) }}
                        value={registrationFields.email} />
                    {(blur.email === true && !validateEmail(registrationFields.email)) ? <Alert severity="error">Invalid email</Alert>
                        : <Box sx={{ height: '48px' }} />}
                    <Typography variant="h6" sx={{ m: 2, ml: 0, mb: 0 }}>Password</Typography>
                    <Typography sx={{ m: 2, ml: 0, color: "grey", mt: 0, fontStyle: 'italic' }}>(at least 8 symbols)</Typography>
                    <TextField id="password" variant="outlined" sx={{ background: 'white' }} type={showPassword ? "text" : "password"}
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'password')
                        }}
                        value={registrationFields.password}
                        label='Password'
                        onBlur={() => { onBlur('password', true) }}
                        error={(blur.password || blur.passwordCheck) && (!validatePass(registrationFields.password) || !validatePass(registrationFields.passwordCheck))}
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
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Repeat password</Typography>
                    <TextField id="passwordCheck" variant="outlined" sx={{ background: 'white' }} type={showPasswordCheck ? "text" : "password"}
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'passwordCheck')
                        }}
                        value={registrationFields.passwordCheck}
                        label='Password Check'
                        error={(blur.password || blur.passwordCheck) && (!validatePass(registrationFields.password) || (!validatePass(registrationFields.passwordCheck)))}
                        onBlur={() => { onBlur('passwordCheck', true) }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordCheck}
                                        onMouseDown={handleMouseDownPasswordCheck}
                                    >
                                        {showPasswordCheck ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} />
                    {(registrationFields.password.length > 0 && registrationFields.passwordCheck.length > 0 && !validatePass(registrationFields.password) && ((blur.passwordCheck) || (blur.password)))
                        ? <Alert severity="error">Invalid password</Alert>
                        : (blur.password && (!validatePass(registrationFields.password) || !validatePass(registrationFields.passwordCheck)) && registrationFields.password.length > 0 && registrationFields.passwordCheck.length > 0)
                            ? <Alert severity="error">Both fields should be identical</Alert>
                            : (validatePass(registrationFields.password) && validatePass(registrationFields.passwordCheck) && registrationFields.password === registrationFields.passwordCheck)
                                ? <Alert severity="success">Password is Ok</Alert>
                                : <Box sx={{ height: '48px' }} />}
                </Box>
                <Button variant='contained'
                    disabled={(!validateEmail(registrationFields.email) || !validatePass(registrationFields.password) || registrationFields.passwordCheck !== registrationFields.password || registrationFields.name.length < 5) ? true : false}
                    onClick={createAccountButton}
                    color='primary' size='large'
                    sx={{ margin: 2 }}>Create an account</Button>
                <Button variant='contained' onClick={back} color='error' size='large'
                    sx={{ margin: 2 }}
                >I already have an account</Button>
                <Snackbar
                    open={errorText ? true : false}
                    key={errorText}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity="error" variant="filled" >{errorText}</Alert>
                </Snackbar>
                {((!validatePass(registrationFields.password) || !validatePass(registrationFields.passwordCheck)) && blur.password) ? <Alert severity="info">The password should contain at least one uppercase letter, one lowercase letter and one digit</Alert> : <Box sx={{ height: '68px' }} />}
            </Card>
        </Box>

    )
}