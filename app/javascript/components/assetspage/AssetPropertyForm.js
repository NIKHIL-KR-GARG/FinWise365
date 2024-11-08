import React, { useState } from 'react';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import ApartmentIcon from '@mui/icons-material/Apartment'; // HDB icon
import CondoIcon from '@mui/icons-material/Domain'; // Condo icon
import HouseIcon from '@mui/icons-material/House'; // Landed icon
import { Modal, Switch, Slider, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CurrencyList from '../common/CurrencyList';
import CountryList from '../common/CountryList';
import { HomeLoanRate, HomeValueGrowthRate } from '../common/DefaultValues';
import HomeLoanEMICalculator from './HomeLoanEMICalculator';

const AssetPropertyForm = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserNationality = localStorage.getItem('currentUserNationality');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsPermanentResident = localStorage.getItem('currentUserIsPermanentResident');

    const [property, setProperty] = useState({
        user_id: 0,
        property_name: "",
        property_type: "HDB",
        property_location: currentUserCountryOfResidence || "",
        property_number: 1,
        purchase_date: "",
        currency: currentUserBaseCurrency || "",
        purchase_price: 0.0,
        tentative_current_value: 0.0,
        is_primary_property: false,
        is_under_loan: false,
        loan_amount: 0.0,
        loan_remaining_duration: 0,
        loan_type: "",
        loan_interest_rate: HomeLoanRate.find(rate => rate.key === currentUserCountryOfResidence)?.value || 0,
        is_loan_locked: false,
        loan_locked_till: "",
        is_on_rent: false,
        rental_amount: 0.0,
        property_value_growth_rate: HomeValueGrowthRate.find(rate => rate.key === currentUserCountryOfResidence)?.value || 0,
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

    const pmt = (rate, nper, pv) => {
        if (rate === 0) return -(pv / nper);
        const pvif = Math.pow(1 + rate, nper);
        return Math.abs(-(rate * pv * pvif) / (pvif - 1));
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    var BuyerStampDuty = 0;
    var AdditionalBuyerStampDuty = 0;

    var LTVPercentage = 0;
    var LTVValue = 0;
    var DownPayment = 0;

    var emi = 0;
    var InterestPayments = 0;
    var OtherFees = 0;

    var TotalCost = 0;
    const calculatePropertyValue = () => {

        //check that property purchase price is greater than 0 and is a number
        if (isNaN(property.purchase_price) || property.purchase_price <= 0) return false;
        else {
            // check if property location is SG
            if (property.property_location === 'SG') {

                //calculate Stamp Duty
                if (property.purchase_price <= 180000) {  // 1st tier
                    BuyerStampDuty = 0;
                } else if (property.purchase_price > 180000 && property.purchase_price <= 360000) { // 2nd tier 
                    BuyerStampDuty = (property.purchase_price - 180000) * 0.02;
                } else if (property.purchase_price > 360000 && property.purchase_price <= 640000) { // 3rd tier 
                    BuyerStampDuty = (360000 - 180000) * 0.02 + (property.purchase_price - 360000) * 0.03;
                } else if (property.purchase_price > 640000 && property.purchase_price <= 1000000) { // 4th tier    
                    BuyerStampDuty = (360000 - 180000) * 0.02 + (640000 - 360000) * 0.03 + (property.purchase_price - 640000) * 0.04;
                } else if (property.purchase_price > 1000000 && property.purchase_price <= 3000000) { // 5th tier   
                    BuyerStampDuty = (360000 - 180000) * 0.02 + (640000 - 360000) * 0.03 + (1000000 - 640000) * 0.04 + (property.purchase_price - 1000000) * 0.06;
                } else if (property.purchase_price > 3000000) { // 6th tier 
                    BuyerStampDuty = (360000 - 180000) * 0.02 + (640000 - 360000) * 0.03 + (1000000 - 640000) * 0.04 + (3000000 - 1000000) * 0.06 + (property.purchase_price - 3000000) * 0.12;
                }

                // calculate Additional Buyer Stamp Duty
                if (currentUserNationality === 'SG') {
                    if (property.property_number === 1) AdditionalBuyerStampDuty = 0;
                    else if (property.property_number === 2) AdditionalBuyerStampDuty = property.purchase_price * 0.20;
                    else if (property.property_number > 2) AdditionalBuyerStampDuty = property.purchase_price * 0.30;
                }
                else if (currentUserIsPermanentResident) {
                    if (property.property_number === 1) AdditionalBuyerStampDuty = property.purchase_price * 0.05;
                    else if (property.property_number === 2) AdditionalBuyerStampDuty = property.purchase_price * 0.30;
                    else if (property.property_number > 2) AdditionalBuyerStampDuty = property.purchase_price * 0.35;
                }
                else AdditionalBuyerStampDuty = property.purchase_price * 0.60;

                // if there is a Loan
                if (property.is_under_loan) {

                    //calculate LTV Percentage
                    if (property.property_number === 1) LTVPercentage = 75;
                    else if (property.property_number === 2) LTVPercentage = 45;
                    else if (property.property_number > 2) LTVPercentage = 35;

                    LTVValue = LTVPercentage * property.purchase_price / 100;
                    //check if we want to use the loan amount or the LTV value
                    if (property.loan_amount > 0 && property.loan_amount < LTVValue) LTVValue = property.loan_amount;
                    DownPayment = property.purchase_price - LTVValue;

                    // Calculate Interest Payments
                    //loop through the loan duration and calculate the interest payments using the pmt function
                    var outstandingBalance = LTVValue;
                    emi = pmt(property.loan_interest_rate / 100 / 12, property.loan_remaining_duration, LTVValue);
                    for (let month = 1; month <= property.loan_remaining_duration; month++) {
                        const openingBalance = outstandingBalance;
                        const interest = outstandingBalance * property.loan_interest_rate / 100 / 12;
                        var principal = 0;
                        if (emi <= openingBalance) principal = emi - interest;
                        else principal = openingBalance;
                        outstandingBalance -= principal;
                        InterestPayments += interest;
                    }
                }

                // calculate Other Fees
                const LegalFees = 2500; // Example fixed fee
                const ValuationFees = 500; // Example fixed fee
                const HomeInsurance = 500; // Example fixed fee
                var AgentFees = 0;
                if (property.property_type === 'HDB') AgentFees = 0.01 * property.purchase_price; // 1% of purchase price
                else AgentFees = 0.02 * property.purchase_price; // 2% of purchase price

                OtherFees = LegalFees + ValuationFees + HomeInsurance + AgentFees;

                TotalCost = parseFloat(property.purchase_price) + parseFloat(BuyerStampDuty) + parseFloat(AdditionalBuyerStampDuty) + parseFloat(OtherFees) + parseFloat(InterestPayments);
            }
        }
        return true;
    }

    const getPropertyIcon = (propertyType) => {
        switch (propertyType) {
            case 'HDB':
                return <ApartmentIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Condominium':
                return <CondoIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Landed':
                return <HouseIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Commercial':
                return <BusinessIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Land':
                return <TerrainIcon style={{ color: 'white', marginRight: '10px' }} />;
            default:
                return <HomeIcon style={{ color: 'white', marginRight: '10px' }} />;
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
                    <HomeIcon style={{ color: 'green', marginRight: '10px' }} />
                    Purchase Property
                </Typography>
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
                                    sx={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: 'blue' }}
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
                                            label="Loan Interest Rate (%)"
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
                        {calculatePropertyValue() && (
                            <Accordion sx={{ pt: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                    {getPropertyIcon(property.property_type)}
                                    <Typography >Overall Cost</Typography>
                                    {
                                        property.is_under_loan && (
                                            <>
                                                <Typography sx={{ ml: 'auto', color: 'white' }}>
                                                    Loan EMI: {property.currency} {formatCurrency(parseFloat(emi))} / month
                                                </Typography>
                                            </>
                                        )}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container>
                                        <Grid item size={6}>
                                            <Typography sx={{ fontSize: 'small' }}>Property Value:</Typography>
                                        </Grid>
                                        <Grid item size={6} sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(property.purchase_price))}</Typography>
                                        </Grid>
                                        {property.is_under_loan && (
                                            <>
                                                <Grid item size={6}>
                                                    <Typography sx={{ fontSize: 'small' }}>Loan-To-Value (LTV) %:</Typography>
                                                </Grid>
                                                <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontSize: 'small' }}>{LTVPercentage}%</Typography>
                                                </Grid>
                                                <Grid item size={6}>
                                                    <Typography sx={{ fontSize: 'small' }}>Loan Amount:</Typography>
                                                </Grid>
                                                <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(LTVValue))}</Typography>
                                                </Grid>
                                                <Grid item size={6}>
                                                    <Typography sx={{ fontSize: 'small' }}>Down Payment:</Typography>
                                                </Grid>
                                                <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(DownPayment))}</Typography>
                                                </Grid>
                                                <Grid item size={6}>
                                                    <Typography sx={{ fontSize: 'small' }}>Interest Payments:</Typography>
                                                </Grid>
                                                <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(InterestPayments))}</Typography>
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item size={6}>
                                            <Typography sx={{ fontSize: 'small' }}>Stamp Duty:</Typography>
                                        </Grid>
                                        <Grid item size={6} sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(BuyerStampDuty))}</Typography>
                                        </Grid>
                                        <Grid item size={6}>
                                            <Typography sx={{ fontSize: 'small' }}>Additional Buyer Stamp Duty:</Typography>
                                        </Grid>
                                        <Grid item size={6} sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(AdditionalBuyerStampDuty))}</Typography>
                                        </Grid>
                                        <Grid item size={6}>
                                            <Typography sx={{ fontSize: 'small' }}>Other Fees:</Typography>
                                        </Grid>
                                        <Grid item size={6} sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(OtherFees))}</Typography>
                                        </Grid>
                                        <Grid item size={6}>
                                            <Typography sx={{ fontSize: 'small' }}>Total Cost:</Typography>
                                        </Grid>
                                        <Grid item size={6} sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontSize: 'small' }}>{property.currency} {formatCurrency(parseFloat(TotalCost))}</Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )}
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
                            label="Property Value Growth Rate (%)"
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