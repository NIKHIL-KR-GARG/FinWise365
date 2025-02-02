import React, { useState } from "react";
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // PMS portfolio icon
import DescriptionIcon from '@mui/icons-material/Description'; // Excel icon
import * as XLSX from "xlsx";
import { useTheme } from '@mui/material/styles'; // Add this import
import { FormatCurrency } from  '../../common/FormatCurrency';
import axios from 'axios';

const AssetPortfolioDetails = ({ portfolio: initialPortfolio, portfoliodetails: initialPortfolioDetails, action: initialAction, onCloseDetails, onCloseForm, refreshPortfolioList }) => {
    
    const [nextId, setNextId] = useState(0);
    const theme = useTheme(); 

    const currentUserId = localStorage.getItem('currentUserId');
    const portfolioCurrency = initialPortfolio.currency;

    const [portfoliodetails, setPortfolioDetails] = useState(initialPortfolioDetails || {
        user_id: 0,
        portfolio_id: 0,
        scrip: '',
        description: '',
        quantity: 0,
        buy_date: '',
        buy_price: 0,
        buy_tax_and_charges: 0,
        sale_date: '',
        sale_price: 0,
        sale_tax_and_charges: 0,
        current_price: 0,
    });

    const headers = [
        "scrip", "description", "quantity", "buy_date", "buy_price", "buy_tax_and_charges", 
        "sale_date", "sale_price", "sale_tax_and_charges", "current_price"
    ];

    const handleDownload = () => {
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "portfolio");

        const date = new Date();
        const timestamp = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const fileName = `portfolio_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headers = jsonData[0];
            const rows = jsonData.slice(1).map((row, index) => {
                const rowData = { 
                    id: -(nextId + portfoliodetails.length + index + 1), // Assign negative ID
                    actions: '', 
                    current_price: 0,
                    total_buy_value: 0,
                    total_sale_value: 0,
                    current_value: 0,
                    profit_loss: 0
                }; 
                headers.forEach((header, i) => {
                    if (header === 'buy_date' || header === 'sale_date') {
                        rowData[header] = row[i] ? new Date(Math.round((row[i] - 25569) * 86400 * 1000)).toISOString().split('T')[0] : '';
                    } else {
                        rowData[header] = row[i] || 0;
                    }
                });
                return rowData;
            }).filter(row => Object.values(row).some(value => value !== '' && value !== 0));
            setPortfolioDetails(prevDetails => [...prevDetails, ...rows]);
            setNextId(prevId => prevId + rows.length);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: -(nextId + 1), // Assign negative ID
            actions: '', 
            current_price: 0,
            total_buy_value: 0,
            total_sale_value: 0,
            current_value: 0,
            profit_loss: 0
        }; 
        headers.forEach(header => {
            newRow[header] = '';
        });
        setPortfolioDetails([...portfoliodetails, newRow]);
        setNextId(nextId + 1);
    };

    const processRowUpdate = (newRow) => {
        const updatedData = portfoliodetails.map(row => (row.id === newRow.id ? { ...newRow, actions: '' } : row));
        setPortfolioDetails(updatedData);
        return newRow;
    };

    const handleSave = async () => {
        initialPortfolio.user_id = initialPortfolio.is_dummy_data ? 0 : currentUserId;
        const response = (initialAction === 'Add')
            ? await axios.post('/api/asset_portfolios', initialPortfolio)
            : await axios.put(`/api/asset_portfolios/${initialPortfolio.id}`, initialPortfolio);

        const portfolioId = response.data.id;
        const portfolioDetails = portfoliodetails.map(row => {
            row.user_id = currentUserId;
            row.portfolio_id = portfolioId;
            if (row.id < 0) {
                row.id = null; // Set id to 0 for new records before saving
            }
            return row;
        });

        for (const detail of portfolioDetails) {
            if (detail.id === null) {
                // New record, add to the database
                await axios.post('/api/asset_portfolio_details', detail);
            } else {
                // Existing record, update in the database
                await axios.put(`/api/asset_portfolio_details/${detail.id}`, detail);
            }
        }
        console.log("Save operation completed");
        if (onCloseDetails) onCloseDetails(); // Close Details Modal
        if (onCloseForm) onCloseForm(); // Close Form Modal
        if (refreshPortfolioList) refreshPortfolioList(response.data, 'Portfolio updated successfully'); // Refresh Portfolio List
    };

    const columns = [
        { field: 'scrip', headerName: 'Scrip', width: 100, headerClassName: 'header-theme', editable: true },
        { field: 'description', headerName: 'Description', width: 100, headerClassName: 'header-theme', editable: true },
        { field: 'quantity', headerName: 'Quantity', width: 75, headerClassName: 'header-theme', editable: true },
        { field: 'buy_date', headerName: 'Buy Date', width: 125, headerClassName: 'header-theme', editable: true, renderCell: (params) => { 
            if (!params.row.buy_date) {
                return '';
            }
            else {
                const date = new Date(params.row.buy_date);
                return date.toDateString();
            }
        }},
        { field: 'buy_price', headerName: 'Buy Price', width: 90, headerClassName: 'header-theme', editable: true, renderCell: (params) => {
            return FormatCurrency(portfolioCurrency, params.row.buy_price);
         }},
        { field: 'buy_tax_and_charges', headerName: 'Buy Tax', width: 90, headerClassName: 'header-theme', editable: true , renderCell: (params) => {
            return FormatCurrency(portfolioCurrency, params.row.buy_tax_and_charges);
        }},
        { field: 'total_buy_value', headerName: 'Total Buy Value', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const buyPrice = parseFloat(params.row.buy_price) || 0;
            const quantity = parseFloat(params.row.quantity) || 0;
            const buyTaxAndCharges = parseFloat(params.row.buy_tax_and_charges) || 0;
            return FormatCurrency(portfolioCurrency, (buyPrice * quantity) + buyTaxAndCharges);
        }},
        { field: 'sale_date', headerName: 'Sale Date', width: 125, headerClassName: 'header-theme', editable: true , renderCell: (params) => { 
            if (!params.row.sale_date) {
                return '';
            }
            else {
                const date = new Date(params.row.sale_date);
                return date.toDateString();
            }
        }},
        { field: 'sale_price', headerName: 'Sale Price', width: 90, headerClassName: 'header-theme', editable: true , renderCell: (params) => {
            return FormatCurrency(portfolioCurrency, params.row.sale_price);
        }},
        { field: 'sale_tax_and_charges', headerName: 'Sell Tax', width: 90, headerClassName: 'header-theme', editable: true, renderCell: (params) => {
            return FormatCurrency(portfolioCurrency, params.row.sale_tax_and_charges);
         }},
        { field: 'total_sale_value', headerName: 'Total Sell Value', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const salePrice = parseFloat(params.row.sale_price) || 0;
            const quantity = parseFloat(params.row.quantity) || 0;
            const saleTaxAndCharges = parseFloat(params.row.sale_tax_and_charges) || 0;
            return FormatCurrency((salePrice * quantity) - saleTaxAndCharges);
        }},
        { field: 'current_price', headerName: 'Current Price', width: 90, headerClassName: 'header-theme', editable: true},
        { field: 'current_value', headerName: 'Current Value', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const currentPrice = parseFloat(params.row.current_price) || 0;
            const quantity = parseFloat(params.row.quantity) || 0;
            return FormatCurrency(currentPrice * quantity); 
        }},
        { field: 'profit_loss', headerName: 'Profit/Loss', width: 120, headerClassName: 'header-theme', renderCell: (params) => {
            const buyPrice = parseFloat(params.row.buy_price) || 0;
            const buyTaxAndCharges = parseFloat(params.row.buy_tax_and_charges) || 0;
            const salePrice = parseFloat(params.row.sale_price) || 0;
            const quantity = parseFloat(params.row.quantity) || 0;
            const saleTaxAndCharges = parseFloat(params.row.sale_tax_and_charges) || 0;
            const currentPrice = parseFloat(params.row.current_price) || 0;
            if (params.row.sale_date) {
                return FormatCurrency(((salePrice * quantity) - saleTaxAndCharges) - ((buyPrice * quantity) + buyTaxAndCharges));
            } 
            else {
                return FormatCurrency((currentPrice * quantity) - ((buyPrice * quantity) + buyTaxAndCharges));
            }   
        }},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 75,
            headerClassName: 'header-theme',
            renderCell: (params) => (
                <div>
                    <a style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', color: theme.palette.primary.main }}>Delete</a> 
                </div>
            ),
        },
    ];

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Typography variant="h6" component="h2">
                    <SavingsIcon style={{ color: 'purple', marginRight: '10px' }} />
                    Portfolio Details - {initialPortfolio.portfolio_name}
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DescriptionIcon />}
                    onClick={handleDownload}
                    sx={{ mr: 10 }}
                >
                    Download Template
                </Button>
            </Box>
            <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={handleUpload}
                key={nextId}
            />
            <label htmlFor="upload-file">
                <Button variant="contained" color="secondary" component="span">
                    Upload Portfolio
                </Button>
            </label>
            <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                <DataGrid 
                    rows={portfoliodetails} 
                    columns={columns} 
                    pageSize={5} 
                    rowsPerPageOptions={[5]} 
                    processRowUpdate={processRowUpdate} 
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRow}
                    sx={{
                        fontSize: '1rem',
                        padding: '10px 40px',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    }}
                >
                    Add Row
                </Button>

                <Typography variant="body1" component="h2" sx={{ fontStyle: 'italic', fontWeight: 'bold', color: 'blue' }}>
                    Records can be edited within the grid itself
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={initialPortfolio.is_dummy_data}
                    sx={{
                        fontSize: '1rem',
                        padding: '10px 40px',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
}

export default AssetPortfolioDetails;