import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material'; // Import Switch and FormControlLabel
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import TerrainIcon from '@mui/icons-material/Terrain';
import ApartmentIcon from '@mui/icons-material/Apartment'; // HDB icon
import CondoIcon from '@mui/icons-material/Domain'; // Condo icon
import HouseIcon from '@mui/icons-material/House'; // Landed icon
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import OtherIcon from '@mui/icons-material/Category'; // New icon for "Other" property type

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import AssetPropertyForm from './AssetPropertyForm';
import { FormatCurrency } from  '../../common/FormatCurrency';

export const filterAssetProperties = (listAction, propertiesList, includePastProperties) => {
    let filteredProperties = [];
    const today = new Date();
    if (listAction === 'Asset' && !includePastProperties) {
        filteredProperties = propertiesList.filter(property => !property.is_dream && (!property.is_plan_to_sell || new Date(property.sale_date) >= today));
    } else if (listAction === 'Asset' && includePastProperties) {
        filteredProperties = propertiesList.filter(property => !property.is_dream);
    } else if (listAction === 'Dream' && includePastProperties) {
        filteredProperties = propertiesList.filter(property => property.is_dream);
    } else if (listAction === 'Dream' && !includePastProperties) {
        filteredProperties = propertiesList.filter(property => property.is_dream && (new Date(property.purchase_date) > today));
    } else 
        filteredProperties = propertiesList;

    return filteredProperties;
};

const AssetPropertyList = forwardRef((props, ref) => {
    const { onPropertiesFetched, listAction, propertiesList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [properties, setProperties] = useState([]);
    const [propertiesFetched, setPropertiesFetched] = useState(false); // State to track if properties are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [propertyToDelete, setPropertyToDelete] = useState(null); // State for property to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'property_name', sort: 'asc' }]); // Initialize with default sorting
    const [includePastProperties, setIncludePastProperties] = useState(false); // State for switch

    useEffect(() => {
        const filteredProperties = filterAssetProperties(listAction, propertiesList, includePastProperties); // Filter properties

        setProperties(filteredProperties);
        setPropertiesFetched(true); // Set propertiesFetched to true after filtering
        if (onPropertiesFetched) {
            onPropertiesFetched(filteredProperties.length); // Notify parent component
        }
    }, [listAction]); // Fetch properties on component mount and when currentUserId or listAction changes

    useEffect(() => {
        const filteredProperties = filterAssetProperties(listAction, propertiesList, includePastProperties); // Filter properties when includePastProperties changes

        setProperties(filteredProperties);
        setPropertiesFetched(true); // Set propertiesFetched to true after filtering
        if (onPropertiesFetched) {
            onPropertiesFetched(filteredProperties.length); // Notify parent component
        }
    }, [includePastProperties]); // Include Past Properties to properties/grid array

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

            // also update propertiesList to delete from property from the list
            propertiesList.splice(propertiesList.findIndex(p => p.id === propertyToDelete.id), 1);

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
            listAction === 'Dream' ? setAction('EditDream') : setAction(actionType);
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

            // also update propertiesList to add or update the property in the list
            const propertyIndex = propertiesList.findIndex(p => p.id === updatedProperty.id);
            if (propertyIndex > -1) {
                propertiesList[propertyIndex] = updatedProperty;
            } else {
                propertiesList.push(updatedProperty);
            }

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

         // also update propertiesList to add or update the property in the list
         const propertyIndex = propertiesList.findIndex(p => p.id === updatedProperty.id);
         if (propertyIndex > -1) {
             propertiesList[propertyIndex] = updatedProperty;
         } else {
             propertiesList.push(updatedProperty);
         }

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
            case 'Other':
                return <OtherIcon style={{ color: 'white', marginRight: '10px' }} />;
            default:
                return <HomeIcon style={{ color: 'black', marginRight: '10px' }} />;
        }
    };

    const columns = [
        {
            field: 'property_name', headerName: 'Property Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
            )
        },
        {
            field: 'property_type', headerName: 'Property Type', width: 130, headerClassName: 'header-theme', renderCell: (params) => (
                <div>
                    {getPropertyIcon(params.value)}
                    {params.value}
                </div>
            )
        },
        {
            field: 'location', headerName: 'Property Location', width: 135, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'purchase_date', headerName: 'Date', width: 100, headerClassName: 'header-theme' },
        {
            field: 'purchase_price', headerName: 'Price', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.purchase_price);
            }
        },
        { field: 'is_funded_by_loan', headerName: 'Loan?', width: 50, headerClassName: 'header-theme', type: 'boolean' },
        {
            field: 'loan_amount', headerName: 'Loan Amount', width: 130, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.loan_amount);
            }
        },
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <FormControlLabel
                    control={<Switch checked={includePastProperties} onChange={() => setIncludePastProperties(!includePastProperties)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Properties</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={properties}
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
                    {selectedProperty && <AssetPropertyForm property={selectedProperty} action={action} onClose={handleFormModalClose} refreshPropertyList={refreshPropertyList} />} {/* Pass action to form */}
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