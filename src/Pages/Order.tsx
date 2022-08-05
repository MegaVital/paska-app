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


    
// const [cart, setCart] = useState<CartEntry[]>(getLocalStorageCart())

// const test = (arg1: number, arg2: string) => {
    //     let result: string = '';
    //     for (let i = 0; i < arg1; i++) {

    //         result += arg2;
    //         console.log(result);

    //     };
    //     return result;

    // }

     // const promises = new Promise((resolve, reject) => {

    //     setTimeout(() => resolve('hyi'), 2000)
    // })


    // const getPromiceResult = async () => {
    //     const result = await promises.then(res => res)
    //     console.log("RES", result)
    //     console.log('RRRRR');

    // }
    // getPromiceResult()



    // let promise = new Promise(function (resolve, reject) {
    //     setTimeout(() => resolve("done!"), 1000);
    // });

    // // resolve запустит первую функцию, переданную в .then
    // promise.then(
    //     result => alert(result), // выведет "done!" через одну секунду
    //     error => alert(error) // не будет запущена
    // );


    // const getDataFromServer = async () => {
    //     setIsLoading(true)
    //     const res = await request('data', 'GET') as CatalogueEntry[]
    //     res.forEach((el, index) => {
    //         res[index].image = 'data:image/jpeg;base64,' + res[index].image
    //     })
    //     dispatcher(addData(res))
    //     setIsLoading(false)
    // }

        // const brandData = useAppSelector(state => {
    //     const data = state.persistedReducer.dataSlice.data
    //     return data.filter(el => checkedBrand.includes(el.brand))
    // }
    // )
    // const materialData = useAppSelector(state => {
    //     const data = state.persistedReducer.dataSlice.data
    //     return data.filter(el => checkedMaterial.includes(el.material.toString()))
    // }
    // )
    // const sizeData = useAppSelector(state => {
    //     const data = state.persistedReducer.dataSlice.data
    //     return data.filter(el => checkedSize.includes(el.size))
    // }
    // )
        // setDataFilter()
        // const drawerBrand = drawer[0].contain
        // const checkedTrueIndex = checkedBrand.findIndex(el => el === name)
        // const checkedElement = checkedBrand.find(el => el === name)
        // if (!checkedElement) {
        //     checkedBrand.push(drawerBrand[index])
        // }
        // else if (checkedElement === drawerBrand[index]) {
        //     checkedBrand.splice(checkedTrueIndex)
        // }
        // setCheckedBrand(checkedBrand);



    // const initialFilters: DataFilters = {
    //     Brand: [],
    //     Size: [],
    //     Material: []
    // }
    // const [dataFilter, setDataFilter] = useState<DataFilters>(initialFilters)
     
    // const newArray = dataFilter[propertyName as keyof DataFilters]
        // if (!newArray.includes(containName)) { newArray.push(containName) }
        // else {
        //     newArray.splice(newArray.indexOf(containName), 1)
        // }
        // setDataFilter({
        //     ...dataFilter,
        //     [propertyName]: newArray,
        // })

        

    // const filteredData = useAppSelector(state => {
    //     if (dataFilter.Brand.length === 0 && dataFilter.Size.length === 0 && dataFilter.Material.length === 0 && price[0] === 0 && price[1] === max)
    //         return state.persistedReducer.dataSlice.data
    //     else if (dataFilter.Brand.length > 0 || dataFilter.Size.length > 0 || dataFilter.Material.length > 0 || price[0] > 0 || price[1] < max)
    //         return state.persistedReducer.dataSlice.data
    //             .filter(el => {
    //                 if (el.brand.toString().includes(dataFilter.Brand.toString())
    //                     && el.size.toString().includes(dataFilter.Size.toString())
    //                     && el.material.toString().includes(dataFilter.Material.toString())
    //                     && el.price > price[0] && el.price < price[1])
    //                     return el
    //             })
    // }
    // )

