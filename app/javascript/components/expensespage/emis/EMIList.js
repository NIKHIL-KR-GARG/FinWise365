import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import FormatCurrency from '../../common/FormatCurrency';

const EMIList = forwardRef((props, ref) => {
    const { onEMIsFetched, propertiesList, vehiclesList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [emis, setEMIs] = useState({
        id: '',
        name: '',
        location: '',
        currency: '',
        emi_amount: 0,
        start_date: '',
        end_date: ''
    });
    const [emisFetched, setEMIsFetched] = useState(false); // State to track if emis are fetched
    const theme = useTheme();
    const [sortingModel, setSortingModel] = useState([{ field: 'emi_name', sort: 'asc' }]); // Initialize with default sorting

    const fetchEMIs = (propertiesList, vehiclesList) => {
        try {
            const propertyEMIs = propertiesList
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
                id: `propertyemi-${property.id}`,
                name: `EMI - ${property.property_name}`,
                type: 'Property',
                location: property.location,
                currency: property.currency,
                amount: property.emi_amount,
                start_date: property.purchase_date,
                end_date: `${new Date(new Date(property.purchase_date).setMonth(new Date(property.purchase_date).getMonth() + parseInt(property.loan_duration)))}`
            }));

            const vehicleEMIs = vehiclesList
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
                id: `vehicleemi-${vehicle.id}`,
                name: `EMI - ${vehicle.vehicle_name}`,
                type: 'Vehicle',
                location: vehicle.location,
                currency: vehicle.currency,
                amount: vehicle.emi_amount,
                start_date: vehicle.purchase_date,
                end_date: `${new Date(new Date(vehicle.purchase_date).setMonth(new Date(vehicle.purchase_date).getMonth() + parseInt(vehicle.loan_duration)))}`
            }));

            setEMIs([...propertyEMIs, ...vehicleEMIs]); // Set combined EMIs to state
            setEMIsFetched(true); // Set emisFetched to true after fetching
            if (onEMIsFetched) {
                onEMIsFetched(propertyEMIs.length + vehicleEMIs.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching EMIs:', error);
        }
    };

    useEffect(() => {
        fetchEMIs(propertiesList, vehiclesList);
    }, []);

    useImperativeHandle(ref, () => ({
        getEMICount() {
            return emisFetched ? emis.length : 0; // Return count only if emis are fetched
        }
    }));

    const columns = [
        { field: 'name', headerName: 'EMI Name', width: 200, headerClassName: 'header-theme'},
        { field: 'type', headerName: 'EMI Type', width: 100, headerClassName: 'header-theme'},
        { field: 'location', headerName: 'EMI Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'amount', headerName: 'Total  (/mth)', width: 150, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.amount);
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
                rows={emis}
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

export default EMIList;