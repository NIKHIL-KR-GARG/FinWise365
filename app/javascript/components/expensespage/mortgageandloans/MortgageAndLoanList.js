import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';
import { calculateMortgageBalance, calculateFlatRateLoanBalance } from '../../calculators/Assets';

const MortgageAndLoanList = forwardRef((props, ref) => {
    const { onMortgageAndLoansFetched, propertiesList, vehiclesList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [mortgageandloans, setMortgageAndLoans] = useState({
        id: '',
        name: '',
        type: '',
        location: '',
        currency: '',
        orginal_amount: 0,
        balance_amount: 0,
        start_date: '',
        end_date: ''
    });
    const [mortgageandloansFetched, setMortgageAndLoansFetched] = useState(false); // State to track if mortgageandloans are fetched
    const theme = useTheme();
    const [sortingModel, setSortingModel] = useState([{ field: 'mortgageandloan_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchMortgageAndLoans = (propertiesList, vehiclesList) => {
        try {
            const propertyMortgageAndLoans = propertiesList
            .filter(property => {
                // derive end date based on purchase date and loan_duration
                if (property.is_plan_to_sell && new Date(property.sale_date) < new Date()) return false;
                else if (!property.is_funded_by_loan) return false;
                else {
                    const startDate = new Date(property.purchase_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(property.loan_duration)));
                    return endDate >= new Date();
                }
            })
            .map(property => ({
                id: `propertymortgageandloan-${property.id}`,
                name: `Mortgage - ${property.property_name}`,
                type: 'Property',
                location: property.location,
                currency: property.currency,
                orginal_amount: property.loan_amount,
                balance_amount: calculateMortgageBalance(property, new Date()),
                start_date: property.purchase_date,
                end_date: `${new Date(new Date(property.purchase_date).setMonth(new Date(property.purchase_date).getMonth() + parseInt(property.loan_duration))).toISOString().split('T')[0]}`
            }));

            const vehicleMortgageAndLoans = vehiclesList
            .filter(vehicle => {
                if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < new Date()) return false;
                else if (!vehicle.is_funded_by_loan) return false;
                else {
                    // derive end date based on purchase date and loan_duration
                    const startDate = new Date(vehicle.purchase_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(vehicle.loan_duration)));
                    return endDate >= new Date();
                }
            })
            .map(vehicle => ({
                id: `vehiclemortgageandloan-${vehicle.id}`,
                name: `Loan - ${vehicle.vehicle_name}`,
                type: 'Vehicle',
                location: vehicle.location,
                currency: vehicle.currency,
                orginal_amount: vehicle.loan_amount,
                balance_amount: calculateFlatRateLoanBalance(vehicle, new Date()),
                start_date: vehicle.purchase_date,
                end_date: `${new Date(new Date(vehicle.purchase_date).setMonth(new Date(vehicle.purchase_date).getMonth() + parseInt(vehicle.loan_duration))).toISOString().split('T')[0]}`
            }));

            setMortgageAndLoans([...propertyMortgageAndLoans, ...vehicleMortgageAndLoans]); // Set combined MortgageAndLoans to state
            setMortgageAndLoansFetched(true); // Set mortgageandloansFetched to true after fetching
            if (onMortgageAndLoansFetched) {
                const count = propertyMortgageAndLoans.length + vehicleMortgageAndLoans.length;
                const amount = propertyMortgageAndLoans.reduce((acc, property) => acc + property.balance_amount, 0) + vehicleMortgageAndLoans.reduce((acc, vehicle) => acc + vehicle.balance_amount, 0);
                onMortgageAndLoansFetched(count, amount); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching MortgageAndLoans:', error);
        }
    };

    useEffect(() => {
        fetchMortgageAndLoans(propertiesList, vehiclesList);
    }, []);

    useImperativeHandle(ref, () => ({
        getMortgageAndLoanCount() {
            return mortgageandloansFetched ? mortgageandloans.length : 0; // Return count only if mortgageandloans are fetched
        },
        getMortgageAndLoanAmount() {
            return mortgageandloans.reduce((acc, mortgageandloan) => acc + mortgageandloan.balance_amount, 0);
        }   
    }));

    const columns = [
        { field: 'name', headerName: 'Name', width: 200, headerClassName: 'header-theme'},
        { field: 'type', headerName: 'Type', width: 100, headerClassName: 'header-theme'},
        { field: 'location', headerName: 'Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'original_amount', headerName: 'Original Amount', width: 150, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.orginal_amount);
         }},
         { field: 'balance_amount', headerName: 'Balance Amount', width: 150, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.balance_amount);
         }},
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
                rows={mortgageandloans}
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

export default MortgageAndLoanList;