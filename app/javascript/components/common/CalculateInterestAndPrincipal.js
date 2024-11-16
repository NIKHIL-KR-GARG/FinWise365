export const CalculateInterest = (deposit_type, interest_type, interest_rate, deposit_amount, deposit_term, payment_frequency, payment_amount, compounding_frequency) => {
    
    let interest = 0;

    if (deposit_type === 'Fixed') {
        if (interest_type === 'Simple') {
            if (payment_frequency === '') {
                interest = deposit_amount * (interest_rate / 100 / 12) * deposit_term;
            }
            else {
                //means we have regular payments and we need to calculate the interest for the regular payments
                let decrementMonths = 0;
                if (payment_frequency === 'Monthly') decrementMonths = 1;
                else if (payment_frequency === 'Quarterly') decrementMonths = 3;
                else if (payment_frequency === 'Semi-Annually') decrementMonths = 6;
                else if (payment_frequency === 'Annually') decrementMonths = 12;

                //add simple interest for the initial deposit
                interest += deposit_amount * (interest_rate / 100 / 12) * (deposit_term + 1);
                //add simple interest for the regular payments
                for (let month = deposit_term; month >= 1; month-=decrementMonths) {
                    interest += payment_amount * (interest_rate / 100 / 12) * month;
                }
            }
            return interest;
        }
        else if (interest_type === 'Compounding') {
            let n = 1;
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
        if (compounding_frequency === 'Monthly') compoundingFactor = 12;
        else if (compounding_frequency === 'Quarterly') compoundingFactor = 4;
        else if (compounding_frequency === 'Semi-Annually') compoundingFactor = 2;
        else if (compounding_frequency === 'Annually') compoundingFactor = 1;
        
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
        return parseFloat(interest);
    };
};

export const CalculatePrincipal  = (deposit_type, deposit_amount, deposit_term, payment_frequency, payment_amount) => {

    if (deposit_type === 'Fixed' && payment_frequency === '') return deposit_amount;
    else {
        let n = 1;
        if (payment_frequency === 'Monthly') n = 12;
        else if (payment_frequency === 'Quarterly') n = 4;
        else if (payment_frequency === 'Semi-Annually') n = 2;
        else if (payment_frequency === 'Annually') n = 1;

        return parseFloat(deposit_amount) + (parseFloat(payment_amount) * (parseFloat(deposit_term) / 12) * n);
    }
}

export const CalculatePayoutValue = (present_value, term, rate) => {
    return parseFloat((parseFloat(present_value) * parseFloat(rate) / 100) / (1 - Math.pow((1 + (parseFloat(rate) / 100 )), -term)));
}