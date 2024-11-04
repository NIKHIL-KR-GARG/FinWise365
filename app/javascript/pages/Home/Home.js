import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography } from '@mui/material';
import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
//import HomeFooter from '../../components/homepage/HomeFooter';

//const drawerWidth = 240;
//const collapsedDrawerWidth = 60;

const Home = () => {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <HomeLeftMenu open={open} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        //width: '100%',
                        overflow: 'auto',
                        transition: (theme) => theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        //marginLeft: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
                        //...(open && { marginLeft: 0 }),
                    }}
                >
                    <Toolbar />
                    <Container>
                        <Typography >
                            Home Page
                        </Typography>
                    </Container>
                </Box>
            </Box>
            {/*<HomeFooter />*/}
        </Box>
    );
};

export default Home;