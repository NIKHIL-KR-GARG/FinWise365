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
import { getMonthEndDate } from '../../components/common/DateFunctions';
import { GrowthRate } from '../common/DefaultValues';
import AssetsCashflow from '../../components/cashflowpage/AssetsCashflow';

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

                    // check and adjust the year, month and age
                    if (month === 12) {
                        month = 1;
                        year += 1;
                        age += 1;
                    }
                    else month += 1;
                }

                setAssetsCashflowData(assetsCashflow);
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
                <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper', width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SavingsOutlinedIcon sx={{ mr: 1, color: 'green' }} />
                                Net Worth
                            </Box>
                        </Typography>
                        {/* <AssetsCashflow assetsCashflowData={assetsCashflowData}/> */}
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
                        <AssetsCashflow assetsCashflowData={assetsCashflowData}/>
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
    );
};

export default GenerateCashflows;