import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, Divider } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
import AssetsCashflow from '../../components/cashflowpage/AssetsCashflow';

const Cashflow = () => {
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
                        <Link underline="hover" color="inherit" href="/home">
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="">
                            Analyze
                        </Link>
                        <Typography color="textPrimary">Cashflow</Typography>
                        
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper', width: '100%' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon sx={{ mr: 1 }} />
                                Cashflow Projections
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', alignItems: 'center', justifyContent: 'space-between' }}>
                               <SavingsOutlinedIcon sx={{ mr: 1, color: 'green' }} />
                                Net Worth
                            </Typography>
                            {/* <AssetsCashflow /> */}
                        </Box>
                        <Box>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <TrendingUpOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                        My Assets ()
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetsCashflow />
                                </AccordionDetails>
                            </Accordion>        
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <MoneyOffOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                        My Expenses ()
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <AssetsCashflow /> */}
                                </AccordionDetails>
                            </Accordion>                     
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Cashflow;