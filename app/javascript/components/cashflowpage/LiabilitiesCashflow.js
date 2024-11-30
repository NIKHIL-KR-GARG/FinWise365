import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import { FormatCurrencyForGrid } from  '../../components/common/FormatCurrency';

const LiabilitiesCashflow = ({liabilitiesCashflowData}) => {
    
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const chartData = () => {
        const yearlyData = liabilitiesCashflowData.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { total: 0, home: 0, property: 0, propertyMaintenance: 0, creditCardDebt: 0, personalLoan: 0, 
                            otherExpense: 0, vehicleExpense: 0, vehicleEMI: 0, propertyEMI: 0, depositSIP: 0, 
                            portfolioSIP: 0, otherSIP: 0, propertyTax:0, dreamProperty: 0, dreamVehicle: 0,
                            dreamEducation: 0, dreamTravel: 0, dreamRelocation: 0, dreamOther: 0, age: curr.age };
            }
            acc[year].total += curr.liability_value;
            if (curr.liability_type === 'Home') {
                acc[year].home += curr.liability_value;
            }
            if (curr.liability_type === 'Property') {
                acc[year].property += curr.liability_value;
            }
            if (curr.liability_type === 'Property Maintenance') {
                acc[year].propertyMaintenance += curr.liability_value;
            }
            if (curr.liability_type === 'Credit Card Debt') {
                acc[year].creditCardDebt += curr.liability_value;
            }
            if (curr.liability_type === 'Personal Loan') {
                acc[year].personalLoan += curr.liability_value;
            }
            if (curr.liability_type === 'Other Expense') {
                acc[year].otherExpense += curr.liability_value;
            }
            if (curr.liability_type === 'Vehicle Expense') {
                acc[year].vehicleExpense += curr.liability_value;
            }
            if (curr.liability_type === 'Vehicle EMI') {
                acc[year].vehicleEMI += curr.liability_value;
            }
            if (curr.liability_type === 'Property EMI') {
                acc[year].propertyEMI += curr.liability_value;
            }
            if (curr.liability_type === 'Deposit SIP') {
                acc[year].depositSIP += curr.liability_value;
            }
            if (curr.liability_type === 'Portfolio SIP') {
                acc[year].portfolioSIP += curr.liability_value;
            }
            if (curr.liability_type === 'Other SIP') {
                acc[year].otherSIP += curr.liability_value;
            }
            if (curr.liability_type === 'Property Tax') {
                acc[year].propertyTax += curr.liability_value;
            }
            if (curr.liability_type === 'Property Dream') {
                acc[year].dreamProperty += curr.liability_value;
            }
            if (curr.liability_type === 'Vehicle Dream') {
                acc[year].dreamVehicle += curr.liability_value;
            }
            if (curr.liability_type === 'Education Dream') {
                acc[year].dreamEducation += curr.liability_value;
            }
            if (curr.liability_type === 'Travel Dream') {
                acc[year].dreamTravel += curr.liability_value;
            }
            if (curr.liability_type === 'Relocation Dream') {
                acc[year].dreamRelocation += curr.liability_value;
            }
            if (curr.liability_type === 'Other Dream') {
                acc[year].dreamOther += curr.liability_value;
            }

            return acc;
        }, {});

        return Object.keys(yearlyData).map(year => ({
            year,
            yearWithAge: `${year} (${yearlyData[year].age})`,
            age: yearlyData[year].age,
            home: yearlyData[year].home.toFixed(2),
            total: yearlyData[year].total.toFixed(2),
            property: yearlyData[year].property.toFixed(2),
            propertyMaintenance: yearlyData[year].propertyMaintenance.toFixed(2),
            creditCardDebt: yearlyData[year].creditCardDebt.toFixed(2),
            personalLoan: yearlyData[year].personalLoan.toFixed(2),
            otherExpense: yearlyData[year].otherExpense.toFixed(2),
            vehicleExpense: yearlyData[year].vehicleExpense.toFixed(2),
            vehicleEMI: yearlyData[year].vehicleEMI.toFixed(2),
            propertyEMI: yearlyData[year].propertyEMI.toFixed(2),
            depositSIP: yearlyData[year].depositSIP.toFixed(2),
            portfolioSIP: yearlyData[year].portfolioSIP.toFixed(2),
            otherSIP: yearlyData[year].otherSIP.toFixed(2),
            propertyTax: yearlyData[year].propertyTax.toFixed(2),
            dreamProperty: yearlyData[year].dreamProperty.toFixed(2),
            dreamVehicle: yearlyData[year].dreamVehicle.toFixed(2),
            dreamEducation: yearlyData[year].dreamEducation.toFixed(2),
            dreamTravel: yearlyData[year].dreamTravel.toFixed(2),
            dreamRelocation: yearlyData[year].dreamRelocation.toFixed(2),
            dreamOther: yearlyData[year].dreamOther.toFixed(2)
        }));
    };

    const columns = [
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'age', headerName: 'Age', width: 100 },
        ...['home', 'property', 'propertyMaintenance', 'creditCardDebt', 'personalLoan', 'otherExpense', 'vehicleExpense', 
            'vehicleEMI', 'propertyEMI', 'depositSIP', 'portfolioSIP', 'otherSIP', 'propertyTax', 
            'dreamProperty', 'dreamVehicle', 'dreamEducation', 'dreamTravel', 'dreamRelocation', 'dreamOther', 'total'].map(type => ({
            field: type,
            headerName: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
            width: 125
        }))
    ];

    const rows = chartData().map((row, index) => ({
        id: index,
        year: row.year,
        age: row.age,
        home: row.home,
        property: row.property,
        propertyMaintenance: row.propertyMaintenance,
        creditCardDebt: row.creditCardDebt,
        personalLoan: row.personalLoan,
        otherExpense: row.otherExpense,
        vehicleExpense: row.vehicleExpense,
        vehicleEMI: row.vehicleEMI,
        propertyEMI: row.propertyEMI,
        depositSIP: row.depositSIP,
        portfolioSIP: row.portfolioSIP,
        otherSIP: row.otherSIP,
        propertyTax: row.propertyTax,
        dreamProperty: row.dreamProperty,
        dreamVehicle: row.dreamVehicle,
        dreamEducation: row.dreamEducation,
        dreamTravel: row.dreamTravel,
        dreamRelocation: row.dreamRelocation,
        dreamOther: row.dreamOther,
        total: row.total
    }));

    return (

        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
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
                <Tab label="Expenses Chart" />
                <Tab label="Expenses Data" />
            </Tabs>
            {tabIndex === 0 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#e0f7fa" borderRadius={2} p={2}>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="yearWithAge" tick={{ fontSize: 14 }} />
                                <YAxis tick={{ fontSize: 14 }} domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ fontSize: 14 }} />
                                <Legend wrapperStyle={{ fontSize: 14 }} />
                                <Line type="monotone" dataKey="total" stroke="#ff0000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="home" stroke="#ff69b4" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="property" stroke="#82ca9d" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="propertyMaintenance" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="creditCardDebt" stroke="#0000ff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="personalLoan" stroke="#ff4500" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="otherExpense" stroke="#ff00ff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="vehicleExpense" stroke="#00ffff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="vehicleEMI" stroke="#ffa500" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="propertyEMI" stroke="#800080" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="depositSIP" stroke="#008000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="portfolioSIP" stroke="#000080" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="otherSIP" stroke="#808000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="propertyTax" stroke="#800000" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamProperty" stroke="#ff1493" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamVehicle" stroke="#00bfff" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamEducation" stroke="#32cd32" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamTravel" stroke="#ff6347" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamRelocation" stroke="#8a2be2" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="dreamOther" stroke="#ff4500" strokeWidth={3} activeDot={{ r: 8 }} />
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

export default LiabilitiesCashflow;