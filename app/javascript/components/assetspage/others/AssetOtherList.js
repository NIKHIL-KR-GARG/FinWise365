import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetOtherForm from './AssetOtherForm';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

export const filterAssetOthers = (listAction, othersList, includePastOthers) => {
    let filteredOthers = [];
    // filter on others where payout_date + payout_duration (months) is greater than today
    const today = new Date();
    if (!includePastOthers) {
        if (listAction === 'Asset') {
            filteredOthers = othersList.filter(other => {
                const payoutDate = new Date(other.payout_date);
                const payoutDuration = parseInt(other.payout_duration);
                const payoutEndDate = new Date(payoutDate.setMonth(payoutDate.getMonth() + 1 + payoutDuration));
                return (payoutEndDate > today) && !other.is_dream;
            });
        }
        else if (listAction === 'Dream') {
            filteredOthers = othersList.filter(other => other.is_dream && (new Date(other.start_date) > today));
        }
    }
    else if (includePastOthers) {
        if (listAction === 'Asset') {
            filteredOthers = othersList.filter(other => !other.is_dream);
        }
        else if (listAction === 'Dream') {
            filteredOthers = othersList.filter(other => other.is_dream);
        }
    }
    else
        filteredOthers = othersList;

    return filteredOthers;
};

const AssetOtherList = forwardRef((props, ref) => {
    const { onOthersFetched, listAction, othersList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [others, setOthers] = useState([]);
    const [othersFetched, setOthersFetched] = useState(false); // State to track if others are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedOther, setSelectedOther] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [otherToDelete, setOtherToDelete] = useState(null); // State for other to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'asset_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastOthers, setIncludePastOthers] = useState(false); // State for switch to include past others

    useEffect(() => {
        const filteredOthers = filterAssetOthers(listAction, othersList, includePastOthers); 

        setOthers(filteredOthers);
        setOthersFetched(true); // Set othersFetched to true after filtering
        if (onOthersFetched) {
            onOthersFetched(filteredOthers.length); // Notify parent component
        }
    }, []);

    useEffect(() => {
        const filteredOthers = filterAssetOthers(listAction, othersList, includePastOthers);  // Filter others when includePastOthers changes

        setOthers(filteredOthers);
        setOthersFetched(true); // Set othersFetched to true after filtering
        if (onOthersFetched) {
            onOthersFetched(filteredOthers.length); // Notify parent component
        }
    }, [includePastOthers]); // Include Past Others to other/grid array

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

            // also delete from othersList
            othersList.splice(othersList.findIndex(p => p.id === otherToDelete.id), 1);

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
            listAction === 'Dream' ? setAction('EditDream') : setAction(actionType);
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

            // also update othersList to add or update the other in the list
            const otherIndex = othersList.findIndex(p => p.id === updatedOther.id);
            if (otherIndex > -1) {
                othersList[otherIndex] = updatedOther;
            } else {
                othersList.push(updatedOther);
            }

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

        // also update othersList to add or update the other in the list
        const otherIndex = othersList.findIndex(p => p.id === updatedOther.id);
        if (otherIndex > -1) {
            othersList[otherIndex] = updatedOther;
        } else {
            othersList.push(updatedOther);
        }
        
        setSuccessMessage(successMsg);
    };

    const columns = [
        {
            field: 'asset_name', headerName: 'Asset Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
            )
        },
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
        {
            field: 'location', headerName: 'Location', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 115, headerClassName: 'header-theme' },
        {
            field: 'lumpsum_amount', headerName: 'Amount', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.lumpsum_amount);
            }
        },
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <FormControlLabel
                    control={<Switch checked={includePastOthers} onChange={() => setIncludePastOthers(!includePastOthers)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Other Assets</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={others}
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
                    {selectedOther && <AssetOtherForm other={selectedOther} action={action} onClose={handleFormModalClose} refreshOtherList={refreshOtherList} />} {/* Pass action to form */}
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
                        Are you sure you want to delete the other "{otherToDelete?.asset_name}"?
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