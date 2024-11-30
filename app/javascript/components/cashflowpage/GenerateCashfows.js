import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Snackbar, Alert, IconButton, CircularProgress, Typography } from '@mui/material';
// import Grid from '@mui/material/Grid2';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';

import { propertyAssetValue, vehicleAssetValue, accountAssetValue, depositAssetValue, portfolioAssetValue, otherAssetValue, incomeAssetValue, incomePropertyRentalAssetValue, incomeCouponAssetValue, incomeDividendAssetValue, incomePayoutAssetValue, incomeLeaseAssetValue } from '../../components/calculators/Assets';
import { homeExpense, propertyExpense, creditCardDebtExpense, personalLoanExpense, otherExpense, emiExpenseProperty, emiExpenseVehicle, sipExpenseDeposit, sipExpensePortfolio, sipExpenseOtherAsset, taxExpenseProperty, maintananeExpenseProperty, otherExpenseVehicle } from '../../components/calculators/Expenses';
import { propertyDreamExpense, vehicleDreamExpense, educationDreamExpense, travelDreamExpense, relocationDreamExpense, otherDreamExpense } from '../../components/calculators/Dreams';

import { getMonthEndDate } from '../../components/common/DateFunctions';
import { GrowthRate } from '../common/DefaultValues';
import AssetsCashflow from '../../components/cashflowpage/AssetsCashflow';
import LiabilitiesCashflow from '../../components/cashflowpage/LiabilitiesCashflow';

const GenerateCashflows = () => {

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = parseInt(localStorage.getItem('currentUserLifeExpectancy'));
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserDateOfBirth = new Date(localStorage.getItem('currentUserDateOfBirth'));

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [assetsCashflowData, setAssetsCashflowData] = useState([]);
    let assetsCashflow = [];

    const [liabilitiesCashflowData, setLiabilitiesCashflowData] = useState([]);
    let liabilitiesCashflow = [];

    const insertAssetCashflow = (asset_type, object, month, year, age, monthEndDate, currentUserBaseCurrency) => {

        let assetValue = 0.0;
        let assetName = '';

        if (asset_type === 'Property') {
            assetValue = parseFloat(propertyAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.property_name;
        }
        else if (asset_type === 'Vehicle') {
            assetValue = parseFloat(vehicleAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.vehicle_name;
        }
        else if (asset_type === 'Account') {
            assetValue = parseFloat(accountAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.account_name;
        }
        else if (asset_type === 'Deposit') {
            assetValue = parseFloat(depositAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.deposit_name;
        }
        else if (asset_type === 'Portfolio') {
            assetValue = parseFloat(portfolioAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.portfolio_name;
        }
        else if (asset_type === 'Other') {
            assetValue = parseFloat(otherAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.asset_name;
        }
        else if (asset_type === 'Income') {
            assetValue = parseFloat(incomeAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.income_name;
        }
        else if (asset_type === 'Rental Income') {
            assetValue = parseFloat(incomePropertyRentalAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = 'Rental Income - ' + object.property_name;
        }
        else if (asset_type === 'Coupon Income') {
            assetValue = parseFloat(incomeCouponAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = 'Coupon Income - ' + object.portfolio_name;
        }
        else if (asset_type === 'Dividend Income') {
            assetValue = parseFloat(incomeDividendAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = 'Dividend Income - ' + object.portfolio_name;
        }
        else if (asset_type === 'Payout Income') {
            assetValue = parseFloat(incomePayoutAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = object.asset_name;
        }
        else if (asset_type === 'Lease Income') {
            assetValue = parseFloat(incomeLeaseAssetValue(object, monthEndDate, currentUserBaseCurrency));
            assetName = 'Lease Income - ' + object.vehicle_name;
        }

        // push to assetsCashflow array
        assetsCashflow.push({
            month: month,
            year: year,
            age: age,
            asset_id: object.id,
            asset_type: asset_type,
            asset_name: assetName,
            asset_value: assetValue
        });

        // check if this asset has been sold or closed in the last month
        // if yes, then add the sale/closure value i.e. last month's cashflow value to disposable income line
        if (!assetValue || assetValue === 0) {
            // find the last month's cashflow value for this asset
            const lastMonthCashflow = assetsCashflow.find(
                (cashflow) =>
                    cashflow.month === ((month === 1) ? 12 : month - 1) &&
                    cashflow.year === ((month === 1) ? year - 1 : year) &&
                    cashflow.asset_id === object.id &&
                    cashflow.asset_type === asset_type
            );

            if (lastMonthCashflow && parseFloat(lastMonthCashflow.asset_value) > 0) {
                updateDisposableCashflow(month, year, age, parseFloat(lastMonthCashflow.asset_value));
            }
        }
    }

    const updateDisposableCashflow = (month, year, age, assetValue) => {

        const defaultGrowthRate = parseFloat(GrowthRate.find((rate) => rate.key === currentUserCountryOfResidence).value || 0);
        const currentAssetValue = assetValue + (assetValue * (defaultGrowthRate / 100) / 12);

        const thisMonthDisposableCash = assetsCashflow.find(
            (cashflow) =>
                cashflow.month === month &&
                cashflow.year === year &&
                cashflow.asset_id === -1 &&
                cashflow.asset_type === 'Disposable Cash'
        );
        if (thisMonthDisposableCash) {
            // add the sale value to disposable cash line
            thisMonthDisposableCash.asset_value += parseFloat(currentAssetValue);
        }
        else {
            // add a new line for disposable cash
            assetsCashflow.push({
                month: month,
                year: year,
                age: age,
                asset_id: -1,
                asset_type: 'Disposable Cash',
                asset_name: 'Disposable Cash',
                asset_value: parseFloat(currentAssetValue)
            });
        }
    }

    const insertLiabilityCashflow = (liability_type, object, month, year, age, monthEndDate, currentUserBaseCurrency) => {

        let liabilityValue = 0.0;
        let liabilityName = '';

        if (liability_type === 'Home') {
            liabilityValue = parseFloat(homeExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = object.home_name;
        }
        else if (liability_type === 'Property') {
            liabilityValue = parseFloat(propertyExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = object.property_name;
        }
        else if (liability_type === 'Credit Card Debt') {
            liabilityValue = parseFloat(creditCardDebtExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = object.card_name;
        }
        else if (liability_type === 'Personal Loan') {
            liabilityValue = parseFloat(personalLoanExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = object.loan_name;
        }
        else if (liability_type === 'Other Expense') {
            liabilityValue = parseFloat(otherExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = object.expense_name;
        }
        else if (liability_type === 'Property EMI') {
            liabilityValue = parseFloat(emiExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'EMI - ' + object.property_name;
        }
        else if (liability_type === 'Vehicle EMI') {
            liabilityValue = parseFloat(emiExpenseVehicle(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'EMI - ' + object.vehicle_name;
        }
        else if (liability_type === 'Deposit SIP') {
            liabilityValue = parseFloat(sipExpenseDeposit(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'SIP - ' + object.deposit_name;
        }
        else if (liability_type === 'Portfolio SIP') {
            liabilityValue = parseFloat(sipExpensePortfolio(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'SIP - ' + object.portfolio_name;
        }
        else if (liability_type === 'Other SIP') {
            liabilityValue = parseFloat(sipExpenseOtherAsset(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'SIP - ' + object.asset_name;
        }
        else if (liability_type === 'Property Tax') {
            liabilityValue = parseFloat(taxExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Tax - ' + object.property_name;
        }
        else if (liability_type === 'Property Maintenance') {
            liabilityValue = parseFloat(maintananeExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Maintenance - ' + object.property_name;
        }
        else if (liability_type === 'Vehicle Expense') {
            liabilityValue = parseFloat(otherExpenseVehicle(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Vehicle Expense - ' + object.vehicle_name;
        }
        else if (liability_type === 'Vehicle Dream') {
            liabilityValue = parseFloat(vehicleDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Vehicle - ' + object.vehicle_name;
        }
        else if (liability_type === 'Property Dream') {
            liabilityValue = parseFloat(propertyDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Property - ' + object.property_name;
        }
        else if (liability_type === 'Education Dream') {
            liabilityValue = parseFloat(educationDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Education - ' + object.dream_name;
        }
        else if (liability_type === 'Travel Dream') {
            liabilityValue = parseFloat(travelDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Travel - ' + object.dream_name;
        }
        else if (liability_type === 'Relocation Dream') {
            liabilityValue = parseFloat(relocationDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Relocation - ' + object.dream_name;
        }
        else if (liability_type === 'Other Dream') {
            liabilityValue = parseFloat(otherDreamExpense(object, monthEndDate, currentUserBaseCurrency));
            liabilityName = 'Dream Other - ' + object.dream_name;
        }

        // push to liabilitysCashflow array
        liabilitiesCashflow.push({
            month: month,
            year: year,
            age: age,
            liability_id: object.id,
            liability_type: liability_type,
            liability_name: liabilityName,
            liability_value: liabilityValue
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (!currentUserLifeExpectancy || !currentUserCountryOfResidence || !currentUserDateOfBirth) {
                    setErrorMessage('Please set life expectancy, country of residence and date of birth in your profile');
                    setLoading(false);
                    return;
                }

                // fetch all the assets data
                const [propertiesResponse, vehiclesResponse, accountsResponse,
                    depositsResponse, incomesResponse, portfoliosResponse,
                    othersResponse] = await Promise.all([
                        axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_accounts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_deposits?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_incomes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                        axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                    ]);

                const properties = propertiesResponse.data;
                const vehicles = vehiclesResponse.data;
                const accounts = accountsResponse.data;
                const deposits = depositsResponse.data;
                const incomes = incomesResponse.data;
                const portfolios = portfoliosResponse.data;
                const others = othersResponse.data;

                // fetch all the expenses data
                const [homesResponse, expensePropertiesResponse, creditCardDebtsResponse, 
                    personalLoansResponse, expenseOthersResponse] = await Promise.all([
                    axios.get(`/api/expense_homes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_personal_loans?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                    axios.get(`/api/expense_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`),
                ]);

                const homes = homesResponse.data;
                const expenseProperties = expensePropertiesResponse.data;
                const creditCardDebts = creditCardDebtsResponse.data;
                const personalLoans = personalLoansResponse.data;
                const expenseOthers = expenseOthersResponse.data;

                // fetch all the dreams data
                const dreamsResponse = await axios.get(`/api/dreams?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData==='true'}`)

                const dreams = dreamsResponse.data;
                // filter dreams where dream_type = 'Education' or 'Travel' or 'Relocation' or 'Other'
                const educations = dreams.filter(dream => dream.dream_type === 'Education');
                const travels= dreams.filter(dream => dream.dream_type === 'Travel');
                const relocations = dreams.filter(dream => dream.dream_type === 'Relocation');
                const otherDreams = dreams.filter(dream => dream.dream_type === 'Other');

                const today = new Date();
                // derive current age
                const dob = new Date(currentUserDateOfBirth);
                const ageDifMs = today - dob;
                let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);

                let month = today.getMonth() + 1; // Add 1 to get the correct month number
                let year = today.getUTCFullYear();
                const projectionYears = currentUserLifeExpectancy - age;
                const projectionMonths = (projectionYears * 12) + (12 - month + 1);

                // loop from current month to end month of life expectancy
                for (let i = 1; i <= projectionMonths; i++) {
                    // derive the month end date for the month and year
                    const monthEndDate = getMonthEndDate(month, year);

                    // ----------------- start section for assets cashflow calculation -----------------

                    // check if there is a disposable cash line for previous month
                    // if yes, then calculate the growth rate and add the growth to the disposable cash for this month
                    const lastMonthDisposableCash = assetsCashflow.find(
                        (cashflow) =>
                            cashflow.month === ((month === 1) ? 12 : month - 1) &&
                            cashflow.year === ((month === 1) ? year - 1 : year) &&
                            cashflow.asset_id === -1 &&
                            cashflow.asset_type === 'Disposable Cash'
                    );
                    if (lastMonthDisposableCash && parseFloat(lastMonthDisposableCash.asset_value) > 0) {
                        const defaultGrowthRate = parseFloat(GrowthRate.find((rate) => rate.key === currentUserCountryOfResidence).value || 0);
                        const disposableCashValue = parseFloat(lastMonthDisposableCash.asset_value) + (parseFloat(lastMonthDisposableCash.asset_value) * (defaultGrowthRate / 100) / 12);
                        // add a new line for disposable cash
                        assetsCashflow.push({
                            month: month,
                            year: year,
                            age: age,
                            asset_id: -1,
                            asset_type: 'Disposable Cash',
                            asset_name: 'Disposable Cash',
                            asset_value: disposableCashValue
                        });
                    }

                    // loop through all the assets and calculate the cashflow for each month
                    // get value of all the properties as of this month
                    for (let j = 0; j < properties.length; j++) {
                        const property = properties[j];
                        insertAssetCashflow('Property', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the vehicles as of this month
                    for (let j = 0; j < vehicles.length; j++) {
                        const vehicle = vehicles[j];
                        insertAssetCashflow('Vehicle', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the accounts as of this month
                    for (let j = 0; j < accounts.length; j++) {
                        const account = accounts[j];
                        insertAssetCashflow('Account', account, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the deposits as of this month
                    for (let j = 0; j < deposits.length; j++) {
                        const deposit = deposits[j];
                        insertAssetCashflow('Deposit', deposit, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the portfolios as of this month
                    for (let j = 0; j < portfolios.length; j++) {
                        const portfolio = portfolios[j];
                        insertAssetCashflow('Portfolio', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the other assets as of this month
                    for (let j = 0; j < others.length; j++) {
                        const other = others[j];
                        insertAssetCashflow('Other', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get value of all the incomes as of this month
                    for (let j = 0; j < incomes.length; j++) {
                        const income = incomes[j];
                        insertAssetCashflow('Income', income, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add rental as income as well
                    for (let j = 0; j < properties.length; j++) {
                        const property = properties[j];
                        if (property.is_on_rent)
                            insertAssetCashflow('Rental Income', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add coupon as income as well
                    // add dividend as income as well
                    for (let j = 0; j < portfolios.length; j++) {
                        const portfolio = portfolios[j];
                        if (portfolio.portfolio_type === 'Bonds')
                            insertAssetCashflow('Coupon Income', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                        else if (portfolio.is_paying_dividend)
                            insertAssetCashflow('Dividend Income', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add payout as income as well
                    for (let j = 0; j < others.length; j++) {
                        const other = others[j];
                        if (other.payout_type === 'Recurring')
                            insertAssetCashflow('Payout Income', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add vehicle lease as income as well
                    for (let j = 0; j < vehicles.length; j++) {
                        const vehicle = vehicles[j];
                        if (vehicle.is_on_lease)
                            insertAssetCashflow('Lease Income', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }

                    // ----------------- end section for assets cashflow calculation -----------------

                    // ----------------- start section for liabilities cashflow calculation -----------------
                    // get all the home expenses for the month
                    for (let j = 0; j < homes.length; j++) {
                        let home = homes[j];
                        insertLiabilityCashflow('Home', home, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the property expenses for the month
                    for (let j = 0; j < expenseProperties.length; j++) {
                        let property = expenseProperties[j];
                        insertLiabilityCashflow('Property', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add maintenance from asset properties
                    for (let j = 0; j < properties.length; j++) {
                        let property = properties[j];
                        insertLiabilityCashflow('Property Maintenance', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the credit card debts expenses for the month
                    for (let j = 0; j < creditCardDebts.length; j++) {
                        let creditCardDebt = creditCardDebts[j];
                        insertLiabilityCashflow('Credit Card Debt', creditCardDebt, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the personal loans expenses for the month
                    for (let j = 0; j < personalLoans.length; j++) {
                        let personalLoan = personalLoans[j];
                        insertLiabilityCashflow('Personal Loan', personalLoan, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the other expenses for the month
                    for (let j = 0; j < expenseOthers.length; j++) {
                        let other = expenseOthers[j];
                        insertLiabilityCashflow('Other Expense', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // add monthly expense from asset vehicles
                    for (let j = 0; j < vehicles.length; j++) {
                        let vehicle = vehicles[j];
                        insertLiabilityCashflow('Vehicle Expense', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the emi expenses for the month
                    for (let j = 0; j < vehicles.length; j++) {
                        let vehicle = vehicles[j];
                        insertLiabilityCashflow('Vehicle EMI', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    for (let j = 0; j < properties.length; j++) {
                        let property = properties[j];
                        insertLiabilityCashflow('Property EMI', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the sip expenses for the month
                    for (let j = 0; j < deposits.length; j++) {
                        let deposit = deposits[j];
                        insertLiabilityCashflow('Deposit SIP', deposit, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    for (let j = 0; j < portfolios.length; j++) {
                        let portfolio = portfolios[j];
                        insertLiabilityCashflow('Portfolio SIP', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    for (let j = 0; j < others.length; j++) {
                        let other = others[j];
                        insertLiabilityCashflow('Other SIP', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get all the tax expenses for the month
                    for (let j = 0; j < properties.length; j++) {
                        let property = properties[j];
                        insertLiabilityCashflow('Property Tax', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }

                    // add expenses from the dreams to the expenses cashflow
                    // get expenses for buying a property in the future
                    for (let j = 0; j < properties.length; j++) {
                        let property = properties[j];
                        insertLiabilityCashflow('Property Dream', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get expenses for buying a vehicle in the future
                    for (let j = 0; j < vehicles.length; j++) {
                        let vehicle = vehicles[j];
                        insertLiabilityCashflow('Vehicle Dream', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get expenses for education in the future
                    for (let j = 0; j < educations.length; j++) {
                        let education = educations[j];
                        insertLiabilityCashflow('Education Dream', education, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get expenses for travel in the future
                    for (let j = 0; j < travels.length; j++) {
                        let travel = travels[j];
                        insertLiabilityCashflow('Travel Dream', travel, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get expenses for relocation in the future
                    for (let j = 0; j < relocations.length; j++) {
                        let relocation = relocations[j];
                        insertLiabilityCashflow('Relocation Dream', relocation, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    // get expenses for other dreams in the future
                    for (let j = 0; j < otherDreams.length; j++) {
                        let otherDream = otherDreams[j];
                        insertLiabilityCashflow('Other Dream', otherDream, month, year, age, monthEndDate, currentUserBaseCurrency);
                    }
                    
                    // ----------------- end section for liabilities cashflow calculation -----------------

                    // check and adjust the year, month and age
                    if (month === 12) {
                        month = 1;
                        year += 1;
                        age += 1;
                    }
                    else month += 1;
                }

                setAssetsCashflowData(assetsCashflow);
                setLiabilitiesCashflowData(liabilitiesCashflow);
                setLoading(false);

            } catch (error) {
                // setErrorMessage('Error fetching data');
                setErrorMessage(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once

    if (loading) {
        return <CircularProgress />;
    }

    return (

        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
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
            <Box>
                <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} defaultExpanded>
                        <AccordionSummary
                            // expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <SavingsOutlinedIcon sx={{ mr: 1, color: 'green' }} />
                                Net Worth
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* <AssetsCashflow assetsCashflowData={assetsCashflowData}/> */}
                        </AccordionDetails>
                    </Accordion>
                <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} 
                // defaultExpanded
                >
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
                        <AssetsCashflow assetsCashflowData={assetsCashflowData}/>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} 
                // defaultExpanded
                >
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
                        <LiabilitiesCashflow liabilitiesCashflowData={liabilitiesCashflowData}/>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default GenerateCashflows;