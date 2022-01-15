import {weatherLoad} from './server.js';
import {infoAboutPlace} from './map.js';
import {isEscapeKey} from './utils/is-escape.js';
const weatherModalEl = document.querySelector('.modal-weather');
const dayListEl = weatherModalEl.querySelector('.modal-weather__daylist');
const modalCloseEl = weatherModalEl.querySelector('.modal-weather__close');
const dayDates = dayListEl.querySelectorAll('.day-date');
const dayItemEl = dayListEl.querySelectorAll('.modal-weather__day');
const weatherWrapper = weatherModalEl.querySelector('.weather');
const snowBack = weatherModalEl.querySelector('.snow');
const snowBack1 = weatherModalEl.querySelector('.snow1');
const snowBack2 = weatherModalEl.querySelector('.snow2');
const cloudBack = weatherModalEl.querySelector('.cloud.one');
const cloudBack1 = weatherModalEl.querySelector('.cloud.two');
const cloudBack2 = weatherModalEl.querySelector('.cloud.three');

const WeatherValue = {
    SNOW: 'Snow',
    RAIN: ['Rain', 'Drizzle', 'Thunderstorm'],
    CLOUDS: 'Clouds',
    CLEAR: 'Clear',
};

const Conditions = ['snow', 'rain', 'clouds', 'clear'];

const closeModalWeather = () => {
    weatherModalEl.classList.remove('show');
    weatherModalEl.classList.add('hidden');
    modalCloseEl.removeEventListener('click', onModalCloseClick)
    document.removeEventListener('keydown', onDocumentEscKeydown);
    dayListEl.removeEventListener('click', onDayClick)
}

const onDocumentEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeModalWeather();
    }
  };

const onModalCloseClick = () => {
    closeModalWeather();
};

let dailyWeather = [];

const fillDayWeather = (target) => {
    const dayTemperatureEL = weatherModalEl.querySelector('#temperature-day');
    const dayFeelsTemperatureEL = weatherModalEl.querySelector('#temperature-day-feels');
    const nightTemperatureEL = weatherModalEl.querySelector('#temperature-night');
    const nightFeelsTemperatureEL = weatherModalEl.querySelector('#temperature-night-feels');
    const weatherDescriptionEL = weatherModalEl.querySelector('#discription');
    const windSpeedEL = weatherModalEl.querySelector('#wind-speed');
    const pressureEL = weatherModalEl.querySelector('#pressure');
    const sunriseEL = weatherModalEl.querySelector('#sunrise');
    const sunsetEL = weatherModalEl.querySelector('#sunset');
    const humidityEL = weatherModalEl.querySelector('#humidity');
 
    for (let i = 0; i < dayDates.length; i++) {
      if (target === dayDates[i]) {
        let sunrise = new Date(dailyWeather[i].sunrise);
        let sunset = new Date(dailyWeather[i].sunset);
        dayTemperatureEL.textContent = Math.round(dailyWeather[i].temp.day);
        nightTemperatureEL.textContent = Math.round(dailyWeather[i].temp.night);
        dayFeelsTemperatureEL.textContent = Math.round(dailyWeather[i].feels_like.day);
        nightFeelsTemperatureEL.textContent = Math.round(dailyWeather[i].feels_like.night);
        weatherDescriptionEL.textContent = dailyWeather[i].weather[0].description;
        windSpeedEL.textContent = Math.round(dailyWeather[i].wind_speed);
        pressureEL.textContent = dailyWeather[i].pressure;
        sunriseEL.textContent = `В ${sunrise.getHours()}ч. ${sunrise.getMinutes()}м.`;
        sunsetEL.textContent = `В ${sunset.getHours()}ч. ${sunset.getMinutes()}м.`
        humidityEL.textContent = dailyWeather[i].humidity;
      }
    }
};

const clearClass = () => {  
    for (let condition of Conditions) {
        weatherWrapper.classList.remove(condition);
    }
};

const addCloud = () => {
    cloudBack.classList.remove('hidden');
    cloudBack1.classList.remove('hidden');
    cloudBack2.classList.remove('hidden');
};

const addSnow = () => {
    snowBack.classList.remove('hidden');
    snowBack1.classList.remove('hidden');
    snowBack2.classList.remove('hidden');
};

const removeCloud = () => {
    cloudBack.classList.add('hidden');
    cloudBack1.classList.add('hidden');
    cloudBack2.classList.add('hidden');
};

const removeSnow = () => {
    snowBack.classList.add('hidden');
    snowBack1.classList.add('hidden');
    snowBack2.classList.add('hidden');
};


const checkWeatherConditions = (conditionFromServer) => {
    const weatherCondition = conditionFromServer;
    if (weatherCondition === WeatherValue.SNOW) {
        clearClass();
        removeCloud();
        removeSnow();
        addSnow();
    } else if (weatherCondition === WeatherValue.CLOUDS) {
        clearClass();
        removeSnow();
        removeCloud();
        addCloud();
        weatherWrapper.classList.add('clouds');
    } else if (weatherCondition === WeatherValue.CLEAR) {
        clearClass();
        removeSnow();
        removeCloud();
        weatherWrapper.classList.add('clear');
    } else if (WeatherValue.RAIN.includes(weatherCondition)) {
        clearClass();
        removeSnow();
        removeCloud();
        weatherWrapper.classList.add('rain');
    } else {    
        clearClass();
        removeSnow();
        removeCloud();
    }
};

const changeBackground = (target) => {

    for (let i = 0; i < dayDates.length; i++) {
        if (target === dayDates[i]) {
            checkWeatherConditions(dailyWeather[i].weather[0].main); 
        } 
    }   
};

const onDayClick = (evt) => {
    const target = evt.target;

    fillDayWeather(target);

    changeBackground(target);

    for (let i = 0; i < dayDates.length; i++) {
        dayItemEl[i].classList.remove('red');
        if (target === dayDates[i]) {
            dayItemEl[i].classList.add('red');
        }
    }
};


const openModalWeather = () => {
    weatherModalEl.classList.remove('hidden');
    weatherModalEl.classList.add('show');
    dayListEl.addEventListener('click', onDayClick)
    document.addEventListener('keydown', onDocumentEscKeydown);
    modalCloseEl.addEventListener('click', onModalCloseClick)
};

const getDate = (arrWithDate) => {
    const dates = arrWithDate.daily.map(item => item.dt =  item.dt * 1000);
    arrWithDate.daily.map(item => item.sunrise =  item.sunrise * 1000);
    arrWithDate.daily.map(item => item.sunset =  item.sunset * 1000);
    for (let i = 0; i < dayDates.length; i++) {
        dayDates[i].textContent = new Date(dates[i]).toLocaleDateString();
    }
};

const getWeatherInfo = (weather) => {
    getDate(weather);
    dailyWeather = weather.daily;
    return dailyWeather;
}

const onKnownWeatherClick = () => {
    weatherLoad(infoAboutPlace.lat, infoAboutPlace.lon, getWeatherInfo);
    openModalWeather();
};

export {onKnownWeatherClick};