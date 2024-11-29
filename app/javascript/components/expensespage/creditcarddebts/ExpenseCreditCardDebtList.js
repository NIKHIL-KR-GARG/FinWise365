import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import ExpenseCreditCardDebtForm from './ExpenseCreditCardDebtForm';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

const ExpenseCreditCardDebtList = forwardRef((props, ref) => {
    const { onCreditCardDebtsFetched, creditcarddebtsList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [creditcarddebts, setCreditCardDebts] = useState([]);
    const [creditcarddebtsFetched, setCreditCardDebtsFetched] = useState(false); // State to track if creditcarddebts are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedCreditCardDebt, setSelectedCreditCardDebt] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [creditCardDebtToDelete, setCreditCardDebtToDelete] = useState(null); // State for creditcarddebt to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'card_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastCreditCardDebts, setIncludePastCreditCardDebts] = useState(false); // State for switch

    const filterCreditCardDebts = (creditcarddebtsList) => {
        let filteredCreditCardDebts = [];
        if (!includePastCreditCardDebts)
            // filter where end_date is null or greater than today
            filteredCreditCardDebts = creditcarddebtsList.filter(creditcarddebt => {
                if (creditcarddebt.end_date) {
                    return new Date(creditcarddebt.end_date) >= new Date();
                } else {
                    return true;
                }
            });
        else
            filteredCreditCardDebts = creditcarddebtsList;

        setCreditCardDebts(filteredCreditCardDebts);
        setCreditCardDebtsFetched(true); // Set creditcarddebtsFetched to true after filtering
        if (onCreditCardDebtsFetched) {
            onCreditCardDebtsFetched(filteredCreditCardDebts.length); // Notify parent component
        }
    };

    useEffect(() => {
        filterCreditCardDebts(creditcarddebtsList);
    }, []);

    useEffect(() => {
        filterCreditCardDebts(creditcarddebtsList); // Filter creditcarddebts when includePastCreditCardDebts changes
    }, [includePastCreditCardDebts]); // Include Past CreditCardDebts to creditcarddebt/grid array

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedCreditCardDebt(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setCreditCardDebtToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/expense_credit_card_debts/${creditCardDebtToDelete.id}`);
            setCreditCardDebts(prevCreditCardDebts => prevCreditCardDebts.filter(p => p.id !== creditCardDebtToDelete.id));
            onCreditCardDebtsFetched(creditcarddebts.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Credit Card Debt deleted successfully');
        } catch (error) {
            console.error('Error deleting credit card debt:', error);
        }
    };

    const handleAction = (creditcarddebt, actionType) => {
        if (actionType === 'Delete') {
            setCreditCardDebtToDelete(creditcarddebt);
            setDeleteDialogOpen(true);
        } else {
            setSelectedCreditCardDebt(creditcarddebt);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshCreditCardDebtList(updatedCreditCardDebt, successMsg) {
            setCreditCardDebts((prevCreditCardDebts) => {
                const creditcarddebtIndex = prevCreditCardDebts.findIndex(p => p.id === updatedCreditCardDebt.id);
                if (creditcarddebtIndex > -1) {
                    const newCreditCardDebts = [...prevCreditCardDebts];
                    newCreditCardDebts[creditcarddebtIndex] = updatedCreditCardDebt;
                    onCreditCardDebtsFetched(creditcarddebts.length); // Notify parent component
                    return newCreditCardDebts;
                } else {
                    return [...prevCreditCardDebts, updatedCreditCardDebt];
                }
            });
            setSuccessMessage(successMsg);
        },
        getCreditCardDebtCount() {
            return creditcarddebtsFetched ? creditcarddebts.length : 0; // Return count only if creditcarddebts are fetched
        }
    }));

    const refreshCreditCardDebtList = (updatedCreditCardDebt, successMsg) => {
        setCreditCardDebts(prevCreditCardDebts => {
            const creditcarddebtIndex = prevCreditCardDebts.findIndex(p => p.id === updatedCreditCardDebt.id);
            if (creditcarddebtIndex > -1) {
                // Update existing creditcarddebt
                const newCreditCardDebts = [...prevCreditCardDebts];
                newCreditCardDebts[creditcarddebtIndex] = updatedCreditCardDebt;
                onCreditCardDebtsFetched(creditcarddebts.length); // Notify parent component
                return newCreditCardDebts;
            } else {
                // Add new creditcarddebt
                return [...prevCreditCardDebts, updatedCreditCardDebt];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'card_name', headerName: 'Card Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
        { field: 'debt_type', headerName: 'Debt Type', width: 100, headerClassName: 'header-theme' },
        { field: 'location', headerName: 'Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 115, headerClassName: 'header-theme' },
        { field: 'loan_amount', headerName: 'Loan Amount', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.debt_amount);
         }},
        { field: 'duration', headerName: 'Duration (months)', width: 100, headerClassName: 'header-theme' },
        { field: 'emi_amount', headerName: 'EMI', width: 75, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.emi_amount);
         }},
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
                    control={<Switch checked={includePastCreditCardDebts} onChange={() => setIncludePastCreditCardDebts(!includePastCreditCardDebts)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Credit Card Debts</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={creditcarddebts}
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
                    {selectedCreditCardDebt && <ExpenseCreditCardDebtForm creditcarddebt={selectedCreditCardDebt} action={action} onClose={handleFormModalClose} refreshCreditCardDebtList={refreshCreditCardDebtList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the credit card debt: "{creditCardDebtToDelete?.card_name}"?
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

export default ExpenseCreditCardDebtList;