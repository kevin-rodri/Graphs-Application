import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  untracked,
} from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { WeatherService } from '../../services/weather/weather.service';
import { CountriesService } from '../../services/countries/countries.service';
import { StockService } from '../../services/stocks/stock.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { generateColors } from '../../utils/colorGenerator';

/*
General chart component for displaying various types of charts.
*/

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  private readonly weatherService = inject(WeatherService);
  private readonly countriesService = inject(CountriesService);
  private readonly stockService = inject(StockService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchValue = new FormControl<string>('');
  chart: Chart | null = null;
  value = 'Search';
  selectedChartType = signal<
    | 'line'
    | 'bar'
    | 'radar'
    | 'doughnut'
    | 'pie'
    | 'polarArea'
    | 'bubble'
    | 'scatter'
  >('bar');
  selectedDataType = signal<'weather' | 'stocks' | 'gdp'>('weather');
  protected isLoading = false;
  chartData: number[] = [10, 20, 30, 40, 50];
  chartLabels: string[] = ['January', 'February', 'March', 'April', 'May'];
  chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  constructor() {
    effect(() => {
      const type = this.selectedDataType();
      const chartType = this.selectedChartType();

      if (this.chart != null) {
        this.chart.destroy();
        this.isLoading = true;
      }

      if (type === 'weather') {
        this.weatherService
          .getQuinnipiacWeather()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.chartData = data.hourly.temperature_2m;
            this.chartLabels = data.hourly.time.map((entry) =>
              this.formatDateTime(entry)
            );
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData,
              'Weather'
            );
          });
        this.isLoading = false;
      } else if (type === 'stocks') {
        this.stockService
          .getGarminStock()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            if (!data) return;
            this.chartData = data.series.map((entry) => entry.close);
            this.chartLabels = data.series.map((entry) =>
              this.formatDate(entry.date)
            );
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData,
              'Stock Price'
            );
          });
        this.isLoading = false;
      } else if (type === 'gdp') {
        this.countriesService
          .getUSData()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.chartData = data.map((entry) => entry.value);
            this.chartLabels = data.map((entry) => this.formatDate(entry.date));
            console.log(this.chartData);
            console.log(this.chartLabels);
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData,
              'US GDP'
            );
          });
        this.isLoading = false;
      }
    });
  }

  renderChart(
    type: ChartType,
    labels: string[],
    data: number[],
    label: string
  ) {
    const colors = generateColors(data.length);
    this.chart = new Chart('ser375Chart', {
      type,
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor:  [...colors],
            borderColor: [...colors],
            borderWidth: 1,
          },
        ],
      },
      options: this.chartOptions,
    });
    console.log(this.chart);
  }

  // Discovered that chart.js has a built in download function so I added that: https://quickchart.io/documentation/chart-js/image-export/
  onDownloadChart() {
    if (this.chart != null) {
      const link = document.createElement('a');
      link.href = this.chart.toBase64Image();
      link.download = `chart-${this.selectedDataType()}-${this.selectedChartType()}-${new Date().toUTCString()}.png`;
      link.click();
    }
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  }
  private formatDateTime(date: string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(
      2,
      '0'
    )}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  onSearch(): void {
    const searchValue = this.searchValue.value?.trim();
    const type = this.selectedDataType();
    const chartType = this.selectedChartType();
    if (searchValue != null) {
      if (type === 'stocks') {
        this.stockService
          .getStockByName(searchValue)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            if (!data) return;
            this.chartData = data.series.map((entry) => entry.close);
            this.chartLabels = data.series.map((entry) =>
              this.formatDate(entry.date)
            );
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData,
              `${searchValue} Stock Price`
            );
          });
      } else if (type === 'gdp') {
        this.countriesService
          .getCountryData(searchValue)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.chartData = data.map((entry) => entry.value);
            this.chartLabels = data.map((entry) => this.formatDate(entry.date));
            console.log(this.chartData);
            console.log(this.chartLabels);
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData,
              `${searchValue} GDP`
            );
          });
      }
    }
  }

  // https://stackoverflow.com/questions/59233036/react-typescript-get-files-from-file-input
  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files != null) {
      const uploadedFile = input.files[0];
      

    }
  }
}
