import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormatCurrency from '../common/FormatCurrency';

const DreamsGraph = ({dreamsList}) => {

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
        <Box display="flex" justifyContent="center" alignItems="center" p={1} width="100%">
            <Grid container spacing={2} justifyContent="center" width="80%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                <Grid item size={12}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Dreams: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.total_value, 0))}
                    </Typography>
                </Grid>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                    <ResponsiveContainer width="80%" height="100%">
                        <BarChart layout="horizontal" data={dreamsList}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend content={renderLegend} />
                            <Bar dataKey="Property" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Vehicle" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="Education" stackId="a" fill="#ffc658" />
                            <Bar dataKey="Travel" stackId="a" fill="#ff7300" />
                            <Bar dataKey="Relocation" stackId="a" fill="#ff0000" />
                            <Bar dataKey="Other" stackId="a" fill="#00c49f" />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DreamsGraph;