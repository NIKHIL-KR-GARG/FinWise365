import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormatCurrency } from '../common/FormatCurrency';

const DreamsGraph = ({dreamsList, graphType}) => {

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div style={{ fontSize: '16px', display: 'flex', justifyContent:'center' }}>
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
        <Box display="flex" justifyContent="center" alignItems="center" p={1} width="100%">
            <Grid container spacing={2} justifyContent="center" width="80%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                <Grid item size={12}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Dreams: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.total_value, 0))}
                    </Typography>
                </Grid>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                    <ResponsiveContainer width="80%" height="100%">
                        { graphType === 'lumpsum' && (
                            <BarChart layout="horizontal" data={dreamsList}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="AssetProperty" stackId="a" fill="#8884d8" name="Property" />
                                <Bar dataKey="AssetVehicle" stackId="a" fill="#82ca9d" name="Vehicle" />
                                <Bar dataKey="AssetAccount" stackId="a" fill="#ffc658" name="Account" />
                                <Bar dataKey="AssetDeposit" stackId="a" fill="#ff7300" name="Deposit" />
                                <Bar dataKey="AssetPortfolio" stackId="a" fill="#ff0000" name="Portfolio" />
                                <Bar dataKey="AssetOther" stackId="a" fill="#0088FE" name="Other Asset" />
                                <Bar dataKey="ExpenseOther" stackId="a" fill="#D0ED57" name="Other Expense" />
                                <Bar dataKey="Education" stackId="a" fill="#8A2BE2" name="Education" />
                                <Bar dataKey="Travel" stackId="a" fill="#FF6347" name="Travel" />
                                <Bar dataKey="Relocation" stackId="a" fill="#4682B4" name="Relocation" />
                                <Bar dataKey="Other" stackId="a" fill="#6A5ACD" name="Other Dream" />
                            </BarChart>
                        )}
                        { graphType === 'recurring' && (
                            <BarChart layout="horizontal" data={dreamsList}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="ExpenseHome" stackId="a" fill="#00C49F" name="Home Expense" />
                                <Bar dataKey="ExpenseProperty" stackId="a" fill="#FFBB28" name="Property Expense" />
                                <Bar dataKey="ExpenseCreditCardDebt" stackId="a" fill="#FF8042" name="Credit Card Debt" />
                                <Bar dataKey="ExpensePersonalLoan" stackId="a" fill="#A4DE6C" name="Personal Loan" />
                                <Bar dataKey="ExpenseOther" stackId="a" fill="#D0ED57" name="Other Expense" />
                                <Bar dataKey="EMI" stackId="a" fill="#8A2BE2" name="EMI" />
                                <Bar dataKey="SIP" stackId="a" fill="#FF6347" name="SIP" />
                            </BarChart>
                        )}
                        { graphType === 'income' && (
                            <BarChart layout="horizontal" data={dreamsList}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="Income" stackId="a" fill="#8884d8" name="Income" />
                                <Bar dataKey="Rental" stackId="a" fill="#82ca9d" name="Rental" />
                                <Bar dataKey="Lease" stackId="a" fill="#ffc658" name="Lease" />
                                <Bar dataKey="Coupon" stackId="a" fill="#ff7300" name="Coupon" />
                                <Bar dataKey="Dividend" stackId="a" fill="#ff0000" name="Dividend" />
                                <Bar dataKey="Payout" stackId="a" fill="#0088FE" name="Payout" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DreamsGraph;