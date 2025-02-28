import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, Button, Snackbar, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SavingsIcon from '@mui/icons-material/Savings'; // New icon for SIPs
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // New icon for EMIs
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // New icon for Taxes

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import ExpenseHomeList from '../../components/expensespage/homes/ExpenseHomeList';
import ExpenseHomeForm from '../../components/expensespage/homes/ExpenseHomeForm';
import ExpensePropertyList from '../../components/expensespage/properties/ExpensePropertyList';
import ExpensePropertyForm from '../../components/expensespage/properties/ExpensePropertyForm';
import ExpenseCreditCardDebtList from '../../components/expensespage/creditcarddebts/ExpenseCreditCardDebtList';
import ExpenseCreditCardDebtForm from '../../components/expensespage/creditcarddebts/ExpenseCreditCardDebtForm';
import ExpensePersonalLoanList from '../../components/expensespage/personalloans/ExpensePersonalLoanList';
import ExpensePersonalLoanForm from '../../components/expensespage/personalloans/ExpensePersonalLoanForm';
import ExpenseOtherList from '../../components/expensespage/others/ExpenseOtherList';
import ExpenseOtherForm from '../../components/expensespage/others/ExpenseOtherForm';
import ExpensesGraph from '../../components/expensespage/ExpensesGraph';
import EMIList from '../../components/expensespage/emis/EMIList';
import SIPList from '../../components/expensespage/sips/SIPList';
import TaxList from '../../components/expensespage/taxes/TaxList';
import MortgageAndLoanList from '../../components/expensespage/mortgageandloans/MortgageAndLoanList';

import { homeExpense, propertyExpense, creditCardDebtExpense, personalLoanExpense, otherExpense, emiExpenseProperty, emiExpenseVehicle, sipExpenseDeposit, sipExpensePortfolio, sipExpenseOtherAsset, taxExpenseProperty, maintananeExpenseProperty, otherExpenseVehicle } from '../../components/calculators/Expenses';
import { FormatCurrency } from  '../../components/common/FormatCurrency';
import { formatMonthYear } from '../../components/common/DateFunctions';
import { today } from '../../components/common/DateFunctions';

import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

import { filterCreditCardDebts } from '../../components/expensespage/creditcarddebts/ExpenseCreditCardDebtList';
import { filterPersonalLoans } from '../../components/expensespage/personalloans/ExpensePersonalLoanList';
import { filterExpenseOthers, filterOthersVehicleExpense } from '../../components/expensespage/others/ExpenseOtherList';
import { filterExpenseProperties, filterPropertiesMaintenance } from '../../components/expensespage/properties/ExpensePropertyList';
import { filterHomes } from '../../components/expensespage/homes/ExpenseHomeList';
import { fetchPropertyEMIs, fetchVehicleEMIs } from '../../components/expensespage/emis/EMIList';
import { fetchDepositSIPs, fetchPortfolioSIPs, fetchOtherSIPs } from '../../components/expensespage/sips/SIPList';
import { fetchTaxes } from '../../components/expensespage/taxes/TaxList';
import { fetchPropertyMortgageAndLoans, fetchVehicleMortgageAndLoans } from '../../components/expensespage/mortgageandloans/MortgageAndLoanList';

import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const Expenses = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const [open, setOpen] = useState(isMobile ? false : true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalHeight, setModalHeight] = useState(0);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Expense'); // State for action
    const [expenseAction, setExpenseAction] = useState(''); // State for action

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const homeListRef = useRef(null);
    const propertyListRef = useRef(null);
    const creditCardDebtListRef = useRef(null);
    const personalLoanListRef = useRef(null);
    const otherListRef = useRef(null);
    const emiListRef = useRef(null);
    const sipListRef = useRef(null);
    const taxListRef = useRef(null);
    const mortgageAndLoanListRef = useRef(null);

    const [homeCount, setHomeCount] = useState(0);
    const [propertyCount, setPropertyCount] = useState(0);
    const [creditCardDebtCount, setCreditCardDebtCount] = useState(0);
    const [personalLoanCount, setPersonalLoanCount] = useState(0);
    const [otherCount, setOtherCount] = useState(0);
    const [emiCount, setEMICount] = useState(0);
    const [sipCount, setSIPCount] = useState(0);
    const [taxCount, setTaxCount] = useState(0);
    const [mortgageAndLoanCount, setMortgageAndLoanCount] = useState(0);
    const [mortgageAndLoanAmount, setMortgageAndLoanAmount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [homes, setHomes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [creditCardDebts, setCreditCardDebts] = useState([]);
    const [personalLoans, setPersonalLoans] = useState([]);
    const [otherExpenses, setOtherExpenses] = useState([]);
    const [assetProperties, setAssetProperties] = useState([]);
    const [assetVehicles, setAssetVehicles] = useState([]);
    const [assetDeposits, setAssetDeposits] = useState([]);
    const [assetPortfolios, setAssetPortfolios] = useState([]);
    const [assetOthers, setAssetOthers] = useState([]);

    const [expensesData, setExpensesData] = useState([]);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');

    const updateHomeExpenses = () => {
        const today = new Date();
        let homeExpenses = 0.0;
        for (let i = 0; i < homes.length; i++) {
            let home = homes[i];
            homeExpenses += parseFloat(homeExpense(home, today, currentUserBaseCurrency));
        }
        setExpensesData(prevData => {
            const newData = prevData.map(expense => 
                expense.name === 'Home Expenses' ? { ...expense, value: parseFloat(homeExpenses.toFixed(2)) } : expense
            );
            return newData;
        });
    };

    const updatePropertyExpenses = () => {
        const today = new Date();
        let propertyExpenses = 0.0;
        for (let i = 0; i < properties.length; i++) {
            let property = properties[i];
            propertyExpenses += parseFloat(propertyExpense(property, today, currentUserBaseCurrency));
        }
        for (let i = 0; i < assetProperties.length; i++) {
            let property = assetProperties[i];
            propertyExpenses += parseFloat(maintananeExpenseProperty(property, today, currentUserBaseCurrency));
        }
        setExpensesData(prevData => {
            const newData = prevData.map(expense => 
                expense.name === 'Property Expenses' ? { ...expense, value: parseFloat(propertyExpenses.toFixed(2)) } : expense
            );
            return newData;
        });
    };

    const updateCreditCardDebtExpenses = () => {
        const today = new Date();
        let creditCardDebtExpenses = 0.0;
        for (let i = 0; i < creditCardDebts.length; i++) {
            let creditCardDebt = creditCardDebts[i];
            creditCardDebtExpenses += parseFloat(creditCardDebtExpense(creditCardDebt, today, currentUserBaseCurrency));
        }
        setExpensesData(prevData => {
            const newData = prevData.map(expense => 
                expense.name === 'Credit Card Debt Expenses' ? { ...expense, value: parseFloat(creditCardDebtExpenses.toFixed(2)) } : expense
            );
            return newData;
        });
    };

    const updatePersonalLoanExpenses = () => {
        const today = new Date();
        let personalLoanExpenses = 0.0;
        for (let i = 0; i < personalLoans.length; i++) {
            let personalLoan = personalLoans[i];
            personalLoanExpenses += parseFloat(personalLoanExpense(personalLoan, today, currentUserBaseCurrency));
        }
        setExpensesData(prevData => {
            const newData = prevData.map(expense => 
                expense.name === 'Personal Loan Expenses' ? { ...expense, value: parseFloat(personalLoanExpenses.toFixed(2)) } : expense
            );
            return newData;
        });
    };

    const updateOtherExpenses = () => {
        const today = new Date();
        let otherExpensesValue = 0.0;
        for (let i = 0; i < otherExpenses.length; i++) {
            let other = otherExpenses[i];
            otherExpensesValue += parseFloat(otherExpense(other, today, currentUserBaseCurrency));
        }
        for (let i = 0; i < assetVehicles.length; i++) {
            let vehicle = assetVehicles[i];
            otherExpensesValue += parseFloat(otherExpenseVehicle(vehicle, today, currentUserBaseCurrency));
        }
        setExpensesData(prevData => {
            const newData = prevData.map(expense => 
                expense.name === 'Other Expenses' ? { ...expense, value: parseFloat(otherExpensesValue.toFixed(2)) } : expense
            );
            return newData;
        });
    };

    useEffect(() => {
        if (homeListRef.current) {
            setHomeCount(homeListRef.current.getHomeCount());
        }
        if (propertyListRef.current) {
            setPropertyCount(propertyListRef.current.getPropertyCount());
        }
        if (creditCardDebtListRef.current) {
            setCreditCardDebtCount(creditCardDebtListRef.current.getCreditCardDebtCount());
        }
        if (personalLoanListRef.current) {
            setPersonalLoanCount(personalLoanListRef.current.getPersonalLoanCount());
        }
        if (otherListRef.current) {
            setOtherCount(otherListRef.current.getOtherCount());
        }
        if (emiListRef.current) {
            setEMICount(emiListRef.current.getEMICount());
        }
        if (sipListRef.current) {
            setSIPCount(sipListRef.current.getSIPCount());
        }
        if (taxListRef.current) {
            setTaxCount(taxListRef.current.getTaxCount());
        }
        if (mortgageAndLoanListRef.current) {
            setMortgageAndLoanCount(mortgageAndLoanListRef.current.getMortgageAndLoanCount());
            setMortgageAndLoanAmount(mortgageAndLoanListRef.current.getMortgageAndLoanAmount());
        }
    }, []);

    useEffect(() => {
        if (homeListRef.current) {
            homeListRef.current.refreshHomeList();
            setHomeCount(homeCount + 1);
        }
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList();
            setPropertyCount(propertyCount + 1);
        }  
        if (creditCardDebtListRef.current) {
            creditCardDebtListRef.current.refreshCreditCardDebtList();
            setCreditCardDebtCount(creditCardDebtCount + 1);
        }
        if (personalLoanListRef.current) {
            personalLoanListRef.current.refreshPersonalLoanList();
            setPersonalLoanCount(personalLoanCount + 1);
        }
        if (otherListRef.current) {
            otherListRef.current.refreshOtherList();
            setOtherCount(otherCount + 1);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch all the data
                const [homesResponse, propertiesResponse, creditCardDebtsResponse, 
                    personalLoansResponse, othersResponse, assetPropertiesResponse,
                    assetVehiclesResponse, assetDepositsResponse, assetPortfoliosResponse,
                    assetOthersResponse] = await Promise.all([
                    axios.get(`/api/expense_homes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_personal_loans?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_deposits?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                ]);

                // set state for all the lists
                setHomes(homesResponse.data);
                setProperties(propertiesResponse.data);
                setCreditCardDebts(creditCardDebtsResponse.data);
                setPersonalLoans(personalLoansResponse.data);
                setOtherExpenses(othersResponse.data);
                setAssetProperties(assetPropertiesResponse.data);
                setAssetVehicles(assetVehiclesResponse.data);
                setAssetDeposits(assetDepositsResponse.data);
                setAssetPortfolios(assetPortfoliosResponse.data);
                setAssetOthers(assetOthersResponse.data);

                const today = new Date();
                // get all the home expenses for the current month
                let homeExpenses = 0.0;
                for (let i = 0; i < homesResponse.data.length; i++) {
                    let home = homesResponse.data[i];
                    homeExpenses += parseFloat(homeExpense(home, today, currentUserBaseCurrency));
                }

                // get all the property expenses for the current month
                let propertyExpenses = 0.0;
                for (let i = 0; i < propertiesResponse.data.length; i++) {
                    let property = propertiesResponse.data[i];
                    propertyExpenses += parseFloat(propertyExpense(property, today, currentUserBaseCurrency));
                }
                // add maintenance from asset properties
                for (let i = 0; i < assetPropertiesResponse.data.length; i++) {
                    let property = assetPropertiesResponse.data[i];
                    propertyExpenses += parseFloat(maintananeExpenseProperty(property, today, currentUserBaseCurrency));
                }

                // get all the credit card debt expenses for the current month
                let creditCardDebtExpenses = 0.0;
                for (let i = 0; i < creditCardDebtsResponse.data.length; i++) {
                    let creditCardDebt = creditCardDebtsResponse.data[i];
                    creditCardDebtExpenses += parseFloat(creditCardDebtExpense(creditCardDebt, today, currentUserBaseCurrency));
                }

                // get all the personal loan expenses for the current month
                let personalLoanExpenses = 0.0;
                for (let i = 0; i < personalLoansResponse.data.length; i++) {
                    let personalLoan = personalLoansResponse.data[i];
                    personalLoanExpenses += parseFloat(personalLoanExpense(personalLoan, today, currentUserBaseCurrency));
                }

                // get all the other expenses for the current month
                let otherExpenses = 0.0;
                for (let i = 0; i < othersResponse.data.length; i++) {
                    let other = othersResponse.data[i];
                    otherExpenses += parseFloat(otherExpense(other, today, currentUserBaseCurrency));
                }
                // add monthly expense from asset vehicles
                for (let i = 0; i < assetVehiclesResponse.data.length; i++) {
                    let vehicle = assetVehiclesResponse.data[i];
                    otherExpenses += parseFloat(otherExpenseVehicle(vehicle, today, currentUserBaseCurrency));
                }
                
                // get all the emi expenses for the current month
                let emiExpenses = 0.0;
                for (let i = 0; i < assetPropertiesResponse.data.length; i++) {
                    let property = assetPropertiesResponse.data[i];
                    emiExpenses += parseFloat(emiExpenseProperty(property, today, currentUserBaseCurrency));
                }
                for (let i = 0; i < assetVehiclesResponse.data.length; i++) {
                    let vehicle = assetVehiclesResponse.data[i];
                    emiExpenses += parseFloat(emiExpenseVehicle(vehicle, today, currentUserBaseCurrency));
                }

                // get all the sip expenses for the current month
                let sipExpenses = 0.0;
                for (let i = 0; i < assetDepositsResponse.data.length; i++) {
                    let deposit = assetDepositsResponse.data[i];
                    sipExpenses += parseFloat(sipExpenseDeposit(deposit, today, currentUserBaseCurrency));
                }
                for (let i = 0; i < assetPortfoliosResponse.data.length; i++) {
                    let portfolio = assetPortfoliosResponse.data[i];
                    sipExpenses += parseFloat(sipExpensePortfolio(portfolio, today, currentUserBaseCurrency));
                }
                for (let i = 0; i < assetOthersResponse.data.length; i++) {
                    let other = assetOthersResponse.data[i];
                    sipExpenses += parseFloat(sipExpenseOtherAsset(other, today, currentUserBaseCurrency));
                }

                // get all the tax expenses for the current month
                let taxExpenses = 0.0;
                for (let i = 0; i < assetPropertiesResponse.data.length; i++) {
                    let property = assetPropertiesResponse.data[i];
                    taxExpenses += parseFloat(taxExpenseProperty(property, today, currentUserBaseCurrency));
                }

                // set the expenses list
                setExpensesData([
                    { name: 'Home Expenses', value: parseFloat(homeExpenses.toFixed(2)) },
                    { name: 'Property Expenses', value: parseFloat(propertyExpenses.toFixed(2)) },
                    { name: 'Credit Card Debt Expenses', value: parseFloat(creditCardDebtExpenses.toFixed(2)) },
                    { name: 'Personal Loan Expenses', value: parseFloat(personalLoanExpenses.toFixed(2)) },
                    { name: 'Other Expenses', value: parseFloat(otherExpenses.toFixed(2)) },
                    { name: 'EMI Expenses', value: parseFloat(emiExpenses.toFixed(2)) },
                    { name: 'SIP Expenses', value: parseFloat(sipExpenses.toFixed(2)) },
                    { name: 'Tax Expenses', value: parseFloat(taxExpenses.toFixed(2)) }
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
                <Box sx={{ display: 'flex', flexGrow: 1, mt: isMobile ? '128px' : '64px' }}>
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
                            <Typography color="textPrimary">Expenses</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MoneyOffIcon sx={{ mr: 1 }} />
                                    My Current Expenses {'( '}For, {formatMonthYear(new Date())} {')'}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<InsertDriveFileIcon />}
                                        sx={{ mr: 2 }}
                                    >
                                        Download Expense Data
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
        setExpenseAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setExpenseAction('');
        setAction('Expense');
    };

    const handleHomeAdded = (updatedHome, successMsg) => {
        if (homeListRef.current) {
            homeListRef.current.refreshHomeList(updatedHome, successMsg);
            setHomeCount(homeCount + 1);
            updateHomeExpenses();
        }
    };
    const handlePropertyAdded = (updatedProperty, successMsg) => {
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList(updatedProperty, successMsg);
            setPropertyCount(propertyCount + 1);
            updatePropertyExpenses();
        }
    };
    const handleCreditCardDebtAdded = (updatedCreditCardDebt, successMsg) => {
        if (creditCardDebtListRef.current) {
            creditCardDebtListRef.current.refreshCreditCardDebtList(updatedCreditCardDebt, successMsg);
            setCreditCardDebtCount(creditCardDebtCount + 1);
            updateCreditCardDebtExpenses();
        }
    };
    const handlePersonalLoanAdded = (updatedPersonalLoan, successMsg) => {
        if (personalLoanListRef.current) {
            personalLoanListRef.current.refreshPersonalLoanList(updatedPersonalLoan, successMsg);
            setPersonalLoanCount(personalLoanCount + 1);
            updatePersonalLoanExpenses();
        }
    };
    const handleOtherAdded = (updatedOther, successMsg) => {
        if (otherListRef.current) {
            otherListRef.current.refreshOtherList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
            updateOtherExpenses();
        }
    };

    const handleHomesFetched = (count) => {
        setHomeCount(count);
        updateHomeExpenses();
    };
    const handlePropertiesFetched = (count) => {
        setPropertyCount(count);
        updatePropertyExpenses();
    };
    const handleCreditCardDebtsFetched = (count) => {
        setCreditCardDebtCount(count);
        updateCreditCardDebtExpenses();
    };
    const handlePersonalLoansFetched = (count) => {
        setPersonalLoanCount(count);
        updatePersonalLoanExpenses();
    };
    const handleOthersFetched = (count) => {
        setOtherCount(count);
        updateOtherExpenses();
    };
    const handleEMIsFetched = (count) => {
        setEMICount(count);
    };
    const handleSIPsFetched = (count) => {
        setSIPCount(count);
    };
    const handleTaxesFetched = (count) => {
        setTaxCount(count);
    };
    const handleMortgageAndLoansFetched = (count, amount) => {
        setMortgageAndLoanCount(count);
        setMortgageAndLoanAmount(amount);
    };

    const handleExportToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            const addSheet = (data, sheetName) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            };

            const creditCardDebtList = filterCreditCardDebts('Expense', creditCardDebts, false);
            const personalLoanList = filterPersonalLoans('Expense', personalLoans, false);
            const others = filterExpenseOthers('Expense', otherExpenses, false).concat(filterOthersVehicleExpense(assetVehicles));
            const propertiesList = filterExpenseProperties('Expense', properties, false).concat(filterPropertiesMaintenance(assetProperties));
            const homesList = filterHomes('Expense', homes, false);
            const emis = fetchPropertyEMIs(assetProperties, false).concat(fetchVehicleEMIs(assetVehicles, false));
            const sips = fetchDepositSIPs(assetDeposits, false).concat(fetchPortfolioSIPs(assetPortfolios, false)).concat(fetchOtherSIPs(assetOthers, false));
            const taxes = fetchTaxes(assetProperties, false);
            const mortgageAndLoans = fetchPropertyMortgageAndLoans(assetProperties, false).concat(fetchVehicleMortgageAndLoans(assetVehicles, false));

            addSheet(creditCardDebtList, 'Credit Card Debts');
            addSheet(personalLoanList, 'Personal Loans');
            addSheet(others, 'Other Expenses');
            addSheet(propertiesList, 'Properties');
            addSheet(homesList, 'Homes');
            addSheet(emis, 'EMIs');
            addSheet(sips, 'SIPs');
            addSheet(taxes, 'Taxes');  
            addSheet(mortgageAndLoans, 'Mortgage & Loans');

            const date = new Date();
            const timestamp = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
            const fileName = `Expenses_${timestamp}.xlsx`;

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
            <Box sx={{ display: 'flex', flexGrow: 1, mt: isMobile ? '128px' : '64px' }}>
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
                        <Typography color="textPrimary">Expenses</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MoneyOffIcon sx={{ mr: 1 }} />
                                My Current Expenses {'( '}For, {formatMonthYear(new Date())} {')'}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<InsertDriveFileIcon />}
                                    onClick={handleExportToExcel}
                                    sx={{ mr: 2 }}
                                >
                                    Download Expense Data
                                </Button>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                            <ExpensesGraph expensesData={expensesData}/>
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
                                        <HomeIcon sx={{ mr: 1, color: 'blue' }} />
                                        Home Expenses ({homeCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Home Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpenseHomeList ref={homeListRef} onHomesFetched={handleHomesFetched} listAction={'Expense'} homesList={homes}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <ApartmentIcon sx={{ mr: 1, color: 'red' }} />
                                        Property Expenses ({propertyCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Property Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpensePropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} listAction={'Expense'} propertiesList={properties} assetPropertiesList={assetProperties}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <CreditCardIcon sx={{ mr: 1, color: 'yellow' }} />
                                        Credit Card Debts ({creditCardDebtCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Credit Card Debt Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpenseCreditCardDebtList ref={creditCardDebtListRef} onCreditCardDebtsFetched={handleCreditCardDebtsFetched} listAction={'Expense'} creditcarddebtsList={creditCardDebts}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, color: 'teal' }} />
                                        Personal Loans ({personalLoanCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Personal Loan Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpensePersonalLoanList ref={personalLoanListRef} onPersonalLoansFetched={handlePersonalLoansFetched} listAction={'Expense'} personalloansList={personalLoans}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <MiscellaneousServicesIcon sx={{ mr: 1, color: 'green' }} />
                                        Other Expenses ({otherCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Other Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpenseOtherList ref={otherListRef} onOthersFetched={handleOthersFetched} othersList={otherExpenses} listAction={'Expense'} vehiclesList={assetVehicles}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1, color: 'blue' }} /> {/* Updated color */}
                                        Current Mortgage & Loans <em>&nbsp;(Derived automatically from Property/Vehicle Assets)</em>&nbsp;({mortgageAndLoanCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(mortgageAndLoanAmount))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <MortgageAndLoanList ref={mortgageAndLoanListRef} onMortgageAndLoansFetched={handleMortgageAndLoansFetched} propertiesList={assetProperties} vehiclesList={assetVehicles}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1, color: 'blue' }} /> {/* Updated color */}
                                        Current EMI's <em>&nbsp;(Derived automatically from Property/Vehicle Assets)</em>&nbsp;({emiCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'EMI Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <EMIList ref={emiListRef} onEMIsFetched={handleEMIsFetched} showDreams={false} propertiesList={assetProperties} vehiclesList={assetVehicles} dreamsList={null}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <SavingsIcon sx={{ mr: 1, color: 'purple' }} /> {/* Updated color */}
                                        Current SIP's <em>&nbsp;(Derived automatically from Investment Portfolios)</em>&nbsp;({sipCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'SIP Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SIPList ref={sipListRef} onSIPsFetched={handleSIPsFetched} showDreams={false} depositsList={assetDeposits} portfoliosList={assetPortfolios} otherAssetsList={assetOthers}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <AccountBalanceIcon sx={{ mr: 1, color: 'orange' }} /> {/* Updated color */}
                                        Taxes <em>&nbsp;(Derived automatically from Property Assets)</em>&nbsp;({taxCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Tax Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TaxList ref={taxListRef} onTaxesFetched={handleTaxesFetched} assetPropertiesList={assetProperties}/>
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
                <Box ref={modalRefCallback} sx={{ width: 325, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Expense
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Home Expense')}
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Home</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Property Expense')}
                        >
                            <ApartmentIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Property</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Credit Card Debt')}
                        >
                            <CreditCardIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Credit Card Debt</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Personal Loan')}
                        >
                            <PersonIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Personal Loan</Typography>
                        </Box>

                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Other Expense')}
                        >
                            <MiscellaneousServicesIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Expense</Typography>
                        </Box>
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
                    {expenseAction === 'Add Home Expense' && (
                        <ExpenseHomeForm home={null} action={action} onClose={handleFormModalClose} refreshHomeList={handleHomeAdded} />
                    )}
                    {expenseAction === 'Add Property Expense' && (
                        <ExpensePropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )}
                    {expenseAction === 'Add Credit Card Debt' && (
                        <ExpenseCreditCardDebtForm creditcarddebt={null} action={action} onClose={handleFormModalClose} refreshCreditCardDebtList={handleCreditCardDebtAdded} />
                    )}
                    {expenseAction === 'Add Personal Loan' && (
                        <ExpensePersonalLoanForm personalloan={null} action={action} onClose={handleFormModalClose} refreshPersonalLoanList={handlePersonalLoanAdded} />
                    )}
                    {expenseAction === 'Add Other Expense' && (
                        <ExpenseOtherForm other={null} action={action} onClose={handleFormModalClose} refreshOtherList={handleOtherAdded} />
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

export default Expenses;