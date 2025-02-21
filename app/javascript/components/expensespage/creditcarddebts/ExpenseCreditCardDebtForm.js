import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // Savings creditcarddebt icon
import CurrentIcon from '@mui/icons-material/BusinessCenter'; // Current creditcarddebt icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" creditcarddebt type
import TermIcon from '@mui/icons-material/AccessTime'; // New icon for "Term" creditcarddebt type
import { InputAdornment, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from '../../common/FormatCurrency';
import { calculateFlatRateEMI, calculateFlatRateInterest } from '../../calculators/CalculateInterestAndPrincipal';

const ExpenseCreditCardDebtForm = ({ creditcarddebt: initialCreditCardDebt, action, onClose, refreshCreditCardDebtList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';

    const [creditcarddebt, setCreditCardDebt] = useState(initialCreditCardDebt || {
        user_id: 0,
        debt_type: 'Loan',
        card_name: '',
        institution_name: '',
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        start_date: '',
        duration: 0,
        end_date: '',
        loan_amount: 0.0,
        interest_rate: 0.0,
        emi_amount: 0.0,
        is_dummy_data: false,
        is_dream: false
    });

    const [calculatedValues, setCalculatedValues] = useState({
        emi: 0.0,
        totalInterest: 0.0,
        totalCost: 0.0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (creditcarddebt[name] !== newValue) {
            setCreditCardDebt({
                ...creditcarddebt,
                [name]: newValue
            });
        }

        // check if debt duration is changed, then calculate end date
        if (name === 'duration') {
            const endDate = new Date(creditcarddebt.start_date);
            endDate.setMonth(endDate.getMonth() + 1 + parseInt(value));
            setCreditCardDebt((prevCreditCardDebt) => ({
                ...prevCreditCardDebt,
                end_date: endDate.toISOString().split('T')[0]
            }));
        }
        // else if end date is changed, then calculate debt duration in months
        else if (name === 'end_date') {
            // check that the new date is a valid date
            if (isNaN(new Date(value).getTime())) return;
            const startDate = new Date(creditcarddebt.start_date);
            const endDate = new Date(value);
            const duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            setCreditCardDebt((prevCreditCardDebt) => ({
                ...prevCreditCardDebt,
                duration: parseInt(duration)
            }));
        }
        //calulate end date based on duration if start date is changed
        else if (name === 'start_date') {
            // check that the new date is a valid date
            if (isNaN(new Date(value).getTime())) return;
            const endDate = new Date(value).setMonth(new Date(value).getMonth() + 1 + parseInt(creditcarddebt.duration));
            setCreditCardDebt((prevCreditCardDebt) => ({
                ...prevCreditCardDebt,
                start_date: value,
                end_date: new Date(endDate).toISOString().split('T')[0]
            }));
        }
    };

    useEffect(() => {
        calculatetInterestAndEMI();
    }, [creditcarddebt]);

    useEffect(() => {
        if (initialCreditCardDebt) {
            setCreditCardDebt(initialCreditCardDebt);
        }
    }, [initialCreditCardDebt]);

    const validate = () => {
        const errors = {};

        if (!creditcarddebt.card_name) errors.card_name = 'Card Name is required';
        if (!creditcarddebt.debt_type) errors.debt_type = 'Debt Type is required';
        if (!creditcarddebt.institution_name) errors.institution_name = 'Institution Name is required';
        if (!creditcarddebt.location) errors.location = 'Location is required';
        if (!creditcarddebt.currency) errors.currency = 'Currency is required';
        if (!creditcarddebt.start_date) errors.start_date = 'Start Date is required';
        if (!creditcarddebt.duration && !creditcarddebt.end_date) {
            errors.duration = 'Debt Duration Or End Date is required';
            errors.end_date = 'Debt Duration Or End Date is required';
        }
        if (!creditcarddebt.loan_amount) errors.loan_amount = 'Loan Amount is required';
        if (!creditcarddebt.interest_rate) errors.interest_rate = 'Interest Rate is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(creditcarddebt.duration)) errors.duration = 'Duration should be numeric';
        if (isNaN(creditcarddebt.loan_amount)) errors.loan_amount = 'Loan amount should be numeric';
        if (isNaN(creditcarddebt.interest_rate)) errors.interest_rate = 'Interest rate should be numeric';
        if (isNaN(creditcarddebt.emi_amount)) errors.emi_amount = 'EMI amount should be numeric';

        // check that the end date is after the start date
        if (creditcarddebt.start_date && creditcarddebt.end_date) {
            if (new Date(creditcarddebt.end_date) < new Date(creditcarddebt.start_date)) {
                errors.end_date = 'End Date should be after Start Date';
            }
        }

        if (action === 'Add' || action === 'Edit') {
            // check that the start_date is not in the future
            if (new Date(creditcarddebt.start_date) > new Date()) errors.start_date = 'Start Date cannot be in the future';
        }
        else if (action === 'Dream' || action === 'EditDream') {
            // check that the purchase_date is not in the past
            if (new Date(creditcarddebt.start_date) <= new Date()) errors.start_date = 'Start Date cannot be in the past';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                creditcarddebt.user_id = creditcarddebt.is_dummy_data ? 0 : currentUserId;
                if (action === 'Dream' || action === 'EditDream') creditcarddebt.is_dream = true; 
                else creditcarddebt.is_dream = false;
                
                const response = initialCreditCardDebt
                    ? await axios.put(`/api/expense_credit_card_debts/${creditcarddebt.id}`, creditcarddebt)
                    : await axios.post('/api/expense_credit_card_debts', creditcarddebt);

                let successMsg = '';
                if (action === 'Add' || action === 'Dream') successMsg = 'Credit Card Debt added successfully';
                else if (action === 'Edit' || action === 'EditDream') successMsg = 'Credit Card Debt updated successfully';

                setErrorMessage('');
                onClose(); // Close the Expense Credit Card Debt Form window
                refreshCreditCardDebtList(response.data, successMsg); // Pass the updated credit card debt and success message
            } catch (error) {
                if (action === 'Add' || action === 'Dream') setErrorMessage('Failed to add credit card debt');
                else if (action === 'Edit' || action === 'EditDream') setErrorMessage('Failed to update credit card debt');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculatetInterestAndEMI = () => {

        if (!creditcarddebt.interest_rate || !creditcarddebt.loan_amount || !creditcarddebt.start_date || (!creditcarddebt.duration && !creditcarddebt.end_date)) return;

        const emi = calculateFlatRateEMI(parseFloat(creditcarddebt.loan_amount), parseFloat(creditcarddebt.interest_rate), parseInt(creditcarddebt.duration));
        const totalInterest = calculateFlatRateInterest(parseFloat(creditcarddebt.loan_amount), parseFloat(creditcarddebt.interest_rate), parseInt(creditcarddebt.duration));
        const totalCost = parseFloat(creditcarddebt.loan_amount) + parseFloat(totalInterest);

        setCalculatedValues({
            emi,
            totalInterest,
            totalCost
        });

        // set emi amount in creditcarddebt object
        setCreditCardDebt((prevCreditCardDebt) => ({
            ...prevCreditCardDebt,
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
                    {(action === 'Add' || action === 'Dream') && (
                        <>
                            Add Credit Card Debt
                        </>
                    )}
                    {(action === 'Edit' || action === 'EditDream') && (
                        <>
                            Update Credit Card Debt
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" 
                    required
                    error={!!errors.debt_type}
                >
                    <FormLabel component="legend">Select Debt Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="debt_type" name="debt_type" value={creditcarddebt.debt_type} onChange={handleChange}>
                        <FormControlLabel
                            value="Loan"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><SavingsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Loan</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Balance Transfer"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CurrentIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Balance Transfer</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Oustanding"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><TermIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Oustanding</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Other"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><OtherIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Other</Typography></Grid>
                                </Grid>
                            }
                        />
                    </RadioGroup>
                    <FormHelperText>{errors.debt_type}</FormHelperText>
                </FormControl>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Card Name"
                            name="card_name"
                            value={creditcarddebt.card_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.card_name}
                            helperText={errors.card_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={creditcarddebt.institution_name}
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
                            value={creditcarddebt.location}
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
                            value={creditcarddebt.currency}
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
                            value={creditcarddebt.start_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                            error={!!errors.start_date}
                            helperText={errors.start_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Debt Amount"
                            name="loan_amount"
                            value={creditcarddebt.loan_amount}
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
                            label="Duration (Months)"
                            name="duration"
                            value={creditcarddebt.duration}
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
                            value={creditcarddebt.end_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Interest Rate (%)"
                            name="interest_rate"
                            value={creditcarddebt.interest_rate}
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
                            value={FormatCurrency(creditcarddebt.currency, creditcarddebt.emi_amount)}
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
                                        You have an intial debt of: <strong>{creditcarddebt.currency} {FormatCurrency(creditcarddebt.currency, parseFloat(creditcarddebt.loan_amount))} </strong>
                                        that is expected to incur an interest of: <strong style={{ color: 'blue' }}>{creditcarddebt.currency} {FormatCurrency(creditcarddebt.currency, calculatedValues.totalInterest)}</strong>
                                    </Typography>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        Your overall outlay would be: <strong style={{ color: 'brown' }}>{creditcarddebt.currency} {FormatCurrency(creditcarddebt.currency, calculatedValues.totalCost)} </strong>
                                        at the end of the credit card debt period
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            {currentUserIsAdmin && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={creditcarddebt.is_dummy_data}
                                            onChange={handleChange}
                                            name="is_dummy_data"
                                        />
                                    }
                                    label="Is Dummy Data?"
                                />
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={creditcarddebt.is_dummy_data && !currentUserIsAdmin}
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

export default ExpenseCreditCardDebtForm;