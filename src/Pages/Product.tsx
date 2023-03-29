import { Card, CardActions, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import "./pages.css"
import "../service.helper"
import { useAppSelector } from "../redux/hooks";

type Props = {}

export const Product: FC<Props> = () => {
    const params = useParams()
    const serverData = useAppSelector(state => state.persistedReducer.dataSlice.data)
    const dataElement = serverData.find(el => el.id === params.productID)!

    return (
        <div>
            <Card sx={{ maxWidth: 700, mt: 10, ml: 10 }}>
                <CardContent>
                    <Typography variant="h4">
                        {dataElement.title}
                    </Typography>
                </CardContent>
                <CardContent sx={{ display: '-webkit-inline-box' }}>
                    <img id='base64image' width={200} height={200} src={dataElement.image} />
                    <CardActions sx={{ maxWidth: '400px', display: 'block', padding: 0, pl: '20px' }}>
                        <Typography>Description</Typography>
                        <Typography sx={{ textAlign: 'justify' }}>
                            {dataElement.description}
                        </Typography>
                        <Typography sx={{ textAlign: 'justify' }}>
                            Made of: {dataElement.material.join(', ')}
                        </Typography>
                    </CardActions>
                </CardContent>
                <CardContent>{dataElement.price}$</CardContent>
            </Card>
        </div >
    )
}