import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CatalogueItem } from "../components/CatalogueItem";
import { AppRoutes } from '../routerTypes';
import "./pages.css"
import { changeCartContaining, CartActions, request, materialCheck} from "../service.helper";
import { CatalogueEntry } from "../types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addItemToCart, deleteItemFromCart, addQuantity, reduceQuantity } from "../redux/cartReducer";
import { addData } from '../redux/dataReducer'
import { FilterField } from "../components/FilterField";

type Props = {}
export const Catalogue: FC<Props> = () => {
    

    
    const navigate = useNavigate()

    const cart = useAppSelector(state => state.persistedReducer.cartSlice)
    
    const data = useAppSelector(state => state.persistedReducer.dataSlice.data)

    const searchState = useAppSelector(state => state.persistedReducer.dataSlice.search)
    
    const [sort, setSort] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
    };
    
    const serverData = useAppSelector(state => {
        const { filter, data, price } = state.persistedReducer.dataSlice
        if (filter.Size.length === 0 && filter.Material.length === 0 && filter.Brand.length === 0 && price[0] === Math.min(...data.map(price => price.price))
            && price[1] === Math.max(...data.map(price => price.price)) && !searchState && sort === '')
            return data
            else 
            return data
            .filter(el => {
                    if (
                       (filter.Brand.includes(el.brand) || filter.Brand.length === 0)
                        && (filter.Size.includes(el.size) || filter.Size.length === 0)
                        && el.price >= price[0]  
                        && el.price <= price[1]
                        && materialCheck(filter.Material, el.material)
                        &&( el.title.includes(searchState)
                        || el.brand.includes(searchState) || el.material.toString().includes(searchState) || el.size.includes(searchState))
                    )   return el            
                    })
            .sort((a, b) => {
                switch (sort) {
                    case 'fromCheap':
                 return a.price - b.price ;
            case 'fromExp': 
                return b.price - a.price;
                    case 'fromZtoA':
                return -1;
                    case 'fromAtoZ' :
                return -1;
                default: return 0
     } })
                })
    const filteredData = useAppSelector(state => state.persistedReducer.dataSlice.filter)

    const dispatcher = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const asyncFN2000 = async () => {
        setIsLoading(true)
        const res = await request('data', 'GET') as CatalogueEntry[]
        res.forEach((el, index) => {
            res[index].image = 'data:image/jpeg;base64,' + res[index].image
        })
        dispatcher(addData(res))
        setIsLoading(false)
    }
    
    useEffect(
        () => {
            if (data.length === 0) {
                asyncFN2000()
            }
        },[filteredData]
    )

    const goHome = () => {
        navigate(AppRoutes.LOGIN, { replace: true })
    }

    const goOrder = () => {
        navigate(AppRoutes.ORDER)
    }

    const goProduct = (id: string) => {
        serverData.map((el) => {
            if (el.id === id)
                navigate(`/product/${el.id}`)
        })
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


    const letters = (arg: string): string => {
        let count = 1
        let countedString: string = ''
        arg.split('').map((el, i) => {
            if (arg[i] === arg[i + 1]) {
                count++;
            } else {
                let result = `${count}${arg[i]}`;
                countedString += result
                count = 1;

            }
        })
        return countedString
    };
    console.log(letters('vvvvvvfffffffrrrrrrrrrrhpottttttt'));
   
    const itemTotalPrice = (id: string): number => {
        let currentCatalogueEntry = data.find(el => el.id === id)
        let currentCartEntry = cart.find(el => el.id === id)
        if (currentCatalogueEntry && currentCartEntry) return currentCatalogueEntry.price * currentCartEntry.quantity
        else return 0
    }

    
    return (
        <div>
            <Button variant='contained' onClick={goHome} color="primary" size='medium' sx={{ ml: '30px', mb: '0px', mt: '30px' }}>Move to Home</Button>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={goOrder} color='success' size='medium' sx={{ marginLeft: '30px', mt: '30px ', textAlign: 'left' }}>Move to Order</Button>
                <FormControl sx={{width: '200px', display: "flex", mr: 30}}>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Sort"
                        onChange={handleChange}
                    >
                        <MenuItem value={''}>None</MenuItem>
                        <MenuItem value={'fromCheap'}>First lowest price</MenuItem>
                        <MenuItem value={'fromExp'}>First highest price</MenuItem>
                        <MenuItem value={'fromAtoZ'}>From A to Z</MenuItem>
                        <MenuItem value={'fromZtoA'}>From Z to A</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {
                (isLoading) ?
                    <CircularProgress color="success" sx={{ ml: 10, mt: 10 }} />
                    :
                    
                        <Grid container wrap={'nowrap'} columns={2}>
                        <FilterField />
                   { (serverData.length === 0) ? (
                        <div className="errorScreenComponent">
                            <img src='data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//Z' />
                        </div>
                    ) : (
                        <Grid container spacing={6} columns={6} sx={{ margin: 'auto', width: 'auto', padding: '0px', display: 'box' }}>
                            {serverData.map((el, index) => {
                                return <Grid item xs={2} key={serverData[index].id}
                                md={'auto'} sx={{ color: "aqua" }}>
                                    <CatalogueItem
                                        changeTotalValue={changeTotalValue}
                                        {...el}
                                        goProduct={goProduct}
                                        itemTotalPrice={itemTotalPrice} />
                                </Grid>;
                            }
                            )}
                        </Grid>

                            ) }
                        </Grid>
                        
            }
        </div >
    )

}

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
