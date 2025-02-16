import React from 'react';
import { Box, Divider } from '@mui/material';

import LandingHeader from '../../components/landingpage/LandingHeader';
import Disclaimer from '../../components/miscelleanous/Disclaimer';
import PrivacyPolicy from '../../components/miscelleanous/PrivacyPolicy';
import CookiesPolicy from '../../components/miscelleanous/CookiesPolicy';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const DisclaimerAndPolicy = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    return (
        <Box
            sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0,
            }}
        >
            <LandingHeader sourcePage={'DisclaimerAndPolicy'} />
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#e0f7fa',
                    position: 'relative',
                    mt: 8,
                    paddingLeft: 1,
                    minHeight: '100vh', 
                    paddingTop: isMobile ? '144px' : 0, // Adjust padding top for mobile to account for header
                }}
            >
                <Disclaimer />
                <Divider sx={{ my: 4 }} />
                <PrivacyPolicy />
                <Divider sx={{ my: 4 }} />
                <CookiesPolicy />
            </Box>
        </Box >
    );
};

export default DisclaimerAndPolicy;
