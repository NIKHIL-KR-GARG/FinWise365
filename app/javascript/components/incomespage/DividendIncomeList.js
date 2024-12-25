import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import '../common/GridHeader.css';
import CountryList from '../common/CountryList';
import { FormatCurrency } from  '../common/FormatCurrency';
import { portfolioAssetValue } from '../calculators/Assets';

const DividendIncomeList = ({ portfoliosList }) => {

    const [incomes, setIncomes] = useState([]);
    const [sortingModel, setSortingModel] = useState([{ field: 'income_name', sort: 'asc' }]); // Initialize with default sorting

    const filterIncomes = (portfoliosList) => {

        const today = new Date();
        const dividends = portfoliosList
            .filter(portfolio => portfolio.is_paying_dividend && 
                (new Date(portfolio.buying_date) <= today) && 
                (!portfolio.sale_date || new Date(portfolio.sale_date) >= today) &&
                (portfolio.is_dream === false) &&
                (portfolio.dividend_rate > 0)
            )
            .map(portfolio => ({
                id: `dividend-${portfolio.id}`,
                income_name: `Dividend Income - ${portfolio.portfolio_name}`,
                income_type: 'Dividend',
                location: portfolio.location,
                currency: portfolio.currency,
                amount: calculateDividendAmount(parseFloat(portfolioAssetValue(portfolio, new Date(), portfolio.currency)), portfolio.dividend_frequency, portfolio.dividend_rate),
                start_date: portfolio.buying_date,
                end_date: portfolio.sale_date,
                is_recurring: true,
                income_frequency: portfolio.dividend_frequency
            }));

        setIncomes(dividends);
    };

    useEffect(() => {
        filterIncomes(portfoliosList);
    }, []);

    const calculateDividendAmount = (value, frequency, rate) => {
        let dividendAmount = value * (rate / 100);
        if (frequency === 'Monthly') dividendAmount = dividendAmount / 12;
        else if (frequency === 'Quarterly') dividendAmount = dividendAmount / 4;
        else if (frequency === 'Semi-Annually') dividendAmount = dividendAmount / 2;
        return parseFloat(dividendAmount).toFixed(2);
    };

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

export default DividendIncomeList;