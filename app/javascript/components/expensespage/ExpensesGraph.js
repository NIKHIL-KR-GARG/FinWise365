import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ExchangeRate } from '../common/DefaultValues';
import FormatCurrency from '../common/FormatCurrency';
import { CalculateInterest } from '../common/CalculateInterestAndPrincipal';

const ExpensesGraph = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const homesResponse = await axios.get(`/api/expense_homes?user_id=${currentUserId}`);
                const propertiesResponse = await axios.get(`/api/expense_properties?user_id=${currentUserId}`);
                const creditCardDebtsResponse = await axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}`); 
                const personalLoansResponse = await axios.get(`/api/expense_personal_loans?user_id=${currentUserId}`); 
                const othersResponse = await axios.get(`/api/expense_others?user_id=${currentUserId}`);

                const homes = homesResponse.data;
                const properties = propertiesResponse.data;
                const creditCardDebts = creditCardDebtsResponse.data;
                const personalLoans = personalLoansResponse.data;
                const others = othersResponse.data;

                // get today's date
                const today = new Date();

                const totalHomes = homes.reduce((total, home) => {
                    // check if start_date is before today and end_date is after today
                    const startDate = new Date(home.start_date);
                    if (startDate <= today && (home.end_date === null || new Date(home.end_date) >= today)) {
                        const fromCurrency = home.currency;
                        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                        const conversionRate = exchangeRate ? exchangeRate.value : 1;
                        const convertedValue = parseFloat(home.total_expense) * conversionRate;
                        return total + convertedValue;
                    }
                }, 0);

                const totalProperties = properties.reduce((total, property) => {
                   // check if start_date is before today and end_date is after today
                   const startDate = new Date(property.start_date);
                   const endDate = new Date(property.end_date);
                   if (startDate <= today && endDate >= today) {
                       const fromCurrency = property.currency;
                       const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                       const conversionRate = exchangeRate ? exchangeRate.value : 1;
                       const convertedValue = parseFloat(property.total_expense) * conversionRate;
                       return total + convertedValue;
                   }
                }, 0);

                const totalCreditCardDebts = creditCardDebts.reduce((total, debt) => {
                   // check if start_date is before today and end_date is after today
                   const startDate = new Date(debt.start_date);
                   const endDate = new Date(debt.end_date);
                   if (startDate <= today && endDate >= today) {
                        const fromCurrency = debt.currency;
                        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                        const conversionRate = exchangeRate ? exchangeRate.value : 1;
                        const convertedValue = parseFloat(debt.emi_amount) * conversionRate;
                        return total + convertedValue;
                   }
                }, 0);

                const totalPersonalLoans = personalLoans.reduce((total, loan) => {
                    // check if start_date is before today and end_date is after today
                    const startDate = new Date(loan.start_date);
                    const endDate = new Date(loan.end_date);
                    if (startDate <= today && endDate >= today) {
                        const fromCurrency = loan.currency;
                        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                        const conversionRate = exchangeRate ? exchangeRate.value : 1;
                        const convertedValue = parseFloat(loan.emi_amount) * conversionRate;
                        return total + convertedValue;
                    }
                }, 0);

                const totalOthers = others.reduce((total, other) => {
                    let expenseTotal = 0;
                    const startDate = new Date(other.expense_date);
                    const fromCurrency = other.currency;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;

                    // check if the month of expense date same as month of today's date
                    if (startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear()) {
                        expenseTotal += parseFloat(other.amount);
                    }

                    // check if we have a recurring expense and end_date is after today
                    if (other.is_recurring & (other.end_date === null || new Date(other.end_date) >= today)) {
                        // check if this the correct month for recurring expense based on recurring_frequency                        
                        const diffMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
                        if (other.recurring_frequency === 'Monthly') {
                            expenseTotal += parseFloat(other.recurring_amount);
                        }
                        else if (other.recurring_frequency === 'Quarterly' && diffMonths % 3 === 0) {
                            expenseTotal += parseFloat(other.recurring_amount);
                        }
                        else if (other.recurring_frequency === 'Semi-Annually' && diffMonths % 6 === 0) {
                            expenseTotal += parseFloat(other.recurring_amount);
                        }
                        else if (other.recurring_frequency === 'Annually' && diffMonths % 12 === 0) {
                            expenseTotal += parseFloat(other.recurring_amount);
                        }
                        const totalInterest = CalculateInterest (
                            "Fixed",
                            "Simple",
                            other.inflation_rate,
                            other.amount,
                            diffMonths,
                            other.recurring_frequency,
                            other.recurring_amount,
                            "Monthly" //does not matter as we are calculating simple interest
                        );
                        expenseTotal += totalInterest;
                    }
                    const convertedValue = parseFloat(expenseTotal) * conversionRate;
                    return total + convertedValue;
                }, 0);

                setData([
                    { name: 'Homes', value: totalHomes },
                    { name: 'Properties', value: totalProperties },
                    { name: 'CreditCardDebts', value: totalCreditCardDebts },
                    { name: 'PersonalLoans', value: totalPersonalLoans },
                    { name: 'Others', value: totalOthers },
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#800080', '#008000', '#000080'];

    return (
        <Box display="flex" justifyContent="space-around" align="center" p={1} width="100%">
            <Grid container spacing={2} width="100%">
                <Grid item size={12} border={1} borderColor="grey.400" bgcolor="#fff9e6" borderRadius={2}>
                    <Typography variant="h6" align="center" pb={1} pt={1}>
                        Total Expenses: ({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, data.reduce((total, item) => total + item.value, 0))}
                    </Typography>
                    <PieChart width={400} height={400}>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" dataKey="value" label>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpensesGraph;