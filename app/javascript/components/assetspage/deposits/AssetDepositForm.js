import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // Savings deposit icon
import CurrentIcon from '@mui/icons-material/BusinessCenter'; // Current deposit icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" deposit type
import TermIcon from '@mui/icons-material/AccessTime'; // New icon for "Term" deposit type
import { Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';
import { CalculatePrincipal, CalculateInterest } from '../../calculators/CalculateInterestAndPrincipal';

const AssetDepositForm = ({ deposit: initialDeposit, action, onClose, refreshDepositList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';
    
    const [deposit, setDeposit] = useState(initialDeposit || {
        user_id: 0,
        deposit_name: "",
        deposit_type: "Fixed",
        institution_name: "",
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        opening_date: new Date().toISOString().split('T')[0],
        amount: 0.0,
        deposit_term: 0,
        maturity_date: "",
        interest_rate: 0.0,
        interest_type: "Simple",
        compounding_frequency: "",
        payment_frequency: "Monthly",
        payment_amount: 0.0,
        total_interest: 0.0,
        total_principal: 0.0,
        is_dummy_data: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (deposit[name] !== newValue) {
            setDeposit({
                ...deposit,
                [name]: newValue
            });
        }
        // Check if deposit type is fixed, then set payment amount and frequency to zero
        if (name === 'deposit_type') {
            if (value === 'Fixed') {
                setDeposit((prevDeposit) => ({
                    ...prevDeposit,
                    payment_amount: 0.0,
                    payment_frequency: 'Monthly'
                }));
            }
            // Check if deposit type is recurring, then set interest type to compounding
            else {
                setDeposit((prevDeposit) => ({
                    ...prevDeposit,
                    interest_type: 'Compounding'
                }));
            }
        }
        // check if deposit term is changed, then calculate maturity date
        else if (name === 'deposit_term') {
            const maturityDate = new Date(deposit.opening_date);
            maturityDate.setMonth(maturityDate.getMonth() + parseInt(value));
            setDeposit((prevDeposit) => ({
                ...prevDeposit,
                maturity_date: maturityDate.toISOString().split('T')[0]
            }));
        }
        // else if maturity date is changed, then calculate deposit term in months
        else if (name === 'maturity_date') {
            const openingDate = new Date(deposit.opening_date);
            const maturityDate = new Date(value);
            const depositTerm = (maturityDate.getFullYear() - openingDate.getFullYear()) * 12 + (maturityDate.getMonth() - openingDate.getMonth());
            setDeposit((prevDeposit) => ({
                ...prevDeposit,
                deposit_term: parseInt(depositTerm)
            }));
        }
    };

    useEffect(() => {
        calculatetTotalInterest();
    }, [deposit]);

    useEffect(() => {
        if (initialDeposit) {
            setDeposit(initialDeposit);
        }
    }, [initialDeposit, action]);

    const validate = () => {
        const errors = {};

        if (!deposit.deposit_name) errors.deposit_name = 'Deposit Name is required';
        if (!deposit.deposit_type) errors.deposit_type = 'Deposit Type is required';
        if (!deposit.institution_name) errors.institution_name = 'Institution Name is required';
        if (!deposit.location) errors.location = 'Deposit Location is required';
        if (!deposit.currency) errors.currency = 'Currency is required';
        if (!deposit.opening_date) errors.opening_date = 'Opening Date is required';
        if (!deposit.amount) errors.amount = 'Deposit Amount is required';
        if (!deposit.deposit_term && !deposit.maturity_date) {
            errors.deposit_term = 'Deposit Term Or Maturity Date is required';
            errors.maturity_date = 'Deposit Term Or Maturity Date is required';
        }
        if (!deposit.interest_rate) errors.interest_rate = 'Interest Rate is required';
        if (deposit.interest_type === 'Compounding') {
            if (!deposit.compounding_frequency) errors.compounding_frequency = 'Compounding Frequency is required';
        }
        if (deposit.deposit_type === 'Recurring') {
            if (!deposit.payment_frequency) errors.payment_frequency = 'Payment Frequency is required';
            if (!deposit.payment_amount) errors.payment_amount = 'Payment Amount is required';
        }

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(deposit.interest_rate)) errors.interest_rate = 'Interest Rate should be numeric';
        if (isNaN(deposit.amount)) errors.deposit_balance = 'Deposit Amount should be numeric';
        if (isNaN(deposit.deposit_term)) errors.deposit_term = 'Deposit Term should be numeric';
        if (isNaN(deposit.payment_amount)) errors.payment_amount = 'Payment amount should be numeric';

        // check that maturity date is greater than opening date
        if (deposit.opening_date && deposit.maturity_date) {
            if (new Date(deposit.maturity_date) < new Date(deposit.opening_date)) {
                errors.maturity_date = 'Maturity Date should be greater than Opening Date';
            }
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                deposit.user_id = currentUserId;
                const response = initialDeposit
                    ? await axios.put(`/api/asset_deposits/${deposit.id}`, deposit)
                    : await axios.post('/api/asset_deposits', deposit);

                let successMsg = '';
                if (action === 'Add') successMsg = 'Deposit added successfully';
                else if (action === 'Edit') successMsg = 'Deposit updated successfully';

                setErrorMessage('');
                onClose(); // Close the Asset Deposit Form window
                refreshDepositList(response.data, successMsg); // Pass the updated deposit and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add deposit');
                else if (action === 'Edit') setErrorMessage('Failed to update deposit');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculatetTotalInterest = () => {

        if (!deposit.deposit_type || !deposit.interest_type || !deposit.interest_rate || !deposit.amount || !deposit.deposit_term) return;

        const totalInterest = CalculateInterest(
                deposit.deposit_type,
                deposit.interest_type,
                deposit.interest_rate,
                deposit.amount,
                deposit.deposit_term,
                deposit.payment_frequency,
                deposit.payment_amount,
                deposit.compounding_frequency
            );

        const totalPrincipal = CalculatePrincipal(
                deposit.deposit_type,
                deposit.amount,
                deposit.deposit_term,
                deposit.payment_frequency,
                deposit.payment_amount
            );

        setDeposit((prevDeposit) => ({
            ...prevDeposit,
            total_interest: totalInterest,
            total_principal: totalPrincipal
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
                    <SavingsIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {action === 'Add' && (
                        <>
                            Add Deposit
                        </>
                    )}
                    {action === 'Edit' && (
                        <>
                            Update Deposit Details
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Deposit Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="deposit_type" name="deposit_type" value={deposit.deposit_type} onChange={handleChange}>
                        <FormControlLabel
                            value="Fixed"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><SavingsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Fixed</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Recurring"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CurrentIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Recurring</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Term"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><TermIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Term</Typography></Grid>
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
                </FormControl>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Deposit Name"
                            name="deposit_name"
                            value={deposit.deposit_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.deposit_name}
                            helperText={errors.deposit_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={deposit.institution_name}
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
                            label="Deposit Location"
                            name="location"
                            value={deposit.location}
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
                            value={deposit.currency}
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
                            label="Deposit Opening Date"
                            name="opening_date"
                            value={deposit.opening_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.opening_date}
                            helperText={errors.opening_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Deposit Amount"
                            name="amount"
                            value={deposit.amount}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.amount}
                            helperText={errors.amount}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Deposit Term (months)"
                            name="deposit_term"
                            value={deposit.deposit_term}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*' } }}
                            error={!!errors.deposit_term}
                            helperText={errors.deposit_term}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            type="date"
                            variant="standard"
                            label="Deposit Maturity Date"
                            name="maturity_date"
                            value={deposit.maturity_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.maturity_date}
                            helperText={errors.maturity_date}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <TextField
                            variant="standard"
                            label="Interest Rate (%)"
                            name="interest_rate"
                            value={deposit.interest_rate}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.interest_rate}
                            helperText={errors.interest_rate}
                        />
                    </Grid>
                    {deposit.deposit_type !== 'Fixed' && (
                        <>
                            <Grid item size={6}>
                                <TextField
                                    select
                                    variant="standard"
                                    label="RD Payment Frequency"
                                    name="payment_frequency"
                                    value={deposit.payment_frequency}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                                    <MenuItem value="Semi-Annually">Semi-Annually</MenuItem>
                                    <MenuItem value="Annually">Annually</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item size={6}>
                                <TextField
                                    variant="standard"
                                    label={`${deposit.payment_frequency} Payment Amount`} // Updated label
                                    name="payment_amount"
                                    value={deposit.payment_amount}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                    error={!!errors.payment_amount}
                                    helperText={errors.payment_amount}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item size={6}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Interest Type</FormLabel>
                            <RadioGroup
                                row
                                aria-label="interest_type"
                                name="interest_type"
                                value={deposit.interest_type}
                                onChange={handleChange}
                                disabled={deposit.deposit_type === 'Recurring'}
                            >
                                <FormControlLabel value="Simple" control={<Radio />} label="Simple" />
                                <FormControlLabel value="Compounding" control={<Radio />} label="Compounding" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {deposit.interest_type === 'Compounding' && (
                        <Grid item size={6}>
                            <TextField
                                select
                                variant="standard"
                                label="Compounding Frequency"
                                name="compounding_frequency"
                                value={deposit.compounding_frequency}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                <MenuItem value="Semi-Annually">Semi-Annually</MenuItem>
                                <MenuItem value="Annually">Annually</MenuItem>
                            </TextField>
                        </Grid>
                    )}
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
                                        You will have invested a total amount of: <strong>{deposit.currency} {FormatCurrency(deposit.currency, parseFloat(deposit.total_principal))} </strong>
                                        that is expected to generate an interest of: <strong style={{ color: 'blue' }}>{deposit.currency} {FormatCurrency(deposit.currency, deposit.total_interest)}</strong>
                                    </Typography>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        You will have a total of: <strong style={{ color: 'brown' }}>{deposit.currency} {FormatCurrency(deposit.currency, (parseFloat(deposit.total_principal) + parseFloat(deposit.total_interest)))} </strong>
                                        at the end of the deposit term
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
                                            checked={deposit.is_dummy_data}
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
                                disabled={deposit.is_dummy_data && !currentUserIsAdmin}
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

export default AssetDepositForm;