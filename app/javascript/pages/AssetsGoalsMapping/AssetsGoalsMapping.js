import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Breadcrumbs, Divider, CircularProgress, Link } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
import { getExchangeRate } from '../../components/common/ExchangeRate';

const AssetsGoalsMapping = () => {

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetchedData = useRef(false);

    const currentUserId = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientID') : localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientBaseCurrency') : localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentClientID') ? 'false' : localStorage.getItem('currentUserDisplayDummyData');

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const fetchData = async () => {
        // try {
        //     const cashflowProjectionsResponse = await axios.get(`/api/cashflow_projections?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`);
        //     const projections = cashflowProjectionsResponse.data;

        //     if (projections.length === 0) {
        //         setHasSavedCashflow(false);
        //         setLoading(false);
        //         return;
        //     }

        //     const mostRecentCashflowProjection = projections.sort((a, b) => b.id - a.id)[0];
        //     const cashflowID = mostRecentCashflowProjection.id;
        //     const cashflowDate = mostRecentCashflowProjection.cashflow_date;
        //     setCashflowDate(cashflowDate);
        //     const cashflowCurrency = mostRecentCashflowProjection.currency;

        //     const netCashflowResponse = await axios.get(`/api/cashflow_net_positions?cashflow_id=${cashflowID}`);
        //     const newCashflowList = netCashflowResponse.data;

        //     if (currentUserBaseCurrency === cashflowCurrency) {
        //         setNetCashflow(newCashflowList);
        //     } else {
        //         // convert all the values for the cashflow to the base currency
        //         convertAllValuesToBaseCurrency(newCashflowList, currentUserBaseCurrency, cashflowCurrency);
        //     }

            setLoading(false);
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        //     setError('Error fetching data');
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchData();
            hasFetchedData.current = true;
        }
    }, [currentUserId, currentUserDisplayDummyData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <HomeHeader open={true} handleDrawerToggle={handleDrawerToggle} />
                <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
                    <HomeLeftMenu open={true} />
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
                                Plan
                            </Link>
                            <Typography color="textPrimary">Assets-Goals Mapping</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AssessmentIcon sx={{ mr: 1 }} />
                                    Mapping Assets to Goals
                                </Box>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" position="fixed" top={0} left={0} right={0} bottom={0} zIndex={9999} bgcolor="rgba(255, 255, 255, 0.8)" pointerEvents="none">
                        <CircularProgress style={{ pointerEvents: 'auto' }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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
                            Plan
                        </Link>
                        <Typography color="textPrimary">Assets-Goals Mapping</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AssessmentIcon sx={{ mr: 1 }} />
                                Mapping Assets to Goals
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center', pb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AssetsGoalsMapping;