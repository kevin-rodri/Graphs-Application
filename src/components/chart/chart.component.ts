import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import Chart, { ChartType } from "chart.js/auto";
import { WeatherService } from "../../services/weather/weather.service";
import { CountriesService } from "../../services/countries/countries.service";
import { StockService } from "../../services/stocks/stock.service";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { generateColors } from "../../utils/colorGenerator";
import { DateFormatter } from "../../utils/dateFormatter";
import { DataTypeOption } from "../../utils/chartTypes";
import { CustomChart } from "../../interfaces/customChart.interface";
import {
  axisLabelConfig,
  chartTitleConfig,
  chartSubtitleConfig,
} from "../../utils/chartTypes";
/*
General chart component for displaying various types of charts.
*/
@Component({
  selector: "app-chart",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule    
  ],
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.scss",
})
export class ChartComponent {
  private readonly weatherService = inject(WeatherService);
  private readonly countriesService = inject(CountriesService);
  private readonly stockService = inject(StockService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customChart = signal<CustomChart | null>(null);
  protected readonly searchValue = new FormControl<string>("");
  protected readonly latitude = new FormControl<number>(0);
  protected readonly longitude = new FormControl<number>(0);
  private readonly dateFormatter = new DateFormatter();
  protected readonly hasNoData = computed(() =>
    this.chartData.length === 0 || this.chartLabels.length === 0
  );  
  protected readonly isDownloadDisabled = computed(
    () => (this.selectedDataType() == null || this.selectedChartType() == null) || (this.selectedDataType() === 'custom' && this.hasNoData())
  );
  chart: Chart | null = null;
  protected readonly selectedChartType = signal<ChartType | null>(null);
  protected readonly selectedDataType = signal<DataTypeOption | null>(null);
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor() {
    effect(() => {
      const type = this.selectedDataType();
      const chartType = this.selectedChartType();
      untracked(() => {
        if (type == null || chartType == null) return;
        if (type != null && chartType != null) {
          if (type === "weather") {
            this.weatherService
              .getQuinnipiacWeather()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((data) => {
                this.chartData = data.hourly.temperature_2m;
                this.chartLabels = data.hourly.time.map((entry) =>
                  this.dateFormatter.formatDateWithTime(entry)
                );
                this.renderChart(
                  chartType,
                  this.chartLabels,
                  this.chartData
                );
              });
          } else if (type === "stocks") {
            this.stockService
              .getGarminStock()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((data) => {
                this.chartData = data.series.map((entry) => entry.close);
                this.chartLabels = data.series.map((entry) =>
                  this.dateFormatter.formatDate(entry.date)
                );
                this.renderChart(
                  chartType,
                  this.chartLabels,
                  this.chartData
                );
              });
          } else if (type === "gdp") {
            this.countriesService
              .getUSData()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((data) => {
                this.chartData = data.map((entry) => entry.value);
                this.chartLabels = data.map((entry) =>
                  this.dateFormatter.formatDate(entry.date)
                );
                this.renderChart(
                  chartType,
                  this.chartLabels,
                  this.chartData
                );
              });
          } else if (type === "custom") {
            const customChart = this.customChart();
            if (customChart != null) {
              this.chartData = customChart.data;
              this.chartLabels = customChart.labels;
              this.renderChart(
                chartType,
                this.chartLabels,
                this.chartData,
              );
            }
          }
        }
      });
    });
  }

  // https://www.chartjs.org/docs/latest/ and https://stackoverflow.com/questions/36949343/chart-js-dynamic-changing-of-chart-type-line-to-bar-as-example
  // The original idea was to swtich the chart type if the data is the same but I was getting plenty of regressions.  Therefore, a new instance of the chart has to be created.
  // Also, part of the goal of this assignment was to play around and see what I can do with charts.
  renderChart(
    type: ChartType,
    labels: string[],
    data: number[],
  ): void {
    if (data.length === 0 || labels.length === 0) return;
    if (this.chart != null) {
      this.chart.destroy();
    }

    const colors = generateColors(data.length);
    const typeSelected = this.selectedDataType();
    if (typeSelected != null) {
      const axisLabels = axisLabelConfig[typeSelected];
      const chartTitle = chartTitleConfig[typeSelected];
      const chartSubtitle = chartSubtitleConfig[typeSelected];
        this.chart = new Chart("ser375Chart", {
          type,
          data: {
            labels,
            datasets: [
              {
                data,
                label: chartTitle,
                backgroundColor: [...colors],
                borderColor: [...colors],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
              title: {
                display: true,
                text: chartTitle,
                padding: {
                  top: 10,
                  bottom: 10
              }
              },
              subtitle: {
                display: true,
                text: chartSubtitle,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: axisLabels.x,
                },
              },
              y: {
                title: {
                  display: true,
                  text: axisLabels.y,
                },
              },
            },
          },
        });
      }

  }

  // Discovered that chart.js has a built in download function so I added that: https://quickchart.io/documentation/chart-js/image-export/
  // I honestly was with the hope that I could just this onclick automatically download the chart without having to click the button.
  onDownloadChart(): void {
    if (this.chart != null) {
      const link = document.createElement("a");
      link.href = this.chart.toBase64Image();
      link.download = `chart-${this.selectedDataType()}-${this.selectedChartType()}-${new Date().toUTCString()}.png`;
      link.click();
    }
  }

  onSearch(): void {
    const searchValue = this.searchValue.value?.trim();
    const lat = this.latitude.value;
    const long = this.longitude.value;
    const type = this.selectedDataType();
    const chartType = this.selectedChartType();

    if (searchValue != null && chartType != null) {
      if (type === "weather") {
        if (lat != null && long != null) {
          this.weatherService
            .getWeatherByCoordinates(lat, long)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
              if (data != null) {
                this.chartData = data.hourly.temperature_2m;
                this.chartLabels = data.hourly.time.map((entry) =>
                  this.dateFormatter.formatDateWithTime(entry)
                );
                this.renderChart(
                  chartType,
                  this.chartLabels,
                  this.chartData
                );
              }
            });
        }
      } else if (type === "stocks") {
        this.stockService
          .getStockByName(searchValue)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            if (data != null) {
              this.chartData = data.series.map((entry) => entry.close);
              this.chartLabels = data.series.map((entry) =>
                this.dateFormatter.formatDate(entry.date)
              );
              this.renderChart(
                chartType,
                this.chartLabels,
                this.chartData
              );
            }
          });
      } else if (type === "gdp") {
        this.countriesService
          .getCountryData(searchValue)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.chartData = data.map((entry) => entry.value);
            this.chartLabels = data.map((entry) =>
              this.dateFormatter.formatDate(entry.date)
            );
            this.renderChart(
              chartType,
              this.chartLabels,
              this.chartData
            );
          });
      }
    }
  }

  // https://dev.to/manoj_004d/how-to-create-angular-chart-from-csv-data-52ed
  upload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != null) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result as string;
        const rows = csvText.trim().split(/[\r?\n|\r|\n]+/);
        const labels: string[] = [];
        const data: number[] = [];

        for (let i = 1; i < rows.length; i++) {
          const [label, value] = rows[i].split(",");
          labels.push(label.trim());
          data.push(parseInt(value));
        }

        this.chartData = data;
        this.chartLabels = labels;
        const customChart: CustomChart = {
          labels,
          data,
        };
        this.customChart.set(customChart);
        const chartType = this.selectedChartType();
        if (chartType != null) {
          this.renderChart(
            chartType,
            this.chartLabels,
            this.chartData
          );
        }
      };
      reader.readAsText(file);
    }
  }
}
