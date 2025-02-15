import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // PMS portfolio icon
import StocksIcon from '@mui/icons-material/ShowChart'; // Stocks portfolio icon
import MutualFundsIcon from '@mui/icons-material/TrendingUp'; // Mutual Funds portfolio icon
import BondsIcon from '@mui/icons-material/AttachMoney'; // Bonds portfolio icon
import OtherIcon from '@mui/icons-material/Category'; // Other portfolio icon
import { Modal, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';
import AssetPortfolioDetails from './AssetPortfolioDetails';
import { CalculateInterest } from '../../calculators/CalculateInterestAndPrincipal';

const AssetPortfolioForm = ({ portfolio: initialPortfolio, action, onClose, refreshPortfolioList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';

    const [portfolio, setPortfolio] = useState(initialPortfolio || {
        user_id: 0,
        portfolio_name: "",
        portfolio_type: "Stocks",
        institution_name: "",
        location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        buying_date: "",
        buying_value: 0.0,
        growth_rate: 0.0,
        coupon_rate: 0.0,
        coupon_frequency: "Monthly",
        maturity_date: "",
        is_paying_dividend: false,
        dividend_rate: 0.0,
        dividend_amount: 0.0,
        dividend_frequency: "Monthly",
        is_plan_to_sell: action === 'Sell' ? true : false,
        sale_date: "",
        sale_value: 0.0,
        is_sip: false,
        sip_amount: 0.0,
        sip_frequency: "Monthly",
        sip_end_date: "",
        buy_price: 0.0,
        current_value: 0.0,
        profit: 0.0,
        profit_percentage: 0.0,
        loss: 0.0,
        loss_percentage: 0.0,
        is_dummy_data: false,
        is_dream: false
    });

    const [portfoliodetails, setPortfolioDetails] = useState([]);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        if (portfolio[name] !== newValue) {
            setPortfolio({
                ...portfolio,
                [name]: newValue
            });
        }
        // if portfolio type is changed to Bonds, then make growth rate field 0 and empty out the dividend fields
        if (name === 'portfolio_type') {
            if (value === 'Bonds') {
                setPortfolio((prevPortfolio) => ({
                    ...prevPortfolio,
                    growth_rate: 0.0,
                    is_paying_dividend: false,
                    dividend_rate: 0.0,
                    dividend_amount: 0.0,
                    dividend_frequency: "Monthly"
                }));
            }
            else {
                setPortfolio((prevPortfolio) => ({
                    ...prevPortfolio,
                    coupon_rate: 0.0
                }));
            }
        }
        else if (name === 'buying_value') {
            if (portfolio.portfolio_type !== 'Bonds') {
                const dividendAmount = calculateDividendAmount(portfolio.dividend_frequency, value, portfolio.dividend_rate);
                setPortfolio((prevPortfolio) => ({
                    ...prevPortfolio,
                    dividend_amount: dividendAmount
                }));
            }
        }

        // if SIP is un-checked, then make sip amount 0 and frequency monthly
        if (name === 'is_sip' && !checked) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                sip_amount: 0.0,
                sip_frequency: "Monthly"
            }));
        }
        // if plan to sell is un-checked, then make sale date and value empty
        if (name === 'is_plan_to_sell' && !checked) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                sale_date: "",
                sale_value: 0.0
            }));
        }
        // if Dividend is un-checked, then make dividend rate 0 and amount 0
        if (name === 'is_paying_dividend' && !checked) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                dividend_rate: 0.0,
                dividend_amount: 0.0,
                dividend_frequency: "Monthly"
            }));
        }
        if (name === 'dividend_rate') {
            const dividendAmount = calculateDividendAmount(portfolio.dividend_frequency, portfolio.buying_value, value);
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                dividend_amount: dividendAmount
            }));
        }
        else if (name === 'dividend_frequency') {
            const dividendAmount = calculateDividendAmount(value, portfolio.buying_value, portfolio.dividend_rate);
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                dividend_amount: dividendAmount
            }));
        }
    };

    const calculateDividendAmount = (frequency, value, rate) => {

        let dividendAmount = parseFloat(value) * (rate / 100);
        if (frequency === 'Monthly') dividendAmount = dividendAmount / 12;
        else if (frequency === 'Quarterly') dividendAmount = dividendAmount / 4;
        else if (frequency === 'Semi-Annually') dividendAmount = dividendAmount / 2;
        return dividendAmount;
    };

    const fetchPortfolioDetails = async () => {
        try {
            const response = await axios.get(`/api/asset_portfolio_details?user_id=${currentUserId}&portfolio_id=${portfolio.id}`);
            setPortfolioDetails(response.data);
        } catch (error) {
            console.error('Error fetching portfolio details:', error);
        }
    };

    useEffect(() => {
        fetchPortfolioDetails();
        calculatetTotalInterest();
    }, [portfolio, currentUserId]);

    useEffect(() => {
        if (initialPortfolio) {
            setPortfolio(initialPortfolio);
        }
        if (action === 'Sell') {
            setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                is_plan_to_sell: true
            }));
        }
    }, [initialPortfolio, action]);

    const validate = () => {
        const errors = {};

        if (!portfolio.portfolio_name) errors.portfolio_name = 'Portfolio Name is required';
        if (!portfolio.portfolio_type) errors.portfolio_type = 'Portfolio Type is required';
        if (!portfolio.institution_name) errors.institution_name = 'Institution Name is required';
        if (!portfolio.location) errors.location = 'Portfolio Location is required';
        if (!portfolio.currency) errors.currency = 'Currency is required';
        if (!portfolio.buying_date) errors.buying_date = 'Date Bought is required';
        if (!portfolio.buying_value) errors.buying_value = 'Buying Value is required';

        if (portfolio.is_paying_dividend && !portfolio.dividend_rate && !portfolio.dividend_amount) {
            errors.dividend_rate = 'Dividend Rate or Dividend Amount is required';
            errors.dividend_amount = 'Dividend Rate or Dividend Amount is required';
        }
        if (portfolio.is_sip) {
            if (!portfolio.sip_amount) errors.sip_amount = 'SIP Amount is required';
            if (!portfolio.sip_frequency) errors.sip_frequency = 'SIP Frequency is required';
            if (!portfolio.sip_end_date) errors.sip_end_date = 'SIP End Date is required';
            if (new Date(portfolio.sip_end_date) < new Date(portfolio.buying_date)) errors.sip_end_date = 'SIP End Date should be after Portfolio Start Date';
        }
        if (portfolio.is_plan_to_sell) {
            if (!portfolio.sale_date) errors.sale_date = 'Date Sold is required';
            if (!portfolio.sale_value) errors.sale_value = 'Selling Value is required';
            // check if sale date is after buying date
            if (new Date(portfolio.sale_date) < new Date(portfolio.buying_date)) errors.sale_date = 'Sale Date should be after Buying Date';
            if (new Date(portfolio.sip_end_date) > new Date(portfolio.sale_date)) errors.sip_end_date = 'SIP End Date should be before Sale Date';
        }

        if (portfolio.portfolio_type === 'Bonds') {
            if (!portfolio.coupon_rate) errors.coupon_rate = 'Coupon Rate is required';
            if (!portfolio.coupon_frequency) errors.coupon_frequency = 'Coupon Frequency is required';
            if (!portfolio.maturity_date) errors.maturity_date = 'Maturity Date is required';
            // check if maturity date is after buying date
            if (new Date(portfolio.maturity_date) < new Date(portfolio.buying_date)) errors.maturity_date = 'Maturity Date should be after Buying Date';
        } 

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(portfolio.buying_value)) errors.buying_value = 'Buying Value should be numeric';
        if (isNaN(portfolio.growth_rate)) errors.growth_rate = 'Growth Rate should be numeric';
        if (isNaN(portfolio.coupon_rate)) errors.coupon_rate = 'Coupon Rate should be numeric';
        if (isNaN(portfolio.dividend_rate)) errors.dividend_rate = 'Dividend Rate should be numeric';
        if (isNaN(portfolio.dividend_amount)) errors.dividend_amount = 'Dividend Amount should be numeric';
        if (isNaN(portfolio.sale_value)) errors.sale_value = 'Selling Value should be numeric';
        if (isNaN(portfolio.sip_amount)) errors.sip_amount = 'SIP Amount should be numeric';
        if (isNaN(portfolio.coupon_rate)) errors.coupon_rate = 'Coupon Rate should be numeric';

        if (action === 'Add' || action === 'Edit') {
            // check that the buying_date is not in the future
            if (new Date(portfolio.buying_date) > new Date()) errors.buying_date = 'Buying Date cannot be in the future';
        }
        else if (action === 'Dream' || action === 'EditDream') {
            // check that the buying_date is not in the past
            if (new Date(portfolio.buying_date) <= new Date()) errors.buying_date = 'Buying Date cannot be in the past';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                portfolio.user_id = portfolio.is_dummy_data ? 0 : currentUserId;
                if (action === 'Dream' || action === 'EditDream') portfolio.is_dream = true;
                else portfolio.is_dream = false;
                
                const response = initialPortfolio
                    ? await axios.put(`/api/asset_portfolios/${portfolio.id}`, portfolio)
                    : await axios.post('/api/asset_portfolios', portfolio);

                let successMsg = '';
                if (action === 'Add' || action === 'Dream') successMsg = 'Portfolio added successfully';
                else if (action === 'Edit' || action === 'EditDream') successMsg = 'Portfolio updated successfully';
                else if (action === 'Sell') successMsg = 'Portfolio sale details updated successfully';
                setErrorMessage('');
                onClose(); // Close the Asset Portfolio Form window
                refreshPortfolioList(response.data, successMsg); // Pass the updated portfolio and success message
            } catch (error) {
                if (action === 'Add' || action === 'Dream') setErrorMessage('Failed to add portfolio');
                else if (action === 'Edit' || action === 'EditDream') setErrorMessage('Failed to update portfolio');
                else if (action === 'Sell') setErrorMessage('Failed to update portfolio sale details');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculatetTotalInterest = () => {

        if (!portfolio.portfolio_type || !portfolio.buying_date || !portfolio.buying_value) return;
        if (portfolio.portfolio_type === 'Bonds' && (!portfolio.coupon_rate || !portfolio.maturity_date)) return;
        // if (portfolio.portfolio_type !== 'Bonds' && !portfolio.growth_rate) return;
        if (portfolio.is_plan_to_sell && (!portfolio.sale_date || !portfolio.sale_value)) return;

        // if there is sale date then get no of months between buying and selling
        // else get no of months between buying and current date
        let months = 0;
        let interest = 0;
        let dividend = 0;
        let profit = 0;
        let profitPercentage = 0;
        let loss = 0;
        let lossPercentage = 0;
        let buyPrice = parseFloat(portfolio.buying_value);
        let currentPrice = buyPrice;

        if (portfolio.is_plan_to_sell) {
            months = (new Date(portfolio.sale_date).getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + new Date().getMonth(portfolio.sale_date) - new Date(portfolio.buying_date).getMonth();
            currentPrice = parseFloat(portfolio.sale_value);
        }
        else months = (new Date().getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + new Date().getMonth() - new Date(portfolio.buying_date).getMonth();

        // calculate the dividend or coupon payment
        if (portfolio.portfolio_type === 'Bonds') {

            const monthsForBond = (new Date(portfolio.maturity_date).getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + new Date(portfolio.maturity_date).getMonth() - new Date(portfolio.buying_date).getMonth();
            interest = CalculateInterest(
                "Fixed",
                "Simple",
                parseFloat(portfolio.coupon_rate),
                parseFloat(portfolio.buying_value),
                monthsForBond,
                '', // no SIP frequency for bonds
                0, // no SIP amount for bonds
                "Monthly"
            )
        }
        else {
            if (months > 0) {
                //calculate the interest as per the growth rate & SIP amount
                interest = CalculateInterest(
                    "Fixed",
                    "Simple",
                    portfolio.growth_rate,
                    portfolio.buying_value,
                    months,
                    portfolio.sip_frequency,
                    portfolio.sip_amount,
                    "Monthly"
                )
                //calculate the dividend as per the dividend rate. Dividend should be on the increased value of the portfolio
                let currentPriceforDividend = parseFloat(portfolio.buying_value);
                for (let i = 0; i < months; i++) {
                    if (portfolio.sip_frequency === 'Monthly') {
                        buyPrice += parseFloat(portfolio.sip_amount);
                        currentPriceforDividend += parseFloat(portfolio.sip_amount);
                    }
                    else if (portfolio.sip_frequency === 'Quarterly' && i % 3 === 0) {
                        buyPrice += parseFloat(portfolio.sip_amount);
                        currentPriceforDividend += parseFloat(portfolio.sip_amount);
                    }
                    else if (portfolio.sip_frequency === 'Semi-Annually' && i % 6 === 0) {
                        buyPrice += parseFloat(portfolio.sip_amount);
                        currentPriceforDividend += parseFloat(portfolio.sip_amount);
                    }
                    else if (portfolio.sip_frequency === 'Annually' && i % 12 === 0) {
                        buyPrice += parseFloat(portfolio.sip_amount);
                        currentPriceforDividend += parseFloat(portfolio.sip_amount);
                    }
                    if (portfolio.is_paying_dividend) {
                        dividend += CalculateInterest(
                            "Fixed",
                            "Simple",
                            parseFloat(portfolio.dividend_rate),
                            currentPriceforDividend,
                            1,
                            "",
                            0.0,
                            "Monthly"
                        )
                        //increase the buy price for dividend by the growth rate for 1 month
                        currentPriceforDividend += CalculateInterest(
                            "Fixed",
                            "Simple",
                            parseFloat(portfolio.growth_rate),
                            currentPriceforDividend,
                            1,
                            "",
                            0.0,
                            "Monthly"
                        )
                    }
                }
                if (!portfolio.is_plan_to_sell) currentPrice = buyPrice;
            }
        }

        profit = currentPrice + interest + dividend - buyPrice;
        if (profit < 0) {
            profit = 0;
            profitPercentage = 0;
            loss = Math.abs(currentPrice + interest + dividend - buyPrice)
            lossPercentage = parseFloat((loss / buyPrice * 100).toFixed(2));
        }
        else {
            profitPercentage = parseFloat((profit / buyPrice * 100).toFixed(2));
            loss = 0;
            lossPercentage = 0;
        }

        setPortfolio((prevPortfolio) => ({
            ...prevPortfolio,
            buy_price: buyPrice,
            current_value: currentPrice + interest + dividend,
            profit: profit,
            profit_percentage: profitPercentage,
            loss: loss,
            loss_percentage: lossPercentage
        }));

        return;
    }

    const handleOpenDetails = () => {
        if (validate()) {
            // onClose(); // Close the current portfolio modal form
            handleModalOpen(); // Open the portfolio details modal form
        } else {
            setErrorMessage('Please fix the validation errors before opening the details');
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
                    {(action === 'Add' || action === 'Dream') && (
                        <>
                            Add Portfolio
                        </>
                    )}
                    {(action === 'Edit' || action === 'EditDream') && (
                        <>
                            Update Portfolio Details
                        </>
                    )}
                    {action === 'Sell' && (
                        <>
                            Update Portfolio Details for Sale
                        </>
                    )}
                </Typography>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Portfolio Type:</FormLabel>
                    <RadioGroup sx={{ pb: 2 }} row aria-label="portfolio_type" name="portfolio_type" value={portfolio.portfolio_type} onChange={handleChange}>
                        <FormControlLabel
                            value="PMS"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><SavingsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">PMS</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Stocks"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><StocksIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Stocks</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Mutual Funds"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><MutualFundsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Mutual Funds</Typography></Grid>
                                </Grid>
                            }
                        />
                        <FormControlLabel
                            value="Bonds"
                            control={<Radio />}
                            label={
                                <Grid container direction="column" alignItems="center" spacing={0}>
                                    <Grid item><BondsIcon style={{ fontSize: 'normal' }} /></Grid>
                                    <Grid item><Typography variant="caption">Bonds</Typography></Grid>
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
                            label="Portfolio Name"
                            name="portfolio_name"
                            value={portfolio.portfolio_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.portfolio_name}
                            helperText={errors.portfolio_name}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Institution Name"
                            name="institution_name"
                            value={portfolio.institution_name}
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
                            label="Portfolio Location"
                            name="location"
                            value={portfolio.location}
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
                            value={portfolio.currency}
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
                            label="Portfolio Buying Date"
                            name="buying_date"
                            value={portfolio.buying_date}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                            error={!!errors.buying_date}
                            helperText={errors.buying_date}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Portfolio Buying Value"
                            name="buying_value"
                            value={portfolio.buying_value}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.buying_value}
                            helperText={errors.buying_value}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <TextField
                            variant="standard"
                            label="Growth Rate (%)"
                            name="growth_rate"
                            value={portfolio.growth_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.growth_rate}
                            helperText={errors.growth_rate}
                            disabled={portfolio.portfolio_type === 'Bonds'}
                        />
                    </Grid>

                    {portfolio.portfolio_type === 'Bonds' && (
                        <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                            <Grid container spacing={2}>
                                <Grid item size={6}>
                                    <Typography variant="h6" component="h2">
                                        Bond Details
                                    </Typography>
                                </Grid>
                                <Grid item size={6}>
                                    <TextField
                                        variant="standard"
                                        label="Coupon Rate (%)"
                                        name="coupon_rate"
                                        value={portfolio.coupon_rate}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                        error={!!errors.coupon_rate}
                                        helperText={errors.coupon_rate}
                                    />
                                </Grid>
                                <Grid item size={6}>
                                    <TextField
                                        select
                                        variant="standard"
                                        label="Coupon Frequency"
                                        name="coupon_frequency"
                                        value={portfolio.coupon_frequency}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={!!errors.coupon_frequency}
                                        helperText={errors.coupon_frequency}
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
                                        label="Maturity Date"
                                        name="maturity_date"
                                        type="date"
                                        value={portfolio.maturity_date}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        error={!!errors.maturity_date}
                                        helperText={errors.maturity_date}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                   
                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%', display: 'flex', justifyContent: 'center' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <Typography
                                    variant="body2"
                                    onClick={handleOpenDetails}
                                    sx={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: 'blue', textAlign: 'center' }}
                                >
                                    Open Portfolio Details
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
                                    <Box sx={{ width: 1200, height: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative' }}>
                                        <AssetPortfolioDetails 
                                            portfolio={portfolio} 
                                            portfoliodetails={portfoliodetails} 
                                            action={action} 
                                            onCloseDetails={handleModalClose} 
                                            onCloseForm={onClose} 
                                            refreshPortfolioList={refreshPortfolioList}
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
                                </Modal>
                            </Grid>
                        </Grid>
                    </Box>

                    {portfolio.portfolio_type !== 'Bonds' && (
                        <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                            <Grid container spacing={2}>
                                <Grid item size={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={portfolio.is_sip}
                                                onChange={handleChange}
                                                name="is_sip"
                                            />}
                                        label="Is this a SIP?"
                                    />
                                </Grid>
                                {portfolio.is_sip && (
                                    <>
                                        <Grid item size={6}>
                                            <TextField
                                                variant="standard"
                                                label="SIP Amount"
                                                name="sip_amount"
                                                value={portfolio.sip_amount}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                                error={!!errors.sip_amount}
                                                helperText={errors.sip_amount}
                                            />
                                        </Grid>
                                        <Grid item size={6}>
                                            <TextField
                                                select
                                                variant="standard"
                                                label="SIP Frequency"
                                                name="sip_frequency"
                                                value={portfolio.sip_frequency}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            >
                                                <MenuItem value="Monthly">Monthly</MenuItem>
                                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                                <MenuItem value="Semi-Annually">Semi-Annually</MenuItem>
                                                <MenuItem value="Annually">Annually</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item size={6}>
                                            <TextField
                                                type="date"
                                                variant="standard"
                                                label="SIP End Date"
                                                name="sip_end_date"
                                                value={portfolio.sip_end_date}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                error={!!errors.sip_end_date}
                                                helperText={errors.sip_end_date}
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {portfolio.portfolio_type !== 'Bonds' && (
                        <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                            <Grid container spacing={2}>
                                <Grid item size={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={portfolio.is_paying_dividend}
                                                onChange={handleChange}
                                                name="is_paying_dividend"
                                            />}
                                        label="Is this portfolio paying a dividend?"
                                    />
                                </Grid>
                                {portfolio.is_paying_dividend && (
                                    <>
                                        <Grid item size={6}>
                                            <TextField
                                                select
                                                variant="standard"
                                                label="Dividend Frequency"
                                                name="dividend_frequency"
                                                value={portfolio.dividend_frequency}
                                                onChange={handleChange}
                                                fullWidth
                                                required
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
                                                label="Dividend Rate (%)"
                                                name="dividend_rate"
                                                value={portfolio.dividend_rate}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                                error={!!errors.dividend_rate}
                                                helperText={errors.dividend_rate}
                                            />
                                        </Grid>
                                        <Grid item size={6}>
                                            <TextField
                                                variant="standard"
                                                label="Dividend Amount (Based on Original Buying Value)"
                                                name="dividend_amount"
                                                value={FormatCurrency(portfolio.currency, parseFloat(portfolio.dividend_amount))}
                                                onChange={handleChange}
                                                fullWidth
                                                disabled
                                                slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                                error={!!errors.dividend_amount}
                                                helperText={errors.dividend_amount}
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Box>
                    )}

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {((action === 'Edit') || (action === 'Add') || (action === 'Dream') || (action === 'EditDream')) && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={portfolio.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="I plan to sell this portfolio"
                                    />
                                )}
                                {(action === 'Sell') && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={portfolio.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="Sell this portfolio"
                                    />
                                )}
                            </Grid>
                            {portfolio.is_plan_to_sell && (
                                <>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Sale Date"
                                            name="sale_date"
                                            type="date"
                                            value={portfolio.sale_date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            error={!!errors.sale_date}
                                            helperText={errors.sale_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Sale Amount"
                                            name="sale_value"
                                            value={portfolio.sale_value}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.sale_value}
                                            helperText={errors.sale_value}
                                        />
                                    </Grid>
                                </>
                            )}
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
                                {portfolio.portfolio_type !== 'Bonds' && (
                                    <Grid item size={10} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant="body1" component="h2" gutterBottom>
                                            You will have invested a total amount of: <strong>{portfolio.currency} {FormatCurrency(portfolio.currency, parseFloat(portfolio.buy_price))} </strong>
                                            {
                                                portfolio.profit > 0 && (
                                                    <>
                                                        that is expected to generate a profit of: <strong style={{ color: 'blue' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, portfolio.profit)} ({portfolio.profit_percentage}%)</strong>
                                                    </>
                                                )}
                                            {
                                                portfolio.loss > 0 && (
                                                    <>
                                                        that has generated a loss of: <strong style={{ color: 'blue' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, portfolio.loss)} ({portfolio.loss_percentage}%)</strong>
                                                    </>
                                                )}
                                        </Typography>
                                        <Typography variant="body1" component="h2" gutterBottom>
                                            Overall current value based on growth rate & dividend is: <strong style={{ color: 'brown' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, portfolio.current_value)} </strong>
                                        </Typography>
                                    </Grid>
                                )}
                                {portfolio.portfolio_type === 'Bonds' && (
                                    <Grid item size={10} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant="body1" component="h2" gutterBottom>
                                            You have invested a total amount of: <strong>{portfolio.currency} {FormatCurrency(portfolio.currency, parseFloat(portfolio.buy_price))} </strong>
                                            that is expected to generate an interest of: <strong style={{ color: 'blue' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, portfolio.profit)} ({portfolio.profit_percentage}%)</strong>
                                        </Typography>
                                        <Typography variant="body1" component="h2" gutterBottom>
                                            Overall value at maturity: <strong style={{ color: 'brown' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, portfolio.current_value)} </strong>
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0, mb: 1 }}>
                            {currentUserIsAdmin && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={portfolio.is_dummy_data}
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
                                disabled={portfolio.is_dummy_data && !currentUserIsAdmin}
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

export default AssetPortfolioForm;