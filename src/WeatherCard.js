import React from 'react';
import styled from '@emotion/styled';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RedoIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import { ReactComponent as CloudyIcon } from './images/night-cloudy.svg';
import { ReactComponent as CogIcon } from './images/cog.svg';
import WeatherIcon from './WeatherIcon';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Cloudy = styled(CloudyIcon)`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
`;
// 透過 styled(組件) 來把樣式帶入已存在的組件中
const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;
    /* STEP 2：取得傳入的 props 並根據它來決定動畫要不要執行 */
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

// 為 CogIcon 添加樣式
const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = ({
  weatherElement,
  moment,
  fetchData,
  setCurrentPage,
  cityName,
}) => {
  //在 React 中對於物件類型的資料，經常會使用物件的解構賦值先把要使用到的資料取出來
  //如此，在 return 的地方就可以直接使用這些變數，而不需要在前面多加上 weatherElement.ooo，修改後的程式碼會變得更加精簡
  const {
    observationTime,
    //locationName, //將多餘的變數移除
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;
  return (
    <WeatherCardWrapper>
      {/* 使用 Cog 圖示 */}
      {/* 當齒輪被點擊的時候，將 currentPage 改成 WeatherSetting */}
      <Cog onClick={() => setCurrentPage('WeatherSetting')} />
      <Location>{cityName}</Location>
      {/* <Description>
          {currentWeather.observationTime} {currentWeather.description}
        </Description> */}
      {/* STEP 1：優化時間呈現 */}
      <Description>
        {description}
        {comfortability}
      </Description>
      <CurrentWeather>
        {/* <Temperature>
            {currentWeather.temperature} <Celsius>°C</Celsius>
          </Temperature> */}
        <Temperature>
          {/* STEP 2：優化溫度呈現 */}
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || 'day'}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {/* 針對濕度進行四捨五入 */}
        {Math.round(rainPossibility)}%
      </Rain>
      {/* 將最後觀測時間移到畫面右下角呈現 */}
      <Redo onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat('zh-TW', {
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(observationTime))}{' '}
        {/* <RedoIcon /> */}
        {/* STEP 2：當 isLoading 的時候顯示 LoadingIcon 否則顯示 RedoIcon */}
        {isLoading ? <LoadingIcon /> : <RedoIcon />}
      </Redo>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
