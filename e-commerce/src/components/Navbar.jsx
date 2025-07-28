import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Tooltip,
    Box,
    Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'


const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()

    const handleNavigation = (path) => {
        navigate(path)
    }


    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    }
    const sidebar = [
        { label: 'Profile', path: '/profile' },
        { label: 'Cart', path: '/cart' },
        { label: 'Logout', path: '/' },
    ]
    const cartCount = useSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    )

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#b9c6d3ff' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'right',gap:2 }}>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cartCount} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right"
                slotProps={{
                    paper: {
                        sx: {
                            height: 'auto',
                            top: 'unset',
                            bottom: 'initial',
                            right: 0,
                            borderRadius: '15px',
                            backgroundColor: '#808080',
                            color: 'white',
                        },
                    },
                }}
                open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{
                        width: 200,
                        px: 2,
                        py: 1
                    }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {sidebar.map((item) => (
                            <ListItem button="true" key={item.label} >
                                <ListItemText primary={item.label} sx={{ cursor: 'pointer' }} onClick={() => handleNavigation(item.path)} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar

