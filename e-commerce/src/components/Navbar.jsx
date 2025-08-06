import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Badge,
    Popover,
    Typography,
    Divider,
    Button,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleIcon from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [notificationAnchor, setNotificationAnchor] = useState(null)
    const role = useSelector((state) => state?.auth?.user?.role)


    const navigate = useNavigate()

    const handleNavigation = (path) => {
        navigate(path)
    }

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    }

    const sidebar = [
        { label: 'Profile', path: '/profile' },
        // { label: 'Cart', path: '/cart' },
        { label: 'Logout', path: '/' },
    ]

    const cartCount = useSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    )

    // Dummy Notifications Data
    const notifications = [
        'Order #1234 has been shipped',
        'Your profile was updated successfully',
        'New product added to your wishlist',
    ]

    const handleNotificationClick = (event) => {
        setNotificationAnchor(event.currentTarget)
    }

    const handleNotificationClose = () => {
        setNotificationAnchor(null)
    }

    const open = Boolean(notificationAnchor)
    const id = open ? 'notification-popover' : undefined

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#b9c6d3ff' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                    <IconButton color="inherit" onClick={() => navigate('/admin/vendor-list')}>
                        <PeopleIcon />
                    </IconButton>

                    {/* Notification Button */}
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Cart Button */}
                    {!["admin", "vendor"].includes(role) &&
                        <IconButton color="inherit" onClick={() => navigate('/cart')}>
                            <Badge badgeContent={cartCount} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>}

                    {/* Drawer Toggle */}
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

            {/* Sidebar Drawer */}
            <Drawer
                anchor="right"
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
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 200, px: 2, py: 1 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {sidebar.map((item) => (
                            <ListItem button key={item.label}>
                                <ListItemText
                                    primary={item.label}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleNavigation(item.path)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Notification Popover */}
            <Popover
                id={id}
                open={open}
                anchorEl={notificationAnchor}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{ mt: 1 }}
            >
                <Box sx={{ p: 2, minWidth: 250 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Notifications
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    {notifications.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                            No new notifications
                        </Typography>
                    ) : (
                        notifications.map((note, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{ mb: 1, wordWrap: 'break-word' }}
                            >
                                • {note}
                            </Typography>
                        ))
                    )}
                </Box>
            </Popover>
        </>
    )
}

export default Navbar
