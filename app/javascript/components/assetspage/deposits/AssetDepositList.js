import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetDepositForm from './AssetDepositForm';
import CountryList from '../../common/CountryList';

const AssetDepositList = forwardRef((props, ref) => {
    const { onDepositsFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [deposits, setDeposits] = useState([]);
    const [depositsFetched, setDepositsFetched] = useState(false); // State to track if deposits are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [depositToDelete, setDepositToDelete] = useState(null); // State for deposit to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'deposit_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchDeposits = async () => {
        try {
            const response = await axios.get(`/api/asset_deposits?user_id=${currentUserId}`);
            setDeposits(response.data);
            setDepositsFetched(true); // Set depositsFetched to true after fetching
            if (onDepositsFetched) {
                onDepositsFetched(response.data.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching deposits:', error);
        }
    };

    useEffect(() => {
        fetchDeposits();
        
    }, [currentUserId]);

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
            setAction(actionType);
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
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'deposit_name', headerName: 'Deposit Name', width: 150, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'institution_name', headerName: 'Institution', width: 150, headerClassName: 'header-theme' },
        { field: 'deposit_type', headerName: 'Type', width: 125, headerClassName: 'header-theme' },
        { field: 'deposit_location', headerName: 'Location', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'opening_date', headerName: 'Opening Date', width: 115, headerClassName: 'header-theme' },
        { field: 'deposit_amount', headerName: 'Amount', width: 100, headerClassName: 'header-theme' },
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
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={deposits}
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
                <Box sx={{ width: 650, height: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative' }}>
                    {selectedDeposit && <AssetDepositForm deposit={selectedDeposit} action={action} onClose={handleFormModalClose} refreshDepositList={refreshDepositList}/>} {/* Pass action to form */}
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