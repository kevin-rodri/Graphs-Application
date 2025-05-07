// Mostly to make the response from the API call

export interface Weather {
  id: number;
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyWeatherUnit;
  hourly: HourlyWeather;
}

export interface HourlyWeatherUnit {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
}

export interface HourlyWeather {
  time: string[];
  precipitation_probability: number[];
  temperature_2m: number[];
}

