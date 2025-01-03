import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../common/GridHeader.css';
import AssetIncomeForm from './AssetIncomeForm';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';

export const filterIncomes = (listAction, incomesList, includePastIncomes) => {
    let filteredIncomes = [];
    const today = new Date();
    if (listAction === 'Asset' && !includePastIncomes) {
        filteredIncomes = incomesList.filter(income => !income.is_dream && (!income.end_date || new Date(income.end_date) >= today));
    } else if (listAction === 'Asset' && includePastIncomes) {
        filteredIncomes = incomesList.filter(income => !income.is_dream);
    } else if (listAction === 'Dream' && includePastIncomes) {
        filteredIncomes = incomesList.filter(income => income.is_dream);
    } else if (listAction === 'Dream' && !includePastIncomes) {
        // filteredIncomes = incomesList.filter(income => income.is_dream && (new Date(income.start_date) > today));
        filteredIncomes = incomesList.filter(income => income.is_dream);
    } else
        filteredIncomes = incomesList;

    return filteredIncomes;
};

const AssetIncomeList = forwardRef((props, ref) => {
    const { onIncomesFetched, listAction, incomesList} = props; // Destructure the new prop

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

    useEffect(() => {
        const filteredIncomes = filterIncomes(listAction, incomesList, includePastIncomes);
        setIncomes(filteredIncomes);
        setIncomesFetched(true); // Set incomesFetched to true after fetching

        if (onIncomesFetched) {
            onIncomesFetched(filteredIncomes.length); // Notify parent component
        }
    }, []);

    useEffect(() => {
        const filteredIncomes = filterIncomes(listAction, incomesList, includePastIncomes); // Filter incomes when includePastIncomes changes
        setIncomes(filteredIncomes);
        setIncomesFetched(true); // Set incomesFetched to true after fetching

        if (onIncomesFetched) {
            onIncomesFetched(filteredIncomes.length); // Notify parent component
        } 
    }, [includePastIncomes]); // Include Past Incomes to income/grid array

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

            // delete from incomesList as well
            incomesList.splice(incomesList.findIndex(p => p.id === incomeToDelete.id), 1);

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
            listAction === 'Dream' ? setAction('EditDream') : setAction(actionType);
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

            // also update incomesList to add or update the income in the list
            const incomeIndex = incomesList.findIndex(p => p.id === updatedIncome.id);
            if (incomeIndex > -1) {
                incomesList[incomeIndex] = updatedIncome;
            } else {
                incomesList.push(updatedIncome);
            }

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

        // also update incomesList to add or update the income in the list
        const incomeIndex = incomesList.findIndex(p => p.id === updatedIncome.id);
        if (incomeIndex > -1) {
            incomesList[incomeIndex] = updatedIncome;
        } else {
            incomesList.push(updatedIncome);
        }

        setSuccessMessage(successMsg);
    };

    const columns = [
        {
            field: 'income_name',
            headerName: 'Income Name',
            width: 150,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
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
                    <a onClick={() => handleAction(params.row, 'Delete')} style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', color: theme.palette.primary.main }}>Delete</a>  
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
                sortModel={sortingModel} // Add sorting model prop
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