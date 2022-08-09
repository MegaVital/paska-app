import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoutes } from "../routerTypes";
import "./pages.css"
import "../service.helper.ts"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppSelector } from "../redux/hooks";

type Props = {}

export const Product: FC<Props> = () => {
    const navigate = useNavigate()
    const params = useParams()
    const serverData = useAppSelector(state => state.persistedReducer.dataSlice.data)

    const goCatalogue = () => {
        navigate(AppRoutes.CATALOGUE)
    }

    const goOrder = () => {
        navigate(AppRoutes.ORDER)
    }

    const dataElement = serverData.find(el => el.id === params.productID)!

    return (
        <div>
            <Button variant="contained" onClick={goCatalogue} color='primary' size='medium' sx={{ marginLeft: '30px', marginBottom: '30px', mt: '30px' }}>Catalogue from product</Button>
            <Button variant="contained" onClick={goOrder} color='success' size='medium' sx={{ marginLeft: '30px', display: 'block' }}>Order</Button>
            <Card sx={{ maxWidth: 700, mt: 10, ml: 10 }}>
                <CardContent>
                    <Typography variant="h4">
                        {dataElement.title}
                    </Typography>
                </CardContent>
                <CardContent sx={{ display: '-webkit-inline-box' }}>
                    <img id='base64image' width={200} height={200} src={dataElement.image} />
                    <CardActions sx={{ maxWidth: '400px', display: 'block', padding: 0, pl: '20px' }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Description</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ textAlign: 'justify' }}>
                                    {dataElement.description}
                                </Typography>
                                <Typography sx={{ textAlign: 'justify' }}>
                                    Made of: {dataElement.material.join(', ')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </CardActions>
                </CardContent>
                <CardContent>{dataElement.price}$</CardContent>

            </Card>
        </div >
    )
}