import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeUserMenuModal from './HomeUserMenuModal';

const HomeHeader = ({ open, handleDrawerToggle }) => {
    const user = {
        name: 'Nikhil Garg',
        email: 'nikhil.garg@finwise365.com',
        country: 'SG',
        currency: 'SGD',
        avatar: '/path/to/avatar.jpg' // Replace with the actual path to the avatar image
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#0d47a1' }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <img src="/SmartOwlLogo.png" alt="Smart Owl" style={{ width: 36, height: 36 }} />
                        </IconButton>
                        <Typography variant="h6" component="span" sx={{ color: 'white', ml: 1 }}>
                            FinWise365
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ paddingLeft: 6 }}
                        >
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, pr: 2, alignItems: 'center' }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Typography variant="caption">{user.country}</Typography>
                        </Box>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Typography variant="caption">{user.currency}</Typography>
                        </Box>
                    </Box>
                    <Link onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff9e6', borderRadius: 4, p: 0.5, mr: 1, cursor: 'pointer' }}>
                        <Avatar src={user.avatar} alt={user.name} sx={{ mr: 1 }} />
                        <IconButton color="black">
                            <SettingsIcon />
                        </IconButton>
                    </Link>
                </Toolbar>
            </AppBar>
            <HomeUserMenuModal anchorEl={anchorEl} handleClosePopover={handleClosePopover} user={user}/>
        </>
    );
};

export default HomeHeader;