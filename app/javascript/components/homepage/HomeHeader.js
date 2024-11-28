import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Link, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import HomeUserMenuModal from './HomeUserMenuModal';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomeHeader = ({ open, handleDrawerToggle }) => {
    
    const navigate = useNavigate();

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserFirstName = localStorage.getItem('currentUserFirstName');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDemoData, setIsDemoData] = useState(currentUserDisplayDummyData === 'true');

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const [user, setUser] = useState({
        is_display_dummy_data: currentUserDisplayDummyData === 'true'
    });

    useEffect(() => {
        setIsDemoData(currentUserDisplayDummyData === 'true');
    }, [currentUserDisplayDummyData]);

    const handleDemoDataToggle = async () => {
        try {
            const updatedUser = {
                ...user,
                is_display_dummy_data: !isDemoData
            };

            const response = await axios.put(`/api/users/${currentUserId}`, updatedUser);
            if (response.status === 200) {
                setUser(updatedUser);
                setIsDemoData(!isDemoData);

                localStorage.setItem('currentUserDisplayDummyData', !isDemoData);
                // Redirect to the home page
                navigate('/home');
            }
        } catch (error) {
            console.error('Error updating demo data:', error);
        }
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
                    <Box sx={{ justifyContent: 'center', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Typography variant="h7" sx={{ color: 'white', mr: 2, fontStyle: 'italic' }}>
                            Discover the power of financial wisdom with the <strong>"demo data"</strong> and start adding <strong>"your data"</strong> when you are ready!
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={isDemoData ? <PowerOffIcon /> : <PowerIcon />}
                            onClick={handleDemoDataToggle}
                        >
                            {isDemoData ? 'Switch off demo data' : 'Switch on demo data'}
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, pr: 2, alignItems: 'center' }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Typography variant="caption">{currentUserCountryOfResidence}</Typography>
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