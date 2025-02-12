import React, { useState, useEffect, forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

import CountryList from '../common/CountryList';

const fetchUsers = async (currentUserId, currentUserEmail) => {
     
    // fetch all the users
    const response = await axios.get(`/api/users`);
    const usersList = response.data;

    let filteredUsers = [];
    filteredUsers = usersList.filter(user => user.email !== currentUserEmail && parseInt(user.financial_advisor_id) === parseInt(currentUserId));

    return filteredUsers;
};

const ClientSelection = forwardRef((props, ref) => {
    const { onClientSelected } = props;

    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [openClearDialog, setOpenClearDialog] = useState(false);
    const theme = useTheme();

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    useEffect(() => {
        const fetchAndSetUsers = async () => {
            const filteredUsers = await fetchUsers(currentUserId, currentUserEmail);
            setUsers(filteredUsers);
        };

        fetchAndSetUsers();
    }, [currentUserId, currentUserEmail]);

    const handleOpenDialog = (client) => {
        setSelectedClient(client);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedClient(null);
    };

    const handleConfirmSelection = () => {
        if (selectedClient) {
            localStorage.setItem('currentClientID', selectedClient.id);
            localStorage.setItem('currentClientName', `${selectedClient.first_name} ${selectedClient.last_name}`);
            if (onClientSelected) {
                onClientSelected();
            }
        }
        handleCloseDialog();
    };

    const handleOpenClearDialog = () => {
        setOpenClearDialog(true);
    };

    const handleCloseClearDialog = () => {
        setOpenClearDialog(false);
    };

    const handleConfirmClearSelection = () => {
        localStorage.removeItem('currentClientID');
        localStorage.removeItem('currentClientName');
        if (onClientSelected) {
            onClientSelected();
        }
        handleCloseClearDialog();
    };

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                <PersonIcon style={{ color: 'green', marginRight: '10px' }} />
                Select Client
                <Button variant="contained" color="secondary" onClick={handleOpenClearDialog} sx={{ fontSize: '0.75rem', ml: 5 }}>
                    Clear Client Selection
                </Button>
            </Typography>

            <TableContainer component={Paper}>
                <Table stickyHeader sx={{ border: 1, borderColor: 'grey.400' }}>
                    <TableHead>
                         <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>Name</TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>Email</TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>Country of Residence</TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>Nationality</TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}>Currency</TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', color: 'white', backgroundColor: '#0d47a1' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>{`${user.first_name} ${user.last_name}`}</TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>{user.email}</TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                                    {CountryList.find(country => country.code === user.country_of_residence)?.name || user.country_of_residence}
                                </TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>{user.nationality}</TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>{user.base_currency}</TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                                    <a href="#" onClick={() => handleOpenDialog(user)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                        Select Client
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Client Selection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to select {selectedClient?.first_name} {selectedClient?.last_name} as your client?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openClearDialog} onClose={handleCloseClearDialog}>
                <DialogTitle>Confirm Clear Client Selection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to clear the current client selection?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseClearDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmClearSelection} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

export default ClientSelection;