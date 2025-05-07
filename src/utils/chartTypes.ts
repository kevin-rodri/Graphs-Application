export enum ChartTypeOption {
  Line = "line",
  Bar = "bar",
  Radar = "radar",
  Doughnut = "doughnut",
  Pie = "pie",
  PolarArea = "polarArea",
  Bubble = "bubble",
  Scatter = "scatter",
}

export enum DataTypeOption {
  Weather = "weather",
  Stocks = "stocks",
  GDP = "gdp",
  Custom = "custom",
}

export const axisLabelConfig: Record<DataTypeOption, { x: string; y: string }> =
  {
    [DataTypeOption.Weather]: { x: "Time", y: "Temperature (°C)" },
    [DataTypeOption.Stocks]: { x: "Date", y: "Price (USD)" },
    [DataTypeOption.GDP]: { x: "Year", y: "GDP (Billion USD)" },
    [DataTypeOption.Custom]: { x: "Custom X-Axis", y: "Custom Y-Axis" },
  };

export const chartTitleConfig: Record<DataTypeOption, string> = {
  [DataTypeOption.Weather]: "Weather Data",
  [DataTypeOption.Stocks]: "Stock Data",
  [DataTypeOption.GDP]: "GDP Data",
  [DataTypeOption.Custom]: "Custom Data",
};

export const chartSubtitleConfig: Record<DataTypeOption, string> = {
    [DataTypeOption.Weather]: "Weather data infographic",
    [DataTypeOption.Stocks]: "Stock data infographic",
    [DataTypeOption.GDP]: "GDP data infographic",
    [DataTypeOption.Custom]: "Custom data infographic",
};

export const chartLabelConfig: Record<DataTypeOption, string> = {
    [DataTypeOption.Weather]: "Weather trends and patterns",
    [DataTypeOption.Stocks]: "Financial or market data",
    [DataTypeOption.GDP]: "Economic indicators over time",
    [DataTypeOption.Custom]: "User-provided dataset",
};
