export type CentralWeather = {
  officeCode: string;
  name: string;
  srf: Weather;
};

export type Weather = {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: TimeSeriesEntity[];
};
export type TimeSeriesEntity = {
  timeDefines: string[];
  areas: AreasEntity[];
};
export type AreasEntity = {
  area: Area;
  weatherCodes: string[];
  weathers: string[];
  winds: string[];
  waves: string[];
};
export type Area = {
  name: string;
  code: string;
};
