import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, Alert, IconButton, Snackbar, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserProfile = ({ user: initialUser, action, onClose, refreshUserList }) => {
    const [user, setUser] = useState(initialUser || {
        first_name: '',
        last_name: '',
        email: '',
        phone_no: '',
        date_of_birth: '',
        country_of_residence: '',
        is_permanent_resident: false,
        address: '',
        retirement_age: '',
        life_expectancy: '',
        base_currency: '',
        gender: 'Prefer not to say',
        nationality: '',
        is_admin: false,
        is_financial_advisor: false,
        financial_advisor_licence_no: '',
        financial_advisor_id: '',
        is_active: true
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormChanged, setIsFormChanged] = useState(false);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';
    const currentUserIsFinancialAdvisor = localStorage.getItem('currentUserIsFinancialAdvisor') === 'true';
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
        setIsFormChanged(true); // Set form change state to true on any change
    };

    const validate = () => {
        let tempErrors = {};
        const phoneRegex = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d*)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?)+)(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const maxDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);

        if (!user.first_name) tempErrors.first_name = 'First name is required';
        if (!user.last_name) tempErrors.last_name = 'Last name is required';
        if (!user.email) tempErrors.email = 'Email is required';
        if (!user.date_of_birth) tempErrors.date_of_birth = 'Date of birth is required';
        if (!user.country_of_residence) tempErrors.country_of_residence = 'Country of residence is required';
        if (!user.base_currency) tempErrors.base_currency = 'Base currency is required';
        if (!user.nationality) tempErrors.nationality = 'Nationality is required';
        if (!user.retirement_age) tempErrors.retirement_age = 'Retirement age is required';
        if (!user.life_expectancy) tempErrors.life_expectancy = 'Life expectancy is required';

        if (isNaN(user.retirement_age)) tempErrors.retirement_age = 'Retirement age should be numeric';
        else {
            if (user.retirement_age && (user.retirement_age < 20 || user.retirement_age > 120)) {
                tempErrors.retirement_age = 'Retirement age should be between 20 and 120';
            }
        }

        if (isNaN(user.life_expectancy)) tempErrors.life_expectancy = 'Life expectancy should be numeric';
        else {
            if (user.life_expectancy && (user.life_expectancy < 20 || user.life_expectancy > 120)) {
                tempErrors.life_expectancy = 'Life expectancy should be between 20 and 120';
            }
        }

        if (user.phone_no && !phoneRegex.test(user.phone_no)) {
            tempErrors.phone_no = 'Phone number should be a valid 10-digit number';
        }

        if (!emailRegex.test(user.email)) {
            tempErrors.email = 'Email should be a valid email address';
        }

        const date_of_birth = new Date(user.date_of_birth);
        if (date_of_birth < minDate || date_of_birth > maxDate) {
            tempErrors.date_of_birth = 'Date of birth should be no more than 120 years ago from today';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                const userID = parseInt(initialUser ? initialUser.id : (action === 'Add' ? 0 : currentUserId));
                const email = user.email.toLowerCase();

                // Check if email is unique for a new user or excluding the current user
                const emailCheckResponse = await axios.get(`/api/users/check-email?email=${email}&user_id=${userID}`);
                if (!emailCheckResponse.data.isUnique) {
                    setErrorMessage('Email already exists');
                    setSuccessMessage('');
                    return;
                }

                // set nikhil's user id as admin
                if (user.email === 'nikhil.kr.garg@gmail.com') {
                    user.is_admin = true;
                }

                if (currentUserIsFinancialAdvisor && currentUserId !== userID) {
                    user.financial_advisor_id = currentUserId;
                }

                const response = initialUser ? await axios.put(`/api/users/${userID}`, user) : await axios.post('/api/users', user);

                let successMsg = '';
                if (action === 'Add') successMsg = 'User added successfully';
                else if (action === 'Edit') successMsg = 'User information updated successfully';

                if (parseInt(currentUserId) === parseInt(userID)) {
                    //update few user settings in local storage
                    localStorage.setItem('currentUserFirstName', user.first_name);
                    localStorage.setItem('currentUserLastName', user.last_name);
                    localStorage.setItem('currentUserDateOfBirth', user.date_of_birth);
                    localStorage.setItem('currentUserEmail', user.email);
                    localStorage.setItem('currentUserBaseCurrency', user.base_currency);
                    localStorage.setItem('currentUserLifeExpectancy', user.life_expectancy);
                    localStorage.setItem('currentUserNationality', user.nationality);
                    localStorage.setItem('currentUserCountryOfResidence', user.country_of_residence);
                    localStorage.setItem('currentUserIsPermanentResident', user.is_permanent_resident);
                    localStorage.setItem('currentUserRetirementAge', user.retirement_age);
                }

                // Trigger storage event
                window.dispatchEvent(new Event('storage'));

                setSuccessMessage(successMsg);
                setErrorMessage('');
                if (onClose) onClose(); // Check if onClose is passed before calling it
                if (refreshUserList) refreshUserList(response.data, successMsg); // Pass the updated user and success message

            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add user');
                else if (action === 'Edit') setErrorMessage('Failed to update user information');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ pt: 0, maxWidth: '600px', mx: 'auto', p: 2 }}> {/* Center the container and set max width */}
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
            {(currentUserEmail === user.email) && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar src='/path/to/avatar.jpg' alt={user.first_name} sx={{ mr: 2 }} />
                    <Typography variant="body1">{user.email}</Typography>
                </Box>
            )}
            {(currentUserEmail !== user.email) && (
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                    <AccountCircleIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {(action === 'Add') && (
                        <>
                            Add User
                        </>
                    )}
                    {(action === 'Edit') && (
                        <>
                            Update User Details
                        </>
                    )}
                </Typography>
            )}
            <form>
                <Grid container spacing={2}>
                    {(currentUserEmail !== user.email) && (
                        <Grid item size={12}>
                            <TextField
                                label="Email Id"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                    )}
                    <Grid item size={6}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={user.last_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={user.date_of_birth}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            error={!!errors.date_of_birth}
                            helperText={errors.date_of_birth}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            label="Gender"
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            fullWidth
                                                    >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            label="Phone No"
                            name="phone_no"
                            value={user.phone_no}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.phone_no}
                            helperText={errors.phone_no}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            label="Base Currency"
                            name="base_currency"
                            value={user.base_currency}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.base_currency}
                            helperText={errors.base_currency}
                        >
                            {CurrencyList.map((currency) => (
                                <MenuItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={12}>
                        <TextField
                            label="Address"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            label="Country of Residence"
                            name="country_of_residence"
                            value={user.country_of_residence}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.country_of_residence}
                            helperText={errors.country_of_residence}
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
                            label="Nationality"
                            name="nationality"
                            value={user.nationality}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.nationality}
                            helperText={errors.nationality}
                        >
                            {CountryList.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {(user.country_of_residence != user.nationality) && (
                        <Grid item size={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={user.is_permanent_resident}
                                        onChange={(e) => handleChange({ target: { name: 'is_permanent_resident', value: e.target.checked } })}
                                        name="is_permanent_resident"
                                        color="primary"
                                    />
                                }
                                label="Are you a Permanent Resident?"
                            />
                        </Grid>
                    )}
                    <Grid item size={6}>
                        <TextField
                            label="Retirement Age"
                            name="retirement_age"
                            value={user.retirement_age}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={!!errors.retirement_age}
                            helperText={errors.retirement_age}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            label="Life Expectancy"
                            name="life_expectancy"
                            value={user.life_expectancy}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.life_expectancy}
                            helperText={errors.life_expectancy}
                        />
                    </Grid>
                    {(currentUserIsAdmin || currentUserIsFinancialAdvisor) && (
                        <Grid item size={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={user.is_active}
                                        onChange={(e) => handleChange({ target: { name: 'is_active', value: e.target.checked } })}
                                        name="is_active"
                                        color="primary"
                                    />
                                }
                                label="is An active User?"
                            />
                        </Grid>
                    )}
                    {currentUserIsAdmin && (
                        <>
                            <Grid item size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={user.is_admin}
                                            onChange={(e) => handleChange({ target: { name: 'is_admin', value: e.target.checked } })}
                                            name="is_admin"
                                            color="primary"
                                        />
                                    }
                                    label="Is Admin?"
                                />
                            </Grid>
                            <Grid item size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={user.is_financial_advisor}
                                            onChange={(e) => handleChange({ target: { name: 'is_financial_advisor', value: e.target.checked } })}
                                            name="is_financial_advisor"
                                            color="primary"
                                        />
                                    }
                                    label="Is Financial Advisor?"
                                />
                            </Grid>
                            <Grid item size={6}>
                                <TextField
                                    label="Financial Advisor Licence No."
                                    name="financial_advisor_licence_no"
                                    value={user.financial_advisor_licence_no}
                                    onChange={handleChange}
                                    fullWidth
                                // required
                                // error={!!errors.financial_advisor_licence_no}
                                // helperText={errors.financial_advisor_licence_no}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={!isFormChanged} // Disable button if form is not changed
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
};

export default UserProfile;