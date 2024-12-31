import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, CircularProgress, Button, Snackbar, Alert } from '@mui/material'; // Added Button, Snackbar and Alert
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close'; // Added CloseIcon

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { incomeAssetValue, incomePropertyRentalAssetValue, incomeCouponAssetValue, incomeDividendAssetValue, incomePayoutAssetValue, incomeLeaseAssetValue } from '../../components/calculators/Assets';
import { FormatCurrency } from  '../../components/common/FormatCurrency';
import { formatMonthYear, today } from '../../components/common/DateFunctions';

import AssetIncomeList from '../../components/incomespage/AssetIncomeList';
import AssetIncomeForm from '../../components/incomespage/AssetIncomeForm';
import CouponIncomeList from '../../components/incomespage/CouponIncomeList';
import DividendIncomeList from '../../components/incomespage/DividendIncomeList';
import PayoutIncomeList from '../../components/incomespage/PayoutIncomeList';
import LeaseIncomeList from '../../components/incomespage/LeaseIncomeList';
import RentalIncomeList from '../../components/incomespage/RentalIncomeList';
import IncomesGraph from '../../components/incomespage/IncomesGraph';
import { filterIncomes } from '../../components/incomespage/AssetIncomeList';
import { filterCouponIncomes } from '../../components/incomespage/CouponIncomeList';
import { filterDividendIncomes } from '../../components/incomespage/DividendIncomeList';
import { filterLeaseIncomes } from '../../components/incomespage/LeaseIncomeList';
import { filterRentalIncomes } from '../../components/incomespage/RentalIncomeList';
import { filterPayoutIncomes } from '../../components/incomespage/PayoutIncomeList';

const Incomes = () => {
    const [open, setOpen] = useState(true);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Asset'); // State for action
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const incomeListRef = useRef(null);
    const [incomeCount, setIncomeCount] = useState(0); // State for income count

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [properties, setProperties] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [others, setOthers] = useState([]);

    const [incomesData, setIncomesData] = useState([]);

    const [rentalIncomeCount, setRentalIncomeCount] = useState(0);
    const [leaseIncomeCount, setLeaseIncomeCount] = useState(0);
    const [couponIncomeCount, setCouponIncomeCount] = useState(0);
    const [dividendIncomeCount, setDividendIncomeCount] = useState(0);
    const [payoutIncomeCount, setPayoutIncomeCount] = useState(0);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');

    useEffect(() => {
        if (incomeListRef.current) {
            setIncomeCount(incomeListRef.current.getIncomeCount());
        }
    }, []);

    useEffect(() => {
        if (incomeListRef.current) {
            incomeListRef.current.refreshIncomeList(updatedIncome, successMsg);
            setIncomeCount(incomeCount + 1);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch all the data
                const [propertiesResponse, vehiclesResponse, incomesResponse, portfoliosResponse, othersResponse] = await Promise.all([
                    axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_incomes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                ]);

                setIncomes(incomesResponse.data);
                // set state for all the lists and filter on not is_dream
                setProperties(propertiesResponse.data.filter(property => !property.is_dream));
                setVehicles(vehiclesResponse.data.filter(vehicle => !vehicle.is_dream));
                setPortfolios(portfoliosResponse.data.filter(portfolio => !portfolio.is_dream));
                setOthers(othersResponse.data.filter(other => !other.is_dream));

                const today = new Date();

                // get value of all the incomes as of today/this month
                let totalIncomeValue = 0.0;
                let incomeAssetsValue = 0.0;
                for (let i = 0; i < incomesResponse.data.length; i++) {
                    const income = incomesResponse.data[i];
                    incomeAssetsValue += parseFloat(incomeAssetValue(income, today, currentUserBaseCurrency));
                }
                totalIncomeValue += incomeAssetsValue;

                // add rental as income as well
                let incomePropertyRentalAssetsValue = 0.0;
                for (let i = 0; i < propertiesResponse.data.length; i++) {
                    const property = propertiesResponse.data[i];
                    const propertyIncome = incomePropertyRentalAssetValue(property, today, currentUserBaseCurrency);
                    if (propertyIncome > 0) {
                        incomePropertyRentalAssetsValue += parseFloat(propertyIncome);
                        setRentalIncomeCount(rentalIncomeCount + 1);
                    }
                }
                totalIncomeValue += incomePropertyRentalAssetsValue;

                // add coupon as income as well
                let incomeCouponAssetsValue = 0.0;
                for (let i = 0; i < portfoliosResponse.data.length; i++) {
                    const portfolio = portfoliosResponse.data[i];
                    const portfolioIncome = incomeCouponAssetValue(portfolio, today, currentUserBaseCurrency);
                    if (portfolioIncome > 0) {
                        incomeCouponAssetsValue += parseFloat(portfolioIncome);
                        setCouponIncomeCount(couponIncomeCount + 1);
                    }
                }
                totalIncomeValue += incomeCouponAssetsValue;

                // add dividend as income as well
                let incomeDividendAssetsValue = 0.0;
                for (let i = 0; i < portfoliosResponse.data.length; i++) {
                    const portfolio = portfoliosResponse.data[i];
                    const portfolioIncome = incomeDividendAssetValue(portfolio, today, currentUserBaseCurrency);
                    if (portfolioIncome > 0) {
                        incomeDividendAssetsValue += parseFloat(portfolioIncome);
                        setDividendIncomeCount(dividendIncomeCount + 1);
                    }
                }
                totalIncomeValue += incomeDividendAssetsValue;

                // add payout as income as well
                let incomePayoutAssetsValue = 0.0;
                for (let i = 0; i < othersResponse.data.length; i++) {
                    const other = othersResponse.data[i];
                    const otherIncome = incomePayoutAssetValue(other, today, currentUserBaseCurrency);
                    if (otherIncome > 0) {
                        incomePayoutAssetsValue += parseFloat(otherIncome);
                        setPayoutIncomeCount(payoutIncomeCount + 1);
                    }
                }
                totalIncomeValue += incomePayoutAssetsValue;

                // add vehicle lease as income as well
                let incomeLeaseAssetsValue = 0.0;
                for (let i = 0; i < vehiclesResponse.data.length; i++) {
                    const vehicle = vehiclesResponse.data[i];
                    const vehicleIncome = incomeLeaseAssetValue(vehicle, today, currentUserBaseCurrency);
                    if (vehicleIncome > 0) {
                        incomeLeaseAssetsValue += parseFloat(vehicleIncome);
                        setLeaseIncomeCount(leaseIncomeCount + 1);
                    }
                }
                totalIncomeValue += incomeLeaseAssetsValue;

                // set data for the incomes graph
                setIncomesData([
                    {
                        name: 'Incomes',
                        Income: parseFloat(incomeAssetsValue).toFixed(2),
                        Rental: parseFloat(incomePropertyRentalAssetsValue).toFixed(2),
                        Coupon: parseFloat(incomeCouponAssetsValue).toFixed(2),
                        Dividend: parseFloat(incomeDividendAssetsValue).toFixed(2),
                        Payout: parseFloat(incomePayoutAssetsValue).toFixed(2),
                        Lease: parseFloat(incomeLeaseAssetsValue).toFixed(2),
                        TotalIncome: parseFloat(totalIncomeValue).toFixed(2),
                    }
                ]);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <HomeHeader open={true} />
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
                                Portfolio
                            </Link>
                            <Typography color="textPrimary">Incomes</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountBalanceIcon sx={{ mr: 1 }} />
                                    My Incomes {'( '}For, {formatMonthYear(new Date())} {')'}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<InsertDriveFileIcon />}
                                        sx={{ mr: 2 }}
                                    >
                                        Download Income Data
                                    </Button>
                                    <Box sx={{ fontSize: '0.875rem' }}>
                                        {'( '}Today, {today} {')'}
                                    </Box>
                                </Box>
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" position="fixed" top={0} left={0} right={0} bottom={0} zIndex={9999} bgcolor="rgba(255, 255, 255, 0.8)" pointerEvents="none">
                    <CircularProgress style={{ pointerEvents: 'auto' }} />
                </Box>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleFormModalOpen = () => {
        setAction('Add');
        setFormModalOpen(true);
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setAction('Asset');
    };

    const handleIncomeAdded = (updatedIncome, successMsg) => {
        if (incomeListRef.current) {
            incomeListRef.current.refreshIncomeList(updatedIncome, successMsg);
            setIncomeCount(incomeCount + 1);
        }
    };
    
    const handleIncomesFetched = (count) => {
        setIncomeCount(count);
    };

    const handleExportToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            const addSheet = (data, sheetName) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            };

            const incomesList = filterIncomes('Asset', incomes, false);
            const coupons = filterCouponIncomes(portfolios);
            const dividends = filterDividendIncomes(portfolios);
            const payouts = filterPayoutIncomes(others);
            const leases = filterLeaseIncomes(vehicles);
            const rentals = filterRentalIncomes(properties);

            addSheet(incomesList, 'Incomes');
            addSheet(coupons, 'Coupons');
            addSheet(dividends, 'Dividends');
            addSheet(payouts, 'Payouts');
            addSheet(leases, 'Leases');
            addSheet(rentals, 'Rentals');

            const date = new Date();
            const timestamp = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
            const fileName = `Incomes_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, fileName);

            setSuccessMessage('Data exported successfully');
        }
        catch (error) {
            setErrorMessage('Error exporting data');
        };
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setSuccessMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
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
                            Portfolio
                        </Link>
                        <Typography color="textPrimary">Incomes</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceIcon sx={{ mr: 1 }} />
                                My Incomes {'( '}For, {formatMonthYear(new Date())} {')'}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<InsertDriveFileIcon />}
                                    onClick={handleExportToExcel}
                                    sx={{ mr: 2 }}
                                >
                                    Download Income Data
                                </Button>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                            <IncomesGraph incomesData={incomesData}/>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AttachMoneyOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                        Income ({incomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Income) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetIncomeList ref={incomeListRef} onIncomesFetched={handleIncomesFetched} listAction={'Asset'} incomesList={incomes}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <HomeOutlinedIcon sx={{ mr: 1, color: 'blue' }} />
                                        Rental Income ({rentalIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Rental) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <RentalIncomeList propertiesList={properties}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1, color: 'green' }} />
                                        Lease Income ({leaseIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Lease) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LeaseIncomeList vehiclesList={vehicles}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <ShowChartIcon sx={{ mr: 1, color: 'red' }} />
                                        Dividend Income ({dividendIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Dividend) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DividendIncomeList portfoliosList={portfolios}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <ReceiptIcon sx={{ mr: 1, color: 'orange' }} />
                                        Coupon Income ({couponIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Coupon) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <CouponIncomeList portfoliosList={portfolios}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon sx={{ mr: 1, color: 'pink' }} />
                                        Payout Income ({payoutIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, incomesData? parseFloat(incomesData[0].Payout) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <PayoutIncomeList otherAssetsList={others}/>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Fab 
                color="secondary"
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 16, right: 16, width: 70, height: 70 }} 
                onClick={handleFormModalOpen}
            >
                <AddIcon sx={{ fontSize: 40 }} />
            </Fab>
            {/* <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', mt: '350px', mr: '48px' }}
            >
                <Box sx={{ width: 400, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Asset
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Income')}
                        >
                            <AttachMoneyOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Income</Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal> */}
            <Modal
                open={formModalOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleFormModalClose();
                    }
                }}
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
                    <AssetIncomeForm income={null} action={action} onClose={handleFormModalClose} refreshIncomeList={handleIncomeAdded} />
                    <IconButton 
                        onClick={handleFormModalClose} 
                        sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 24, 
                            border: '1px solid', 
                            borderColor: 'grey.500' 
                        }}
                    >
                        <CloseIconFilled />
                    </IconButton>
                </Box>
            </Modal>
        </Box>
    );
};

export default Incomes;