export const convertToINR = (priceUSD) => {
    const conversionRate = 91;
    const inrValue = parseFloat(priceUSD) * conversionRate;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(inrValue);
};
