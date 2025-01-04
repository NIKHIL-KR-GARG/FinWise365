import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { Box, Link, Typography, Breadcrumbs, Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';

import Simulate_WhenToRetire from '../../components/simulationspage/Simulate_WhenToRetire';

const Simulations = () => {

    const [open, setOpen] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleShowSimulation = () => {
        setShowSimulation(true);
    };

    // const currentUserId = localStorage.getItem('currentUserId');
    // const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');

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
                        <Link underline="hover" color="inherit" href="/home">
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="">
                            Insights
                        </Link>
                        <Typography color="textPrimary">Simulations</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon sx={{ mr: 1 }} />
                                My Simulations
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'left', pb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                                <Box sx={{ display: 'flex', alignItems: 'left' }}>
                                    What would you like to simulate today? Pick a simulation type below.
                                </Box>
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', alignItems: 'left', pb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} sx={{ bgcolor: '#fff9e6' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>When can I retire?</Typography>
                                            {expanded === 'panel1' &&
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} // Adjust the font size here
                                                    onClick={handleShowSimulation}
                                                >
                                                    Show me the Simulation
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Are my current savings and planned income enough to retire? Can I retire earlier or would have to delay to later?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')} sx={{ bgcolor: '#e0f7fa' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>At what point can I stop adding more assets?</Typography>
                                            {expanded === 'panel2' &&
                                                <Button
                                                    disabled
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} // Adjust the font size here
                                                >
                                                    Show me the Simulation
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                At what point can I stop adding more assets to my portfolio and still achieve my financial goals?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')} sx={{ bgcolor: '#fce4ec' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Can I reduce my current income?</Typography>
                                            {expanded === 'panel3' &&
                                                <Button
                                                    disabled
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} // Adjust the font size here
                                                >
                                                    Show me the Simulation
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Can I reduce my current income and still achieve my financial goals? If yes, by how much can I reduce my income and from when?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')} sx={{ bgcolor: '#e8f5e9' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>When will I reach a particular corpus?</Typography>
                                            {expanded === 'panel4' &&
                                                <Button
                                                    disabled
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} // Adjust the font size here
                                                >
                                                    Show me the Simulation
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                When will I reach a particular corpus as per my current savings and planned income?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')} sx={{ bgcolor: '#fff3e0' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Can I take a sabbatical?</Typography>
                                            {expanded === 'panel5' &&
                                                <Button
                                                    disabled
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} // Adjust the font size here
                                                >
                                                    Show me the Simulation
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                What if I take a sabbatical? Can I afford to take a break from work and still achieve my financial goals? If yes, how long can I afford to take a break? and when?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {showSimulation && <Simulate_WhenToRetire />}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Simulations;