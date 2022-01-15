import {setTabsClick} from './tabs.js';
import {infoAboutPlace, searchInputEl, searchPlaceEl, onCreateHandleRouteClick} from './map.js';
import {onKnownWeatherClick} from './weather.js';
const vacationFormEl = document.querySelector('.vacation-holiday__form');
const createVacationEl = vacationFormEl.querySelector('.form__submit');
const plugTittleEl = document.querySelector('.vacation-holiday__sub-title');
const daysContainerEl = document.querySelector('#tabs');
const startDateEl = vacationFormEl.querySelector('#start-date');
const endDateEl = vacationFormEl.querySelector('#end-date');
const dayTemplate = document.querySelector('#day-template').content.querySelector('.tab-content__wrapper');
const DAY_IN_MS = 24 * 3600 * 1000;

const getArrDate = () => {
    const firstDate = new Date(startDateEl.value);
    const secondDate = new Date(endDateEl.value);
    const daysDelta = (secondDate.getTime() - firstDate.getTime()) / DAY_IN_MS;
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const arrDate = [];

    if (endDateEl.value === '') {
        arrDate.push({
            aboutDate: firstDate.toLocaleDateString('ru-RU', options)
        });
    } else {
        for (let i = 0; i <= daysDelta; i++) {
            let day = new Date(firstDate);
            day.setDate(day.getDate() + i);
            arrDate.push({
                aboutDate: day.toLocaleDateString('ru-RU', options)
            });
        }
    }

    return arrDate;
};

const createHtmlEl = (tag, className, innerHtml = '') => {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = innerHtml;
    return element;
};

const showDayContent = (dayArray, elementForContent) => {
    const dayContent = dayTemplate.cloneNode(true);
    const date = dayContent.querySelector('.tab-content__date');
    const city = dayContent.querySelector('#city');
    const knowWeatherEl = dayContent.querySelector('.tab-content__show-weather');
    const createHandleRouteEl = dayContent.querySelector('.tab-content__hand-rout');
    createHandleRouteEl.addEventListener('click', onCreateHandleRouteClick)
    knowWeatherEl.addEventListener('click', onKnownWeatherClick)
    city.textContent = infoAboutPlace.cityName;
    date.textContent = `${dayArray.aboutDate}`;
    elementForContent.append(dayContent);
};

const deleteTabs = () => {
    let tabs = daysContainerEl.querySelectorAll('div');
    tabs.forEach(tab => tab.remove());
}

const createTabs = () => {
    const dayArr = getArrDate();

    for (let i = 1; i <= dayArr.length; i++) {
        const tabEl = createHtmlEl('div', 'vacation-holiday__tab', `<span id="count-days">${i}</span> день`);
        daysContainerEl.append(tabEl);
    }
    
    for (let i = 0; i <= dayArr.length - 1; i++) {
        const tabElContent = createHtmlEl('div','vacation-holiday__tab-content hide');
        showDayContent(dayArr[i], tabElContent);
        daysContainerEl.append(tabElContent);
    }
};

const createDays = () => {
    deleteTabs();
    createTabs();
    setTabsClick();
};

const showVacationDays = () => {
    plugTittleEl.classList.remove('show');
    plugTittleEl.classList.add('hidden');
    daysContainerEl.classList.remove('hidden');
    createDays();
};

const checkSomeInputValidity = (checkInput, invalidMessage, evt) => {
    if (checkInput.value === '') {
        checkInput.setCustomValidity(invalidMessage);
        checkInput.style.border = '2px solid red';
        return false;
    } else {
        evt.preventDefault();
        checkInput.style.border = '';
        checkInput.setCustomValidity('');
        return true;
    }
};

const checkInfoAboutCity = () => {
   if (infoAboutPlace.cityName === '') {
    searchPlaceEl.style.border = '2px solid red';
    return false;
   } else {
    searchPlaceEl.style.border = '';
    return true;
   }
};

const checkValidity = (evt) => {
    if (checkSomeInputValidity(startDateEl, 'Выберите начальную дату', evt) &&
     checkSomeInputValidity(searchInputEl, 'Выберите место', evt) && checkInfoAboutCity()) {
        showVacationDays();
    }
};

const onCreateClick = (evt) => {
    checkValidity(evt);
};

const onStartDateChange = () => {
    endDateEl.min = startDateEl.value
};

startDateEl.addEventListener('change', onStartDateChange);

createVacationEl.addEventListener('click', onCreateClick);