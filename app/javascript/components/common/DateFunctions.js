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