import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExchangeRate } from '../common/DefaultValues';
import FormatCurrency from '../common/FormatCurrency';

const DreamsGraph = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const [dreamsList, setDreamsList] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertiesResponse = await axios.get(`/api/asset_properties?user_id=${currentUserId}`);
                const vehiclesResponse = await axios.get(`/api/asset_vehicles?user_id=${currentUserId}`);
                const dreamsResponse = await axios.get(`/api/dreams?user_id=${currentUserId}`);

                // filter properties where purchase_date is in the future
                const propertiesList = propertiesResponse.data.filter(property => new Date(property.purchase_date) >= new Date());
                // filter vehicles where purchase_date is in the future
                const vehiclesList = vehiclesResponse.data.filter(vehicle => new Date(vehicle.purchase_date) >= new Date());
                // filter dreams where dream_type = 'Education' or 'Travel' or 'Relocation' or 'Other'
                const educationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Education');
                const travelList = dreamsResponse.data.filter(dream => dream.dream_type === 'Travel');
                const relocationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Relocation');
                const otherList = dreamsResponse.data.filter(dream => dream.dream_type === 'Other');

                // create a table with the following columns: year, property, vehicle, education, travel, relocation, other
                // for each year, calculate the total value of properties, vehicles, education, travel, relocation, other
                // add a row for each year to the table
                // create a bar chart with the following bars: property, vehicle, education, travel, relocation, other
                // x-axis: year, y-axis: total value
                // stack the bars

                // starting the current year add rows to the dreamsList array for the next 50 years
                const year = new Date().getFullYear();
                const dreamsList = [];
                for (let i = year; i <= (year + 50); i++) {
                    dreamsList.push({
                        year: i,
                        property: 0,
                        vehicle: 0,
                        education: 0,
                        travel: 0,
                        relocation: 0,
                        other: 0,
                        total_value: 0
                    });
                }

                let maxYear = new Date().getFullYear();

                // loop though the properties and add the value to the corresponding year
                propertiesList.forEach(property => {
                    const purchaseYear = new Date(property.purchase_date).getFullYear();
                    const purchaseValue = parseFloat(property.purchase_price);
                    const stampDuty = parseFloat(property.stamp_duty);
                    const otherFees = parseFloat(property.other_fees);
                    const totalCost = purchaseValue + stampDuty + otherFees;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === property.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(totalCost * conversionRate);
                    // find the corresponding row in the dreamsList array where year = purchaseYear and add the value to the property column
                    dreamsList.find(dream => dream.year === purchaseYear).property += convertedValue;
                    if (purchaseYear > maxYear) maxYear = purchaseYear;
                });

                // loop though the vehicles and add the value to the corresponding year
                vehiclesList.forEach(vehicle => {
                    const purchaseYear = new Date(vehicle.purchase_date).getFullYear();
                    const purchaseValue = parseFloat(vehicle.purchase_price);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === vehicle.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(purchaseValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = purchaseYear and add the value to the vehicle column
                    dreamsList.find(dream => dream.year === purchaseYear).vehicle += convertedValue;
                    if (purchaseYear > maxYear) maxYear = purchaseYear;
                });

                // loop though the education and add the value to the corresponding year
                educationList.forEach(education => {
                    const educationYear = new Date(education.dream_date).getFullYear();
                    const educationValue = parseFloat(education.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === education.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(educationValue) * parseFloat(conversionRate);
                    if (education.end_date) {
                        const educationEndYear = new Date(education.end_date).getFullYear();
                        for (let i = educationYear; i <= educationEndYear; i++) {
                            // find the corresponding row in the dreamsList array where year = educationYear and add the value to the education column
                            dreamsList.find(dream => dream.year === i).education += convertedValue;
                        }
                        if (educationEndYear > maxYear) maxYear = educationEndYear;
                    }
                    else {
                        // find the corresponding row in the dreamsList array where year = educationYear and add the value to the education column
                        dreamsList.find(dream => dream.year === educationYear).education += convertedValue;
                        if (educationYear > maxYear) maxYear = educationYear;
                    }
                });

                // loop though the travel and add the value to the corresponding year
                travelList.forEach(travel => {
                    const travelYear = new Date(travel.dream_date).getFullYear();
                    const travelValue = parseFloat(travel.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === travel.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(travelValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = travelYear and add the value to the travel column
                    dreamsList.find(dream => dream.year === travelYear).travel += convertedValue;
                    if (travelYear > maxYear) maxYear = travelYear;
                });

                // loop though the relocation and add the value to the corresponding year
                relocationList.forEach(relocation => {
                    const relocationYear = new Date(relocation.dream_date).getFullYear();
                    const relocationValue = parseFloat(relocation.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === relocation.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(relocationValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = relocationYear and add the value to the relocation column
                    dreamsList.find(dream => dream.year === relocationYear).relocation += convertedValue;
                    if (relocationYear > maxYear) maxYear = relocationYear;
                });
                
                // loop though the other dreams and add the value to the corresponding year
                otherList.forEach(other => {
                    const otherYear = new Date(other.dream_date).getFullYear();
                    const otherValue = parseFloat(other.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === other.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(otherValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = otherYear and add the value to the other column
                    dreamsList.find(dream => dream.year === otherYear).other += convertedValue;
                    if (otherYear > maxYear) maxYear = otherYear;
                });    
                
                // loop through the dreamsList array from maxYear + 1 to end of array and delete all these rows as these are empty rows
                for (let i = year; i <= (year + 50); i++) {                    
                    dreamsList.find(dream => dream.year === i).total_value =   
                        dreamsList.find(dream => dream.year === i).property +
                        dreamsList.find(dream => dream.year === i).vehicle +
                        dreamsList.find(dream => dream.year === i).education +
                        dreamsList.find(dream => dream.year === i).travel +
                        dreamsList.find(dream => dream.year === i).relocation +
                        dreamsList.find(dream => dream.year === i).other;
                    
                    if (i > maxYear) {
                        dreamsList.splice(dreamsList.findIndex(dream => dream.year === i), 1);
                    }
                }

                // set state for dreamsList
                setDreamsList(dreamsList);
                
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
        <Box display="flex" justifyContent="center" alignItems="center" p={1} width="100%">
            <Grid container spacing={2} justifyContent="center" width="100%" border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                <Grid item size={12}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Dreams: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.total_value, 0))}
                    </Typography>
                </Grid>
                <Grid item size={12} display="flex" justifyContent="center" style={{ height: '40vh' }}>
                    <ResponsiveContainer width="80%" height="100%">
                        <BarChart layout="horizontal" data={dreamsList}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend content={renderLegend} />
                            <Bar dataKey="property" stackId="a" fill="#8884d8" />
                            <Bar dataKey="vehicle" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="education" stackId="a" fill="#ffc658" />
                            <Bar dataKey="travel" stackId="a" fill="#ff7300" />
                            <Bar dataKey="relocation" stackId="a" fill="#ff0000" />
                            <Bar dataKey="other" stackId="a" fill="#00c49f" />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DreamsGraph;