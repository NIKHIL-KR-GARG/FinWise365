import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import { FormatCurrencyForGrid } from '../../components/common/FormatCurrency';

const NetCashflow = ({ netCashflowData }) => {

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const chartData = () => {
        const yearlyData = netCashflowData.filter(data => data.month === 12).reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { income: 0, expense: 0, net_position: 0, liquid_assets: 0, locked_assets: 0, net_worth: 0, age: curr.age };
            }
            acc[year].income = curr.income;
            acc[year].expense = curr.expense;
            acc[year].net_position = curr.net_position;
            acc[year].liquid_assets = curr.liquid_assets;
            acc[year].locked_assets = curr.locked_assets;
            acc[year].net_worth = curr.net_worth;
            return acc;
        }, {});

        const formattedData = Object.keys(yearlyData).map(year => ({
            year,
            yearWithAge: `${year} (${yearlyData[year].age})`,
            age: yearlyData[year].age,
            income: yearlyData[year].income.toFixed(2),
            expense: yearlyData[year].expense.toFixed(2),
            net_position: yearlyData[year].net_position.toFixed(2),
            liquid_assets: yearlyData[year].liquid_assets.toFixed(2),
            locked_assets: yearlyData[year].locked_assets.toFixed(2),
            net_worth: yearlyData[year].net_worth.toFixed(2),
        }));

        return formattedData;
    };

    const columns = [
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'age', headerName: 'Age', width: 100 },
        ...['income', 'expense', 'net_position', 'liquid_assets', 'locked_assets', 'net_worth'].map(type => ({
            field: type,
            headerName: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
            width: 125
        }))
    ];

    const rows = chartData().map((row, index) => ({
        id: index,
        year: row.year,
        age: row.age,
        income: row.income,
        expense: row.expense,
        net_position: row.net_position,
        liquid_assets: row.liquid_assets,
        locked_assets: row.locked_assets,
        net_worth: row.net_worth
    }));

    return (
        <Box>
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
                <Tab label="Net Cashflow Chart" />
                <Tab label="Net Cashflow Data" />
            </Tabs>
            {tabIndex === 0 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} p={2}>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '30vh' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="yearWithAge" tick={{ fontSize: 14 }} />
                                <YAxis tick={{ fontSize: 14 }} domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ fontSize: 14 }} />
                                <Legend wrapperStyle={{ fontSize: 14 }} />
                                <Line type="monotone" dataKey="income" stroke="#1f77b4" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="expense" stroke="#ff7f0e" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="net_position" stroke="#2ca02c" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="liquid_assets" stroke="#d62728" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="locked_assets" stroke="#9467bd" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="net_worth" stroke="#8c564b" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 1 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} 
                        borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} style={{ height: '30vh', width: '100%', overflow: 'auto' }}
                >
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
                                                <TableCell key={column.field} sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: column.field === 'year' || column.field === 'age' ? 'bold' : 'normal', color: parseFloat(row[column.field]) < 0 ? 'red' : 'inherit' }}>
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

export default NetCashflow;