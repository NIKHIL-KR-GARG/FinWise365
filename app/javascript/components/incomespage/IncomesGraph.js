import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormatCurrency } from '../common/FormatCurrency';

const IncomesGraph = ({ incomesData }) => {
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div style={{ fontSize: '16px', display: 'flex', justifyContent: 'center' }}>
                {payload.map((entry, index) => (
                    <span key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                        <span style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: '50%', display: 'inline-block', marginRight: 5 }}></span>
                        {entry.value}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <Box justifyContent="center" alignItems="center" p={1} width="80%">
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Grid item size={12}>
                        <Typography variant="h6" align="center" pb={1} pt={1}>
                        Regular Income: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(incomesData[0].TotalIncome))}
                        </Typography>
                    </Grid>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '20vh' }}>
                        <ResponsiveContainer width="80%" height="100%">
                            <BarChart layout="vertical" data={incomesData}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="Income" stackId="a" fill="#8884d8" />
                                <Bar dataKey="Rental" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="Coupon" stackId="a" fill="#ffc658" />
                                <Bar dataKey="Dividend" stackId="a" fill="#ff7300" />
                                <Bar dataKey="Payout" stackId="a" fill="#ff0000" />
                                <Bar dataKey="Lease" stackId="a" fill="#0000ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
        </Box>
    );
};

export default IncomesGraph;