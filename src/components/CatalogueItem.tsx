import React, { FunctionComponent } from "react";
import { CatalogueEntry } from "../types";
import './components.css'
import { Button, CardContent, Card, CardActions, Tooltip, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAppSelector } from "../redux/hooks";


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

    const quantity = useAppSelector(
        state => {
            const element = state.persistedReducer.cartSlice.find(el => el.id === id)
            if (element) return element.quantity
            else return 0
        })

    return (
        <Card variant="elevation" sx={{ width: '250px', height: 'auto' }}  >
            <CardContent onClick={() => { goProduct(id) }}>
                <img id='base64image' width={200} height={200} src={image} />
            </CardContent>
            <CardContent onClick={() => { goProduct(id) }}>
                <Tooltip title={title} placement='top-start'>
                    <div className="titleText">
                        {title}
                    </div>
                </Tooltip>
                <div className='brandName'>by {brand}</div>
                <div className="descriptionText">
                    {description}
                </div>
                <div className="materialText">
                    Material: {material.join(', ')}
                </div>
                <div className="priceText">
                    {price}$
                </div>
            </CardContent>
            <CardContent>
                <CardActions sx={{ justifyContent: 'center' }} >
                    {
                        (quantity > 0) ? (
                            <div className="buttonContainer">
                                <Button variant='contained' size='small' sx={{ p: 0, m: 2 }} onClick={
                                    () => {
                                        changeTotalValue(id, false)
                                    }
                                }>+</Button>
                                <span className="quantityAndPrice">
                                    <span className="quantity">{quantity}pcs</span>
                                    <span className="itemTotalPrice">{itemTotalPrice(id)}$</span>
                                </span >
                                <Button variant='contained' size='small' sx={{ p: 0, m: 2 }} onClick={
                                    () => {
                                        changeTotalValue(id, true)
                                    }
                                }>-</Button>
                            </div>
                        )
                            :
                            <Tooltip title="Add to cart" placement="top">
                                <IconButton
                                    color='success'
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

// function isEllipsisActive() {
//     const x = document.getElementsByClassName('titleText')[1];
//     if (x) {


//     }
//     return x && (x.clientWidth < x.scrollWidth);
// }