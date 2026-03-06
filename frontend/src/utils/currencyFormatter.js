export const convertUSDToINR = (priceUSD) => {
    if (isNaN(priceUSD)) return "₹0";
    const priceINR = parseFloat(priceUSD) * 91;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(priceINR);
};
