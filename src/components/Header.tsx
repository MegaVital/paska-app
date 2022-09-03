import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FunctionComponent, useEffect, useState } from 'react';
import { AppBar, Button, Dialog, DialogActions, DialogTitle, IconButton, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { clearDataSlice, searchTitleReducer } from '../redux/dataReducer';
import { deleteToken } from '../redux/tokenReducer';
import { AppRoutes } from '../routerTypes';
import HomeIcon from '@mui/icons-material/Home';
import { clearCartSlice } from '../redux/cartReducer';

type SearchBarProps = {}

export const SearchBar: FunctionComponent<SearchBarProps> = () => {

    const nav = useLocation()
    const currentHeadLine = () => {
        switch (nav.pathname) {
            case '/catalogue':
                return 'Catalogue'
            case '/order':
                return 'Order'
            default:
                return 'Product'
        }
    }
    const goHome = () => {
        navigate(AppRoutes.LOGIN)
    }
    const navigate = useNavigate()
    const dispatcher = useAppDispatch()
    const cart = useAppSelector(state => state.persistedReducer.cartSlice)
    const { data, search } = useAppSelector(state => state.persistedReducer.dataSlice)
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice)
    const [searchTitle, setSearchTitle] = useState<string>('')

    const handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchTitle(event.target.value)
    }
    dispatcher(searchTitleReducer(searchTitle))

    const [open, setOpen] = useState(false);

    const logOut = () => {
        dispatcher(clearCartSlice())
        dispatcher(clearDataSlice())
        dispatcher(deleteToken())
        setOpen(false)
    }

    const goOrder = () => {
        navigate(AppRoutes.ORDER)
    }

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            width: '100%',
        },
    }));

    const totalPrice = () => {
        let sum = 0;
        cart.forEach(cartEntry => {
            let dataElement = data.find(el => el.id === cartEntry.id)
            if (dataElement && cartEntry.quantity) {
                sum += dataElement.price * cartEntry.quantity
            }
        })
        if (sum === 0) { return 'Empty' }
        return sum + '$';
    }

    return (
        (nav.pathname !== '/' && nav.pathname !== '/registration') ?
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color='secondary'>
                    <Toolbar>
                        {(nav.pathname !== '/catalogue') ?
                            <IconButton aria-label='home'
                                onClick={goHome}>
                                <HomeIcon fontSize='large' />
                            </IconButton> : null}
                        <Link component="button" onClick={logOut}></Link>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, ml: 3 }}
                        >
                            {currentHeadLine()}
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: 'flex' }}
                        >
                            {tokenState.name}
                        </Typography>
                        <Link component="button" onClick={() => { setOpen(true) }} sx={{ color: 'white', mr: 5, ml: 2 }} >(Log out)</Link>
                        <Dialog
                            open={open}
                            onClose={() => { setOpen(false) }}
                            aria-describedby="alert-dialog-log-out">
                            <DialogTitle> Are you sure you want to leave?</DialogTitle>
                            <DialogActions>
                                <Button autoFocus onClick={logOut}>Yes</Button>
                                <Button onClick={() => setOpen(false)}>Cancel</Button>
                            </DialogActions>
                        </Dialog>
                        <IconButton aria-label='cart' onClick={goOrder}>
                            <ShoppingCartIcon color='action' fontSize='large' sx={{ mr: 2 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: 'flex', mr: 5 }}
                            >
                                {totalPrice()}
                            </Typography>
                        </IconButton>
                        {
                            (nav.pathname === '/catalogue') ?
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleSearchInputChange}
                                        value={search}
                                        autoFocus={true}
                                    />
                                </Search>
                                :
                                null
                        }
                    </Toolbar>
                </AppBar>
            </Box> : null
    )
}