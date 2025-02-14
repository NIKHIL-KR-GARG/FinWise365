import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';
import { calculateMortgageBalance, calculateFlatRateLoanBalance } from '../../calculators/Assets';
import { getExchangeRate } from '../../common/ExchangeRate';

export const fetchPropertyMortgageAndLoans = (propertiesList) => {
    try {
        const propertyMortgageAndLoans = propertiesList
        .filter(property => {
            // derive end date based on purchase date and loan_duration
            if (property.is_plan_to_sell && new Date(property.sale_date) < new Date()) return false;
            else if (property.is_dream === true) return false;
            else if (!property.is_funded_by_loan) return false;
            else {
                const startDate = new Date(property.purchase_date);
                const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(property.loan_duration)));
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
            end_date: `${new Date(new Date(property.purchase_date).setMonth(new Date(property.purchase_date).getMonth() + 1 + parseInt(property.loan_duration))).toISOString().split('T')[0]}`
        }));

        return propertyMortgageAndLoans;

    } catch (error) {
        console.error('Error fetching MortgageAndLoans:', error);
    }
};

export const fetchVehicleMortgageAndLoans = (vehiclesList) => {
    try {
        const vehicleMortgageAndLoans = vehiclesList
        .filter(vehicle => {
            if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < new Date()) return false;
            else if (vehicle.is_dream === true) return false;
            else if (!vehicle.is_funded_by_loan) return false;
            else {
                // derive end date based on purchase date and loan_duration
                const startDate = new Date(vehicle.purchase_date);
                const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(vehicle.loan_duration)));
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
            end_date: `${new Date(new Date(vehicle.purchase_date).setMonth(new Date(vehicle.purchase_date).getMonth() + 1 + parseInt(vehicle.loan_duration))).toISOString().split('T')[0]}`
        }));

        return vehicleMortgageAndLoans;

    } catch (error) {
        console.error('Error fetching MortgageAndLoans:', error);
    }
};

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
    const [sortingModel, setSortingModel] = useState([{ field: 'name', sort: 'asc' }]); // Initialize with default sorting

    const currentUserBaseCurrency = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientBaseCurrency') : localStorage.getItem('currentUserBaseCurrency');

    useEffect(() => {
        const propertyMortgageAndLoans = fetchPropertyMortgageAndLoans(propertiesList);
        const vehicleMortgageAndLoans = fetchVehicleMortgageAndLoans(vehiclesList);

        setMortgageAndLoans([...propertyMortgageAndLoans, ...vehicleMortgageAndLoans]); // Set combined MortgageAndLoans to state
        setMortgageAndLoansFetched(true); // Set mortgageandloansFetched to true after fetching

        if (onMortgageAndLoansFetched) {
            const count = propertyMortgageAndLoans.length + vehicleMortgageAndLoans.length;
            let amount = 0;
            // loop through the propertyMortgageAndLoans to calculate the total balance amount
            for (let i = 0; i < propertyMortgageAndLoans.length; i++) {
                let propertyMortgage = propertyMortgageAndLoans[i];
                amount += propertyMortgage.balance_amount * getExchangeRate(propertyMortgage.currency, currentUserBaseCurrency);
            }
            // loop through the vehicleMortgageAndLoans to calculate the total balance amount
            for (let i = 0; i < vehicleMortgageAndLoans.length; i++) {
                let vehicleMortgage = vehicleMortgageAndLoans[i];
                amount += vehicleMortgage.balance_amount * getExchangeRate(vehicleMortgage.currency, currentUserBaseCurrency);
            }
            onMortgageAndLoansFetched(count, amount); // Notify parent component
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getMortgageAndLoanCount() {
            return mortgageandloansFetched ? mortgageandloans.length : 0; // Return count only if mortgageandloans are fetched
        },
        getMortgageAndLoanAmount() {
            let amount = 0;
            // loop through the mortgageandloans to calculate the total balance amount
            for (let i = 0; i < mortgageandloans.length; i++) {
                let mortgage = mortgageandloans[i];
                amount += mortgage.balance_amount * getExchangeRate(mortgage.currency, currentUserBaseCurrency);
            }
            return amount;
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
        { field: 'original_amount', headerName: 'Original Amount', width: 125, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.orginal_amount);
         }},
         { field: 'balance_amount', headerName: 'Balance Amount', width: 125, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.balance_amount);
         }},
        { field: 'start_date', headerName: 'Start Date', width: 125, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 125, headerClassName: 'header-theme' },
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
        </>
    );
});

export default MortgageAndLoanList;