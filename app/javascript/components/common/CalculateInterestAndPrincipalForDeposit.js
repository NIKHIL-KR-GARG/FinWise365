export const CalculateInterestForDeposit = (deposit_type, interest_type, interest_rate, deposit_amount, deposit_term, payment_frequency, payment_amount, compounding_frequency) => {
    
    if (deposit_type === 'Fixed') {
        if (interest_type === 'Simple') {
            return(deposit_amount * (interest_rate / 100 / 12) * deposit_term);
        }
        else if (interest_type === 'Compounding') {
            let n = 1;
            // if (compounding_frequency === 'Daily') n = 365;
            // else if (compounding_frequency === 'Weekly') n = 52;
            // else if (compounding_frequency === 'Fortnightly') n = 26;
            // else 
            if (compounding_frequency === 'Monthly') n = 12;
            else if (compounding_frequency === 'Quarterly') n = 4;
            else if (compounding_frequency === 'Semi-Annually') n = 2;
            else if (compounding_frequency === 'Annually') n = 1;
            return(deposit_amount * Math.pow((1 + (interest_rate / 100) / n), (deposit_term / 12) * n) - deposit_amount);
        }
    }
    else {

        let n = 1;
        let decrementMonths = 0;
        // if (payment_frequency === 'Daily') n = 365;
        // else if (payment_frequency === 'Weekly') n = 52;
        // else if (payment_frequency === 'Fortnightly') n = 26;
        // else 
        if (payment_frequency === 'Monthly') {
            n = 12;
            decrementMonths = 1;
        }
        else if (payment_frequency === 'Quarterly') {
            n = 4;
            decrementMonths = 3;
        }
        else if (payment_frequency === 'Semi-Annually') {
            n = 2;
            decrementMonths = 6;
        }
        else if (payment_frequency === 'Annually') {
            n = 1;
            decrementMonths = 12;
        }

        let compoundingFactor = 1;
        // if (compounding_frequency === 'Daily') compoundingFactor = 365;
        // else if (compounding_frequency === 'Weekly') compoundingFactor = 52;
        // else if (compounding_frequency === 'Fortnightly') compoundingFactor = 26;
        // else 
        if (compounding_frequency === 'Monthly') compoundingFactor = 12;
        else if (compounding_frequency === 'Quarterly') compoundingFactor = 4;
        else if (compounding_frequency === 'Semi-Annually') compoundingFactor = 2;
        else if (compounding_frequency === 'Annually') compoundingFactor = 1;
        
        let interest = 0;
        if (interest_type === 'Simple') {
            //add simple interest for the initial deposit
            interest += deposit_amount * (interest_rate / 100 / 12) * deposit_term;
            //add simple interest for the regular payments
            for (let month = deposit_term; month >= 1; month-=decrementMonths) {
                interest += payment_amount * (interest_rate / 100 / 12) * month;
            }
        }
        else {
            //add compound interest for the initial deposit
            interest += deposit_amount * Math.pow((1 + (parseFloat(interest_rate / 100)) / compoundingFactor), (parseFloat(deposit_term / 12)) * compoundingFactor) - deposit_amount;
            //add compound interest for the regular payments
            for (let month = deposit_term; month >= 1; month-=decrementMonths) {
                interest += payment_amount * Math.pow((1 + (parseFloat(interest_rate / 100)) / compoundingFactor), (parseFloat(month / 12)) * compoundingFactor) - payment_amount;
            }
        } 
        return interest;
    };
};

export const CalculatePrincipalForDeposit  = (deposit_type, deposit_amount, deposit_term, payment_frequency, payment_amount) => {

    if (deposit_type === 'Fixed') return deposit_amount;
    else {
        let n = 1;
        if (payment_frequency === 'Monthly') n = 12;
        else if (payment_frequency === 'Quarterly') n = 4;
        else if (payment_frequency === 'Semi-Annually') n = 2;
        else if (payment_frequency === 'Annually') n = 1;

        return parseFloat(deposit_amount) + (parseFloat(payment_amount) * (parseFloat(deposit_term) / 12) * n)
    }
}