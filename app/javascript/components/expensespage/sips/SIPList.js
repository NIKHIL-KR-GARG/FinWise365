import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const SIPList = forwardRef((props, ref) => {
    const { onSIPsFetched } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [sips, setSIPs] = useState({
        id: '',
        name: '',
        location: '',
        currency: '',
        sip_amount: 0,
        frequency: '',
        start_date: '',
        end_date: ''
    });
    const [sipsFetched, setSIPsFetched] = useState(false); // State to track if sips are fetched
    const currentUserId = localStorage.getItem('currentUserId');
    const theme = useTheme();
    const [sortingModel, setSortingModel] = useState([{ field: 'sip_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchDeposits = async () => {
        try {
            const response = await axios.get(`/api/asset_deposits?user_id=${currentUserId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching deposits:', error);
            return [];
        }
    };

    const fetchPortfolios = async () => {
        try {
            const response = await axios.get(`/api/asset_portfolios?user_id=${currentUserId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            return [];
        }
    };

    const fetchOtherAssets = async () => {
        try {
            const response = await axios.get(`/api/asset_others?user_id=${currentUserId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching other assets:', error);
            return [];
        }
    };
    
    const fetchSIPs = async () => {
        try {
            // fetch deposits, portfolios and other assets for SIP's
            const depositsList = await fetchDeposits();
            const portfoliosList = await fetchPortfolios();
            const otherAssetsList = await fetchOtherAssets();

            const depositSIPs = depositsList
            .filter(deposit => {
                if (deposit.deposit_type !== 'Recurring') return false;
                else return new Date(deposit.maturity_date) >= new Date();
                })
            .map(deposit => ({
                id: `depositsip-${deposit.id}`,
                name: `SIP - ${deposit.deposit_name}`,
                type: 'Deposit',
                location: deposit.location,
                currency: deposit.currency,
                amount: deposit.payment_amount,
                frequency: deposit.payment_frequency,
                start_date: deposit.opening_date,
                end_date: deposit.maturity_date
            }));

            const portfolioSIPs = portfoliosList
            .filter(portfolio => {
                if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < new Date()) return false;
                else return portfolio.is_sip;
            })
            .map(portfolio => ({
                id: `portfoliosip-${portfolio.id}`,
                name: `SIP - ${portfolio.portfolio_name}`,
                type: 'Portfolio',
                location: portfolio.location,
                currency: portfolio.currency,
                amount: portfolio.sip_amount,
                frequency: 'Monthly',
                start_date: portfolio.buying_date,
                end_date: portfolio.is_plan_to_sell ? portfolio.sale_date : ''
            }));

            const otherAssetSIPs = otherAssetsList
            .filter(otherAsset => {
                if (otherAsset.is_recurring_payment && new Date(otherAsset.payment_end_date) <= new Date()) return true;
                else return false;
            })
            .map(otherAsset => ({
                id: `otherassetsip-${otherAsset.id}`,
                name: `SIP - ${otherAsset.asset_name}`,
                type: 'Other Asset',
                location: otherAsset.location,
                currency: otherAsset.currency,
                amount: otherAsset.payment_amount,
                frequency: otherAsset.payment_frequency,
                start_date: otherAsset.start_date,
                end_date: otherAsset.payment_end_date
            }));

            setSIPs([...depositSIPs, ...portfolioSIPs, ...otherAssetSIPs]); // Set combined SIPs to state
            setSIPsFetched(true); // Set sipsFetched to true after fetching
            if (onSIPsFetched) {
                onSIPsFetched(depositSIPs.length + portfolioSIPs.length + otherAssetSIPs.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching SIPs:', error);
        }
    };

    useEffect(() => {
        fetchSIPs();
    }, [currentUserId]);

    useImperativeHandle(ref, () => ({
        getSIPCount() {
            return sipsFetched ? sips.length : 0; // Return count only if sips are fetched
        }
    }));

    const columns = [
        { field: 'name', headerName: 'SIP Name', width: 200, headerClassName: 'header-theme'},
        { field: 'type', headerName: 'SIP Type', width: 100, headerClassName: 'header-theme'},
        { field: 'location', headerName: 'SIP Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'amount', headerName: 'Total  (/mth)', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.amount);
         }},
        { field: 'frequency', headerName: 'Payment Frequency', width: 100, headerClassName: 'header-theme' },
        { field: 'start_date', headerName: 'Start Date', width: 150, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 150, headerClassName: 'header-theme' },
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
                rows={sips}
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
        </>
    );
});

export default SIPList;