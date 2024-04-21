
function toCost(kwh, pricePerKwh) {
    return kwh * pricePerKwh / 100;
}

module.exports = { toCost };