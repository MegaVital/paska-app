import React, { FC, useState } from "react";
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

    interface RegistrationFields {
        name: string,
        email: string,
        pass: string,
        pass2: string;
    }
    const initialFields: RegistrationFields = {
        name: '',
        email: '',
        pass: '',
        pass2: ''
    }
    const [registrationFields, setRegistrationFields] = useState<RegistrationFields>(initialFields)
    const handleRegistrationFieldsInput = (fieldValue: string, propertyName: string) => {
        console.log(fieldValue, propertyName);
        setRegistrationFields({
            ...registrationFields,
            [`${propertyName}`]: fieldValue
        })
    }
    console.log(registrationFields);



    return (
        <Box sx={{ justifyContent: 'center', display: 'grid', mt: 30 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Welcome!</Typography>
            <Card variant='elevation' raised sx={{ height: 'auto', width: 500, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ margin: 5, display: 'grid' }}>
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Name</Typography>
                    <TextField id="name" variant="outlined" sx={{ background: 'white' }}
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'name')
                        }}
                        value={registrationFields.name} />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>E-mail</Typography>
                    <TextField error id="email" variant="outlined" sx={{ background: 'white' }}
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'email')
                        }}
                        value={registrationFields.email} />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Password</Typography>
                    <TextField id="pass" variant="outlined" sx={{ background: 'white' }} type="password"
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'pass')
                        }}
                        value={registrationFields.pass} />
                    <Typography variant="h6" sx={{ m: 2, ml: 0 }}>Repeat password</Typography>
                    <TextField id="pass2" variant="outlined" sx={{ background: 'white' }} type="password"
                        onChange={(event) => {
                            handleRegistrationFieldsInput(event.target.value, 'pass2')
                        }}
                        value={registrationFields.pass2} />
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