import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import ApartmentIcon from '@mui/icons-material/Apartment'; // HDB icon
import CondoIcon from '@mui/icons-material/Domain'; // Condo icon
import HouseIcon from '@mui/icons-material/House'; // Landed icon
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" property type
import { Modal, Switch, Slider, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem, Accordion, AccordionSummary, AccordionDetails, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { HomeLoanRate, HomeValueGrowthRate } from '../../common/DefaultValues';
import HomeLoanEMICalculator from './HomeLoanEMICalculator';
import { FormatCurrency } from '../../common/FormatCurrency';

const AssetPropertyForm = ({ property: initialProperty, action, onClose, refreshPropertyList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const [lastPropertyNumber, setLastPropertyNumber] = useState(0);
    const [lastPurchasePrice, setLastPurchasePrice] = useState(0);
    const [lastPropertyLocation, setLastPropertyLocation] = useState('');
    const [lastPropertyType, setLastPropertyType] = useState('');
    const [lastPropertyIsUnderLoan, setLastPropertyIsUnderLoan] = useState(false);

    const [selectedPropertyLocation, setselectedPropertyLocation] = useState(localStorage.getItem('currentUserCountryOfResidence'));

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserNationality = localStorage.getItem('currentUserNationality');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsPermanentResident = localStorage.getItem('currentUserIsPermanentResident');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';
    
    const [property, setProperty] = useState(initialProperty || {
        user_id: 0,
        property_name: "",
        property_type: "Condominium",
        location: currentUserCountryOfResidence || "",
        property_number: 1,
        purchase_date: "",
        currency: currentUserBaseCurrency || "",
        purchase_price: 0.0,
        stamp_duty: 0.0,
        other_fees: 0.0,
        current_value: 0.0,
        is_primary_property: false,
        is_funded_by_loan: false,
        loan_as_of_date: '',
        loan_amount: 0.0,
        loan_duration: 0,
        loan_type: "Fixed",
        loan_interest_rate: HomeLoanRate.find(rate => rate.key === currentUserCountryOfResidence)?.value || 0,
        is_loan_locked: false,
        loan_locked_till: "",
        is_on_rent: false,
        rental_start_date: "",
        rental_end_date: "",
        rental_amount: 0.0,
        rental_growth_rate: 0.0,
        growth_rate: HomeValueGrowthRate.find(rate => rate.key === currentUserCountryOfResidence)?.value || 0,
        is_plan_to_sell: action === 'Sell' ? true : false,
        sale_date: "",
        sale_amount: 0.0,
        property_tax: 0.0,
        property_maintenance: 0.0,
        buyer_stamp_duty: 0.0,
        additional_buyer_stamp_duty: 0.0,
        ltv_percentage: 0.0,
        ltv_value: 0.0,
        down_payment: 0.0,
        emi_amount: 0.0,
        interest_payments: 0.0,
        total_cost: 0.0,
        is_under_construction: false,
        launch_date: "",
        possession_date: "",
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
        if (property[name] !== newValue) {
            setProperty({
                ...property,
                [name]: newValue
            });
        }
        // if plan to sell is checked, then set the sale date to current date
        if (name === 'is_plan_to_sell' && checked) {
            setProperty(prevProperty => ({
                ...prevProperty,
                sale_date: new Date().toISOString().split('T')[0]
            }));
        }
        // if plan to sell is unchecked, then set the sale date to empty
        else if (name === 'is_plan_to_sell' && !checked) {
            setProperty(prevProperty => ({
                ...prevProperty,
                sale_date: '',
                sale_amount: 0.0
            }));
        }
        // if under construction is unchecked, then set launch date and possession date to empty
        else if (name === 'is_under_construction' && !checked) {
            setProperty(prevProperty => ({
                ...prevProperty,
                launch_date: '',
                possession_date: ''
            }));
        }
        // if location is changed then set selected location to the new location
        else if (name === 'location') {
            setselectedPropertyLocation(value);
            // check if location has been changed from SG to something else and property type is HDB. If so, then default the property type
            if (value !== 'SG' && property.property_type === 'HDB') {
                setProperty(prevProperty => ({
                    ...prevProperty,
                    property_type: 'Condominium'
                }));
            }
        }
    };

    useEffect(() => {
        calculatePropertyValue();
    }, [property]);

    useEffect(() => {
        if (initialProperty) {
            setProperty(initialProperty);
            setselectedPropertyLocation(initialProperty.location);
        }
        if (action === 'Sell') {
            setProperty(prevProperty => ({
                ...prevProperty,
                is_plan_to_sell: true
            }));
        }
    }, [initialProperty, action]);

    const validate = () => {

        const errors = {};

        if (!property.property_type) errors.property_type = 'Property Type is required';
        if (!property.property_name) errors.property_name = 'Property Name is required';
        if (!property.location) errors.location = 'Property Location is required';
        if (!property.currency) errors.currency = 'Currency is required';
        if (!property.purchase_date) errors.purchase_date = 'Purchase Date is required';
        if (!property.purchase_price) errors.purchase_price = 'Purchase Price is required';

        if (property.is_funded_by_loan) {
            if (!property.loan_type) errors.loan_type = 'Loan Type is required';
            if (!property.loan_amount) errors.loan_amount = 'Loan Amount is required';
            if (!property.loan_interest_rate) errors.loan_interest_rate = 'Loan Interest Rate is required';
            if (!property.loan_duration) errors.loan_duration = 'Loan Duration is required';
            if (!property.loan_as_of_date) errors.loan_as_of_date = "Loan Details As Of Date is required";

            // check that the loan amount is less than the purchase price
            if (parseFloat(property.loan_amount) > parseFloat(property.purchase_price)) errors.loan_amount = 'Loan Amount cannot be greater than Purchase Price';
            // check that the loan duration is not more than 30 years
            if (parseFloat(property.loan_duration) > 360) errors.loan_duration = 'Loan Duration cannot be more than 30 years';
            // check that the loan interest rate is not more than 20%
            if (parseFloat(property.loan_interest_rate) > 20) errors.loan_interest_rate = 'Loan Interest Rate cannot be more than 20%';

            if (property.loan_type === 'Fixed' && property.is_loan_locked) {
                if (!property.loan_locked_till) errors.loan_locked_till = 'Loan Locked Till Date is required';
                // check that the loan locked till date is not in the past
                if (new Date(property.loan_locked_till) < new Date()) errors.loan_locked_till = 'Loan Locked Till Date cannot be in the past';
                // check that the loan locked till date is not less than purchase date
                if (new Date(property.loan_locked_till) < new Date(property.purchase_date)) errors.loan_locked_till = 'Loan Locked Till Date cannot be before Purchase Date';
            }

            if (new Date(property.loan_as_of_date) < new Date(property.purchase_date)) errors.loan_as_of_date = "Loan As of Date cannot be before Purchase Date";
        }

        if (property.is_on_rent) {
            if (!property.rental_start_date) errors.rental_start_date = 'Rental Start Date is required';
            if (!property.rental_amount) errors.rental_amount = 'Rental Amount is required';
            // if (!property.rental_growth_rate) errors.rental_growth_rate = 'Rental Growth Rate is required';
            //chcek that the rental start dat is not before purchase date
            if (new Date(property.rental_start_date) < new Date(property.purchase_date)) errors.rental_start_date = 'Rental Start Date cannot be before Purchase Date';
            //check that the rental end date is not before rental start date
            if (property.rental_end_date && new Date(property.rental_end_date) < new Date(property.rental_start_date)) errors.rental_end_date = 'Rental End Date cannot be before Rental Start Date';
        }

        if (property.is_plan_to_sell) {
            if (!property.sale_date) errors.sale_date = 'Sale Date is required';
            if (!property.sale_amount) errors.sale_amount = 'Sale Amount is required';
            // check that the sale_date is greater than purchase_date
            if (new Date(property.sale_date) < new Date(property.purchase_date)) errors.sale_date = ' Sale Date cannot be before Purchase Date';
            //check that the rental end date is not after sale date
            if (property.rental_end_date && new Date(property.rental_end_date) > new Date(property.sale_date)) errors.rental_end_date = 'Rental End Date cannot be after Sale Date';
        }

        if (property.is_under_construction) {
            if (!property.launch_date) errors.launch_date = 'Launch Date is required';
            if (!property.possession_date) errors.possession_date = 'Possession Date is required';
            // check that the possession_date is not before launch_date
            if (new Date(property.possession_date) < new Date(property.launch_date)) errors.possession_date = 'Possession Date cannot be before Launch Date';
            // check that purchase date is not before launch date
            if (new Date(property.purchase_date) < new Date(property.launch_date)) errors.purchase_date = 'Purchase Date cannot be before Launch Date';
            // check the rental start date is not before possession date
            if (property.is_on_rent && new Date(property.rental_start_date) < new Date(property.possession_date)) errors.rental_start_date = 'Rental Start Date cannot be before Possession Date';
        }

        if (action === 'Add' || action === 'Edit') {
            // check that the purchase_date is not in the future
            if (new Date(property.purchase_date) > new Date()) errors.purchase_date = 'Purchase Date cannot be in the future';
        }
        else if (action === 'Dream' || action === 'EditDream') {
            // check that the purchase_date is not in the past
            if (new Date(property.purchase_date) <= new Date()) errors.purchase_date = 'Purchase Date cannot be in the past';
        }
        else if (action === 'Sell') {
            // check that the sale_date is greater than purchase_date
            if (new Date(property.sale_date) < new Date(property.purchase_date)) errors.sale_date = ' Sale Date cannot be before Purchase Date';
        }

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(property.purchase_price)) errors.purchase_price = 'Purchase Price should be numeric';
        if (isNaN(property.loan_amount)) errors.loan_amount = 'Loan Amount should be numeric';
        if (isNaN(property.loan_interest_rate)) errors.loan_interest_rate = 'Loan Interest Rate should be numeric';
        if (isNaN(property.loan_duration)) errors.loan_duration = 'Loan Duration should be numeric';
        if (isNaN(property.rental_amount)) errors.rental_amount = 'Rental Amount should be numeric';
        if (isNaN(property.growth_rate)) errors.growth_rate = 'Property Value Growth Rate should be numeric';
        if (isNaN(property.sale_amount)) errors.sale_amount = 'Tentative Sale Amount should be numeric';
        if (isNaN(property.current_value)) errors.current_value = 'Current Value Amount should be numeric';
        if (isNaN(property.property_tax)) errors.property_tax = 'Annual Property Tax Amount should be numeric';
        if (isNaN(property.property_maintenance)) errors.property_maintenance = 'Annual Property Maintenance Amount should be numeric';
        if (isNaN(property.stamp_duty)) errors.stamp_duty = 'Stamp Duty Rate should be numeric';
        if (isNaN(property.other_fees)) errors.other_fees = 'Other Fees should be numeric';
        if (isNaN(property.rental_growth_rate)) errors.rental_growth_rate = 'Rental Growth Rate should be numeric';

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                property.user_id = property.is_dummy_data ? 0 : currentUserId;
                if (action === 'Dream' || action === 'EditDream') property.is_dream = true;
                else property.is_dream = false;
                
                const response = initialProperty
                    ? await axios.put(`/api/asset_properties/${property.id}`, property)
                    : await axios.post('/api/asset_properties', property);

                let successMsg = '';
                if (action === 'Add' || action === 'Dream') successMsg = 'Property added successfully';
                else if (action === 'Edit' || action === 'EditDream') successMsg = 'Property updated successfully';
                else if (action === 'Sell') successMsg = 'Property sale details updated successfully';

                setErrorMessage('');
                onClose(); // Close the Asset Property Form window
                refreshPropertyList(response.data, successMsg); // Pass the updated property and success message
            } catch (error) {
                if (action === 'Add' || action === 'Dream') setErrorMessage('Failed to add property');
                else if (action === 'Edit' || action === 'EditDream') setErrorMessage('Failed to update property');
                else if (action === 'Sell') setErrorMessage('Failed to update property sale details');
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
        return -(rate * pv * pvif) / (pvif - 1);
    };

    const calculatePropertyValue = () => {

        var BuyerStampDuty = 0;
        var AdditionalBuyerStampDuty = 0;
        var LTVPercentage = 0;
        var LTVValue = 0;
        var DownPayment = 0;
        var emi = 0;
        var InterestPayments = 0;
        var OtherFees = 0;
        var TotalCost = 0;

        //check that property purchase price is greater than 0 and is a number
        if (isNaN(property.purchase_price) || property.purchase_price <= 0) return;
        else {
            // check if property location is SG
            if (property.location === 'SG') {

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
                if (property.is_funded_by_loan) {
                    //calculate LTV Percentage
                    if (property.property_number === 1) LTVPercentage = 75;
                    else if (property.property_number === 2) LTVPercentage = 45;
                    else if (property.property_number > 2) LTVPercentage = 35;
                }

                // calculate Other Fees
                const LegalFees = 2500; // Example fixed fee
                const ValuationFees = 500; // Example fixed fee
                const HomeInsurance = 500; // Example fixed fee
                var AgentFees = 0;
                if (property.property_type === 'HDB') AgentFees = 0.01 * property.purchase_price; // 1% of purchase price
                else if (property.property_type === 'Condominium') AgentFees = 0; // 0% of purchase price
                else if (property.property_type === 'Landed') AgentFees = 0.02 * property.purchase_price; // 2% of purchase price
                else if (property.property_type === 'Commercial') AgentFees = 0.02 * property.purchase_price; // 2% of purchase price
                else if (property.property_type === 'Land') AgentFees = 0.02 * property.purchase_price; // 2% of purchase price

                OtherFees = LegalFees + ValuationFees + HomeInsurance + AgentFees;

            }
            // check if property location is IN
            else if (property.location === 'IN') {

                //calculate Stamp Duty
                if (property.purchase_price <= 500000) BuyerStampDuty = property.purchase_price * 0.05;
                else BuyerStampDuty = property.purchase_price * 0.06;

                // if there is a Loan
                if (property.is_funded_by_loan) {
                    //calculate LTV Percentage
                    if (property.purchase_price <= 3000000) LTVPercentage = 90;
                    else if (property.purchase_price > 3000000 && property.purchase_price <= 7500000) LTVPercentage = 80;
                    else LTVPercentage = 75;
                }

                // calculate Other Fees
                const LegalFees = 10000; // Example fixed fee
                const ValuationFees = 5000; // Example fixed fee
                const HomeInsurance = property.purchase_price * 0.001; // .1% of purchase price
                const AgentFees = 0.02 * property.purchase_price; // 2% of purchase price

                OtherFees = LegalFees + ValuationFees + HomeInsurance + AgentFees;
            }

            // calculate Loan amount.
            LTVValue = LTVPercentage * property.purchase_price / 100;

            var loanAmountToUse = 0;
            var stampDutyToUse = 0;
            var otherFeesToUse = 0;
            // check if the user has changed the form for property no. or purchase price or property location
            // if so, then update the property values
            // else keep the user entered values and calculate the other values
            if (lastPropertyNumber === 0
                || lastPurchasePrice === 0
                || lastPropertyLocation === ''
                || lastPropertyType === '') {
                if (property.is_funded_by_loan) loanAmountToUse = LTVValue;
                stampDutyToUse = BuyerStampDuty + AdditionalBuyerStampDuty;
                otherFeesToUse = OtherFees;
                setLastPropertyNumber(property.property_number);
                setLastPurchasePrice(property.purchase_price);
                setLastPropertyLocation(property.location);
                setLastPropertyType(property.property_type);
                setLastPropertyIsUnderLoan(property.is_funded_by_loan);
            }
            else {
                if (lastPropertyNumber !== property.property_number
                    || lastPurchasePrice !== property.purchase_price
                    || lastPropertyLocation !== property.location
                    || lastPropertyType !== property.property_type
                    || lastPropertyIsUnderLoan !== property.is_funded_by_loan) {
                    if (property.is_funded_by_loan) loanAmountToUse = LTVValue;
                    stampDutyToUse = BuyerStampDuty + AdditionalBuyerStampDuty;
                    otherFeesToUse = OtherFees;
                    setLastPropertyNumber(property.property_number);
                    setLastPurchasePrice(property.purchase_price);
                    setLastPropertyLocation(property.location);
                    setLastPropertyType(property.property_type);
                    setLastPropertyIsUnderLoan(property.is_funded_by_loan);
                }
                else {
                    if (property.is_funded_by_loan) loanAmountToUse = property.loan_amount;
                    stampDutyToUse = property.stamp_duty;
                    otherFeesToUse = property.other_fees;
                }
            }

            // check if property is under Loan
            if (property.is_funded_by_loan) {

                DownPayment = property.purchase_price - loanAmountToUse;

                // Calculate Interest Payments
                // Loop through the loan duration and calculate the interest payments using the pmt function
                var outstandingBalance = loanAmountToUse;
                emi = Math.abs(pmt(property.loan_interest_rate / 100 / 12, property.loan_duration, loanAmountToUse));
                for (let month = 1; month <= property.loan_duration; month++) {
                    const openingBalance = outstandingBalance;
                    const interest = outstandingBalance * property.loan_interest_rate / 100 / 12;
                    var principal = 0;
                    if (emi <= openingBalance) principal = emi - interest;
                    else principal = openingBalance;
                    outstandingBalance -= principal;
                    InterestPayments += interest;
                }
            }

            TotalCost = parseFloat(property.purchase_price) +
                parseFloat(BuyerStampDuty) +
                parseFloat(AdditionalBuyerStampDuty) +
                parseFloat(OtherFees) +
                parseFloat(InterestPayments);

            // set property object values
            setProperty(prevProperty => ({
                ...prevProperty,
                loan_amount: loanAmountToUse,
                stamp_duty: stampDutyToUse,
                other_fees: otherFeesToUse
            }));

            LTVValue = loanAmountToUse;
            LTVPercentage = (LTVValue / property.purchase_price) * 100;
            if (property.location === 'SG') BuyerStampDuty = stampDutyToUse - AdditionalBuyerStampDuty;
            else BuyerStampDuty = stampDutyToUse;
            OtherFees = otherFeesToUse;

            // set all calculated values in the property object
            setProperty(prevProperty => ({
                ...prevProperty,
                buyer_stamp_duty: BuyerStampDuty,
                additional_buyer_stamp_duty: AdditionalBuyerStampDuty,
                ltv_percentage: LTVPercentage,
                ltv_value: LTVValue,
                down_payment: DownPayment,
                emi_amount: emi,
                interest_payments: InterestPayments,
                other_fees: OtherFees,
                total_cost: TotalCost
            }));
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
            case 'Other':
                return <OtherIcon style={{ color: 'white', marginRight: '10px' }} />;
            default:
                return <HomeIcon style={{ color: 'white', marginRight: '10px' }} />;
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
                    <HomeIcon style={{ color: 'green', marginRight: '10px' }} />
                    {(action === 'Add' || action === 'Dream') && (
                        <>
                            Purchase Property
                        </>
                    )}
                    {(action === 'Edit' || action === 'EditDream') && (
                        <>
                            Update Property Details
                        </>
                    )}
                    {action === 'Sell' && (
                        <>
                            Update Property Details for Sale
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" 
                    required
                    error={!!errors.property_type}
                >
                    <FormLabel component="legend">Select Property Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row 
                        aria-label="property_type" 
                        name="property_type" 
                        value={property.property_type} 
                        onChange={handleChange}
                    >
                        {selectedPropertyLocation === 'SG' && (
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
                    <FormHelperText>{errors.property_type}</FormHelperText>
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
                            name="location"
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
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Stamp Duty"
                            name="stamp_duty"
                            value={property.stamp_duty}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.stamp_duty}
                            helperText={errors.stamp_duty}
                            disabled={property.location === 'SG'}
                            InputLabelProps={{ shrink: property.stamp_duty !== '' }} // Updated line
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Other Fees"
                            name="other_fees"
                            value={property.other_fees}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.other_fees}
                            helperText={errors.other_fees}
                            InputLabelProps={{ shrink: property.other_fees !== '' }} // Updated line
                        />
                    </Grid>
                    {/* <Grid item size={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={property.is_primary_property}
                                    onChange={handleChange}
                                    name="is_primary_property"
                                />}
                            label="Is this your Primary Property"
                        />
                    </Grid> */}
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Property Value Growth Rate (%)"
                            name="growth_rate"
                            value={property.growth_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.growth_rate}
                            helperText={errors.growth_rate}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Current Value"
                            name="current_value"
                            value={property.current_value}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.current_value}
                            helperText={errors.current_value}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Property Tax (Monthly)"
                            name="property_tax"
                            value={property.property_tax}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.property_tax}
                            helperText={errors.property_tax}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Property Maintenance (monthly)"
                            name="property_maintenance"
                            value={property.property_maintenance}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.property_maintenance}
                            helperText={errors.property_maintenance}
                        />
                    </Grid>

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={property.is_under_construction}
                                            onChange={handleChange}
                                            name="is_under_construction"
                                        />}
                                    label="Property is under contruction?"
                                />
                            </Grid>
                            {property.is_under_construction && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Launch Date"
                                            name="launch_date"
                                            type="date"
                                            value={property.launch_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.launch_date}
                                            helperText={errors.launch_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Possession Date"
                                            name="possession_date"
                                            type="date"
                                            value={property.possession_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.possession_date}
                                            helperText={errors.possession_date}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={6} sx={{ display: 'flex' }}>
                                <Typography>Cash</Typography>
                                <Switch
                                    checked={property.is_funded_by_loan}
                                    onChange={handleChange}
                                    name="is_funded_by_loan"
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
                                    <Box sx={{ width: '90%', maxWidth: 1000, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
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
                            {property.is_funded_by_loan && (
                                <>
                                    <Grid item size={4}>
                                        <TextField
                                            label="Loan Details As Of?"
                                            variant="standard"
                                            name="loan_as_of_date"
                                            type="date"
                                            value={property.loan_as_of_date}
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
                                            value={property.loan_type}
                                            onChange={handleChange}
                                            fullWidth
                                            required
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
                                            value={property.loan_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            required
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
                                            required
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
                                            value={property.loan_duration}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.loan_duration}
                                            helperText={errors.loan_duration}
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
                                                    label="Interest rate Locked Till?"
                                                    variant="standard"
                                                    name="loan_locked_till"
                                                    type="date"
                                                    value={property.loan_locked_till}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!errors.loan_locked_till}
                                                    helperText={errors.loan_locked_till}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>

                        <Accordion sx={{ pt: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                {getPropertyIcon(property.property_type)}
                                <Typography >Overall Cost</Typography>
                                {
                                    property.is_funded_by_loan && (
                                        <>
                                            <Typography sx={{ ml: 'auto', color: 'white' }}>
                                                Loan EMI: {property.currency} {FormatCurrency(property.currency, parseFloat(property.emi_amount))} / month
                                            </Typography>
                                        </>
                                    )}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Property Price:</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.purchase_price))}</Typography>
                                    </Grid>
                                    {property.is_funded_by_loan && (
                                        <>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Loan-To-Value (LTV) %:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{property.ltv_percentage}%</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Loan Amount:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.ltv_value))}</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Down Payment:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.down_payment))}</Typography>
                                            </Grid>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Interest Payments:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.interest_payments))}</Typography>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Stamp Duty:</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.buyer_stamp_duty))}</Typography>
                                    </Grid>
                                    {property.location === 'SG' && (
                                        <>
                                            <Grid item size={6}>
                                                <Typography sx={{ fontSize: 'small' }}>Additional Buyer Stamp Duty:</Typography>
                                            </Grid>
                                            <Grid item size={6} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.additional_buyer_stamp_duty))}</Typography>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Other Fees:</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.other_fees))}</Typography>
                                    </Grid>
                                    <Grid item size={6}>
                                        <Typography sx={{ fontSize: 'small' }}>Total Cost (for the whole loan duration):</Typography>
                                    </Grid>
                                    <Grid item size={6} sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 'small' }}>{property.currency} {FormatCurrency(property.currency, parseFloat(property.total_cost))}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                    </Box>

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={property.is_on_rent}
                                            onChange={handleChange}
                                            name="is_on_rent"
                                        />}
                                    label="Property on Rent?"
                                />
                            </Grid>
                            {property.is_on_rent && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Rental Start Date"
                                            name="rental_start_date"
                                            type="date"
                                            value={property.rental_start_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.rental_start_date}
                                            helperText={errors.rental_start_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Rental End Date"
                                            name="rental_end_date"
                                            type="date"
                                            value={property.rental_end_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.rental_end_date}
                                            helperText={errors.rental_end_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Rental Amount (Monthly)"
                                            name="rental_amount"
                                            value={property.rental_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.rental_amount}
                                            helperText={errors.rental_amount}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Rental Growth Rate (%)"
                                            name="rental_growth_rate"
                                            value={property.rental_growth_rate}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.rental_growth_rate}
                                            helperText={errors.rental_growth_rate}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {((action === 'Edit') || (action === 'Add') || (action === 'Dream') || (action === 'EditDream')) && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={property.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="I plan to sell this property"
                                    />
                                )}
                                {(action === 'Sell') && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={property.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="Sell this property"
                                    />
                                )}
                            </Grid>
                            {property.is_plan_to_sell && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Sale Date"
                                            name="sale_date"
                                            type="date"
                                            value={property.sale_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
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
                                            value={property.sale_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            required
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
                                            checked={property.is_dummy_data}
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
                                disabled={property.is_dummy_data && !currentUserIsAdmin}
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