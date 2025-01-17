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

export const isSIPMonth = (startDate, currentDate, frequency) => {
    const diffMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    if (frequency === 'Monthly') return true;
    else if (frequency === 'Quarterly' && diffMonths % 3 === 0) return true;
    else if (frequency === 'Semi-Annually' && diffMonths % 6 === 0) return true;
    else if (frequency === 'Annually' && diffMonths % 12 === 0) return true;
    else return false;
}

export const getMonth = (month) => {
    if (month === 'January') return 1;
    else if (month === 'February') return 2;
    else if (month === 'March') return 3;
    else if (month === 'April') return 4;
    else if (month === 'May') return 5;
    else if (month === 'June') return 6;
    else if (month === 'July') return 7;
    else if (month === 'August') return 8;
    else if (month === 'September') return 9;
    else if (month === 'October') return 10;
    else if (month === 'November') return 11;
    else if (month === 'December') return 12;
}