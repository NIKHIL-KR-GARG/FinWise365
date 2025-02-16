import React, { useState } from 'react';
import { Box, Breadcrumbs, Typography, Divider, Tabs, Tab } from '@mui/material';
import Link from '@mui/material/Link';
import TabPanel from '../../components/common/TabPanel';
import PersonIcon from '@mui/icons-material/Person';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import ContactUsMessageList from '../../components/adminfunctionspage/ContactUsMessageList';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const AdminFunctions = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const [open, setOpen] = useState(isMobile ? false : true);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}> {/* Adjust mt to match header height */}
                <HomeLeftMenu open={open} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: (theme) => theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        //marginLeft: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
                    }}
                >
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                        <Link underline="hover" color="inherit" href="/home">
                            Home
                        </Link>
                        <Typography color="textPrimary">Admin Functions</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Admin Functions
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                orientation="vertical"
                                variant="scrollable"
                                aria-label="Vertical tabs settings"
                                sx={{ borderRight: 1, borderColor: 'divider', width: 250 }} // Set a fixed width for the Tabs component
                            >
                                <Tab
                                    icon={<PersonIcon />}
                                    iconPosition="start"
                                    label={
                                        <Box sx={{ textAlign: 'left', textTransform: 'none' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>User Messages</Typography>
                                            <Typography variant="body2" color="textSecondary">Messages from Contact Us</Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        textTransform: 'none',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        backgroundColor: tabValue === 0 ? '#e0f7fa' : 'inherit'
                                    }} 
                                />
                            </Tabs>
                            <Box sx={{ flexGrow: 1, p: 0 }}>
                                <TabPanel value={tabValue} index={0}>
                                    <ContactUsMessageList />
                                </TabPanel>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminFunctions;