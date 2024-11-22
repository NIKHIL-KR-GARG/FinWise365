import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import ExpensePropertyForm from './ExpensePropertyForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const ExpensePropertyList = forwardRef((props, ref) => {
    const { onPropertiesFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [properties, setProperties] = useState([]);
    const [propertiesFetched, setPropertiesFetched] = useState(false); // State to track if properties are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [propertyToDelete, setPropertyToDelete] = useState(null); // State for property to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'property_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`/api/expense_properties?user_id=${currentUserId}`);

            // filter where end_date is null or greater than today
            const today = new Date();
            const filteredProperties = response.data.filter(property => {
                if (property.end_date) {
                    return new Date(property.end_date) >= today;
                } else {
                    return true;
                }
            });

            setProperties(filteredProperties);
            setPropertiesFetched(true); // Set propertiesFetched to true after fetching
            if (onPropertiesFetched) {
                onPropertiesFetched(filteredProperties.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedProperty(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/expense_properties/${propertyToDelete.id}`);
            setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyToDelete.id));
            onPropertiesFetched(properties.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const handleAction = (property, actionType) => {
        if (actionType === 'Delete') {
            setPropertyToDelete(property);
            setDeleteDialogOpen(true);
        } else {
            setSelectedProperty(property);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshPropertyList(updatedProperty, successMsg) {
            setProperties((prevProperties) => {
                const propertyIndex = prevProperties.findIndex(p => p.id === updatedProperty.id);
                if (propertyIndex > -1) {
                    const newProperties = [...prevProperties];
                    newProperties[propertyIndex] = updatedProperty;
                    onPropertiesFetched(properties.length); // Notify parent component
                    return newProperties;
                } else {
                    return [...prevProperties, updatedProperty];
                }
            });
            setSuccessMessage(successMsg);
        },
        getPropertyCount() {
            return propertiesFetched ? properties.length : 0; // Return count only if properties are fetched
        }
    }));

    const refreshPropertyList = (updatedProperty, successMsg) => {
        setProperties(prevProperties => {
            const propertyIndex = prevProperties.findIndex(p => p.id === updatedProperty.id);
            if (propertyIndex > -1) {
                // Update existing property
                const newProperties = [...prevProperties];
                newProperties[propertyIndex] = updatedProperty;
                onPropertiesFetched(properties.length); // Notify parent component
                return newProperties;
            } else {
                // Add new property
                return [...prevProperties, updatedProperty];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'property_name', headerName: 'Property Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'property_type', headerName: 'Property Type', width: 100, headerClassName: 'header-theme' },
        { field: 'location', headerName: 'Property Location', width: 150, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 100, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 100, headerClassName: 'header-theme' },
        { field: 'total_expense', headerName: 'Total Expense (/mth)', width: 150, headerClassName: 'header-theme' , renderCell: (params) => {
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
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={properties}
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
                    {selectedProperty && <ExpensePropertyForm property={selectedProperty} action={action} onClose={handleFormModalClose} refreshPropertyList={refreshPropertyList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the expense for the property: "{propertyToDelete?.property_name}"?
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

export default ExpensePropertyList;