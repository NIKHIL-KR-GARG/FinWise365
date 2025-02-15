import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const LandingSectionVideos = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const videos = ['LoginSignup.mp4', 'UserAccounts.mp4', 'SupportPages.mp4', 'DemoData.mp4', 'Incomes.mp4', 'Expenses.mp4', 'Assets.mp4', 'Dreams.mp4', 'Cashflows.mp4', 'SimulationRetire.mp4', 'SimulationIncome.mp4', 'SimulationSabbatical.mp4', 'SimulationCorpus.mp4'];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (isMobile) {
            if (currentIndex < videos.length - 1) {
                setCurrentIndex(currentIndex + 1); // Move to the next video in mobile mode
            }
        } else {
            if (currentIndex < videos.length - 3) {
                setCurrentIndex(currentIndex + 3); // Move to the next set of 3 videos
            }
        }
    };

    const handlePrev = () => {
        if (isMobile) {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1); // Move to the previous video in mobile mode
            }
        } else {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 3); // Move to the previous set of 3 videos
            }
        }
    };

    return (
        <Box sx={{ width: '100%', textAlign: 'center', padding: 0, bgcolor: '#fff9e6', paddingBottom: 4 }}>
            <Box textAlign="center" sx={{ paddingTop: 4 }}> {/* Center text horizontally */}
                <Typography variant="h4" component="h2" >
                    Video Gallery
                </Typography>
                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                    <Divider sx={{ width: '300px', bgcolor: 'grey.500', height: '2px' }} /> {/* Set a specific width and height for the divider */}
                </Box>
                <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                    Short videos for platform demo & How to use various features
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowBackIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        overflow: 'hidden', // Hide overflow to create a sliding effect
                        width: '948px', // Adjust width to fit 3 videos
                        position: 'relative', // Position relative for absolute children
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            transition: 'transform 0.5s ease', // Add transition for smooth sliding
                            transform: `translateX(-${currentIndex * (300 + 16)}px)`, // Move left based on current index and margin
                        }}
                    >
                        {videos.map((video, index) => (
                            <Box key={index} sx={{ minWidth: '300px', marginRight: '16px' }}>
                                <video
                                    width="300"
                                    height="200"
                                    controls
                                    style={{ borderRadius: '8px' }} // Optional styling
                                >
                                    <source src={`/videos/${video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <Typography variant="subtitle1" sx={{ marginTop: 1, fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {video.replace('.mp4', '')} {/* Display the video title without the file extension */}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <IconButton onClick={handleNext} disabled={currentIndex >= videos.length - 3}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default LandingSectionVideos;