import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '../../common/GridHeader.css';
import CountryList from '../../common/CountryList';
import { FormatCurrency } from  '../../common/FormatCurrency';

const TaxList = forwardRef((props, ref) => {
    const { onTaxesFetched, assetPropertiesList } = props; // Destructure the new prop
    
    const [successMessage, setSuccessMessage] = useState('');
    const [taxes, setTaxes] = useState({
        id: '',
        name: '',
        type: '',
        location: '',
        currency: '',
        tax_amount: 0,
        frequency: '',
        start_date: '',
        end_date: ''
    });
    const [taxesFetched, setTaxesFetched] = useState(false); // State to track if taxes are fetched
    const theme = useTheme();
    const [sortingModel, setSortingModel] = useState([{ field: 'tax_name', sort: 'asc' }]); // Initialize with default sorting
    
    const fetchTaxes = (assetPropertiesList) => {
        try {
            // filter asset properties and add to taxes list
            const propertyTax = assetPropertiesList
                .filter(assetProperty => {
                    if (assetProperty.is_under_construction && new Date(assetProperty.possession_date) > new Date()) return false;
                    else if (new Date(assetProperty.purchase_date) <= new Date() &&
                        (!assetProperty.is_plan_to_sell || new Date(assetProperty.sale_date) >= new Date()))
                        return true;
                    else return false;
                })
                .map(assetProperty => ({
                    id: `propertytax-${assetProperty.id}`,
                    name: `Tax - ${assetProperty.property_name}`,
                    type: 'Property Tax',
                    location: assetProperty.location,
                    currency: assetProperty.currency,
                    tax_amount: assetProperty.property_tax,
                    frequency: 'Monthly',
                    // if property is under construction, start_date is possession_date else start date is purchase_date
                    start_date: assetProperty.is_under_construction ? assetProperty.possession_date : assetProperty.purchase_date,
                    // if is plan to sell, end_date is sale_date else end_date is null
                    end_date: assetProperty.is_plan_to_sell ? assetProperty.sale_date : ""
                }));

            setTaxes([...propertyTax]);
            setTaxesFetched(true); // Set taxesFetched to true after fetching
            if (onTaxesFetched) {
                onTaxesFetched(propertyTax.length); // Notify parent component
            }
        } catch (error) {
            console.error('Error fetching Taxes:', error);
        }
    };

    useEffect(() => {
        fetchTaxes(assetPropertiesList);
    }, []);

    useImperativeHandle(ref, () => ({
        getTaxCount() {
            return taxesFetched ? taxes.length : 0; // Return count only if taxes are fetched
        }
    }));

    const columns = [
        { field: 'name', headerName: 'Tax Name', width: 200, headerClassName: 'header-theme'},
        { field: 'type', headerName: 'Tax Type', width: 100, headerClassName: 'header-theme'},
        { field: 'location', headerName: 'Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
            const countryCode = params.value;
            const country = CountryList.filter(e => e.code === countryCode);
            if (country.length > 0) return country[0].name;
            else return params.value
        }},
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        { field: 'tax_amount', headerName: 'Tax Amount', width: 100, headerClassName: 'header-theme' , renderCell: (params) => {
            return FormatCurrency(params.row.currency, params.row.tax_amount);
         }},
        { field: 'frequency', headerName: 'Tax Frequency', width: 100, headerClassName: 'header-theme' },
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
                rows={taxes}
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

export default TaxList;