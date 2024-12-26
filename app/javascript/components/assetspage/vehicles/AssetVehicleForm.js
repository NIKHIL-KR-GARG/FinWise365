import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CarIcon from '@mui/icons-material/DirectionsCar'; // Car icon
import BikeIcon from '@mui/icons-material/TwoWheeler'; // Bike icon
import CommercialIcon from '@mui/icons-material/LocalShipping'; // Commercial vehicle icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" vehicle type
import { Modal, Switch, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from '../../common/FormatCurrency';
import FlatRateLoanEMICalculator from '../../common/FlatRateLoanEMICalculator';
import { VehicleLoanRate } from '../../common/DefaultValues';
import { calculateFlatRateEMI, calculateFlatRateInterest } from '../../calculators/CalculateInterestAndPrincipal';

const AssetVehicleForm = ({ vehicle: initialVehicle, action, onClose, refreshVehicleList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const [lastPurchasePrice, setLastPurchasePrice] = useState(0);
    const [lastVehicleIsUnderLoan, setLastVehicleIsUnderLoan] = useState(false);
    const [lastVehicleLocation, setLastVehicleLocation] = useState('');

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';

    const [vehicle, setVehicle] = useState(initialVehicle || {
        user_id: 0,
        vehicle_name: "",
        vehicle_type: "Car",
        location: currentUserCountryOfResidence || "",
        purchase_date: "",
        currency: currentUserBaseCurrency || "",
        purchase_price: 0.0,
        coe_paid: 0.0,
        current_value: 0.0,
        vehicle_maintanance: 0.0,
        monthly_expenses: 0.0,
        is_funded_by_loan: false,
        loan_as_of_date: '',
        loan_amount: 0.0,
        loan_duration: 0,
        loan_type: "Fixed",
        loan_interest_rate: VehicleLoanRate.find(rate => rate.key === currentUserCountryOfResidence)?.value || 0,
        ltv_percentage: 0.0,
        ltv_value: 0.0,
        down_payment: 0.0,
        emi_amount: 0.0,
        interest_payments: 0.0,
        total_cost: 0.0,
        is_on_lease: false,
        lease_start_date: "",
        lease_end_date: "",
        lease_amount: 0.0,
        lease_growth_rate: 0.0,
        is_plan_to_sell: action === 'Sell' ? true : false,
        sale_date: "",
        sale_amount: 0.0,
        scrap_value: 0.0,
        depreciation_rate: 0.0,
        is_dummy_data: false,
        is_dream: false
    });

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (vehicle[name] !== newValue) {
            setVehicle({
                ...vehicle,
                [name]: newValue
            });
        }
        // if plan to sell is checked, then set the sale date to today's date
        if (name === 'is_plan_to_sell' && checked) {
            setVehicle(prevVehicle => ({
                ...prevVehicle,
                sale_date: new Date().toISOString().split('T')[0]
            }));
        }
        // if plan to sell is unchecked, then set the sale date to empty
        else if (name === 'is_plan_to_sell' && !checked) {
            setVehicle(prevVehicle => ({
                ...prevVehicle,
                sale_date: '',
                sale_amount: 0.0
            }));
        }
    };

    useEffect(() => {
        calculateVehicleValue();
    }, [vehicle]);

    useEffect(() => {
        if (initialVehicle) {
            setVehicle(initialVehicle);
        }
        if (action === 'Sell') {
            setVehicle(prevVehicle => ({
                ...prevVehicle,
                is_plan_to_sell: true
            }));
        }
    }, [initialVehicle, action]);

    const validate = () => {
        const errors = {};

        if (!vehicle.vehicle_name) errors.vehicle_name = 'Vehicle Name is required';
        if (!vehicle.currency) errors.currency = 'Currency is required';
        if (!vehicle.purchase_date) errors.purchase_date = 'Purchase Date is required';
        if (!vehicle.purchase_price) errors.purchase_price = 'Purchase Price is required';

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(vehicle.purchase_price)) errors.purchase_price = 'Purchase Price should be numeric';
        if (isNaN(vehicle.coe_paid)) errors.coe_paid = 'COE Amount should be numeric';
        if (isNaN(vehicle.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(vehicle.loan_interest_rate)) errors.loan_interest_rate = 'Loan Interest Rate should be numeric';
        if (isNaN(vehicle.loan_duration)) errors.loan_duration = 'Loan Duration should be numeric';
        if (isNaN(vehicle.sale_amount)) errors.sale_amount = 'Sale Amount should be numeric';
        if (isNaN(vehicle.current_value)) errors.current_value = 'Current Value Amount should be numeric';
        if (isNaN(vehicle.vehicle_maintanance)) errors.vehicle_maintanance = 'Maintenance Amount should be numeric';
        if (isNaN(vehicle.monthly_expenses)) errors.monthly_expenses = 'Monthly Expenses should be numeric';
        if (isNaN(vehicle.scrap_value)) errors.scrap_value = 'Scrap Value should be numeric';
        if (isNaN(vehicle.depreciation_rate)) errors.depreciation_rate = 'Depreciation Rate should be numeric';
        if (isNaN(vehicle.lease_amount)) errors.lease_amount = 'Lease Amount should be numeric';
        if (isNaN(vehicle.lease_growth_rate)) errors.lease_growth_rate = 'Lease Growth Rate should be numeric';

        if (vehicle.is_funded_by_loan) {
            if (!vehicle.loan_type) errors.loan_type = 'Loan Type is required';
            if (!vehicle.loan_amount) errors.loan_amount = 'Loan Amount is required';
            if (!vehicle.loan_interest_rate) errors.loan_interest_rate = 'Loan Interest Rate is required';
            if (!vehicle.loan_duration) errors.loan_duration = 'Loan Duration is required';
            if (!vehicle.loan_as_of_date) errors.loan_as_of_date = "Loan Details As Of Date is required";

            // check that the loan amount is less than the purchase price
            if (parseFloat(vehicle.loan_amount) > parseFloat(vehicle.purchase_price)) errors.loan_amount = 'Loan Amount cannot be greater than Purchase Price';
            // check that the loan duration is not more than 10 years
            if (parseFloat(vehicle.loan_duration) > 120) errors.loan_duration = 'Loan Duration cannot be more than 10 years';
            // check that the loan interest rate is not more than 20%
            if (parseFloat(vehicle.loan_interest_rate) > 20) errors.loan_interest_rate = 'Loan Interest Rate cannot be more than 20%';
        
            if (new Date(vehicle.loan_as_of_date) < new Date(vehicle.purchase_date)) errors.loan_as_of_date = "Loan As of Date cannot be before Purchase Date";
        }

        if (vehicle.is_plan_to_sell) {
            if (!vehicle.sale_date) errors.sale_date = 'Sale Date is required';
            if (!vehicle.sale_amount) errors.sale_amount = 'Sale Amount is required';
            // check that the sale_date is greater than purchase_date
            if (new Date(vehicle.sale_date) < new Date(vehicle.purchase_date)) errors.sale_date = ' Sale Date cannot be before Purchase Date';
        }

        if (vehicle.is_on_lease) {
            if (!vehicle.lease_start_date) errors.lease_start_date = 'Lease Start Date is required';
            if (!vehicle.lease_end_date) errors.lease_end_date = 'Lease End Date is required';
            if (!vehicle.lease_amount) errors.lease_amount = 'Lease Amount is required';
            if (!vehicle.lease_growth_rate) errors.lease_growth_rate = 'Lease Growth Rate is required';
            // check that lease end date is greater than lease start date
            if (new Date(vehicle.lease_end_date) < new Date(vehicle.lease_start_date)) errors.lease_end_date = 'Lease End Date cannot be before Lease Start Date';
            // check that the lease start date is not before purchase date
            if (new Date(vehicle.lease_start_date) < new Date(vehicle.purchase_date)) errors.lease_start_date = 'Lease Start Date cannot be before Purchase Date';
            // check that the lease end date is not after sale date
            if (vehicle.is_plan_to_sell && new Date(vehicle.lease_end_date) > new Date(vehicle.sale_date)) errors.lease_end_date = 'Lease End Date cannot be after Sale Date';
        }

        if (action === 'Add' || action === 'Edit') {
            // check that the purchase_date is not in the future
            if (new Date(vehicle.purchase_date) > new Date()) errors.purchase_date = 'Purchase Date cannot be in the future';
        }
        else if (action === 'Dream' || action === 'EditDream') {
            // check that the purchase_date is not in the past
            if (new Date(vehicle.purchase_date) <= new Date()) errors.purchase_date = 'Purchase Date cannot be in the past';
        }
        else if (action === 'Sell') {
            // check that the sale_date is greater than purchase_date
            if (new Date(vehicle.sale_date) < new Date(vehicle.purchase_date)) errors.sale_date = 'Sale Date cannot be before Purchase Date';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                vehicle.user_id = currentUserId;
                if (action === 'Dream' || action === 'EditDream') vehicle.is_dream = true;
                else vehicle.is_dream = false;
                
                const response = initialVehicle
                    ? await axios.put(`/api/asset_vehicles/${vehicle.id}`, vehicle)
                    : await axios.post('/api/asset_vehicles', vehicle);

                let successMsg = '';
                if (action === 'Add' || action === 'Dream') successMsg = 'Vehicle added successfully';
                else if (action === 'Edit' || action === 'EditDream') successMsg = 'Vehicle updated successfully';
                else if (action === 'Sell') successMsg = 'Vehicle sale details updated successfully';

                setErrorMessage('');
                onClose(); // Close the Asset Vehicle Form window
                refreshVehicleList(response.data, successMsg); // Pass the updated vehicle and success message
            } catch (error) {
                if (action === 'Add' || action === 'Dream') setErrorMessage('Failed to add vehicle');
                else if (action === 'Edit' || action === 'EditDream') setErrorMessage('Failed to update vehicle');
                else if (action === 'Sell') setErrorMessage('Failed to update vehicle sale details');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const getVehicleIcon = (vehicleType) => {
        switch (vehicleType) {
            case 'Car':
                return <CarIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Bike':
                return <BikeIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Commercial':
                return <CommercialIcon style={{ color: 'white', marginRight: '10px' }} />;
            case 'Other':
                return <OtherIcon style={{ color: 'white', marginRight: '10px' }} />;
            default:
                return <CarIcon style={{ color: 'white', marginRight: '10px' }} />;
        }
    };

    const calculateVehicleValue = () => {

        var LTVPercentage = 0;
        var LTVValue = 0;
        var DownPayment = 0;
        var emi = 0;
        var InterestPayments = 0;
        var TotalCost = 0;

        //check that vehicle purchase price is greater than 0 and is a number
        if (isNaN(vehicle.purchase_price) || vehicle.purchase_price <= 0) return;
        else {
            // check if user is in SG
            if (vehicle.location === 'SG') {
                // if there is a Loan
                if (vehicle.is_funded_by_loan) {
                    //calculate LTV Percentage
                    if (vehicle.purchase_price <= 20000) LTVPercentage = 70;
                    else LTVPercentage = 60;
                }
            }
            // check if vehicle location is IN
            else if (vehicle.location === 'IN') {
                // if there is a Loan
                if (vehicle.is_funded_by_loan) LTVPercentage = 100;
            }
            else LTVPercentage = 90;

            // calculate Loan amount.
            LTVValue = LTVPercentage * vehicle.purchase_price / 100;

            var loanAmountToUse = 0;
            // check if the user has changed the form for purchase price or vehicle location
            // if so, then update the vehicle values
            // else keep the user entered values and calculate the other values
            if (lastPurchasePrice === 0 || lastVehicleLocation === '') {
                if (vehicle.is_funded_by_loan) loanAmountToUse = LTVValue;
                setLastPurchasePrice(vehicle.purchase_price);
                setLastVehicleLocation(vehicle.location);
                setLastVehicleIsUnderLoan(vehicle.is_funded_by_loan);
            }
            else {
                if (lastPurchasePrice !== vehicle.purchase_price
                    || lastVehicleLocation !== vehicle.location
                    || lastVehicleIsUnderLoan !== vehicle.is_funded_by_loan) {
                    if (vehicle.is_funded_by_loan) loanAmountToUse = LTVValue;
                    setLastPurchasePrice(vehicle.purchase_price);
                    setLastVehicleLocation(vehicle.location);
                    setLastVehicleIsUnderLoan(vehicle.is_funded_by_loan);
                }
                else {
                    if (vehicle.is_funded_by_loan) loanAmountToUse = vehicle.loan_amount;
                }
            }

            // check if vehicle is under Loan
            if (vehicle.is_funded_by_loan) {

                DownPayment = vehicle.purchase_price - loanAmountToUse;

                // Calculate Interest Payments & total interest using flat-rate method
                emi = calculateFlatRateEMI(loanAmountToUse, vehicle.loan_interest_rate, vehicle.loan_duration);
                InterestPayments = calculateFlatRateInterest(loanAmountToUse, vehicle.loan_interest_rate, vehicle.loan_duration);
            }

            TotalCost = parseFloat(vehicle.purchase_price) + parseFloat(InterestPayments);

            // set vehicle object values
            setVehicle(prevVehicle => ({
                ...prevVehicle,
                loan_amount: loanAmountToUse
            }));

            LTVValue = loanAmountToUse;
            LTVPercentage = (LTVValue / vehicle.purchase_price) * 100;

            setVehicle(prevVehicle => ({
                ...prevVehicle,
                ltv_percentage: LTVPercentage,
                ltv_value: LTVValue,
                down_payment: DownPayment,
                emi_amount: emi,
                interest_payments: InterestPayments,
                total_cost: TotalCost
            }));
        }
        return true;
    }

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
                    <CarIcon style={{ color: 'purple', marginRight: '10px' }} />
                    {(action === 'Add' || action === 'Dream') && (
                        <>
                            Purchase Vehicle
                        </>
                    )}
                    {(action === 'Edit' || action === 'EditDream') && (
                        <>
                            Update Vehicle Details
                        </>
                    )}
                    {action === 'Sell' && (
                        <>
                            Update Vehicle Details for Sale
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Vehicle Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="vehicle_type" name="vehicle_type" value={vehicle.vehicle_type} onChange={handleChange}>
                        <FormControlLabel
                            value="Car"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CarIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Car</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Bike"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><BikeIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Bike</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Commercial"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><CommercialIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Commercial</Typography></Grid>
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
                            label="Vehicle Name"
                            name="vehicle_name"
                            value={vehicle.vehicle_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.vehicle_name}
                            helperText={errors.vehicle_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            select
                            variant="standard"
                            label="Vehicle Location"
                            name="location"
                            value={vehicle.location}
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
                            type="date"
                            variant="standard"
                            label="Purchase Date"
                            name="purchase_date"
                            value={vehicle.purchase_date}
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
                            select
                            variant="standard"
                            label="Currency"
                            name="currency"
                            value={vehicle.currency}
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
                            variant="standard"
                            label="Purchase Price"
                            name="purchase_price"
                            value={vehicle.purchase_price}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.purchase_price}
                            helperText={errors.purchase_price}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label={currentUserCountryOfResidence === 'SG' ? "COE Paid" : "Tax Paid"}
                            name="coe_paid"
                            value={vehicle.coe_paid}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.coe_paid}
                            helperText={errors.coe_paid}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Maintenance Amount (Monthly)"
                            name="vehicle_maintanance"
                            value={vehicle.vehicle_maintanance}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.vehicle_maintanance}
                            helperText={errors.vehicle_maintanance}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Expenses (Monthly)"
                            name="monthly_expenses"
                            value={vehicle.monthly_expenses}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.monthly_expenses}
                            helperText={errors.monthly_expenses}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Current Value"
                            name="current_value"
                            value={vehicle.current_value}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.current_value}
                            helperText={errors.current_value}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Scrap Value"
                            name="scrap_value"
                            value={vehicle.scrap_value}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.scrap_value}
                            helperText={errors.scrap_value}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            variant="standard"
                            label="Depreciation Rate (%)"
                            name="depreciation_rate"
                            value={vehicle.depreciation_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.depreciation_rate}
                            helperText={errors.depreciation_rate}
                        />
                    </Grid>
                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6} sx={{ display: 'flex' }}>
                                <Typography>Cash</Typography>
                                <Switch
                                    checked={vehicle.is_funded_by_loan}
                                    onChange={handleChange}
                                    name="is_funded_by_loan"
                                    color="primary"
                                />
                                <Typography>Loan</Typography>
                            </Grid>
                            <Grid item size={6} >
                                {/*<Typography
                                    variant="body2"
                                    onClick={() => handleModalOpen(true)}
                                    sx={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: 'blue' }}
                                >
                                    Open EMI Calculator
                                </Typography>*/}
                                {/* <Modal
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
                                        <FlatRateLoanEMICalculator
                                            purchase_price={vehicle.purchase_price}
                                            loan_amount={vehicle.loan_amount}
                                            loan_duration={vehicle.loan_duration}
                                            currency={vehicle.currency}
                                            interest_rate={vehicle.loan_interest_rate}
                                        />
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
                                </Modal> */}
                            </Grid>
                            {vehicle.is_funded_by_loan && (
                                <>
                                    <Grid item size={4}>
                                        <TextField
                                            label="Loan Details As Of?"
                                            variant="standard"
                                            name="loan_as_of_date"
                                            type="date"
                                            value={vehicle.loan_as_of_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.loan_as_of_date}
                                            helperText={errors.loan_as_of_date}
                                        />
                                    </Grid>
                                    <Grid item size={4}>
                                        <TextField
                                            select
                                            variant="standard"
                                            label="Loan Type"
                                            name="loan_type"
                                            value={vehicle.loan_type}
                                            onChange={handleChange}
                                            fullWidth
                                            error={!!errors.loan_type}
                                            helperText={errors.loan_type}
                                        >
                                            <MenuItem value="Fixed">Fixed</MenuItem>
                                            <MenuItem value="Floating">Floating</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item size={4}>
                                        <TextField
                                            variant="standard"
                                            label="Loan Amount"
                                            name="loan_amount"
                                            value={vehicle.loan_amount}
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
                                            value={vehicle.loan_interest_rate}
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
                                            name="loan_duration"
                                            value={vehicle.loan_duration}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.loan_duration}
                                            helperText={errors.loan_duration}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Accordion sx={{ pt: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                {getVehicleIcon(vehicle.vehicle_type)}
                                <Typography >Overall Cost</Typography>
                                {
                                    vehicle.is_funded_by_loan && (
                                        <>
                                            <Typography sx={{ ml: 'auto', color: 'white' }}>
                                                Loan EMI: {vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.emi_amount))} / month
                                            </Typography>
                                        </>
                                    )}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Vehicle Value:</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.purchase_price))}</Typography>
                                    </Grid>
                                    {vehicle.is_funded_by_loan && (
                                        <>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Loan-To-Value (LTV) %:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{vehicle.ltv_percentage}%</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Loan Amount:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.ltv_value))}</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Down Payment:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.down_payment))}</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Interest Payments:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.interest_payments))}</Typography>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Total Cost:</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{vehicle.currency} {FormatCurrency(vehicle.currency, parseFloat(vehicle.total_cost))}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {((action === 'Edit') || (action === 'Add') || (action === 'Dream')) && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={vehicle.is_on_lease}
                                                onChange={handleChange}
                                                name="is_on_lease"
                                            />}
                                        label="I plan to lease this vehicle"
                                    />
                                )}
                            </Grid>
                            {vehicle.is_on_lease && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Lease Start Date"
                                            name="lease_start_date"
                                            type="date"
                                            value={vehicle.lease_start_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.lease_start_date}
                                            helperText={errors.lease_start_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Lease End Date"
                                            name="lease_end_date"
                                            type="date"
                                            value={vehicle.lease_end_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.lease_end_date}
                                            helperText={errors.lease_end_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Lease Growth Rate (%)"
                                            name="lease_growth_rate"
                                            value={vehicle.lease_growth_rate}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.lease_growth_rate}
                                            helperText={errors.lease_growth_rate}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Lease Amount"
                                            name="lease_amount"
                                            value={vehicle.lease_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.lease_amount}
                                            helperText={errors.lease_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {((action === 'Edit') || (action === 'Add') || (action === 'Dream')) && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={vehicle.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="I plan to sell this vehicle"
                                    />
                                )}
                                {(action === 'Sell') && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={vehicle.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="Sell this vehicle"
                                    />
                                )}
                            </Grid>
                            {vehicle.is_plan_to_sell && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Sale Date"
                                            name="sale_date"
                                            type="date"
                                            value={vehicle.sale_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.sale_date}
                                            helperText={errors.sale_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Sale Amount"
                                            name="sale_amount"
                                            value={vehicle.sale_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.sale_amount}
                                            helperText={errors.sale_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            {currentUserIsAdmin && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={vehicle.is_dummy_data}
                                            onChange={handleChange}
                                            name="is_dummy_data"
                                        />
                                    }
                                    label="Is Dummy Data?"
                                />
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={vehicle.is_dummy_data && !currentUserIsAdmin}
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

export default AssetVehicleForm;