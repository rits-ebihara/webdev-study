/** @jsx jsx */
/** @jsxFrag */
import { css, jsx } from '@emotion/react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Skelton from 'react-loading-skeleton';
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

const url = 'https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json';
const loadWeatherNews = async () => {
  const result = await window.fetch(url);
  const json = (await result.json()) as Weather[];
  return json[0];
};

/**
 * 天気予報のコンテンツを作成する
 * @param props - 気象データ
 * @returns 天気予報のコンテンツ
 */
const WeatherContents: React.FC<Weather> = (props) => {
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

export const WeatherNews: React.FC = () => {
  /** 気象データ */
  const [weatherData, setWeatherData] = useState<Weather | null>(null);

  /** ページ表示時に天気予報をロードする */
  useEffect(() => {
    loadWeatherNews().then((data) => {
      setWeatherData(data);
    });
  }, []);

  /** 表示するコンテンツ */
  const contents = useMemo(() => {
    // データをロードしていなければ、ローディングの表示を行う
    if (!weatherData) return <Skelton count={5} />;
    // データがロードできていれば、天気を表示する
    // timeSeries の先頭だけ使う
    return <WeatherContents {...weatherData} />;
  }, [weatherData]);

  return (
    <>
      <h3>天気予報</h3>
      <div></div>
      <div css={styles.contents}>{contents}</div>
    </>
  );
};
