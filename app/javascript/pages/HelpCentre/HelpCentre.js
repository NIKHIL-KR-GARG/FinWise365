import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LandingHeader from '../../components/landingpage/LandingHeader';
import { Link } from 'react-router-dom';
import LandingSectionVideos from '../../components/landingpage/LandingSectionVideos';

const HelpCentre = () => {
    
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
                    height: '30vh',
                    bgcolor: '#e0f7fa',
                    position: 'relative',
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" component="div" align="center" fontWeight="bold">
                    Help Centre
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 3, fontSize: '1rem', fontStyle: 'italic' }}>
                Please browse our help centre for answers to common questions. 
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 0, fontSize: '1rem', fontStyle: 'italic' }}>
                If you can't find what you're looking for, please <Link to="/contactus">contact us</Link>.
                </Typography>
            </Box>
            <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                centered
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
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">FAQ Question 1</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1">
                                Answer to FAQ Question 1.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">FAQ Question 2</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1">
                                Answer to FAQ Question 2.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
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
                   <Typography variant="body1">
                        Coming Soon...
                    </Typography> 
                </Box>
            )}
        </Box>
    );
};

export default HelpCentre;