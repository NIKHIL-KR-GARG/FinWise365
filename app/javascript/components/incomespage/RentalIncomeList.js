import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import '../common/GridHeader.css';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';

export const filterRentalIncomes = (propertiesList, showDreams) => {

    const today = new Date();
    let rentalIncomes = [];

    if (!showDreams) {
        rentalIncomes = propertiesList
            .filter(property => !property.is_plan_to_sell || (new Date(property.sale_date) >= today))
            .filter(property => property.is_on_rent &&
                (new Date(property.rental_start_date) <= today) &&
                (!property.rental_end_date || new Date(property.rental_end_date) >= today) &&
                (property.rental_amount > 0) &&
                (property.is_dream === false)
            )
            .map(property => ({
                id: `rental-${property.id}`,
                income_name: `Rental Income - ${property.property_name}`,
                income_type: 'Rental',
                location: property.location,
                currency: property.currency,
                amount: property.rental_amount,
                start_date: property.rental_start_date,
                end_date: property.rental_end_date,
                is_recurring: true,
                income_frequency: 'Monthly'
            }));
    }
    else {
        rentalIncomes = propertiesList
        .filter(property => property.is_dream && property.is_on_rent)
        .map(property => ({
            id: `rental-${property.id}`,
            income_name: `Rental Income - ${property.property_name}`,
            income_type: 'Rental',
            location: property.location,
            currency: property.currency,
            amount: property.rental_amount,
            start_date: property.rental_start_date,
            end_date: property.rental_end_date,
            is_recurring: true,
            income_frequency: 'Monthly'
        }));
    }

    return rentalIncomes;
};

const RentalIncomeList = ({ propertiesList, showDreams }) => {

    const [incomes, setIncomes] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    useEffect(() => {
        const rentalIncomes = filterRentalIncomes(propertiesList, showDreams);
        setIncomes(rentalIncomes);
    }, []);

    const columns = [
        {
            field: 'income_name',
            headerName: 'Income Name',
            width: 150,
            headerClassName: 'header-theme'
        },
        { field: 'income_type', headerName: 'Income Type', width: 100, headerClassName: 'header-theme' },
        {
            field: 'location', headerName: 'Income Location', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                const countryCode = params.value;
                const country = CountryList.filter(e => e.code === countryCode);
                if (country.length > 0) return country[0].name;
                else return params.value
            }
        },
        { field: 'currency', headerName: 'Currency', width: 100, headerClassName: 'header-theme' },
        {
            field: 'amount', headerName: 'Income Amount', width: 100, headerClassName: 'header-theme', renderCell: (params) => {
                return FormatCurrency(params.row.currency, params.row.amount);
            }
        },
        { field: 'start_date', headerName: 'Start Date', width: 100, headerClassName: 'header-theme' },
        { field: 'end_date', headerName: 'End Date', width: 100, headerClassName: 'header-theme' },
        { field: 'is_recurring', headerName: 'Recurring', width: 90, headerClassName: 'header-theme', type: 'boolean' },
        { field: 'income_frequency', headerName: 'Frequency', width: 100, headerClassName: 'header-theme'},
    ];

    return (
            <DataGrid
                //key={gridKey} // Add the key prop to the DataGrid
                width="100%"
                rows={incomes}
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
    );
};

export default RentalIncomeList;