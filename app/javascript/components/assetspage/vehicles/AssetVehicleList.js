import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Car icon
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'; // Bike icon
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Commercial vehicle icon
import OtherHousesIcon from '@mui/icons-material/OtherHouses'; // Other vehicle icon
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetVehicleForm from './AssetVehicleForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const AssetVehicleList = forwardRef((props, ref) => {
    const { onVehiclesFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [vehiclesFetched, setVehiclesFetched] = useState(false); // State to track if vehicles are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [vehicleToDelete, setVehicleToDelete] = useState(null); // State for vehicle to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'vehicle_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/api/asset_vehicles?user_id=${currentUserId}`);
            setVehicles(response.data);
            setVehiclesFetched(true); // Set vehiclesFetched to true after fetching
            if (onVehiclesFetched) {
                onVehiclesFetched(response.data.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    useEffect(() => {
        fetchVehicles();
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedVehicle(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setVehicleToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/asset_vehicles/${vehicleToDelete.id}`);
            setVehicles(prevVehicles => prevVehicles.filter(p => p.id !== vehicleToDelete.id));
            onVehiclesFetched(vehicles.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Vehicle deleted successfully');
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleAction = (vehicle, actionType) => {
        if (actionType === 'Delete') {
            setVehicleToDelete(vehicle);
            setDeleteDialogOpen(true);
        } else {
            setSelectedVehicle(vehicle);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshVehicleList(updatedVehicle, successMsg) {
            setVehicles((prevVehicles) => {
                const vehicleIndex = prevVehicles.findIndex(p => p.id === updatedVehicle.id);
                if (vehicleIndex > -1) {
                    const newVehicles = [...prevVehicles];
                    newVehicles[vehicleIndex] = updatedVehicle;
                    onVehiclesFetched(vehicles.length); // Notify parent component
                    return newVehicles;
                } else {
                    return [...prevVehicles, updatedVehicle];
                }
            });
            setSuccessMessage(successMsg);
        },
        getVehicleCount() {
            return vehiclesFetched ? vehicles.length : 0; // Return count only if vehicles are fetched
        }
    }));

    const refreshVehicleList = (updatedVehicle, successMsg) => {
        setVehicles(prevVehicles => {
            const vehicleIndex = prevVehicles.findIndex(p => p.id === updatedVehicle.id);
            if (vehicleIndex > -1) {
                // Update existing vehicle
                const newVehicles = [...prevVehicles];
                newVehicles[vehicleIndex] = updatedVehicle;
                onVehiclesFetched(vehicles.length); // Notify parent component
                return newVehicles;
            } else {
                // Add new vehicle
                return [...prevVehicles, updatedVehicle];
            }
        });
        setSuccessMessage(successMsg);
    };

    const getVehicleIcon = (vehicleType) => {
        switch (vehicleType) {
            case 'Car':
                return <DirectionsCarIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Bike':
                return <TwoWheelerIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Commercial':
                return <LocalShippingIcon style={{ color: 'black', marginRight: '10px' }} />;
            case 'Other':
                return <OtherHousesIcon style={{ color: 'black', marginRight: '10px' }} />;
            default:
                return <DirectionsCarIcon style={{ color: 'black', marginRight: '10px' }} />;
        }
    };

    const columns = [
        { field: 'vehicle_name', headerName: 'Vehicle Name', width: 200, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'vehicle_type', headerName: 'Vehicle Type', width: 130, headerClassName: 'header-theme', renderCell: (params) => (
            <div>
                {getVehicleIcon(params.value)}
                {params.value}
            </div>
        )},
        { field: 'vehicle_location', headerName: 'Vehicle Location', width: 135, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'purchase_date', headerName: 'Date', width: 100, headerClassName: 'header-theme' },
        { field: 'purchase_price', headerName: 'Price', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.purchase_price);
         }},
        { field: 'is_under_loan', headerName: 'Loan?', width: 75, headerClassName: 'header-theme', type: 'boolean' },
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
                rows={vehicles}
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
                    {selectedVehicle && <AssetVehicleForm vehicle={selectedVehicle} action={action} onClose={handleFormModalClose} refreshVehicleList={refreshVehicleList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the vehicle "{vehicleToDelete?.vehicle_name}"?
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

export default AssetVehicleList;