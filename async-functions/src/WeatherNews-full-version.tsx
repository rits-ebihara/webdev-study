/** @jsx jsx */
/** @jsxFrag */
import { css, jsx } from '@emotion/react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Skelton from 'react-loading-skeleton';
import { CentralWeather, Weather } from './WeatherType';
import { Area, Center, Class20, Office } from './AreaType';
import { useHash } from 'react-use';
import 'react-loading-skeleton/dist/skeleton.css';

const styles = {
  date: css`
    width: 6em;
    display: inline-block;
    color: #666;
  `,
  contents: css`
    & .react-loading-skeleton {
      margin-bottom: 0.5rem;
      width: 20rem;
    }
    & table,
    & td,
    & th {
      border-collapse: collapse;
      border: 1px solid #999;
    }
    & td,
    & th {
      padding: 0.5rem;
      width: 10rem;
    }
    & th:first-of-type {
      width: 3rem;
    }
  `,
  areaLinks: css`
    margin-bottom: 1rem;
    & a {
      margin-right: 0.5rem;
    }
  `,
};

const loadWeatherNews = async <T extends string | null>(
  code: T,
): Promise<T extends null ? CentralWeather[] : Weather[]> => {
  const weatherURL = `https://www.jma.go.jp/bosai/forecast/data/forecast/${
    code || '010000'
  }.json`;
  const result = await window.fetch(weatherURL);
  return await result.json();
};

const areaURL = 'http://www.jma.go.jp/bosai/common/const/area.json';
const loadArea = async () => {
  const result = await window.fetch(areaURL);
  return (await result.json()) as Area;
};

// ------------------------------------------------------------

/**
 * 天気予報の１つのエリアのコンポーネント
 * @param props - 気象データ
 * @returns 天気予報のコンテンツ
 */
const WeatherContent: React.FC<{
  weather: Weather<string | undefined>;
  noTitle?: boolean;
}> = (props) => {
  const { weather, noTitle } = props;
  const { timeDefines, areas } = weather.timeSeries[0];

  const displayWeathers = useMemo(() => {
    const areaList = Array.isArray(areas) ? areas : [areas];
    // エリアの一覧
    return areaList.map((area) => {
      // 日の一覧
      const days = timeDefines.map((d, i) => {
        const day = dayjs(d);
        return <td key={d}>{day.format('M月D日')}</td>;
      });
      const weathers = area.weathers.map((w, i) => <td key={i}>{w}</td>);
      const winds = area.winds.map((w, i) => <td key={i}>{w}</td>);
      const waves = area.waves?.map((w, i) => <td key={i}>{w}</td>);
      return (
        <div key={area.area.code}>
          {noTitle ? null : <h4> {area.area.name} </h4>}
          <table>
            <thead>
              <tr>
                <th>日付</th>
                {days}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>天気</th>
                {weathers}
              </tr>
              <tr>
                <th>風</th>
                {winds}
              </tr>
              <tr>
                <th>波</th>
                {waves}
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
  }, [areas, noTitle, timeDefines]);
  // 場所と天気の一覧
  return <div css={styles.contents}>{displayWeathers}</div>;
};

const CentralWeathers: React.FC<{
  weathers: CentralWeather[];
  officeCodes: string[] | null;
}> = (props) => {
  const { weathers, officeCodes } = props;
  const contents = useMemo(() => {
    return weathers
      .filter(
        (w) => !officeCodes || officeCodes?.find((c) => c === w.officeCode),
      )
      .map((w) => (
        <div key={w.officeCode}>
          <h4>{w.name}</h4>
          <WeatherContent weather={w.srf} noTitle />
        </div>
      ));
  }, [officeCodes, weathers]);
  return <>{contents}</>;
};

// ------------------------------------------------------------

/**
 * 地域選択の一覧
 */
const AreaList: React.FC<{
  data: { code: string; name: string }[];
  parentCodes: (string | undefined)[];
}> = (props) => {
  const { data, parentCodes } = props;
  const list = useMemo(() => {
    return data.map((cn) => (
      <a key={cn.code} href={`#/${[...parentCodes, cn.code].join('/')}`}>
        {cn.name}
      </a>
    ));
  }, [data, parentCodes]);
  return <div css={styles.areaLinks}>{list}</div>;
};

type AreaSelectorProps = {
  areaData: Area | null;
  selectedCenterCode: string;
};

const convertCodeName = (source: {
  [code: string]: Center | Office | Class20;
}) => {
  const keys = Object.keys(source);
  return keys.map((code) => ({
    code,
    name: source[code].name,
    parent: (source[code] as Office).parent || undefined,
  }));
};

/**
 * 地域を選択 コンポーネント
 */
const AreaSelector: React.FC<AreaSelectorProps> = (props) => {
  const { areaData, selectedCenterCode } = props;

  // 全国地方一覧
  const centersList = useMemo(() => {
    if (!areaData) return null;
    const data = convertCodeName(areaData.centers);
    return <AreaList data={data} parentCodes={[]} />;
  }, [areaData]);

  // 地域一覧
  const officesList = useMemo(() => {
    if (!areaData) return null;
    const data = convertCodeName(areaData.offices).filter(
      (a) => a.parent === selectedCenterCode,
    );
    return <AreaList data={data} parentCodes={[selectedCenterCode]} />;
  }, [areaData, selectedCenterCode]);

  return (
    <>
      <div css={styles.areaLinks}>
        <a href="#">全国</a>
      </div>
      {centersList}
      {officesList}
    </>
  );
};

/**
 * ページ全体
 * @returns
 */
export const WeatherNews: React.FC = () => {
  /** エリアデータ */
  const [areas, setAreas] = useState<Area | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  /** ハッシュに選択したエリア情報が入る */
  const [hash] = useHash();
  /** ハッシュが変更されたらエリア情報を取得する */
  useEffect(() => {
    const codes = hash.split('/');
    codes.shift(); // 先頭は # のため削除する
    setSelectedCenter(codes[0] || '');
    setSelectedOffice(codes[1] || '');
  }, [hash]);

  /** 気象データ */
  const [weatherData, setWeatherData] = useState<
    Weather | CentralWeather[] | null
  >(null);

  /** ページ表示時にエリア情報をロードする */
  useEffect(() => {
    loadArea().then((data) => setAreas(data));
  }, []);

  /** ページ表示時に天気予報をロードする */
  useEffect(() => {
    if (!selectedOffice) {
      loadWeatherNews(null).then((data) => {
        setWeatherData(data);
      });
    } else {
      loadWeatherNews(selectedOffice).then((data) => {
        setWeatherData(data[0]);
      });
    }
  }, [selectedOffice]);

  /** 天気予報の表示 */
  const contents = useMemo(() => {
    // データをロードしていなければ、ローディングの表示を行う
    if (!weatherData) return <Skelton count={5} />;
    // データがロードできていれば、天気を表示する
    if (Array.isArray(weatherData)) {
      const officeCodes =
        areas && !!selectedCenter
          ? convertCodeName(areas.offices)
              .filter((o) => o.parent === selectedCenter)
              .map((a) => a.code)
          : null;
      return (
        <CentralWeathers
          weathers={weatherData as CentralWeather[]}
          officeCodes={officeCodes}
        />
      );
    } else {
      return <WeatherContent weather={weatherData as Weather} />;
    }
  }, [areas, selectedCenter, weatherData]);

  return (
    <>
      <h3>天気予報</h3>
      <div>
        <AreaSelector
          areaData={areas}
          selectedCenterCode={selectedCenter || ''}
        />
      </div>
      {contents}
    </>
  );
};
