import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../common/GridHeader.css';
import DreamForm from './DreamForm';
import CountryList from '../common/CountryList';
import { FormatCurrency } from '../common/FormatCurrency';

export const fetchDreams = (dreamsList) => {
    try {
        // filter by either end date in the future or start date in the future
        const today = new Date();
        const filteredActiveDreams = dreamsList.filter(dream => {
            if (!dream.end_date && new Date(dream.dream_date) >= today) return true;
            else if (dream.end_date && new Date(dream.end_date) >= today) return true;
            else return false;
        });

        return filteredActiveDreams;

    } catch (error) {
        console.error('Error fetching dreams');
    }
};

const DreamList = forwardRef((props, ref) => {
    const { onDreamsFetched, dreamType, dreamsList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [dreams, setDreams] = useState([]);
    const [dreamsFetched, setDreamsFetched] = useState(false); // State to track if dreams are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedDream, setSelectedDream] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [dreamToDelete, setDreamToDelete] = useState(null); // State for dream to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'dream_name', sort: 'asc' }]); // Initialize with default sorting

    useEffect(() => {
        const filteredActiveDreams = fetchDreams(dreamsList);

        setDreams(filteredActiveDreams);
        setDreamsFetched(true);
        if (onDreamsFetched) {
            onDreamsFetched(filteredActiveDreams.length);
        }
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedDream(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDreamToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/dreams/${dreamToDelete.id}`);
            setDreams(prevDreams => prevDreams.filter(p => p.id !== dreamToDelete.id));
            onDreamsFetched(dreams.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage(dreamType + ' deleted successfully');
        } catch (error) {
            console.error('Error deleting dream :', error);
        }
    };

    const handleAction = (dream, actionType) => {
        if (actionType === 'Delete') {
            setDreamToDelete(dream);
            setDeleteDialogOpen(true);
        } else {
            setSelectedDream(dream);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshDreamList(updatedDream, successMsg) {
            setDreams((prevDreams) => {
                const dreamIndex = prevDreams.findIndex(p => p.id === updatedDream.id);
                if (dreamIndex > -1) {
                    const newDreams = [...prevDreams];
                    newDreams[dreamIndex] = updatedDream;
                    onDreamsFetched(newDreams.length);
                    return newDreams;
                } else {
                    const newDreams = [...prevDreams, updatedDream];
                    onDreamsFetched(newDreams.length);
                    return newDreams;
                }
            });
            setSuccessMessage(successMsg);
        },
        getDreamCount() {
            return dreamsFetched ? dreams.length : 0;
        }
    }));

    const refreshDreamList = (updatedDream, successMsg) => {
        setDreams(prevDreams => {
            const dreamIndex = prevDreams.findIndex(p => p.id === updatedDream.id);
            if (dreamIndex > -1) {
                // Update existing dream
                const newDreams = [...prevDreams];
                newDreams[dreamIndex] = updatedDream;
                onDreamsFetched(dreams.length); // Notify parent component
                return newDreams;
            } else {
                // Add new dream
                return [...prevDreams, updatedDream];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'dream_name', headerName: 'Dream Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'location', headerName: 'Dream Location', width: 150, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'dream_date', headerName: ' Date', width: 150, headerClassName: 'header-theme' },
        { field: 'amount', headerName: 'Amount', width: 125, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.amount);
         }},
        { field: 'is_funded_by_loan', headerName: 'Loan?', width: 75, headerClassName: 'header-theme', type: 'boolean' },
        { field: 'loan_amount', headerName: 'Loan Amount', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.loan_amount);
         }},
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
                rows={dreams}
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
                    {selectedDream && <DreamForm dream={selectedDream} action={action} onClose={handleFormModalClose} refreshDreamList={refreshDreamList} dreamType={dreamType} />} {/* Pass action to form */}
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
                        Are you sure you want to delete the  for the dream: "{dreamToDelete?.dream_name}"?
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

export default DreamList;