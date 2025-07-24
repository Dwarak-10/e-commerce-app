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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'

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
        { label: 'Logout', path: '/' },
    ]

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#b9c6d3ff' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"

                    >
                        <MenuIcon />
                    </IconButton>
                    <Box>
                        <Tooltip title="Hi, User" arrow>
                            <Avatar alt="User" style={{ cursor: 'pointer' }} src="/profile.jpg"
                                onClick={toggleDrawer(true)} />
                        </Tooltip>
                    </Box>
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

