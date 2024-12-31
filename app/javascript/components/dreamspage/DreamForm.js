import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Snackbar, IconButton, TextField, Button, Typography, Box, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

import CurrencyList from '../common/CurrencyList';
import CountryList from '../common/CountryList';
import { FormatCurrency } from '../common/FormatCurrency';
import { calculateFlatRateEMI } from '../calculators/CalculateInterestAndPrincipal';

const DreamForm = ({ dream: initialDream, action, onClose, refreshDreamList, dreamType }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [total, setTotal] = useState(0.0);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';

    const [dream, setDream] = useState(initialDream || {
        user_id: 0,
        dream_name: '',
        dream_type: '',
        location: currentUserCountryOfResidence || '',
        currency: currentUserBaseCurrency || '',
        dream_date: '',
        amount: 0.0,
        is_recurring: false,
        recurring_amount: 0.0,
        recurring_frequency: 'Annually',
        duration: 0,
        end_date: '',
        is_funded_by_loan: false,
        loan_amount: 0.0,
        loan_start_date: '',
        loan_duration: 0,
        loan_end_date: '',
        interest_rate: 0.0,
        emi_amount: 0.0,
        is_dummy_data: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (dream[name] !== newValue) {
            setDream({
                ...dream,
                [name]: newValue
            });
        }

        // check if duration is changed, then calculate end date
        if (name === 'duration') {
            const endDate = new Date(dream.dream_date);
            endDate.setMonth(endDate.getMonth() + 1 + parseInt(value));
            setDream((prevDream) => ({
                ...prevDream,
                end_date: endDate.toISOString().split('T')[0]
            }));
        }
        // else if end date is changed, then calculate duration in months
        else if (name === 'end_date') {
            const startDate = new Date(dream.dream_date);
            const endDate = new Date(value);
            const duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            setDream((prevDream) => ({
                ...prevDream,
                duration: parseInt(duration)
            }));
        }
        else if (name === 'dream_date') {
            const endDate = new Date(value).setMonth(new Date(value).getMonth() + 1 + parseInt(dream.duration));
            setDream((prevDream) => ({
                ...prevDream,
                dream_date: value,
                end_date: new Date(endDate).toISOString().split('T')[0]
            }));
        }
        // check if loan duration is changed, then calculate loan end date
        else if (name === 'loan_duration') {
            const endDate = new Date(dream.loan_start_date);
            endDate.setMonth(endDate.getMonth() + 1 + parseInt(value));
            setDream((prevDream) => ({
                ...prevDream,
                loan_end_date: endDate.toISOString().split('T')[0]
            }));
        }
        // else if loan end date is changed, then calculate loan duration in months
        else if (name === 'loan_end_date') {
            const startDate = new Date(dream.loan_start_date);
            const endDate = new Date(value);
            const duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            setDream((prevDream) => ({
                ...prevDream,
                loan_duration: parseInt(duration)
            }));
        }
        else if (name === 'loan_start_date') {
            const endDate = new Date(value);
            endDate.setMonth(new Date(value).getMonth() + 1 + parseInt(dream.loan_duration));
            setDream((prevDream) => ({
                ...prevDream,
                loan_start_date: value,
                loan_end_date: endDate.toISOString().split('T')[0]
            }));
        }
        calculateTotal();
    };

    useEffect(() => {
        calculateTotal();
    }, [dream]);

    useEffect(() => {
        if (initialDream) {
            setDream(initialDream);
        }
    }, [initialDream]);

    const validate = () => {
        const errors = {};

        if (!dream.dream_name) errors.dream_name = ' Name is required';
        if (!dream.location) errors.location = 'Location is required';
        if (!dream.currency) errors.currency = 'Currency is required';
        if (!dream.dream_date) errors.dream_date = 'Date is required';
        if (!dream.amount) errors.amount = 'Amount is required';

        // check that dream date is not in the past
        if (dream.dream_date && new Date(dream.dream_date) < new Date()) errors.dream_date = 'Date should be in the future';

        if (dream.is_recurring) {
            if (!dream.duration) errors.duration = 'Duration is required';
            if (!dream.end_date) errors.end_date = 'End Date is required';
            if (!dream.recurring_amount) errors.recurring_amount = 'Recurring Amount is required';
            if (!dream.recurring_frequency) errors.recurring_frequency = 'Recurring Frequency is required';
            if (!dream.duration && !dream.end_date) {
                errors.duration = 'Duration or End Date is required';
                errors.end_date = 'Duration or End Date is required';
            }
            // check that the end date is not before the dream date
            if (dream.end_date && new Date(dream.end_date) < new Date(dream.dream_date)) {
                errors.end_date = 'End Date should be after Dream Date';
            }
        }

        if (dream.is_funded_by_loan) {
            if (!dream.loan_start_date) errors.loan_start_date = 'Loan Start Date is required';
            if (!dream.loan_amount) errors.loan_amount = 'Loan Amount is required';
            if (!dream.loan_duration && !dream.loan_end_date) {
                errors.loan_duration = 'Loan End Date or Duration is required';
                errors.loan_end_date = 'Loan End Date or Duration is required';
            }
            if (!dream.interest_rate) errors.interest_rate = 'Interest Rate is required';
            if (!dream.emi_amount) errors.emi_amount = 'EMI Amount is required';

            // check that the loan end date is not before the loan start date
            if (dream.loan_end_date && new Date(dream.loan_end_date) < new Date(dream.loan_start_date)) {
                errors.loan_end_date = 'Loan End Date should be after Loan Start Date';
            }

            //check that the loan start date is not before the dream date
            if (dream.loan_start_date && new Date(dream.loan_start_date) < new Date(dream.dream_date)) {
                errors.loan_start_date = 'Loan Start Date should be after Dream Date';
            }
        }

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(dream.amount)) errors.amount = 'Amount should be numeric';
        if (isNaN(dream.duration)) errors.duration = 'Duration should be numeric';
        if (isNaN(dream.loan_duration)) errors.loan_duration = 'Loan Duration should be numeric';
        if (isNaN(dream.interest_rate)) errors.interest_rate = 'Interest Rate should be numeric';
        if (isNaN(dream.emi_amount)) errors.emi_amount = 'EMI Amount should be numeric';
        if (isNaN(dream.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(dream.recurring_amount)) errors.recurring_amount = 'Recurring Amount should be numeric';

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                dream.user_id = currentUserId;
                dream.dream_type = dreamType;
                const response = initialDream
                    ? await axios.put(`/api/dreams/${dream.id}`, dream)
                    : await axios.post('/api/dreams', dream);

                let successMsg = '';
                if (action === 'Add') successMsg = dreamType + ' added successfully';
                else if (action === 'Edit') successMsg = dreamType + ' updated successfully';

                setErrorMessage('');
                onClose(); // Close the  Dream Form window
                refreshDreamList(response.data, successMsg); // Pass the updated dream and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add ' + dreamType);
                else if (action === 'Edit') setErrorMessage('Failed to update ' + dreamType);
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculateTotal = () => {

        if (!dream.dream_date || !dream.amount) return;
        if (dream.is_funded_by_loan && (!dream.loan_start_date || (!dream.loan_duration && !dream.loan_end_date) || !dream.interest_rate)) return;

        // calculate EMI amount
        if (dream.is_funded_by_loan) {
            let monthsForLoan = 0;
            if (dream.loan_duration) monthsForLoan = parseFloat(dream.loan_duration);
            else monthsForLoan = (new Date(dream.loan_end_date).getFullYear() - new Date(dream.loan_start_date).getFullYear()) * 12 + new Date(dream.loan_end_date).getMonth() - new Date(dream.loan_start_date).getMonth();
            const emi = calculateFlatRateEMI(parseFloat(dream.loan_amount), parseFloat(dream.interest_rate), monthsForLoan);
            setDream((prevDream) => ({
                ...prevDream,
                emi_amount: parseFloat(emi)
            }));
        }

        return true;
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
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 1 }}>
                    <MiscellaneousServicesIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {(action === 'Add' || action === 'Dream') && (
                        <>
                            Add {dreamType}
                        </>
                    )}
                    {action === 'Edit' && (
                        <>
                            Update {dreamType} Details
                        </>
                    )}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <TextField
                            variant="standard"
                            label=" Name"
                            name="dream_name"
                            value={dream.dream_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.dream_name}
                            helperText={errors.dream_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Dream Location"
                            name="location"
                            value={dream.location}
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
                            value={dream.currency}
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
                            label="Dream Date"
                            name="dream_date"
                            value={dream.dream_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dream_date}
                            helperText={errors.dream_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Amount"
                            name="amount"
                            value={dream.amount}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.amount}
                            helperText={errors.amount}
                        />
                    </Grid>
                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={dream.is_recurring}
                                            onChange={handleChange}
                                            name="is_recurring"
                                        />}
                                    label="Is Recurring?"
                                />
                            </Grid>
                            {dream.is_recurring && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Recurring Amount"
                                            name="recurring_amount"
                                            value={dream.recurring_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.recurring_amount}
                                            helperText={errors.recurring_amount}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            select
                                            variant="standard"
                                            label="Recurring Frequency"
                                            name="recurring_frequency"
                                            value={dream.recurring_frequency}
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
                                            label="Duration (months)"
                                            name="duration"
                                            value={dream.duration}
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
                                            label="End Date"
                                            name="end_date"
                                            value={dream.end_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.end_date}
                                            helperText={errors.end_date}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={dream.is_funded_by_loan}
                                            onChange={handleChange}
                                            name="is_funded_by_loan"
                                        />}
                                    label="Funded by Loan?"
                                />
                            </Grid>
                            {dream.is_funded_by_loan && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Amount"
                                            name="loan_amount"
                                            value={dream.loan_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!errors.loan_amount}
                                            helperText={errors.loan_amount}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            type="date"
                                            variant="standard"
                                            label="Start Date"
                                            name="loan_start_date"
                                            value={dream.loan_start_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.loan_start_date}
                                            helperText={errors.loan_start_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Duration (months)"
                                            name="loan_duration"
                                            value={dream.loan_duration}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*' } }}
                                            error={!!errors.loan_duration}
                                            helperText={errors.loan_duration}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            type="date"
                                            variant="standard"
                                            label="Loan End Date"
                                            name="loan_end_date"
                                            value={dream.loan_end_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.loan_end_date}
                                            helperText={errors.loan_end_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Interest Rate (%)"
                                            name="interest_rate"
                                            value={dream.interest_rate}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.interest_rate}
                                            helperText={errors.interest_rate}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="EMI Amount"
                                            name="emi_amount"
                                            value={FormatCurrency(dream.currency, dream.emi_amount)}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled
                                            error={!!errors.emi_amount}
                                            helperText={errors.emi_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            {currentUserIsAdmin && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={dream.is_dummy_data}
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
                                disabled={dream.is_dummy_data && !currentUserIsAdmin}
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

export default DreamForm;