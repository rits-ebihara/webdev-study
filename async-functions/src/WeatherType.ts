/** データルート */
export type CentralWeather = {
  officeCode: string;
  name: string;
  srf: Weather<string>;
};
/** 気象データルート */
export type Weather<T = undefined> = {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: TimeSeriesEntity<T>[];
};
/** 時間区分 */
export type TimeSeriesEntity<T = undefined> = {
  timeDefines: string[];
  areas: T extends undefined ? AreasEntity[] : AreasEntity;
};
/** 地方ごと気象情報 */
export type AreasEntity = {
  area: Area;
  weatherCodes: string[];
  weathers: string[];
  winds: string[];
  waves: string[];
};
/** 地方情報 */
export type Area = {
  name: string;
  code: string;
};
