import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Avatar, Alert, IconButton, Snackbar, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';

const UserProfile = () => {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        phone_no: '',
        date_of_birth: '',
        country_of_residence: '',
        is_permanent_resident: false,
        address: '',
        retirement_age: '',
        life_expectancy: '',
        email: '',
        base_currency: '',
        gender: 'Prefer not to say',
        nationality: '',
        is_admin: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormChanged, setIsFormChanged] = useState(false);
    const currentUserId = localStorage.getItem('currentUserId');
    const hasFetchedData = useRef(false);

    useEffect(() => {
        // Fetch user information from the database
        const fetchUser = async () => {
            if (hasFetchedData.current) return;
            hasFetchedData.current = true;

            try {
                const response = await axios.get(`/api/users`);
                const users = response.data;
                const appuser = users.find((e) => e.id === parseInt(currentUserId));
                if (appuser) {
                    setUser({
                        first_name: appuser.first_name,
                        last_name: appuser.last_name,
                        phone_no: appuser.phone_no,
                        date_of_birth: appuser.date_of_birth,
                        country_of_residence: appuser.country_of_residence,
                        is_permanent_resident: appuser.is_permanent_resident,
                        address: appuser.address,
                        retirement_age: appuser.retirement_age,
                        life_expectancy: appuser.life_expectancy,
                        email: appuser.email,
                        base_currency: appuser.base_currency,
                        gender: appuser.gender,
                        nationality: appuser.nationality,
                        is_admin: appuser.is_admin
                    });
                    setIsFormChanged(false); // Reset form change state after fetching user data

                    //save few user settings in local storage
                    localStorage.setItem('currentUserFirstName', appuser.first_name);
                    localStorage.setItem('currentUserLastName', appuser.last_name);
                    localStorage.setItem('currentUserDateOfBirth', appuser.date_of_birth);
                    localStorage.setItem('currentUserEmail', appuser.email);
                    localStorage.setItem('currentUserBaseCurrency', appuser.base_currency);
                    localStorage.setItem('currentUserLifeExpectancy', appuser.life_expectancy);
                    localStorage.setItem('currentUserNationality', appuser.nationality);
                    localStorage.setItem('currentUserCountryOfResidence', appuser.country_of_residence);
                    localStorage.setItem('currentUserIsPermanentResident', appuser.is_permanent_resident);
                    localStorage.setItem('currentUserIsAdmin', appuser.is_admin);
                    localStorage.setItem('currentUserDisplayDummyData', appuser ? appuser.is_display_dummy_data : true);
                    localStorage.setItem('currentUserRetirementAge', appuser.retirement_age);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [currentUserId]);

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
        const maxDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);

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

        if (!phoneRegex.test(user.phone_no)) {
            tempErrors.phone_no = 'Phone number should be a valid 10-digit number';
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

                // set nikhil's user id as admin
                if (user.email === 'nikhil.kr.garg@gmail.com') {
                    user.is_admin = true;
                }

                await axios.put(`/api/users/${currentUserId}`, user);
                setSuccessMessage('User information updated successfully');
                setErrorMessage('');
                setIsFormChanged(false);

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
                localStorage.setItem('currentUserIsAdmin', user.is_admin);
                localStorage.setItem('currentUserRetirementAge', user.retirement_age);

                // Trigger storage event
                window.dispatchEvent(new Event('storage'));

            } catch (error) {
                console.error('Error updating user data:', error);
                setErrorMessage('Failed to update user information');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ pt: 0, maxWidth: '600px', mx: 'auto', mt: -2 }}> {/* Center the container and set max width */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar src='/path/to/avatar.jpg' alt={user.first_name} sx={{ mr: 2 }} />
                <Typography variant="body1">{user.email}</Typography>
            </Box>
            <form>
                <Grid container spacing={2}>
                    <Grid item size={6}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleChange}
                            fullWidth
                            required
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
                            InputLabelProps={{
                                shrink: true,
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
                            required
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
                            required
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
                                label="Are you a Permanent Resident"
                            />
                        </Grid>
                    )}
                    <Grid item size={6}>
                        <TextField
                            label="Retirement Age"
                            name="retirement_age"
                            value={user.retirement_age}
                            onChange={handleChange}
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
                </Grid>
                <Box sx={{ mt: 2 }}>
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
            </form>
        </Box>
    );
};

export default UserProfile;