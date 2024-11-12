import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ExchangeRate } from '../common/DefaultValues';
import { CalculatePrincipalForDeposit, CalculateInterestForDeposit } from '../common/CalculateInterestAndPrincipalForDeposit';

const AssetsGraph = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const calculateCurrentValue = (initialValue, rate, years) => {
        return initialValue * Math.pow(1 + rate / 100, years);
    };

    const calculateDepreciationValue = (initialValue, rate, years) => {
        return initialValue * Math.pow(1 - rate / 100, years);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertiesResponse = await axios.get(`/api/asset_properties?user_id=${currentUserId}`);
                const vehiclesResponse = await axios.get(`/api/asset_vehicles?user_id=${currentUserId}`);
                const accountsResponse = await axios.get(`/api/asset_accounts?user_id=${currentUserId}`);
                const depositsResponse = await axios.get(`/api/asset_deposits?user_id=${currentUserId}`);
                //const exchangeRatesResponse = await axios.get(`/api/exchange_rates?base_currency=${baseCurrency}`);

                const properties = propertiesResponse.data;
                const vehicles = vehiclesResponse.data;
                const accounts = accountsResponse.data;
                const deposits = depositsResponse.data;
                //const exchangeRates = exchangeRatesResponse.data;
                
                const currentYear = new Date().getFullYear();

                const totalPropertyValue = properties.reduce((total, property) => {
                    const years = currentYear - new Date(property.purchase_date).getFullYear();
                    const currentValue = calculateCurrentValue(property.purchase_price, property.property_value_growth_rate, years);
                    const fromCurrency = property.currency;
                    //window.confirm('Purchase Price: ' + property.purchase_price + ' fromCurrency: ' + fromCurrency + ' growhrate: ' + property.property_value_growth_rate);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = currentValue * conversionRate;
                    //window.confirm('currentValue: ' + currentValue + ' conversionRate: ' + conversionRate + ' convertedValue: ' + convertedValue);
                    return total + convertedValue;
                }, 0);

                const totalVehicleValue = vehicles.reduce((total, vehicle) => {
                    const years = currentYear - new Date(vehicle.purchase_date).getFullYear();
                    const currentValue = calculateDepreciationValue(vehicle.purchase_price, vehicle.depreciation_rate, years);
                    const fromCurrency = vehicle.currency;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = currentValue * conversionRate;
                    return total + convertedValue;
                }, 0);

                const totalAccountValue = accounts.reduce((total, account) => {
                    const fromCurrency = account.currency;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = account.account_balance * conversionRate;
                    return total + convertedValue;
                }, 0);  

                const totalDepositValue = deposits.reduce((total, deposit) => {
                    //no of months since deposit
                    const months = (new Date().getFullYear() - new Date(deposit.opening_date).getFullYear()) * 12 + new Date().getMonth() - new Date(deposit.opening_date).getMonth();
                    const interest = CalculateInterestForDeposit(
                        deposit.deposit_type,
                        deposit.interest_type,
                        deposit.interest_rate,
                        deposit.deposit_amount || 0,
                        months,
                        deposit.payment_frequency,
                        deposit.payment_amount || 0,
                        deposit.compounding_frequency
                    )
                    const principal = CalculatePrincipalForDeposit(
                        deposit.deposit_type, 
                        deposit.deposit_amount || 0, 
                        months,
                        deposit.payment_frequency,
                        deposit.payment_amount || 0
                    )
                    const fromCurrency = deposit.currency;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = (parseFloat(principal) + parseFloat(interest)) * conversionRate;
                    return total + convertedValue;
                }, 0); 

                const graphname = 'Total Assets (' + currentUserBaseCurrency + ')';
                setData([
                    {   name: graphname , 
                        properties: totalPropertyValue, 
                        vehicles: totalVehicleValue, 
                        accounts: totalAccountValue,
                        deposits: totalDepositValue,
                    }
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
            <Bar dataKey="accounts" stackId="a" fill="#ffc658" />
            <Bar dataKey="deposits" stackId="a" fill="#ff7300" />
        </BarChart>
    );
};

export default AssetsGraph;