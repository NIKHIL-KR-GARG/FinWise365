const FormatCurrency = (currency, amount) => {
    if (!currency || !amount) return '';
    if (currency === 'USD') return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    else if (currency === 'SGD') return amount.toLocaleString('en-SG', { style: 'currency', currency: 'SGD' });
    else if (currency === 'INR') return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    else if (currency === 'MYR') return amount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
    else if (currency === 'JPY') return amount.toLocaleString('en-JP', { style: 'currency', currency: 'JPY' });
    else if (currency === 'GBP') return amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
    else if (currency === 'EUR') return amount.toLocaleString('en-EU', { style: 'currency', currency: 'EUR' });
    else if (currency === 'AUD') return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
    else if (currency === 'RMB') return amount.toLocaleString('en-CN', { style: 'currency', currency: 'RMB' });
    else return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export default FormatCurrency;