import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputAdornment, Alert, Snackbar, IconButton, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';
import { calculateFlatRateEMI, calculateFlatRateInterest } from '../../calculators/CalculateInterestAndPrincipal';

const ExpensePersonalLoanForm = ({ personalloan: initialPersonalLoan, action, onClose, refreshPersonalLoanList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const [personalloan, setPersonalLoan] = useState(initialPersonalLoan || {
        user_id: 0,
        loan_name: '',
        institution_name: '',
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        start_date: '',
        duration: 0,
        end_date: '',
        loan_amount: 0.0,
        interest_rate: 0.0,
        emi_amount: 0.0
    });

    const [calculatedValues, setCalculatedValues] = useState({
        emi: 0.0,
        totalInterest: 0.0,
        totalCost: 0.0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (personalloan[name] !== newValue) {
            setPersonalLoan({
                ...personalloan,
                [name]: newValue
            });
        }
        
        // check if debt duration is changed, then calculate end date
        if (name === 'duration') {
            const endDate = new Date(personalloan.start_date);
            endDate.setMonth(endDate.getMonth() + parseInt(value));
            setPersonalLoan((prevPersonalLoan) => ({
                ...prevPersonalLoan,
                end_date: endDate.toISOString().split('T')[0]
            }));
        }
        // else if end date is changed, then calculate debt duration in months
        else if (name === 'end_date') {
            const startDate = new Date(personalloan.start_date);
            const endDate = new Date(value);
            const duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            setPersonalLoan((prevPersonalLoan) => ({
                ...prevPersonalLoan,
                duration: parseInt(duration)
            }));
        } 
        //calulate end date based on duration if start date is changed
        else if (name === 'start_date') {
            const endDate = new Date(value).setMonth(new Date(value).getMonth() + parseInt(personalloan.duration));
            setCreditCardDebt((prevPersonalLoan) => ({
                ...prevPersonalLoan,
                start_date: value,
                end_date: new Date(endDate).toISOString().split('T')[0]
            }));
        }
    };

    useEffect(() => {
        calculatetInterestAndEMI();
    }, [personalloan]);

    useEffect(() => {
        if (initialPersonalLoan) {
            setPersonalLoan(initialPersonalLoan);
        }
    }, [initialPersonalLoan]);

    const validate = () => {
        const errors = {};

        if (!personalloan.loan_name) errors.loan_name = 'Loan Name is required';
        if (!personalloan.institution_name) errors.institution_name = 'Institution Name is required';
        if (!personalloan.location) errors.location = 'Location is required';
        if (!personalloan.currency) errors.currency = 'Currency is required';
        if (!personalloan.start_date) errors.start_date = 'Start Date is required';
        if (!personalloan.duration && !personalloan.end_date) {
            errors.duration = 'Debt Duration Or End Date is required';
            errors.end_date = 'Debt Duration Or End Date is required';
        }
        if (!personalloan.loan_amount) errors.loan_amount = 'Loan Amount is required';
        if (!personalloan.interest_rate) errors.interest_rate = 'Interest Rate is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(personalloan.duration)) errors.duration = 'Duration should be numeric';
        if (isNaN(personalloan.loan_amount)) errors.loan_amount = 'Loan amount should be numeric';
        if (isNaN(personalloan.interest_rate)) errors.interest_rate = 'Interest rate should be numeric';
        if (isNaN(personalloan.emi_amount)) errors.emi_amount = 'EMI amount should be numeric';

        // check that the end date is after the start date
        if (personalloan.start_date && personalloan.end_date) {
            if (new Date(personalloan.end_date) < new Date(personalloan.start_date)) {
                errors.end_date = 'End Date should be after Start Date';
            }
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                personalloan.user_id = currentUserId;
                const response = initialPersonalLoan
                    ? await axios.put(`/api/expense_personal_loans/${personalloan.id}`, personalloan)
                    : await axios.post('/api/expense_personal_loans', personalloan);

                let successMsg = '';
                if (action === 'Add') successMsg = 'Personal Loan added successfully';
                else if (action === 'Edit') successMsg = 'Personal Loan updated successfully';

                setErrorMessage('');
                onClose(); // Close the Expense Personal Loan Form window
                refreshPersonalLoanList(response.data, successMsg); // Pass the updated Personal Loan and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add personal loan');
                else if (action === 'Edit') setErrorMessage('Failed to update personal loan');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculatetInterestAndEMI = () => {

        if (!personalloan.interest_rate || !personalloan.loan_amount || !personalloan.start_date || (!personalloan.duration && !personalloan.end_date)) return;

        const emi = calculateFlatRateEMI(parseFloat(personalloan.loan_amount), parseFloat(personalloan.interest_rate), parseInt(personalloan.duration));
        const totalInterest = calculateFlatRateInterest(parseFloat(personalloan.loan_amount), parseFloat(personalloan.interest_rate), parseInt(personalloan.duration));
        const totalCost = parseFloat(personalloan.loan_amount) + parseFloat(totalInterest);

        setCalculatedValues({
            emi,
            totalInterest,
            totalCost
        });

        // set emi amount in personalloan object
        setPersonalLoan((prevPersonalLoan) => ({
            ...prevPersonalLoan,
            emi_amount: parseFloat(emi)
        }));
    }

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
            <form>
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                    <CreditCardIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {action === 'Add' && (
                        <>
                            Add Personal Loan
                        </>
                    )}
                    {action === 'Edit' && (
                        <>
                            Update Personal Loan
                        </>
                    )}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Loan Name"
                            name="loan_name"
                            value={personalloan.loan_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.loan_name}
                            helperText={errors.loan_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={personalloan.institution_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.institution_name}
                            helperText={errors.institution_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Location"
                            name="location"
                            value={personalloan.location}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.location}
                            helperText={errors.location}
                        >
                            {CountryList.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Currency"
                            name="currency"
                            value={personalloan.currency}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.currency}
                            helperText={errors.currency}
                        >
                            {CurrencyList.map((currency) => (
                                <MenuItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            type="date"
                            variant="standard"
                            label="Debt Start Date"
                            name="start_date"
                            value={personalloan.start_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.start_date}
                            helperText={errors.start_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Debt Amount"
                            name="loan_amount"
                            value={personalloan.loan_amount}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.loan_amount}
                            helperText={errors.loan_amount}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Duration (months)"
                            name="duration"
                            value={personalloan.duration}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*' } }}
                            error={!!errors.duration}
                            helperText={errors.duration}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            type="date"
                            variant="standard"
                            label="Debt End Date"
                            name="end_date"
                            value={personalloan.end_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Interest Rate (%)"
                            name="interest_rate"
                            value={personalloan.interest_rate}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.interest_rate}
                            helperText={errors.interest_rate}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="EMI Amount (Monthly)"
                            name="emi_amount"
                            value={FormatCurrency(personalloan.currency, personalloan.emi_amount)}
                            onChange={handleChange}
                            fullWidth
                            disabled
                            error={!!errors.emi_amount}
                            helperText={errors.emi_amount}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">/mth</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderRadius: 3, bgcolor: 'lightgray' }}>
                            <Grid container spacing={2}>
                                <Grid item size={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <IconButton>
                                        <img src="/money.png" alt="money" style={{ width: 72, height: 72 }} />
                                    </IconButton>
                                </Grid>
                                <Grid item size={10} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        You have an intial debt of: <strong>{personalloan.currency} {FormatCurrency(personalloan.currency, parseFloat(personalloan.loan_amount))} </strong>
                                        that is expected to incur an interest of: <strong style={{ color: 'blue' }}>{personalloan.currency} {FormatCurrency(personalloan.currency, calculatedValues.totalInterest)}</strong>
                                    </Typography>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        Your overall outlay would be: <strong style={{ color: 'brown' }}>{personalloan.currency} {FormatCurrency(personalloan.currency, calculatedValues.totalCost)} </strong>
                                        at the end of the personal loan period
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={personalloan.is_dummy_data}
                                sx={{
                                    fontSize: '1rem',
                                    padding: '10px 40px',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default ExpensePersonalLoanForm;