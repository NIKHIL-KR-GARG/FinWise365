import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, CircularProgress, Button, Snackbar, Alert } from '@mui/material'; // Added CircularProgress
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; 
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import AssetPropertyList from '../../components/assetspage/properties/AssetPropertyList'; 
import AssetPropertyForm from '../../components/assetspage/properties/AssetPropertyForm';
import AssetVehicleList from '../../components/assetspage/vehicles/AssetVehicleList';
import AssetVehicleForm from '../../components/assetspage/vehicles/AssetVehicleForm';
import AssetsGraph from '../../components/assetspage/AssetsGraph';
import AssetAccountForm from '../../components/assetspage/accounts/AssetAccountForm';
import AssetAccountList from '../../components/assetspage/accounts/AssetAccountList';
import AssetDepositList from '../../components/assetspage/deposits/AssetDepositList';
import AssetDepositForm from '../../components/assetspage/deposits/AssetDepositForm';
import AssetPortfolioList from '../../components/assetspage/portfolios/AssetPortfolioList';
import AssetPortfolioForm from '../../components/assetspage/portfolios/AssetPortfolioForm';
import AssetOtherList from '../../components/assetspage/others/AssetOtherList';
import AssetOtherForm from '../../components/assetspage/others/AssetOtherForm';

import { propertyAssetValue, vehicleAssetValue, accountAssetValue, depositAssetValue, portfolioAssetValue, otherAssetValue } from '../../components/calculators/Assets';
import { FormatCurrency } from  '../../components/common/FormatCurrency';
import { formatMonthYear } from '../../components/common/DateFunctions';
import { today } from '../../components/common/DateFunctions';

import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

import { filterAccounts } from '../../components/assetspage/accounts/AssetAccountList';
import { filterDeposits } from '../../components/assetspage/deposits/AssetDepositList';
import { filterPortfolios } from '../../components/assetspage/portfolios/AssetPortfolioList';
import { filterAssetOthers } from '../../components/assetspage/others/AssetOtherList';
import { filterAssetProperties } from '../../components/assetspage/properties/AssetPropertyList';
import { filterVehicles } from '../../components/assetspage/vehicles/AssetVehicleList';

const Assets = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalHeight, setModalHeight] = useState(0);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Asset'); // State for action
    const [assetAction, setAssetAction] = useState(''); // State for action
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const propertyListRef = useRef(null);
    const vehicleListRef = useRef(null);
    const accountListRef = useRef(null);
    const depositListRef = useRef(null);
    const portfolioListRef = useRef(null);
    const otherListRef = useRef(null);

    const [propertyCount, setPropertyCount] = useState(0); // State for property count
    const [vehicleCount, setVehicleCount] = useState(0); // State for vehicle count
    const [accountCount, setAccountCount] = useState(0); // State for account count
    const [depositCount, setDepositCount] = useState(0); // State for deposit count
    const [portfolioCount, setPortfolioCount] = useState(0); // State for portfolio count
    const [otherCount, setOtherCount] = useState(0); // State for other count

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [properties, setProperties] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [others, setOthers] = useState([]);

    const [assetsData, setAssetsData] = useState([]);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');

    useEffect(() => {
        if (propertyListRef.current) {
            setPropertyCount(propertyListRef.current.getPropertyCount());
        }
        if (vehicleListRef.current) {
            setVehicleCount(vehicleListRef.current.getVehicleCount());
        }
        if (accountListRef.current) {
            setAccountCount(accountListRef.current.getAccountCount());
        }
        if (depositListRef.current) {
            setDepositCount(depositListRef.current.getDepositCount());
        }
        if (portfolioListRef.current) {
            setPortfolioCount(portfolioListRef.current.getPortfolioCount());
        }
        if (otherListRef.current) {
            setOtherCount(otherListRef.current.getOtherCount());
        }
    }, []);

    useEffect(() => {
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList(updatedProperty, successMsg);
            setPropertyCount(propertyCount + 1);
        }
        if (vehicleListRef.current) {
            vehicleListRef.current.refreshVehicleList(updatedVehicle, successMsg);
            setVehicleCount(vehicleCount + 1);
        }
        if (accountListRef.current) {
            accountListRef.current.refreshAccountList(updatedAccount, successMsg);
            setAccountCount(accountCount + 1);
        }
        if (depositListRef.current) {
            depositListRef.current.refreshDepositList(updatedDeposit, successMsg);
            setDepositCount(depositCount + 1);
        }
        if (portfolioListRef.current) {
            portfolioListRef.current.refreshPortfolioList(updatedPortfolio, successMsg);
            setPortfolioCount(portfolioCount + 1);
        }
        if (otherListRef.current) {
            otherListRef.current.refreshOtherList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch all the data
                const [propertiesResponse, vehiclesResponse, accountsResponse, 
                    depositsResponse, portfoliosResponse, 
                    othersResponse] = await Promise.all([
                    axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_accounts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_deposits?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                ]);

                // set state for all the lists
                setProperties(propertiesResponse.data);
                setVehicles(vehiclesResponse.data);
                setAccounts(accountsResponse.data);
                setDeposits(depositsResponse.data);
                setPortfolios(portfoliosResponse.data);
                setOthers(othersResponse.data);

                const today = new Date();

                // get value of all the properties as of today/this month
                let propertyAssetsValue = 0.0;
                for (let i = 0; i < propertiesResponse.data.length; i++) {
                    const property = propertiesResponse.data[i];
                    propertyAssetsValue += parseFloat(propertyAssetValue(property, today, currentUserBaseCurrency));
                }

                // get value of all the vehicles as of today/this month
                let vehicleAssetsValue = 0.0;
                for (let i = 0; i < vehiclesResponse.data.length; i++) {
                    const vehicle = vehiclesResponse.data[i];
                    vehicleAssetsValue += parseFloat(vehicleAssetValue(vehicle, today, currentUserBaseCurrency));
                }

                // get value of all the accounts as of today/this month
                let accountAssetsValue = 0.0;
                for (let i = 0; i < accountsResponse.data.length; i++) {
                    const account = accountsResponse.data[i];
                    accountAssetsValue += parseFloat(accountAssetValue(account, today, currentUserBaseCurrency));
                }

                // get value of all the deposits as of today/this month
                let depositAssetsValue = 0.0;
                for (let i = 0; i < depositsResponse.data.length; i++) {
                    const deposit = depositsResponse.data[i];
                    depositAssetsValue += parseFloat(depositAssetValue(deposit, today, currentUserBaseCurrency));
                }

                // get value of all the portfolios as of today/this month
                let portfolioAssetsValue = 0.0;
                for (let i = 0; i < portfoliosResponse.data.length; i++) {
                    const portfolio = portfoliosResponse.data[i];
                    portfolioAssetsValue += parseFloat(portfolioAssetValue(portfolio, today, currentUserBaseCurrency));
                }

                // get value of all the other assets as of today/this month
                let otherAssetsValue = 0.0;
                for (let i = 0; i < othersResponse.data.length; i++) {
                    const other = othersResponse.data[i];
                    otherAssetsValue += parseFloat(otherAssetValue(other, today, currentUserBaseCurrency));
                }

                setAssetsData([
                    {
                        name: 'Assets',
                        Properties: parseFloat(propertyAssetsValue).toFixed(2),
                        Vehicles: parseFloat(vehicleAssetsValue).toFixed(2),
                        Accounts: parseFloat(accountAssetsValue).toFixed(2),
                        Deposits: parseFloat(depositAssetsValue).toFixed(2),
                        Portfolios: parseFloat(portfolioAssetsValue).toFixed(2),
                        Others: parseFloat(otherAssetsValue).toFixed(2)
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
                            <Typography color="textPrimary">Assets</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountBalanceIcon sx={{ mr: 1 }} />
                                    My Assets {'( '}As Of, {formatMonthYear(new Date())} {')'}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<InsertDriveFileIcon />}
                                        sx={{ mr: 2 }}
                                    >
                                        Download Assets Data
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

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleFormModalOpen = (type) => {
        setAction('Add');
        setAssetAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setAssetAction('');
        setAction('Asset');
    };

    const handlePropertyAdded = (updatedProperty, successMsg) => {
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList(updatedProperty, successMsg);
            setPropertyCount(propertyCount + 1);
        }
    };
    const handleVehicleAdded = (updatedVehicle, successMsg) => {
        if (vehicleListRef.current) {
            vehicleListRef.current.refreshVehicleList(updatedVehicle, successMsg);
            setVehicleCount(vehicleCount + 1);
        }
    };
    const handleAccountAdded = (updatedAccount, successMsg) => {
        if (accountListRef.current) {
            accountListRef.current.refreshAccountList(updatedAccount, successMsg);
            setAccountCount(accountCount + 1);
        }
    };
    const handleDepositAdded = (updatedDeposit, successMsg) => {
        if (depositListRef.current) {
            depositListRef.current.refreshDepositList(updatedDeposit, successMsg);
            setDepositCount(depositCount + 1);
        }
    };
    const handlePortfolioAdded = (updatedPortfolio, successMsg) => {
        if (portfolioListRef.current) {
            portfolioListRef.current.refreshPortfolioList(updatedPortfolio, successMsg);
            setPortfolioCount(portfolioCount + 1);
        }
    };
    const handleOtherAdded = (updatedOther, successMsg) => {
        if (otherListRef.current) {
            otherListRef.current.refreshOtherList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
        }
    };
    
    const handlePropertiesFetched = (count) => {
        setPropertyCount(count);
   };
    const handleVehiclesFetched = (count) => {
        setVehicleCount(count);
    };
    const handleAccountsFetched = (count) => {
        setAccountCount(count);
    };
    const handleDepositsFetched = (count) => {
        setDepositCount(count);
    };
    const handlePortfoliosFetched = (count) => {
        setPortfolioCount(count);
    };
    const handleOthersFetched = (count) => {
        setOtherCount(count);
    };

    const handleExportToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            const addSheet = (data, sheetName) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            };

            const propertyList = filterAssetProperties('Asset', properties, false);
            const vehicleList = filterVehicles('Asset', vehicles, false);
            const accountList = filterAccounts('Asset', accounts, false);
            const depositList = filterDeposits('Asset', deposits, false);
            const portfolioList = filterPortfolios('Asset', portfolios, false);
            const otherList = filterAssetOthers('Asset', others, false);

            addSheet(propertyList, 'Properties');
            addSheet(vehicleList, 'Vehicles');
            addSheet(accountList, 'Accounts');
            addSheet(depositList, 'Deposits');
            addSheet(portfolioList, 'Portfolios');
            addSheet(otherList, 'Others');

            const date = new Date();
            const timestamp = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
            const fileName = `Assets_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, fileName);

            setSuccessMessage('Data exported successfully');
        }
        catch (error) {
            setErrorMessage('Error exporting data: ' + error);
        };
    };

    const modalRefCallback = (node) => {
        if (node !== null) {
            const { height } = node.getBoundingClientRect();
            setModalHeight(height);
        }
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
                        <Typography color="textPrimary">Assets</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceIcon sx={{ mr: 1 }} />
                                My Assets {'( '}As Of, {formatMonthYear(new Date())} {')'}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<InsertDriveFileIcon />}
                                    onClick={handleExportToExcel}
                                    sx={{ mr: 2 }}
                                >
                                    Download Assets Data
                                </Button>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                            <AssetsGraph assetsData={assetsData}/>
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
                                        <BusinessOutlinedIcon sx={{ mr: 1, color: 'blue' }} />
                                        Properties ({propertyCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Properties) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} listAction={'Asset'} propertiesList={properties}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarOutlinedIcon sx={{ mr: 1, color: 'green' }} />
                                        Vehicles ({vehicleCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Vehicles) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetVehicleList ref={vehicleListRef} onVehiclesFetched={handleVehiclesFetched} listAction={'Asset'} vehiclesList={vehicles}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AccountBalanceOutlinedIcon sx={{ mr: 1, color: 'red' }} />
                                        Savings/Current Accounts ({accountCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Accounts) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetAccountList ref={accountListRef} onAccountsFetched={handleAccountsFetched} listAction={'Asset'} accountsList={accounts}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <SavingsOutlinedIcon sx={{ mr: 1, color: 'brown' }} /> 
                                        Fixed/Recurring Deposits ({depositCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Deposits) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetDepositList ref={depositListRef} onDepositsFetched={handleDepositsFetched} listAction={'Asset'} depositsList={deposits}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4a-content"
                                    id="panel4a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <ShowChartOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                        Investment Portfolio ({portfolioCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Portfolios) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetPortfolioList ref={portfolioListRef} onPortfoliosFetched={handlePortfoliosFetched} listAction={'Asset'} portfoliosList={portfolios}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel11a-content"
                                    id="panel11a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <FolderSpecialOutlinedIcon sx={{ mr: 1, color: 'brown' }} />
                                        Other Assets ({otherCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, assetsData? parseFloat(assetsData[0].Others) : 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetOtherList ref={otherListRef} onOthersFetched={handleOthersFetched} listAction={'Asset'} othersList={others}/>
                                </AccordionDetails>
                            </Accordion>
                            {/*
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel7a-content"
                                    id="panel7a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <SecurityOutlinedIcon sx={{ mr: 1, color: 'cyan' }} />
                                        Investment-ULIP
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    // Add Investment-ULIP details component or content here //
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel8a-content"
                                    id="panel8a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AccountBalanceWalletOutlinedIcon sx={{ mr: 1, color: 'magenta' }} />
                                        SRS
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    // Add Investment-SRS details component or content here //
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel8a-content"
                                    id="panel8a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AccountBalanceWalletOutlinedIcon sx={{ mr: 1, color: 'magenta' }} />
                                        PPF
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    // Add Investment-PPF details component or content here //
                                </AccordionDetails>
                            </Accordion> */}
                            {/* <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, bgcolor: 'lightgrey' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel9a-content"
                                    id="panel9a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DiamondOutlinedIcon sx={{ mr: 1, color: 'red' }} />
                                        Precious Metals
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
                                        Precious Metals asset feature coming soon... 
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, bgcolor: 'lightgrey' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel9a-content"
                                    id="panel9a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <SavingsOutlinedIcon sx={{ mr: 1, color: 'lime' }} />
                                        Pension Plan
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
                                        Pension Plan asset feature coming soon... 
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, bgcolor: 'lightgrey' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel10a-content"
                                    id="panel10a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AssignmentOutlinedIcon sx={{ mr: 1, color: 'teal' }} />
                                        Endowment Plan
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
                                        Endowment Plan asset feature coming soon... 
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> */}
                            {/* <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel12a-content"
                                    id="panel12a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AccountBoxOutlinedIcon sx={{ mr: 1, color: 'grey' }} />
                                        CPF
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    Add Investment-CPF details component or content here
                                </AccordionDetails>
                            </Accordion> */}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Fab 
                color="secondary"
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 16, right: 16, width: 70, height: 70 }} 
                onClick={handleModalOpen}
            >
                <AddIcon sx={{ fontSize: 40 }} />
            </Fab>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', mt: `calc(100vh - ${modalHeight + 70}px)`, mr: '70px' }}
            >
                <Box ref={modalRefCallback} sx={{ width: 400, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Asset
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Property')}
                        >
                            <BusinessOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Property</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Vehicle')}
                        >
                            <DirectionsCarOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Vehicle</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Account')}
                        >
                            <AccountBalanceOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Account</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Deposit')}
                        >
                            <SavingsOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Deposit</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Portfolio')}
                        >
                            <ShowChartOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Portfolio</Typography>
                        </Box>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <SecurityOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>ULIP</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <AccountBalanceWalletOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>SRS</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <AccountBalanceWalletOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>PPF</Typography>
                        </Box>*/}
                         <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Other')}
                        >
                            <FolderSpecialOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Asset</Typography>
                        </Box>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <DiamondOutlinedIcon sx={{ color: 'white' }} /> 
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Precious Metals</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <SavingsOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Pension Plan</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <AssignmentOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Endowment Plan</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                            <AccountBoxOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>CPF</Typography>
                        </Box> */}
                    </Box>
                </Box>
            </Modal>
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
                    {assetAction === 'Add Property' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )}
                    {assetAction === 'Add Vehicle' && (
                        <AssetVehicleForm vehicle={null} action={action} onClose={handleFormModalClose} refreshVehicleList={handleVehicleAdded} />
                    )}
                    {assetAction === 'Add Account' && (
                        <AssetAccountForm account={null} action={action} onClose={handleFormModalClose} refreshAccountList={handleAccountAdded} />
                    )}
                    {assetAction === 'Add Deposit' && (
                        <AssetDepositForm deposit={null} action={action} onClose={handleFormModalClose} refreshDepositList={handleDepositAdded} />
                    )}
                    {assetAction === 'Add Portfolio' && (
                        <AssetPortfolioForm portfolio={null} action={action} onClose={handleFormModalClose} refreshPortfolioList={handlePortfolioAdded} />
                    )}
                    {assetAction === 'Add Other' && (
                        <AssetOtherForm other={null} action={action} onClose={handleFormModalClose} refreshOtherList={handleOtherAdded} />
                    )}
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

export default Assets;