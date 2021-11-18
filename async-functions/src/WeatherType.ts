export type CentralWeather = {
  officeCode: string;
  name: string;
  srf: Weather<string>;
};

export type Weather<T = undefined> = {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: TimeSeriesEntity<T>[];
};
export type TimeSeriesEntity<T = undefined> = {
  timeDefines: string[];
  areas: T extends undefined ? AreasEntity[] : AreasEntity;
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
