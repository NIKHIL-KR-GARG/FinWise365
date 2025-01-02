import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import '../common/GridHeader.css';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';

export const filterPayoutIncomes = (otherAssetsList, showDreams) => {
    
    const today = new Date();
    let payouts = [];

    if (!showDreams) {
        payouts = otherAssetsList
            .filter(otherAsset => otherAsset.is_dream === false && otherAsset.payout_value > 0)
            .filter(otherAsset => {
                const payoutDate = new Date(otherAsset.payout_date);
                const payoutDuration = otherAsset.payout_duration ? parseInt(otherAsset.payout_duration) : 0;
                const payoutEndDate = new Date(payoutDate.setMonth(payoutDate.getMonth() + 1 + payoutDuration));
                return payoutEndDate > today;
            })
            .map(otherAsset => ({
                id: `payout-${otherAsset.id}`,
                income_name: `PayOut Income - ${otherAsset.asset_name}`,
                income_type: 'PayOut',
                location: otherAsset.location,
                currency: otherAsset.currency,
                amount: otherAsset.payout_value,
                start_date: otherAsset.payout_date,
                end_date: `${otherAsset.payout_type === 'Recurring'
                        ? new Date(new Date(otherAsset.payout_date).setMonth(new Date(otherAsset.payout_date).getMonth() + 1 + parseInt(otherAsset.payout_duration))).toISOString().split('T')[0]
                        : new Date(otherAsset.payout_date).toISOString().split('T')[0]
                    }`,
                is_recurring: otherAsset.payout_type === 'Recurring',
                income_frequency: otherAsset.payout_frequency
            }));
    }
    else {
        payouts = otherAssetsList
            .filter(otherAsset => otherAsset.is_dream && otherAsset.payout_type === 'Recurring')
            .map(otherAsset => ({
                id: `payout-${otherAsset.id}`,
                income_name: `PayOut Income - ${otherAsset.asset_name}`,
                income_type: 'PayOut',
                location: otherAsset.location,
                currency: otherAsset.currency,
                amount: otherAsset.payout_value,
                start_date: otherAsset.payout_date,
                end_date: `${otherAsset.payout_type === 'Recurring'
                        ? new Date(new Date(otherAsset.payout_date).setMonth(new Date(otherAsset.payout_date).getMonth() + 1 + parseInt(otherAsset.payout_duration))).toISOString().split('T')[0]
                        : new Date(otherAsset.payout_date).toISOString().split('T')[0]
                    }`,
                is_recurring: otherAsset.payout_type === 'Recurring',
                income_frequency: otherAsset.payout_frequency
            }));
    }

    return payouts;
};

const PayoutIncomeList = ({ otherAssetsList, showDreams }) => {

    const [incomes, setIncomes] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    useEffect(() => {
        const payouts = filterPayoutIncomes(otherAssetsList, showDreams);
        setIncomes(payouts);
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

export default PayoutIncomeList;