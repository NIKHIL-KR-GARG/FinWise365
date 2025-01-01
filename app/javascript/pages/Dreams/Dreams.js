import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import HomeIcon from '@mui/icons-material/Home';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import MovingIcon from '@mui/icons-material/Moving';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { useNavigate } from 'react-router-dom';

import AssetPropertyList from '../../components/assetspage/properties/AssetPropertyList'; 
import AssetPropertyForm from '../../components/assetspage/properties/AssetPropertyForm';
import AssetVehicleList from '../../components/assetspage/vehicles/AssetVehicleList';
import AssetVehicleForm from '../../components/assetspage/vehicles/AssetVehicleForm';
import AssetAccountForm from '../../components/assetspage/accounts/AssetAccountForm';
import AssetAccountList from '../../components/assetspage/accounts/AssetAccountList';
import AssetDepositList from '../../components/assetspage/deposits/AssetDepositList';
import AssetDepositForm from '../../components/assetspage/deposits/AssetDepositForm';
import AssetPortfolioList from '../../components/assetspage/portfolios/AssetPortfolioList';
import AssetPortfolioForm from '../../components/assetspage/portfolios/AssetPortfolioForm';
import AssetOtherList from '../../components/assetspage/others/AssetOtherList';
import AssetOtherForm from '../../components/assetspage/others/AssetOtherForm';

import AssetIncomeList from '../../components/incomespage/AssetIncomeList';
import AssetIncomeForm from '../../components/incomespage/AssetIncomeForm';
import CouponIncomeList from '../../components/incomespage/CouponIncomeList';
import DividendIncomeList from '../../components/incomespage/DividendIncomeList';
import LeaseIncomeList from '../../components/incomespage/LeaseIncomeList';
import RentalIncomeList from '../../components/incomespage/RentalIncomeList';
import PayoutIncomeList from '../../components/incomespage/PayoutIncomeList';

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
import EMIList from '../../components/expensespage/emis/EMIList';
import SIPList from '../../components/expensespage/sips/SIPList';

import DreamList from '../../components/dreamspage/DreamList';
import DreamForm from '../../components/dreamspage/DreamForm';
import DreamsGraph from '../../components/dreamspage/DreamsGraph';
import { FormatCurrency } from  '../../components/common/FormatCurrency';
import { formatMonthYear } from '../../components/common/DateFunctions';

import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import HouseIcon from '@mui/icons-material/House';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { today } from '../../components/common/DateFunctions';

import { propertyDreamYearlyExpense, vehicleDreamYearlyExpense, accountsDreamYearlyExpense, depositDreamYearlyExpense, portfolioDreamYearlyExpense, otherAssetDreamYearlyExpense } from '../../components/calculators/Dreams';
import { otherExpenseDreamYearlyExpense } from '../../components/calculators/Dreams';
import { dreamsYearlyExpense } from '../../components/calculators/Dreams';
import { homeExpenseDreamRecurringExpense, propertyExpenseDreamRecurringExpense, creditCardExpenseDreamRecurringExpense, personalLoanExpenseDreamRecurringExpense, otherExpenseDreamRecurringExpense } from '../../components/calculators/Dreams';
import { emiDreamProperty, emiDreamVehicle, emiDream } from '../../components/calculators/Dreams';
import { sipDreamDeposit, sipDreamPortfolio, sipDreamOtherAsset } from '../../components/calculators/Dreams';
import { incomeDream, couponIncomeDream, dividendIncomeDream, rentalIncomeDream, leaseIncomeDream, payoutIncomeDream } from '../../components/calculators/Dreams';

import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import { fetchDreams } from '../../components/dreamspage/DreamList';
import { filterAccounts } from '../../components/assetspage/accounts/AssetAccountList';
import { filterDeposits } from '../../components/assetspage/deposits/AssetDepositList';
import { filterPortfolios } from '../../components/assetspage/portfolios/AssetPortfolioList';
import { filterAssetOthers } from '../../components/assetspage/others/AssetOtherList';
import { filterAssetProperties } from '../../components/assetspage/properties/AssetPropertyList';
import { filterVehicles } from '../../components/assetspage/vehicles/AssetVehicleList';
import { filterCreditCardDebts } from '../../components/expensespage/creditcarddebts/ExpenseCreditCardDebtList';
import { filterPersonalLoans } from '../../components/expensespage/personalloans/ExpensePersonalLoanList';
import { filterExpenseOthers, filterOthersVehicleExpense } from '../../components/expensespage/others/ExpenseOtherList';
import { filterExpenseProperties } from '../../components/expensespage/properties/ExpensePropertyList';
import { filterHomes } from '../../components/expensespage/homes/ExpenseHomeList';
import { fetchPropertyEMIs, fetchVehicleEMIs } from '../../components/expensespage/emis/EMIList';
import { fetchDepositSIPs, fetchPortfolioSIPs, fetchOtherSIPs } from '../../components/expensespage/sips/SIPList';
import { fetchTaxes } from '../../components/expensespage/taxes/TaxList';
import { fetchPropertyMortgageAndLoans, fetchVehicleMortgageAndLoans } from '../../components/expensespage/mortgageandloans/MortgageAndLoanList';
import { filterIncomes } from '../../components/incomespage/AssetIncomeList';
import { filterCouponIncomes } from '../../components/incomespage/CouponIncomeList';
import { filterDividendIncomes } from '../../components/incomespage/DividendIncomeList';
import { filterLeaseIncomes } from '../../components/incomespage/LeaseIncomeList';
import { filterRentalIncomes } from '../../components/incomespage/RentalIncomeList';
import { filterPayoutIncomes } from '../../components/incomespage/PayoutIncomeList';

const Dreams = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Dream'); // State for action
    const [dreamAction, setDreamAction] = useState(''); // State for action
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [tabIndex, setTabIndex] = useState(0);
    
    // for asset dreams
    const assetPropertyListRef = useRef(null);
    const assetVehicleListRef = useRef(null);
    const assetAccountListRef = useRef(null);
    const assetDepositListRef = useRef(null);
    const assetPortfolioListRef = useRef(null);
    const assetOtherListRef = useRef(null);
    const [assetPropertyCount, setAssetPropertyCount] = useState(0); // State for property count
    const [assetVehicleCount, setAssetVehicleCount] = useState(0); // State for vehicle count
    const [assetAccountCount, setAssetAccountCount] = useState(0); // State for assetAccount count
    const [assetDepositCount, setAssetDepositCount] = useState(0); // State for assetDeposit count
    const [assetPortfolioCount, setAssetPortfolioCount] = useState(0); // State for assetPortfolio count
    const [assetOtherCount, setAssetOtherCount] = useState(0); // State for other assetcount
    const [assetProperties, setAssetProperties] = useState([]);
    const [assetVehicles, setAssetVehicles] = useState([]);
    const [assetAccounts, setAssetAccounts] = useState([]);
    const [assetDeposits, setAssetDeposits] = useState([]);
    const [assetPortfolios, setAssetPortfolios] = useState([]);
    const [assetOthers, setAssetOthers] = useState([]);

    const incomeListRef = useRef(null);
    const [incomeCount, setIncomeCount] = useState(0); // State for income count
    const [rentalIncomeCount, setRentalIncomeCount] = useState(0);
    const [leaseIncomeCount, setLeaseIncomeCount] = useState(0);
    const [couponIncomeCount, setCouponIncomeCount] = useState(0);
    const [dividendIncomeCount, setDividendIncomeCount] = useState(0);
    const [payoutIncomeCount, setPayoutIncomeCount] = useState(0);
    const [incomes, setIncomes] = useState([]);

    // for expenses dreams
    const expenseHomeListRef = useRef(null);
    const expensePropertyListRef = useRef(null);
    const expenseCreditCardDebtListRef = useRef(null);
    const expensePersonalLoanListRef = useRef(null);
    const expenseOtherListRef = useRef(null);
    const emiListRef = useRef(null);
    const sipListRef = useRef(null);
    const [expenseHomeCount, setExpenseHomeCount] = useState(0);
    const [expensePropertyCount, setExpensePropertyCount] = useState(0);
    const [expenseCreditCardDebtCount, setExpenseCreditCardDebtCount] = useState(0);
    const [expensePersonalLoanCount, setExpensePersonalLoanCount] = useState(0);
    const [expenseOtherCount, setExpenseOtherCount] = useState(0);
    const [emiCount, setEMICount] = useState(0);
    const [sipCount, setSIPCount] = useState(0);
    const [expenseHomes, setExpenseHomes] = useState([]);
    const [expenseProperties, setExpenseProperties] = useState([]);
    const [expenseCreditCardDebts, setExpenseCreditCardDebts] = useState([]);
    const [expensePersonalLoans, setExpensePersonalLoans] = useState([]);
    const [expenseOthers, setExpenseOthers] = useState([]);

    // for dreams
    const [educationCount, setEducationCount] = useState(0); // State for education count
    const [travelCount, setTravelCount] = useState(0); // State for travel count
    const [relocationCount, setRelocationCount] = useState(0); // State for relocation count
    const [otherCount, setOtherCount] = useState(0); // State for other count
    const educationListRef = useRef(null);
    const travelListRef = useRef(null);
    const relocationListRef = useRef(null);
    const otherListRef = useRef(null);
    const [education, setEducation] = useState([]);
    const [travel, setTravel] = useState([]);
    const [relocation, setRelocation] = useState([]);
    const [other, setOther] = useState([]);
    const [dreams, setDreams] = useState([]);

    const [dreamsListLumpsum, setDreamsListLumpsum] = useState([]);
    const [dreamsListRecurring, setDreamsListRecurring] = useState([]);
    const [dreamsListIncome, setDreamsListIncome] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = localStorage.getItem('currentUserLifeExpectancy');
    const currentUserDateOfBirth = localStorage.getItem('currentUserDateOfBirth');
    
    const hasFetchedData = useRef(false);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    useEffect(() => {
        // for asset dreams
        if (assetPropertyListRef.current) {
            setAssetPropertyCount(assetPropertyListRef.current.getPropertyCount());
        }
        if (assetVehicleListRef.current) {
            setAssetVehicleCount(assetVehicleListRef.current.getVehicleCount());
        }
        if (assetAccountListRef.current) {
            setAssetAccountCount(assetAccountListRef.current.getAccountCount());
        }
        if (assetDepositListRef.current) {
            setAssetDepositCount(assetDepositListRef.current.getDepositCount());
        }
        if (assetPortfolioListRef.current) {
            setAssetPortfolioCount(assetPortfolioListRef.current.getPortfolioCount());
        }
        if (assetOtherListRef.current) {
            setAssetOtherCount(assetOtherListRef.current.getOtherCount());
        }
        if (incomeListRef.current) {
            setIncomeCount(incomeListRef.current.getIncomeCount());
        }

        // for expenses dreams
        if (expenseHomeListRef.current) {
            setExpenseHomeCount(expenseHomeListRef.current.getHomeCount());
        }
        if (expensePropertyListRef.current) {
            setExpensePropertyCount(expensePropertyListRef.current.getPropertyCount());
        }
        if (expenseCreditCardDebtListRef.current) {
            setExpenseCreditCardDebtCount(expenseCreditCardDebtListRef.current.getCreditCardDebtCount());
        }
        if (expensePersonalLoanListRef.current) {
            setExpensePersonalLoanCount(expensePersonalLoanListRef.current.getPersonalLoanCount());
        }
        if (expenseOtherListRef.current) {
            setExpenseOtherCount(expenseOtherListRef.current.getOtherCount());
        }
        if (emiListRef.current) {
            setEMICount(emiListRef.current.getEMICount());
        }
        if (sipListRef.current) {
            setSIPCount(sipListRef.current.getSIPCount());
        }

        // for dreams
        if (educationListRef.current) {
            setEducationCount(educationListRef.current.getDreamCount());
        }
        if (travelListRef.current) {
            setTravelCount(travelListRef.current.getDreamCount());
        }
        if (relocationListRef.current) {
            setRelocationCount(relocationListRef.current.getDreamCount());
        }
        if (otherListRef.current) {
            setOtherCount(otherListRef.current.getDreamCount());
        }
    }, []);

    useEffect(() => {
        // for asset dreams
        if (assetPropertyListRef.current) {
            assetPropertyListRef.current.refreshPropertyList();
            setAssetPropertyCount(assetPropertyListRef.current.getPropertyCount());
        }
        if (assetVehicleListRef.current) {
            assetVehicleListRef.current.refreshVehicleList();
            setAssetVehicleCount(assetVehicleListRef.current.getVehicleCount());
        }
        if (assetAccountListRef.current) {
            assetAccountListRef.current.refreshAccountList();
            setAssetAccountCount(assetAccountListRef.current.getAccountCount());
        }
        if (assetDepositListRef.current) {
            assetDepositListRef.current.refreshDepositList();
            setAssetDepositCount(assetDepositListRef.current.getDepositCount());
        }
        if (assetPortfolioListRef.current) {
            assetPortfolioListRef.current.refreshPortfolioList();
            setAssetPortfolioCount(assetPortfolioListRef.current.getPortfolioCount());
        }
        if (assetOtherListRef.current) {
            assetOtherListRef.current.refreshOtherList();
            setAssetOtherCount(assetOtherListRef.current.getOtherCount());
        }
        if (incomeListRef.current) {
            incomeListRef.current.refreshIncomeList(updatedIncome, successMsg);
            setIncomeCount(incomeCount + 1);
        }

        // for expenses dreams
        if (expenseHomeListRef.current) {
            expenseHomeListRef.current.refreshHomeList();
            setExpenseHomeCount(expenseHomeListRef.current.getHomeCount());
        }
        if (expensePropertyListRef.current) {
            expensePropertyListRef.current.refreshPropertyList();
            setExpensePropertyCount(expensePropertyListRef.current.getPropertyCount());
        }
        if (expenseCreditCardDebtListRef.current) {
            expenseCreditCardDebtListRef.current.refreshCreditCardDebtList();
            setExpenseCreditCardDebtCount(expenseCreditCardDebtListRef.current.getCreditCardDebtCount());
        }
        if (expensePersonalLoanListRef.current) {
            expensePersonalLoanListRef.current.refreshPersonalLoanList();
            setExpensePersonalLoanCount(expensePersonalLoanListRef.current.getPersonalLoanCount());
        }
        if (expenseOtherListRef.current) {
            expenseOtherListRef.current.refreshOtherList();
            setExpenseOtherCount(expenseOtherListRef.current.getOtherCount());
        }

        // for dreams
        if (educationListRef.current) {
            educationListRef.current.refreshDreamList();
            setEducationCount(educationListRef.current.getDreamCount());
        }
        if (travelListRef.current) {
            travelListRef.current.refreshDreamList();
            setTravelCount(travelListRef.current.getDreamCount());
        }
        if (relocationListRef.current) {
            relocationListRef.current.refreshDreamList();
            setRelocationCount(relocationListRef.current.getDreamCount());
        }
        if (otherListRef.current) {
            otherListRef.current.refreshDreamList();
            setOtherCount(otherListRef.current.getDreamCount());
        }
    }, []);

    const fetchData = async () => {
        try {
            const [assetPropertiesResponse, assetVehiclesResponse, assetAccountsResponse, assetDepositsResponse, assetPortfoliosResponse, assetOhersResponse, incomesResponse,
                expenseHomesResponse, expensePropertiesResponse, expenseCreditCardDebtsResponse, expensePersonalLoansResponse, expenseOthersResponse,
                dreamsResponse] = await Promise.all([
                    axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_accounts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_deposits?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/asset_incomes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_homes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/expense_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/expense_personal_loans?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/expense_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    axios.get(`/api/dreams?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                ]);

            // for asset dreams
            const assetPropertiesList = assetPropertiesResponse.data.filter(property => property.is_dream);
            const assetVehiclesList = assetVehiclesResponse.data.filter(vehicle => vehicle.is_dream);
            const assetAccountsList = assetAccountsResponse.data.filter(account => account.is_dream);
            const assetDepositsList = assetDepositsResponse.data.filter(deposit => deposit.is_dream);
            const assetPortfoliosList = assetPortfoliosResponse.data.filter(portfolio => portfolio.is_dream);
            const assetOthersList = assetOhersResponse.data.filter(other => other.is_dream);
            const incomesList = incomesResponse.data.filter(income => income.is_dream);

            // for expenses dreams
            const expenseHomesList = expenseHomesResponse.data.filter(home => home.is_dream);
            const expensePropertiesList = expensePropertiesResponse.data.filter(property => property.is_dream);
            const expenseCreditCardDebtsList = expenseCreditCardDebtsResponse.data.filter(creditCardDebt => creditCardDebt.is_dream);
            const expensePersonalLoansList = expensePersonalLoansResponse.data.filter(personalLoan => personalLoan.is_dream);
            const expenseOthersList = expenseOthersResponse.data.filter(other => other.is_dream);

            // for dreams
            // filter dreams where dream_type = 'Education' or 'Travel' or 'Relocation' or 'Other'
            const educationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Education');
            const travelList = dreamsResponse.data.filter(dream => dream.dream_type === 'Travel');
            const relocationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Relocation');
            const otherList = dreamsResponse.data.filter(dream => dream.dream_type === 'Other');
            const dreamsList = dreamsResponse.data;

            // set state for all the lists
            // for asset dreams
            setAssetProperties(assetPropertiesList);
            setAssetVehicles(assetVehiclesList);
            setAssetAccounts(assetAccountsList);
            setAssetDeposits(assetDepositsList);
            setAssetPortfolios(assetPortfoliosList);
            setAssetOthers(assetOthersList);
            setIncomes(incomesList);

            // for expenses dreams
            setExpenseHomes(expenseHomesList);
            setExpenseProperties(expensePropertiesList);
            setExpenseCreditCardDebts(expenseCreditCardDebtsList);
            setExpensePersonalLoans(expensePersonalLoansList);
            setExpenseOthers(expenseOthersList);

            // for dreams
            setEducation(educationList);
            setTravel(travelList);
            setRelocation(relocationList);
            setOther(otherList);
            setDreams(dreamsList);

            // starting the current year add rows to the dreamsListLumpsum array for the next 100 years
            const year = new Date().getFullYear();
            const dreamsListLumpsum = [];
            for (let i = year; i <= (year + 100); i++) {
                dreamsListLumpsum.push({
                    year: i,
                    AssetProperty: 0,
                    AssetVehicle: 0,
                    AssetAccount: 0,
                    AssetDeposit: 0,
                    AssetPortfolio: 0,
                    AssetOther: 0,
                    Income: 0,
                    ExpenseOther: 0,
                    Education: 0,
                    Travel: 0,
                    Relocation: 0,
                    Other: 0,
                    total_value: 0
                });
            }

            let maxYear = new Date().getFullYear();

            // LUMP SUM EXPENSES

            // loop though the assetProperties and add the value to the corresponding year
            assetPropertiesList.forEach(property => {
                const propertyDreamYearlyExpenseData = propertyDreamYearlyExpense(property, currentUserBaseCurrency);
                if (propertyDreamYearlyExpenseData && propertyDreamYearlyExpenseData.length > 0) {
                    const dreamYear = propertyDreamYearlyExpenseData[0].year;
                    const dreamValue = propertyDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the property column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetProperty += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the assetVehicles and add the value to the corresponding year
            assetVehiclesList.forEach(vehicle => {
                const vehicleDreamYearlyExpenseData = vehicleDreamYearlyExpense(vehicle, currentUserBaseCurrency);
                if (vehicleDreamYearlyExpenseData && vehicleDreamYearlyExpenseData.length > 0) {
                    const dreamYear = vehicleDreamYearlyExpenseData[0].year;
                    const dreamValue = vehicleDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the vehicle column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetVehicle += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the assetAccounts and add the value to the corresponding year
            assetAccountsList.forEach(account => {
                const accountDreamYearlyExpenseData = accountsDreamYearlyExpense(account, currentUserBaseCurrency);
                if (accountDreamYearlyExpenseData && accountDreamYearlyExpenseData.length > 0) {
                    const dreamYear = accountDreamYearlyExpenseData[0].year;
                    const dreamValue = accountDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the account column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetAccount += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the assetDeposits and add the value to the corresponding year
            assetDepositsList.forEach(deposit => {
                const depositDreamYearlyExpenseData = depositDreamYearlyExpense(deposit, currentUserBaseCurrency);
                if (depositDreamYearlyExpenseData && depositDreamYearlyExpenseData.length > 0) {
                    const dreamYear = depositDreamYearlyExpenseData[0].year;
                    const dreamValue = depositDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the deposit column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetDeposit += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the assetportfolios and add the value to the corresponding year
            assetPortfoliosList.forEach(portfolio => {
                const portfolioDreamYearlyExpenseData = portfolioDreamYearlyExpense(portfolio, currentUserBaseCurrency);
                if (portfolioDreamYearlyExpenseData && portfolioDreamYearlyExpenseData.length > 0) {
                    const dreamYear = portfolioDreamYearlyExpenseData[0].year;
                    const dreamValue = portfolioDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the portfolio column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetPortfolio += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the assetOthers and add the value to the corresponding year
            assetOthersList.forEach(other => {
                const otherAssetDreamYearlyExpenseData = otherAssetDreamYearlyExpense(other, currentUserBaseCurrency);
                if (otherAssetDreamYearlyExpenseData && otherAssetDreamYearlyExpenseData.length > 0) {
                    const dreamYear = otherAssetDreamYearlyExpenseData[0].year;
                    const dreamValue = otherAssetDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = purchaseYear and add the value to the other column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).AssetOther += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the expenseOthers and add the value to the corresponding year
            expenseOthersList.forEach(other => {
                const otherExpenseDreamYearlyExpenseData = otherExpenseDreamYearlyExpense(other, currentUserBaseCurrency);
                if (otherExpenseDreamYearlyExpenseData && otherExpenseDreamYearlyExpenseData.length > 0) {
                    const dreamYear = otherExpenseDreamYearlyExpenseData[0].year;
                    const dreamValue = otherExpenseDreamYearlyExpenseData[0].amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = otherYear and add the value to the other column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).ExpenseOther += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                }
            });

            // loop though the education and add the value to the corresponding year
            educationList.forEach(education => {
                const educationDreamYearlyExpenseData = dreamsYearlyExpense(education, currentUserBaseCurrency);
                // loop though each year in the educationDreamYearlyExpenseData and add the value to the corresponding year
                educationDreamYearlyExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = educationYear and add the value to the education column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).Education += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the travel and add the value to the corresponding year
            travelList.forEach(travel => {
                const travelDreamYearlyExpenseData = dreamsYearlyExpense(travel, currentUserBaseCurrency);
                // loop though each year in the travelDreamYearlyExpenseData and add the value to the corresponding year
                travelDreamYearlyExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = travelYear and add the value to the travel column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).Travel += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the relocation and add the value to the corresponding year
            relocationList.forEach(relocation => {
                const relocationDreamYearlyExpenseData = dreamsYearlyExpense(relocation, currentUserBaseCurrency);
                // loop though each year in the relocationDreamYearlyExpenseData and add the value to the corresponding year
                relocationDreamYearlyExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = relocationYear and add the value to the relocation column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).Relocation += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the other and add the value to the corresponding year
            otherList.forEach(other => {
                const otherDreamYearlyExpenseData = dreamsYearlyExpense(other, currentUserBaseCurrency);
                // loop though each year in the otherDreamYearlyExpenseData and add the value to the corresponding year
                otherDreamYearlyExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListLumpsum array where year = otherYear and add the value to the other column
                    dreamsListLumpsum.find(dream => dream.year === dreamYear).Other += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through the dreamsListLumpsum array from maxYear + 1 to end of array and delete all these rows as these are empty rows
            for (let i = year; i <= (year + 100); i++) {
                dreamsListLumpsum.find(dream => dream.year === i).total_value =
                    dreamsListLumpsum.find(dream => dream.year === i).AssetProperty +
                    dreamsListLumpsum.find(dream => dream.year === i).AssetVehicle +
                    dreamsListLumpsum.find(dream => dream.year === i).AssetAccount +
                    dreamsListLumpsum.find(dream => dream.year === i).AssetDeposit +
                    dreamsListLumpsum.find(dream => dream.year === i).AssetPortfolio +
                    dreamsListLumpsum.find(dream => dream.year === i).AssetOther +
                    dreamsListLumpsum.find(dream => dream.year === i).ExpenseOther +
                    dreamsListLumpsum.find(dream => dream.year === i).Education +
                    dreamsListLumpsum.find(dream => dream.year === i).Travel +
                    dreamsListLumpsum.find(dream => dream.year === i).Relocation +
                    dreamsListLumpsum.find(dream => dream.year === i).Other;
                if (i > maxYear) {
                    dreamsListLumpsum.splice(dreamsListLumpsum.findIndex(dream => dream.year === i), 1);
                }
            }

            // set state for dreamsListLumpsum
            setDreamsListLumpsum(dreamsListLumpsum);

            // RECURRING EXPENSES

            const dreamsListRecurring = [];
            for (let i = year; i <= (year + 100); i++) {
                dreamsListRecurring.push({
                    year: i,
                    ExpenseHome: 0,
                    ExpenseProperty: 0,
                    ExpenseCreditCardDebt: 0,
                    ExpensePersonalLoan: 0,
                    ExpenseOther: 0,
                    EMI: 0,
                    SIP: 0,
                    total_value: 0
                });
            }

            maxYear = new Date().getFullYear();
            const today = new Date();
            // derive current age
            const dob = new Date(currentUserDateOfBirth);
            const ageDifMs = today - dob;
            let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
            let month = today.getMonth() + 1; // Add 1 to get the correct month number
            const projectionYears = currentUserLifeExpectancy - age;
            // const projectionMonths = (projectionYears * 12) + (12 - month + 1);
            const projectionEndDate = new Date(today.getFullYear() + projectionYears, month - 1, today.getDate());

            // loop though the expenseHomes and add the value to the corresponding year
            expenseHomesList.forEach(home => {
                const homeDreamRecurringExpenseData = homeExpenseDreamRecurringExpense(home, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the homeDreamRecurringExpenseData and add the value to the corresponding year
                homeDreamRecurringExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = homeYear and add the value to the home column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).ExpenseHome += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the expenseProperties and add the value to the corresponding year
            expensePropertiesList.forEach(property => {
                const propertyDreamRecurringExpenseData = propertyExpenseDreamRecurringExpense(property, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the propertyDreamRecurringExpenseData and add the value to the corresponding year
                propertyDreamRecurringExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = propertyYear and add the value to the property column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).ExpenseProperty += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the expenseCreditCardDebts and add the value to the corresponding year
            expenseCreditCardDebtsList.forEach(creditCardDebt => {
                const creditCardDebtDreamRecurringExpenseData = creditCardExpenseDreamRecurringExpense(creditCardDebt, currentUserBaseCurrency);
                // loop though each year in the creditCardDebtDreamRecurringExpenseData and add the value to the corresponding year
                creditCardDebtDreamRecurringExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = creditCardDebtYear and add the value to the credit card debt column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).ExpenseCreditCardDebt += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the expensePersonalLoans and add the value to the corresponding year
            expensePersonalLoansList.forEach(personalLoan => {
                const personalLoanDreamRecurringExpenseData = personalLoanExpenseDreamRecurringExpense(personalLoan, currentUserBaseCurrency);
                // loop though each year in the personalLoanDreamRecurringExpenseData and add the value to the corresponding year
                personalLoanDreamRecurringExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = personalLoanYear and add the value to the personal loan column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).ExpensePersonalLoan += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop though the expenseOthers and add the value to the corresponding year
            expenseOthersList.forEach(other => {
                const otherDreamRecurringExpenseData = otherExpenseDreamRecurringExpense(other, currentUserBaseCurrency);
                // loop though each year in the otherDreamRecurringExpenseData and add the value to the corresponding year
                otherDreamRecurringExpenseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = otherYear and add the value to the other column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).ExpenseOther += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the properties and add the EMI value to the corresponding year
            assetPropertiesList.forEach(property => {
                const propertyEMIData = emiDreamProperty(property, currentUserBaseCurrency);
                // loop though each year in the propertyEMIData and add the value to the corresponding year
                propertyEMIData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = propertyYear and add the value to the EMI column
                    const index = dreamsListRecurring.findIndex(item => item.year === dreamYear);
                    if (index > -1) dreamsListRecurring[index].EMI += dreamValue;
                    // dreamsListRecurring.find(dream => dream.year === dreamYear).EMI += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the vehicles and add the EMI value to the corresponding year
            assetVehiclesList.forEach(vehicle => {
                const vehicleEMIData = emiDreamVehicle(vehicle, currentUserBaseCurrency);
                // loop though each year in the vehicleEMIData and add the value to the corresponding year
                vehicleEMIData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = vehicleYear and add the value to the EMI column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).EMI += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the dreams and add the EMI value to the corresponding year
            dreamsList.forEach(dream => {
                const dreamEMIData = emiDream(dream, currentUserBaseCurrency);
                // loop though each year in the dreamEMIData and add the value to the corresponding year
                dreamEMIData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = dreamYear and add the value to the EMI column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).EMI += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the deposits and add the SIP value to the corresponding year
            assetDepositsList.forEach(deposit => {
                const depositSIPData = sipDreamDeposit(deposit, currentUserBaseCurrency);
                // loop though each year in the depositSIPData and add the value to the corresponding year
                depositSIPData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = depositYear and add the value to the SIP column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).SIP += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the portfolios and add the SIP value to the corresponding year
            assetPortfoliosList.forEach(portfolio => {
                const portfolioSIPData = sipDreamPortfolio(portfolio, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the portfolioSIPData and add the value to the corresponding year
                portfolioSIPData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = portfolioYear and add the value to the SIP column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).SIP += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through all the otherAssets and add the SIP value to the corresponding year
            assetOthersList.forEach(other => {
                const otherSIPData = sipDreamOtherAsset(other, currentUserBaseCurrency);
                // loop though each year in the otherSIPData and add the value to the corresponding year
                otherSIPData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListRecurring array where year = otherYear and add the value to the SIP column
                    dreamsListRecurring.find(dream => dream.year === dreamYear).SIP += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
            });

            // loop through the dreamsListLumpsum array from maxYear + 1 to end of array and delete all these rows as these are empty rows
            for (let i = year; i <= (year + 100); i++) {
                dreamsListRecurring.find(dream => dream.year === i).total_value =
                    dreamsListRecurring.find(dream => dream.year === i).ExpenseHome +
                    dreamsListRecurring.find(dream => dream.year === i).ExpenseProperty +
                    dreamsListRecurring.find(dream => dream.year === i).ExpenseCreditCardDebt +
                    dreamsListRecurring.find(dream => dream.year === i).ExpensePersonalLoan +
                    dreamsListRecurring.find(dream => dream.year === i).ExpenseOther +
                    dreamsListRecurring.find(dream => dream.year === i).EMI +
                    dreamsListRecurring.find(dream => dream.year === i).SIP;

                if (i > maxYear) {
                    dreamsListRecurring.splice(dreamsListRecurring.findIndex(dream => dream.year === i), 1);
                }
            }

            // set state for dreamsListLumpsum
            setDreamsListRecurring(dreamsListRecurring);

            // DREAM INCOMES

            const dreamsListIncome = [];
            for (let i = year; i <= (year + 100); i++) {
                dreamsListIncome.push({
                    year: i,
                    Income: 0,
                    Rental: 0,
                    Lease: 0,
                    Coupon: 0,
                    Dividend: 0,
                    Payout: 0,
                    total_value: 0
                });
            }

            maxYear = new Date().getFullYear();

            // loop though the incomes and add the value to the corresponding year
            incomesList.forEach(income => {
                const incomeDreamData = incomeDream(income, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the incomeDreamIncomeData and add the value to the corresponding year
                incomeDreamData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = incomeYear and add the value to the income column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Income += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setIncomeCount(incomesList.filter(income => income.is_recurring).length);
            });

            // loop through all the properties and add the Rental value to the corresponding year
            assetPropertiesList.forEach(property => {
                const propertyRentalData = rentalIncomeDream(property, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the propertyRentalData and add the value to the corresponding year
                propertyRentalData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = propertyYear and add the value to the Rental column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Rental += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setRentalIncomeCount(assetPropertiesList.filter(property => property.is_on_rent).length);
            });

            // loop through all the vehicles and add the Lease value to the corresponding year
            assetVehiclesList.forEach(vehicle => {
                const vehicleLeaseData = leaseIncomeDream(vehicle, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the vehicleLeaseData and add the value to the corresponding year
                vehicleLeaseData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = vehicleYear and add the value to the Lease column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Lease += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setLeaseIncomeCount(assetVehiclesList.filter(vehicle => vehicle.is_on_lease).length);
            });

            // loop through all the portfolio and add the Coupon value to the corresponding year
            assetPortfoliosList.forEach(portfolio => {
                const portfolioCouponData = couponIncomeDream(portfolio, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the portfolioCouponData and add the value to the corresponding year
                portfolioCouponData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = portfolioYear and add the value to the Coupon column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Coupon += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setCouponIncomeCount(assetPortfoliosList.filter(portfolio => portfolio.portfolio_type === 'Bonds').length);
            });

            // loop through all the portfolio and add the Dividend value to the corresponding year
            assetPortfoliosList.forEach(portfolio => {
                const portfolioDividendData = dividendIncomeDream(portfolio, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the portfolioDividendData and add the value to the corresponding year
                portfolioDividendData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = portfolioYear and add the value to the Dividend column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Dividend += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setDividendIncomeCount(assetPortfoliosList.filter(portfolio => portfolio.is_paying_dividend).length);
            });

            // loop through all the otherAssets and add the Payout value to the corresponding year
            assetOthersList.forEach(other => {
                const otherPayoutData = payoutIncomeDream(other, currentUserBaseCurrency, projectionEndDate);
                // loop though each year in the otherPayoutData and add the value to the corresponding year
                otherPayoutData.forEach(dream => {
                    const dreamYear = dream.year;
                    const dreamValue = dream.amount;
                    // find the corresponding row in the dreamsListIncome array where year = otherYear and add the value to the Payout column
                    dreamsListIncome.find(dream => dream.year === dreamYear).Payout += dreamValue;
                    if (dreamYear > maxYear) maxYear = dreamYear;
                });
                setPayoutIncomeCount(assetOthersList.filter(other => other.payout_type === 'Recurring').length);
            });

            // loop through the dreamsListLumpsum array from maxYear + 1 to end of array and delete all these rows as these are empty rows
            for (let i = year; i <= (year + 100); i++) {
                dreamsListIncome.find(dream => dream.year === i).total_value =
                dreamsListIncome.find(dream => dream.year === i).Income +
                dreamsListIncome.find(dream => dream.year === i).Rental +
                dreamsListIncome.find(dream => dream.year === i).Lease +
                dreamsListIncome.find(dream => dream.year === i).Coupon +
                dreamsListIncome.find(dream => dream.year === i).Dividend +
                dreamsListIncome.find(dream => dream.year === i).Payout;

                if (i > maxYear) {
                    dreamsListIncome.splice(dreamsListIncome.findIndex(dream => dream.year === i), 1);
                }
            }

            // set state for dreamsListLumpsum
            setDreamsListIncome(dreamsListIncome);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchData();
            hasFetchedData.current = true;
        }
    }, [currentUserId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <HomeHeader open={true}  />
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
                            <Typography color="textPrimary">Dreams</Typography>
                        </Breadcrumbs>
                        <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StarIcon sx={{ mr: 1 }} />
                                    My Dreams {'( '}As Of, {formatMonthYear(new Date())} {')'}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<InsertDriveFileIcon />}
                                        sx={{ mr: 2 }}
                                    >
                                        Download Dreams Data
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
        setDreamAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setDreamAction('');
        setAction('');
    };

    // for asset dreams
    const handleAssetPropertyAdded = (updatedAssetProperty, successMsg) => {
        if (assetPropertyListRef.current) {
            assetPropertyListRef.current.refreshPropertyList(updatedAssetProperty, successMsg);
            setAssetPropertyCount(assetPropertyCount + 1);
        }
    };
    const handleAssetVehicleAdded = (updatedAssetVehicle, successMsg) => {
        if (assetVehicleListRef.current) {
            assetVehicleListRef.current.refreshVehicleList(updatedAssetVehicle, successMsg);
            setAssetVehicleCount(assetVehicleCount + 1);
        }
    };
    const handleAssetAccountAdded = (updatedAssetAccount, successMsg) => {
        if (assetAccountListRef.current) {
            assetAccountListRef.current.refreshAccountList(updatedAssetAccount, successMsg);
            setAssetAccountCount(assetAccountCount + 1);
        }
    };
    const handleAssetDepositAdded = (updatedAssetDeposit, successMsg) => {
        if (assetDepositListRef.current) {
            assetDepositListRef.current.refreshDepositList(updatedAssetDeposit, successMsg);
            setAssetDepositCount(assetDepositCount + 1);
        }
    };
    const handleAssetPortfolioAdded = (updatedAssetPortfolio, successMsg) => {
        if (assetPortfolioListRef.current) {
            assetPortfolioListRef.current.refreshPortfolioList(updatedAssetPortfolio, successMsg);
            setAssetPortfolioCount(assetPortfolioCount + 1);
        }
    };
    const handleAssetOtherAdded = (updatedAssetOther, successMsg) => {
        if (assetOtherListRef.current) {
            assetOtherListRef.current.refreshOtherList(updatedAssetOther, successMsg);
            setAssetOtherCount(assetOtherCount + 1);
        }
    };
    const handleIncomeAdded = (updatedIncome, successMsg) => {
        if (incomeListRef.current) {
            incomeListRef.current.refreshIncomeList(updatedIncome, successMsg);
            setIncomeCount(incomeCount + 1);
        }
    };

    // for expenses dreams
    const handleExpenseHomeAdded = (updatedExpenseHome, successMsg) => {
        if (expenseHomeListRef.current) {
            expenseHomeListRef.current.refreshHomeList(updatedExpenseHome, successMsg);
            setExpenseHomeCount(expenseHomeCount + 1);
        }
    };
    const handleExpensePropertyAdded = (updatedExpenseProperty, successMsg) => {
        if (expensePropertyListRef.current) {
            expensePropertyListRef.current.refreshPropertyList(updatedExpenseProperty, successMsg);
            setExpensePropertyCount(expensePropertyCount + 1);
        }
    };
    const handleExpenseCreditCardDebtAdded = (updatedExpenseCreditCardDebt, successMsg) => {
        if (expenseCreditCardDebtListRef.current) {
            expenseCreditCardDebtListRef.current.refreshCreditCardDebtList(updatedExpenseCreditCardDebt, successMsg);
            setExpenseCreditCardDebtCount(expenseCreditCardDebtCount + 1);
        }
    };
    const handleExpensePersonalLoanAdded = (updatedExpensePersonalLoan, successMsg) => {
        if (expensePersonalLoanListRef.current) {
            expensePersonalLoanListRef.current.refreshPersonalLoanList(updatedExpensePersonalLoan, successMsg);
            setExpensePersonalLoanCount(expensePersonalLoanCount + 1);
        }
    };
    const handleExpenseOtherAdded = (updatedExpenseOther, successMsg) => {
        if (expenseOtherListRef.current) {
            expenseOtherListRef.current.refreshOtherList(updatedExpenseOther, successMsg);
            setExpenseOtherCount(expenseOtherCount + 1);
        }
    };

    // for dreams
    const handleEducationAdded = (updatedEducation, successMsg) => {
        if (educationListRef.current) {
            educationListRef.current.refreshDreamList(updatedEducation, successMsg);
            setEducationCount(educationCount + 1);
        }
    };
    const handleTravelAdded = (updatedTravel, successMsg) => {
        if (travelListRef.current) {
            travelListRef.current.refreshDreamList(updatedTravel, successMsg);
            setTravelCount(travelCount + 1);
        }
    };
    const handleRelocationAdded = (updatedRelocation, successMsg) => {
        if (relocationListRef.current) {
            relocationListRef.current.refreshDreamList(updatedRelocation, successMsg);
            setRelocationCount(relocationCount + 1);
        }   
    };
    const handleOtherAdded = (updatedOther, successMsg) => {
        if (otherListRef.current) {
            otherListRef.current.refreshDreamList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
        }
    };

    // for asset dreams
    const handleAssetPropertiesFetched = (count) => {
        setAssetPropertyCount(count);
    };
    const handleAssetVehiclesFetched = (count) => {
        setAssetVehicleCount(count);
    };
    const handleAssetAccountsFetched = (count) => {
        setAssetAccountCount(count);
    };
    const handleAssetDepositsFetched = (count) => {
        setAssetDepositCount(count);
    };
    const handleAssetPortfoliosFetched = (count) => {
        setAssetPortfolioCount(count);
    };
    const handleAssetOthersFetched = (count) => {
        setAssetOtherCount(count);
    };
    const handleIncomesFetched = (count) => {
        setIncomeCount(count);
    };

    // for expenses dreams
    const handleExpenseHomesFetched = (count) => {
        setExpenseHomeCount(count);
    };
    const handleExpensePropertiesFetched = (count) => {
        setExpensePropertyCount(count);
    };
    const handleExpenseCreditCardDebtsFetched = (count) => {
        setExpenseCreditCardDebtCount(count);
    };
    const handleExpensePersonalLoansFetched = (count) => {
        setExpensePersonalLoanCount(count);
    };
    const handleExpenseOthersFetched = (count) => {
        setExpenseOtherCount(count);
    };
    const handleEMIsFetched = (count) => {
        setEMICount(count);
    };
    const handleSIPsFetched = (count) => {
        setSIPCount(count);
    };
    
    // for dreams
    const handleEducationFetched = (count) => {
        setEducationCount(count);
    };
    const handleTravelFetched = (count) => {
        setTravelCount(count);
    };
    const handleRelocationFetched = (count) => {
        setRelocationCount(count);
    };
    const handleOtherFetched = (count) => {
        setOtherCount(count);
    };
    
    const handleSellPropertyClick = () => {
        setConfirmDialogOpen(true);
    };
    const handleSellVehicleClick = () => {
        setConfirmDialogOpen(true);
    };
    const handleConfirmDialogClose = (confirmed) => {
        setConfirmDialogOpen(false);
        if (confirmed) {
            navigate('/assets');
        }
    };

    const handleExportToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            const addSheet = (data, sheetName) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            };

            const assetPropertyList = filterAssetProperties('Dream', assetProperties, false);
            const assetVehicleList = filterVehicles('Dream', assetVehicles, false);
            const assetAccountList = filterAccounts('Dream', assetAccounts, false);
            const assetDepositList = filterDeposits('Dream', assetDeposits, false);
            const assetPortfolioList = filterPortfolios('Dream', assetPortfolios, false);
            const assetOtherList = filterAssetOthers('Dream', assetOthers, false);

            const incomeList = filterIncomes('Dream', incomes, false);
            // const coupons = filterCouponIncomes(assetPortfolios);
            // const dividends = filterDividendIncomes(assetPortfolios);
            // const payouts = filterPayoutIncomes(assetOthers);
            // const leases = filterLeaseIncomes(assetVehicles);
            // const rentals = filterRentalIncomes(assetProperties);

            const expenseHomeList = filterHomes('Dream', expenseHomes, false);
            const expensePropertyList = filterExpenseProperties('Dream', expenseProperties, false);
            const expenseCreditCardDebtList = filterCreditCardDebts('Dream', expenseCreditCardDebts, false);
            const expensePersonalLoanList = filterPersonalLoans('Dream', expensePersonalLoans, false);
            const expenseOtherList = filterExpenseOthers('Dream', expenseOthers, false);
            // const emis = fetchPropertyEMIs(assetProperties, false).concat(fetchVehicleEMIs(assetVehicles, false));
            // const sips = fetchDepositSIPs(assetDeposits, false).concat(fetchPortfolioSIPs(assetPortfolios, false)).concat(fetchOtherSIPs(assetOthers, false));
            // const taxes = fetchTaxes(assetProperties, false);
            // const mortgageAndLoans = fetchPropertyMortgageAndLoans(assetProperties, false).concat(fetchVehicleMortgageAndLoans(assetVehicles, false));

            const educationList = fetchDreams(education);
            const travelList = fetchDreams(travel);
            const relocationList = fetchDreams(relocation);
            const otherList = fetchDreams(other);

            addSheet(assetPropertyList, 'Future Properties');
            addSheet(assetVehicleList, 'Future Vehicles');
            addSheet(assetAccountList, 'Accounts');
            addSheet(assetDepositList, 'Deposits');
            addSheet(assetPortfolioList, 'Portfolios');
            addSheet(assetOtherList, 'Others Future Assets');
            addSheet(incomeList, 'Future Incomes');
            // addSheet(coupons, 'Coupons');
            // addSheet(dividends, 'Dividends');
            // addSheet(payouts, 'Payouts');
            // addSheet(leases, 'Leases');
            // addSheet(rentals, 'Rentals');
            addSheet(expenseHomeList, 'Home Expenses');
            addSheet(expensePropertyList, 'Property Expenses');
            addSheet(expenseCreditCardDebtList, 'Credit Card Debts');
            addSheet(expensePersonalLoanList, 'Personal Loans');
            addSheet(expenseOtherList, 'Other Future Expenses');
            // addSheet(emis, 'EMIs');
            // addSheet(sips, 'SIPs');
            // addSheet(taxes, 'Taxes');
            // addSheet(mortgageAndLoans, 'Mortgage And Loans');
            addSheet(educationList, 'Education');
            addSheet(travelList, 'Travel');
            addSheet(relocationList, 'Relocation');
            addSheet(otherList, 'Other Dreams');

            const date = new Date();
            const timestamp = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
            const fileName = `Dreams_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, fileName);

            setSuccessMessage('Data exported successfully');
        }
        catch (error) {
            setErrorMessage('Error exporting data: ' + error);
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
                        <Typography color="textPrimary">Dreams</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarIcon sx={{ mr: 1 }} />
                                My Dreams {'( '}As Of, {formatMonthYear(new Date())} {')'}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<InsertDriveFileIcon />}
                                    onClick={handleExportToExcel}
                                    sx={{ mr: 2 }}
                                >
                                    Download Dreams Data
                                </Button>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                    {'( '}Today, {today} {')'}
                                </Box>
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
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
                            <Tab label="Future Lumpsum Expenses" />
                            <Tab label="Future Regular Expenses" />
                            <Tab label="Future Incomes" />
                        </Tabs>
                        {tabIndex === 0 && (
                            <>
                                <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                                    <DreamsGraph dreamsList={dreamsListLumpsum} graphType={'lumpsum'}/>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    {/* Asset Dreams */}
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <HomeWorkIcon sx={{ mr: 1, color: 'blue' }} />
                                                Future Properties ({assetPropertyCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetProperty, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetPropertyList ref={assetPropertyListRef} onPropertiesFetched={handleAssetPropertiesFetched} listAction={'Dream'} propertiesList={assetProperties} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <DirectionsCarFilledIcon sx={{ mr: 1, color: 'red' }} />
                                                Future Vehicles ({assetVehicleCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetVehicle, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetVehicleList ref={assetVehicleListRef} onVehiclesFetched={handleAssetVehiclesFetched} listAction={'Dream'} vehiclesList={assetVehicles} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <AccountBalanceWalletIcon sx={{ mr: 1, color: 'teal' }} />
                                                Savings/Current Accounts ({assetAccountCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetAccount, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetAccountList ref={assetAccountListRef} onAccountsFetched={handleAssetAccountsFetched} listAction={'Dream'} accountsList={assetAccounts} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel3a-content"
                                            id="panel3a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <SavingsIcon sx={{ mr: 1, color: 'brown' }} />
                                                Fixed/Recurring Deposits ({assetDepositCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetDeposit, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetDepositList ref={assetDepositListRef} onDepositsFetched={handleAssetDepositsFetched} listAction={'Dream'} depositsList={assetDeposits} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel4a-content"
                                            id="panel4a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <ShowChartIcon sx={{ mr: 1, color: 'purple' }} />
                                                Investment Portfolio ({assetPortfolioCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetPortfolio, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetPortfolioList ref={assetPortfolioListRef} onPortfoliosFetched={handleAssetPortfoliosFetched} listAction={'Dream'} portfoliosList={assetPortfolios} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel11a-content"
                                            id="panel11a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <FolderSpecialIcon sx={{ mr: 1, color: 'brown' }} />
                                                Other Future Assets ({assetOtherCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.AssetOther, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetOtherList ref={assetOtherListRef} onOthersFetched={handleAssetOthersFetched} listAction={'Dream'} othersList={assetOthers} />
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* Expense Dreams */}
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <MiscellaneousServicesIcon sx={{ mr: 1, color: 'green' }} />
                                                Other Future Expenses ({expenseOtherCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.ExpenseOther, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpenseOtherList ref={expenseOtherListRef} onOthersFetched={handleExpenseOthersFetched} listAction={'Dream'} othersList={expenseOthers} vehiclesList={null} />
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* Other Dreams */}
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <SchoolIcon sx={{ mr: 1, color: 'yellow' }} />
                                                Education ({educationCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.Education, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DreamList ref={educationListRef} onDreamsFetched={handleEducationFetched} dreamType={'Education'} dreamsList={education} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <FlightTakeoffIcon sx={{ mr: 1, color: 'teal' }} />
                                                Travel ({travelCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.Travel, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DreamList ref={travelListRef} onDreamsFetched={handleTravelFetched} dreamType={'Travel'} dreamsList={travel} />
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <MovingIcon sx={{ mr: 1, color: 'teal' }} />
                                                Relocation ({relocationCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.Relocation, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DreamList ref={relocationListRef} onDreamsFetched={handleRelocationFetched} dreamType={'Relocation'} dreamsList={relocation} />
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
                                                Other Dreams ({otherCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListLumpsum.reduce((acc, curr) => acc + curr.Other, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DreamList ref={otherListRef} onDreamsFetched={handleOtherFetched} dreamType={'Other'} dreamsList={other} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </>
                        )}
                        {tabIndex === 1 && (
                            <>
                                <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                                    <DreamsGraph dreamsList={dreamsListRecurring} graphType={'recurring'}/>
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
                                                <HouseIcon sx={{ mr: 1, color: 'blue' }} />
                                                Home Expenses ({expenseHomeCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.ExpenseHome, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpenseHomeList ref={expenseHomeListRef} onHomesFetched={handleExpenseHomesFetched} listAction={'Dream'} homesList={expenseHomes} />
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
                                                Property Expenses ({expensePropertyCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.ExpenseProperty, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpensePropertyList ref={expensePropertyListRef} onPropertiesFetched={handleExpensePropertiesFetched} listAction={'Dream'} propertiesList={expenseProperties} assetPropertiesList={null} />
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
                                                Credit Card Debts ({expenseCreditCardDebtCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.ExpenseCreditCardDebt, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpenseCreditCardDebtList ref={expenseCreditCardDebtListRef} onCreditCardDebtsFetched={handleExpenseCreditCardDebtsFetched} listAction={'Dream'} creditcarddebtsList={expenseCreditCardDebts} />
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
                                                Personal Loans ({expensePersonalLoanCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.ExpensePersonalLoan, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpensePersonalLoanList ref={expensePersonalLoanListRef} onPersonalLoansFetched={handleExpensePersonalLoansFetched} listAction={'Dream'} personalloansList={expensePersonalLoans} />
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
                                                Other Future Expenses ({expenseOtherCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.ExpenseOther, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ExpenseOtherList ref={expenseOtherListRef} onOthersFetched={handleExpenseOthersFetched} listAction={'Dream'} othersList={expenseOthers} vehiclesList={null} />
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
                                                Current EMI's - Property/Vehicle/Dreams ({emiCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.EMI, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <EMIList ref={emiListRef} onEMIsFetched={handleEMIsFetched} showDreams={true} propertiesList={assetProperties} vehiclesList={assetVehicles} dreamsList={dreams} />
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
                                                Current SIP's - Investment Portfolios ({sipCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListRecurring.reduce((acc, curr) => acc + curr.SIP, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <SIPList ref={sipListRef} onSIPsFetched={handleSIPsFetched} showDreams={true} depositsList={assetDeposits} portfoliosList={assetPortfolios} otherAssetsList={assetOthers} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </>
                        )}
                        {tabIndex === 2 && (
                            <>
                                <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                                    <DreamsGraph dreamsList={dreamsListIncome} graphType={'income'} />
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box></Box>
                                <Box>
                                    <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <AttachMoneyOutlinedIcon sx={{ mr: 1, color: 'blue' }} />
                                                Future Income ({incomeCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Income, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AssetIncomeList ref={incomeListRef} onIncomesFetched={handleIncomesFetched} listAction={'Dream'} incomesList={incomes} />
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
                                                Rental Income ({rentalIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Rental, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <RentalIncomeList propertiesList={assetProperties} showDreams={true}/>
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
                                                Lease Income ({leaseIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Lease, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <LeaseIncomeList vehiclesList={assetVehicles} showDreams={true}/>
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
                                                Dividend Income ({dividendIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Dividend, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DividendIncomeList portfoliosList={assetPortfolios} showDreams={true}/>
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
                                                Coupon Income ({couponIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Coupon, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <CouponIncomeList portfoliosList={assetPortfolios} showDreams={true}/>
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
                                                Payout Income ({payoutIncomeCount})  -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsListIncome.reduce((acc, curr) => acc + curr.Payout, 0))}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <PayoutIncomeList otherAssetsList={assetOthers} showDreams={true}/>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </>
                        )}
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
                <Box sx={{ width: 350, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Dream
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'white' }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        {/* Asset Dreams */}
                        <Box sx={{ width: '100%' }}>
                            <Typography id="modal-title" variant="body1" component="h2" sx={{ color: 'white' }}>Future Assets</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Property')}
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Buy Property</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={handleSellPropertyClick}
                        >
                            <SellIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Sell Property</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Vehicle')}
                        >
                            <DirectionsCarIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Buy Vehicle</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={handleSellVehicleClick}
                        >
                            <SellIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Sell Vehicle</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Account')}
                        >
                            <AccountBalanceOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Account</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Deposit')}
                        >
                            <SavingsOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Deposit</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Portfolio')}
                        >
                            <ShowChartOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Portfolio</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Asset Other')}
                        >
                            <FolderSpecialOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Asset</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Income')}
                        >
                            <AttachMoneyOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Future Income</Typography>
                        </Box>

                        {/* Expense Dreams */}
                        <Box sx={{ width: '100%' }}>
                            <Divider sx={{ my: 2, borderColor: 'white' }} />
                            <Typography id="modal-title" variant="body1" component="h2" sx={{ color: 'white' }}>Future Expenses</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Home Expense')}
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Home Expense</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Property Expense')}
                        >
                            <ApartmentIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Property Expense</Typography>
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

                        {/* Other Dreams */}
                        <Box sx={{ width: '100%' }}>
                            <Divider sx={{ my: 2, borderColor: 'white' }} />
                            <Typography id="modal-title" variant="body1" component="h2" sx={{ color: 'white' }}>Other Dreams</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Education')}
                        >
                            <SchoolIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Education</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Travel')}
                        >
                            <FlightIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Travel</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Relocation')}
                        >
                            <MovingIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Relocation</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Other Dream')}
                        >
                            <MiscellaneousServicesIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Dream</Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Dialog
                open={confirmDialogOpen}
                onClose={() => handleConfirmDialogClose(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Existing property or vehicle sale values can be updated from the Property or Vehicle assets. Do you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDialogClose(true)} color="primary" autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
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
                    {/* for asset dreams */}
                    {dreamAction === 'Add Asset Property' && (
                        <AssetPropertyForm property={null} action={'Dream'} onClose={handleFormModalClose} refreshPropertyList={handleAssetPropertyAdded} />
                    )}
                    {dreamAction === 'Add Asset Vehicle' && (
                        <AssetVehicleForm vehicle={null} action={'Dream'} onClose={handleFormModalClose} refreshVehicleList={handleAssetVehicleAdded} />
                    )}
                    {dreamAction === 'Add Asset Account' && (
                        <AssetAccountForm account={null} action={'Dream'} onClose={handleFormModalClose} refreshAccountList={handleAssetAccountAdded} />
                    )}
                    {dreamAction === 'Add Asset Deposit' && (
                        <AssetDepositForm deposit={null} action={'Dream'} onClose={handleFormModalClose} refreshDepositList={handleAssetDepositAdded} />
                    )}
                    {dreamAction === 'Add Asset Portfolio' && (
                        <AssetPortfolioForm portfolio={null} action={'Dream'} onClose={handleFormModalClose} refreshPortfolioList={handleAssetPortfolioAdded} />
                    )}
                    {dreamAction === 'Add Asset Other' && (
                        <AssetOtherForm other={null} action={'Dream'} onClose={handleFormModalClose} refreshOtherList={handleAssetOtherAdded} />
                    )}
                    {dreamAction === 'Add Income' && (
                        <AssetIncomeForm income={null} action={'Dream'} onClose={handleFormModalClose} refreshIncomeList={handleIncomeAdded} />
                    )}
                    {/* for expense dreams */}
                    {dreamAction === 'Add Home Expense' && (
                        <ExpenseHomeForm home={null} action={'Dream'} onClose={handleFormModalClose} refreshHomeList={handleExpenseHomeAdded} />
                    )}
                    {dreamAction === 'Add Property Expense' && (
                        <ExpensePropertyForm property={null} action={'Dream'} onClose={handleFormModalClose} refreshPropertyList={handleExpensePropertyAdded} />
                    )}
                    {dreamAction === 'Add Credit Card Debt' && (
                        <ExpenseCreditCardDebtForm creditcarddebt={null} action={'Dream'} onClose={handleFormModalClose} refreshCreditCardDebtList={handleExpenseCreditCardDebtAdded} />
                    )}
                    {dreamAction === 'Add Personal Loan' && (
                        <ExpensePersonalLoanForm personalloan={null} action={'Dream'} onClose={handleFormModalClose} refreshPersonalLoanList={handleExpensePersonalLoanAdded} />
                    )}
                    {dreamAction === 'Add Other Expense' && (
                        <ExpenseOtherForm other={null} action={'Dream'} onClose={handleFormModalClose} refreshOtherList={handleExpenseOtherAdded} />
                    )}
                    {/* for dreams */}
                    {dreamAction === 'Add Education' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleEducationAdded} dreamType={'Education'} />
                    )}
                    {dreamAction === 'Add Travel' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleTravelAdded} dreamType={'Travel'}/>
                    )}
                    {dreamAction === 'Add Relocation' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleRelocationAdded} dreamType={'Relocation'}/>
                    )}
                    {dreamAction === 'Add Other Dream' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleOtherAdded} dreamType={'Other'}/>
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

export default Dreams;