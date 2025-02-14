import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormatCurrency } from '../common/FormatCurrency';

const ExpensesGraph = ({expensesData}) => {

    const currentUserBaseCurrency = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientBaseCurrency') : localStorage.getItem('currentUserBaseCurrency');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#800080', '#008000', '#000080'];

    const isSmallScreen = window.innerHeight < 500;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" p={1} width="100%">
            <Grid container spacing={2} justifyContent="center" width="60%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} style={{ height: '50vh' }}>
                <Grid item size={12}>
                    <Typography variant="h6" align="center" pb={0} pt={1}>
                        Total Expenses: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.reduce((total, item) => total + item.value, 0))}
                    </Typography>
                </Grid>
                <Grid item size={12} display="flex" justifyContent="center" flexGrow={1}>
                    <ResponsiveContainer width="80%" height="100%">
                        <PieChart>
                            <Pie data={expensesData} cx="50%" cy="50%" outerRadius="75%" fill="#8884d8" dataKey="value" label>
                                {expensesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: isSmallScreen ? '10px' : '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpensesGraph;