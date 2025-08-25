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
    Tooltip,
    ListItemButton
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleIcon from '@mui/icons-material/People'
import InventorySharpIcon from '@mui/icons-material/InventorySharp';

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser } from '../utlis/userSlice'
import { useMutation } from '@tanstack/react-query'
import api from '../utlis/api'

const logoutUser = async () => {
    const data = await api.post("/api/logout/")
    return data
}




const adminNotification = async () => {
    const { data } = await api.get('/admin/notifications')
    return data
}
const vendorNotification = async () => {
    const { data } = await api.get('/vendor/notifications')
    return data
}

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [notificationAnchor, setNotificationAnchor] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector((store) => store?.user)
    const role = user?.role
    console.log("LoggedIn User from localStorage :", localStorage.getItem("user"))
    console.log("LoggedIn User from redux :", user)

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            navigate('/')
        },
        onError: (error) => {
            console.error("Logout failed:", error)
        }
    })



    const navigate = useNavigate()

    const handleNavigation = async (label, path) => {
        if (label === "Logout") {
            try {
                await logoutMutation.mutateAsync()
                localStorage.removeItem("user")
                dispatch(removeUser())
            } catch (error) {
                console.error("Logout failed:", error)
            }
        }
        navigate(path)
    }

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    }

    const sidebar = [
        { label: 'Profile', path: '/profile' },
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


                    {role === "admin" &&
                        <Tooltip title="Vendor List" arrow>
                            <IconButton color="inherit" onClick={() => navigate('/admin/vendor-list')}>
                                <PeopleIcon />
                            </IconButton>
                        </Tooltip>}


                    {/* {role === "vendor" &&
                        <Tooltip title="Products" arrow>
                            <IconButton color="inherit" onClick={() => navigate('/vendor/products')}>
                                <InventorySharpIcon />
                            </IconButton>
                        </Tooltip>} */}


                    {/* Notification Button */}
                    {role !== "customer" && <Tooltip title="Notifications" arrow>
                        <IconButton color="inherit" onClick={handleNotificationClick}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>}

                    {/* Cart Button */}
                    <Tooltip title="Cart" arrow>
                        {!["admin", "vendor"].includes(role) &&
                            <IconButton color="inherit" onClick={() => navigate('/cart')}>
                                <Badge badgeContent={cartCount} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>}
                    </Tooltip>


                    {/* Drawer Toggle */}
                    <Tooltip title="Menu" arrow>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

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
                            <ListItemButton key={item.label}>
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleNavigation(item.label, item.path, logoutMutation)}
                                />
                            </ListItemButton>
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
