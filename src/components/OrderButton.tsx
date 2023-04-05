import { IconButton, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { AppRoutes } from "../routerTypes";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

type OrderButton = {}

export const OrderButton: FunctionComponent<OrderButton> = () => {
    const navigate = useNavigate()
    const cart = useAppSelector(state => state.persistedReducer.cartSlice)
    const data = useAppSelector(state => state.persistedReducer.dataSlice.data)
    const goOrder = () => {
        navigate(AppRoutes.ORDER)
    }

    const totalPrice = () => {
        let sum = 0;
        cart.forEach(cartEntry => {
            let dataElement = data.find(el => el.id === cartEntry.id)
            if (dataElement && cartEntry.quantity) {
                sum += dataElement.price * cartEntry.quantity
            }
        })
        if (sum === 0) { return 'Empty' }
        return sum + ' $';
    }

    return (
        <IconButton aria-label='cart' onClick={goOrder} >
            <ShoppingCartIcon color='action' fontSize='large' sx={{ mr: 2 }} />
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: 'flex', width: '70px' }}
            >
                {totalPrice()}
            </Typography>
        </IconButton>
    )
}