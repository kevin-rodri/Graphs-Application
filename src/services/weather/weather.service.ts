import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Weather } from '../../interfaces/weather.interface';
/*
Weather Service resposible for fetching weather data from the API - https://open-meteo.com/en/docs
*/
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // YAY for free APIs!
  private readonly API_URL = 'https://api.open-meteo.com/v1/forecast';
  private readonly http = inject(HttpClient);

  getQuinnipiacWeather(): Observable<Weather> {
    return this.http
      .get<Weather>(
        `${this.API_URL}?latitude=41.4189&longitude=72.8936&hourly=precipitation_probability,temperature_2m&timezone=America%2FNew_York&temperature_unit=fahrenheit`
      )
  }

  getWeatherByCoordinates(
    latitude: number,
    longitude: number
  ): Observable<Weather | null> {
    return this.http
      .get<Weather>(
        `${this.API_URL}?latitude=${latitude}&longitude=${longitude}&hourly=precipitation_probability,temperature_2m&timezone=America%2FNew_York&temperature_unit=fahrenheit`
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }
}
