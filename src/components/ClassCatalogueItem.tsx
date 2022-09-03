import React, { Component } from "react";
import { CatalogueEntry } from "../types";
import './components.css'
import { Button, CardContent, Card, CardActions, Tooltip, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
class ClassCatalogueItem extends Component<CatalogueItemProps> {

    // quantity = useAppSelector(
    //     state => {
    //         const element = state.persistedReducer.cartSlice.find(el => el.id === this.props.id)
    //         if (element) return element.quantity
    //         else return 0
    //     })

    render() {
        return (
            <Card raised variant="elevation" sx={{ width: '250px', height: 'auto' }}  >
                <CardContent onClick={() => { this.props.goProduct(this.props.id) }}>
                    <img id='base64image' width={200} height={200} src={this.props.image} />
                </CardContent>
                <CardContent onClick={() => { this.props.goProduct(this.props.id) }}>
                    <div className="titleText">
                        {this.props.title}
                    </div>
                    <div className='brandName'>by {this.props.brand}</div>
                    <Tooltip title={this.props.description}>
                        <div className="descriptionText">
                            {this.props.description}
                        </div>
                    </Tooltip>
                    <div className="materialText">
                        Material: {this.props.material.join(', ')}
                    </div>
                    <div className="priceText">
                        {this.props.price}$
                    </div>
                </CardContent>
                <CardContent>
                    <CardActions sx={{ justifyContent: 'center' }} >

                        <Tooltip title="Add to cart" placement="top">
                            <IconButton
                                color='success'
                                onClick={
                                    () => {
                                        this.props.changeTotalValue(this.props.id, false)
                                    }}
                                aria-label="add to shopping cart">
                                <AddShoppingCartIcon />
                            </IconButton>
                        </Tooltip>

                    </CardActions>
                </CardContent>
            </Card >
        )
    }
}

export default ClassCatalogueItem    