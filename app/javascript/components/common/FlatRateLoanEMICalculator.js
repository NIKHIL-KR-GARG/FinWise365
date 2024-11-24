import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Snackbar, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import FormatCurrency from './FormatCurrency';
 
const FlatRateLoanEMICalculator = ({ purchase_price, loan_amount, loan_duration, currency, interest_rate }) => {

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [loandetails, setLoanDetails] = useState({
        purchase_price: 0.0,
        loan_amount: 0.0,
        tenor_months: 0,
        currency: '',
        interest_rate
    });

    useEffect(() => {
        setLoanDetails({
            purchase_price: purchase_price,
            loan_amount: loan_amount,
            tenor_months: loan_duration,
            currency: currency,
            interest_rate: interest_rate
        });
    }, [purchase_price, loan_amount, loan_duration, currency, interest_rate]);

    const [emiCalculations, setEmiCalculations] = useState([]);
    const [emiCalculationsSummary, setEmiCalculationsSummary] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanDetails({
            ...loandetails,
            [name]: value
        });
    };

    // const calculateFlatRateEMI = (principal, rate, tenure) => {
    //     const monthlyInterest = (principal * (rate / 100)) / 12;
    //     const emi = (principal / tenure) + monthlyInterest;
    //     return emi;
    // };

    const calculateTotalInterest = (principal, rate, tenure) => {
        const totalInterest = (principal * (rate / 100) * (tenure / 12));
        return totalInterest;
    };

    // const calculateEffectiveRate = (rate, tenure) => {
    //     const effectiveRate = Math.pow((1 + (rate / 100) / 12), 12 * tenure) - 1;
    //     return effectiveRate;
    // };  

    // const calculateEffectiveInterestRate = (flatRate, tenure) => {
    //     const monthlyFlatRate = flatRate / 12 / 100;
    //     const effectiveRate = (Math.pow(1 + monthlyFlatRate, tenure) - 1) * 12 / tenure;
    //     return effectiveRate * 100;
    // };

    const calculateEMISchedule = () => {
        if (validate()) {
            try {
                const calculations = [];

                var year = 1;
                var monthofyear = 1;
                var outstandingBalance = loandetails.loan_amount;

                const summaryCalculations = [];
                var summaryYearEMI = 0;
                var summaryYearInterest = 0;
                var summaryYearPrincipal = 0;

                const totalInterest = calculateTotalInterest(loandetails.loan_amount, loandetails.interest_rate, loandetails.tenor_months);
                const emi = (parseFloat(loandetails.loan_amount) + parseFloat(totalInterest)) / parseFloat(loandetails.tenor_months);
                
                for (let month = 1; month <= loandetails.tenor_months; month++) {
                    const openingBalance = outstandingBalance;
                    const interest = (outstandingBalance * loandetails.interest_rate) / 12 / 100;
                    const principal = emi - interest;
                    outstandingBalance -= principal;

                    // Add to summary
                    summaryYearEMI += emi;
                    summaryYearInterest += interest;
                    summaryYearPrincipal += principal;

                    calculations.push({
                        year: year,
                        month: month,
                        interestRate: loandetails.interest_rate,
                        monthlyInstalment: FormatCurrency(loandetails.currency, parseFloat(emi)),
                        openingBalance: FormatCurrency(loandetails.currency, parseFloat(openingBalance)),
                        principal: FormatCurrency(loandetails.currency, parseFloat(principal)),
                        interest: FormatCurrency(loandetails.currency, parseFloat(interest)),
                        outstandingLoanBalance: FormatCurrency(loandetails.currency, parseFloat(outstandingBalance))
                    });

                    if (monthofyear === 12) {
                        // Add summary for the year
                        summaryCalculations.push({
                            year: year.toString(),
                            totalPrincipal: FormatCurrency(loandetails.currency, parseFloat(summaryYearPrincipal)),
                            totalInterest: FormatCurrency(loandetails.currency, parseFloat(summaryYearInterest)),
                            totalEMI: FormatCurrency(loandetails.currency, parseFloat(summaryYearEMI))
                        });
                        summaryYearEMI = 0;
                        summaryYearInterest = 0;
                        summaryYearPrincipal = 0;
                        year++;
                        monthofyear = 1;
                    } else {
                        monthofyear++;
                    }
                }

                setEmiCalculations(calculations);

                // Calculate overall totals
                const overallTotalEMI = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalEMI.replace(/[^0-9.-]+/g, "")), 0);
                const overallTotalInterest = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalInterest.replace(/[^0-9.-]+/g, "")), 0);
                const overallTotalPrincipal = summaryCalculations.reduce((acc, curr) => acc + parseFloat(curr.totalPrincipal.replace(/[^0-9.-]+/g, "")), 0);

                // Add total row
                summaryCalculations.push({
                    year: "Total",
                    totalEMI: FormatCurrency(loandetails.currency, parseFloat(overallTotalEMI)),
                    totalInterest: FormatCurrency(loandetails.currency, parseFloat(overallTotalInterest)),
                    totalPrincipal: FormatCurrency(loandetails.currency, parseFloat(overallTotalPrincipal))
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

        if (!loandetails.purchase_price || loandetails.purchase_price <= 0) errors.purchase_price = 'Purchase Price is required';
        if (!loandetails.loan_amount || loandetails.loan_amount <= 0) errors.loan_amount = 'Loan Amount is required';
        if (!loandetails.tenor_months || loandetails.tenor_months <= 0) errors.tenor_months = 'Tenor is required';
        if (!loandetails.interest_rate || loandetails.interest_rate <= 0) errors.interest_rate = 'Interest Rate is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(loandetails.purchase_price)) errors.purchase_price = 'Purchase Price should be numeric';
        if (isNaN(loandetails.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(loandetails.tenor_months)) errors.tenor_months = 'Tenor should be numeric';
        if (isNaN(loandetails.interest_rate)) errors.interest_rate = 'Interest Rate should be numeric';
        
        setErrors(errors);

        return Object.keys(errors).length === 0;
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
                Flat Rate Loan EMI Calculator
            </Typography>
            <Grid container spacing={2}>
                <Grid item size={12}>
                    <Typography variant="h7" component="h2" gutterBottom sx={{ textDecoration: 'underline', pb: 0 }}>
                        Loan Details:
                    </Typography>
                </Grid>
                <Grid item size={3}>
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
                <Grid item size={3}>
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
                <Grid item size={3}>
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
                <Grid item size={3}>
                    <TextField
                        variant="outlined"
                        label="Interest Rate"
                        name="interest_rate"
                        value={loandetails.interest_rate}
                        fullWidth
                        required
                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                        error={!!errors.interest_rate}
                        helperText={errors.interest_rate}
                        size="small"
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

export default FlatRateLoanEMICalculator;