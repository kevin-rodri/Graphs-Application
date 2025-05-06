export interface Stock {
    metaData: MetaDataStock;
    series: MonthlySeriesStock[];
}

export interface MetaDataStock {
    information: string;
    symbol: string;
    lastRefreshed: string;
    timeZone: string;
}
export interface MonthlySeriesStock {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
// Record map to help map response values to the correct interface
export const stockMap: Record<string, string> = {
    open: '1. open',
    high: '2. high',
    low: '3. low',
    close: '4. close',
    volume: '6. volume'
  };
  
  export const metaDataMap: Record<string, string> = {
    information: '1. Information',
    symbol: '2. Symbol',
    lastRefreshed: '3. Last Refreshed',
    timeZone: '5. Time Zone'
  };