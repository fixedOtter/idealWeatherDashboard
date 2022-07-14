/* declarations */
const apiSecret = `24f68406f9194188474a030416eadbcb`;
const cityHolder = document.getElementById('cityHolder');
const cityTitleEl = document.getElementById(`cityTitle`);
const currentTempEl = document.getElementById(`temperature`);
const currentHumidEl = document.getElementById(`humidity`);
const currentWindEl = document.getElementById(`wind-speed`);
const currentUVEl = document.getElementById(`UV-index`);
let weatherHistoryArray = JSON.parse(localStorage.getItem("weatherHistory")) || [];

/* this will pull the current location from the user's device */
/* navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const altitude = position.coords.altitude;
  const accuracy = position.coords.accuracy;
  const altitudeAccuracy = position.coords.altitudeAccuracy;
  const heading = position.coords.height;
  const speed = position.coords.speed;
  const timestamp = position.timestamp
  openWeatherLL(lat, long);
}); */

/* function called when searching */
function searchFunction() {
  // grabs the input from the search field
  let userInput = $('#citySearch').val();
  userInput = userInput.replace(/[^a-z,A-Z ]/g, '');
  // NTH: validate user input?
  // saves userinput to the localstorage
  saveCitySearch(userInput);
  // finds the weather for the userinput
  openWeatherCity(userInput);
}

/* this calls the openweather api to get lat + long */
function openWeatherCity(cityName) {
  // GET-ing from the openweather api
  $.get(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${apiSecret}`)
  // hands shaken; data taken
  .then(function(data) {
    // grabs current date data
    const currentDate = new Date(data.dt * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    // change title element data
    cityTitleEl.innerHTML = `${data.name}, ${month}/${day}/${year}`;
    currentTempEl.innerHTML = `Temperature: ${data.main.temp}&#176F`;
    currentHumidEl.innerHTML = `Humidity: ${data.main.humidity}%`;
    currentWindEl.innerHTML = `Wind Speed: ${data.wind.speed} MPH`;
    // grabs the UV index
    let lat = data.coord.lat;
    let long = data.coord.lon;
    openWeatherLLUVI(lat,long);
    openWeatherLL(lat,long);

    console.log(data);
  });
}

/* this calls the openweather api once the lat and long has been grabbed */
function openWeatherLL(lat, long) {
  // thanks JD!
  $.get(`https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${long}&appid=${apiSecret}`)
  // hands shaken; data taken
  .then(function(data) {
    console.log(data);

    for (let i = 0; i < 8; i++) {
      // grabs the current div element with ES6 so I can insertAdjacent
      currDivEl = document.getElementById(`daily${i}`);

      // first clears whatevers currently in there
      currDivEl.innerHTML = '';
      
      // creates date for current el
      const forecastDate = new Date(data.daily[i].dt * 1000);
      const forecastDay = forecastDate.getDate();
      const forecastMonth = forecastDate.getMonth() + 1;
      const forecastYear = forecastDate.getFullYear();
      
      $currDivEl = $(`daily${i}`);


      console.log(`daily${i}`);
      console.log($currDivEl);
      // this inserts the data for each dailydiv

      currDivEl.insertAdjacentHTML('afterBegin', `
      <p>${forecastMonth}/${forecastDay}/${forecastYear}</p>
      <img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="${data.daily[i].weather[0].description}">
      <p>Temp: ${data.daily[i].temp.day} &#176F</p>
      <p>Humidity: ${data.daily[i].humidity}%</p>
      `); 
    }
  });
}

/* this calls the openweather to get UVI after we have lat + long */
function openWeatherLLUVI(lat, long) {
  $.get(`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${long}&appid=${apiSecret}&cnt=1`)
  // hands shaken; data taken
  .then(function(data) {
    //TODO: fix this UV index - try to use picnic a button?
    currentUVEl.innerHTML = 'UV Index: ';
    currentUVEl.insertAdjacentHTML("beforeend", `
    <a id="UVI" class="button">${data[0].value}</a>
    `);
    UVIndex = document.getElementById(`UVI`);
    // if else for creating the index
    if (data[0].value < 4 ) {
        UVIndex.setAttribute("class", "button success");
    } else if (data[0].value < 8) {
        UVIndex.setAttribute("class", "button warning");
    } else {
        UVIndex.setAttribute("class", "button error");
    }
  });
}

/* saves user input to the local storage */
function saveCitySearch(cityName) {
  // first defines the array from the getCitySearch function
  weatherHistoryArray.push(cityName);
  localStorage.setItem("weatherHistory", JSON.stringify(weatherHistoryArray));
  // refreshes the displayed cities
  displaySearchHistory();
}

/* clears the past search history */
function clearCitySearch() {
  localStorage.clear();
  weatherHistoryArray = [];
  displaySearchHistory();
}

/* displays the current weatherHistoryArray */
function displaySearchHistory() {
  // first clearing anything in the cityHolder el
  cityHolder.innerHTML = '';
  // iterates through the weatherHistoryArray and renders each as a card
  for (let i = 0; i < weatherHistoryArray.length; i++) {
    cityHolder.insertAdjacentHTML('afterbegin', `
    <article class="card">
      <header>
        <h3 class="cityHistBtn">${weatherHistoryArray[i]}</h3>
      </header>
    </article>
    `);
    // creates a button for the element just created
    const cityHistBtnEl = document.querySelector('.cityHistBtn');
    // adds a listener to search the city of the button clicked
    cityHistBtnEl.addEventListener('click', function() {
      openWeatherCity(cityHistBtnEl.innerText);
    })
  }

}

/* this will display the forcast for each dailydiv */
function displayForecast() {
  for (let i = 0; i < 8; i++) {
    // first clears whatevers currently in there
    $(`daily${i}`).innerHTML = '';
    
    // creates date for current el
    const forecastDate = new Date(data.daily[i].dt * 1000);
    const forecastDay = forecastDate.getDate();
    const forecastMonth = forecastDate.getMonth() + 1;
    const forecastYear = forecastDate.getFullYear();

    // this inserts the data for each dailydiv and even grabs the weather icon! (Thanks Odin!)
    document.querySelector(`daily${i}`).insertAdjacentHTML('afterBegin', `
    <p>${forecastMonth}/${forecastDay}/${forecastYear}</p>
    <img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="${data.daily[i].weather[0].description}">
    <p>Temp: ${data.daily[i].main.temp} &#176F</p>
    <p>Humidity: ${data.daily[i].main.humidity}%</p>
    `);
  }
}

/* main.js lol */
// button listeners
$('#searchBtn').click(searchFunction);
$('#searchHistoryClearBtn').click(clearCitySearch);

// TODO: add eventlistener for enter key to search

// brings up the cities in local storage
displaySearchHistory();