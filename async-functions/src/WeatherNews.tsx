/** @jsx jsx */
/** @jsxFrag */
import { css, jsx } from '@emotion/react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Skelton from 'react-loading-skeleton';
import dummyData from './dummyData.json';
import { Weather } from './WeatherType';
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
};

const loadWeatherNews = (cb: (weatherData: Weather) => void) => {
  // 下記は dummy。setTimeout を使って、通信に時間がかかることをシミュレートしている。
  // これを fetch を使って気象庁で公開されている JSON を取得する
  // URL の例 https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json
  window.setTimeout(() => {
    cb(dummyData as Weather);
  }, 3000);
};

/**
 * 天気予報のコンテンツを作成する
 * @param weatherData - 気象データ
 * @returns 天気予報のコンテンツ
 */
const createWeatherContents = (weatherData: Weather) => {
  const time = weatherData.timeSeries[0];
  const times = time.timeDefines;
  // areas の先頭だけ使う
  const area = time.areas[0];
  const { area: areaInfo, weathers } = area;
  // 日付と天気の一覧
  const displayWeathers = times.map((time, i) => {
    const date = dayjs(time).format('M月 D日');
    const weather = weathers[i];
    return (
      <div key={i}>
        <span css={styles.date}>{date}</span>
        <span>{weather}</span>
      </div>
    );
  });
  // 場所と天気の一覧
  return (
    <>
      <p>{areaInfo.name}</p>
      {displayWeathers}
    </>
  );
};

export const WeatherNews: React.FC = () => {
  /** 気象データ */
  const [weatherData, setWeatherData] = useState<Weather | null>(null);

  /** ページ表示時に天気予報をロードする */
  useEffect(() => {
    loadWeatherNews((data) => {
      setWeatherData(data);
    });
  }, []);

  /** 表示するコンテンツ */
  const contents = useMemo(() => {
    // データをロードしていなければ、ローディングの表示を行う
    if (!weatherData) return <Skelton count={5} />;
    // データがロードできていれば、天気を表示する
    // timeSeries の先頭だけ使う
    return createWeatherContents(weatherData);
  }, [weatherData]);

  return (
    <>
      <h3>天気予報</h3>
      <div css={styles.contents}>{contents}</div>
    </>
  );
};
