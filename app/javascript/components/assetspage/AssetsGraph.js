import React from 'react';
import Grid from '@mui/material/Grid2';
import { CircularProgress, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import FormatCurrency from '../common/FormatCurrency';

const AssetsGraph = ({assetsData}) => {

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'center' }}>
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
            <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                <Grid item size={6} border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Assets: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(assetsData[0].Properties) + parseFloat(assetsData[0].Vehicles) + parseFloat(assetsData[0].Accounts) + parseFloat(assetsData[0].Deposits) + parseFloat(assetsData[0].Portfolios) + parseFloat(assetsData[0].Others))}
                    </Typography>
                    <BarChart layout="vertical" width={400} height={150} data={assetsData}>
                        <CartesianGrid strokeDasharray="3 3" />
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
                </Grid>
                <Grid item size={6} border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Liquid Assets: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, parseFloat(assetsData[0].Accounts) + parseFloat(assetsData[0].Deposits) + parseFloat(assetsData[0].Portfolios) + parseFloat(assetsData[0].Others))}
                    </Typography>
                    <BarChart layout="vertical" width={400} height={150} data={assetsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend content={renderLegend} />
                        <Bar dataKey="Accounts" stackId="a" fill="#ffc658" />
                        <Bar dataKey="Deposits" stackId="a" fill="#ff7300" />
                        <Bar dataKey="Portfolios" stackId="a" fill="#ff0000" />
                        <Bar dataKey="Others" stackId="a" fill="#0000ff" />
                    </BarChart>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AssetsGraph;