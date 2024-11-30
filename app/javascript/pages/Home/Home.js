import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
//import HomeFooter from '../../components/homepage/HomeFooter';
import GenerateCashflows from '../../components/cashflowpage/GenerateCashfows';

const Home = () => {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
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
                        <Typography color="textPrimary">Home</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon sx={{ mr: 1 }} />
                                My Homepage
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <GenerateCashflows hideAccordians={true}/>
                        {/* <Divider sx={{ my: 2 }} /> */}
                    </Box>
                </Box>
            </Box>
            {/*<HomeFooter />*/}
        </Box>
    );
};

export default Home;