import React, { useState, useEffect, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import ContactUsMessageForm from './ContactUsMessageForm';

import '../common/GridHeader.css';

const ContactUsMessageList = () => {
    
    const hasFetchedData = useRef(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [contactUsMessages, setContactUsMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'id', sort: 'desc' }]); // Initialize with default sorting by name
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const theme = useTheme();

    const fetchContactUsMessages = async () => {
        try {
            const response = await axios.get(`/api/contact_admins`);
            setContactUsMessages(response.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchContactUsMessages();
            setSelectedRows([]); // Clear selection
            hasFetchedData.current = true;
        }
    }, []);

    const handleAction = (message, actionType) => {
        if (actionType === 'Show') {
            setSelectedMessage(message);
            setFormModalOpen(true);
        }
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedMessage(null);
    };

    const handleMarkAsRead = async () => {
        try {
            const updatedMessages = contactUsMessages.map((message) => {
                if (selectedRows.includes(message.id)) {
                    return { ...message, is_read: true };
                }
                return message;
            });
            setContactUsMessages(updatedMessages);
            setSuccessMessage('Selected messages marked as read.');
            setSelectedRows([]); // Clear selection
            await axios.put('/api/contact_admins/mark_as_read', { ids: selectedRows }); // Update server
            fetchContactUsMessages(); // Refresh data from server
        }
        catch (error) {
            console.error('Error marking as read:', error);
            setErrorMessage('Error marking as read.');
        };
    };

    const handleMarkAsUnRead = async () => {
        try {
            const updatedMessages = contactUsMessages.map((message) => {
                if (selectedRows.includes(message.id)) {
                    return { ...message, is_read: true };
                }
                return message;
            });
            setContactUsMessages(updatedMessages);
            setSuccessMessage('Selected messages marked as unread.');
            setSelectedRows([]); // Clear selection
            await axios.put('/api/contact_admins/mark_as_unread', { ids: selectedRows }); // Update server
            fetchContactUsMessages(); // Refresh data from server
        }
        catch (error) {
            console.error('Error marking as unread:', error);
            setErrorMessage('Error marking as unread.');
        };
    };

    const handleMarkAsReplied = async () => {
        try {
            const updatedMessages = contactUsMessages.map((message) => {
                if (selectedRows.includes(message.id)) {
                    return { ...message, is_replied: true };
                }
                return message;
            });
            setContactUsMessages(updatedMessages);
            setSuccessMessage('Selected messages marked as replied.');
            setSelectedRows([]); // Clear selection
            await axios.put('/api/contact_admins/mark_as_replied', { ids: selectedRows }); // Update server
            fetchContactUsMessages(); // Refresh data from server
        }
        catch (error) {
            console.error('Error marking as replied:', error);
            setErrorMessage('Error marking as replied.');
        };
    };

    const handleMarkAsNotReplied = async () => {
        try {
            const updatedMessages = contactUsMessages.map((message) => {
                if (selectedRows.includes(message.id)) {
                    return { ...message, is_replied: true };
                }
                return message;
            });
            setContactUsMessages(updatedMessages);
            setSuccessMessage('Selected messages marked as not replied.');
            setSelectedRows([]); // Clear selection
            await axios.put('/api/contact_admins/mark_as_notreplied', { ids: selectedRows }); // Update server
            fetchContactUsMessages(); // Refresh data from server
        }
        catch (error) {
            console.error('Error marking as not replied:', error);
            setErrorMessage('Error marking as not replied.');
        };
    };

    const handleDeleteSelected = async () => {
        try {
            const updatedMessages = contactUsMessages.filter((message) => !selectedRows.includes(message.id));
            setContactUsMessages(updatedMessages);
            setSuccessMessage('Selected messages deleted.');
            setSelectedRows([]); // Clear selection
            await axios.delete('/api/contact_admins/bulk_destroy', { data: { ids: selectedRows } }); // Update server
            fetchContactUsMessages(); // Refresh data from server
        }
        catch (error) {
            console.error('Error deleting messages:', error);
            setErrorMessage('Error deleting messages.');
        };
        setConfirmDeleteOpen(false);
    };

    const handleConfirmDeleteOpen = () => {
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDeleteClose = () => {
        setConfirmDeleteOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', hide: true, headerClassName: 'header-theme' }, // Ensure the ID field is completely hidden
        {
            field: 'name', headerName: 'Name', width: 150, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Show')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
            )
        },
        { field: 'company', headerName: 'Company', width: 150, headerClassName: 'header-theme' },
        { field: 'email', headerName: 'Email', width: 200, headerClassName: 'header-theme' },
        { field: 'message', headerName: 'Message', width: 400, headerClassName: 'header-theme' },
        { field: 'created_at', headerName: 'Created At', width: 200, headerClassName: 'header-theme' },
        { field: 'is_read', headerName: 'Is Read', width: 100, headerClassName: 'header-theme', type: 'boolean' },
        { field: 'is_replied', headerName: 'Is Replied', width: 100, headerClassName: 'header-theme', type: 'boolean' },
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
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setErrorMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <DataGrid
                width="100%"
                rows={contactUsMessages}
                columns={columns}
                sortModel={sortingModel} // Add sorting model prop
                onSortModelChange={(model) => setSortingModel(model)} // Update sorting model on change
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                sx={{
                    height: 375, // Adjust this value to fit exactly for 5 rows
                    width: '100%',
                    border: '2px solid #000',
                }}
                checkboxSelection // Enable checkbox selection
                disableRowSelectionOnClick
                rowSelectionModel={selectedRows} // Ensure DataGrid reflects the cleared selection state
                onRowSelectionModelChange={(newSelection) => {
                    setSelectedRows(newSelection); // Correctly update selectedRows
                }}
            />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <Grid container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleMarkAsRead}>
                                Mark As Read
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleMarkAsUnRead}>
                                Mark As UnRead
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleMarkAsReplied}>
                                Mark As Replied
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleMarkAsNotReplied}>
                                Mark As Not Replied
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="error" onClick={handleConfirmDeleteOpen}>
                                Delete Selected
                            </Button>
                        </Grid>
                    </Grid>
                </div>

            <Dialog
                open={confirmDeleteOpen}
                onClose={handleConfirmDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the selected messages?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSelected} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 500, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
                    {selectedMessage && <ContactUsMessageForm userMessage={selectedMessage} onClose={handleFormModalClose} />} 
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
        </>
    );
};

export default ContactUsMessageList;