import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, Divider } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
import GenerateCashflows from '../../components/cashflowpage/GenerateCashfows';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const Cashflow = () => {
        
    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile
        
    const [open, setOpen] = useState(isMobile ? false : true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, mt: isMobile ? '128px' : '64px' }}>
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
                    }}
                >
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                        <Link underline="hover" color="inherit" href="/home">
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="">
                            Analyze
                        </Link>
                        <Typography color="textPrimary">Cashflow</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper', width: '100%' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon sx={{ mr: 1 }} />
                                Cashflow Projections
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <GenerateCashflows hideAccordians={false}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Cashflow;