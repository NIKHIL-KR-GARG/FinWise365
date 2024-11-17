import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { InputAdornment, Alert, Snackbar, IconButton, TextField, Button, Typography, Box, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CondoIcon from '@mui/icons-material/Domain';
import HouseIcon from '@mui/icons-material/House';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import OtherIcon from '@mui/icons-material/Category';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const ExpensePropertyForm = ({ property: initialProperty, action, onClose, refreshPropertyList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [period, setPeriod] = useState('monthly');

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    
    const [property, setProperty] = useState(initialProperty || {
        user_id: 0,
        property_name: "",
        property_type: "",
        start_date: "",
        end_date: "",
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        expense_name_1: "",
        expense_value_1: 0.0,
        expense_name_2: "",
        expense_value_2: 0.0,
        expense_name_3: "",
        expense_value_3: 0.0,
        expense_name_4: "",
        expense_value_4: 0.0,
        expense_name_5: "",
        expense_value_5: 0.0,
        expense_name_6: "",
        expense_value_6: 0.0,
        expense_name_7: "",
        expense_value_7: 0.0,
        expense_name_8: "",
        expense_value_8: 0.0,
        total_expense: 0.0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (property[name] !== newValue) {
            setProperty({
                ...property,
                [name]: newValue
            });
        }
    };

    const handlePeriodChange = (event, newPeriod) => {
        if (newPeriod !== null) {
            const factor = newPeriod === 'yearly' ? 12 : 1 / 12;
            const updatedProperty = { ...property };

            const fieldsToUpdate = [
                'expense_value_1', 'expense_value_2', 'expense_value_3', 'expense_value_4',
                'expense_value_5', 'expense_value_6', 'expense_value_7', 'expense_value_8'
            ];

            fieldsToUpdate.forEach(field => {
                updatedProperty[field] = parseFloat((property[field] * factor).toFixed(2));
            });

            setProperty(updatedProperty);
            setPeriod(newPeriod);
        }
    };

    useEffect(() => {
        calculateTotalExpense();
    }, [property]);

    useEffect(() => {
        if (initialProperty) {
            setProperty(initialProperty);
        }
    }, [initialProperty]);

    const validate = () => {
        const errors = {};

        if (!property.property_name) errors.property_name = 'Property Name is required';
        if (!property.property_type) errors.property_type = 'Property Type is required';
        if (!property.location) errors.location = 'Location is required';
        if (!property.currency) errors.currency = 'Currency is required';
        if (!property.start_date) errors.start_date = 'Start Date is required';
        // if (!property.end_date) errors.end_date = 'End Date is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(property.expense_value_1)) errors.expense_value_1 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_2)) errors.expense_value_2 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_3)) errors.expense_value_3 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_4)) errors.expense_value_4 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_5)) errors.expense_value_5 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_6)) errors.expense_value_6 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_7)) errors.expense_value_7 = 'Expense Value should be numeric';
        if (isNaN(property.expense_value_8)) errors.expense_value_8 = 'Expense Value should be numeric';
        
        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                property.user_id = currentUserId;

                if (period === 'yearly') {
                    const fieldsToUpdate = [
                        'expense_value_1', 'expense_value_2', 'expense_value_3', 'expense_value_4',
                        'expense_value_5', 'expense_value_6', 'expense_value_7', 'expense_value_8'
                    ];

                    fieldsToUpdate.forEach(field => {
                        property[field] = parseFloat((property[field] / 12).toFixed(2));
                    });
                }

                const response = initialProperty
                    ? await axios.put(`/api/expense_properties/${property.id}`, property)
                    : await axios.post('/api/expense_properties', property);
                
                let successMsg = '';
                if (action === 'Add') successMsg = 'Property added successfully';
                else if (action === 'Edit') successMsg = 'Property updated successfully';
                
                setErrorMessage('');
                onClose(); // Close the Expense Property Form window
                refreshPropertyList(response.data, successMsg); // Pass the updated property and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add property');
                else if (action === 'Edit') setErrorMessage('Failed to update property');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculateTotalExpense = () => {

        const totalExpense = parseFloat(property.expense_value_1)
            + parseFloat(property.expense_value_2)
            + parseFloat(property.expense_value_3)
            + parseFloat(property.expense_value_4)
            + parseFloat(property.expense_value_5)
            + parseFloat(property.expense_value_6)
            + parseFloat(property.expense_value_7)
            + parseFloat(property.expense_value_8);

        setProperty({
            ...property,
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
                    <ApartmentIcon style={{ color: 'purple', marginRight: '10px' }} />
                        Property Expenses
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                    <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Property Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="property_type" name="property_type" value={property.property_type} onChange={handleChange}>
                        {currentUserCountryOfResidence === 'SG' && (
                            <FormControlLabel
                                value="HDB"
                                control={<Radio />}
                                label={
                                    <Grid container direction="column" alignItems="center" spacing={0}>
                                        <Grid item><ApartmentIcon style={{ fontSize: 'normal' }} /></Grid>
                                        <Grid item><Typography variant="caption">HDB</Typography></Grid>
                                    </Grid>
                                }
                            />
                        )}
                        <FormControlLabel
                            value="Condominium"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CondoIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Condominium</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Landed"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><HouseIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Landed</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Commercial"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><BusinessIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Commercial</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Land"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><TerrainIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Land</Typography></Grid>
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
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Property Name"
                            name="property_name"
                            value={property.property_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.property_name}
                            helperText={errors.property_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                    <TextField
                            variant="standard"
                            label="Total Expense"
                            name="total_expense"
                            value={FormatCurrency(property.currency, property.total_expense)}
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
                            label="Property Location"
                            name="property_location"
                            value={property.location}
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
                            value={property.currency}
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
                            value={property.start_date}
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
                            value={property.end_date}
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
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_1"
                            value={property.expense_name_1}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_1}
                            helperText={errors.expense_name_1}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_1"
                            value={property.expense_value_1}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_1}
                            helperText={errors.expense_value_1}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_2"
                            value={property.expense_name_2}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_2}
                            helperText={errors.expense_name_2}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_2"
                            value={property.expense_value_2}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_2}
                            helperText={errors.expense_value_2}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_3"
                            value={property.expense_name_3}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_3}
                            helperText={errors.expense_name_3}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_3"
                            value={property.expense_value_3}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_3}
                            helperText={errors.expense_value_3}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_4"
                            value={property.expense_name_4}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_4}
                            helperText={errors.expense_name_4}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_4"
                            value={property.expense_value_4}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_4}
                            helperText={errors.expense_value_4}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />  
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_5"
                            value={property.expense_name_5}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_5}
                            helperText={errors.expense_name_5}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_5"
                            value={property.expense_value_5}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_5}
                            helperText={errors.expense_value_5}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />  
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_6"
                            value={property.expense_name_6}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_6}
                            helperText={errors.expense_name_6}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_6"
                            value={property.expense_value_6}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_6}
                            helperText={errors.expense_value_6}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_7"
                            value={property.expense_name_7}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_7}
                            helperText={errors.expense_name_7}
                        />
                    </Grid>
                    <Grid item size={3}>
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_7"
                            value={property.expense_value_7}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_7}
                            helperText={errors.expense_value_7}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">{period === 'monthly' ? '/mth' : '/year'}</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            variant="standard"
                            label="Expense Name"
                            name="expense_name_8"
                            value={property.expense_name_8}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.expense_name_8}
                            helperText={errors.expense_name_8}
                        />
                    </Grid>
                    <Grid item size={3}>    
                    <TextField
                            variant="standard"
                            label="Expense Value"
                            name="expense_value_8"
                            value={property.expense_value_8}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.expense_value_8}
                            helperText={errors.expense_value_8}
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

export default ExpensePropertyForm;