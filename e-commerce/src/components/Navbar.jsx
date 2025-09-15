import React, { useEffect, useState } from 'react'
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
    ListItemButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleIcon from '@mui/icons-material/People'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser } from '../utlis/userSlice'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../utlis/api'
import moment from 'moment';
import { addNotification } from '../utlis/notificationSlice'
import NotificationPopover from '../components/Notifications';



const logoutUser = async () => {
    const data = await api.post("/api/logout/")
    return data
}
const handleNotificationRead = async () => {
    const data = await api.post("/api/notifications/read/")
    // console.log(data)
    return data
}



const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [notificationAnchor, setNotificationAnchor] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector((store) => store?.user)
    const role = user?.role
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const unreadCount = useSelector(state => state.notification?.unreadCount || 0);
    // console.log("Unread Count from redux:", unreadCount)


    // console.log("LoggedIn User from localStorage :", localStorage.getItem("user"))
    // console.log("LoggedIn User from redux :", user)


    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            navigate('/login')
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            setDialogMessage("Logout failed. Please try again.");
            setOpenDialog(true);
        }
    })

    const navigate = useNavigate()

    const handleNavigation = async (label, path) => {
        if (label === "Logout") {
            try {
                setIsLoggingOut(true);
                await logoutMutation.mutateAsync();
                localStorage.removeItem("user");
                dispatch(removeUser());
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                setIsLoggingOut(false);
            }
        }
        navigate(path);
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    }

    const sidebar = [
        // { label: 'Profile', path: '/profile' },
        { label: 'Logout', path: '/login' },
    ]


    const cartLength = useSelector((state) => state.cart?.items || [])
    const totalQuantity = cartLength.reduce((sum, item) => sum + item.quantity, 0);

    const handleNotificationClick = (event) => {
        setNotificationAnchor(event.currentTarget)
        handleNotificationRead()
        setIsNotificationsOpen(true)
    }

    const handleNotificationClose = () => {
        setNotificationAnchor(null)
        setIsNotificationsOpen(false)
    }

    const open = Boolean(notificationAnchor)
    const id = open ? 'notification-popover' : undefined

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#b9c6d3ff' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={() => navigate('/')}>
                            <Avatar />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {role === "admin" && (
                            <Tooltip title="Vendor List" arrow>
                                <IconButton color="inherit" onClick={() => navigate('/admin/vendor-list')}>
                                    <PeopleIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {role !== "customer" && (
                            <Tooltip title="Notifications" arrow>
                                <IconButton color="inherit" onClick={handleNotificationClick}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Cart" arrow>
                            {!["admin", "vendor"].includes(role) &&
                                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                                    <Badge badgeContent={totalQuantity} color="secondary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            }
                        </Tooltip>
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
                    </Box>
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
                            <ListItemButton
                                key={item.label}
                                disabled={isLoggingOut}
                                onClick={() => handleNavigation(item.label, item.path, logoutMutation)}
                                sx={{ cursor: isLoggingOut ? 'not-allowed' : 'pointer' }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                                        color: isLoggingOut ? 'text.disabled' : 'inherit',
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                </Box>
            </Drawer>
            {isNotificationsOpen &&
                <NotificationPopover
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                />}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default Navbar
