import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormatCurrencyForGrid } from '../../components/common/FormatCurrency';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const AssetsCashflow = ({ assetsCashflowData }) => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const chartData = () => {
        const yearlyData = assetsCashflowData.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { total: 0, property: 0, vehicle: 0, account: 0, deposit: 0, portfolio: 0, income: 0, otherAsset: 0, rentalIncome: 0, couponIncome: 0, dividendIncome: 0, payoutIncome: 0, leaseIncome: 0, disposableCash: 0, age: curr.age };
            }
            if (curr.asset_type === 'Income' || curr.asset_type === 'Rental Income' || 
                curr.asset_type === 'Coupon Income' || curr.asset_type === 'Dividend Income' || 
                curr.asset_type === 'Payout Income' || curr.asset_type === 'Lease Income') {
                acc[year].income += curr.original_asset_value;
                if (curr.month === 12) {
                    acc[year].total += curr.asset_value;
                    acc[year].disposableCash += curr.asset_value;
                }
            }
            else if (curr.month === 12) {
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
                if (curr.asset_type === 'Other') {
                    acc[year].otherAsset += curr.asset_value;
                }
                if (curr.asset_type === 'Disposable Cash') {
                    acc[year].disposableCash += curr.asset_value;
                }
                acc[year].total += curr.asset_value;
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
            otherAsset: yearlyData[year].otherAsset.toFixed(2),
            disposableCash: yearlyData[year].disposableCash.toFixed(2)
        }));
    };

    // const maxTotalValue = (Math.max(...chartData().map(data => parseFloat(data.total).toFixed(0))) + 1);

    const tableData = () => {
        const yearlyData = assetsCashflowData.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { total: 0, property: 0, vehicle: 0, account: 0, deposit: 0, portfolio: 0, income: 0, otherAsset: 0, rentalIncome: 0, couponIncome: 0, dividendIncome: 0, payoutIncome: 0, leaseIncome: 0, disposableCash: 0, age: curr.age };
            }
            if (curr.asset_type === 'Income' || curr.asset_type === 'Rental Income' ||
                curr.asset_type === 'Coupon Income' || curr.asset_type === 'Dividend Income' ||
                curr.asset_type === 'Payout Income' || curr.asset_type === 'Lease Income') {
                if (curr.asset_type === 'Income') {
                    acc[year].income += curr.original_asset_value;
                }
                if (curr.asset_type === 'Rental Income') {
                    acc[year].rentalIncome += curr.original_asset_value;
                }
                if (curr.asset_type === 'Coupon Income') {
                    acc[year].couponIncome += curr.original_asset_value;
                }
                if (curr.asset_type === 'Dividend Income') {
                    acc[year].dividendIncome += curr.original_asset_value;
                }
                if (curr.asset_type === 'Payout Income') {
                    acc[year].payoutIncome += curr.original_asset_value;
                }
                if (curr.asset_type === 'Lease Income') {
                    acc[year].leaseIncome += curr.original_asset_value;
                }
                if (curr.month === 12) {
                    acc[year].total += curr.asset_value;
                    acc[year].disposableCash += curr.asset_value;
                }
            }
            else if (curr.month === 12) {
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
                if (curr.asset_type === 'Other') {
                    acc[year].otherAsset += curr.asset_value;
                }
                if (curr.asset_type === 'Disposable Cash') {
                    acc[year].disposableCash += curr.asset_value;
                }
                acc[year].total += curr.asset_value;
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
            otherAsset: yearlyData[year].otherAsset.toFixed(2),
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
        ...['property', 'vehicle', 'account', 'deposit', 'portfolio', 'income', 'otherAsset', 'rentalIncome', 'couponIncome', 'dividendIncome', 'payoutIncome', 'leaseIncome', 'disposableCash', 'total'].map(type => ({
            field: type,
            headerName: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
            width: 125
        }))
    ];

    const rows = tableData().map((row, index) => ({
        id: index,
        year: row.year,
        age: row.age,
        property: row.property,
        vehicle: row.vehicle,
        account: row.account,
        deposit: row.deposit,
        portfolio: row.portfolio,
        income: row.income,
        otherAsset: row.otherAsset,
        rentalIncome: row.rentalIncome,
        couponIncome: row.couponIncome,
        dividendIncome: row.dividendIncome,
        payoutIncome: row.payoutIncome,
        leaseIncome: row.leaseIncome,
        disposableCash: row.disposableCash,
        total: row.total
    }));

    const getYAxisDomain = (data) => {
        const values = data.flatMap(d => [
            parseFloat(d.total),
            parseFloat(d.property),
            parseFloat(d.vehicle),
            parseFloat(d.account),
            parseFloat(d.deposit),
            parseFloat(d.portfolio),
            parseFloat(d.income),
            parseFloat(d.otherAsset),
            parseFloat(d.disposableCash)
        ]);
        return [Math.min(...values), Math.max(...values)];
    };

    const formatYAxisTick = (tick) => {
        if (Math.abs(tick) >= 1e9) {
            return `${(tick / 1e9).toFixed(1)}B`;
        } else if (Math.abs(tick) >= 1e6) {
            return `${(tick / 1e6).toFixed(1)}M`;
        } else if (Math.abs(tick) >= 1e3) {
            return `${(tick / 1e3).toFixed(1)}K`;
        }
        return tick.toFixed(1);
    };

    const yAxisDomain = getYAxisDomain(chartData());

    return (
        <Box>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                orientation={isMobile ? "vertical" : "horizontal"} // Set orientation based on screen size
                centered={!isMobile} // Adjust centering based on screen size
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        margin: isMobile ? '4px 0' : 1, // Adjust margin based on screen size
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
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#e0f7fa" borderRadius={2} p={2}>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: isMobile ? '30vh' : '40vh' }}>
                        <ResponsiveContainer width="95%" height="100%">
                            <LineChart data={chartData()}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="age" tick={{ fontSize: isMobile ? 10 : 14 }} interval={isMobile ? 5 : 1} label={{ value: 'Age', position: 'insideBottomRight', offset: -5, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                                <YAxis tick={{ fontSize: isMobile ? 10 : 14 }} domain={yAxisDomain} tickCount={15} interval={0} tickFormatter={formatYAxisTick} label={{ value: `${currentUserBaseCurrency} Value`, angle: -90, position: 'insideLeft', offset: 0, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                                <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 14 }} />
                                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
                                <Line type="monotone" dataKey="total" stroke="#ff0000" strokeWidth={3} activeDot={{ r: 8 }} name="Total Assets" />
                                <Line type="monotone" dataKey="property" stroke="#82ca9d" strokeWidth={1} activeDot={{ r: 8 }} name="Properties"/>
                                <Line type="monotone" dataKey="vehicle" stroke="#8884d8" strokeWidth={1} activeDot={{ r: 8 }} name="Vehicles"/>
                                <Line type="monotone" dataKey="account" stroke="#0000ff" strokeWidth={1} activeDot={{ r: 8 }} name="Accounts"/>
                                <Line type="monotone" dataKey="deposit" stroke="#ffcc00" strokeWidth={1} activeDot={{ r: 8 }} name="Deposits"/>
                                <Line type="monotone" dataKey="income" stroke="#ff6699" strokeWidth={1} activeDot={{ r: 8 }} name="Incomes"/>
                                <Line type="monotone" dataKey="portfolio" stroke="#ff00ff" strokeWidth={1} activeDot={{ r: 8 }} name="Portfolios"/>
                                <Line type="monotone" dataKey="otherAsset" stroke="#ff6600" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="disposableCash" stroke="#800000" strokeWidth={1} activeDot={{ r: 8 }} name="Disposable Cash"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 1 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} style={{ height: isMobile ? '30vh' : '40vh', width: '100%', overflow: 'auto' }}>
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