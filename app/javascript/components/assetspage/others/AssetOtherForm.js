import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // Savings other icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" other type
import TermIcon from '@mui/icons-material/AccessTime'; // New icon for "Term" other type
import { Slider, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';
import { CalculatePrincipal, CalculateInterest, CalculatePayoutValue } from '../../common/CalculateInterestAndPrincipal';

const AssetOtherForm = ({ other: initialOther, action, onClose, refreshOtherList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDateOfBirth = localStorage.getItem('currentUserDateOfBirth');

    const [other, setOther] = useState(initialOther || {
        user_id: 0,
        asset_name: '',
        institution_name: '',
        asset_location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        start_date: new Date().toISOString().split('T')[0],
        lumpsum_amount: 0.0,
        growth_rate: 0.0,
        is_recurring_payment: false,
        payment_frequency: '',
        payment_amount: 0.0,
        payment_end_date: '',
        payout_type: 'Lumpsum',
        payout_date: '',
        payout_age: 0,
        payout_duration: 1,
        payout_value: 0.0,
    });

    const [totalInterest, setTotalInterest] = useState(0.0);
    const [totalPrincipal, setTotalPrincipal] = useState(0.0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (other[name] !== newValue) {
            setOther({
                ...other,
                [name]: newValue
            });
        }
        // check if payout age is changed, then calculate payout date
        if (name === 'payout_age') {
            const userDateOfBirth = new Date(currentUserDateOfBirth);
            const userAgeAtStart = new Date(other.start_date).getFullYear() - userDateOfBirth.getFullYear();
            const userAgeDiffernce = parseInt(value) - userAgeAtStart;
            // payout date is start date + userAgeDiffernce
            const payoutDate = new Date(other.start_date);
            payoutDate.setFullYear(payoutDate.getFullYear() + parseInt(userAgeDiffernce));
            setOther((prevOther) => ({
                ...prevOther,
                payout_date: payoutDate.toISOString().split('T')[0]
            }));
        }
        // else if payout date is changed, then calculate payout age in years
        else if (name === 'payout_date') {
            const userDateOfBirth = new Date(currentUserDateOfBirth);
            const userAgeAtStart = new Date(other.start_date).getFullYear() - userDateOfBirth.getFullYear();
            const payoutAgeToAdd = new Date(value).getFullYear() - new Date(other.start_date).getFullYear();
            const payoutAge = userAgeAtStart + payoutAgeToAdd;
            setOther((prevOther) => ({
                ...prevOther,
                payout_age: parseInt(payoutAge)
            }));
        }

        // check if recurring payment checkbox is unchecked then default the values
        if (name === 'is_recurring_payment' && !checked) {
            setOther((prevOther) => ({
                ...prevOther,
                payment_frequency: '',
                payment_amount: 0.0,
                payment_end_date: ''
            }));
        }
    };

    useEffect(() => {
        calculateTotalInterest();
    }, [other]);

    useEffect(() => {
        if (initialOther) {
            setOther(initialOther);
        }
    }, [initialOther, action]);

    const validate = () => {
        const errors = {};

        if (!other.asset_name) errors.asset_name = 'Asset Name is required';
        if (!other.institution_name) errors.institution_name = 'Institution Name is required';
        if (!other.asset_location) errors.asset_location = 'Asset Location is required';
        if (!other.currency) errors.currency = 'Currency is required';
        if (!other.start_date) errors.start_date = 'Start Date is required';
        if (!other.lumpsum_amount) errors.lumpsum_amount = 'Lumpsum Amount is required';
        if (!other.payout_type) errors.payout_type = 'Payout Type is required';
        if (!other.payout_date && !other.payout_age) errors.payout_date = 'Payout Date or Age is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(other.growth_rate)) errors.interest_rate = 'Growth Rate should be numeric';
        if (isNaN(other.lumpsum_amount)) errors.other_balance = 'Other Amount should be numeric';
        if (isNaN(other.payment_amount)) errors.payment_amount = 'Payment amount should be numeric';
        if (isNaN(other.payout_value)) errors.payout_value = 'Payout Value should be numeric';
        if (isNaN(other.payout_age)) errors.payout_age = 'Payout Age should be numeric';
        if (isNaN(other.payout_duration)) errors.payout_duration = 'Payout Duration should be numeric';

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                other.user_id = currentUserId;
                const response = initialOther
                    ? await axios.put(`/api/asset_others/${other.id}`, other)
                    : await axios.post('/api/asset_others', other);

                let successMsg = '';
                if (action === 'Add') successMsg = 'Other added successfully';
                else if (action === 'Edit') successMsg = 'Other updated successfully';

                setErrorMessage('');
                onClose(); // Close the Asset Other Form window
                refreshOtherList(response.data, successMsg); // Pass the updated other and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add other');
                else if (action === 'Edit') setErrorMessage('Failed to update other');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculateTotalInterest = () => {

        if (!other.start_date || !other.growth_rate || !other.lumpsum_amount ) return;
        if (other.is_recurring_payment && (!other.payment_frequency || !other.payment_amount)) return;
        if (!other.payout_date && !other.payout_age) return;

        let payoutValue = 0.0;
        // months = payout_date - start_date in months
        let monthsForPayout = (new Date(other.payout_date).getFullYear() - new Date(other.start_date).getFullYear()) * 12 + new Date(other.payout_date).getMonth() - new Date(other.start_date).getMonth();
        let monthsForRecurringPayment = (new Date(other.payment_end_date).getFullYear() - new Date(other.start_date).getFullYear()) * 12 + new Date(other.payment_end_date).getMonth() - new Date(other.start_date).getMonth();

        const totalPrincipal = CalculatePrincipal (
            "Fixed",
            other.lumpsum_amount,
            monthsForRecurringPayment,
            other.payment_frequency,
            other.payment_amount
        );

        let totalInterest = 0.0;
        // calculate interest till payment end date
        totalInterest += CalculateInterest (
            "Fixed",
            "Simple",
            other.growth_rate,
            other.lumpsum_amount,
            monthsForRecurringPayment,
            other.payment_frequency,
            other.payment_amount,
            "Monthly" //does not matter as we are calculating simple interest
        );
        // add interest till payout date
        totalInterest += CalculateInterest (
            "Fixed",
            "Simple",
            other.growth_rate,
            totalPrincipal,
            parseInt(monthsForPayout) - parseInt(monthsForRecurringPayment),
            "",
            "0",
            "Monthly" //does not matter as we are calculating simple interest
        );

        if (other.payout_type === 'Lumpsum') {
            payoutValue = parseFloat(totalPrincipal) + parseFloat(totalInterest);    
        }
        else {
            payoutValue = CalculatePayoutValue(parseFloat(totalPrincipal) + parseFloat(totalInterest), parseInt(other.payout_duration) * 12, parseFloat(other.growth_rate));
        }

        setTotalInterest(totalInterest);
        setTotalPrincipal(totalPrincipal);
        setOther((prevOther) => ({
            ...prevOther,
            payout_value: parseInt(payoutValue)
        }));
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
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                    <SavingsIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {action === 'Add' && (
                        <>
                            Add Other Asset
                        </>
                    )}
                    {action === 'Edit' && (
                        <>
                            Update Other Asset Details
                        </>
                    )}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Asset Name"
                            name="asset_name"
                            value={other.asset_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.asset_name}
                            helperText={errors.asset_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={other.institution_name}
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
                            label="Asset Location"
                            name="asset_location"
                            value={other.asset_location}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.asset_location}
                            helperText={errors.asset_location}
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
                            label="Asset Start Date"
                            name="start_date"
                            value={other.start_date}
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
                            label="Lumpsum Amount"
                            name="lumpsum_amount"
                            value={other.lumpsum_amount}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.lumpsum_amount}
                            helperText={errors.lumpsum_amount}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Growth Rate (%)"
                            name="growth_rate"
                            value={other.growth_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.growth_rate}
                            helperText={errors.growth_rate}
                        />
                    </Grid>
                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={other.is_recurring_payment}
                                            onChange={handleChange}
                                            name="is_recurring_payment"
                                        />}
                                    label="Recurring Payments?"
                                />
                            </Grid>
                            {other.is_recurring_payment && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Payment End Date"
                                            name="payment_end_date"
                                            type="date"
                                            value={other.payment_end_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.payment_end_date}
                                            helperText={errors.payment_end_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            select
                                            variant="standard"
                                            label="Payment Frequency"
                                            name="payment_frequency"
                                            value={other.payment_frequency}
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
                                            label="Payment Amount"
                                            name="payment_amount"
                                            value={other.payment_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.payment_amount}
                                            helperText={errors.payment_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <Typography variant="h6" component="h2">
                                    Payout Details
                                </Typography>
                            </Grid>
                            <Grid item size={12}>
                                <FormControl component="fieldset" >
                                    <FormLabel component="legend">Select Payout Type:</FormLabel>
                                    <RadioGroup sx={{ pb: 2 }} row aria-label="payout_type" name="payout_type" value={other.payout_type} onChange={handleChange}>
                                        <FormControlLabel
                                            value="Lumpsum"
                                            control={<Radio />}
                                            label={
                                                <Grid container direction="column" alignItems="center" spacing={0}>
                                                    <Grid item><OtherIcon style={{ fontSize: 'normal' }} /></Grid>
                                                    <Grid item><Typography variant="caption">Fixed/Lumpsum</Typography></Grid>
                                                </Grid>
                                            }
                                        />
                                        <FormControlLabel
                                            value="Recurring"
                                            control={<Radio />}
                                            label={
                                                <Grid container direction="column" alignItems="center" spacing={0}>
                                                    <Grid item><TermIcon style={{ fontSize: 'normal' }} /></Grid>
                                                    <Grid item><Typography variant="caption">Recurring</Typography></Grid>
                                                </Grid>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item size={6}>
                                <TextField
                                    variant="standard"
                                    label="Payout Date"
                                    name="payout_date"
                                    type="date"
                                    value={other.payout_date}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.payout_date}
                                    helperText={errors.payout_date}
                                />
                            </Grid>
                            <Grid item size={6}>
                                <TextField
                                    variant="standard"
                                    label="Payout Age"
                                    name="payout_age"
                                    value={other.payout_age}
                                    onChange={handleChange}
                                    fullWidth
                                    slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*' } }}
                                    error={!!errors.payout_age}
                                    helperText={errors.payout_age}
                                />
                            </Grid>
                            <Grid item size={6}>
                                <Typography gutterBottom>Payout Duration</Typography>
                                <Slider
                                    name="payout_duration"
                                    value={other.payout_duration}
                                    onChange={handleChange}
                                    step={1}
                                    marks
                                    min={1}
                                    max={25}
                                    valueLabelDisplay="on"
                                />
                            </Grid>
                            <Grid item size={6}>
                                <TextField
                                    variant="standard"
                                    label="Payout Value"
                                    name="payout_value"
                                    value={other.payout_value}
                                    onChange={handleChange}
                                    fullWidth
                                    slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                    error={!!errors.payout_value}
                                    helperText={errors.payout_value}
                                />
                            </Grid>
                        </Grid>
                    </Box>    
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
                                        You will have invested a total amount of: <strong>{other.currency} {FormatCurrency(other.currency, parseFloat(totalPrincipal))} </strong>
                                        that is expected to generate an interest of: <strong style={{ color: 'blue' }}>{other.currency} {FormatCurrency(other.currency, totalInterest)}</strong>
                                    </Typography>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        You will have a total of: <strong style={{ color: 'brown' }}>{other.currency} {FormatCurrency(other.currency, (parseFloat(totalPrincipal) + parseFloat(totalInterest)))} </strong>
                                        at the end of the asset term
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
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

export default AssetOtherForm;