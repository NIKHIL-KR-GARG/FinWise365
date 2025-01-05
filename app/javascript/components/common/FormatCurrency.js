export const FormatCurrency = (currency, amount) => {
    if (!currency || !amount) return '0';
    if (currency === 'USD') return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'SGD') return amount.toLocaleString('en-SG', { style: 'currency', currency: 'SGD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'INR') return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'MYR') return amount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'JPY') return amount.toLocaleString('en-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'GBP') return amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'EUR') return amount.toLocaleString('en-EU', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'AUD') return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else if (currency === 'RMB') return amount.toLocaleString('en-CN', { style: 'currency', currency: 'RMB', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    else return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const FormatCurrencyForGrid = (value, currency) => {
    if (isNaN(value)) return '0';

    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }
    else if (currency === 'SGD') {
        return new Intl.NumberFormat('en-SG', {
            style: 'currency',
            currency: 'SGD'
        }).format(value);
    }
    else if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(value);
    }
};