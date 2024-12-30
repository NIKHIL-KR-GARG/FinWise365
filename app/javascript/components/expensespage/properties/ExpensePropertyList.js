import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import ExpensePropertyForm from './ExpensePropertyForm';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

export const filterExpenseProperties = (listAction, propertiesList, includePastProperties) => {
    let filteredProperties = [];
    const today = new Date();
    if (listAction === 'Expense' && !includePastProperties) {
        filteredProperties = propertiesList.filter(property => !property.is_dream && (!property.end_date || new Date(property.end_date) >= today));
    } else if (listAction === 'Expense' && includePastProperties) {
        filteredProperties = propertiesList.filter(property => !property.is_dream);
    } else if (listAction === 'Dream' && includePastProperties) {
        filteredProperties = propertiesList.filter(property => property.is_dream);
    } else if (listAction === 'Dream' && !includePastProperties) {
        filteredProperties = propertiesList.filter(property => property.is_dream && (new Date(property.start_date) > today));
    } else
        filteredProperties = propertiesList;

    return filteredProperties;
};

export const filterPropertiesMaintenance = (assetPropertiesList) => {

    let propertyMaintenance = [];
    if (assetPropertiesList && assetPropertiesList.length > 0) {
        // add asset properties to the filtered properties list
        propertyMaintenance = assetPropertiesList
            .filter(assetProperty => {
                if (assetProperty.is_dream) return false;
                else if (assetProperty.is_under_construction && new Date(assetProperty.possession_date) > new Date()) return false;
                else if (new Date(assetProperty.purchase_date) <= new Date() &&
                    (!assetProperty.is_plan_to_sell || new Date(assetProperty.sale_date) >= new Date()) &&
                    assetProperty.property_maintenance > 0)
                    return true;
                else return false;
            })
            .map(assetProperty => ({
                id: `propertymaintenance-${assetProperty.id}`,
                property_name: `Maintenance - ${assetProperty.property_name}`,
                property_type: assetProperty.property_type,
                location: assetProperty.location,
                currency: assetProperty.currency,
                // if property is under construction, start_date is possession_date else start date is purchase_date
                start_date: assetProperty.is_under_construction ? assetProperty.possession_date : assetProperty.purchase_date,
                // if is plan to sell, end_date is sale_date else end_date is null
                end_date: assetProperty.is_plan_to_sell ? assetProperty.sale_date : "",
                total_expense: assetProperty.property_maintenance
            }));
    }

    return propertyMaintenance;
};

const ExpensePropertyList = forwardRef((props, ref) => {
    const { onPropertiesFetched, listAction, propertiesList, assetPropertiesList } = props; // Destructure the new prop
    
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

    const [includePastProperties, setIncludePastProperties] = useState(false); // State for switch to include past properties

    useEffect(() => {
        const filteredProperties = filterExpenseProperties(listAction, propertiesList, includePastProperties); // Filter properties when includePastProperties changes
        const propertyMaintenance = filterPropertiesMaintenance(assetPropertiesList);

        setProperties([...filteredProperties, ...propertyMaintenance]);

        setPropertiesFetched(true); // Set propertiesFetched to true after filtering
        if (onPropertiesFetched) {
            onPropertiesFetched(filteredProperties.length + propertyMaintenance.length) // Notify parent component
        }

    }, []);

    useEffect(() => {
        const filteredProperties = filterExpenseProperties(listAction, propertiesList, includePastProperties); // Filter properties when includePastProperties changes
        const propertyMaintenance = filterPropertiesMaintenance(assetPropertiesList);

        setProperties([...filteredProperties, ...propertyMaintenance]);

        setPropertiesFetched(true); // Set propertiesFetched to true after filtering
        if (onPropertiesFetched) {
            onPropertiesFetched(filteredProperties.length + propertyMaintenance.length) // Notify parent component
        }

    }, [includePastProperties]); // Include Past Properties to property/grid array

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

            // also delete from propertiesList
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

    const columns = [
        {
            field: 'property_name',
            headerName: 'Property Name',
            width: 200,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                params.value.includes('Maintenance') ? (
                    <span>{params.value}</span>
                ) : (
                    <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                        {params.value}
                    </a>
                )
            )
        },
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
                params.row.property_name.includes('Maintenance') ? (
                    <span></span>
                ) : (
                    <div>
                        <a onClick={() => handleAction(params.row, 'Delete')} style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', color: theme.palette.primary.main }}>Delete</a>
                    </div>
                )
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
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Property Expenses</span>}
                />
            </div>
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
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
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