import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetIncomeForm from './AssetIncomeForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';
import { portfolioAssetValue } from '../../calculators/Assets';

const AssetIncomeList = forwardRef((props, ref) => {
    const { onIncomesFetched, incomesList, propertiesList, vehiclesList, portfoliosList, otherAssetsList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [incomes, setIncomes] = useState([]);
    const [incomesFetched, setIncomesFetched] = useState(false); // State to track if incomes are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [incomeToDelete, setIncomeToDelete] = useState(null); // State for income to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastIncomes, setIncludePastIncomes] = useState(false); // State for switch to include past incomes

    const filterIncomes = (incomesList, propertiesList, vehiclesList, portfoliosList, otherAssetsList) => {
        let filteredIncomes = [];
        if (!includePastIncomes)
            // filter on income where end_date is greater than today
            filteredIncomes = incomesList.filter(income => !income.end_date || new Date(income.end_date) >= new Date());
        else
            filteredIncomes = incomesList;

        // add rental as income as well
        const today = new Date();
        const rentalIncomes = propertiesList
            .filter(property => property.is_on_rent && (new Date(property.rental_start_date) <= today) && (!property.rental_end_date || new Date(property.rental_end_date) >= today))
            .map(property => ({
                id: `rental-${property.id}`,
                income_name: `Rental Income - ${property.property_name}`,
                income_type: 'Rental',
                location: property.location,
                currency: property.currency,
                amount: property.rental_amount,
                start_date: property.rental_start_date,
                end_date: property.rental_end_date,
                is_recurring: true,
                income_frequency: 'Monthly'
            }));

        // add dividend as income as well
        const dividends = portfoliosList
            .filter(portfolio => portfolio.is_paying_dividend && (new Date(portfolio.buying_date) <= today) && (!portfolio.sale_date || new Date(portfolio.sale_date) >= today))
            .map(portfolio => ({
                id: `dividend-${portfolio.id}`,
                income_name: `Dividend - ${portfolio.portfolio_name}`,
                income_type: 'Dividend',
                location: portfolio.location,
                currency: portfolio.currency,
                // amount: portfolio.dividend_amount,
                amount: calculateDividendAmount(parseFloat(portfolioAssetValue(portfolio, new Date(), portfolio.currency)), portfolio.dividend_frequency, portfolio.dividend_rate),
                start_date: portfolio.buying_date,
                end_date: portfolio.sale_date,
                is_recurring: true,
                income_frequency: portfolio.dividend_frequency
            }));

        // add coupon as income as well
        const coupons = portfoliosList
            .filter(portfolio => portfolio.portfolio_type === 'Bonds' && (new Date(portfolio.buying_date) <= today) && (!portfolio.sale_date || new Date(portfolio.sale_date) >= today))
            .map(portfolio => {
                let amount;
                switch (portfolio.coupon_frequency) {
                    case 'Monthly':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 12;
                        break;
                    case 'Quarterly':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 4;
                        break;
                    case 'Semi-Annually':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 2;
                        break;
                    case 'Annually':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100;
                        break;
                    default:
                        amount = 0;
                }
                return {
                    id: `coupon-${portfolio.id}`,
                    income_name: `Coupon - ${portfolio.portfolio_name}`,
                    income_type: 'Coupon',
                    location: portfolio.location,
                    currency: portfolio.currency,
                    amount: amount,
                    start_date: portfolio.buying_date,
                    end_date: portfolio.sale_date,
                    is_recurring: true,
                    income_frequency: portfolio.coupon_frequency
                };
            });

        // add payout as income as well
        const payouts = otherAssetsList
            .filter(otherAsset => {
                const payoutDate = new Date(otherAsset.payout_date);
                const payoutDuration = otherAsset.payout_duration ? parseInt(otherAsset.payout_duration) : 0;
                const payoutEndDate = new Date(payoutDate.setMonth(payoutDate.getMonth() + payoutDuration));
                return payoutEndDate > today;
            })
            .map(otherAsset => ({
                id: `payout-${otherAsset.id}`,
                income_name: `PayOut - ${otherAsset.asset_name}`,
                income_type: 'PayOut',
                location: otherAsset.location,
                currency: otherAsset.currency,
                amount: otherAsset.payout_value,
                start_date: otherAsset.payout_date,
                end_date: `${
                    //set end date to payout_date + payout_duration (months)
                    otherAsset.payout_type === 'Recurring' ? new Date(new Date(otherAsset.payout_date).setMonth(new Date(otherAsset.payout_date).getMonth() + parseInt(otherAsset.payout_duration))) : new Date(otherAsset.payout_date)
                    }`,
                is_recurring: `${otherAsset.payout_type === 'Recurring'}`,
                income_frequency: otherAsset.payout_frequency
            }));

        // add lease as income as well
        const leases = vehiclesList
            .filter(vehicle => vehicle.is_on_lease && (new Date(vehicle.lease_start_date) <= today) && (!vehicle.lease_end_date || new Date(vehicle.lease_end_date) >= today))
            .map(vehicle => ({
                id: `lease-${vehicle.id}`,
                income_name: `Lease - ${vehicle.vehicle_name}`,
                income_type: 'Lease',
                location: vehicle.location,
                currency: vehicle.currency,
                amount: vehicle.lease_amount,
                start_date: vehicle.lease_start_date,
                end_date: vehicle.lease_end_date,
                is_recurring: true,
                income_frequency: 'Monthly'
            }));

        setIncomes([...filteredIncomes, ...rentalIncomes, ...leases ,...dividends, ...coupons, ...payouts]);
        setIncomesFetched(true); // Set incomesFetched to true after fetching

        if (onIncomesFetched) {
            onIncomesFetched(filteredIncomes.length + rentalIncomes.length + leases.length + dividends.length + coupons.length + payouts.length); // Notify parent component
        }
    };

    useEffect(() => {
        filterIncomes(incomesList, propertiesList, vehiclesList, portfoliosList, otherAssetsList);
    }, []);

    useEffect(() => {
        filterIncomes(incomesList, propertiesList, vehiclesList, portfoliosList, otherAssetsList); // Filter incomes when includePastIncomes changes
    }, [includePastIncomes]); // Include Past Incomes to income/grid array

    const calculateDividendAmount = (value, frequency, rate) => {
        let dividendAmount = value * (rate / 100);
        if (frequency === 'Monthly') dividendAmount = dividendAmount / 12;
        else if (frequency === 'Quarterly') dividendAmount = dividendAmount / 4;
        else if (frequency === 'Semi-Annually') dividendAmount = dividendAmount / 2;
        return parseFloat(dividendAmount).toFixed(2);
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedIncome(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setIncomeToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/asset_incomes/${incomeToDelete.id}`);
            setIncomes(prevIncomes => prevIncomes.filter(p => p.id !== incomeToDelete.id));
            onIncomesFetched(incomes.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Income deleted successfully');
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    const handleAction = (income, actionType) => {
        if (actionType === 'Delete') {
            setIncomeToDelete(income);
            setDeleteDialogOpen(true);
        } else {
            setSelectedIncome(income);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshIncomeList(updatedIncome, successMsg) {
            setIncomes((prevIncomes) => {
                const incomeIndex = prevIncomes.findIndex(p => p.id === updatedIncome.id);
                if (incomeIndex > -1) {
                    const newIncomes = [...prevIncomes];
                    newIncomes[incomeIndex] = updatedIncome;
                    onIncomesFetched(incomes.length); // Notify parent component
                    return newIncomes;
                } else {
                    return [...prevIncomes, updatedIncome];
                }
            });
            setSuccessMessage(successMsg);
        },
        getIncomeCount() {
            return incomesFetched ? incomes.length : 0; // Return count only if incomes are fetched
        }
    }));

    const refreshIncomeList = (updatedIncome, successMsg) => {
        setIncomes(prevIncomes => {
            const incomeIndex = prevIncomes.findIndex(p => p.id === updatedIncome.id);
            if (incomeIndex > -1) {
                // Update existing income
                const newIncomes = [...prevIncomes];
                newIncomes[incomeIndex] = updatedIncome;
                onIncomesFetched(incomes.length); // Notify parent component
                return newIncomes;
            } else {
                // Add new income
                return [...prevIncomes, updatedIncome];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        {
            field: 'income_name',
            headerName: 'Income Name',
            width: 150,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                params.row.income_type !== 'Rental'
                    && params.row.income_type !== 'Dividend'
                    && params.row.income_type !== 'Coupon' 
                    && params.row.income_type !== 'PayOut' 
                    && params.row.income_type !== 'Lease' ? (
                    <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                        {params.value}
                    </a>
                ) : (
                    <span>{params.value}</span>
                )
            )
        },
        { field: 'income_type', headerName: 'Income Type', width: 100, headerClassName: 'header-theme' },
        {
            field: 'location', headerName: 'Income Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        {
            field: 'amount', headerName: 'Income Amount', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.amount);
            }
        },
        { field: 'start_date', headerName: 'Start Date', width: 100, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 100, headerClassName: 'header-theme' },
        { field: 'is_recurring', headerName: 'Recurring', width: 90, headerClassName: 'header-theme', type: 'boolean' },
        { field: 'income_frequency', headerName: 'Frequency', width: 100, headerClassName: 'header-theme'},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 75,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                <div>
                    {params.row.income_type !== 'Rental'
                        && params.row.income_type !== 'Dividend'
                        && params.row.income_type !== 'Coupon' 
                        && params.row.income_type !== 'PayOut' 
                        && params.row.income_type !== 'Lease' && (
                            <a onClick={() => handleAction(params.row, 'Delete')} style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', color: theme.palette.primary.main }}>Delete</a>
                        )}
                </div>
            ),
        },
    ];

    return (
        <>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <FormControlLabel
                    control={<Switch checked={includePastIncomes} onChange={() => setIncludePastIncomes(!includePastIncomes)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Incomes</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={incomes}
                columns={columns}
                sortingModel={sortingModel} // Add sorting model prop
                onSortModelChange={(model) => setSortingModel(model)} // Update sorting model on change
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                sx={{
                    height: 375, // Adjust this value to fit exactly for 5 rows
                    width: '100%',
                    border: '2px solid #000',
                }}
            />
            <Modal
                name="edit-form-modal"
                open={formModalOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleFormModalClose();
                    }
                }}
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
                    {selectedIncome && <AssetIncomeForm income={selectedIncome} action={action} onClose={handleFormModalClose} refreshIncomeList={refreshIncomeList} />} {/* Pass action to form */}
                    <IconButton
                        onClick={handleFormModalClose}
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
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the income "{incomeToDelete?.income_name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

export default AssetIncomeList;