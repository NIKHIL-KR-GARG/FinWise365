import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { InputAdornment, Alert, Snackbar, IconButton, TextField, Button, Typography, Box, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const ExpenseHomeForm = ({ home: initialHome, action, onClose, refreshHomeList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [period, setPeriod] = useState('monthly');

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    
    const [home, setHome] = useState(initialHome || {
        user_id: 0,
        home_name: "",
        start_date: "",
        end_date: "",
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        groceries: 0.0,
        clothes: 0.0,
        utilities: 0.0,
        furniture: 0.0,
        health: 0.0,
        transport: 0.0,
        communication: 0.0,
        entertainment: 0.0,
        education: 0.0,
        dining: 0.0,
        holidays: 0.0,
        miscellaneous: 0.0,
        total_expense: 0.0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (home[name] !== newValue) {
            setHome({
                ...home,
                [name]: newValue
            });
        }
    };

    const handlePeriodChange = (event, newPeriod) => {
        if (newPeriod !== null) {
            const factor = newPeriod === 'yearly' ? 12 : 1 / 12;
            const updatedHome = { ...home };

            const fieldsToUpdate = [
                'groceries', 'clothes', 'utilities', 'furniture', 'health',
                'transport', 'communication', 'entertainment', 'education',
                'dining', 'holidays', 'miscellaneous'
            ];

            fieldsToUpdate.forEach(field => {
                updatedHome[field] = parseFloat((home[field] * factor).toFixed(2));
            });

            setHome(updatedHome);
            setPeriod(newPeriod);
        }
    };

    useEffect(() => {
        calculateTotalExpense();
    }, [home]);

    useEffect(() => {
        if (initialHome) {
            setHome(initialHome);
        }
    }, [initialHome]);

    const validate = () => {
        const errors = {};

        if (!home.home_name) errors.home_name = 'Home Name is required';
        if (!home.location) errors.location = 'Location is required';
        if (!home.currency) errors.currency = 'Currency is required';
        if (!home.start_date) errors.start_date = 'Start Date is required';
        // if (!home.end_date) errors.end_date = 'End Date is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(home.groceries)) errors.groceries = 'Groceries should be numeric';
        if (isNaN(home.clothes)) errors.clothes = 'Clothes should be numeric';
        if (isNaN(home.utilities)) errors.utilities = 'Utilities should be numeric';
        if (isNaN(home.furniture)) errors.furniture = 'Furniture should be numeric';
        if (isNaN(home.health)) errors.health = 'Health should be numeric';
        if (isNaN(home.transport)) errors.transport = 'Transport should be numeric';
        if (isNaN(home.communication)) errors.communication = 'Communication should be numeric';
        if (isNaN(home.entertainment)) errors.entertainment = 'Entertainment should be numeric';
        if (isNaN(home.education)) errors.education = 'Education should be numeric';
        if (isNaN(home.dining)) errors.dining = 'Dining should be numeric';
        if (isNaN(home.holidays)) errors.holidays = 'Holidays should be numeric';
        if (isNaN(home.miscellaneous)) errors.miscellaneous = 'Miscellaneous expenses should be numeric';
       
        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                home.user_id = currentUserId;

                if (period === 'yearly') {
                    const fieldsToUpdate = [
                        'groceries', 'clothes', 'utilities', 'furniture', 'health',
                        'transport', 'communication', 'entertainment', 'education',
                        'dining', 'holidays', 'miscellaneous'
                    ];

                    fieldsToUpdate.forEach(field => {
                        home[field] = parseFloat((home[field] / 12).toFixed(2));
                    });
                }

                const response = initialHome
                    ? await axios.put(`/api/expense_homes/${home.id}`, home)
                    : await axios.post('/api/expense_homes', home);
                
                let successMsg = '';
                if (action === 'Add') successMsg = 'Home added successfully';
                else if (action === 'Edit') successMsg = 'Home updated successfully';
                
                setErrorMessage('');
                onClose(); // Close the Expense Home Form window
                refreshHomeList(response.data, successMsg); // Pass the updated home and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add home');
                else if (action === 'Edit') setErrorMessage('Failed to update home');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculateTotalExpense = () => {

        const totalExpense = parseFloat(home.groceries)
            + parseFloat(home.clothes)
            + parseFloat(home.utilities)
            + parseFloat(home.furniture)
            + parseFloat(home.health)
            + parseFloat(home.transport)
            + parseFloat(home.communication)
            + parseFloat(home.entertainment)
            + parseFloat(home.education)
            + parseFloat(home.dining)
            + parseFloat(home.holidays)
            + parseFloat(home.miscellaneous);

        setHome({
            ...home,
            total_expense: totalExpense
        });

        return true;
    }

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
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 1 }}>
                    <HomeIcon style={{ color: 'purple', marginRight: '10px' }} />
                        Household Living Expenses
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Home Name"
                            name="home_name"
                            value={home.home_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.home_name}
                            helperText={errors.home_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                    <TextField
                            variant="standard"
                            label="Total Expense"
                            name="total_expense"
                            value={FormatCurrency(home.currency, home.total_expense)}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.total_expense}
                            helperText={errors.total_expense}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Home Location"
                            name="home_location"
                            value={home.location}
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
                            value={home.currency}
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
                            value={home.start_date}
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
                            value={home.end_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                            
                        />
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <ToggleButtonGroup
                                value={period}
                                exclusive
                                onChange={handlePeriodChange}
                                aria-label="period"
                                sx={{ '& .MuiToggleButton-root': { backgroundColor: 'primary.main', color: 'white', '&.Mui-selected': { backgroundColor: 'primary.dark' }, '&:hover': { color: 'black' } } }}
                            >
                                <ToggleButton value="monthly" aria-label="monthly" sx={{ borderRadius: '20px' }}>
                                    Monthly
                                </ToggleButton>
                                <ToggleButton value="yearly" aria-label="yearly" sx={{ borderRadius: '20px' }}>
                                    Yearly
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Groceries"
                            name="groceries"
                            value={home.groceries}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.groceries}
                            helperText={errors.groceries}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Clothes"
                            name="clothes"
                            value={home.clothes}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.clothes}
                            helperText={errors.clothes}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Utilities"
                            name="utilities"
                            value={home.utilities}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.utilities}
                            helperText={errors.utilities}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Furniture"
                            name="furniture"
                            value={home.furniture}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.furniture}
                            helperText={errors.furniture}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Health"
                            name="health"
                            value={home.health}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.health}
                            helperText={errors.health}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Transport"
                            name="transport"
                            value={home.transport}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.transport}
                            helperText={errors.transport}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Communication"
                            name="communication"
                            value={home.communication}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.communication}
                            helperText={errors.communication}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Entertainment"
                            name="entertainment"
                            value={home.entertainment}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.entertainment}
                            helperText={errors.entertainment}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Education"
                            name="education"
                            value={home.education}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.education}
                            helperText={errors.education}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Dining"
                            name="dining"
                            value={home.dining}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.dining}
                            helperText={errors.dining}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Holidays"
                            name="holidays"
                            value={home.holidays}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.holidays}
                            helperText={errors.holidays}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Miscellaneous"
                            name="miscellaneous"
                            value={home.miscellaneous}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.miscellaneous}
                            helperText={errors.miscellaneous}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
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

export default ExpenseHomeForm;