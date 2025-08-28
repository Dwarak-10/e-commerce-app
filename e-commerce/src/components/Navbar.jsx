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
    DialogActions
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
import { addNotification, markAllRead, markNotificationRead } from '../utlis/notificationSlice'



const logoutUser = async () => {
    const data = await api.post("/api/logout/")
    return data
}

const adminNotification = async () => {
    const { data } = await api.get('/api/notifications/')
    // console.log(data)
    return data
}

const vendorNotification = async () => {
    const { data } = await api.get('/api/notifications/')
    // console.log(data)
    return data
}

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [notificationAnchor, setNotificationAnchor] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector((store) => store?.user)
    const notificationsRedux = useSelector((store) => store?.notification)
    const role = user?.role
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // console.log("LoggedIn User from localStorage :", localStorage.getItem("user"))
    // console.log("LoggedIn User from redux :", user)
    const { data: adminNotifications } = useQuery({
        queryKey: ['adminNotifications'],
        queryFn: adminNotification,
    })
    const { data: vendorNotifications } = useQuery({
        queryKey: ['vendorNotifications'],
        queryFn: vendorNotification,
    })

    const notifications = role === "admin" ? adminNotifications : vendorNotifications

    // useEffect(() => {
    //     dispatch(addNotification(notifications))
    // }, [ notifications])
    // console.log("notificationsRedux:", notificationsRedux)

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
        { label: 'Profile', path: '/profile' },
        { label: 'Logout', path: '/login' },
    ]


    const cartLength = useSelector((state) => state.cart?.items || [])
    const totalQuantity = cartLength.reduce((sum, item) => sum + item.quantity, 0);





    const handleNotificationClick = (event) => {
        setNotificationAnchor(event.currentTarget)
    }

    const handleNotificationClose = () => {
        setNotificationAnchor(null)
    }

    const open = Boolean(notificationAnchor)
    const id = open ? 'notification-popover' : undefined

    const handleReadNotificationClick = (notificationId) => {
        console.log("Cicked")
        setNotification(notification.filter(note => note.id !== notificationId));
        // dispatch(markNotificationRead(notificationId));
    };

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


                    {/* Notification Button */}
                    {role !== "customer" && <Tooltip title="Notifications" arrow>
                        <IconButton color="inherit" onClick={handleNotificationClick}>
                            <Badge badgeContent={notifications?.length || 0} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>}

                    {/* Cart Button */}
                    <Tooltip title="Cart" arrow>
                        {!["admin", "vendor"].includes(role) &&
                            <IconButton color="inherit" onClick={() => navigate('/cart')}>
                                <Badge badgeContent={totalQuantity} color="secondary">
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
                    <Typography variant="subtitle1" gutterBottom>Notifications</Typography>
                    <Divider sx={{ mb: 1 }} />
                    {(!notifications || notifications.length === 0) ? (
                        <Typography variant="body2" color="textSecondary">
                            No new notifications
                        </Typography>
                    ) : (
                        notifications
                            .filter(note => note.is_read)
                            .map((note, index) => (
                                <Typography
                                    key={note.id || index}
                                    variant="body2"
                                    sx={{ mb: 1, wordWrap: 'break-word', cursor: 'pointer' }}
                                    onClick={() => handleReadNotificationClick(note.id)}                                >
                                    • {note.message} {' '}
                                    <Box component="span" sx={{ fontSize: 11, color: 'gray', fontStyle: 'italic' }}>
                                        ({moment(note.timestamp).fromNow()})
                                    </Box>
                                </Typography>
                            ))
                    )}
                </Box>
            </Popover>
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
