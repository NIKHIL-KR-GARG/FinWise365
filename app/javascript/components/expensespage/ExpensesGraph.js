import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormatCurrency from '../common/FormatCurrency';

const ExpensesGraph = ({expensesData}) => {

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#800080', '#008000', '#000080'];

    return (
        <Box display="flex" justifyContent="center" alignItems="center" p={1} width="100%">
            <Grid container spacing={2} justifyContent="center" width="60%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                <Grid item size={12}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Expenses: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, expensesData.reduce((total, item) => total + item.value, 0))}
                    </Typography>
                </Grid>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                    <ResponsiveContainer width="80%" height="100%">
                    <PieChart width={400} height={400}>
                            <Pie data={expensesData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" dataKey="value" label>
                                {expensesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpensesGraph;