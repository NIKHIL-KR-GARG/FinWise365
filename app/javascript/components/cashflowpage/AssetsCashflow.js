import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Snackbar, Alert, IconButton, CircularProgress, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import { propertyAssetValue, vehicleAssetValue, accountAssetValue, depositAssetValue, portfolioAssetValue, otherAssetValue, incomeAssetValue, incomePropertyRentalAssetValue, incomeCouponAssetValue, incomeDividendAssetValue, incomePayoutAssetValue, incomeLeaseAssetValue } from '../../components/calculators/Assets';
// import FormatCurrency from '../../components/common/FormatCurrency';
import { getMonthEndDate, FormatCurrencyForGrid } from '../../components/common/DateFunctions';
import { GrowthRate } from '../common/DefaultValues';

const AssetsCashflow = () => {

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = parseInt(localStorage.getItem('currentUserLifeExpectancy'));
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserDateOfBirth = new Date(localStorage.getItem('currentUserDateOfBirth'));

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

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

                // fetch all the data
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

    const chartData = () => {
        const yearlyData = assetsCashflowData.filter(data => data.month === 12).reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { total: 0, property: 0, vehicle: 0, account: 0, deposit: 0, portfolio: 0, income: 0, rentalIncome: 0, couponIncome: 0, dividendIncome: 0, payoutIncome: 0, leaseIncome: 0, disposableCash: 0, age: curr.age };
            }
            acc[year].total += curr.asset_value;
            if (curr.asset_type === 'Property') {
                acc[year].property += curr.asset_value;
            }
            if (curr.asset_type === 'Vehicle') {
                acc[year].vehicle += curr.asset_value;
            }
            if (curr.asset_type === 'Account') {
                acc[year].account += curr.asset_value;
            }
            if (curr.asset_type === 'Deposit') {
                acc[year].deposit += curr.asset_value;
            }
            if (curr.asset_type === 'Portfolio') {
                acc[year].portfolio += curr.asset_value;
            }
            if (curr.asset_type === 'Income') {
                acc[year].income += curr.asset_value;
            }
            if (curr.asset_type === 'Rental Income') {
                acc[year].rentalIncome += curr.asset_value;
            }
            if (curr.asset_type === 'Coupon Income') {
                acc[year].couponIncome += curr.asset_value;
            }
            if (curr.asset_type === 'Dividend Income') {
                acc[year].dividendIncome += curr.asset_value;
            }
            if (curr.asset_type === 'Payout Income') {
                acc[year].payoutIncome += curr.asset_value;
            }
            if (curr.asset_type === 'Lease Income') {
                acc[year].leaseIncome += curr.asset_value;
            }
            if (curr.asset_type === 'Disposable Cash') {
                acc[year].disposableCash += curr.asset_value;
            }
            return acc;
        }, {});

        return Object.keys(yearlyData).map(year => ({
            year,
            yearWithAge: `${year} (${yearlyData[year].age})`,
            age: yearlyData[year].age,
            total: yearlyData[year].total.toFixed(2),
            property: yearlyData[year].property.toFixed(2),
            vehicle: yearlyData[year].vehicle.toFixed(2),
            account: yearlyData[year].account.toFixed(2),
            deposit: yearlyData[year].deposit.toFixed(2),
            portfolio: yearlyData[year].portfolio.toFixed(2),
            income: yearlyData[year].income.toFixed(2),
            rentalIncome: yearlyData[year].rentalIncome.toFixed(2),
            couponIncome: yearlyData[year].couponIncome.toFixed(2),
            dividendIncome: yearlyData[year].dividendIncome.toFixed(2),
            payoutIncome: yearlyData[year].payoutIncome.toFixed(2),
            leaseIncome: yearlyData[year].leaseIncome.toFixed(2),
            disposableCash: yearlyData[year].disposableCash.toFixed(2)
        }));
    };

    const columns = [
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'age', headerName: 'Age', width: 100 },
        ...['property', 'vehicle', 'account', 'deposit', 'portfolio', 'income', 'rentalIncome', 'couponIncome', 'dividendIncome', 'payoutIncome', 'leaseIncome', 'disposableCash', 'total'].map(type => ({
            field: type,
            headerName: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
            width: 125
        }))
    ];

    const rows = chartData().map((row, index) => ({
        id: index,
        year: row.year,
        age: row.age,
        property: row.property,
        vehicle: row.vehicle,
        account: row.account,
        deposit: row.deposit,
        portfolio: row.portfolio,
        income: row.income,
        rentalIncome: row.rentalIncome,
        couponIncome: row.couponIncome,
        dividendIncome: row.dividendIncome,
        payoutIncome: row.payoutIncome,
        leaseIncome: row.leaseIncome,
        disposableCash: row.disposableCash,
        total: row.total
    }));

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
                            backgroundColor: 'purple',
                            color: '#fff',
                        },
                    },
                }}
            >
                <Tab label="Assets Cashflow Chart" />
                <Tab label="Assets Cashflow Data" />
            </Tabs>
            {tabIndex === 0 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} p={2}>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="yearWithAge" tick={{ fontSize: 14 }} />
                                <YAxis tick={{ fontSize: 14 }} domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ fontSize: 14 }} />
                                <Legend wrapperStyle={{ fontSize: 14 }} />
                                <Line type="monotone" dataKey="total" stroke="#ff0000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="property" stroke="#82ca9d" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="vehicle" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="account" stroke="#0000ff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="deposit" stroke="#00ff00" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="portfolio" stroke="#ff00ff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="income" stroke="#00ffff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="rentalIncome" stroke="#ffa500" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="couponIncome" stroke="#800080" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dividendIncome" stroke="#008000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="payoutIncome" stroke="#000080" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="leaseIncome" stroke="#808000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="disposableCash" stroke="#800000" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 1 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} style={{ height: '40vh', width: '100%', overflow: 'auto' }}>
                    <Grid item size={12} display="flex" justifyContent="center" >
                        <TableContainer component={Paper}>
                            <Table stickyHeader sx={{ border: 1, borderColor: 'grey.400' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                                        {columns.map(column => (
                                            <TableCell key={column.field} sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>
                                                {column.headerName}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.id}>
                                            {columns.map(column => (
                                                <TableCell key={column.field} sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: column.field === 'year' || column.field === 'age' ? 'bold' : 'normal' }}>
                                                    {column.field === 'year' || column.field === 'age' ? row[column.field] : FormatCurrencyForGrid(parseFloat(row[column.field]), currentUserBaseCurrency)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
    </Box>
);
};

export default AssetsCashflow;