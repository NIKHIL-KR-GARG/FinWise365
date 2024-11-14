import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // PMS portfolio icon
import StocksIcon from '@mui/icons-material/ShowChart'; // Stocks portfolio icon
import MutualFundsIcon from '@mui/icons-material/TrendingUp'; // Mutual Funds portfolio icon
import BondsIcon from '@mui/icons-material/AttachMoney'; // Bonds portfolio icon
import OtherIcon from '@mui/icons-material/Category'; // Other portfolio icon
// import TermIcon from '@mui/icons-material/AccessTime'; // New icon for "Term" portfolio type
import { Modal, Alert, Snackbar, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, Box, Checkbox, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon

import CurrencyList from '../../common/CurrencyList';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';
import AssetPortfolioDetails from './AssetPortfolioDetails';

const AssetPortfolioForm = ({ portfolio: initialPortfolio, action, onClose, refreshPortfolioList }) => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const [portfolio, setPortfolio] = useState(initialPortfolio || {
        user_id: 0,
        portfolio_name: "",
        portfolio_type: "Stocks",
        institution_name: "",
        portfolio_location: currentUserCountryOfResidence || "",
        currency: currentUserBaseCurrency || "",
        buying_date: "",
        buying_value: 0.0,
        growth_rate: 0.0,
        coupon_rate: 0.0,
        is_paying_dividend: false,
        dividend_rate: 0.0,
        dividend_amount: 0.0,
        dividend_frequency: "Monthly",
        is_plan_to_sell: action === 'Sell' ? true : false,
        selling_date: "",
        selling_value: 0.0,
        is_sip: false,
        sip_amount: 0.0,
        sip_frequency: "Monthly",
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
        if (portfolio[name] !== newValue) {
            setPortfolio({
                ...portfolio,
                [name]: newValue
            });
        }
        // check if dividend rate is changed, then calculate dividend amount and update in the portfolio
        if (name === 'dividend_rate') {
            const dividendAmount = portfolio.buying_value * (value / 100);
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                dividend_amount: dividendAmount
            }));
        }
        // else if dividend amount is changed, then calculate dividend rate and update in the portfolio
        if (name === 'dividend_amount') {
            const dividendRate = (value / portfolio.buying_value) * 100;
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                dividend_rate: dividendRate
            }));
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
                    coupon_rate_rate: 0.0
                }));
            }
        }
    };

    useEffect(() => {
        calculatetTotalInterest();
    }, [portfolio]);

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
        if (!portfolio.portfolio_location) errors.portfolio_location = 'Portfolio Location is required';
        if (!portfolio.currency) errors.currency = 'Currency is required';
        if (!portfolio.buying_date) errors.buying_date = 'Date Bought is required';
        if (!portfolio.buying_value) errors.buying_value = 'Buying Value is required';

        if (portfolio.is_paying_dividend && !portfolio.dividend_rate && !portfolio.dividend_amount) {
            errors.dividend_rate = 'Dividend Rate or Dividend Amount is required';
            errors.dividend_amount = 'Dividend Rate or Dividend Amount is required';
        }
        if (portfolio.is_plan_to_sell) {
            if (!portfolio.selling_date) errors.selling_date = 'Date Sold is required';
            if (!portfolio.selling_value) errors.selling_value = 'Selling Value is required';
        }
        if (portfolio.is_sip) {
            if (!portfolio.sip_amount) errors.sip_amount = 'SIP Amount is required';
            if (!portfolio.sip_frequency) errors.sip_frequency = 'SIP Frequency is required';
        }

        // Restrict non-numeric input for numeric fields, allowing floats
        if (isNaN(portfolio.buying_value)) errors.buying_value = 'Buying Value should be numeric';
        if (isNaN(portfolio.growth_rate)) errors.growth_rate = 'Growth Rate should be numeric';
        if (isNaN(portfolio.coupon_rate)) errors.coupon_rate = 'Coupon Rate should be numeric';
        if (isNaN(portfolio.dividend_rate)) errors.dividend_rate = 'Dividend Rate should be numeric';
        if (isNaN(portfolio.dividend_amount)) errors.dividend_amount = 'Dividend Amount should be numeric';
        if (isNaN(portfolio.selling_value)) errors.selling_value = 'Selling Value should be numeric';
        if (isNaN(portfolio.sip_amount)) errors.sip_amount = 'SIP Amount should be numeric';

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                portfolio.user_id = currentUserId;
                const response = initialPortfolio
                    ? await axios.put(`/api/asset_portfolios/${portfolio.id}`, portfolio)
                    : await axios.post('/api/asset_portfolios', portfolio);

                let successMsg = '';
                if (action === 'Add') successMsg = 'Portfolio added successfully';
                else if (action === 'Edit') successMsg = 'Portfolio updated successfully';
                else if (action === 'Sell') successMsg = 'Portfolio sale details updated successfully';
                setErrorMessage('');
                onClose(); // Close the Asset Portfolio Form window
                refreshPortfolioList(response.data, successMsg); // Pass the updated portfolio and success message
            } catch (error) {
                if (action === 'Add') setErrorMessage('Failed to add portfolio');
                else if (action === 'Edit') setErrorMessage('Failed to update portfolio');
                else if (action === 'Sell') setErrorMessage('Failed to update portfolio sale details');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('Please fix the validation errors');
            setSuccessMessage('');
        }
    };

    const calculatetTotalInterest = () => {

        // if (!portfolio.portfolio_type || !portfolio.buying_date || !portfolio.buying_value || (!portfolio.growth_rate && !portfolio.coupon_rate)) return;

        // //no of months since deposit
        // const months = (new Date().getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + new Date().getMonth() - new Date(portfolio.buying_date).getMonth();

        // if (portfolio.portfolio_type === 'Bonds') {
        //     const interest = portfolio.buying_value * (portfolio.coupon_rate / 100);

        // }
        // setTotalInterest(
        //     CalculateInterestForPortfolio(
        //         portfolio.portfolio_type,
        //         portfolio.interest_type,
        //         portfolio.interest_rate,
        //         portfolio.portfolio_amount,
        //         portfolio.portfolio_term,
        //         portfolio.payment_frequency,
        //         portfolio.payment_amount,
        //         portfolio.compounding_frequency
        //     )
        // );

        // setTotalPrincipal(
        //     CalculatePrincipalForPortfolio(
        //         portfolio.portfolio_type,
        //         portfolio.portfolio_amount,
        //         portfolio.portfolio_term,
        //         portfolio.payment_frequency,
        //         portfolio.payment_amount
        //     )
        // );
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
                            Add Portfolio
                        </>
                    )}
                    {action === 'Edit' && (
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
                            name="portfolio_location"
                            value={portfolio.portfolio_location}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.portfolio_location}
                            helperText={errors.portfolio_location}
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
                            InputLabelProps={{ shrink: true }}
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
                    <Grid item size={6}>
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
                    <Grid item size={6}>
                        <TextField
                            variant="standard"
                            label="Coupon Rate (%)"
                            name="coupon_rate"
                            value={portfolio.coupon_rate}
                            onChange={handleChange}
                            fullWidth
                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                            error={!!errors.coupon_rate}
                            helperText={errors.coupon_rate}
                            disabled={portfolio.portfolio_type !== 'Bonds'}
                        />
                    </Grid>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%', display: 'flex', justifyContent: 'center' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <Typography
                                    variant="body2"
                                    onClick={() => handleModalOpen(true)}
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
                                        <AssetPortfolioDetails portfolio={portfolio} />
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

                    <Box sx={{ p: 2, border: '2px solid lightgray', borderRadius: 4., width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
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
                                        >
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                                            <MenuItem value="Semi-Annually">Semi-Annually</MenuItem>
                                            <MenuItem value="Annually">Annually</MenuItem>
                                        </TextField>
                                    </Grid>
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
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.dividend_rate}
                                            helperText={errors.dividend_rate}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label="Dividend Amount"
                                            name="dividend_amount"
                                            value={portfolio.dividend_amount}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.dividend_amount}
                                            helperText={errors.dividend_amount}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ p: 1, border: '2px solid lightgray', borderRadius: 4, width: '100%' }} >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {((action === 'Edit') || (action === 'Add')) && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={portfolio.is_plan_to_sell}
                                                onChange={handleChange}
                                                name="is_plan_to_sell"
                                            />}
                                        label="I plan to sell this portfolio in the future"
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
                                            label={action === 'Sell' ? "Sale Date" : "Tentative Sale Date"}
                                            name="selling_date"
                                            type="date"
                                            value={portfolio.selling_date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.selling_date}
                                            helperText={errors.selling_date}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            variant="standard"
                                            label={action === 'Sell' ? "Sale Amount" : "Tentative Sale Amount"}
                                            name="selling_value"
                                            value={portfolio.selling_value}
                                            onChange={handleChange}
                                            fullWidth
                                            slotsProps={{ htmlInput: { inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' } }}
                                            error={!!errors.selling_value}
                                            helperText={errors.selling_value}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    {/* <Grid item size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderRadius: 3, bgcolor: 'lightgray' }}>
                            <Grid container spacing={2}>
                                <Grid item size={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <IconButton>
                                        <img src="/money.png" alt="money" style={{ width: 72, height: 72 }} />
                                    </IconButton>
                                </Grid>
                                <Grid item size={10} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        You will have invested a total amount of: <strong>{portfolio.currency} {FormatCurrency(portfolio.currency, parseFloat(totalPrincipal))} </strong>
                                        that is expected to generate an interest of: <strong style={{ color: 'blue' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, totalInterest)}</strong>
                                    </Typography>
                                    <Typography variant="body1" component="h2" gutterBottom>
                                        You will have a total of: <strong style={{ color: 'brown' }}>{portfolio.currency} {FormatCurrency(portfolio.currency, (parseFloat(totalPrincipal) + parseFloat(totalInterest)))} </strong>
                                        at the end of the portfolio term
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid> */}
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

export default AssetPortfolioForm;