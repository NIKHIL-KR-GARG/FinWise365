import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeUserMenuModal from './HomeUserMenuModal';
import { Link as RouterLink } from 'react-router-dom';

const HomeHeader = ({ open, handleDrawerToggle }) => {
    
    const currentUserFirstName = localStorage.getItem('currentUserFirstName');
    //const currentUserLastName = localStorage.getItem('currentUserLastName');
    //const currentUserEmail = localStorage.getItem('currentUserEmail');
    const currentUserNationality = localStorage.getItem('currentUserNationality');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

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
                        <IconButton edge="start" color="inherit" aria-label="menu" component={RouterLink} to="/home">
                            <img src="/SmartOwlLogo.png" alt="Smart Owl" style={{ width: 36, height: 36 }} />
                        </IconButton>
                        <Typography variant="h6" component={RouterLink} to="/home" sx={{ color: 'white', ml: 1, textDecoration: 'none' }}>
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
                            <Typography variant="caption">{currentUserNationality}</Typography>
                        </Box>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Typography variant="caption">{currentUserBaseCurrency}</Typography>
                        </Box>
                    </Box>
                    <Link onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff9e6', borderRadius: 4, p: 0.5, mr: 1, cursor: 'pointer' }}>
                        <Avatar src={'/path/to/avatar.jpg'} alt={currentUserFirstName} sx={{ mr: 1 }} />
                        <IconButton color="black">
                            <SettingsIcon />
                        </IconButton>
                    </Link>
                </Toolbar>
            </AppBar>
            <HomeUserMenuModal anchorEl={anchorEl} handleClosePopover={handleClosePopover}/>
        </>
    );
};

export default HomeHeader;