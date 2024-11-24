import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import ExpenseHomeForm from './ExpenseHomeForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const ExpenseHomeList = forwardRef((props, ref) => {
    const { onHomesFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [homes, setHomes] = useState([]);
    const [homesFetched, setHomesFetched] = useState(false); // State to track if homes are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedHome, setSelectedHome] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [homeToDelete, setHomeToDelete] = useState(null); // State for home to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'home_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastHomes, setIncludePastHomes] = useState(false); // State for switch
    const [originalHomes, setOriginalHomes] = useState([]); // State to store original homes

    const fetchHomes = async () => {
        try {
            const response = await axios.get(`/api/expense_homes?user_id=${currentUserId}`);
            setOriginalHomes(response.data); // Save the original homes
            filterHomes(response.data); // Filter homes based on the switch state
        } catch (error) {
            console.error('Error fetching homes:', error);
        }
    };

    const filterHomes = (homesList) => {
        let filteredHomes = [];
        if (!includePastHomes)
            // filter where end_date is null or greater than today
            filteredHomes = homesList.filter(home => {
                if (home.end_date) {
                    return new Date(home.end_date) >= new Date();
                } else {
                    return true;
                }
            });
        else
            filteredHomes = homesList;

        setHomes(filteredHomes);
        setHomesFetched(true); // Set homesFetched to true after filtering
        if (onHomesFetched) {
            onHomesFetched(filteredHomes.length); // Notify parent component
        }
    };

    useEffect(() => {
        fetchHomes();
    }, [currentUserId]);

    useEffect(() => {
        filterHomes(originalHomes); // Filter homes when includePastHomes changes
    }, [includePastHomes]); // Include Past Homes to home/grid array

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedHome(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setHomeToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/expense_homes/${homeToDelete.id}`);
            setHomes(prevHomes => prevHomes.filter(p => p.id !== homeToDelete.id));
            onHomesFetched(homes.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Home deleted successfully');
        } catch (error) {
            console.error('Error deleting home:', error);
        }
    };

    const handleAction = (home, actionType) => {
        if (actionType === 'Delete') {
            setHomeToDelete(home);
            setDeleteDialogOpen(true);
        } else {
            setSelectedHome(home);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshHomeList(updatedHome, successMsg) {
            setHomes((prevHomes) => {
                const homeIndex = prevHomes.findIndex(p => p.id === updatedHome.id);
                if (homeIndex > -1) {
                    const newHomes = [...prevHomes];
                    newHomes[homeIndex] = updatedHome;
                    onHomesFetched(homes.length); // Notify parent component
                    return newHomes;
                } else {
                    return [...prevHomes, updatedHome];
                }
            });
            setSuccessMessage(successMsg);
        },
        getHomeCount() {
            return homesFetched ? homes.length : 0; // Return count only if homes are fetched
        }
    }));

    const refreshHomeList = (updatedHome, successMsg) => {
        setHomes(prevHomes => {
            const homeIndex = prevHomes.findIndex(p => p.id === updatedHome.id);
            if (homeIndex > -1) {
                // Update existing home
                const newHomes = [...prevHomes];
                newHomes[homeIndex] = updatedHome;
                onHomesFetched(homes.length); // Notify parent component
                return newHomes;
            } else {
                // Add new home
                return [...prevHomes, updatedHome];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'home_name', headerName: 'Home Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'location', headerName: 'Home Location', width: 150, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 150, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 150, headerClassName: 'header-theme' },
        { field: 'total_expense', headerName: 'Total Expense (/mth)', width: 175, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.total_expense);
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <FormControlLabel
                    control={<Switch checked={includePastHomes} onChange={() => setIncludePastHomes(!includePastHomes)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Home Expenses</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={homes}
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
                    {selectedHome && <ExpenseHomeForm home={selectedHome} action={action} onClose={handleFormModalClose} refreshHomeList={refreshHomeList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the expense for the home: "{homeToDelete?.home_name}"?
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

export default ExpenseHomeList;