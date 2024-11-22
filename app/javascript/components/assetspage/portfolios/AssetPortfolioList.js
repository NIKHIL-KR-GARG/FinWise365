import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Modal, Box, Alert, Snackbar, IconButton } from '@mui/material';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../common/GridHeader.css';
import AssetPortfolioForm from './AssetPortfolioForm';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const AssetPortfolioList = forwardRef((props, ref) => {
    const { onPortfoliosFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [portfolios, setPortfolios] = useState([]);
    const [portfoliosFetched, setPortfoliosFetched] = useState(false); // State to track if portfolios are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [action, setAction] = useState(''); // State for action
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for Delete Dialog
    const [portfolioToDelete, setPortfolioToDelete] = useState(null); // State for portfolio to delete
    const [sortingModel, setSortingModel] = useState([{ field: 'portfolio_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchPortfolios = async () => {
        try {
            const response = await axios.get(`/api/asset_portfolios?user_id=${currentUserId}`);

            // filter out the portfolios that have sale date before today
            const today = new Date();
            const filteredPortfolios = response.data.filter(portfolio => {
                if (portfolio.is_plan_to_sell) {
                    const saleDate = new Date(portfolio.sale_date);
                    return saleDate >= today;
                }
                return true;
            });

            setPortfolios(filteredPortfolios);
            setPortfoliosFetched(true); // Set portfoliosFetched to true after fetching
            if (onPortfoliosFetched) {
                onPortfoliosFetched(filteredPortfolios.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        }
    };

    useEffect(() => {
        fetchPortfolios();
        
    }, [currentUserId]);

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedPortfolio(null);
        setAction('');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setPortfolioToDelete(null);
    };

    const handleDelete = async () => {
        try {
            //delete the portfolio
            await axios.delete(`/api/asset_portfolios/${portfolioToDelete.id}`);
            setPortfolios(prevPortfolios => prevPortfolios.filter(p => p.id !== portfolioToDelete.id));
            
            //delete portfolio details as well
            await axios.delete(`/api/asset_portfolio_details/delete_by_portfolio_id/${portfolioToDelete.id}`);

            onPortfoliosFetched(portfolios.length - 1); // Notify parent component
            handleDeleteDialogClose();
            setSuccessMessage('Portfolio deleted successfully');
        } catch (error) {
            console.error('Error deleting portfolio:', error);
        }
    };

    const handleAction = (portfolio, actionType) => {
        if (actionType === 'Delete') {
            setPortfolioToDelete(portfolio);
            setDeleteDialogOpen(true);
        } else {
            setSelectedPortfolio(portfolio);
            setAction(actionType);
            setFormModalOpen(true);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshPortfolioList(updatedPortfolio, successMsg) {
            setPortfolios((prevPortfolios) => {
                const portfolioIndex = prevPortfolios.findIndex(p => p.id === updatedPortfolio.id);
                if (portfolioIndex > -1) {
                    const newPortfolios = [...prevPortfolios];
                    newPortfolios[portfolioIndex] = updatedPortfolio;
                    onPortfoliosFetched(portfolios.length); // Notify parent component
                    return newPortfolios;
                } else {
                    return [...prevPortfolios, updatedPortfolio];
                }
            });
            setSuccessMessage(successMsg);
        },
        getPortfolioCount() {
            return portfoliosFetched ? portfolios.length : 0; // Return count only if portfolios are fetched
        }
    }));

    const refreshPortfolioList = (updatedPortfolio, successMsg) => {
        setPortfolios(prevPortfolios => {
            const portfolioIndex = prevPortfolios.findIndex(p => p.id === updatedPortfolio.id);
            if (portfolioIndex > -1) {
                // Update existing portfolio
                const newPortfolios = [...prevPortfolios];
                newPortfolios[portfolioIndex] = updatedPortfolio;
                onPortfoliosFetched(portfolios.length); // Notify parent component
                return newPortfolios;
            } else {
                // Add new portfolio
                return [...prevPortfolios, updatedPortfolio];
            }
        });
        setSuccessMessage(successMsg);
    };

    const columns = [
        { field: 'portfolio_name', headerName: 'Portfolio Name', width: 140, headerClassName: 'header-theme', renderCell: (params) => (
            <a onClick={() => handleAction(params.row, 'Edit')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: theme.palette.primary.main, cursor: 'pointer' }}>
                {params.value}
            </a>
        )},
        { field: 'institution_name', headerName: 'Institution', width: 140, headerClassName: 'header-theme' },
        { field: 'portfolio_type', headerName: 'Type', width: 100, headerClassName: 'header-theme' },
        { field: 'location', headerName: 'Location', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 75, headerClassName: 'header-theme' },
        { field: 'buying_date', headerName: 'Date Bought', width: 115, headerClassName: 'header-theme' },
        { field: 'buying_value', headerName: 'Buying Value', width: 125, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.buying_value);
         }},
        { field: 'is_sip', headerName: 'Is SIP', width: 100, headerClassName: 'header-theme', type: 'boolean' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 110,
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
                rows={portfolios}
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
                    {selectedPortfolio && <AssetPortfolioForm portfolio={selectedPortfolio} action={action} onClose={handleFormModalClose} refreshPortfolioList={refreshPortfolioList}/>} {/* Pass action to form */}
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
                        Are you sure you want to delete the portfolio "{portfolioToDelete?.portfolio_name}"?
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

export default AssetPortfolioList;