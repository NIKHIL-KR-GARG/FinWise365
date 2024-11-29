import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormatCurrency } from  '../../common/FormatCurrency';
import { PieChart, Pie, Cell } from 'recharts';

const HomeLoanEMICalculator = ({ property }) => {

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [loandetails, setLoanDetails] = useState({
        purchase_price: 0.0,
        loan_amount: 0.0,
        tenor_months: 0,
        currency: '',
        interest_rate_year_1: 0.0,
        interest_rate_year_2: 0.0,
        interest_rate_year_3: 0.0,
        interest_rate_year_4: 0.0,
        interest_rate_year_5: 0.0,
        interest_rate_year_6: 0.0
    });

    useEffect(() => {
        setLoanDetails({
            purchase_price: property.purchase_price,
            loan_amount: property.loan_amount,
            tenor_months: property.loan_duration,
            currency: property.currency,
            interest_rate_year_1: property.loan_interest_rate,
            interest_rate_year_2: property.loan_interest_rate,
            interest_rate_year_3: property.loan_interest_rate,
            interest_rate_year_4: property.loan_interest_rate,
            interest_rate_year_5: property.loan_interest_rate,
            interest_rate_year_6: property.loan_interest_rate
        });
    }, [property.purchase_price, property.loan_amount, property.loan_duration, property.currency, property.loan_interest_rate]);

    const [emiCalculations, setEmiCalculations] = useState([]);
    const [emiCalculationsSummary, setEmiCalculationsSummary] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanDetails({
            ...loandetails,
            [name]: value
        });
    };

    const pmt = (rate, nper, pv) => {
        if (rate === 0) return -(pv / nper);
        const pvif = Math.pow(1 + rate, nper);
        return -(rate * pv * pvif) / (pvif - 1);
    };

    const calculateEMISchedule = () => {
        if (validate()) {
            try {
                const calculations = [];

                var year = 1;
                var monthofyear = 1;
                var yearlyRate = 0
                var monthlyRate = 0;
                var outstandingBalance = loandetails.loan_amount;

                const summaryCalculations = [];
                var summaryYearEMI = 0;
                var summaryYearInterest = 0;
                var summaryYearPrincipal = 0;

                for (let month = 1; month <= loandetails.tenor_months; month++) {
                    if (year === 1) {
                        yearlyRate = loandetails.interest_rate_year_1;
                        monthlyRate = yearlyRate / 12 / 100;
                    }
                    if (year === 2) {
                        yearlyRate = loandetails.interest_rate_year_2;
                        monthlyRate = yearlyRate / 12 / 100;
                    }
                    else if (year === 3) {
                        yearlyRate = loandetails.interest_rate_year_3;
                        monthlyRate = yearlyRate / 12 / 100;
                    }
                    else if (year === 4) {
                        yearlyRate = loandetails.interest_rate_year_4;
                        monthlyRate = yearlyRate / 12 / 100;
                    }
                    else if (year === 5) {
                        yearlyRate = loandetails.interest_rate_year_5;
                        monthlyRate = yearlyRate / 12 / 100;
                    }
                    else {
                        yearlyRate = loandetails.interest_rate_year_6;
                        monthlyRate = yearlyRate / 12 / 100;
                    }

                    const openingBalance = outstandingBalance;
                    const emi = Math.abs(pmt(monthlyRate, loandetails.tenor_months, loandetails.loan_amount)); // Use absolute value
                    const interest = outstandingBalance * monthlyRate;
                    var principal = 0;
                    if (emi <= openingBalance) principal = emi - interest;
                    else principal = openingBalance;
                    outstandingBalance -= principal;

                    // Add to summary
                    summaryYearEMI += emi;
                    summaryYearInterest += interest;
                    summaryYearPrincipal += principal;

                    calculations.push({
                        year: year,
                        month: month,
                        interestRate: yearlyRate,
                        monthlyInstalment: FormatCurrency(loandetails.currency, emi),
                        openingBalance: FormatCurrency(loandetails.currency, openingBalance),
                        principal: FormatCurrency(loandetails.currency, principal),
                        interest: FormatCurrency(loandetails.currency, interest),
                        outstandingLoanBalance: FormatCurrency(loandetails.currency, outstandingBalance)
                    });

                    if (monthofyear === 12) {
                        // Add summary for the year if it is less than 6 years
                        if (year < 6) {
                            summaryCalculations.push({
                                year: year.toString(),
                                totalPrincipal: FormatCurrency(loandetails.currency, summaryYearPrincipal),
                                totalInterest: FormatCurrency(loandetails.currency, summaryYearInterest),
                                totalEMI: FormatCurrency(loandetails.currency, summaryYearEMI)
                            });
                            summaryYearEMI = 0;
                            summaryYearInterest = 0;
                            summaryYearPrincipal = 0;
                        }                        
                        year++;
                        monthofyear = 1;
                    }
                    else monthofyear++;
                }

                setEmiCalculations(calculations);

                // Add summary for years 6 to end
                summaryCalculations.push({
                    year: "n-1",
                    totalEMI: FormatCurrency(loandetails.currency, summaryYearEMI),
                    totalInterest: FormatCurrency(loandetails.currency, summaryYearInterest),
                    totalPrincipal: FormatCurrency(loandetails.currency, summaryYearPrincipal)
                });

                // Calculate overall totals
                const totalEMI = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalEMI.replace(/[^0-9.-]+/g, "")), 0);
                const totalInterest = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalInterest.replace(/[^0-9.-]+/g, "")), 0);
                const totalPrincipal = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalPrincipal.replace(/[^0-9.-]+/g, "")), 0);

                // Add total row
                summaryCalculations.push({
                    year: "Total",
                    totalEMI: FormatCurrency(loandetails.currency, totalEMI),
                    totalInterest: FormatCurrency(loandetails.currency, totalInterest),
                    totalPrincipal: FormatCurrency(loandetails.currency, totalPrincipal)
                });

                setEmiCalculationsSummary(summaryCalculations);
                
                setErrorMessage('');
            }
            catch (error) {
                setErrorMessage(error.message);
                setSuccessMessage('');
            }
        }
        else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        };
    };

    const validate = () => {
        const errors = {};

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(loandetails.purchase_price)) errors.purchase_price = 'Purchase Price should be numeric';
        if (isNaN(loandetails.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(loandetails.tenor_months)) errors.tenor_months = 'Tenor should be numeric';
        if (isNaN(loandetails.interest_rate_year_1)) errors.interest_rate_year_1 = 'Interest Rate should be numeric';
        if (isNaN(loandetails.interest_rate_year_2)) errors.interest_rate_year_2 = 'Interest Rate should be numeric';
        if (isNaN(loandetails.interest_rate_year_3)) errors.interest_rate_year_3 = 'Interest Rate should be numeric';
        if (isNaN(loandetails.interest_rate_year_4)) errors.interest_rate_year_4 = 'Interest Rate should be numeric';
        if (isNaN(loandetails.interest_rate_year_5)) errors.interest_rate_year_5 = 'Interest Rate should be numeric';
        if (isNaN(loandetails.interest_rate_year_6)) errors.interest_rate_year_6 = 'Interest Rate should be numeric';

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const COLORS = ['#FF6384', '#FFCE56']; // Changed blue to yellow

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '20px' }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setSuccessMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setErrorMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 1 }}>
                Home Mortgage EMI Calculator
            </Typography>
            <Grid container spacing={2}>
                <Grid item size={12}>
                    <Typography variant="h7" component="h2" gutterBottom sx={{ textDecoration: 'underline', pb: 0 }}>
                        Mortgage Details:
                    </Typography>
                </Grid>
                <Grid item size={4}>
                    <TextField
                        label="Purchase Price"
                        variant="outlined"
                        name="purchase_price"
                        value={loandetails.purchase_price}
                        fullWidth
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.purchase_price}
                        helperText={errors.purchase_price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        label="Loan Amount"
                        variant="outlined"
                        name="loan_amount"
                        value={loandetails.loan_amount}
                        fullWidth
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.loan_amount}
                        helperText={errors.loan_amount}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        label="Tenor (Months)"
                        variant="outlined"
                        name="tenor_months"
                        value={loandetails.tenor_months}
                        fullWidth
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*' } }}
                        error={!!errors.tenor_months}
                        helperText={errors.tenor_months}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={12}>
                    <Typography variant="h7" component="h2" sx={{ textDecoration: 'underline', pb: 0 }}>
                        Interest Rate:
                    </Typography>
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 1"
                        name="interest_rate_year_1"
                        value={loandetails.interest_rate_year_1}
                        fullWidth
                        required
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_1}
                        helperText={errors.interest_rate_year_1}
                        size="small"
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 2"
                        name="interest_rate_year_2"
                        value={loandetails.interest_rate_year_2}
                        fullWidth
                        required
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_2}
                        helperText={errors.interest_rate_year_2}
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 3"
                        name="interest_rate_year_3"
                        value={loandetails.interest_rate_year_3}
                        fullWidth
                        required
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_3}
                        helperText={errors.interest_rate_year_3}
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 4"
                        name="interest_rate_year_4"
                        value={loandetails.interest_rate_year_4}
                        fullWidth
                        required
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_4}
                        helperText={errors.interest_rate_year_4}
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 5"
                        name="interest_rate_year_5"
                        value={loandetails.interest_rate_year_5}
                        fullWidth
                        required
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_5}
                        helperText={errors.interest_rate_year_5}
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={2}>
                    <TextField
                        variant="outlined"
                        label="Year 6 (& above)"
                        name="interest_rate_year_6"
                        value={loandetails.interest_rate_year_6}
                        fullWidth
                        required
                        size="small"
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate_year_6}
                        helperText={errors.interest_rate_year_6}
                        sx={{ pb: 1 }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={calculateEMISchedule}
                        sx={{ display: 'block', margin: '0 auto' }}
                    >
                        Calculate EMI Schedule
                    </Button>
                </Grid>
                <Grid item size={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 1 }} />
                </Grid>
                <Grid item size={12}>
                    <Typography variant="h6" component="h2" sx={{ textDecoration: 'underline', pb: 1 }}>
                        Loan Repayment Summary
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="emi summary table" sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Year</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Total Principal</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Total Interest</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Total EMI</TableCell>                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {emiCalculationsSummary.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.year}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.totalPrincipal}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.totalInterest}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.totalEMI}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
                <Grid item size={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 1 }} />
                </Grid>
                <Grid item size={12}>
                    <Typography variant="h6" component="h2" sx={{ textDecoration: 'underline', pb: 0 }}>
                        Loan Repayment Breakdown
                    </Typography>
                    {emiCalculationsSummary.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={[
                                        { name: 'Principal', value: parseFloat(emiCalculationsSummary.find(row => row.year === 'Total').totalPrincipal.replace(/[^0-9.-]+/g, "")) },
                                        { name: 'Interest', value: parseFloat(emiCalculationsSummary.find(row => row.year === 'Total').totalInterest.replace(/[^0-9.-]+/g, "")) }
                                    ]}
                                    cx={200}
                                    cy={200}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {COLORS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </Box>
                    )}
                </Grid>
                <Grid item size={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 1 }} />
                </Grid>
                <Grid item size={12}>
                    <Typography variant="h6" component="h2" sx={{ textDecoration: 'underline', pb: 1 }}>
                        Loan Repayment Details
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="emi schedule table" sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Year</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Month</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Interest Rate (%)</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Monthly Instalment</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Opening Balance</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Principal</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Interest</TableCell>
                                        <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)', color: 'white' }}>Outstanding Balance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {emiCalculations.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.year}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.month}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.interestRate}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.monthlyInstalment}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.openingBalance}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.principal}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.interest}</TableCell>
                                            <TableCell sx={{ border: '2px solid rgba(224, 224, 224, 1)' }}>{row.outstandingLoanBalance}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default HomeLoanEMICalculator;