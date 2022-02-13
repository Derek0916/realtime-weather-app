import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import WeatherCard from './WeatherCard';
import sunriseAndSunsetData from './sunrise-sunset.json';
import useWeatherApi from './useWeatherApi';
import WeatherSetting from './WeatherSetting';
import { findLocation } from './utils';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment = (locationName) => {
  // STEP 2：從日出日落時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName,
  );

  // STEP 3：找不到的話則回傳 null
  if (!location) return null;

  // STEP 4：取得當前時間
  const now = new Date();

  // STEP 5：將當前時間以 "2019-10-08" 的時間格式呈現
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  // STEP 6：從該地區中找到對應的日期
  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  // STEP 7：將日出日落以及當前時間轉成時間戳記（TimeStamp）
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`,
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`,
  ).getTime();
  const nowTimeStamp = now.getTime();

  // STEP 8：若當前時間介於日出和日落中間，則表示為白天，否則為晚上
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const WeatherApp = () => {
  //從 localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem('cityName');

  // 使用 useState 定義當前要拉取天氣資訊的地區，預設值先定為「臺北市」
  //若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || '臺北市');

  // 根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  const currentLocation = findLocation(currentCity) || {};

  // 使用 useWeatherApi Hook 後就能取得 weatherElement 和 fetchData 這兩個方法
  // 把 currentLocation 當成參數直接傳入 useWeatherApi 的函式內
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);

  // 定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState('WeatherCard');

  // // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  // const moment = useMemo(
  //   () => getMoment(weatherElement.locationName),
  //   [weatherElement.locationName],
  // );

  // STEP 4：根據日出日落資料的地區名稱，找出對應的日出日落時間
  const moment = useMemo(
    () => getMoment(currentLocation.sunriseCityName),
    [currentLocation.sunriseCityName],
  );

  // 當 currentCity 有改變的時候，儲存到 localStorage 中
  useEffect(() => {
    localStorage.setItem('cityName', currentCity);
    // dependencies 中放入 currentCity
  }, [currentCity]);

  return (
    <Container>
      {/* 透過 props 不只可以傳遞「字串」、「物件」、「陣列」、「數值」這類資料，也可以直接把「函式」傳進去。 */}
      {/* 利用條件渲染的方式決定要呈現哪個組件 */}
      {currentPage === 'WeatherCard' && (
        <WeatherCard
          // 把縣市名稱傳入 WeatherCard 中用以顯示
          cityName={currentLocation.cityName}
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'WeatherSetting' && (
        <WeatherSetting
          // 把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
          cityName={currentLocation.cityName}
          // 把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
          setCurrentCity={setCurrentCity}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default WeatherApp;
