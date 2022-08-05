import { FC} from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../routerTypes";
import { Button, Typography, List, ListItem } from '@mui/material';
import "./pages.css"
import Divider from '@mui/material/Divider';
import { OrderItem } from "../components/OrderItem";
import React from "react";
import { changeCartContaining, CartActions } from "../service.helper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addItemToCart, deleteItemFromCart, addQuantity, reduceQuantity } from "../redux/cartReducer";

type OrderItemProps = {}

export const Order: FC<OrderItemProps> = () => {
    const navigate = useNavigate()
    
    const serverData = useAppSelector(state => state.persistedReducer.dataSlice.data)
    
    const cart = useAppSelector(state => state.persistedReducer.cartSlice)

    const quantity = (id: string) => {
        let orderQuantity = useAppSelector(
             state  => {
            const element = state.persistedReducer.cartSlice.find(el => el.id === id)
            if (element) return element.quantity
            else return 0
        })
        return orderQuantity
    }
    
    const dispatcher = useAppDispatch()
    
    const goCatalogue = () => {
        navigate(AppRoutes.CATALOGUE)
    }

    const goHome = () => {
        navigate(AppRoutes.HOME)
    }

    const changeTotalValue = (id: string, isDeleting: boolean) => {
        const index = cart.findIndex(el => el.id === id)
        let isElementQuantitySingle
        if (index >= 0) {
            isElementQuantitySingle = cart[index].quantity === 1
        } else {
            isElementQuantitySingle = false
        }
        let cartAction: CartActions['cartChanges'] = changeCartContaining(isElementQuantitySingle, isDeleting, index)
            switch (cartAction) {
            case 'create':
                dispatcher(addItemToCart({ id, quantity: 1 }))
                break;
            case 'addQuantity':
                dispatcher(addQuantity({ index }))
                break;
            case 'remove':
                dispatcher(deleteItemFromCart({ index }))

                break;
            case 'reduceQuantity':
                dispatcher(reduceQuantity({ index }))
                break;
            default:
                break;
        }
    }
    const itemTotalPrice = (id: string): number => {
        let currentCatalogueEntry = serverData.find(el => el.id === id)
        let currentCartEntry = cart.find(el => el.id === id)

        if (currentCatalogueEntry && currentCartEntry) return currentCatalogueEntry.price * currentCartEntry.quantity
        else return 0
    }

    const totalPrice = () => {
        let sum = 0;
        cart.forEach(cartEntry => {
            let dataElement = serverData.find(el => el.id === cartEntry.id)
            if (dataElement && cartEntry.quantity) {
                sum += dataElement.price * cartEntry.quantity
            }
        })
        return sum;
    }

    return (
        <div>
            <Button variant='contained' onClick={goHome} color="primary" size='medium' sx={{ marginLeft: '30px', marginBottom: '30px', mt: '30px' }}>Move to Home</Button>
            <Button variant="contained" onClick={goCatalogue} color='success' size='medium' sx={{ marginLeft: '30px', display: 'block' }}>Move to Catalogue</Button>
            <Typography sx={{ mt: 8, mb: 4, textAlign: 'center', color: 'black' }} variant="h3" component="div">
                Your cart:
            </Typography>
            <List sx={{ width: 700, margin: 'auto' }}>
                {
                    serverData.map((el, index) => {
                        if (quantity(el.id))
                            return <React.Fragment key={`order-item-${serverData[index].id}`}>
                                <ListItem >
                                    <OrderItem
                                        key={serverData[index].id}
                                        changeTotalValue={changeTotalValue}
                                        {...el}
                                        itemTotalPrice={itemTotalPrice}

                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        else return null
                    }
                    )
                }
            </List>
            <div className="orderPrice">Total: {totalPrice()}$</div>
        </div>
    )
}


    // const deleteItem = (id: string) => {
    //     dispatcher(deleteItem({ index }))
    // }

    // const [cart, setCart] = useState<CartEntry[]>(getLocalStorageCart())

    
    // const changeTotalValue = (id: string, isDeleting: boolean) => {
    //     const cartIndex = cart.findIndex(el => el.id === id)
    //     let newCart: CartEntry[] = changeCartContaining(id, isDeleting, cartIndex)
    //     setCart(newCart);
    //     localStorage.setItem('cart', JSON.stringify(newCart))
    // }

