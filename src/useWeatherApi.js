// STEP 1：載入會用到的 React Hooks
import { useState, useEffect, useCallback } from 'react';

//讓 fetchCurrentWeather 可以接收 locationName 作為參數
const fetchCurrentWeather = (locationName) => {
  //在 API 的網址中可以帶入 locationName 去撈取特定地區的天氣資料
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-3F00350C-B8F7-4EB4-BE76-06BB0F9C5757&locationName=${locationName}`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // 定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];

      // 將風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          // console.log(neededElements);
          if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {},
      );

      // // STEP 3：要使用到 React 組件中的資料
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   observationTime: locationData.time.obsTime,
      //   locationName: locationData.locationName,
      //   description: '多雲時晴',
      //   temperature: weatherElements.TEMP,
      //   windSpeed: weatherElements.WDSD,
      //   humid: weatherElements.HUMD,
      // }));

      // STEP 3-2：把取得的資料內容回傳出去，而不是在這裡 setWeatherElement

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};

//讓 fetchWeatherForecast 可以接收 cityName 作為參數
const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-3F00350C-B8F7-4EB4-BE76-06BB0F9C5757&locationName=${cityName}`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          // console.log(neededElements);
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {},
      );
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   description: weatherElements.Wx.parameterName,
      //   weatherCode: weatherElements.Wx.parameterValue,
      //   rainPossibility: weatherElements.PoP.parameterName,
      //   comfortability: weatherElements.CI.parameterName,
      // }));
      // STEP 4-2：把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};
//讓 useWeatherApi 可以接收參數
const useWeatherApi = (currentLocation) => {
  // 將傳入的 currentLocation 透過解構賦值取出 locationName 和 cityName
  const { locationName, cityName } = currentLocation;

  // 把原本 useState 的部分搬移進來
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true,
  });

  // 把原本 useCallback 的部分搬移進來
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      // 使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      // 使用陣列的解構賦值把資料取出
      const [currentWeather, weatherForecast] = await Promise.all([
        //locationName 是給「觀測」天氣資料拉取 API 用的地區名稱
        fetchCurrentWeather(locationName),
        //cityName 是給「預測」天氣資料拉取 API 用的地區名稱
        fetchWeatherForecast(cityName),
      ]);
      // 把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };
    //做Loading的狀態
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    // 記得要呼叫 fetchingData 這個方法
    fetchingData();
    // 因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 陣列中不帶入元素
    //將 locationName 和 cityName 帶入 useCallback 的 dependencies 中
  }, [locationName, cityName]);

  // 把原本 useEffect 的部分搬移進來
  // // STEP 2：使用 useEffect Hook
  // useEffect(() => {
  //   fetchCurrentWeather();
  //   fetchWeatherForecast();
  // }, []);

  // 說明：一旦 locationName 或 cityName 改變時，fetchData 就會改變，此時 useEffect 內的函式就會再次執行，拉取最新的天氣資料
  useEffect(() => {
    // STEP 5：呼叫 fetchData 這個方法
    fetchData();
  }, [fetchData]);

  // STEP 5：把要給其他 React 組件使用的資料或方法回傳出去
  return [weatherElement, fetchData];
};

export default useWeatherApi;
