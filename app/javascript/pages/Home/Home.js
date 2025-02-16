import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Breadcrumbs, Divider, CircularProgress, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
import DisplayCashflow from '../../components/cashflowpage/DisplayCashflow';
import CashFlowCommentary from '../../components/cashflowpage/CashFlowCommentary';
import { getExchangeRate } from '../../components/common/ExchangeRate';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const Home = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const [open, setOpen] = useState(isMobile ? false : true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasSavedCashflow, setHasSavedCashflow] = useState(true);
    const hasFetchedData = useRef(false);

    const [cashflowDate, setCashflowDate] = useState('');
    const [netCashflow, setNetCashflow] = useState([]);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const fetchData = async () => {
        try {
            const cashflowProjectionsResponse = await axios.get(`/api/cashflow_projections?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`);
            const projections = cashflowProjectionsResponse.data;

            if (projections.length === 0) {
                setHasSavedCashflow(false);
                setLoading(false);
                return;
            }

            const mostRecentCashflowProjection = projections.sort((a, b) => b.id - a.id)[0];
            const cashflowID = mostRecentCashflowProjection.id;
            const cashflowDate = mostRecentCashflowProjection.cashflow_date;
            setCashflowDate(cashflowDate);
            const cashflowCurrency = mostRecentCashflowProjection.currency;

            const netCashflowResponse = await axios.get(`/api/cashflow_net_positions?cashflow_id=${cashflowID}`);
            const newCashflowList = netCashflowResponse.data;

            if (currentUserBaseCurrency === cashflowCurrency) {
                setNetCashflow(newCashflowList);
            } else {
                // convert all the values for the cashflow to the base currency
                convertAllValuesToBaseCurrency(newCashflowList, currentUserBaseCurrency, cashflowCurrency);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const convertAllValuesToBaseCurrency = async (newCashflowList, baseCurrency, cashflowCurrency) => {
        try {
            const conversionRate = getExchangeRate(cashflowCurrency, baseCurrency);
            const convertedCashflowList = newCashflowList.map(item => {
                const convertedItem = { ...item };
                convertedItem.income = item.income * conversionRate;
                convertedItem.expense = item.expense * conversionRate;
                convertedItem.net_position = item.net_position * conversionRate;
                convertedItem.liquid_assets = item.liquid_assets * conversionRate;
                convertedItem.locked_assets = item.locked_assets * conversionRate;
                convertedItem.net_worth = item.net_worth * conversionRate;
                convertedItem.currency = baseCurrency;
                return convertedItem;
            });
            setNetCashflow(convertedCashflowList);
        }
        catch (error) {
            setError('Error converting values to base currency');
            setLoading(false);
        }
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
                            <Typography color="textPrimary">Home</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <HomeIcon sx={{ mr: 1 }} />
                                    My Homepage
                                </Box>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        Latest Cashflow Projection
                                    </Box>
                                </Typography>
                            </Box>
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
                        <Typography color="textPrimary">Home</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon sx={{ mr: 1 }} />
                                My Homepage
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center', pb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Latest Cashflow Projection {'( Last Saved on: '} {cashflowDate} {')'}
                                </Box>
                            </Typography>
                        </Box>
                        {!hasSavedCashflow && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 10 }}>
                                <Typography variant="h5" sx={{ fontStyle: 'italic', textAlign: 'center', color: 'red', bgcolor: '#ffe6e6' }}>
                                    You have not saved any cashflow projections yet. 
                                    Please create a new cashflow projection from 
                                    <Link underline="hover" color="primary" href="/cashflows" sx={{ fontStyle: 'italic', textDecoration: 'underline', ml: 1 }}> 
                                        Analyze (Cashflow)
                                    </Link>  Menu option.
                                </Typography>
                            </Box>
                        )}
                        {hasSavedCashflow && (
                            <>
                                <DisplayCashflow netCashflowData={netCashflow} />
                                <Divider sx={{ my: 2 }} />
                                <CashFlowCommentary netCashflows={netCashflow} incomes={null} isFixedRetirementDate={false} corpus={0} sourcePage={'HomePage'} />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;