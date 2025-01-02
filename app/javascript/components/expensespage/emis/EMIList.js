import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

export const fetchPropertyEMIs = (propertiesList, showDreams) => {
    try {
        let propertyEMIs = [];
        
        if (!showDreams) {
            propertyEMIs = propertiesList
            .filter(property => {
                if (property.is_plan_to_sell && new Date(property.sale_date) < new Date()) return false;
                else if (property.is_dream === true) return false;
                else if (!property.is_funded_by_loan) return false;
                else {
                    const startDate = new Date(property.loan_as_of_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(property.loan_duration)));
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
                start_date: property.loan_as_of_date,
                end_date: `${new Date(new Date(property.loan_as_of_date).setMonth(new Date(property.loan_as_of_date).getMonth() + 1 + parseInt(property.loan_duration))).toISOString().split('T')[0]}`
            }));
        }
        else {
            propertyEMIs = propertiesList
            .filter(property => {
                if (property.is_dream === false) return false;
                else if (!property.is_funded_by_loan) return false;
                else {
                    const startDate = new Date(property.loan_as_of_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(property.loan_duration)));
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
                start_date: property.loan_as_of_date,
                end_date: `${new Date(new Date(property.loan_as_of_date).setMonth(new Date(property.loan_as_of_date).getMonth() + 1 + parseInt(property.loan_duration))).toISOString().split('T')[0]}`
            }));
        }
        
        return propertyEMIs;

    } catch (error) {
        console.error('Error fetching EMIs:', error);
    }
};

export const fetchVehicleEMIs = (propertiesList, showDreams) => {
    try {
        let vehicleEMIs = [];
        
        if (!showDreams) {
            vehicleEMIs = propertiesList
            .filter(vehicle => {
                if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < new Date()) return false;
                else if (vehicle.is_dream === true) return false;
                else if (!vehicle.is_funded_by_loan) return false;
                else {
                    const startDate = new Date(vehicle.loan_as_of_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(vehicle.loan_duration)));
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
                start_date: vehicle.loan_as_of_date,
                end_date: `${new Date(new Date(vehicle.loan_as_of_date).setMonth(new Date(vehicle.loan_as_of_date).getMonth() + 1 + parseInt(vehicle.loan_duration))).toISOString().split('T')[0]}`
            }));
        }
        else {
            vehicleEMIs = propertiesList
            .filter(vehicle => {
                if (vehicle.is_dream === false) return false;
                else if (!vehicle.is_funded_by_loan) return false;
                else {
                    const startDate = new Date(vehicle.loan_as_of_date);
                    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(vehicle.loan_duration)));
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
                start_date: vehicle.loan_as_of_date,
                end_date: `${new Date(new Date(vehicle.loan_as_of_date).setMonth(new Date(vehicle.loan_as_of_date).getMonth() + 1 + parseInt(vehicle.loan_duration))).toISOString().split('T')[0]}`
            }));
        }
        
        return vehicleEMIs;

    } catch (error) {
        console.error('Error fetching EMIs:', error);
    }
};

export const fetchDreamEMIs = (dreamsList) => {
    try {
        const dreamEMIs = dreamsList
        .filter(dream => {
            if (!dream.is_funded_by_loan) return false;
            else return true;
        })
        .map(dream => ({
            id: `dreamemi-${dream.id}`,
            name: `EMI - ${dream.dream_name}`,
            type: 'Dream',
            location: dream.location,
            currency: dream.currency,
            amount: dream.emi_amount,
            start_date: dream.loan_start_date,
            end_date: dream.loan_end_date
        }));

        return dreamEMIs;

    } catch (error) {
        console.error('Error fetching EMIs:', error);
    }
};

const EMIList = forwardRef((props, ref) => {
    const { onEMIsFetched, showDreams, propertiesList, vehiclesList, dreamsList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [emis, setEMIs] = useState({
        id: '',
        name: '',
        type: '',
        location: '',
        currency: '',
        amount: 0,
        start_date: '',
        end_date: ''
    });
    const [emisFetched, setEMIsFetched] = useState(false); // State to track if emis are fetched
    const theme = useTheme();
    const [sortingModel, setSortingModel] = useState([{ field: 'name', sort: 'asc' }]); // Initialize with default sorting

    useEffect(() => {
        const propertyEMIs = fetchPropertyEMIs(propertiesList, showDreams);
        const vehicleEMIs = fetchVehicleEMIs(vehiclesList, showDreams);
        let dreamEMIs = [];
        if (showDreams && dreamsList) {
            dreamEMIs = fetchDreamEMIs(dreamsList);
            setEMIs([...propertyEMIs, ...vehicleEMIs, ...dreamEMIs]); // Set combined EMIs to state
        }
        else {
            setEMIs([...propertyEMIs, ...vehicleEMIs]); // Set combined EMIs to state
        }
        
        setEMIsFetched(true); // Set emisFetched to true after fetching

        if (onEMIsFetched) {
            if (showDreams) onEMIsFetched(propertyEMIs.length + vehicleEMIs.length + dreamEMIs.length); // Notify parent component
            else onEMIsFetched(propertyEMIs.length + vehicleEMIs.length); // Notify parent component
        }
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

export default EMIList;