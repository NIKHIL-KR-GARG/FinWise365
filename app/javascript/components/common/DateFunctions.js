export const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
}).replace(/ /g, '-');

export const formatMonthYear = (date) => {
    const options = { month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const getMonthEndDate = (month, year) => {
    return new Date(year, month, 0);
};

export const isSameMonthAndYear = (date1, date2) => {
    if (new Date(date1).getMonth() === new Date(date2).getMonth() && 
        new Date(date1).getFullYear() === new Date(date2).getFullYear()) {
        return true;
    }
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