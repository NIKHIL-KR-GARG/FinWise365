import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link } from '@mui/material';
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

import { homeExpense, propertyExpense, creditCardDebtExpense, personalLoanExpense, otherExpense, emiExpenseProperty, emiExpenseVehicle, sipExpenseDeposit, sipExpensePortfolio, sipExpenseOtherAsset, taxExpenseProperty, maintananeExpenseProperty, otherExpenseVehicle } from '../../components/calculators/Expenses';
import FormatCurrency from '../../components/common/FormatCurrency';

const Expenses = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState(''); // State for action
    const [expenseAction, setExpenseAction] = useState(''); // State for action

    const homeListRef = useRef(null);
    const propertyListRef = useRef(null);
    const creditCardDebtListRef = useRef(null);
    const personalLoanListRef = useRef(null);
    const otherListRef = useRef(null);
    const emiListRef = useRef(null);
    const sipListRef = useRef(null);
    const taxListRef = useRef(null);

    const [homeCount, setHomeCount] = useState(0);
    const [propertyCount, setPropertyCount] = useState(0);
    const [creditCardDebtCount, setCreditCardDebtCount] = useState(0);
    const [personalLoanCount, setPersonalLoanCount] = useState(0);
    const [otherCount, setOtherCount] = useState(0);
    const [emiCount, setEMICount] = useState(0);
    const [sipCount, setSIPCount] = useState(0);
    const [taxCount, setTaxCount] = useState(0);

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
    // const [emis, setEMIs] = useState([]);
    // const [sips, setSIPs] = useState([]);
    // const [taxes, setTaxes] = useState([]);   

    const [expensesData, setExpensesData] = useState([]);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

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
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch all the data
                const [homesResponse, propertiesResponse, creditCardDebtsResponse, 
                    personalLoansResponse, othersResponse, assetPropertiesResponse,
                    assetVehiclesResponse, assetDepositsResponse, assetPortfoliosResponse,
                    assetOthersResponse] = await Promise.all([
                    axios.get(`/api/expense_homes?user_id=${currentUserId}`),
                    axios.get(`/api/expense_properties?user_id=${currentUserId}`),
                    axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}`),
                    axios.get(`/api/expense_personal_loans?user_id=${currentUserId}`),
                    axios.get(`/api/expense_others?user_id=${currentUserId}`),
                    axios.get(`/api/asset_properties?user_id=${currentUserId}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}`),
                    axios.get(`/api/asset_deposits?user_id=${currentUserId}`),
                    axios.get(`/api/asset_portfolios?user_id=${currentUserId}`),
                    axios.get(`/api/asset_others?user_id=${currentUserId}`)
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
        return <CircularProgress />;
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
        setAction('');
    };

    const handleHomeAdded = (updatedHome, successMsg) => {
        if (homeListRef.current) {
            homeListRef.current.refreshHomeList(updatedHome, successMsg);
            setHomeCount(homeCount + 1);
        }
    };
    const handlePropertyAdded = (updatedProperty, successMsg) => {
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList(updatedProperty, successMsg);
            setPropertyCount(propertyCount + 1);
        }
    };
    const handleCreditCardDebtAdded = (updatedCreditCardDebt, successMsg) => {
        if (creditCardDebtListRef.current) {
            creditCardDebtListRef.current.refreshCreditCardDebtList(updatedCreditCardDebt, successMsg);
            setCreditCardDebtCount(creditCardDebtCount + 1);
        }
    };
    const handlePersonalLoanAdded = (updatedPersonalLoan, successMsg) => {
        if (personalLoanListRef.current) {
            personalLoanListRef.current.refreshPersonalLoanList(updatedPersonalLoan, successMsg);
            setPersonalLoanCount(personalLoanCount + 1);
        }
    };
    const handleOtherAdded = (updatedOther, successMsg) => {
        if (otherListRef.current) {
            otherListRef.current.refreshOtherList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
        }
    };

    const handleHomesFetched = (count) => {
        setHomeCount(count);
    };
    const handlePropertiesFetched = (count) => {
        setPropertyCount(count);
    };
    const handleCreditCardDebtsFetched = (count) => {
        setCreditCardDebtCount(count);
    };
    const handlePersonalLoansFetched = (count) => {
        setPersonalLoanCount(count);
    };
    const handleOthersFetched = (count) => {
        setOtherCount(count);
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

    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace(/ /g, '-');

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
                            Portfolio
                        </Link>
                        <Typography color="textPrimary">Expenses</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MoneyOffIcon sx={{ mr: 1 }} />
                                My Expenses
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}As Of Today, {today} {')'}
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
                                    <ExpenseHomeList ref={homeListRef} onHomesFetched={handleHomesFetched} homesList={homes}/>
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
                                    <ExpensePropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} propertiesList={properties} assetPropertiesList={assetProperties}/>
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
                                    <ExpenseCreditCardDebtList ref={creditCardDebtListRef} onCreditCardDebtsFetched={handleCreditCardDebtsFetched} creditcarddebtsList={creditCardDebts}/>
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
                                    <ExpensePersonalLoanList ref={personalLoanListRef} onPersonalLoansFetched={handlePersonalLoansFetched} personalloansList={personalLoans}/>
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
                                    <ExpenseOtherList ref={otherListRef} onOthersFetched={handleOthersFetched} othersList={otherExpenses} vehiclesList={assetVehicles}/>
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
                                        Current EMI's - Property/Vehicle ({emiCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'EMI Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <EMIList ref={emiListRef} onEMIsFetched={handleEMIsFetched} propertiesList={assetProperties} vehiclesList={assetVehicles}/>
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
                                        Current SIP's - Investment Portfolios ({sipCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'SIP Expenses')?.value || 0)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SIPList ref={sipListRef} onSIPsFetched={handleSIPsFetched} depositsList={assetDeposits} portfoliosList={assetPortfolios} otherAssetsList={assetOthers}/>
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
                                        Taxes - Income Tax, Property Tax ({taxCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.find(expense => expense.name === 'Tax Expenses')?.value || 0)}</strong>
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
                sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', mt: '350px', mr: '48px' }}
            >
                <Box sx={{ width: 325, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
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