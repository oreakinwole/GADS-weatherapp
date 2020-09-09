/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-undef */
// import app from './app';
import { $ } from './utility/bling';

const startApp = () => {
    let appData = {
        placeName: '',
        lng: '',
        lat: '',
        oneCallData: ''
    };

    const updateUI = () => {
        const replaceTextNode = (text, idString) => {
            // Get the textNode which is the second item in the Nodelist
            const item = $(idString).childNodes[1];
            // Replace its value
            item.nodeValue = text;
        };


        /* Update Current Weather */
        const doGetDate = new Date(appData.oneCallData.current.dt);
        const currentDay = doGetDate.toDateString().split(' ')[0];
        // eslint-disable-next-line prefer-template
        const currentDate = doGetDate.toDateString().split(' ')[1] + ' ' + doGetDate.toDateString().split(' ')[2];
        $('#current .day').textContent = currentDay;
        $('#current .date').textContent = currentDate;
        $('#current .location').textContent = appData.placeName;
        $('#current .degree .num').innerHTML = `${Math.trunc(appData.oneCallData.current.temp)}<sup>o</sup>C`;
        $('#current .forecast-icon img').src = `http://openweathermap.org/img/wn/${appData.oneCallData.current.weather[0].icon}@2x.png`;
        replaceTextNode(`${appData.oneCallData.current.humidity}%`, '#humidity');
        replaceTextNode(`${Math.round(appData.oneCallData.current.wind_speed * 3.6)}km/h`, '#wind');
        replaceTextNode(`${appData.oneCallData.current.wind_deg} degrees`, '#wind-direction');

        /* Update Days UI */
        // getRestDays returns a string of all the 'daily weather' divs HTML which will be inserted into the DOM
        const getRestDays = () => {
            if ($('.forecast-container').childNodes[3]) {
                $('.forecast-container').childNodes.forEach((el) => {
                    if (el.className === 'forecast') $('.forecast-container').removeChild(el);
                });
            }


            const dailyData6 = appData.oneCallData.daily.slice(0, 6);
            const days = ['Tuesday', 'Wednessday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const divsArray = dailyData6.map((cur, ind) => `<div class="forecast">
                <div class="forecast-header">
                    <div class="day">${days[ind]}</div>
                </div>
                <div class="forecast-content">
                    <div class="forecast-icon">
                        <img src=http://openweathermap.org/img/wn/${cur.weather[0].icon}@2x.png alt="daily weather icon" width=48>
                    </div>
                    <div class="degree">${Math.round(cur.temp.day)}<sup>o</sup>C</div>
                    <small>${cur.wind_deg}<sup>o</sup></small>
                </div>
            </div>`);
            const divsArrayJoined = divsArray.join(' ');
            return divsArrayJoined;
        };


        $('.forecast-container').insertAdjacentHTML('beforeend', getRestDays());

        /* Store appData to Local Storage after updating UI */
        localStorage.setItem('gads_data', JSON.stringify(appData));
    };

    // Set appData to our data in localstorage if it is present in localstorage, then update UI
    if (localStorage.getItem('gads_data')) {
        appData = JSON.parse(localStorage.getItem('gads_data'));
        updateUI();
    }


    const makeApiCall = () => {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${appData.lat}&lon=${appData.lng}&units=metric&exclude=hourly,minutely&appid=981de4db31b04174e62e55887bdcabd4`)
            .then((res) => res.json())
            .then((data) => {
                appData.oneCallData = data;
                updateUI();
            })
            .catch((err) => {
                alert('an error occured while getting weather data');
                console.log(err);
            });
    };

    // autocomplete searchform as user types
    const getLocation = $('#getlocation');
    const dropdown = new google.maps.places.Autocomplete(getLocation);

    // execute this after user is done typing a place
    dropdown.addListener('place_changed', () => {
        const curLocation = dropdown.getPlace();
        appData.lng = curLocation.geometry.location.lng();
        appData.lat = curLocation.geometry.location.lat();
        appData.placeName = curLocation.name;
        makeApiCall();
    });
};

document.addEventListener('DOMContentLoaded', startApp);
