import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { FunctionComponent, useEffect, useState } from 'react';
import { AppBar, Button, Dialog, DialogActions, DialogTitle, IconButton, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearDataSlice, searchTitleReducer } from '../redux/dataReducer';
import { deleteToken } from '../redux/tokenReducer';
import { AppRoutes } from '../routerTypes';
import HomeIcon from '@mui/icons-material/Home';
import { clearCartSlice } from '../redux/cartReducer';
import { Time } from './Time';
import { OrderButton } from './OrderButton';
import useDebounce from './Hooks';

type HeaderProps = {}

export const Header: FunctionComponent<HeaderProps> = () => {
    const page = useAppSelector(state => state.persistedReducer.pageSlice.page)

    const nav = useLocation()
    const currentHeadLine = () => {
        switch (nav.pathname) {
            case `/catalogue/page=${page}`:
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
    const tokenState = useAppSelector(state => state.persistedReducer.tokenSlice)
    const [searchTitle, setSearchTitle] = useState<string>('')
    const debouncedValue = useDebounce<string>(searchTitle, 1000)

    const handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchTitle(event.target.value)
    }

    useEffect(() => {
        dispatcher(searchTitleReducer(searchTitle))
    }, [debouncedValue])

    const [open, setOpen] = useState(false);

    const logOut = () => {
        dispatcher(clearCartSlice())
        dispatcher(clearDataSlice())
        dispatcher(deleteToken())
        setOpen(false)
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

    return (
        (nav.pathname !== '/' && nav.pathname !== '/registration') ?
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color='secondary'>
                    <Toolbar>
                        {(nav.pathname !== `/catalogue/page=${page}`) ?
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
                        <Time />
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
                        <OrderButton />
                        {
                            (nav.pathname === `/catalogue/page=*`) ?
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleSearchInputChange}
                                        value={searchTitle}
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
