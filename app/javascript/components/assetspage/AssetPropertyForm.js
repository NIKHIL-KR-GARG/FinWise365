import React, { useState } from 'react';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import ApartmentIcon from '@mui/icons-material/Apartment'; // HDB icon
import CondoIcon from '@mui/icons-material/Domain'; // Condo icon
import HouseIcon from '@mui/icons-material/House'; // Landed icon
import { Modal, Switch, Slider ,Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon

import CurrencyList from '../common/CurrencyList';
import CountryList from '../common/CountryList';
import { HomeLoanRate, HomeValueGrowthRate} from '../common/DefaultValues';
import HomeLoanEMICalculator from './HomeLoanEMICalculator';

const AssetPropertyForm = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserNationality = localStorage.getItem('currentUserNationality');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const [property, setProperty] = useState({
        user_id: 0,
        property_name: "",
        property_type: "HDB",
        property_location: currentUserNationality || "",
        property_number: 0,
        purchase_date: "",
        currency: currentUserBaseCurrency || "",
        purchase_price: 0.0,
        tentative_current_value: 0.0,
        is_primary_property: false,
        is_under_loan: false,
        loan_amount: 0.0,
        loan_remaining_duration: 0,
        loan_type: "",
        loan_interest_rate: HomeLoanRate.find(rate => rate.key === currentUserNationality)?.value || 0,
        is_loan_locked: false,
        loan_locked_till: "",
        is_on_rent: false,
        rental_amount: 0.0,
        property_value_growth_rate: HomeValueGrowthRate.find(rate => rate.key === currentUserNationality)?.value || 0,
        is_plan_to_sell: false,
        tentative_sale_date: "",
        tentative_sale_amount: 0.0,
        annual_property_tax_amount: 0.0,
        annual_property_maintenance_amount: 0.0
    });

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProperty({
            ...property,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validate = () => {
        
        const errors = {};
        
        if (!property.property_name) errors.property_name = 'Property Name is required';
        if (!property.property_location) errors.property_location = 'Property Location is required';
        if (!property.currency) errors.currency = 'Currency is required';
        if (!property.purchase_date) errors.purchase_date = 'Purchase Date is required';
        if (!property.purchase_price) errors.purchase_price = 'Purchase Price is required';
        
        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(property.purchase_price)) errors.purchase_price = 'Purchase Price should be numeric';
        if (isNaN(property.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(property.loan_interest_rate)) errors.loan_interest_rate = 'Loan Interest Rate should be numeric';
        if (isNaN(property.loan_remaining_duration)) errors.loan_remaining_duration = 'Loan Duration should be numeric';
        if (isNaN(property.rental_amount)) errors.rental_amount = 'Rental Amount should be numeric';
        if (isNaN(property.property_value_growth_rate)) errors.property_value_growth_rate = 'Property Value Growth Rate should be numeric';
        if (isNaN(property.tentative_sale_amount)) errors.tentative_sale_amount = 'Tentative Sale Amount should be numeric';
        if (isNaN(property.annual_property_tax_amount)) errors.annual_property_tax_amount = 'Annual Property Tax Amount should be numeric';
        if (isNaN(property.annual_property_maintenance_amount)) errors.annual_property_maintenance_amount = 'Annual Property Maintenance Amount should be numeric';
       
        setErrors(errors);
        
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                property.user_id = currentUserId;
                const response = await axios.post('/api/asset_properties', property);
                //console.log('Property saved:', response.data);
                setSuccessMessage('property added successfully');
                setErrorMessage('');
                //window.close();
            } catch (error) {
                setErrorMessage('Failed to add property');
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
                <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2}}>
                    <HomeIcon style={{ color: 'green', marginRight: '10px' }} />
                    Purchase Property
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Property Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="property_type" name="property_type" value={property.property_type} onChange={handleChange}>
                        {currentUserNationality === 'SG' && (
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
                    </RadioGroup>
                </FormControl>
                <Grid container spacing={2}>
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
                        <Typography gutterBottom>Property Number</Typography>
                        <Slider
                            name="property_number"
                            value={property.property_number}
                            onChange={handleChange}
                            step={1}
                            marks
                            min={1}
                            max={10}
                            valueLabelDisplay="on"
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Property Location"
                            name="property_location"
                            value={property.property_location}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.property_location}
                            helperText={errors.property_location}
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
                            label="Purchase Date"
                            name="purchase_date"
                            value={property.purchase_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }} 
                            error={!!errors.purchase_date}
                            helperText={errors.purchase_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Purchase Price"
                            name="purchase_price"
                            value={property.purchase_price}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.purchase_price}
                            helperText={errors.purchase_price}
                        />
                    </Grid>
                    {/*<Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Tentative Current Value"
                            name="tentative_current_value"
                            value={property.tentative_current_value}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>*/}
                
                {/*<FormControlLabel
                    control={
                        <Checkbox
                            checked={property.is_primary_property}
                            onChange={handleChange}
                            name="is_primary_property"
                        />}
                    label="Is this the Primary Property"
                />*/}

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6} sx={{ display: 'flex' }}>
                                <Typography>Cash</Typography>
                                <Switch
                                    checked={property.is_under_loan}
                                    onChange={handleChange}
                                    name="is_under_loan"
                                    color="primary"
                                />
                                <Typography>Loan</Typography>
                            </Grid>
                            <Grid item size={6} >
                                <Typography
                                    variant="body2"
                                    onClick={() => handleModalOpen(true)}
                                    sx={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold', color: 'blue' }}
                                >
                                    Open EMI Calculator
                                </Typography>
                                <Modal
                                    open={modalOpen}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            handleModalClose();
                                        }
                                    }}
                                    aria-labelledby="modal-title"
                                    aria-describedby="modal-description"
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Box sx={{ width: 1000, height: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative' }}>
                                        <HomeLoanEMICalculator property={property} />
                                        <IconButton 
                                            onClick={handleModalClose} 
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 24, 
                                                border: '1px solid', // Added border
                                                borderColor: 'grey.500' // Optional: specify border color
                                            }}
                                        >
                                            <CloseIconFilled />
                                        </IconButton>
                                    </Box>
                                </Modal>
                            </Grid>
                            {property.is_under_loan && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            select
                                            variant="standard"
                                            label="Loan Type"
                                            name="loan_type"
                                            value={property.loan_type}
                                            onChange={handleChange}
                                            fullWidth
                                        >
                                            <MenuItem value="Fixed">Fixed</MenuItem>
                                            <MenuItem value="Floating">Floating</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Amount"
                                            name="loan_amount"
                                            value={property.loan_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.loan_amount}
                                            helperText={errors.loan_amount}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Interest Rate"
                                            name="loan_interest_rate"
                                            value={property.loan_interest_rate}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.loan_interest_rate}
                                            helperText={errors.loan_interest_rate}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Duration (Months)"
                                            name="loan_remaining_duration"
                                            value={property.loan_remaining_duration}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.loan_remaining_duration}
                                            helperText={errors.loan_remaining_duration}
                                        />
                                    </Grid>
                                    {property.loan_type === 'Fixed' && (
                                        <>
                                            <Grid item size={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={property.is_loan_locked}
                                                            onChange={handleChange}
                                                            name="is_loan_locked"
                                                        />}
                                                    label="Loan interest rate Locked?"
                                                />
                                            </Grid>
                                            <Grid item size={6}>
                                                <TextField
                                                    variant="standard"
                                                    label="interest rate Locked Till?"
                                                    name="loan_locked_till"
                                                    type="date"
                                                    value={property.loan_locked_till}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }} 
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={property.is_on_rent}
                                            onChange={handleChange}
                                            name="is_on_rent"
                                        />}
                                    label="I will put this property on Rent"
                                />
                            </Grid>
                            {property.is_on_rent && (
                                <Grid item size={6}>
                                    <TextField
                                        variant="standard"
                                        label="Rental Amount (Monthly)"
                                        name="rental_amount"
                                        value={property.rental_amount}
                                        onChange={handleChange}
                                        fullWidth
                                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                        error={!!errors.rental_amount}
                                        helperText={errors.rental_amount}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={property.is_plan_to_sell}
                                            onChange={handleChange}
                                            name="is_plan_to_sell"
                                        />}
                                    label="I plan to sell this property in the future"
                                />
                            </Grid>
                            {property.is_plan_to_sell && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Tentative Sale Date"
                                            name="tentative_sale_date"
                                            type="date"
                                            value={property.tentative_sale_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }} 
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Tentative Sale Amount"
                                            name="tentative_sale_amount"
                                            value={property.tentative_sale_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.tentative_sale_amount}
                                            helperText={errors.tentative_sale_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Grid item size={12}>
                        <TextField
                            variant="standard"
                            label="Property Value Growth Rate"
                            name="property_value_growth_rate"
                            value={property.property_value_growth_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.property_value_growth_rate}
                            helperText={errors.property_value_growth_rate}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Annual Property Tax Amount"
                            name="annual_property_tax_amount"
                            value={property.annual_property_tax_amount}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.annual_property_tax_amount}
                            helperText={errors.annual_property_tax_amount}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Annual Property Maintenance Amount"
                            name="annual_property_maintenance_amount"
                            value={property.annual_property_maintenance_amount}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.annual_property_maintenance_amount}
                            helperText={errors.annual_property_maintenance_amount}
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

export default AssetPropertyForm;