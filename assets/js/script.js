/* declarations */
const apiSecret = `24f68406f9194188474a030416eadbcb`;
const cityHolder = document.getElementById('cityHolder');
const cityTitleEl = document.getElementById(`cityTitle`);
const currentTempEl = document.getElementById(`temperature`);
const currentHumidEl = document.getElementById(`humidity`);
const currentWindEl = document.getElementById(`wind-speed`);
const currentUVEl = document.getElementById(`UV-index`);

/* this will pull the current location from the user's device */
/* navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const altitude = position.coords.altitude;
  const accuracy = position.coords.accuracy;
  const altitudeAccuracy = position.coords.altitudeAccuracy;
  const heading = position.coords.height;
  const speed = position.coords.speed;
  const timestamp = position.timestamp;
  openWeatherLL(lat, long);
}); */

/* this calls the openweather api to get lat + long */
function openWeatherCity(cityName) {
  // GET-ing from the openweather api
  $.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiSecret}`)
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

    console.log(data);
  });
}

/* this calls the openweather api once the lat and long has been grabbed */
function openWeatherLL(lat, long) {
  // thanks JD!
  $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiSecret}`)
  // hands shaken; data taken
  .then(function(data) {
    console.log(data);
  });
}

/* this calls the openweather to get UVI after we have lat + long */
function openWeatherLLUVI(lat, long) {
  $.get(`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${long}&appid=${apiSecret}&cnt=1`)
  // hands shaken; data taken
  .then(function(data) {
    //TODO: fix this UV index - try to use picnic a button?
    let UVIndex = document.createElement("a");
    console.log(data);      
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

/* ************************************ */
/* NTH: specify kind of value for temp? */
/* ************************************ */


/* function called when searching */
function searchFunction() {
  // grabs the input from the search field
  let userInput = $('#citySearch').val();
  userInput = userInput.replace(/[^a-z,A-Z ]/g, '');
  // NTH: validate user input?
  // saves userinput to the localstorage
  saveCitySearch(userInput);
  // refreshes the displayed cities
  displayCitySearch();
  // finds the weather for the userinput
  openWeatherCity(userInput);
}

/* saves user input to the local storage */
function saveCitySearch(cityName) {
  let storageArray = [];
  storageArray = getCitySearch(); // making a string
  storageArray.push(cityName);
  localStorage.setItem(`cityStorage`, JSON.stringify(storageArray));
}

/* grabs the current cities in localStorage */
function getCitySearch() {
  let cityArray = JSON.parse(localStorage.getItem(`cityStorage`));
  return cityArray;
}

/* displays the current cityStorageArray */
function displayCitySearch() {
  // first clears anything in there
  cityHolder.innerHTML = '';
  // grabs array from localstorage
  cityArray = getCitySearch();
  // iterates through and adds everything from the cityStorage key in localStorage  
  for (let i = 0; i < cityArray.length; i++) {
    cityHolder.insertAdjacentHTML(`afterbegin`, `
    <article class="card">
    <header>
      <h3>${cityArray[i]}</h3>
    </header>
  </article>
    `);
  }
}

/* this will display the forcast for each dailydiv */
function displayForecast() {
  // this clears what's currently there
  for (let i = 0; i < 8; i++) {
    $(`daily${i}`).innerHTML = '';
  }

  // this inserts the data for each dailydiv
  for (let i = 0; i < array.length; i++) {
    document.querySelector(`daily${i}`).insertAdjacentHTML('afterBegin', `
    <h3>%insertDate%</h3>
    
    `);
  }
}

/* main.js lol */
// search button listeners
$('#searchBtn').click(searchFunction);
// TODO: add eventlistener for enter key to search

// brings up the cities in local storage
displayCitySearch();