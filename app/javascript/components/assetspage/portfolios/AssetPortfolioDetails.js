import React, { useState } from "react";
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SavingsIcon from '@mui/icons-material/AccountBalance'; // PMS portfolio icon
import DescriptionIcon from '@mui/icons-material/Description'; // Excel icon
import * as XLSX from "xlsx";

const AssetPortfolioDetails = ({ portfolio: initialPortfolio }) => {
    const [data, setData] = useState([]);
    const [nextId, setNextId] = useState(0);

    const handleDownload = () => {
        const headers = [
            "Scrip", "Description", "Buy Date", "Buy Price", "Quantity", 
            "Buy Tax & Other Cost", "Sale Date", "Sale Price", "Sale Tax & Other Cost"
        ];
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data.map(Object.values)]);
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
                const rowData = { id: index }; // Add unique id for each row
                headers.forEach((header, i) => {
                    rowData[header] = row[i];
                });
                return rowData;
            });
            setData(rows);
            setNextId(rows.length);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAddRow = () => {
        const newRow = { id: nextId };
        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                if (key !== 'id') newRow[key] = '';
            });
        }
        setData([...data, newRow]);
        setNextId(nextId + 1);
    };

    const processRowUpdate = (newRow) => {
        const updatedData = data.map(row => (row.id === newRow.id ? newRow : row));
        setData(updatedData);
        return newRow;
    };

    const columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
        editable: true,
    })) : [];

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '90vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Typography variant="h6" component="h2">
                    <SavingsIcon style={{ color: 'purple', marginRight: '10px' }} />
                    Portfolio Details
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
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
            />
            <label htmlFor="upload-file">
                <Button variant="contained" color="secondary" component="span">
                    Upload Portfolio
                </Button>
            </label>
            <Button variant="contained" color="primary" onClick={handleAddRow} sx={{ mt: 2 }}>
                Add Row
            </Button>
            {data.length > 0 && (
                <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                    <DataGrid 
                        rows={data} 
                        columns={columns} 
                        pageSize={5} 
                        rowsPerPageOptions={[5]} 
                        processRowUpdate={processRowUpdate} 
                    />
                </Box>
            )}
        </Box>
    );
}

export default AssetPortfolioDetails;