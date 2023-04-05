import React, { FunctionComponent } from "react";
import { CatalogueEntry } from "../types";
import './components.css'
import { Button, CardContent, Card, CardActions, Tooltip, IconButton, Box, Typography, createTheme, PaletteMode } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAppSelector } from "../redux/hooks";
import { getDesignTokens } from "../service.helper";

type CatalogueItemProps = {
    id: CatalogueEntry['id'],
    title: CatalogueEntry['title'],
    description: CatalogueEntry['description'],
    price: CatalogueEntry['price']
    image: CatalogueEntry['image']
    material: CatalogueEntry['material']
    brand: CatalogueEntry['brand']
    changeTotalValue: (id: string, isDeleting: boolean) => void
    goProduct: (id: string) => void
    itemTotalPrice: (id: string) => void
}

export const CatalogueItem: FunctionComponent<CatalogueItemProps> = ({ title, description, brand, price, material, changeTotalValue, id, image, goProduct, itemTotalPrice }) => {
    const reducerTheme = useAppSelector<PaletteMode>(state => state.persistedReducer.themeSlice.mode)
    const quantity = useAppSelector(
        state => {
            const element = state.persistedReducer.cartSlice.find(el => el.id === id)
            if (element) return element.quantity
            else return 0
        })
    let theme = createTheme((getDesignTokens(reducerTheme)))

    return (
        <Card raised variant="elevation" sx={{ width: '250px', height: '500px' }}  >
            <CardActions onClick={() => { goProduct(id) }} sx={{ justifyContent: 'center' }}>
                <Button>
                    <img id='base64image' width={200} height={200} src={image} />
                </Button>
            </CardActions>
            <CardContent >
                <Typography style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {title}
                </Typography>
                <Typography style={{ fontWeight: 'bold', fontSize: 13, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginBottom: 4 }}>
                    by {brand}
                </Typography>
                <Tooltip title={description}>
                    <Typography sx={{ color: theme.palette.text.secondary }} style={{ fontSize: 11, overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', display: '-webkit-inline-box' }}>
                        {description}
                    </Typography>
                </Tooltip>
                <Typography sx={{ color: theme.palette.text.secondary }} style={{ fontSize: 14, overflow: 'hidden', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-inline-box' }}>
                    Material: {material.join(', ')}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {price}$
                </Typography>
            </CardContent >
            <CardContent>
                <CardActions sx={{ justifyContent: 'center' }} >
                    {
                        (quantity > 0) ? (
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button variant='contained' size='small' sx={{ p: 0, m: 2 }} onClick={
                                    () => {
                                        changeTotalValue(id, false)
                                    }
                                }>+</Button>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center', fontSize: 12 }}>
                                    <span>{quantity}</span>
                                    <span>{itemTotalPrice(id)}$</span>
                                </Box >
                                <Button variant='contained' size='small' sx={{ p: 0, m: 2 }} onClick={
                                    () => {
                                        changeTotalValue(id, true)
                                    }
                                }>-</Button>
                            </Box>
                        )
                            :
                            <Tooltip title="Add to cart" placement="top">
                                <IconButton
                                    sx={{ color: theme.palette.primary.main }}
                                    onClick={
                                        () => {
                                            changeTotalValue(id, false)
                                        }}
                                    aria-label="add to shopping cart">
                                    <AddShoppingCartIcon />
                                </IconButton>
                            </Tooltip>
                    }
                </CardActions>
            </CardContent>
        </Card >
    )
}