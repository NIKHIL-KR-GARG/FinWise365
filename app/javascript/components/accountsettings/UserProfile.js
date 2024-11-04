import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Avatar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        phone_no: '',
        date_of_birth: '',
        country_of_residence: '',
        address: '',
        retirement_age: '',
        life_expectancy: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
                        address: appuser.address,
                        retirement_age: appuser.retirement_age,
                        life_expectancy: appuser.life_expectancy,
                        email: appuser.email
                    });
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
    };

    const validate = () => {
        let tempErrors = {};
        const phoneRegex = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d*)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?)+)(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
        const maxDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);

        if (user.retirement_age && (user.retirement_age < 20 || user.retirement_age > 120)) {
            tempErrors.retirement_age = 'Retirement age should be between 20 and 120';
        }

        if (user.life_expectancy && (user.life_expectancy < 20 || user.life_expectancy > 120)) {
            tempErrors.life_expectancy = 'Life expectancy should be between 20 and 120';
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
                await axios.put(`/api/users/${currentUserId}`, user);
                setSuccessMessage('User information updated successfully');
                setErrorMessage('');
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
            {successMessage && (
                <Alert 
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
            )}
            {errorMessage && (
                <Alert 
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
            )}
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
                            label="Email Address"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            fullWidth
                            disabled
                            required
                        />
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
                            label="Country of Residence"
                            name="country_of_residence"
                            value={user.country_of_residence}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
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