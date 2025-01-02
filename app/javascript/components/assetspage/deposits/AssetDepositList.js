import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetDepositForm from './AssetDepositForm';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

export  const filterDeposits = (listAction, depositsList, includePastDeposits) => {
    let filteredDeposits = [];
    const today = new Date();
    if (listAction === 'Asset' && !includePastDeposits) {
        filteredDeposits = depositsList.filter(deposit => !deposit.is_dream && (!deposit.end_date || new Date(deposit.end_date) >= today));
    } else if (listAction === 'Asset' && includePastDeposits) {
        filteredDeposits = depositsList.filter(deposit => !deposit.is_dream);
    } else if (listAction === 'Dream' && includePastDeposits) {
        filteredDeposits = depositsList.filter(deposit => deposit.is_dream);
    } else if (listAction === 'Dream' && !includePastDeposits) {
        filteredDeposits = depositsList.filter(deposit => deposit.is_dream && (new Date(deposit.opening_date) > today));
    } else
        filteredDeposits = depositsList;

    return filteredDeposits;
};

const AssetDepositList = forwardRef((props, ref) => {
    const { onDepositsFetched, listAction, depositsList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [deposits, setDeposits] = useState([]);
    const [depositsFetched, setDepositsFetched] = useState(false); // State to track if deposits are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [depositToDelete, setDepositToDelete] = useState(null); // State for deposit to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'deposit_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastDeposits, setIncludePastDeposits] = useState(false); // State for switch

    useEffect(() => {
        const filteredDeposits = filterDeposits(listAction, depositsList, includePastDeposits);

        setDeposits(filteredDeposits);
        setDepositsFetched(true); // Set depositsFetched to true after filtering
        if (onDepositsFetched) {
            onDepositsFetched(filteredDeposits.length); // Notify parent component
        }

    }, []);

    useEffect(() => {
        const filteredDeposits = filterDeposits(listAction, depositsList, includePastDeposits); // Filter deposits when includePastDeposits changes

        setDeposits(filteredDeposits);
        setDepositsFetched(true); // Set depositsFetched to true after filtering
        if (onDepositsFetched) {
            onDepositsFetched(filteredDeposits.length); // Notify parent component
        }

    }, [includePastDeposits]); // Include Past Deposits to deposit/grid array

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedDeposit(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDepositToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/asset_deposits/${depositToDelete.id}`);
            setDeposits(prevDeposits => prevDeposits.filter(p => p.id !== depositToDelete.id));

            // also delete from depositsList
            depositsList.splice(depositsList.findIndex(p => p.id === depositToDelete.id), 1);

            onDepositsFetched(deposits.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Deposit deleted successfully');
        } catch (error) {
            console.error('Error deleting deposit:', error);
        }
    };

    const handleAction = (deposit, actionType) => {
        if (actionType === 'Delete') {
            setDepositToDelete(deposit);
            setDeleteDialogOpen(true);
        } else {
            setSelectedDeposit(deposit);
            listAction === 'Dream' ? setAction('EditDream') : setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshDepositList(updatedDeposit, successMsg) {
            setDeposits((prevDeposits) => {
                const depositIndex = prevDeposits.findIndex(p => p.id === updatedDeposit.id);
                if (depositIndex > -1) {
                    const newDeposits = [...prevDeposits];
                    newDeposits[depositIndex] = updatedDeposit;
                    onDepositsFetched(deposits.length); // Notify parent component
                    return newDeposits;
                } else {
                    return [...prevDeposits, updatedDeposit];
                }
            });

            // also update depositsList to add or update the deposit in the list
            const depositIndex = depositsList.findIndex(p => p.id === updatedDeposit.id);
            if (depositIndex > -1) {
                depositsList[depositIndex] = updatedDeposit;
            } else {
                depositsList.push(updatedDeposit);
            }

            setSuccessMessage(successMsg);
        },
        getDepositCount() {
            return depositsFetched ? deposits.length : 0; // Return count only if deposits are fetched
        }
    }));

    const refreshDepositList = (updatedDeposit, successMsg) => {
        setDeposits(prevDeposits => {
            const depositIndex = prevDeposits.findIndex(p => p.id === updatedDeposit.id);
            if (depositIndex > -1) {
                // Update existing deposit
                const newDeposits = [...prevDeposits];
                newDeposits[depositIndex] = updatedDeposit;
                onDepositsFetched(deposits.length); // Notify parent component
                return newDeposits;
            } else {
                // Add new deposit
                return [...prevDeposits, updatedDeposit];
            }
        });

        // also update depositsList to add or update the deposit in the list
        const depositIndex = depositsList.findIndex(p => p.id === updatedDeposit.id);
        if (depositIndex > -1) {
            depositsList[depositIndex] = updatedDeposit;
        } else {
            depositsList.push(updatedDeposit);
        }
        
        setSuccessMessage(successMsg);
    };

    const columns = [
        {
            field: 'deposit_name', headerName: 'Deposit Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
            )
        },
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
        { field: 'deposit_type', headerName: 'Type', width: 125, headerClassName: 'header-theme' },
        {
            field: 'location', headerName: 'Location', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'opening_date', headerName: 'Opening Date', width: 115, headerClassName: 'header-theme' },
        {
            field: 'amount', headerName: 'Amount', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.amount);
            }
        },
        { field: 'deposit_term', headerName: 'Term (months)', width: 100, headerClassName: 'header-theme' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
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
                    control={<Switch checked={includePastDeposits} onChange={() => setIncludePastDeposits(!includePastDeposits)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Deposits</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={deposits}
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
                    {selectedDeposit && <AssetDepositForm deposit={selectedDeposit} action={action} onClose={handleFormModalClose} refreshDepositList={refreshDepositList} />} {/* Pass action to form */}
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
                        Are you sure you want to delete the deposit "{depositToDelete?.deposit_name}"?
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

export default AssetDepositList;