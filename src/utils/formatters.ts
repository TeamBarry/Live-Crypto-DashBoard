export const formatPrice = (price  :  number ) : string =>{
      return  new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
}


export const formatPercentage = (value : number) : string => {
    const sign = value > 0 ? '+' : '-';
    return `${sign}${value.toFixed(2)}%`
}

export const formatMarketCap = ( value : number) : string =>{
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    }
    return formatPrice(value);
}



export const formatVolume = formatMarketCap;