import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormatCurrencyForGrid } from '../../components/common/FormatCurrency';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const NetCashflow = ({ netCashflowData }) => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const chartData = () => {
        const yearlyData = netCashflowData.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { income: 0, expense: 0, net_position: 0, liquid_assets: 0, locked_assets: 0, net_worth: 0, age: curr.age };
            }
            acc[year].income += curr.income;
            acc[year].expense += curr.expense;
            acc[year].net_position += curr.net_position;
            if (curr.month === 12) {
                acc[year].liquid_assets = curr.liquid_assets;
                acc[year].locked_assets = curr.locked_assets;
                acc[year].net_worth = curr.net_worth;
            }
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

    const getYAxisDomain = (data) => {
        const values = data.flatMap(d => [
            parseFloat(d.income),
            parseFloat(d.expense),
            parseFloat(d.net_position),
            parseFloat(d.liquid_assets),
            parseFloat(d.locked_assets),
            parseFloat(d.net_worth)
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
                orientation={isMobile ? "vertical" : "horizontal"} // Set orientation based on screen size
                centered={!isMobile} // Adjust centering based on screen size
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        margin: isMobile ? '4px 0' : 1, // Adjust margin based on screen size
                        // minWidth: isMobile ? 80 : 150, // Adjust minWidth based on screen size
                        // padding: isMobile ? '6px 8px' : '12px 24px', // Adjust padding based on screen size
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
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: isMobile ? '30vh' : '40vh' }}>
                        <ResponsiveContainer width="95%" height="100%">
                            <LineChart data={chartData()}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="age" tick={{ fontSize: isMobile ? 10 : 14 }} interval={isMobile ? 5 : 1} label={{ value: 'Age', position: 'insideBottomRight', offset: -5, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                                <YAxis tick={{ fontSize: isMobile ? 10 : 14 }} domain={yAxisDomain} tickCount={15} interval={0} tickFormatter={formatYAxisTick} label={{ value: `${currentUserBaseCurrency} Value`, angle: -90, position: 'insideLeft', offset: 0, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                                <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 14 }} />
                                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
                                {/* <Line type="monotone" dataKey="income" stroke="#1f77b4" strokeWidth={1} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="expense" stroke="#ff7f0e" strokeWidth={1} activeDot={{ r: 8 }} /> */}
                                <Line type="monotone" dataKey="net_position" stroke="#2ca02c" strokeWidth={3} activeDot={{ r: 8 }} name="Net Position" />
                                <Line type="monotone" dataKey="liquid_assets" stroke="#d62728" strokeWidth={3} activeDot={{ r: 8 }} name="Liquid Assets"/>
                                {/* <Line type="monotone" dataKey="locked_assets" stroke="#9467bd" strokeWidth={1} activeDot={{ r: 8 }} /> */}
                                <Line type="monotone" dataKey="net_worth" stroke="#8c564b" strokeWidth={3} activeDot={{ r: 8 }} name="Net Worth" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 1 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} 
                        borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} style={{ height: isMobile ? '30vh' : '40vh', width: '100%', overflow: 'auto' }}
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