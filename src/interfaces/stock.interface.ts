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
// Record map to help map response values to the correct interface (feel free to take a look at this response: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo )
export const stockMap: Record<string, string> = {
  open: "1. open",
  high: "2. high",
  low: "3. low",
  close: "4. close",
  volume: "6. volume",
};

export const metaDataMap: Record<string, string> = {
  information: "1. Information",
  symbol: "2. Symbol",
  lastRefreshed: "3. Last Refreshed",
  timeZone: "5. Time Zone",
};
