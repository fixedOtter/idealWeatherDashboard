/* declarations */
const apiSecret = `24f68406f9194188474a030416eadbcb`;
const cityHolder = document.getElementById('cityHolder');

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

/* this calls the openweather api once the lat and long has been grabbed */
function openWeatherLL(lat, long) {
  // thanks JD!
  $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiSecret}`)
  // hands shaken; data taken
  .then(function(data) {
    console.log(data);
  });
}

/* this calls the openweather api to get lat + long */
function openWeatherCity(cityName) {
  // GET-ing from the openweather api
  $.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiSecret}`)
  // hands shaken; data taken
  .then(function(data) {
    console.log(data);
  });
}

/* ************************************ */
/* NTH: specify kind of value for temp? */
/* ************************************ */


/* function called when searching */
function searchFunction() {
  // grabs the input from the search field
  let userInput = $('#citySearch').val();
  // NTH: validate user input?
  saveCitySearch(userInput);
  displayCitySearch();
  console.log(userInput);
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