import React, { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const DisplayCashflow = ({ netCashflowData }) => {

    const [data, setData] = useState([]);
    const hasFetchedData = useRef(false);

    const chartData = () => {

        const cashflowNetPositions = netCashflowData.map(net => ({
            month: parseInt(net.month),
            year: parseInt(net.year),
            age: parseInt(net.age),
            income: parseFloat(net.income),
            expense: parseFloat(net.expense),
            net_position: parseFloat(net.net_position),
            liquid_assets: parseFloat(net.liquid_assets),
            locked_assets: parseFloat(net.locked_assets),
            net_worth: parseFloat(net.net_worth)
        }));

        const yearlyData = cashflowNetPositions.reduce((acc, curr) => {
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

        setData(formattedData);
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            chartData();
            hasFetchedData.current = true;
        }
    }, [netCashflowData]);

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

    const yAxisDomain = getYAxisDomain(data);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2} p={2}>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                    <ResponsiveContainer width="95%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="2 2" />
                            <XAxis dataKey="yearWithAge" tick={{ fontSize: 14 }} interval={1} />
                            <YAxis tick={{ fontSize: 14 }} domain={yAxisDomain} tickCount={15} interval={0} tickFormatter={formatYAxisTick} />
                            <Tooltip contentStyle={{ fontSize: 14 }} />
                            <Legend wrapperStyle={{ fontSize: 14 }} />
                            <Line type="monotone" dataKey="net_position" stroke="#2ca02c" strokeWidth={3} activeDot={{ r: 8 }} name="Net Position" />
                            <Line type="monotone" dataKey="net_worth" stroke="#8c564b" strokeWidth={3} activeDot={{ r: 8 }} name="Net Worth" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DisplayCashflow;