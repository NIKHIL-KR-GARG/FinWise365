import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DollarIcon from '@mui/icons-material/AttachMoney'; // Dollar sign icon
// import CurrentIcon from '@mui/icons-material/BusinessCenter'; // Current income icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" income type
import { Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';

const AssetIncomeForm = ({ income: initialIncome, action, onClose, refreshIncomeList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    
    const [income, setIncome] = useState(initialIncome || {
        user_id: 0,
        income_name: "",
        income_type: "Salary",
        income_location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        income_amount: 0.0,
        start_date: "",
        end_date: "",
        is_recurring: true,
        income_frequency: "Monthly",
        growth_rate: 0.0,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (income[name] !== newValue) {
            setIncome({
                ...income,
                [name]: newValue
            });
        }
    };

    useEffect(() => {
        if (initialIncome) {
            setIncome(initialIncome);
        }
    }, [initialIncome, action]);

    const validate = () => {
        const errors = {};

        if (!income.income_name) errors.income_name = 'Income Name is required';
        if (!income.income_type) errors.income_type = 'Income Type is required';
        if (!income.income_location) errors.income_location = 'Income Location is required';
        if (!income.currency) errors.currency = 'Currency is required';
        if (!income.start_date) errors.start_date = 'Start Date is required';
        if (!income.income_amount) errors.income_amount = 'Income Amount is required';
        if (!income.income_frequency) errors.income_frequency = 'Income Frequency is required';
        if (!income.growth_rate) errors.growth_rate = 'Growth Rate is required';
        
        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(income.income_amount)) errors.income_amount = 'Amount should be numeric';
        if (isNaN(income.growth_rate)) errors.growth_rate = 'Growth Rate should be numeric';
        
        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                income.user_id = currentUserId;
                const response = initialIncome
                    ? await axios.put(`/api/asset_incomes/${income.id}`, income)
                    : await axios.post('/api/asset_incomes', income);
                
                let successMsg = '';
                if (action === 'Add') successMsg = 'Income added successfully';
                else if (action === 'Edit') successMsg = 'Income updated successfully';
                
                setErrorMessage('');
                onClose(); // Close the Asset Income Form window
                refreshIncomeList(response.data, successMsg); // Pass the updated income and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add income');
                else if (action === 'Edit') setErrorMessage('Failed to update income');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '90vh', overflowY: 'auto' }}>
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
                    <DollarIcon style={{ color: 'purple', marginRight: '10px' }} />
                    { action === 'Add' && (
                        <>
                            Add Income
                        </>
                    )}
                    { action === 'Edit' && (
                        <>
                            Update Income Details
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Income Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="income_type" name="income_type" value={income.income_type} onChange={handleChange}>
                        <FormControlLabel
                            value="Salary"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><DollarIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Salary</Typography></Grid>
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
                            label="Income Name"
                            name="income_name"
                            value={income.income_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.income_name}
                            helperText={errors.income_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Income Amount"
                            name="income_amount"
                            value={income.income_amount}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.income_amount}
                            helperText={errors.income_amount}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Income Location"
                            name="income_location"
                            value={income.income_location}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.income_location}
                            helperText={errors.income_location}
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
                            value={income.currency}
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
                            label="Start Date"
                            name="start_date"
                            value={income.start_date}
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
                            type="date"
                            variant="standard"
                            label="End Date"
                            name="end_date"
                            value={income.end_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={income.is_recurring}
                                    onChange={handleChange}
                                    name="is_recurring"
                                />}
                            label="Recurring Income?"
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                                select
                                variant="standard"
                                label="Income Frequency"
                                name="income_frequency"
                                value={income.income_frequency}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="Daily">Daily</MenuItem>
                                <MenuItem value="Weekly">Weekly</MenuItem>
                                <MenuItem value="Fortnightly">Fortnightly</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                <MenuItem value="Semi-Annually">Semi-Annually</MenuItem>
                                <MenuItem value="Annually">Annually</MenuItem>
                            </TextField>
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Growth Rate"
                            name="growth_rate"
                            value={income.growth_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.growth_rate}
                            helperText={errors.growth_rate}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
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

export default AssetIncomeForm;