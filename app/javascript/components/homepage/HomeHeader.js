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
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const HomeHeader = ({ open, handleDrawerToggle }) => {

    const navigate = useNavigate();
    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserFirstName = localStorage.getItem('currentUserFirstName');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');

    const [anchorEl, setAnchorEl] = useState(null);
    const [isDemoData, setIsDemoData] = useState(currentUserDisplayDummyData === 'true');
    const [currentUserBaseCurrency, setCurrentUserBaseCurrency] = useState(localStorage.getItem('currentUserBaseCurrency'));
    const [currentUserCountryOfResidence, setCurrentUserCountryOfResidence] = useState(localStorage.getItem('currentUserCountryOfResidence'));

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

    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentUserBaseCurrency(localStorage.getItem('currentUserBaseCurrency'));
            setCurrentUserCountryOfResidence(localStorage.getItem('currentUserCountryOfResidence'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                // Redirect to the home page and force a refresh
                navigate('/home');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating demo data:', error);
        }
    };

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#0d47a1' }}>
                <Toolbar>
                    <Box
                        sx={{
                            width: '100%', // Full width of the parent container
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row', // Adjust layout for mobile
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <IconButton edge="start" color="inherit" aria-label="menu" component={RouterLink} to="/home">
                                <img src="/FinWise365_Logo_TransparentWhite.png" alt="Smart Owl" style={{ width: 36, height: 36 }} />
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
                        <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center', alignItems: isMobile ? 'flex-start' : 'center', gap: 2, flexGrow: 1, pr: 2 }}>
                            {!isMobile && (
                                <Typography variant="h7" sx={{ color: 'white', mr: 2, fontStyle: 'italic', textAlign: 'center' }}>
                                    Discover the power of financial wisdom with the <strong>"demo data"</strong> <br />and start adding <strong>"your data"</strong> when you are ready!
                                </Typography>
                            )}
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={isDemoData ? <PowerOffIcon /> : <PowerIcon />}
                                onClick={handleDemoDataToggle}
                                sx={{ fontSize: '0.75rem' }} // Adjust the font size here
                            >
                                {isDemoData ? 'Switch off demo data' : 'Switch on demo data'}
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, pr: 2, pb: isMobile ? 1 : 0, alignItems: 'center' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                                <Typography variant="caption">{currentUserCountryOfResidence}</Typography>
                            </Box>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff9e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                                <Typography variant="caption">{currentUserBaseCurrency}</Typography>
                            </Box>
                            <Link onClick={handleOpenPopover} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff9e6', borderRadius: 4, p: 0.5, mr: 1, mt: isMobile ? 1 : 0 , cursor: 'pointer' }}>
                                <Avatar src={'/path/to/avatar.jpg'} alt={currentUserFirstName} sx={{ mr: 1 }} />
                                <IconButton color="black">
                                    <SettingsIcon />
                                </IconButton>
                            </Link>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <HomeUserMenuModal anchorEl={anchorEl} handleClosePopover={handleClosePopover} />
        </>
    );
};

export default HomeHeader;