import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import ApartmentIcon from '@mui/icons-material/Apartment'; // HDB icon
import CondoIcon from '@mui/icons-material/Domain'; // Condo icon
import HouseIcon from '@mui/icons-material/House'; // Landed icon
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import './AssetPropertyList.css';
import CountryList from '../common/CountryList';
import AssetPropertyForm from './AssetPropertyForm';


const AssetPropertyList = forwardRef((props, ref) => {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [properties, setProperties] = useState([]);
    //const [gridKey, setGridKey] = useState(0); // Add a state for the grid key
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
            const response = await axios.get(`/api/asset_properties?user_id=${currentUserId}`);
            setProperties(response.data);
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
            await axios.delete(`/api/asset_properties/${propertyToDelete.id}`);
            setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyToDelete.id));
            handleDeleteDialogClose();
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
                    // Update existing property
                    const newProperties = [...prevProperties];
                    newProperties[propertyIndex] = updatedProperty;
                    return newProperties;
                } else {
                    // Add new property
                    return [...prevProperties, updatedProperty];
                }
            });
            setSuccessMessage(successMsg);
        }
    }));

    const refreshPropertyList = (updatedProperty, successMsg) => {
        setProperties(prevProperties => {
            const propertyIndex = prevProperties.findIndex(p => p.id === updatedProperty.id);
            if (propertyIndex > -1) {
                // Update existing property
                const newProperties = [...prevProperties];
                newProperties[propertyIndex] = updatedProperty;
                return newProperties;
            } else {
                // Add new property
                return [...prevProperties, updatedProperty];
            }
        });
        //setGridKey(prevKey => prevKey + 1); // Update the grid key to force re-render
        setSuccessMessage(successMsg);
    };

    const getPropertyIcon = (propertyType) => {
        switch (propertyType) {
            case 'HDB':
                return <ApartmentIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Condominium':
                return <CondoIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Landed':
                return <HouseIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Commercial':
                return <BusinessIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Land':
                return <TerrainIcon style={{ color: 'black', marginRight: '10px' }} />;
            default:
                return <HomeIcon style={{ color: 'black', marginRight: '10px' }} />;
        }
    };

    const columns = [
        { field: 'property_name', headerName: 'Property Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'property_type', headerName: 'Property Type', width: 130, headerClassName: 'header-theme', renderCell: (params) => (
            <div>
                {getPropertyIcon(params.value)}
                {params.value}
            </div>
        )},
        { field: 'property_location', headerName: 'Property Location', width: 135, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'purchase_date', headerName: 'Purchase Date', width: 125, headerClassName: 'header-theme' },
        { field: 'purchase_price', headerName: 'Purchase Price', width: 125, headerClassName: 'header-theme' },
        { field: 'is_under_loan', headerName: 'Loan?', width: 75, headerClassName: 'header-theme', type: 'boolean' },
        { field: 'loan_amount', headerName: 'Loan Amount', width: 130, headerClassName: 'header-theme' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                <div>
                    <a onClick={() => handleAction(params.row, 'Sell')} style={{ textDecoration: 'underline', fontWeight: 'bold', marginRight: 10, cursor: 'pointer', color: theme.palette.primary.main }}>Sell</a>
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
                    {selectedProperty && <AssetPropertyForm property={selectedProperty} action={action} onClose={handleFormModalClose} refreshPropertyList={refreshPropertyList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the property "{propertyToDelete?.property_name}"?
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

export default AssetPropertyList;