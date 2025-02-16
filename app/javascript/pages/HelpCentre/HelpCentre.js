import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Link } from '@mui/material';
import LandingHeader from '../../components/landingpage/LandingHeader';
import LandingSectionVideos from '../../components/landingpage/LandingSectionVideos';
import FAQs from '../../components/helpcentrepage/FAQs';
import BlogsArticles from '../../components/helpcentrepage/BlogsArticles';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const HelpCentre = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile
    
    const [tabIndex, setTabIndex] = useState(0);
    
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Box
            sx={{
                width: '100%', // Full width of the parent container
                alignItems: 'center',
                justifyContent: 'center',
                px: 0, // Horizontal padding
            }}
        >
            <LandingHeader sourcePage={'HelpCentre'}/>
            <Box
                sx={{
                    width: '100%',
                    height: '40vh',
                    bgcolor: '#e0f7fa',
                    position: 'relative',
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: isMobile ? '144px' : 0, // Adjust padding top for mobile to account for header
                }}
            >
                <Typography variant="h3" component="div" align="center" fontWeight="bold">
                    Help Centre
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 3, fontSize: '1rem', fontStyle: 'italic' }}>
                Please browse our help centre for answers to common questions. 
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 0, fontSize: '1rem', fontStyle: 'italic' }}>
                    If you can't find what you're looking for, please&nbsp;
                    <Link underline="hover" color="primary" href="/contactus" sx={{ fontStyle: 'italic', textDecoration: 'underline' }}>
                        send us a message
                    </Link> .
                </Typography>
            </Box>
            <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                orientation={isMobile ? "vertical" : "horizontal"} // Set orientation based on screen size
                centered={!isMobile} // Adjust centering based on screen size
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        margin: 1,
                        '&.Mui-selected': {
                            // backgroundColor: '#1976d2',
                            backgroundColor: 'purple',
                            color: '#fff',
                        },
                    },
                }}
            >
                <Tab label="FAQs" />
                <Tab label="Product Videos" />
                <Tab label="Blogs/Articles" />
            </Tabs>
            {tabIndex === 0 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                    <FAQs />
                </Box>
            )}
            {tabIndex === 1 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                    <LandingSectionVideos />
                </Box>
            )}
            {tabIndex === 2 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                    <BlogsArticles />
                </Box>
            )}
        </Box>
    );
};

export default HelpCentre;