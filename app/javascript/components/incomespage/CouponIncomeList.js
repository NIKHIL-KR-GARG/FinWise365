import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import '../common/GridHeader.css';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';

const CouponIncomeList = ({ portfoliosList }) => {

    const [incomes, setIncomes] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    const filterIncomes = (portfoliosList) => {

        const today = new Date();
        const coupons = portfoliosList
            .filter(portfolio => portfolio.portfolio_type === 'Bonds' && 
                (new Date(portfolio.buying_date) <= today) && 
                (!portfolio.sale_date || new Date(portfolio.sale_date) >= today) &&
                (portfolio.is_dream === false) &&
                (portfolio.coupon_rate > 0)
            )
            .map(portfolio => {
                let amount;
                switch (portfolio.coupon_frequency) {
                    case 'Monthly':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 12;
                        break;
                    case 'Quarterly':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 4;
                        break;
                    case 'Semi-Annually':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100 / 2;
                        break;
                    case 'Annually':
                        amount = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100;
                        break;
                    default:
                        amount = 0;
                }
                return {
                    id: `coupon-${portfolio.id}`,
                    income_name: `Coupon Income - ${portfolio.portfolio_name}`,
                    income_type: 'Coupon',
                    location: portfolio.location,
                    currency: portfolio.currency,
                    amount: amount,
                    start_date: portfolio.buying_date,
                    end_date: portfolio.sale_date,
                    is_recurring: true,
                    income_frequency: portfolio.coupon_frequency
                };
            });

        setIncomes(coupons);
    };

    useEffect(() => {
        filterIncomes(portfoliosList);
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

export default CouponIncomeList;