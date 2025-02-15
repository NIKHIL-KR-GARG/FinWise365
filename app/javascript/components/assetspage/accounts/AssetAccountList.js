import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetAccountForm from './AssetAccountForm';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

export const filterAccounts = (listAction, accountsList, includePastAccounts) => {
    let filteredAccounts = [];
    const today = new Date();
    if (listAction === 'Asset' && !includePastAccounts) {
        filteredAccounts = accountsList.filter(account => !account.is_dream && (!account.is_plan_to_close || new Date(account.closure_date) >= today));
    } else if (listAction === 'Asset' && includePastAccounts) {
        filteredAccounts = accountsList.filter(account => !account.is_dream);
    } else if (listAction === 'Dream' && includePastAccounts) {
        filteredAccounts = accountsList.filter(account => account.is_dream);
    } else if (listAction === 'Dream' && !includePastAccounts) {
        filteredAccounts = accountsList.filter(account => account.is_dream && (new Date(account.opening_date) > today));
    } else
        filteredAccounts = accountsList;

    return filteredAccounts;
};

const AssetAccountList = forwardRef((props, ref) => {
    const { onAccountsFetched, listAction, accountsList } = props; // Destructure the new prop

    const [successMessage, setSuccessMessage] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [accountsFetched, setAccountsFetched] = useState(false); // State to track if accounts are fetched
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [accountToDelete, setAccountToDelete] = useState(null); // State for account to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'account_name', sort: 'asc' }]); // Initialize with default sorting

    const [includePastAccounts, setIncludePastAccounts] = useState(false); // State for switch

    useEffect(() => {
        const filteredAccounts = filterAccounts(listAction, accountsList, includePastAccounts);

        setAccounts(filteredAccounts);
        setAccountsFetched(true); // Set accountsFetched to true after filtering
        if (onAccountsFetched) {
            onAccountsFetched(filteredAccounts.length); // Notify parent component
        }

    }, []);

    useEffect(() => {
        const filteredAccounts = filterAccounts(listAction, accountsList, includePastAccounts); // Filter accounts when includePastAccounts changes

        setAccounts(filteredAccounts);
        setAccountsFetched(true); // Set accountsFetched to true after filtering
        if (onAccountsFetched) {
            onAccountsFetched(filteredAccounts.length); // Notify parent component
        }

    }, [includePastAccounts]); // Include Past Accounts to account/grid array

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedAccount(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/asset_accounts/${accountToDelete.id}`);
            setAccounts(prevAccounts => prevAccounts.filter(p => p.id !== accountToDelete.id));

            // also delete from accountsList
            accountsList.splice(accountsList.findIndex(p => p.id === accountToDelete.id), 1);

            onAccountsFetched(accounts.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleAction = (account, actionType) => {
        if (actionType === 'Delete') {
            setAccountToDelete(account);
            setDeleteDialogOpen(true);
        } else {
            setSelectedAccount(account);
            listAction === 'Dream' ? setAction('EditDream') : setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshAccountList(updatedAccount, successMsg) {
            setAccounts((prevAccounts) => {
                const accountIndex = prevAccounts.findIndex(p => p.id === updatedAccount.id);
                if (accountIndex > -1) {
                    const newAccounts = [...prevAccounts];
                    newAccounts[accountIndex] = updatedAccount;
                    onAccountsFetched(accounts.length); // Notify parent component
                    return newAccounts;
                } else {
                    return [...prevAccounts, updatedAccount];
                }
            });

            // also update accountsList to add or update the account in the list
            const accountIndex = accountsList.findIndex(p => p.id === updatedAccount.id);
            if (accountIndex > -1) {
                accountsList[accountIndex] = updatedAccount;
            } else {
                accountsList.push(updatedAccount);
            }

            setSuccessMessage(successMsg);
        },
        getAccountCount() {
            return accountsFetched ? accounts.length : 0; // Return count only if accounts are fetched
        }
    }));

    const refreshAccountList = (updatedAccount, successMsg) => {
        setAccounts(prevAccounts => {
            const accountIndex = prevAccounts.findIndex(p => p.id === updatedAccount.id);
            if (accountIndex > -1) {
                // Update existing account
                const newAccounts = [...prevAccounts];
                newAccounts[accountIndex] = updatedAccount;
                onAccountsFetched(accounts.length); // Notify parent component
                return newAccounts;
            } else {
                // Add new account
                return [...prevAccounts, updatedAccount];
            }
        });

        // also update accountsList to add or update the account in the list
        const accountIndex = accountsList.findIndex(p => p.id === updatedAccount.id);
        if (accountIndex > -1) {
            accountsList[accountIndex] = updatedAccount;
        } else {
            accountsList.push(updatedAccount);
        }
        
        setSuccessMessage(successMsg);
    };

    const columns = [
        {
            field: 'account_name', headerName: 'Account Name', width: 150, headerClassName: 'header-theme', renderCell: (params) => (
                <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                    {params.value}
                </a>
            )
        },
        { field: 'institution_name', headerName: 'Institution', width: 150, headerClassName: 'header-theme' },
        { field: 'account_type', headerName: 'Account Type', width: 125, headerClassName: 'header-theme' },
        {
            field: 'location', headerName: 'Account Location', width: 135, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'opening_date', headerName: 'Opening Date', width: 125, headerClassName: 'header-theme' },
        {
            field: 'account_balance', headerName: 'Account Balance', width: 115, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.account_balance);
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                <div>
                    <a onClick={() => handleAction(params.row, 'Close')} style={{ textDecoration: 'underline', fontWeight: 'bold', marginRight: 10, cursor: 'pointer', color: theme.palette.primary.main }}>Close a/c</a>
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
                    control={<Switch checked={includePastAccounts} onChange={() => setIncludePastAccounts(!includePastAccounts)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'purple' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'purple' } }} />}
                    label={<span style={{ fontWeight: 'bold', color: 'purple' }}>Include Past Accounts</span>}
                />
            </div>
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={accounts}
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
                    {selectedAccount && <AssetAccountForm account={selectedAccount} action={action} onClose={handleFormModalClose} refreshAccountList={refreshAccountList} />} {/* Pass action to form */}
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
                        Are you sure you want to delete the account "{accountToDelete?.account_name}"?
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

export default AssetAccountList;