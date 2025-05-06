import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  Stock,
  metaDataMap,
  stockMap,
  MetaDataStock,
  MonthlySeriesStock,
} from '../../interfaces/stock.interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  // Man another free api!
  private readonly API_URL =
    'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=';
  private readonly http = inject(HttpClient);

  private getStock(stockName: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.API_URL}${stockName}&apikey=NFRQXED00M8V9O1O`).pipe(
      map((response: any) => {
        const metaData = response['Meta Data'];
        const monthlyStock = response['Time Series (Daily)'];

        // start off with meta data
        const metaDataStock: MetaDataStock = {
          information: metaData[metaDataMap['information']],
          symbol: metaData[metaDataMap['symbol']],
          lastRefreshed: metaData[metaDataMap['lastRefreshed']],
          timeZone: metaData[metaDataMap['timeZone']],
        };
        
        // montly series stock
        const monthlySeriesStockList = [];
        for (const [date, value] of Object.entries(monthlyStock) as [
          string,
          Record<string, string>
        ][]) {
          const monthlySeriesStock: MonthlySeriesStock = {
            date,
            open: Number(value[stockMap['open']]),
            high: Number(value[stockMap['high']]),
            low: Number(value[stockMap['low']]),
            close: Number(value[stockMap['close']]),
            volume: Number(value[stockMap['volume']]),
          };
          monthlySeriesStockList.push(monthlySeriesStock);
        }
        const stock: Stock = {
          metaData: metaDataStock,
          series: monthlySeriesStockList,
        };
        console.log(stock);
        return stock;
      })
    );
  }

  getGarminStock(): Observable<Stock> {
    return this.getStock('GRMN');
  }

  getAppleStock(): Observable<Stock> {
    return this.getStock('AAPL');
  }
  getTeslaStock(): Observable<Stock> {
    return this.getStock('TSLA');
  }

  // this is intended for user input.
   getStockByName(stockName: string): Observable<Stock | null> {
    return this.getStock(stockName).pipe(
      catchError(() => {
        return of(null);
      }
    ));
  }
}
