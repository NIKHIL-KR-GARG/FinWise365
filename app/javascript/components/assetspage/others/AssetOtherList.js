import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetOtherForm from './AssetOtherForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const AssetOtherList = forwardRef((props, ref) => {
    const { onOthersFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [others, setOthers] = useState([]);
    const [othersFetched, setOthersFetched] = useState(false); // State to track if others are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedOther, setSelectedOther] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [otherToDelete, setOtherToDelete] = useState(null); // State for other to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'other_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchOthers = async () => {
        try {
            const response = await axios.get(`/api/asset_others?user_id=${currentUserId}`);
            setOthers(response.data);
            setOthersFetched(true); // Set othersFetched to true after fetching
            if (onOthersFetched) {
                onOthersFetched(response.data.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching others:', error);
        }
    };

    useEffect(() => {
        fetchOthers();
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedOther(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setOtherToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/asset_others/${otherToDelete.id}`);
            setOthers(prevOthers => prevOthers.filter(p => p.id !== otherToDelete.id));
            onOthersFetched(others.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Other deleted successfully');
        } catch (error) {
            console.error('Error deleting other:', error);
        }
    };

    const handleAction = (other, actionType) => {
        if (actionType === 'Delete') {
            setOtherToDelete(other);
            setDeleteDialogOpen(true);
        } else {
            setSelectedOther(other);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshOtherList(updatedOther, successMsg) {
            setOthers((prevOthers) => {
                const otherIndex = prevOthers.findIndex(p => p.id === updatedOther.id);
                if (otherIndex > -1) {
                    const newOthers = [...prevOthers];
                    newOthers[otherIndex] = updatedOther;
                    onOthersFetched(others.length); // Notify parent component
                    return newOthers;
                } else {
                    return [...prevOthers, updatedOther];
                }
            });
            setSuccessMessage(successMsg);
        },
        getOtherCount() {
            return othersFetched ? others.length : 0; // Return count only if others are fetched
        }
    }));

    const refreshOtherList = (updatedOther, successMsg) => {
        setOthers(prevOthers => {
            const otherIndex = prevOthers.findIndex(p => p.id === updatedOther.id);
            if (otherIndex > -1) {
                // Update existing other
                const newOthers = [...prevOthers];
                newOthers[otherIndex] = updatedOther;
                onOthersFetched(others.length); // Notify parent component
                return newOthers;
            } else {
                // Add new other
                return [...prevOthers, updatedOther];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'asset_name', headerName: 'Asset Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
        { field: 'asset_location', headerName: 'Location', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 115, headerClassName: 'header-theme' },
        { field: 'lumpsum_amount', headerName: 'Amount', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.lumpsum_amount);
         }},
        { field: 'payout_type', headerName: 'Payout Type', width: 100, headerClassName: 'header-theme' },
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
                rows={others}
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
                    {selectedOther && <AssetOtherForm other={selectedOther} action={action} onClose={handleFormModalClose} refreshOtherList={refreshOtherList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the other "{otherToDelete?.other_name}"?
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

export default AssetOtherList;