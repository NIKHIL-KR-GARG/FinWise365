import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import ExpensePersonalLoanForm from './ExpensePersonalLoanForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const ExpensePersonalLoanList = forwardRef((props, ref) => {
    const { onPersonalLoansFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [personalloans, setPersonalLoans] = useState([]);
    const [personalloansFetched, setPersonalLoansFetched] = useState(false); // State to track if personalloans are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedPersonalLoan, setSelectedPersonalLoan] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [personalLoanToDelete, setPersonalLoanToDelete] = useState(null); // State for personalloan to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'card_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchPersonalLoans = async () => {
        try {
            const response = await axios.get(`/api/expense_personal_loans?user_id=${currentUserId}`);
            
            // filter where end_date is null or greater than today
            const today = new Date();
            const filteredPersonalLoans = response.data.filter(p => {
                if (p.end_date) {
                    return new Date(p.end_date) >= today;
                } else {
                    return true;
                }
            });
            setPersonalLoans(filteredPersonalLoans);
            
            setPersonalLoansFetched(true); // Set personalloansFetched to true after fetching
            if (onPersonalLoansFetched) {
                onPersonalLoansFetched(filteredPersonalLoans.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching personalloans:', error);
        }
    };

    useEffect(() => {
        fetchPersonalLoans();
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedPersonalLoan(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setPersonalLoanToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/expense_personal_loans/${personalLoanToDelete.id}`);
            setPersonalLoans(prevPersonalLoans => prevPersonalLoans.filter(p => p.id !== personalLoanToDelete.id));
            onPersonalLoansFetched(personalloans.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Personal Loan Debt deleted successfully');
        } catch (error) {
            console.error('Error deleting personal loan debt:', error);
        }
    };

    const handleAction = (personalloan, actionType) => {
        if (actionType === 'Delete') {
            setPersonalLoanToDelete(personalloan);
            setDeleteDialogOpen(true);
        } else {
            setSelectedPersonalLoan(personalloan);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshPersonalLoanList(updatedPersonalLoan, successMsg) {
            setPersonalLoans((prevPersonalLoans) => {
                const personalloanIndex = prevPersonalLoans.findIndex(p => p.id === updatedPersonalLoan.id);
                if (personalloanIndex > -1) {
                    const newPersonalLoans = [...prevPersonalLoans];
                    newPersonalLoans[personalloanIndex] = updatedPersonalLoan;
                    onPersonalLoansFetched(personalloans.length); // Notify parent component
                    return newPersonalLoans;
                } else {
                    return [...prevPersonalLoans, updatedPersonalLoan];
                }
            });
            setSuccessMessage(successMsg);
        },
        getPersonalLoanCount() {
            return personalloansFetched ? personalloans.length : 0; // Return count only if personalloans are fetched
        }
    }));

    const refreshPersonalLoanList = (updatedPersonalLoan, successMsg) => {
        setPersonalLoans(prevPersonalLoans => {
            const personalloanIndex = prevPersonalLoans.findIndex(p => p.id === updatedPersonalLoan.id);
            if (personalloanIndex > -1) {
                // Update existing personalloan
                const newPersonalLoans = [...prevPersonalLoans];
                newPersonalLoans[personalloanIndex] = updatedPersonalLoan;
                onPersonalLoansFetched(personalloans.length); // Notify parent component
                return newPersonalLoans;
            } else {
                // Add new personalloan
                return [...prevPersonalLoans, updatedPersonalLoan];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'loan_name', headerName: 'Loan Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
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
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={personalloans}
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
                    {selectedPersonalLoan && <ExpensePersonalLoanForm personalloan={selectedPersonalLoan} action={action} onClose={handleFormModalClose} refreshPersonalLoanList={refreshPersonalLoanList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the personal loan debt: "{personalLoanToDelete?.card_name}"?
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

export default ExpensePersonalLoanList;