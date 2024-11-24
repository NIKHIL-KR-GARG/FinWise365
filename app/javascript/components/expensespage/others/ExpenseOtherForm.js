import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Snackbar, IconButton, TextField, Button, Typography, Box, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';
import { CalculatePrincipal, CalculateInterest } from '../../common/CalculateInterestAndPrincipal';

const ExpenseOtherForm = ({ other: initialOther, action, onClose, refreshOtherList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [totalExpense, setTotalExpense] = useState(0.0);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    
    const [other, setOther] = useState(initialOther || {
        user_id: 0,
        expense_name:'',
        location: currentUserCountryOfResidence || '',
        currency: currentUserBaseCurrency || '',
        expense_date:'',
        amount: 0.0,
        is_recurring: false,
        recurring_frequency: 'Monthly',
        duration: 0,
        end_date: '',
        recurring_amount: 0.0,
        inflation_rate: 0.0,
        totalExpense: 0.0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (other[name] !== newValue) {
            setOther({
                ...other,
                [name]: newValue
            });
        }

        // check if expense duration is changed, then calculate end date
        if (name === 'duration') {
            const endDate = new Date(other.expense_date);
            endDate.setMonth(endDate.getMonth() + parseInt(value));
            setOther((prevOther) => ({
                ...prevOther,
                end_date: endDate.toISOString().split('T')[0]
            }));
        }
        // else if end date is changed, then calculate debt duration in months
        else if (name === 'end_date') {
            const startDate = new Date(other.expense_date);
            const endDate = new Date(value);
            const duration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            setOther((prevOther) => ({
                ...prevOther,
                duration: parseInt(duration)
            }));
        }
        //calulate end date based on duration if expense date is changed
        else if (name === 'expense_date') {
            if (other.is_recurring) {
                const endDate = new Date(value).setMonth(new Date(value).getMonth() + parseInt(other.duration));
                setOther((prevOther) => ({
                    ...prevOther,
                    expense_date: value,
                    end_date: new Date(endDate).toISOString().split('T')[0]
                }));
            }
            else {
                setOther((prevOther) => ({
                    ...prevOther,
                    expense_date: value
                }));
            }
        }
    };

    useEffect(() => {
        calculateTotalExpense();
    }, [other]);

    useEffect(() => {
        if (initialOther) {
            setOther(initialOther);
        }
    }, [initialOther]);

    const validate = () => {
        const errors = {};

        if (!other.expense_name) errors.expense_name = 'Expense Name is required';
        if (!other.location) errors.location = 'Location is required';
        if (!other.currency) errors.currency = 'Currency is required';
        if (!other.expense_date) errors.expense_date = 'Expense Date is required';
        if (!other.amount) errors.amount = 'Amount is required';

        if (other.is_recurring) {
            if (!other.recurring_frequency) errors.recurring_frequency = 'Recurring Frequency is required';
            if (!other.duration && !other.end_date) {
                errors.duration = 'End Date or Duration is required';
                errors.end_date = 'End Date or Duration is required';
            }
            if (!other.recurring_amount) errors.recurring_amount = 'Recurring Amount is required';
            // if (!other.inflation_rate) errors.inflation_rate = 'Inflation Rate is required';
        }

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(other.amount)) errors.amount = 'Amount should be numeric';
        if (isNaN(other.recurring_amount)) errors.recurring_amount = 'Recurring Amount should be numeric';
        if (isNaN(other.inflation_rate)) errors.inflation_rate = 'Inflation Rate should be numeric';
        
        // check that the end date is after the start date
        if (other.end_date && new Date(other.end_date) < new Date(other.expense_date)) {
            errors.end_date = 'End Date should be after Expense Date';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                other.user_id = currentUserId;
                const response = initialOther
                    ? await axios.put(`/api/expense_others/${other.id}`, other)
                    : await axios.post('/api/expense_others', other);
                
                let successMsg = '';
                if (action === 'Add') successMsg = 'Other expense added successfully';
                else if (action === 'Edit') successMsg = 'Other expense updated successfully';
                
                setErrorMessage('');
                onClose(); // Close the Expense Other Form window
                refreshOtherList(response.data, successMsg); // Pass the updated other and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add other expense');
                else if (action === 'Edit') setErrorMessage('Failed to update other expense');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculateTotalExpense = () => {

        if (!other.expense_date || !other.amount ) return;
        if (other.is_recurring && (!other.recurring_frequency || !other.recurring_amount || !other.duration )) return;

        if (other.is_recurring) {
            let monthsForRecurringExpense = (new Date(other.end_date).getFullYear() - new Date(other.expense_date).getFullYear()) * 12 + new Date(other.end_date).getMonth() - new Date(other.expense_date).getMonth();
            const totalPrincipal = CalculatePrincipal (
                "Fixed",
                other.amount,
                monthsForRecurringExpense,
                other.recurring_frequency,
                other.recurring_amount
            );

            let totalInterest = 0.0;
            // calculate interest till payment end date
            totalInterest += CalculateInterest (
                "Fixed",
                "Simple",
                other.inflation_rate,
                other.amount,
                monthsForRecurringExpense,
                other.recurring_frequency,
                other.recurring_amount,
                "Monthly" //does not matter as we are calculating simple interest
            );

            setTotalExpense(parseFloat(totalPrincipal) + parseFloat(totalInterest));
        }
        else setTotalExpense(parseFloat(other.amount));

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
                        Other Expense
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name"
                            value={other.expense_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.expense_name}
                            helperText={errors.expense_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Total Expense"
                            name="total_expense"
                            value={FormatCurrency(other.currency, totalExpense)}
                            onChange={handleChange}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Other Location"
                            name="other_location"
                            value={other.location}
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
                            value={other.currency}
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
                            label="Expense Date"
                            name="expense_date"
                            value={other.expense_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.expense_date}
                            helperText={errors.expense_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Expense Amount"
                            name="amount"
                            value={other.amount}
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
                            <Grid item size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={other.is_recurring}
                                            onChange={handleChange}
                                            name="is_recurring"
                                        />}
                                    label="Recurring Expense?"
                                />
                            </Grid>
                            {other.is_recurring && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            select
                                            variant="standard"
                                            label="Recurring Frequency"
                                            name="recurring_frequency"
                                            value={other.recurring_frequency}
                                            onChange={handleChange}
                                            fullWidth
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
                                            value={other.duration}
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
                                            label="Expense End Date"
                                            name="end_date"
                                            value={other.end_date}
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
                                            label="Recurring Amount"
                                            name="recurring_amount"
                                            value={other.recurring_amount}
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
                                            variant="standard"
                                            label="Inflation Rate (%)"
                                            name="inflation_rate"
                                            value={other.inflation_rate}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.inflation_rate}
                                            helperText={errors.inflation_rate}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
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

export default ExpenseOtherForm;