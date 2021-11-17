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
const WeatherContent: React.FC<Weather> = (props) => {
  const time = props.timeSeries[0];
  const times = time.timeDefines;
  // areas の先頭だけ使う
  const area = time.areas[0];
  const { area: areaInfo, weathers } = area;
  const displayWeathers = useMemo(() => {
    // 日付と天気の一覧
    return times.map((time, i) => {
      const date = dayjs(time).format('M月 D日');
      const weather = weathers[i];
      return (
        <div key={i}>
          <span css={styles.date}>{date}</span>
          <span>{weather}</span>
        </div>
      );
    });
  }, [times, weathers]);
  // 場所と天気の一覧
  return (
    <>
      <p>{areaInfo.name}</p>
      {displayWeathers}
    </>
  );
};

const WeatherContentList: React.FC<{ weathers: CentralWeather; code: string }> =
  (props) => {
    const { code, weathers } = props;

    return <></>;
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
  const [weatherData, setWeatherData] = useState<Weather | null>(null);

  /** ページ表示時にエリア情報をロードする */
  useEffect(() => {
    loadArea().then((data) => setAreas(data));
  }, []);
  /** ページ表示時に天気予報をロードする */
  useEffect(() => {
    loadWeatherNews(null).then((data) => {
      // setWeatherData(data[0]);
    });
  }, []);

  /** 天気予報の表示 */
  const contents = useMemo(() => {
    // データをロードしていなければ、ローディングの表示を行う
    if (!weatherData) return <Skelton count={5} />;
    // データがロードできていれば、天気を表示する
    // timeSeries の先頭だけ使う
    return <WeatherContent {...weatherData} />;
  }, [weatherData]);

  return (
    <>
      <h3>天気予報</h3>
      <div>
        <AreaSelector
          areaData={areas}
          selectedCenterCode={selectedCenter[0] || ''}
        />
      </div>
      <div>{JSON.stringify(selectedCenter)}</div>
      <div css={styles.contents}>{contents}</div>
    </>
  );
};
