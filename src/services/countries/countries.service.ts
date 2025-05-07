import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { CountryGDP } from "../../interfaces/countryGDP.interface";
import { response } from "express";
@Injectable({
  providedIn: "root",
})
export class CountriesService {
  // YAY for free APIs!
  private readonly API_URL = "https://api.worldbank.org/v2/country/";
  private readonly http = inject(HttpClient);

  private fetchGDP(countryCode: string): Observable<CountryGDP[]> {
    return this.http
      .get<any>(
        `${this.API_URL}${countryCode}/indicator/NY.GDP.MKTP.CD?format=json`
      )
      .pipe(
        map((response) => {
          const data = response?.[1];
          return data
            .filter((entry: any) => entry.value !== null)
            .map((entry: any) => ({
              date: entry.date,
              value: entry.value,
            })) as CountryGDP[];
        }),
        catchError(() => of([]))
      );
  }

  getUSData(): Observable<CountryGDP[]> {
    return this.fetchGDP("US");
  }

  getCountryData(countryCode: string): Observable<CountryGDP[]> {
    return this.fetchGDP(countryCode);
  }
}
