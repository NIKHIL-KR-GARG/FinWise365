import React from 'react';
import { Box, Divider } from '@mui/material';

import LandingHeader from '../../components/landingpage/LandingHeader';
import Disclaimer from '../../components/miscelleanous/Disclaimer';
import PrivacyPolicy from '../../components/miscelleanous/PrivacyPolicy';
import CookiesPolicy from '../../components/miscelleanous/CookiesPolicy';

const DisclaimerAndPolicy = () => {
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
