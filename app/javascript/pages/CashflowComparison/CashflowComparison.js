import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Breadcrumbs, Divider, CircularProgress, Link, FormControl, Select, MenuItem, Button, Snackbar, Alert, IconButton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';
import DisplayCashflowComparison from '../../components/cashflowpage/DisplayCashflowComparison';
import { getExchangeRate } from '../../components/common/ExchangeRate';

const CashflowComparison = () => {
    
    const hasFetchedData = useRef(false);

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [hasSavedCashflow, setHasSavedCashflow] = useState(true);
    const [fetchedBothCashflows, setFetchedBothCashflows] = useState(false);

    const [cashflowProjections, setCashflowProjections] = useState([]);
    const [selectedProjection1, setSelectedProjection1] = useState('');
    const [selectedProjection2, setSelectedProjection2] = useState('');
    const [netCashflow1, setNetCashflow1] = useState([]);
    const [netCashflow2, setNetCashflow2] = useState([]); 

    const currentUserId = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientID') : localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientBaseCurrency') : localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentClientID') ? 'false' : localStorage.getItem('currentUserDisplayDummyData');
    
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const fetchData = async () => {
        try {
            const timestamp = new Date().getTime();
            const cashflowProjectionsResponse = await axios.get(`/api/cashflow_projections?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}&timestamp=${timestamp}`);
            const projections = cashflowProjectionsResponse.data;

            if (projections.length === 0) {
                setHasSavedCashflow(false);
                setLoading(false);
                return;
            }
            else if (projections.length === 1) {
                setHasSavedCashflow(false);
                setLoading(false);
                return;
            }

            const sortedCashflowProjection = projections.sort((a, b) => b.id - a.id);
            setCashflowProjections(sortedCashflowProjection);
            
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
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
                            <Link underline="hover" color="inherit" href="/home">
                                Home
                            </Link>
                            <Link underline="hover" color="inherit" href="">
                                Analyze
                            </Link>
                            <Typography color="textPrimary">
                                Cashflow Comparisons
                            </Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AttachMoneyIcon sx={{ mr: 1 }} />
                                    Cashflow Comparisons
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

    const handleProjection1Change = (event) => {
        setSelectedProjection1(event.target.value);
    };

    const handleProjection2Change = (event) => {
        setSelectedProjection2(event.target.value);
    };

    const handleCompare = async () => {
        if (validate()) {
            try {
                const netCashflowResponse1 = await axios.get(`/api/cashflow_net_positions?cashflow_id=${selectedProjection1}`);
                const netCashflowList1 = netCashflowResponse1.data;
                setNetCashflow1(convertAllValuesToBaseCurrency(netCashflowList1, currentUserBaseCurrency));

                const netCashflowResponse2 = await axios.get(`/api/cashflow_net_positions?cashflow_id=${selectedProjection2}`);
                const netCashflowList2 = netCashflowResponse2.data;
                setNetCashflow2(convertAllValuesToBaseCurrency(netCashflowList2, currentUserBaseCurrency));

                setFetchedBothCashflows(true);

            } catch (error) {
                setErrorMessage('Error fetching data');
                setFetchedBothCashflows(false);
            }
        }
        else {
            setErrorMessage('Please select two different cashflow projections to compare');
        }
    };

    const convertAllValuesToBaseCurrency = (netCashflowList, baseCurrency) => {
        // loop though the list and convert all values to base currency if it is not already in base currency
        const convertedList = netCashflowList.map((item) => {
            if (item.currency !== baseCurrency) {
                const conversionRate = getExchangeRate(item.currency, baseCurrency);
                item.income = item.income * conversionRate;
                item.expense = item.expense * conversionRate;
                item.net_position = item.net_position * conversionRate;
                item.liquid_assets = item.liquid_assets * conversionRate;
                item.locked_assets = item.locked_assets * conversionRate;
                item.net_worth = item.net_worth * conversionRate;
                item.currency = baseCurrency;
            }
            return item;
        });
        return convertedList;
    };

    const validate = () => {
        if (!selectedProjection1 || !selectedProjection2) {
            return false;
        }
        if (selectedProjection1 === selectedProjection2) {
            return false;
        }
        return true;
    }

    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setErrorMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
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
                        <Typography color="textPrimary">
                            Cashflow Comparisons
                        </Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TrendingUpIcon sx={{ mr: 1 }} />
                                Cashflow Comparisons
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        {!hasSavedCashflow && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 10 }}>
                                <Typography variant="h5" sx={{ fontStyle: 'italic', textAlign: 'center', color: 'red', bgcolor: '#ffe6e6' }}>
                                    You have not saved two or more cashflow projections to use for comparison yet.
                                    Please create new cashflow projections from
                                    <Link underline="hover" color="primary" href="/cashflows" sx={{ fontStyle: 'italic', textDecoration: 'underline', ml: 1 }}>
                                        Analyze (Cashflow)
                                    </Link>
                                    Menu option and save them for comparisons.
                                </Typography>
                            </Box>
                        )}
                        {hasSavedCashflow && (
                            <Box sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                    <Typography variant="subtitle1">
                                        Select the two Cashflow Projections to compare:
                                    </Typography>
                                    <FormControl sx={{ minWidth: 200, height: 40 }}>
                                        <Select
                                            value={selectedProjection1}
                                            onChange={handleProjection1Change}
                                            displayEmpty
                                            sx={{ height: '40px' }}
                                        >
                                            <MenuItem value="" disabled>Select Projection 1</MenuItem>
                                            {cashflowProjections.map((projection) => (
                                                <MenuItem key={projection.id} value={projection.id}>
                                                    {new Date(projection.cashflow_date).toLocaleDateString(undefined, dateOptions)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 200, height: 40 }}>
                                        <Select
                                            value={selectedProjection2}
                                            onChange={handleProjection2Change}
                                            displayEmpty
                                            sx={{ height: '40px' }}
                                        >
                                            <MenuItem value="" disabled>Select Projection 2</MenuItem>
                                            {cashflowProjections.map((projection) => (
                                                <MenuItem key={projection.id} value={projection.id}>
                                                    {new Date(projection.cashflow_date).toLocaleDateString(undefined, dateOptions)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCompare}
                                        sx={{
                                            backgroundColor: 'purple',
                                            '&:hover': {
                                                backgroundColor: 'darkviolet',
                                            },
                                            minWidth: '150px',
                                            height: '40px'
                                        }}
                                    >
                                        Compare Cashflows
                                    </Button>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                            </Box>
                        )}
                        {fetchedBothCashflows && (
                            <DisplayCashflowComparison netCashflowData1={netCashflow1} netCashflowData2={netCashflow2} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CashflowComparison;