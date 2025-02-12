import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';

import '../common/GridHeader.css';
import UserProfile from '../accountsettingspage/userprofile/UserProfile';
import CountryList from '../common/CountryList';

export const filterUsers = (usersList, currentUserId, currentUserEmail, currentUserIsAdmin, currentUserIsFinancialAdvisor) => {
    let filteredUsers = [];

    if (currentUserIsAdmin) {
        filteredUsers = usersList.filter(user => user.email !== currentUserEmail);
    } else if (currentUserIsFinancialAdvisor) {
        filteredUsers = usersList.filter(user => user.email !== currentUserEmail && parseInt(user.financial_advisor_id) === parseInt(currentUserId));
    } else
        filteredUsers = usersList;

    return filteredUsers;
};

const UserList = forwardRef((props, ref) => {
    const { onUsersFetched, usersList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [usersFetched, setUsersFetched] = useState(false); // State to track if users are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [sortingModel, setSortingModel] = useState([{ field: 'user_name', sort: 'asc' }]); // Initialize with default sorting

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';
    const currentUserIsFinancialAdvisor = localStorage.getItem('currentUserIsFinancialAdvisor') === 'true';
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    useEffect(() => {
        const filteredUsers = filterUsers(usersList, currentUserId, currentUserEmail, currentUserIsAdmin, currentUserIsFinancialAdvisor);
        setUsers(filteredUsers);
        setUsersFetched(true); // Set usersFetched to true after filtering
        if (onUsersFetched) {
            onUsersFetched(filteredUsers.length); // Notify parent component
        }

    }, [currentUserId, currentUserEmail, currentUserIsAdmin, currentUserIsFinancialAdvisor, usersList]); // Update users when usersList changes

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedUser(null);
        setAction('');
    };

    const handleAction = (user, actionType) => {
        setSelectedUser(user);
        setAction(actionType);
        setFormModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
        refreshUserList(updatedUser, successMsg) {
            setUsers((prevUsers) => {
                const userIndex = prevUsers.findIndex(p => p.id === updatedUser.id);
                if (userIndex > -1) {
                    const newUsers = [...prevUsers];
                    newUsers[userIndex] = updatedUser;
                    onUsersFetched(users.length); // Notify parent component
                    return newUsers;
                } else {
                    return [...prevUsers, updatedUser];
                }
            });

            // also update usersList to add or update the user in the list
            const userIndex = usersList.findIndex(p => p.id === updatedUser.id);
            if (userIndex > -1) {
                usersList[userIndex] = updatedUser;
            } else {
                usersList.push(updatedUser);
            }

            setSuccessMessage(successMsg);
        },
        getUserCount() {
            return usersFetched ? users.length : 0; // Return count only if users are fetched
        }
    }));

    const refreshUserList = (updatedUser, successMsg) => {
        setUsers(prevUsers => {
            const userIndex = prevUsers.findIndex(p => p.id === updatedUser.id);
            if (userIndex > -1) {
                // Update existing user
                const newUsers = [...prevUsers];
                newUsers[userIndex] = updatedUser;
                onUsersFetched(users.length); // Notify parent component
                return newUsers;
            } else {
                // Add new user
                return [...prevUsers, updatedUser];
            }
        });

        // also update usersList to add or update the user in the list
        const userIndex = usersList.findIndex(p => p.id === updatedUser.id);
        if (userIndex > -1) {
            usersList[userIndex] = updatedUser;
        } else {
            usersList.push(updatedUser);
        }
        
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'email', headerName: 'Email', width: 150, headerClassName: 'header-theme' },
        {
            field: 'user_name', headerName: 'Name', width: 150, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {`${params.row.first_name} ${params.row.last_name}`}
                </a>
            )
        },
        {
            field: 'country_of_residence', headerName: 'Country of Residence', width: 135, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'base_currency', headerName: 'Base Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'is_active', headerName: 'Active User?', width: 100, headerClassName: 'header-theme', type: 'boolean' },
        ...(currentUserIsAdmin ? [
            { field: 'is_financial_advisor', headerName: 'Advisor?', width: 100, headerClassName: 'header-theme', type: 'boolean' },
            { field: 'is_admin', headerName: 'Admin?', width: 100, headerClassName: 'header-theme', type: 'boolean' }
        ] : [])
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
                rows={users}
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
                    {selectedUser && <UserProfile user={selectedUser} action={action} onClose={handleFormModalClose} refreshUserList={refreshUserList} />}
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
});

export default UserList;