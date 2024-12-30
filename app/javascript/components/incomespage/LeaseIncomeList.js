import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import '../common/GridHeader.css';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';

export const filterLeaseIncomes = (vehiclesList) => {

    const today = new Date();
    const leases = vehiclesList
        .filter(vehicle => !vehicle.is_plan_to_sell || (new Date(vehicle.sale_date) >= today))
        .filter(vehicle => vehicle.is_on_lease && 
            (new Date(vehicle.lease_start_date) <= today) && 
            (!vehicle.lease_end_date || new Date(vehicle.lease_end_date) >= today) &&
            (vehicle.lease_amount > 0) &&
            (vehicle.is_dream === false)
        )
        .map(vehicle => ({
            id: `lease-${vehicle.id}`,
            income_name: `Lease Income - ${vehicle.vehicle_name}`,
            income_type: 'Lease',
            location: vehicle.location,
            currency: vehicle.currency,
            amount: vehicle.lease_amount,
            start_date: vehicle.lease_start_date,
            end_date: vehicle.lease_end_date,
            is_recurring: true,
            income_frequency: 'Monthly'
        }));

    return leases;
};

const LeaseIncomeList = ({ vehiclesList }) => {

    const [incomes, setIncomes] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    useEffect(() => {
        const leases = filterLeaseIncomes(vehiclesList);
        setIncomes(leases);
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
    );
};

export default LeaseIncomeList;