import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AssetsGraph = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const calculateCurrentValue = (initialValue, rate, years) => {
        return initialValue * Math.pow(1 + rate, years);
    };

    const calculateDepreciationValue = (initialValue, rate, years) => {
        return initialValue * Math.pow(1 - rate, years);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertiesResponse = await axios.get(`/api/asset_properties?user_id=${currentUserId}`);
                const vehiclesResponse = await axios.get(`/api/asset_vehicles?user_id=${currentUserId}`);
                //const exchangeRatesResponse = await axios.get(`/api/exchange_rates?base_currency=${baseCurrency}`);

                const properties = propertiesResponse.data;
                const vehicles = vehiclesResponse.data;
                //const exchangeRates = exchangeRatesResponse.data;
                
                const currentYear = new Date().getFullYear();

                const totalPropertyValue = properties.reduce((total, property) => {
                    const years = currentYear - new Date(property.purchase_date).getFullYear();
                    const currentValue = calculateCurrentValue(property.purchase_price, property.property_value_growth_rate, years);
                    //const convertedValue = currentValue * exchangeRates[property.currency];
                    const convertedValue = currentValue * 6;
                    return total + convertedValue;
                }, 0);

                const totalVehicleValue = vehicles.reduce((total, vehicle) => {
                    const years = currentYear - new Date(vehicle.purchase_date).getFullYear();
                    const currentValue = calculateDepreciationValue(vehicle.purchase_price, vehicle.depreciation_rate, years);
                    //const convertedValue = currentValue * exchangeRates[vehicle.currency];
                    const convertedValue = currentValue * 600;
                    return total + convertedValue;
                }, 0);

                const graphname = 'Total Assets (' + currentUserBaseCurrency + ')';
                setData([
                    { name: graphname , properties: totalPropertyValue, vehicles: totalVehicleValue }
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <BarChart layout="vertical" width={600} height={150} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="properties" stackId="a" fill="#8884d8" />
            <Bar dataKey="vehicles" stackId="a" fill="#82ca9d" />
        </BarChart>
    );
};

export default AssetsGraph;