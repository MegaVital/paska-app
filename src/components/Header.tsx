import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FunctionComponent, useState } from 'react';
import { AppBar, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchTitleReducer } from '../redux/dataReducer';
import { deleteToken } from '../redux/tokenReducer';
import { AppRoutes } from '../routerTypes';


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

    const logOut = () => {
        dispatcher(deleteToken())
        navigate(AppRoutes.LOGIN, { replace: true })
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
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
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
                        <Link component="button" onClick={logOut} sx={{ color: 'white', mr: 5, ml: 2 }} >(Log out)</Link>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: 'flex', mr: 5 }}
                        >
                            <ShoppingCartIcon color='action' fontSize='large' sx={{ mr: 2 }} /> {totalPrice()}
                        </Typography>
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