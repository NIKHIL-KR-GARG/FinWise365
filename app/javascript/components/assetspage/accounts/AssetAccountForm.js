import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // Savings account icon
import CurrentIcon from '@mui/icons-material/BusinessCenter'; // Current account icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" account type
import { Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';

const AssetAccountForm = ({ account: initialAccount, action, onClose, refreshAccountList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    
    const [account, setAccount] = useState(initialAccount || {
        user_id: 0,
        account_name: "",
        account_type: "Savings",
        institution_name: "",
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        opening_date: "",
        interest_rate: 0.0,
        account_balance: 0.0,
        minimum_balance: 0.0,
        is_plan_to_close: action === 'Close' ? true : false,
        closure_date: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (account[name] !== newValue) {
            setAccount({
                ...account,
                [name]: newValue
            });
        }
        // if the user is planning to close the account, set the closure date to the current date
        if (name === 'is_plan_to_close' && newValue) {
            setAccount({
                ...account,
                is_plan_to_close: true,
                closure_date: new Date().toISOString().split('T')[0]
            });
        }
    };

    useEffect(() => {
        if (initialAccount) {
            setAccount(initialAccount);
        }
        if (action === 'Close') {
            setAccount(prevAccount => ({
                ...prevAccount,
                is_plan_to_close: true
            }));
        }
    }, [initialAccount, action]);

    const validate = () => {
        const errors = {};

        if (!account.account_name) errors.account_name = 'Account Name is required';
        if (!account.account_type) errors.account_type = 'Account Type is required';
        if (!account.institution_name) errors.institution_name = 'Institution Name is required';
        if (!account.location) errors.location = 'Account Location is required';
        if (!account.currency) errors.currency = 'Currency is required';
        if (!account.opening_date) errors.opening_date = 'Opening Date is required';
        if (!account.interest_rate) errors.interest_rate = 'Interest Rate is required';
        if (!account.account_balance) errors.account_balance = 'Account Balance is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(account.interest_rate)) errors.interest_rate = 'Interest Rate should be numeric';
        if (isNaN(account.account_balance)) errors.account_balance = 'Account Balance should be numeric';
        if (isNaN(account.minimum_balance)) errors.minimum_balance = 'Minimum Balance should be numeric';
       
        if (account.is_plan_to_close ) {
            //check that closure date is not null
            if (!account.closure_date) errors.closure_date = 'A/C Closure Date is required';
            //check that closure date is not before opening date
           else if (account.closure_date < account.opening_date) errors.closure_date = 'Closure Date cannot be before Opening Date';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                account.user_id = currentUserId;
                const response = initialAccount
                    ? await axios.put(`/api/asset_accounts/${account.id}`, account)
                    : await axios.post('/api/asset_accounts', account);
                
                let successMsg = '';
                if (action === 'Add') successMsg = 'Account added successfully';
                else if (action === 'Edit') successMsg = 'Account updated successfully';
                else if (action === 'Close') successMsg = 'Account closure details updated successfully';
                
                setErrorMessage('');
                onClose(); // Close the Asset Account Form window
                refreshAccountList(response.data, successMsg); // Pass the updated account and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add account');
                else if (action === 'Edit') setErrorMessage('Failed to update account');
                else if (action === 'Close') setErrorMessage('Failed to update account closure details');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
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
            <form>
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                    <SavingsIcon style={{ color: 'purple', marginRight: '10px' }} />
                    { action === 'Add' && (
                        <>
                            Add Account
                        </>
                    )}
                    { action === 'Edit' && (
                        <>
                            Update Account Details
                        </>
                    )}
                    { action === 'Close' && (
                        <>
                            Update Account Closure Details
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Account Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="account_type" name="account_type" value={account.account_type} onChange={handleChange}>
                        <FormControlLabel
                            value="Savings"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><SavingsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Savings</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Current"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CurrentIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Current</Typography></Grid>
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
                            label="Account Name"
                            name="account_name"
                            value={account.account_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.account_name}
                            helperText={errors.account_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                    <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={account.institution_name}
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
                            label="Account Location"
                            name="location"
                            value={account.location}
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
                            value={account.currency}
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
                            label="Account Opening Date"
                            name="opening_date"
                            value={account.opening_date}
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
                            label="Interest Rate (%)"
                            name="interest_rate"
                            value={account.interest_rate}
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
                            label="Account Balance"
                            name="account_balance"
                            value={account.account_balance}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.account_balance}
                            helperText={errors.account_balance}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Minimum Balance"
                            name="minimum_balance"
                            value={account.minimum_balance}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.minimum_balance}
                            helperText={errors.minimum_balance}
                        />
                    </Grid>
                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6}>
                            { ((action === 'Edit') || (action === 'Add')) && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={account.is_plan_to_close}
                                            onChange={handleChange}
                                            name="is_plan_to_close"
                                        />}
                                    label="I plan to close this account"
                                />
                            )}
                            { (action === 'Close') && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={account.is_plan_to_close}
                                            onChange={handleChange}
                                            name="is_plan_to_close"
                                        />}
                                    label="Close this account"
                                />
                            )}
                            </Grid>
                            {account.is_plan_to_close && (
                                <Grid item size={6}>
                                    <TextField
                                        variant="standard"
                                        label="Closure Date"
                                        name="closure_date"
                                        type="date"
                                        value={account.closure_date}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.closure_date}
                                        helperText={errors.closure_date}
                                    />
                                </Grid>
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

export default AssetAccountForm;