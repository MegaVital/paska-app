import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { CatalogueItem } from "../components/CatalogueItem";
import "./pages.css"
import { changeCartContaining, CartActions, materialCheck } from "../service.helper";
import { CatalogueEntry } from "../types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addItemToCart, deleteItemFromCart, addQuantity, reduceQuantity } from "../redux/cartReducer";
import { addData } from '../redux/dataReducer'
import { FilterComponent } from "../components/FilterField";
import { addToken } from "../redux/tokenReducer";
import axios from "axios";
import usePagination from "../components/PaginationHook";
import { currentPage, itemsPerPage } from "../redux/pageReducer";
import MoodBadSharpIcon from '@mui/icons-material/MoodBadSharp';
import { OrderButton } from "../components/OrderButton";

type Props = {}
export const Catalogue: FC<Props> = () => {

    const navigate = useNavigate()
    const dispatcher = useAppDispatch()
    const cart = useAppSelector(state => state.persistedReducer.cartSlice)
    const { data, search } = useAppSelector(state => state.persistedReducer.dataSlice)
    const tokenUser = useAppSelector(state => state.persistedReducer.tokenSlice.currentToken)
    const filteredData = useAppSelector(state => state.persistedReducer.dataSlice.filter)
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice)
    const { page, items } = useAppSelector(state => state.persistedReducer.pageSlice)
    const [sort, setSort] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
    };

    const serverData = useAppSelector(state => {
        const { filter, data, price } = state.persistedReducer.dataSlice
        if (filter.Size.length === 0 && filter.Material.length === 0 && filter.Brand.length === 0 && price[0] === Math.min(...data.map(price => price.price))
            && price[1] === Math.max(...data.map(price => price.price)) && !search && sort === '')
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
                        && (el.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                            || el.brand.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                            || el.material.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())
                            || el.size.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                    ) return el
                })
                .sort((a, b) => {
                    if (sort === 'fromCheap')
                        return a.price - b.price
                    else if (sort === 'fromExp')
                        return b.price - a.price
                    else if (a.title > b.title && sort === 'fromZtoA')
                        return -1
                    else if (b.title > a.title && sort === 'fromAtoZ')
                        return -1
                    else return 0
                })
    })

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        setPage,
        totalPages,
    } = usePagination({
        contentPerPage: items,
        count: serverData.length,
    });

    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        setIsLoading(true)
        axios.get('https://MegaVital.github.io/Furniture-Shop-back/data', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenUser}`
            }
        }).then((response: any) => {
            const data = response.data['data'] as CatalogueEntry[]
            data.forEach((el, index) => {
                data[index].image = 'data:image/jpeg;base64,' + data[index].image
            })
            dispatcher(addData(data))
            const bearer = response.data.newToken.split(' ')
            const currentToken = bearer[1]
            dispatcher(addToken({ ...tokenState, currentToken }))
        })
        setIsLoading(false)
    }

    useEffect(
        () => {
            getData()
        }, [filteredData]
    )

    const goProduct = (id: string) => {
        serverData.map((el: { id: string; }) => {
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

    const itemTotalPrice = (id: string): number => {
        let currentCatalogueEntry = data.find(el => el.id === id)
        let currentCartEntry = cart.find(el => el.id === id)
        if (currentCatalogueEntry && currentCartEntry) return currentCatalogueEntry.price * currentCartEntry.quantity
        else return 0
    }

    return (
        <div>
            {
                (isLoading) ?
                    <CircularProgress color="success" sx={{ pl: 10, pt: 10 }} />
                    :
                    <Grid container wrap={'nowrap'} columns={2} sx={{ pt: 12 }}>
                        <Box sx={{ minWidth: { md: '300px' } }}>
                            <FormControl sx={{ width: '-webkit-fill-available', mx: 3 }} >
                                <InputLabel>Sort</InputLabel>
                                <Select
                                    // MenuProps={{ disableScrollLock: true }}
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
                            <FilterComponent />
                            <Box sx={{ display: { md: 'none' }, mx: 3, mt: 2 }}>
                                <OrderButton />
                            </Box >
                        </Box>
                        <Box>
                            {(serverData.length === 0) ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: '20%', pl: '100px' }}>
                                    <MoodBadSharpIcon sx={{ width: '4em', height: '4em' }} />
                                    <Typography sx={{ fontSize: 24 }} >There is no such items</Typography>
                                </Box>
                            ) : (
                                <><Grid container spacing={6} sx={{ display: 'box' }}>
                                    {serverData
                                        .slice(firstContentIndex, lastContentIndex)
                                        .map((el, index) => {
                                            return <Grid item key={serverData[index].id}>
                                                <CatalogueItem
                                                    changeTotalValue={changeTotalValue}
                                                    {...el}
                                                    goProduct={goProduct}
                                                    itemTotalPrice={itemTotalPrice} />
                                            </Grid>;
                                        })}
                                </Grid>
                                    <Grid sx={{ display: 'flex', flexWrap: 'nowrap', mt: 3, mb: 6, height: '36px', width: '580px' }}>
                                        <Box sx={{ display: 'flex', width: 'auto' }}>
                                            {(page !== 1) ? <Button onClick={prevPage}>
                                                &larr;
                                            </Button> : <Button disabled>
                                                &larr;
                                            </Button>}
                                            {/* @ts-ignore */}
                                            {[...Array(totalPages).keys()].map((el) => (
                                                <Button
                                                    onClick={() => setPage(el + 1)}
                                                    key={el}
                                                    variant={(el + 1 === page ? 'contained' : 'text')}
                                                >
                                                    {el + 1}
                                                </Button>
                                            ))}
                                            {(page !== totalPages) ?
                                                <Button onClick={nextPage}>
                                                    &rarr;
                                                </Button> :
                                                <Button disabled>
                                                    &rarr;
                                                </Button>}
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography alignSelf='center' whiteSpace='pre' marginRight={1}>Items per page</Typography>
                                            <Button onClick={() => {
                                                dispatcher(itemsPerPage(12));
                                                dispatcher(currentPage(1));
                                                navigate('/');
                                            }} variant={items === 12 ? 'contained' : 'text'}>12</Button>
                                            <Button onClick={() => dispatcher(itemsPerPage(4))} variant={items === 4 ? 'contained' : 'text'} sx={{ mr: { xs: 2 } }}>4</Button>
                                        </Box>
                                    </Grid></>
                            )}
                        </Box>
                    </Grid>
            }
        </div >
    )
}