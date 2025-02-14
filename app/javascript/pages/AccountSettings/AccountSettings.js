import React, { useState, useRef, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Divider, Tabs, Tab } from '@mui/material';
import Link from '@mui/material/Link';
import TabPanel from '../../components/common/TabPanel';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios'; 

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import UserProfile from '../../components/accountsettingspage/userprofile/UserProfile';

const AccountSettings = () => {

    const [open, setOpen] = useState(true);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const hasFetchedData = useRef(false);
    const [user, setUser] = useState(null);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        // Fetch user information from the database
        const fetchUser = async () => {
            if (hasFetchedData.current) return;
            hasFetchedData.current = true;

            try {
                const response = await axios.get(`/api/users`);
                const users = response.data;
                const appuser = users.find((e) => e.id === parseInt(currentUserId));
                if (appuser) {
                    setUser({
                        id: appuser.id,
                        first_name: appuser.first_name,
                        last_name: appuser.last_name,
                        phone_no: appuser.phone_no,
                        date_of_birth: appuser.date_of_birth,
                        country_of_residence: appuser.country_of_residence,
                        is_permanent_resident: appuser.is_permanent_resident,
                        address: appuser.address,
                        retirement_age: appuser.retirement_age,
                        life_expectancy: appuser.life_expectancy,
                        email: appuser.email,
                        base_currency: appuser.base_currency,
                        gender: appuser.gender,
                        nationality: appuser.nationality,
                        is_admin: appuser.is_admin,
                        is_financial_advisor: appuser.is_financial_advisor,
                        financial_advisor_licence_no: appuser.financial_advisor_licence_no,
                        financial_advisor_id: appuser.financial_advisor_id,
                        is_active: appuser.is_active
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [currentUserId]);

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
                        <Typography color="textPrimary">Account Settings</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Account Settings
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>My Profile</Typography>
                                            <Typography variant="body2" color="textSecondary">Manage profile information</Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        textTransform: 'none',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        backgroundColor: tabValue === 0 ? '#e0f7fa' : 'inherit'
                                    }} 
                                />
                                {/* <Tab
                                    icon={<ReceiptIcon />}
                                    iconPosition="start"
                                    label={
                                        <Box sx={{ textAlign: 'left', textTransform: 'none' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Billing & Invoices</Typography>
                                            <Typography variant="body2" color="textSecondary">View your billing history</Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        textTransform: 'none',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        backgroundColor: tabValue === 1 ? '#e0f7fa' : 'inherit'
                                    }} 
                                /> */}
                            </Tabs>
                            <Box sx={{ flexGrow: 1, p: 0 }}>
                                <TabPanel value={tabValue} index={0}>
                                    <UserProfile user={user} action={'Edit'} onClose={null} refreshUserList={null} /> {/* Render the UserProfile component */}
                                </TabPanel>
                                {/* <TabPanel value={tabValue} index={1}>
                                    <Typography variant="body1">"IN PROGRESS, COMING SOON"</Typography>
                                </TabPanel> */}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AccountSettings;