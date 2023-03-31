import { FunctionComponent, useState } from "react";
import './components.css'
import { Button, Tooltip, ListItem, List, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, Typography, Box, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import { CatalogueEntry } from "../types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteItem } from '../redux/cartReducer'

type OrderItemProps = {
    id: CatalogueEntry['id']
    title: CatalogueEntry['title'],
    description: CatalogueEntry['description'],
    price: CatalogueEntry['price']
    image?: CatalogueEntry['image']
    changeTotalValue: (id: string, isDeleting: boolean) => void
    itemTotalPrice: (id: string) => void
    goProduct: (id: string) => void
}

export const OrderItem: FunctionComponent<OrderItemProps> = ({ title, changeTotalValue, id, image, itemTotalPrice, goProduct }) => {

    const [open, setOpen] = useState(false);

    const quantity = useAppSelector(
        state => {
            const element = state.persistedReducer.cartSlice.find(el => el.id === id)
            if (element) return element.quantity
            else return 0

        })

    const dispatcher = useAppDispatch()

    return (
        <Card sx={{ width: 700, margin: 'auto', padding: 0, flexDirection: 'row', display: 'flex' }}>
            <ListItem sx={{ width: 'auto', justifyContent: 'center' }}>
                <Button onClick={() => { goProduct(id) }}>
                    <img id='base64image' width={200} height={200} src={image} />
                </Button>
            </ListItem>
            <ListItem sx={{ width: 200, justifyContent: 'center' }}>
                < Tooltip title={title} placement="top">
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Tooltip >
            </ListItem>
            <ListItem sx={{ width: 200, justifyContent: 'center' }}>
                {
                    (quantity > 0) ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button variant='text' onClick={
                                () => {
                                    changeTotalValue(id, false)
                                }
                            }>+</Button>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                                <span>{quantity}</span>
                                <span>{itemTotalPrice(id)}$</span>
                            </Box >
                            <Button variant='text' onClick={
                                () => {
                                    changeTotalValue(id, true)
                                }
                            }>-</Button>
                        </Box>
                    )
                        :
                        <Button variant='contained'
                            onClick={
                                () => {

                                    changeTotalValue(id, false)
                                }
                            } >Add to cart
                        </Button>
                }
            </ListItem>
            <ListItem sx={{ width: 200, justifyContent: 'center' }}>
                <Tooltip title='Delete' placement="top">
                    <IconButton onClick={() => setOpen(true)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </ListItem>
            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle>Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to remove this item from the cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => dispatcher(deleteItem())}>Yes</Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>

                </DialogActions>
            </Dialog>
        </Card>

    )
}