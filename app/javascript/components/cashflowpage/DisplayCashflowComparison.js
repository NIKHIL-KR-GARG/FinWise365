import React, { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const DisplayCashflowComparison = ({ netCashflowData1, netCashflowData2 }) => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    const [data, setData] = useState([]);
    const hasFetchedData = useRef(false);

    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const chartData = () => {
        const formatData = (netCashflowData, label) => {
            if (!netCashflowData) return [];
            return netCashflowData.map(net => ({
                month: parseInt(net.month),
                year: parseInt(net.year),
                age: parseInt(net.age),
                income: parseFloat(net.income),
                expense: parseFloat(net.expense),
                net_position: parseFloat(net.net_position),
                liquid_assets: parseFloat(net.liquid_assets),
                locked_assets: parseFloat(net.locked_assets),
                net_worth: parseFloat(net.net_worth),
                label: label
            }));
        };

        const data1 = formatData(netCashflowData1, 'Projection 1');
        const data2 = formatData(netCashflowData2, 'Projection 2');

        const combinedData = [...data1, ...data2];

        const yearlyData = combinedData.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { 
                    income: 0, 
                    expense: 0, 
                    net_position_1: 0, 
                    net_position_2: 0, 
                    liquid_assets: 0, 
                    locked_assets: 0, 
                    net_worth_1: 0, 
                    net_worth_2: 0, 
                    age: curr.age 
                };
            }
            acc[year].income += curr.income;
            acc[year].expense += curr.expense;
            if (curr.label === 'Projection 1') {
                acc[year].net_position_1 += curr.net_position;
                acc[year].net_worth_1 = curr.net_worth;
            } else {
                acc[year].net_position_2 += curr.net_position;
                acc[year].net_worth_2 = curr.net_worth;
            }
            if (curr.month === 12) {
                acc[year].liquid_assets = curr.liquid_assets;
                acc[year].locked_assets = curr.locked_assets;
            }
            return acc;
        }, {});

        const formattedData = Object.keys(yearlyData).map(year => ({
            year,
            yearWithAge: `${year} (${yearlyData[year].age})`,
            age: yearlyData[year].age,
            income: yearlyData[year].income.toFixed(2),
            expense: yearlyData[year].expense.toFixed(2),
            net_position_1: yearlyData[year].net_position_1.toFixed(2),
            net_position_2: yearlyData[year].net_position_2.toFixed(2),
            liquid_assets: yearlyData[year].liquid_assets.toFixed(2),
            locked_assets: yearlyData[year].locked_assets.toFixed(2),
            net_worth_1: yearlyData[year].net_worth_1.toFixed(2),
            net_worth_2: yearlyData[year].net_worth_2.toFixed(2)
        }));

        setData(formattedData);
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            chartData();
            hasFetchedData.current = true;
        }
    }, [netCashflowData1, netCashflowData2]);

    const getYAxisDomain = (data) => {
        const values = data.flatMap(d => [
            parseFloat(d.income),
            parseFloat(d.expense),
            parseFloat(d.net_position_1),
            parseFloat(d.net_position_2),
            parseFloat(d.liquid_assets),
            parseFloat(d.locked_assets),
            parseFloat(d.net_worth_1),
            parseFloat(d.net_worth_2)
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

    const yAxisDomain = getYAxisDomain(data);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} p={2}>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: isMobile ? '30vh' : '40vh' }}>
                    <ResponsiveContainer width="95%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="2 2" />
                            <XAxis dataKey="age" tick={{ fontSize: isMobile ? 10 : 14 }} interval={isMobile ? 5 : 1} label={{ value: 'Age', position: 'insideBottomRight', offset: -5, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                            <YAxis tick={{ fontSize: isMobile ? 10 : 14 }} domain={yAxisDomain} tickCount={15} interval={0} tickFormatter={formatYAxisTick} label={{ value: `${currentUserBaseCurrency} Value`, angle: -90, position: 'insideLeft', offset: 0, style: { fontWeight: 'bold', fontSize: isMobile ? 10 : 14 } }} />
                            <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 14 }} />
                            <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
                            <Line type="monotone" dataKey="net_position_1" stroke="#2ca02c" strokeWidth={3} activeDot={{ r: 8 }} name="Net Position (Projection 1)" />
                            <Line type="monotone" dataKey="net_worth_1" stroke="#8c564b" strokeWidth={3} activeDot={{ r: 8 }} name="Net Worth (Projection 1)" />
                            <Line type="monotone" dataKey="net_position_2" stroke="#ff7f0e" strokeWidth={3} activeDot={{ r: 8 }} name="Net Position (Projection 2)" />
                            <Line type="monotone" dataKey="net_worth_2" stroke="#d62728" strokeWidth={3} activeDot={{ r: 8 }} name="Net Worth (Projection 2)" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DisplayCashflowComparison;