import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormatCurrency } from '../common/FormatCurrency';

const AssetsGraph = ({ assetsData, incomesData }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

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
                            // backgroundColor: '#1976d2',
                            backgroundColor: 'purple',
                            color: '#fff',
                        },
                    },
                }}
            >
                <Tab label="Total Assets" />
                <Tab label="Liquid Assets" />
                <Tab label="Regular Income" />
            </Tabs>
            {tabIndex === 0 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Grid item size={12}>
                        <Typography variant="h6" align="center" pb={1} pt={1}>
                            Total Assets: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(assetsData[0].Properties) + parseFloat(assetsData[0].Vehicles) + parseFloat(assetsData[0].Accounts) + parseFloat(assetsData[0].Deposits) + parseFloat(assetsData[0].Portfolios) + parseFloat(assetsData[0].Others))}
                        </Typography>
                    </Grid>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '20vh' }}>
                        <ResponsiveContainer width="80%" height="100%">
                            <BarChart layout="vertical" data={assetsData}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="Properties" stackId="a" fill="#8884d8" />
                                <Bar dataKey="Vehicles" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="Accounts" stackId="a" fill="#ffc658" />
                                <Bar dataKey="Deposits" stackId="a" fill="#ff7300" />
                                <Bar dataKey="Portfolios" stackId="a" fill="#ff0000" />
                                <Bar dataKey="Others" stackId="a" fill="#0000ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 1 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Grid item size={12}>
                        <Typography variant="h6" align="center" pb={1} pt={1}>
                            Liquid Assets: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(assetsData[0].Accounts) + parseFloat(assetsData[0].Deposits) + parseFloat(assetsData[0].Portfolios) + parseFloat(assetsData[0].Others))}
                        </Typography>
                    </Grid>
                    <Grid item size={12} display="flex" justifyContent="center" style={{ height: '20vh' }}>
                        <ResponsiveContainer width="80%" height="100%">
                            <BarChart layout="vertical" data={assetsData}>
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip />
                                <Legend content={renderLegend} />
                                <Bar dataKey="Accounts" stackId="a" fill="#ffc658" />
                                <Bar dataKey="Deposits" stackId="a" fill="#ff7300" />
                                <Bar dataKey="Portfolios" stackId="a" fill="#ff0000" />
                                <Bar dataKey="Others" stackId="a" fill="#0000ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {tabIndex === 2 && (
                <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Grid item size={12}>
                        <Typography variant="h6" align="center" pb={1} pt={1}>
                        Regular Income: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(incomesData[0].Income) + parseFloat(incomesData[0].Rental) + parseFloat(incomesData[0].Coupon) + parseFloat(incomesData[0].Dividend) + parseFloat(incomesData[0].Payout) + parseFloat(incomesData[0].Lease))}
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
            )}
        </Box>
    );
};

export default AssetsGraph;