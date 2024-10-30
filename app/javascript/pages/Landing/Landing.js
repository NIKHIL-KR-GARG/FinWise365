import React from 'react';
import { Box } from '@mui/material';

import LandingHeader from '../../components/landingpage/LandingHeader';
import LandingSectionTagline from '../../components/landingpage/LandingSectionTagline';
import LandingSectionFeatures from '../../components/landingpage/LandingSectionFeatures';
import LandingSectionVideos from '../../components/landingpage/LandingSectionVideos';
import LandingFooter from '../../components/landingpage/LandingFooter';

const Landing = () => {
    return (
        <Box
            sx={{
                width: '100%', // Full width of the parent container
                alignItems: 'center',
                justifyContent: 'center',
                px: 0, // Horizontal padding
            }}
        >
            <LandingHeader />
            <Box sx={{ mt: 6 }}> {/* Margin top for spacing */}
                <LandingSectionTagline />
            </Box>
            <Box sx={{ mt: 0 }}> {/* Margin top for spacing */}
                <LandingSectionFeatures />
            </Box>
            <Box sx={{ mt: 0 }}> {/* Margin top for spacing */}
                <LandingSectionVideos />
            </Box>
            <Box sx={{ mt: 0 }}> {/* Margin top for spacing */}
                <LandingFooter />
            </Box>
        </Box>
    );
};

export default Landing;