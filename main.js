"use strict";
(self["webpackChunkname"] = self["webpackChunkname"] || []).push([["main"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");

init();

// User Buttons
const goButton = document.querySelector("button");
const toggleButton = document.querySelector(".toggle-circle");
const userInput = document.querySelector("input");
const celsiusFahrenheitButtons = document.querySelectorAll(".fahrenheit-symbol,.celsius-symbol");

//Button event listeners
toggleButton.addEventListener("click", () => {
  toggleCelsiusFahrenheitDom();
  disableCelciusFahrenheitButtonPointer();
});
goButton.addEventListener("click", handleGoButton);
celsiusFahrenheitButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    toggleCelsiusFahrenheitDom();
    disableCelciusFahrenheitButtonPointer();
  });
});

//Allows User to hit return to submit search
userInput.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    handleGoButton();
  }
});

//Stops user clicking button that is already currently selected
function disableCelciusFahrenheitButtonPointer() {
  const celsiusButton = document.querySelector(".celsius-symbol");
  const fahrenheitButton = document.querySelector(".fahrenheit-symbol");
  celsiusButton.classList.toggle("disable-pointer");
  fahrenheitButton.classList.toggle("disable-pointer");
}

//Handles user location search
function handleGoButton() {
  let location = document.querySelector("input");
  if (location.value.trim() === "") {
    alert("Please enter location");
  } else {
    fetchWeatherForecast(location.value).then(renderWeatherForecastDom);
    location.value = "";
  }
}

//On start up
function init() {
  getCurrentlocation().then(coords => getCurrentCity(...coords)).then(fetchWeatherForecast).then(renderWeatherForecastDom).catch(error => {
    console.error("There was an error initialising", error);
    fetchWeatherForecast("London").then(renderWeatherForecastDom);
  });
}

//Async function that uses browser geolocation to access lat,lng
function getCurrentlocation() {
  toggleLoadingIconsOnDom();
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then(function (response) {
    const lat = response.coords.latitude;
    const lng = response.coords.longitude;
    return [lat, lng];
  }).catch(error => {
    throw error;
  });
}

//Async function thats uses API to reverse lookup city from lat,lng
function getCurrentCity(lat, lng) {
  return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`).then(response => {
    return response.json();
  }).then(obj => {
    if (obj.city === "Throttled! See geocode.xyz/pricing") {
      throw new Error("Geocode look up throttled");
    } else {
      return obj.city;
    }
  }).catch(error => {
    console.error("Error caught when fetching coords", error);
    return "London";
  });
}

//Async function thats uses API to lookup weather object for city
function fetchWeatherForecast(location) {
  const API_KEY = "01e16955a751428aa40141715241906";
  const url = `http://api.weatherapi.com/v1/forecast.json?q=${location}&key=${API_KEY}&days=3`;
  return fetch(url).then(function (response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(weatherObj => {
    return weatherObj;
  }).catch(function (error) {
    console.error(`Error HTTP`, error);
    throw error;
  });
}

//Renders weather data to Dom
function renderWeatherForecastDom(weatherObj) {
  const loadingImageExists = document.querySelector(".loader-text") !== null;
  if (!loadingImageExists) {
    removeWeatherDataDom();
    toggleLoadingIconsOnDom();
  }
  toggleLoadingIconsOffDom();
  const togglePosition = document.querySelector(".celsius-far-toggle");
  const tempScale = togglePosition.classList.contains("toggle-up") ? "c" : "f";
  const city = weatherObj.location.name;
  const country = weatherObj.location.country;
  const forecast = weatherObj.forecast.forecastday;
  const todaysWeatherIcon = `https:${forecast[0].day.condition.icon}`;
  forecast.forEach((day, index) => {
    const averageTemp = day.day[`avgtemp_${tempScale}`];
    const weatherIcon = `https:${day.day.condition.icon}`;
    const description = day.day.condition.text;
    const dayIndex = index;
    renderDayDOM(averageTemp, weatherIcon, description, dayIndex);
  });
  renderLocationHeadingDom(city, country);
  renderDateHeadingsDom();
  renderBackgroundWeatherSwatch(todaysWeatherIcon);
}

//Render one days weather details to Dom
function renderDayDOM(temperature, icon, description, dayIndex) {
  const day = document.querySelector(".weather-container").children[dayIndex];
  day.querySelector(".temperature h2").textContent = `${temperature}°`;
  day.querySelector(".weather-icon").children[0].src = icon;
  day.querySelector(".weather-description h6").textContent = description;
}

//Render location heading
function renderLocationHeadingDom(city, country) {
  const locationHeading = document.querySelector(".location-header");
  locationHeading.textContent = `${city} - ${country}`;
}

//Returns day/date X days in to the future
function formatDateHeadings(howManyDaysInToTheFuture) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = new Date();
  day.setDate(day.getDate() + howManyDaysInToTheFuture);
  const dayName = daysOfWeek[day.getDay()];
  const date = addOrdinalNumerSuffix(day.getDate());
  return `${dayName} ${date}`;
}

//Adds correct ordinal number suffix to number
function addOrdinalNumerSuffix(number) {
  const array = String(number).split("");
  let numberAndSuffix;
  const lastNumberInArray = array[array.length - 1];
  if (lastNumberInArray === "1") {
    numberAndSuffix = array.join("") + "st";
  } else if (lastNumberInArray === "2") {
    numberAndSuffix = array.join("") + "nd";
  } else if (lastNumberInArray === "3") {
    numberAndSuffix = array.join("") + "rd";
  } else {
    numberAndSuffix = array.join("") + "th";
  }
  return numberAndSuffix;
}

//Renders date headings to Dom
function renderDateHeadingsDom() {
  const dateHeadings = document.querySelectorAll(".day h5");
  dateHeadings.forEach((heading, index) => {
    if (index <= 0) {
      heading.textContent = "Today";
    } else {
      heading.textContent = formatDateHeadings(index);
    }
  });
}

//Toggles render between Fahrenheit and Celsius in Dom.
function toggleCelsiusFahrenheitDom() {
  toggleCelsiusFahrenheitSelectedDom();
  const toggle = document.querySelector(".celsius-far-toggle");
  const temperatures = document.querySelectorAll(".temp-number");
  const currentScale = toggle.classList.contains("toggle-up") ? "celsius" : "fahrenheit";
  toggle.classList.toggle("toggle-up");
  toggle.classList.toggle("toggle-down");
  temperatures.forEach(temp => {
    let temperatureWithoutDegreeSymbol = removeDegreeSymbol(temp.textContent);
    temp.textContent = toggleValueCelsiusFahrenheit(temperatureWithoutDegreeSymbol, currentScale);
  });
}

//Converts between Fahrenheit and Celsius
function toggleValueCelsiusFahrenheit(value, type) {
  const CELSIUS_TO_FAHRENHEIT_FACTOR = 9 / 5;
  const FAHRENHEIT_TO_CELSIUS_FACTOR = 5 / 9;
  const FAHRENHEIT_FREEZING_POINT = 32;
  let valueConverted;
  if (type === "fahrenheit") {
    valueConverted = (Number(value) - FAHRENHEIT_FREEZING_POINT) * FAHRENHEIT_TO_CELSIUS_FACTOR;
  } else {
    valueConverted = Number(value) * CELSIUS_TO_FAHRENHEIT_FACTOR + FAHRENHEIT_FREEZING_POINT;
  }
  return addDegreeSymbol(valueConverted.toFixed(1));
}

//Adds degree symbol to string
function addDegreeSymbol(str) {
  let strArray = str.split("");
  strArray.push("°");
  let stringWithDegreeSymbol = strArray.join("");
  return stringWithDegreeSymbol;
}

//Removes degree symbol from string
function removeDegreeSymbol(str) {
  let strArray = str.split("");
  strArray.pop();
  let stringWithoutDegreeSymbol = strArray.join("");
  return stringWithoutDegreeSymbol;
}

//Toggles loading icons off Dom
function toggleLoadingIconsOffDom() {
  const loaderIcons = document.querySelectorAll(".loader");
  const locationHeading = document.querySelector(".location-header");
  locationHeading.classList.remove("loader-text");
  loaderIcons.forEach(element => {
    element.remove();
  });
}

//Toggles loading icons on Dom
function toggleLoadingIconsOnDom() {
  const weatherIcons = document.querySelectorAll(".weather-icon, .temp-number");
  const locationHeading = document.querySelector(".location-header");
  locationHeading.classList.add("loader-text");
  weatherIcons.forEach(element => {
    const div = document.createElement("div");
    div.classList.add("loader");
    element.appendChild(div);
  });
}

//Removes all weather data from Dom
function removeWeatherDataDom() {
  const elementsToClear = document.querySelectorAll(".weather-description h6,.temperature h2,.location-header,.weather-icon img");
  elementsToClear.forEach(element => {
    if (element.tagName === "IMG") {
      element.src = "";
    } else {
      element.textContent = "";
    }
  });
}

//Renders selected scale to be highlighted in Dom
function toggleCelsiusFahrenheitSelectedDom() {
  const celsiusSymbol = document.querySelector(".celsius-symbol");
  const fahrenheitSymbol = document.querySelector(".fahrenheit-symbol");
  celsiusSymbol.classList.toggle("scale-symbol-selected");
  fahrenheitSymbol.classList.toggle("scale-symbol-selected");
}

//Renders background swatch pattern Dom
function renderBackgroundWeatherSwatch(url) {
  const weatherSwatchLayer = document.querySelector(".weather-swatch-opacity-layer");
  weatherSwatchLayer.style.backgroundImage = `url(${url})`;
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/MerriweatherSans.ttf */ "./src/fonts/MerriweatherSans.ttf"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Merriweather;
}

@font-face {
  font-family: "Merriweather";
  src: local("Merriweather Regular"), url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  font-weight: 400;
}

:root {
  --main-projects-color: rgb(229, 243, 246);
}

html,
body {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 465px;
}

.header {
  display: flex;
  justify-content: end;
  align-items: center;
  position: absolute;
  height: 60px;
  width: 100vw;
  border: 1px solid black;
  align-self: baseline;
  background-color: rgb(197, 227, 232);
}

.footer-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 60px;
  width: 100vw;
  border: 1px solid black;
  align-self: flex-end;
  background-color: rgb(197, 227, 232);
}

.header h1 {
  padding-left: 30px;
}

body {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 550px;
  min-height: 350px;
}

.app {
  display: flex;
  flex-direction: column;
  width: 40vw;
  border-radius: 5px;
  /* border: 1px solid black; */
  min-width: 500px;
  aspect-ratio: 15/9;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  /* border: 2px solid rgb(186, 184, 184); */
  border: 2px solid rgb(33, 36, 133);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  /* background-color: rgb(184, 184, 186); */
  background-color: rgb(33, 36, 133);
}

.app-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
  border: 2px solid rgb(186, 184, 184);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
  padding-top: 35px;
  padding-bottom: 15px;
  background-color: rgb(197, 227, 232);
}

.weather-swatch-opacity-layer {
  position: absolute;
  background-size: auto;
  position: absolute;
  opacity: 0.3;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.search-go {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* border: 1px solid rgb(7, 7, 7); */
  border-radius: 5px;
  height: 60%;
  width: 70%;
  padding: 0 5px 0 5px;
  /* background-color: rgb(131, 130, 130); */
  background-color: rgb(197, 227, 232);
}

input {
  height: 50%;
  width: 75%;
  padding: 0 5px;
}

button {
  height: 55%;
  width: 15%;
}

.weather-container {
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  width: 70%;
  min-height: 192px;
  border: 2px solid rgb(205, 203, 203);
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.location-header {
  position: absolute;
  top: -5%;
  background-color: white;
  padding: 5px;
  border: 1px solid rgb(205, 203, 203);
  border-radius: 5px;
  z-index: 2;
}

.celsius-far-toggle {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 14%;
  right: 34px;
  width: 16px;
  height: 30px;
  border: solid rgb(131, 130, 130) 1px;
  border-radius: 8px;
  padding: 2px;
  background-color: rgb(232, 229, 229);
}

.toggle-circle {
  border-radius: 6px;
  width: 12px;
  height: 12px;
  border: solid rgb(163, 161, 161) 1px;
  cursor: pointer;
  background-color: rgb(131, 130, 130);
}

.today,
.tommorow,
.overmorrow {
  /* border: 1px solid grey; */
  border-radius: 5px;
  display: grid;
  grid-template-rows: 1fr 2fr 1fr 1fr;
}

.day,
.weather-description {
  /* border: 1px solid grey; */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.day:after,
.weather-description:after {
  content: "";
  background: black;
  position: absolute;
  left: 5%;
  height: 1px;
  width: 90%;
}

.weather-description:after {
  top: 5px;
}

.day:after {
  bottom: 5px;
}

.weather-icon,
.temperature {
  /* border: 1px solid grey; */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.day {
  min-height: 14px;
}

.toggle-up {
  justify-content: flex-start;
}

.toggle-down {
  justify-content: flex-end;
}

.fahrenheit-symbol,
.celsius-symbol {
  width: 28px;
  height: 20px;
  position: absolute;
  color: rgb(163, 161, 161);
  border-radius: 15px;
  text-align: center;
  background-color: white;
  border: 1px grey solid;
  opacity: 0.7;
  cursor: pointer;
}

.disable-pointer {
  pointer-events: none;
  cursor: none;
}

.scale-symbol-selected {
  /* border: 1px grey solid; */
  box-shadow: 0px 2px grey;
  opacity: 1;
}

.fahrenheit-symbol {
  bottom: -20px;
  left: 15px;
}

.celsius-symbol {
  top: -15px;
  left: 15px;
}

.loader {
  width: 31px;
  --f: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%, #336cf0) content-box;
  mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
    radial-gradient(
      farthest-side,
      #0000 calc(100% - var(--f) - 1px),
      #000 calc(100% - var(--f))
    );
  mask-composite: destination-in;
  mask-composite: intersect;
  animation: l4 1s infinite steps(10);
}

@keyframes l4 {
  to {
    transform: rotate(1turn);
  }
}

.loader-text {
  font-weight: normal;
  font-family: Merriweather, sans-serif;
  font-size: 16px;
  animation: l1 1s linear infinite alternate;
}
.loader-text:before {
  content: "Loading...";
}

@keyframes l1 {
  to {
    opacity: 0;
  }
}

button {
  cursor: pointer;
}

a:link {
  text-decoration: none;
}

a {
  color: #000;
}

/* target the element you want the animation on */
.header div {
  /* add these styles to make the text move smoothly */
  display: inline-block;
  animation: slide-left 2s ease forwards;
}

@keyframes slide-left {
  100% {
    transform: translateX(-85vw);
  }
}

@media (max-width: 1600px) {
  .header div {
    animation: slide-left-1600 2s ease forwards;
  }

  .header div h1 {
    font-size: 1.5em;
  }

  @keyframes slide-left-1600 {
    100% {
      transform: translateX(-80vw);
    }
  }
}

@media (max-width: 780px) {
  .header div {
    animation: slide-left-780 2s ease forwards;
  }

  .header div h1 {
    font-size: 1.5em;
  }

  @keyframes slide-left-780 {
    100% {
      transform: translateX(-70vw);
    }
  }
}

@media (max-width: 300px) {
  .header div {
    font-size: 1.2em;
    animation: slide-left-300 2s ease forwards;
  }
  .header div h1 {
    font-size: 1.2em;
  }

  @keyframes slide-left-300 {
    100% {
      transform: translateX(-5vw);
    }
  }
}

.header div {
  position: relative;
}
.sun-logo {
  position: absolute;
  width: 64px;
  height: 64px;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Merriweather;\n}\n\n@font-face {\n  font-family: \"Merriweather\";\n  src: local(\"Merriweather Regular\"), url(\"./fonts/MerriweatherSans.ttf\");\n  font-weight: 400;\n}\n\n:root {\n  --main-projects-color: rgb(229, 243, 246);\n}\n\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  min-height: 465px;\n}\n\n.header {\n  display: flex;\n  justify-content: end;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: baseline;\n  background-color: rgb(197, 227, 232);\n}\n\n.footer-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: flex-end;\n  background-color: rgb(197, 227, 232);\n}\n\n.header h1 {\n  padding-left: 30px;\n}\n\nbody {\n  border: 1px solid black;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 550px;\n  min-height: 350px;\n}\n\n.app {\n  display: flex;\n  flex-direction: column;\n  width: 40vw;\n  border-radius: 5px;\n  /* border: 1px solid black; */\n  min-width: 500px;\n  aspect-ratio: 15/9;\n  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,\n    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,\n    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;\n}\n\n.footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 25%;\n  /* border: 2px solid rgb(186, 184, 184); */\n  border: 2px solid rgb(33, 36, 133);\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n  /* background-color: rgb(184, 184, 186); */\n  background-color: rgb(33, 36, 133);\n}\n\n.app-body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 75%;\n  border: 2px solid rgb(186, 184, 184);\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  position: relative;\n  padding-top: 35px;\n  padding-bottom: 15px;\n  background-color: rgb(197, 227, 232);\n}\n\n.weather-swatch-opacity-layer {\n  position: absolute;\n  background-size: auto;\n  position: absolute;\n  opacity: 0.3;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n.search-go {\n  display: flex;\n  justify-content: space-evenly;\n  align-items: center;\n  /* border: 1px solid rgb(7, 7, 7); */\n  border-radius: 5px;\n  height: 60%;\n  width: 70%;\n  padding: 0 5px 0 5px;\n  /* background-color: rgb(131, 130, 130); */\n  background-color: rgb(197, 227, 232);\n}\n\ninput {\n  height: 50%;\n  width: 75%;\n  padding: 0 5px;\n}\n\nbutton {\n  height: 55%;\n  width: 15%;\n}\n\n.weather-container {\n  z-index: 2;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 5px;\n  width: 70%;\n  min-height: 192px;\n  border: 2px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  background-color: rgb(255, 255, 255);\n}\n.location-header {\n  position: absolute;\n  top: -5%;\n  background-color: white;\n  padding: 5px;\n  border: 1px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  z-index: 2;\n}\n\n.celsius-far-toggle {\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 14%;\n  right: 34px;\n  width: 16px;\n  height: 30px;\n  border: solid rgb(131, 130, 130) 1px;\n  border-radius: 8px;\n  padding: 2px;\n  background-color: rgb(232, 229, 229);\n}\n\n.toggle-circle {\n  border-radius: 6px;\n  width: 12px;\n  height: 12px;\n  border: solid rgb(163, 161, 161) 1px;\n  cursor: pointer;\n  background-color: rgb(131, 130, 130);\n}\n\n.today,\n.tommorow,\n.overmorrow {\n  /* border: 1px solid grey; */\n  border-radius: 5px;\n  display: grid;\n  grid-template-rows: 1fr 2fr 1fr 1fr;\n}\n\n.day,\n.weather-description {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n}\n\n.day:after,\n.weather-description:after {\n  content: \"\";\n  background: black;\n  position: absolute;\n  left: 5%;\n  height: 1px;\n  width: 90%;\n}\n\n.weather-description:after {\n  top: 5px;\n}\n\n.day:after {\n  bottom: 5px;\n}\n\n.weather-icon,\n.temperature {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n}\n\n.day {\n  min-height: 14px;\n}\n\n.toggle-up {\n  justify-content: flex-start;\n}\n\n.toggle-down {\n  justify-content: flex-end;\n}\n\n.fahrenheit-symbol,\n.celsius-symbol {\n  width: 28px;\n  height: 20px;\n  position: absolute;\n  color: rgb(163, 161, 161);\n  border-radius: 15px;\n  text-align: center;\n  background-color: white;\n  border: 1px grey solid;\n  opacity: 0.7;\n  cursor: pointer;\n}\n\n.disable-pointer {\n  pointer-events: none;\n  cursor: none;\n}\n\n.scale-symbol-selected {\n  /* border: 1px grey solid; */\n  box-shadow: 0px 2px grey;\n  opacity: 1;\n}\n\n.fahrenheit-symbol {\n  bottom: -20px;\n  left: 15px;\n}\n\n.celsius-symbol {\n  top: -15px;\n  left: 15px;\n}\n\n.loader {\n  width: 31px;\n  --f: 8px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  padding: 1px;\n  background: conic-gradient(#0000 10%, #336cf0) content-box;\n  mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),\n    radial-gradient(\n      farthest-side,\n      #0000 calc(100% - var(--f) - 1px),\n      #000 calc(100% - var(--f))\n    );\n  mask-composite: destination-in;\n  mask-composite: intersect;\n  animation: l4 1s infinite steps(10);\n}\n\n@keyframes l4 {\n  to {\n    transform: rotate(1turn);\n  }\n}\n\n.loader-text {\n  font-weight: normal;\n  font-family: Merriweather, sans-serif;\n  font-size: 16px;\n  animation: l1 1s linear infinite alternate;\n}\n.loader-text:before {\n  content: \"Loading...\";\n}\n\n@keyframes l1 {\n  to {\n    opacity: 0;\n  }\n}\n\nbutton {\n  cursor: pointer;\n}\n\na:link {\n  text-decoration: none;\n}\n\na {\n  color: #000;\n}\n\n/* target the element you want the animation on */\n.header div {\n  /* add these styles to make the text move smoothly */\n  display: inline-block;\n  animation: slide-left 2s ease forwards;\n}\n\n@keyframes slide-left {\n  100% {\n    transform: translateX(-85vw);\n  }\n}\n\n@media (max-width: 1600px) {\n  .header div {\n    animation: slide-left-1600 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-1600 {\n    100% {\n      transform: translateX(-80vw);\n    }\n  }\n}\n\n@media (max-width: 780px) {\n  .header div {\n    animation: slide-left-780 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-780 {\n    100% {\n      transform: translateX(-70vw);\n    }\n  }\n}\n\n@media (max-width: 300px) {\n  .header div {\n    font-size: 1.2em;\n    animation: slide-left-300 2s ease forwards;\n  }\n  .header div h1 {\n    font-size: 1.2em;\n  }\n\n  @keyframes slide-left-300 {\n    100% {\n      transform: translateX(-5vw);\n    }\n  }\n}\n\n.header div {\n  position: relative;\n}\n.sun-logo {\n  position: absolute;\n  width: 64px;\n  height: 64px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/fonts/MerriweatherSans.ttf":
/*!****************************************!*\
  !*** ./src/fonts/MerriweatherSans.ttf ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "ee384c85ee67825b545c.ttf";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFxQjtBQUNyQkEsSUFBSSxDQUFDLENBQUM7O0FBRU47QUFDQSxNQUFNQyxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztBQUNqRCxNQUFNQyxZQUFZLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGdCQUFnQixDQUFDO0FBQzdELE1BQU1FLFNBQVMsR0FBR0gsUUFBUSxDQUFDQyxhQUFhLENBQUMsT0FBTyxDQUFDO0FBQ2pELE1BQU1HLHdCQUF3QixHQUFHSixRQUFRLENBQUNLLGdCQUFnQixDQUN4RCxvQ0FDRixDQUFDOztBQUVEO0FBQ0FILFlBQVksQ0FBQ0ksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDM0NDLDBCQUEwQixDQUFDLENBQUM7RUFDNUJDLHFDQUFxQyxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDO0FBRUZULFFBQVEsQ0FBQ08sZ0JBQWdCLENBQUMsT0FBTyxFQUFFRyxjQUFjLENBQUM7QUFFbERMLHdCQUF3QixDQUFDTSxPQUFPLENBQUVDLEdBQUcsSUFBSztFQUN4Q0EsR0FBRyxDQUFDTCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNsQ0MsMEJBQTBCLENBQUMsQ0FBQztJQUM1QkMscUNBQXFDLENBQUMsQ0FBQztFQUN6QyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7O0FBRUY7QUFDQUwsU0FBUyxDQUFDRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUdNLEtBQUssSUFBSztFQUM3QyxJQUFJQSxLQUFLLENBQUNDLEdBQUcsS0FBSyxPQUFPLEVBQUU7SUFDekJKLGNBQWMsQ0FBQyxDQUFDO0VBQ2xCO0FBQ0YsQ0FBQyxDQUFDOztBQUVGO0FBQ0EsU0FBU0QscUNBQXFDQSxDQUFBLEVBQUc7RUFDL0MsTUFBTU0sYUFBYSxHQUFHZCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztFQUMvRCxNQUFNYyxnQkFBZ0IsR0FBR2YsUUFBUSxDQUFDQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDckVhLGFBQWEsQ0FBQ0UsU0FBUyxDQUFDQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7RUFDakRGLGdCQUFnQixDQUFDQyxTQUFTLENBQUNDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztBQUN0RDs7QUFFQTtBQUNBLFNBQVNSLGNBQWNBLENBQUEsRUFBRztFQUN4QixJQUFJUyxRQUFRLEdBQUdsQixRQUFRLENBQUNDLGFBQWEsQ0FBQyxPQUFPLENBQUM7RUFDOUMsSUFBSWlCLFFBQVEsQ0FBQ0MsS0FBSyxDQUFDQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUNoQ0MsS0FBSyxDQUFDLHVCQUF1QixDQUFDO0VBQ2hDLENBQUMsTUFBTTtJQUNMQyxvQkFBb0IsQ0FBQ0osUUFBUSxDQUFDQyxLQUFLLENBQUMsQ0FBQ0ksSUFBSSxDQUFDQyx3QkFBd0IsQ0FBQztJQUNuRU4sUUFBUSxDQUFDQyxLQUFLLEdBQUcsRUFBRTtFQUNyQjtBQUNGOztBQUVBO0FBQ0EsU0FBU3JCLElBQUlBLENBQUEsRUFBRztFQUNkMkIsa0JBQWtCLENBQUMsQ0FBQyxDQUNqQkYsSUFBSSxDQUFFRyxNQUFNLElBQUtDLGNBQWMsQ0FBQyxHQUFHRCxNQUFNLENBQUMsQ0FBQyxDQUMzQ0gsSUFBSSxDQUFDRCxvQkFBb0IsQ0FBQyxDQUMxQkMsSUFBSSxDQUFDQyx3QkFBd0IsQ0FBQyxDQUM5QkksS0FBSyxDQUFFQyxLQUFLLElBQUs7SUFDaEJDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLGlDQUFpQyxFQUFFQSxLQUFLLENBQUM7SUFDdkRQLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDQyxJQUFJLENBQUNDLHdCQUF3QixDQUFDO0VBQy9ELENBQUMsQ0FBQztBQUNOOztBQUVBO0FBQ0EsU0FBU0Msa0JBQWtCQSxDQUFBLEVBQUc7RUFDNUJNLHVCQUF1QixDQUFDLENBQUM7RUFDekIsT0FBTyxJQUFJQyxPQUFPLENBQUMsVUFBVUMsT0FBTyxFQUFFQyxNQUFNLEVBQUU7SUFDNUNDLFNBQVMsQ0FBQ0MsV0FBVyxDQUFDQyxrQkFBa0IsQ0FBQ0osT0FBTyxFQUFFQyxNQUFNLENBQUM7RUFDM0QsQ0FBQyxDQUFDLENBQ0NYLElBQUksQ0FBQyxVQUFVZSxRQUFRLEVBQUU7SUFDeEIsTUFBTUMsR0FBRyxHQUFHRCxRQUFRLENBQUNaLE1BQU0sQ0FBQ2MsUUFBUTtJQUNwQyxNQUFNQyxHQUFHLEdBQUdILFFBQVEsQ0FBQ1osTUFBTSxDQUFDZ0IsU0FBUztJQUNyQyxPQUFPLENBQUNILEdBQUcsRUFBRUUsR0FBRyxDQUFDO0VBQ25CLENBQUMsQ0FBQyxDQUNEYixLQUFLLENBQUVDLEtBQUssSUFBSztJQUNoQixNQUFNQSxLQUFLO0VBQ2IsQ0FBQyxDQUFDO0FBQ047O0FBRUE7QUFDQSxTQUFTRixjQUFjQSxDQUFDWSxHQUFHLEVBQUVFLEdBQUcsRUFBRTtFQUNoQyxPQUFPRSxLQUFLLENBQUMsdUJBQXVCSixHQUFHLElBQUlFLEdBQUcsYUFBYSxDQUFDLENBQ3pEbEIsSUFBSSxDQUFFZSxRQUFRLElBQUs7SUFDbEIsT0FBT0EsUUFBUSxDQUFDTSxJQUFJLENBQUMsQ0FBQztFQUN4QixDQUFDLENBQUMsQ0FDRHJCLElBQUksQ0FBRXNCLEdBQUcsSUFBSztJQUNiLElBQUlBLEdBQUcsQ0FBQ0MsSUFBSSxLQUFLLG9DQUFvQyxFQUFFO01BQ3JELE1BQU0sSUFBSUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDO0lBQzlDLENBQUMsTUFBTTtNQUNMLE9BQU9GLEdBQUcsQ0FBQ0MsSUFBSTtJQUNqQjtFQUNGLENBQUMsQ0FBQyxDQUNEbEIsS0FBSyxDQUFFQyxLQUFLLElBQUs7SUFDaEJDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLG1DQUFtQyxFQUFFQSxLQUFLLENBQUM7SUFDekQsT0FBTyxRQUFRO0VBQ2pCLENBQUMsQ0FBQztBQUNOOztBQUVBO0FBQ0EsU0FBU1Asb0JBQW9CQSxDQUFDSixRQUFRLEVBQUU7RUFDdEMsTUFBTThCLE9BQU8sR0FBRyxpQ0FBaUM7RUFDakQsTUFBTUMsR0FBRyxHQUFHLGdEQUFnRC9CLFFBQVEsUUFBUThCLE9BQU8sU0FBUztFQUM1RixPQUFPTCxLQUFLLENBQUNNLEdBQUcsQ0FBQyxDQUNkMUIsSUFBSSxDQUFDLFVBQVVlLFFBQVEsRUFBRTtJQUN4QixJQUFJLENBQUNBLFFBQVEsQ0FBQ1ksRUFBRSxFQUFFO01BQ2hCLE1BQU0sSUFBSUgsS0FBSyxDQUFDLHVCQUF1QlQsUUFBUSxDQUFDYSxNQUFNLEVBQUUsQ0FBQztJQUMzRDtJQUNBLE9BQU9iLFFBQVEsQ0FBQ00sSUFBSSxDQUFDLENBQUM7RUFDeEIsQ0FBQyxDQUFDLENBQ0RyQixJQUFJLENBQUU2QixVQUFVLElBQUs7SUFDcEIsT0FBT0EsVUFBVTtFQUNuQixDQUFDLENBQUMsQ0FDRHhCLEtBQUssQ0FBQyxVQUFVQyxLQUFLLEVBQUU7SUFDdEJDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLFlBQVksRUFBRUEsS0FBSyxDQUFDO0lBQ2xDLE1BQU1BLEtBQUs7RUFDYixDQUFDLENBQUM7QUFDTjs7QUFFQTtBQUNBLFNBQVNMLHdCQUF3QkEsQ0FBQzRCLFVBQVUsRUFBRTtFQUM1QyxNQUFNQyxrQkFBa0IsR0FBR3JELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUk7RUFDMUUsSUFBSSxDQUFDb0Qsa0JBQWtCLEVBQUU7SUFDdkJDLG9CQUFvQixDQUFDLENBQUM7SUFDdEJ2Qix1QkFBdUIsQ0FBQyxDQUFDO0VBQzNCO0VBQ0F3Qix3QkFBd0IsQ0FBQyxDQUFDO0VBQzFCLE1BQU1DLGNBQWMsR0FBR3hELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0VBQ3BFLE1BQU13RCxTQUFTLEdBQUdELGNBQWMsQ0FBQ3hDLFNBQVMsQ0FBQzBDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRztFQUM1RSxNQUFNWixJQUFJLEdBQUdNLFVBQVUsQ0FBQ2xDLFFBQVEsQ0FBQ3lDLElBQUk7RUFDckMsTUFBTUMsT0FBTyxHQUFHUixVQUFVLENBQUNsQyxRQUFRLENBQUMwQyxPQUFPO0VBQzNDLE1BQU1DLFFBQVEsR0FBR1QsVUFBVSxDQUFDUyxRQUFRLENBQUNDLFdBQVc7RUFDaEQsTUFBTUMsaUJBQWlCLEdBQUcsU0FBU0YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDRyxHQUFHLENBQUNDLFNBQVMsQ0FBQ0MsSUFBSSxFQUFFO0VBRW5FTCxRQUFRLENBQUNuRCxPQUFPLENBQUMsQ0FBQ3NELEdBQUcsRUFBRUcsS0FBSyxLQUFLO0lBQy9CLE1BQU1DLFdBQVcsR0FBR0osR0FBRyxDQUFDQSxHQUFHLENBQUMsV0FBV1AsU0FBUyxFQUFFLENBQUM7SUFDbkQsTUFBTVksV0FBVyxHQUFHLFNBQVNMLEdBQUcsQ0FBQ0EsR0FBRyxDQUFDQyxTQUFTLENBQUNDLElBQUksRUFBRTtJQUNyRCxNQUFNSSxXQUFXLEdBQUdOLEdBQUcsQ0FBQ0EsR0FBRyxDQUFDQyxTQUFTLENBQUNNLElBQUk7SUFDMUMsTUFBTUMsUUFBUSxHQUFHTCxLQUFLO0lBQ3RCTSxZQUFZLENBQUNMLFdBQVcsRUFBRUMsV0FBVyxFQUFFQyxXQUFXLEVBQUVFLFFBQVEsQ0FBQztFQUMvRCxDQUFDLENBQUM7RUFDRkUsd0JBQXdCLENBQUM1QixJQUFJLEVBQUVjLE9BQU8sQ0FBQztFQUN2Q2UscUJBQXFCLENBQUMsQ0FBQztFQUN2QkMsNkJBQTZCLENBQUNiLGlCQUFpQixDQUFDO0FBQ2xEOztBQUVBO0FBQ0EsU0FBU1UsWUFBWUEsQ0FBQ0ksV0FBVyxFQUFFWCxJQUFJLEVBQUVJLFdBQVcsRUFBRUUsUUFBUSxFQUFFO0VBQzlELE1BQU1SLEdBQUcsR0FBR2hFLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM2RSxRQUFRLENBQUNOLFFBQVEsQ0FBQztFQUMzRVIsR0FBRyxDQUFDL0QsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM4RSxXQUFXLEdBQUcsR0FBR0YsV0FBVyxHQUFHO0VBQ3BFYixHQUFHLENBQUMvRCxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM2RSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUcsR0FBR2QsSUFBSTtFQUN6REYsR0FBRyxDQUFDL0QsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM4RSxXQUFXLEdBQUdULFdBQVc7QUFDeEU7O0FBRUE7QUFDQSxTQUFTSSx3QkFBd0JBLENBQUM1QixJQUFJLEVBQUVjLE9BQU8sRUFBRTtFQUMvQyxNQUFNcUIsZUFBZSxHQUFHakYsUUFBUSxDQUFDQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDbEVnRixlQUFlLENBQUNGLFdBQVcsR0FBRyxHQUFHakMsSUFBSSxNQUFNYyxPQUFPLEVBQUU7QUFDdEQ7O0FBRUE7QUFDQSxTQUFTc0Isa0JBQWtCQSxDQUFDQyx3QkFBd0IsRUFBRTtFQUNwRCxNQUFNQyxVQUFVLEdBQUcsQ0FDakIsUUFBUSxFQUNSLFFBQVEsRUFDUixTQUFTLEVBQ1QsV0FBVyxFQUNYLFVBQVUsRUFDVixRQUFRLEVBQ1IsVUFBVSxDQUNYO0VBRUQsTUFBTXBCLEdBQUcsR0FBRyxJQUFJcUIsSUFBSSxDQUFDLENBQUM7RUFDdEJyQixHQUFHLENBQUNzQixPQUFPLENBQUN0QixHQUFHLENBQUN1QixPQUFPLENBQUMsQ0FBQyxHQUFHSix3QkFBd0IsQ0FBQztFQUNyRCxNQUFNSyxPQUFPLEdBQUdKLFVBQVUsQ0FBQ3BCLEdBQUcsQ0FBQ3lCLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDeEMsTUFBTUMsSUFBSSxHQUFHQyxxQkFBcUIsQ0FBQzNCLEdBQUcsQ0FBQ3VCLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFFakQsT0FBTyxHQUFHQyxPQUFPLElBQUlFLElBQUksRUFBRTtBQUM3Qjs7QUFFQTtBQUNBLFNBQVNDLHFCQUFxQkEsQ0FBQ0MsTUFBTSxFQUFFO0VBQ3JDLE1BQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDRixNQUFNLENBQUMsQ0FBQ0csS0FBSyxDQUFDLEVBQUUsQ0FBQztFQUN0QyxJQUFJQyxlQUFlO0VBQ25CLE1BQU1DLGlCQUFpQixHQUFHSixLQUFLLENBQUNBLEtBQUssQ0FBQ0ssTUFBTSxHQUFHLENBQUMsQ0FBQztFQUNqRCxJQUFJRCxpQkFBaUIsS0FBSyxHQUFHLEVBQUU7SUFDN0JELGVBQWUsR0FBR0gsS0FBSyxDQUFDTSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSTtFQUN6QyxDQUFDLE1BQU0sSUFBSUYsaUJBQWlCLEtBQUssR0FBRyxFQUFFO0lBQ3BDRCxlQUFlLEdBQUdILEtBQUssQ0FBQ00sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUk7RUFDekMsQ0FBQyxNQUFNLElBQUlGLGlCQUFpQixLQUFLLEdBQUcsRUFBRTtJQUNwQ0QsZUFBZSxHQUFHSCxLQUFLLENBQUNNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJO0VBQ3pDLENBQUMsTUFBTTtJQUNMSCxlQUFlLEdBQUdILEtBQUssQ0FBQ00sSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUk7RUFDekM7RUFDQSxPQUFPSCxlQUFlO0FBQ3hCOztBQUVBO0FBQ0EsU0FBU3JCLHFCQUFxQkEsQ0FBQSxFQUFHO0VBQy9CLE1BQU15QixZQUFZLEdBQUdwRyxRQUFRLENBQUNLLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztFQUN6RCtGLFlBQVksQ0FBQzFGLE9BQU8sQ0FBQyxDQUFDMkYsT0FBTyxFQUFFbEMsS0FBSyxLQUFLO0lBQ3ZDLElBQUlBLEtBQUssSUFBSSxDQUFDLEVBQUU7TUFDZGtDLE9BQU8sQ0FBQ3RCLFdBQVcsR0FBRyxPQUFPO0lBQy9CLENBQUMsTUFBTTtNQUNMc0IsT0FBTyxDQUFDdEIsV0FBVyxHQUFHRyxrQkFBa0IsQ0FBQ2YsS0FBSyxDQUFDO0lBQ2pEO0VBQ0YsQ0FBQyxDQUFDO0FBQ0o7O0FBRUE7QUFDQSxTQUFTNUQsMEJBQTBCQSxDQUFBLEVBQUc7RUFDcEMrRixrQ0FBa0MsQ0FBQyxDQUFDO0VBQ3BDLE1BQU1yRixNQUFNLEdBQUdqQixRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUM1RCxNQUFNc0csWUFBWSxHQUFHdkcsUUFBUSxDQUFDSyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7RUFDOUQsTUFBTW1HLFlBQVksR0FBR3ZGLE1BQU0sQ0FBQ0QsU0FBUyxDQUFDMEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUN2RCxTQUFTLEdBQ1QsWUFBWTtFQUNoQnpDLE1BQU0sQ0FBQ0QsU0FBUyxDQUFDQyxNQUFNLENBQUMsV0FBVyxDQUFDO0VBQ3BDQSxNQUFNLENBQUNELFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLGFBQWEsQ0FBQztFQUV0Q3NGLFlBQVksQ0FBQzdGLE9BQU8sQ0FBRStGLElBQUksSUFBSztJQUM3QixJQUFJQyw4QkFBOEIsR0FBR0Msa0JBQWtCLENBQUNGLElBQUksQ0FBQzFCLFdBQVcsQ0FBQztJQUN6RTBCLElBQUksQ0FBQzFCLFdBQVcsR0FBRzZCLDRCQUE0QixDQUM3Q0YsOEJBQThCLEVBQzlCRixZQUNGLENBQUM7RUFDSCxDQUFDLENBQUM7QUFDSjs7QUFFQTtBQUNBLFNBQVNJLDRCQUE0QkEsQ0FBQ3pGLEtBQUssRUFBRTBGLElBQUksRUFBRTtFQUNqRCxNQUFNQyw0QkFBNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUMxQyxNQUFNQyw0QkFBNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUMxQyxNQUFNQyx5QkFBeUIsR0FBRyxFQUFFO0VBQ3BDLElBQUlDLGNBQWM7RUFFbEIsSUFBSUosSUFBSSxLQUFLLFlBQVksRUFBRTtJQUN6QkksY0FBYyxHQUNaLENBQUNDLE1BQU0sQ0FBQy9GLEtBQUssQ0FBQyxHQUFHNkYseUJBQXlCLElBQzFDRCw0QkFBNEI7RUFDaEMsQ0FBQyxNQUFNO0lBQ0xFLGNBQWMsR0FDWkMsTUFBTSxDQUFDL0YsS0FBSyxDQUFDLEdBQUcyRiw0QkFBNEIsR0FBR0UseUJBQXlCO0VBQzVFO0VBQ0EsT0FBT0csZUFBZSxDQUFDRixjQUFjLENBQUNHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRDs7QUFFQTtBQUNBLFNBQVNELGVBQWVBLENBQUNFLEdBQUcsRUFBRTtFQUM1QixJQUFJQyxRQUFRLEdBQUdELEdBQUcsQ0FBQ3RCLEtBQUssQ0FBQyxFQUFFLENBQUM7RUFDNUJ1QixRQUFRLENBQUNDLElBQUksQ0FBQyxHQUFHLENBQUM7RUFDbEIsSUFBSUMsc0JBQXNCLEdBQUdGLFFBQVEsQ0FBQ25CLElBQUksQ0FBQyxFQUFFLENBQUM7RUFDOUMsT0FBT3FCLHNCQUFzQjtBQUMvQjs7QUFFQTtBQUNBLFNBQVNiLGtCQUFrQkEsQ0FBQ1UsR0FBRyxFQUFFO0VBQy9CLElBQUlDLFFBQVEsR0FBR0QsR0FBRyxDQUFDdEIsS0FBSyxDQUFDLEVBQUUsQ0FBQztFQUM1QnVCLFFBQVEsQ0FBQ0csR0FBRyxDQUFDLENBQUM7RUFDZCxJQUFJQyx5QkFBeUIsR0FBR0osUUFBUSxDQUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQztFQUNqRCxPQUFPdUIseUJBQXlCO0FBQ2xDOztBQUVBO0FBQ0EsU0FBU25FLHdCQUF3QkEsQ0FBQSxFQUFHO0VBQ2xDLE1BQU1vRSxXQUFXLEdBQUczSCxRQUFRLENBQUNLLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztFQUN4RCxNQUFNNEUsZUFBZSxHQUFHakYsUUFBUSxDQUFDQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDbEVnRixlQUFlLENBQUNqRSxTQUFTLENBQUM0RyxNQUFNLENBQUMsYUFBYSxDQUFDO0VBQy9DRCxXQUFXLENBQUNqSCxPQUFPLENBQUVtSCxPQUFPLElBQUs7SUFDL0JBLE9BQU8sQ0FBQ0QsTUFBTSxDQUFDLENBQUM7RUFDbEIsQ0FBQyxDQUFDO0FBQ0o7O0FBRUE7QUFDQSxTQUFTN0YsdUJBQXVCQSxDQUFBLEVBQUc7RUFDakMsTUFBTStGLFlBQVksR0FBRzlILFFBQVEsQ0FBQ0ssZ0JBQWdCLENBQUMsNkJBQTZCLENBQUM7RUFDN0UsTUFBTTRFLGVBQWUsR0FBR2pGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBQ2xFZ0YsZUFBZSxDQUFDakUsU0FBUyxDQUFDK0csR0FBRyxDQUFDLGFBQWEsQ0FBQztFQUM1Q0QsWUFBWSxDQUFDcEgsT0FBTyxDQUFFbUgsT0FBTyxJQUFLO0lBQ2hDLE1BQU1HLEdBQUcsR0FBR2hJLFFBQVEsQ0FBQ2lJLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDekNELEdBQUcsQ0FBQ2hILFNBQVMsQ0FBQytHLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDM0JGLE9BQU8sQ0FBQ0ssV0FBVyxDQUFDRixHQUFHLENBQUM7RUFDMUIsQ0FBQyxDQUFDO0FBQ0o7O0FBRUE7QUFDQSxTQUFTMUUsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTTZFLGVBQWUsR0FBR25JLFFBQVEsQ0FBQ0ssZ0JBQWdCLENBQy9DLDRFQUNGLENBQUM7RUFDRDhILGVBQWUsQ0FBQ3pILE9BQU8sQ0FBRW1ILE9BQU8sSUFBSztJQUNuQyxJQUFJQSxPQUFPLENBQUNPLE9BQU8sS0FBSyxLQUFLLEVBQUU7TUFDN0JQLE9BQU8sQ0FBQzdDLEdBQUcsR0FBRyxFQUFFO0lBQ2xCLENBQUMsTUFBTTtNQUNMNkMsT0FBTyxDQUFDOUMsV0FBVyxHQUFHLEVBQUU7SUFDMUI7RUFDRixDQUFDLENBQUM7QUFDSjs7QUFFQTtBQUNBLFNBQVN1QixrQ0FBa0NBLENBQUEsRUFBRztFQUM1QyxNQUFNK0IsYUFBYSxHQUFHckksUUFBUSxDQUFDQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7RUFDL0QsTUFBTXFJLGdCQUFnQixHQUFHdEksUUFBUSxDQUFDQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDckVvSSxhQUFhLENBQUNySCxTQUFTLENBQUNDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztFQUN2RHFILGdCQUFnQixDQUFDdEgsU0FBUyxDQUFDQyxNQUFNLENBQUMsdUJBQXVCLENBQUM7QUFDNUQ7O0FBRUE7QUFDQSxTQUFTMkQsNkJBQTZCQSxDQUFDM0IsR0FBRyxFQUFFO0VBQzFDLE1BQU1zRixrQkFBa0IsR0FBR3ZJLFFBQVEsQ0FBQ0MsYUFBYSxDQUMvQywrQkFDRixDQUFDO0VBQ0RzSSxrQkFBa0IsQ0FBQ0MsS0FBSyxDQUFDQyxlQUFlLEdBQUcsT0FBT3hGLEdBQUcsR0FBRztBQUMxRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6VEE7QUFDMEc7QUFDakI7QUFDTztBQUNoRyw0Q0FBNEMscUlBQStDO0FBQzNGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0YseUNBQXlDLHNGQUErQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLG1DQUFtQztBQUMvRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGdGQUFnRixVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sT0FBTyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sT0FBTyxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sTUFBTSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sTUFBTSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyxZQUFZLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxXQUFXLFlBQVksVUFBVSxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssS0FBSyxVQUFVLEtBQUssTUFBTSxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLE1BQU0sWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBSyxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksT0FBTyxL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O0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uYW1lLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL25hbWUvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmluaXQoKTtcblxuLy8gVXNlciBCdXR0b25zXG5jb25zdCBnb0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XG5jb25zdCB0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZ2dsZS1jaXJjbGVcIik7XG5jb25zdCB1c2VySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG5jb25zdCBjZWxzaXVzRmFocmVuaGVpdEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICBcIi5mYWhyZW5oZWl0LXN5bWJvbCwuY2Vsc2l1cy1zeW1ib2xcIlxuKTtcblxuLy9CdXR0b24gZXZlbnQgbGlzdGVuZXJzXG50b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgZGlzYWJsZUNlbGNpdXNGYWhyZW5oZWl0QnV0dG9uUG9pbnRlcigpO1xufSk7XG5cbmdvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVHb0J1dHRvbik7XG5cbmNlbHNpdXNGYWhyZW5oZWl0QnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgICBkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyKCk7XG4gIH0pO1xufSk7XG5cbi8vQWxsb3dzIFVzZXIgdG8gaGl0IHJldHVybiB0byBzdWJtaXQgc2VhcmNoXG51c2VySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICBoYW5kbGVHb0J1dHRvbigpO1xuICB9XG59KTtcblxuLy9TdG9wcyB1c2VyIGNsaWNraW5nIGJ1dHRvbiB0aGF0IGlzIGFscmVhZHkgY3VycmVudGx5IHNlbGVjdGVkXG5mdW5jdGlvbiBkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyKCkge1xuICBjb25zdCBjZWxzaXVzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLXN5bWJvbFwiKTtcbiAgY29uc3QgZmFocmVuaGVpdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmFocmVuaGVpdC1zeW1ib2xcIik7XG4gIGNlbHNpdXNCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGUtcG9pbnRlclwiKTtcbiAgZmFocmVuaGVpdEJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZGlzYWJsZS1wb2ludGVyXCIpO1xufVxuXG4vL0hhbmRsZXMgdXNlciBsb2NhdGlvbiBzZWFyY2hcbmZ1bmN0aW9uIGhhbmRsZUdvQnV0dG9uKCkge1xuICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG4gIGlmIChsb2NhdGlvbi52YWx1ZS50cmltKCkgPT09IFwiXCIpIHtcbiAgICBhbGVydChcIlBsZWFzZSBlbnRlciBsb2NhdGlvblwiKTtcbiAgfSBlbHNlIHtcbiAgICBmZXRjaFdlYXRoZXJGb3JlY2FzdChsb2NhdGlvbi52YWx1ZSkudGhlbihyZW5kZXJXZWF0aGVyRm9yZWNhc3REb20pO1xuICAgIGxvY2F0aW9uLnZhbHVlID0gXCJcIjtcbiAgfVxufVxuXG4vL09uIHN0YXJ0IHVwXG5mdW5jdGlvbiBpbml0KCkge1xuICBnZXRDdXJyZW50bG9jYXRpb24oKVxuICAgIC50aGVuKChjb29yZHMpID0+IGdldEN1cnJlbnRDaXR5KC4uLmNvb3JkcykpXG4gICAgLnRoZW4oZmV0Y2hXZWF0aGVyRm9yZWNhc3QpXG4gICAgLnRoZW4ocmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tKVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSB3YXMgYW4gZXJyb3IgaW5pdGlhbGlzaW5nXCIsIGVycm9yKTtcbiAgICAgIGZldGNoV2VhdGhlckZvcmVjYXN0KFwiTG9uZG9uXCIpLnRoZW4ocmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tKTtcbiAgICB9KTtcbn1cblxuLy9Bc3luYyBmdW5jdGlvbiB0aGF0IHVzZXMgYnJvd3NlciBnZW9sb2NhdGlvbiB0byBhY2Nlc3MgbGF0LGxuZ1xuZnVuY3Rpb24gZ2V0Q3VycmVudGxvY2F0aW9uKCkge1xuICB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbnN0IGxhdCA9IHJlc3BvbnNlLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgIGNvbnN0IGxuZyA9IHJlc3BvbnNlLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICByZXR1cm4gW2xhdCwgbG5nXTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0pO1xufVxuXG4vL0FzeW5jIGZ1bmN0aW9uIHRoYXRzIHVzZXMgQVBJIHRvIHJldmVyc2UgbG9va3VwIGNpdHkgZnJvbSBsYXQsbG5nXG5mdW5jdGlvbiBnZXRDdXJyZW50Q2l0eShsYXQsIGxuZykge1xuICByZXR1cm4gZmV0Y2goYGh0dHBzOi8vZ2VvY29kZS54eXovJHtsYXR9LCR7bG5nfT9nZW9pdD1qc29uYClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmNpdHkgPT09IFwiVGhyb3R0bGVkISBTZWUgZ2VvY29kZS54eXovcHJpY2luZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlb2NvZGUgbG9vayB1cCB0aHJvdHRsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqLmNpdHk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY2F1Z2h0IHdoZW4gZmV0Y2hpbmcgY29vcmRzXCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBcIkxvbmRvblwiO1xuICAgIH0pO1xufVxuXG4vL0FzeW5jIGZ1bmN0aW9uIHRoYXRzIHVzZXMgQVBJIHRvIGxvb2t1cCB3ZWF0aGVyIG9iamVjdCBmb3IgY2l0eVxuZnVuY3Rpb24gZmV0Y2hXZWF0aGVyRm9yZWNhc3QobG9jYXRpb24pIHtcbiAgY29uc3QgQVBJX0tFWSA9IFwiMDFlMTY5NTVhNzUxNDI4YWE0MDE0MTcxNTI0MTkwNlwiO1xuICBjb25zdCB1cmwgPSBgaHR0cDovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP3E9JHtsb2NhdGlvbn0ma2V5PSR7QVBJX0tFWX0mZGF5cz0zYDtcbiAgcmV0dXJuIGZldGNoKHVybClcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqKSA9PiB7XG4gICAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIEhUVFBgLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9KTtcbn1cblxuLy9SZW5kZXJzIHdlYXRoZXIgZGF0YSB0byBEb21cbmZ1bmN0aW9uIHJlbmRlcldlYXRoZXJGb3JlY2FzdERvbSh3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IGxvYWRpbmdJbWFnZUV4aXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGVyLXRleHRcIikgIT09IG51bGw7XG4gIGlmICghbG9hZGluZ0ltYWdlRXhpc3RzKSB7XG4gICAgcmVtb3ZlV2VhdGhlckRhdGFEb20oKTtcbiAgICB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpO1xuICB9XG4gIHRvZ2dsZUxvYWRpbmdJY29uc09mZkRvbSgpO1xuICBjb25zdCB0b2dnbGVQb3NpdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2Vsc2l1cy1mYXItdG9nZ2xlXCIpO1xuICBjb25zdCB0ZW1wU2NhbGUgPSB0b2dnbGVQb3NpdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b2dnbGUtdXBcIikgPyBcImNcIiA6IFwiZlwiO1xuICBjb25zdCBjaXR5ID0gd2VhdGhlck9iai5sb2NhdGlvbi5uYW1lO1xuICBjb25zdCBjb3VudHJ5ID0gd2VhdGhlck9iai5sb2NhdGlvbi5jb3VudHJ5O1xuICBjb25zdCBmb3JlY2FzdCA9IHdlYXRoZXJPYmouZm9yZWNhc3QuZm9yZWNhc3RkYXk7XG4gIGNvbnN0IHRvZGF5c1dlYXRoZXJJY29uID0gYGh0dHBzOiR7Zm9yZWNhc3RbMF0uZGF5LmNvbmRpdGlvbi5pY29ufWA7XG5cbiAgZm9yZWNhc3QuZm9yRWFjaCgoZGF5LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGF2ZXJhZ2VUZW1wID0gZGF5LmRheVtgYXZndGVtcF8ke3RlbXBTY2FsZX1gXTtcbiAgICBjb25zdCB3ZWF0aGVySWNvbiA9IGBodHRwczoke2RheS5kYXkuY29uZGl0aW9uLmljb259YDtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRheS5kYXkuY29uZGl0aW9uLnRleHQ7XG4gICAgY29uc3QgZGF5SW5kZXggPSBpbmRleDtcbiAgICByZW5kZXJEYXlET00oYXZlcmFnZVRlbXAsIHdlYXRoZXJJY29uLCBkZXNjcmlwdGlvbiwgZGF5SW5kZXgpO1xuICB9KTtcbiAgcmVuZGVyTG9jYXRpb25IZWFkaW5nRG9tKGNpdHksIGNvdW50cnkpO1xuICByZW5kZXJEYXRlSGVhZGluZ3NEb20oKTtcbiAgcmVuZGVyQmFja2dyb3VuZFdlYXRoZXJTd2F0Y2godG9kYXlzV2VhdGhlckljb24pO1xufVxuXG4vL1JlbmRlciBvbmUgZGF5cyB3ZWF0aGVyIGRldGFpbHMgdG8gRG9tXG5mdW5jdGlvbiByZW5kZXJEYXlET00odGVtcGVyYXR1cmUsIGljb24sIGRlc2NyaXB0aW9uLCBkYXlJbmRleCkge1xuICBjb25zdCBkYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItY29udGFpbmVyXCIpLmNoaWxkcmVuW2RheUluZGV4XTtcbiAgZGF5LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGVyYXR1cmUgaDJcIikudGV4dENvbnRlbnQgPSBgJHt0ZW1wZXJhdHVyZX3CsGA7XG4gIGRheS5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItaWNvblwiKS5jaGlsZHJlblswXS5zcmMgPSBpY29uO1xuICBkYXkucXVlcnlTZWxlY3RvcihcIi53ZWF0aGVyLWRlc2NyaXB0aW9uIGg2XCIpLnRleHRDb250ZW50ID0gZGVzY3JpcHRpb247XG59XG5cbi8vUmVuZGVyIGxvY2F0aW9uIGhlYWRpbmdcbmZ1bmN0aW9uIHJlbmRlckxvY2F0aW9uSGVhZGluZ0RvbShjaXR5LCBjb3VudHJ5KSB7XG4gIGNvbnN0IGxvY2F0aW9uSGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb24taGVhZGVyXCIpO1xuICBsb2NhdGlvbkhlYWRpbmcudGV4dENvbnRlbnQgPSBgJHtjaXR5fSAtICR7Y291bnRyeX1gO1xufVxuXG4vL1JldHVybnMgZGF5L2RhdGUgWCBkYXlzIGluIHRvIHRoZSBmdXR1cmVcbmZ1bmN0aW9uIGZvcm1hdERhdGVIZWFkaW5ncyhob3dNYW55RGF5c0luVG9UaGVGdXR1cmUpIHtcbiAgY29uc3QgZGF5c09mV2VlayA9IFtcbiAgICBcIlN1bmRheVwiLFxuICAgIFwiTW9uZGF5XCIsXG4gICAgXCJUdWVzZGF5XCIsXG4gICAgXCJXZWRuZXNkYXlcIixcbiAgICBcIlRodXJzZGF5XCIsXG4gICAgXCJGcmlkYXlcIixcbiAgICBcIlNhdHVyZGF5XCIsXG4gIF07XG5cbiAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIGhvd01hbnlEYXlzSW5Ub1RoZUZ1dHVyZSk7XG4gIGNvbnN0IGRheU5hbWUgPSBkYXlzT2ZXZWVrW2RheS5nZXREYXkoKV07XG4gIGNvbnN0IGRhdGUgPSBhZGRPcmRpbmFsTnVtZXJTdWZmaXgoZGF5LmdldERhdGUoKSk7XG5cbiAgcmV0dXJuIGAke2RheU5hbWV9ICR7ZGF0ZX1gO1xufVxuXG4vL0FkZHMgY29ycmVjdCBvcmRpbmFsIG51bWJlciBzdWZmaXggdG8gbnVtYmVyXG5mdW5jdGlvbiBhZGRPcmRpbmFsTnVtZXJTdWZmaXgobnVtYmVyKSB7XG4gIGNvbnN0IGFycmF5ID0gU3RyaW5nKG51bWJlcikuc3BsaXQoXCJcIik7XG4gIGxldCBudW1iZXJBbmRTdWZmaXg7XG4gIGNvbnN0IGxhc3ROdW1iZXJJbkFycmF5ID0gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gIGlmIChsYXN0TnVtYmVySW5BcnJheSA9PT0gXCIxXCIpIHtcbiAgICBudW1iZXJBbmRTdWZmaXggPSBhcnJheS5qb2luKFwiXCIpICsgXCJzdFwiO1xuICB9IGVsc2UgaWYgKGxhc3ROdW1iZXJJbkFycmF5ID09PSBcIjJcIikge1xuICAgIG51bWJlckFuZFN1ZmZpeCA9IGFycmF5LmpvaW4oXCJcIikgKyBcIm5kXCI7XG4gIH0gZWxzZSBpZiAobGFzdE51bWJlckluQXJyYXkgPT09IFwiM1wiKSB7XG4gICAgbnVtYmVyQW5kU3VmZml4ID0gYXJyYXkuam9pbihcIlwiKSArIFwicmRcIjtcbiAgfSBlbHNlIHtcbiAgICBudW1iZXJBbmRTdWZmaXggPSBhcnJheS5qb2luKFwiXCIpICsgXCJ0aFwiO1xuICB9XG4gIHJldHVybiBudW1iZXJBbmRTdWZmaXg7XG59XG5cbi8vUmVuZGVycyBkYXRlIGhlYWRpbmdzIHRvIERvbVxuZnVuY3Rpb24gcmVuZGVyRGF0ZUhlYWRpbmdzRG9tKCkge1xuICBjb25zdCBkYXRlSGVhZGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRheSBoNVwiKTtcbiAgZGF0ZUhlYWRpbmdzLmZvckVhY2goKGhlYWRpbmcsIGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4IDw9IDApIHtcbiAgICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRvZGF5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSBmb3JtYXREYXRlSGVhZGluZ3MoaW5kZXgpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vVG9nZ2xlcyByZW5kZXIgYmV0d2VlbiBGYWhyZW5oZWl0IGFuZCBDZWxzaXVzIGluIERvbS5cbmZ1bmN0aW9uIHRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0RG9tKCkge1xuICB0b2dnbGVDZWxzaXVzRmFocmVuaGVpdFNlbGVjdGVkRG9tKCk7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2Vsc2l1cy1mYXItdG9nZ2xlXCIpO1xuICBjb25zdCB0ZW1wZXJhdHVyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRlbXAtbnVtYmVyXCIpO1xuICBjb25zdCBjdXJyZW50U2NhbGUgPSB0b2dnbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9nZ2xlLXVwXCIpXG4gICAgPyBcImNlbHNpdXNcIlxuICAgIDogXCJmYWhyZW5oZWl0XCI7XG4gIHRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKFwidG9nZ2xlLXVwXCIpO1xuICB0b2dnbGUuY2xhc3NMaXN0LnRvZ2dsZShcInRvZ2dsZS1kb3duXCIpO1xuXG4gIHRlbXBlcmF0dXJlcy5mb3JFYWNoKCh0ZW1wKSA9PiB7XG4gICAgbGV0IHRlbXBlcmF0dXJlV2l0aG91dERlZ3JlZVN5bWJvbCA9IHJlbW92ZURlZ3JlZVN5bWJvbCh0ZW1wLnRleHRDb250ZW50KTtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0gdG9nZ2xlVmFsdWVDZWxzaXVzRmFocmVuaGVpdChcbiAgICAgIHRlbXBlcmF0dXJlV2l0aG91dERlZ3JlZVN5bWJvbCxcbiAgICAgIGN1cnJlbnRTY2FsZVxuICAgICk7XG4gIH0pO1xufVxuXG4vL0NvbnZlcnRzIGJldHdlZW4gRmFocmVuaGVpdCBhbmQgQ2Vsc2l1c1xuZnVuY3Rpb24gdG9nZ2xlVmFsdWVDZWxzaXVzRmFocmVuaGVpdCh2YWx1ZSwgdHlwZSkge1xuICBjb25zdCBDRUxTSVVTX1RPX0ZBSFJFTkhFSVRfRkFDVE9SID0gOSAvIDU7XG4gIGNvbnN0IEZBSFJFTkhFSVRfVE9fQ0VMU0lVU19GQUNUT1IgPSA1IC8gOTtcbiAgY29uc3QgRkFIUkVOSEVJVF9GUkVFWklOR19QT0lOVCA9IDMyO1xuICBsZXQgdmFsdWVDb252ZXJ0ZWQ7XG5cbiAgaWYgKHR5cGUgPT09IFwiZmFocmVuaGVpdFwiKSB7XG4gICAgdmFsdWVDb252ZXJ0ZWQgPVxuICAgICAgKE51bWJlcih2YWx1ZSkgLSBGQUhSRU5IRUlUX0ZSRUVaSU5HX1BPSU5UKSAqXG4gICAgICBGQUhSRU5IRUlUX1RPX0NFTFNJVVNfRkFDVE9SO1xuICB9IGVsc2Uge1xuICAgIHZhbHVlQ29udmVydGVkID1cbiAgICAgIE51bWJlcih2YWx1ZSkgKiBDRUxTSVVTX1RPX0ZBSFJFTkhFSVRfRkFDVE9SICsgRkFIUkVOSEVJVF9GUkVFWklOR19QT0lOVDtcbiAgfVxuICByZXR1cm4gYWRkRGVncmVlU3ltYm9sKHZhbHVlQ29udmVydGVkLnRvRml4ZWQoMSkpO1xufVxuXG4vL0FkZHMgZGVncmVlIHN5bWJvbCB0byBzdHJpbmdcbmZ1bmN0aW9uIGFkZERlZ3JlZVN5bWJvbChzdHIpIHtcbiAgbGV0IHN0ckFycmF5ID0gc3RyLnNwbGl0KFwiXCIpO1xuICBzdHJBcnJheS5wdXNoKFwiwrBcIik7XG4gIGxldCBzdHJpbmdXaXRoRGVncmVlU3ltYm9sID0gc3RyQXJyYXkuam9pbihcIlwiKTtcbiAgcmV0dXJuIHN0cmluZ1dpdGhEZWdyZWVTeW1ib2w7XG59XG5cbi8vUmVtb3ZlcyBkZWdyZWUgc3ltYm9sIGZyb20gc3RyaW5nXG5mdW5jdGlvbiByZW1vdmVEZWdyZWVTeW1ib2woc3RyKSB7XG4gIGxldCBzdHJBcnJheSA9IHN0ci5zcGxpdChcIlwiKTtcbiAgc3RyQXJyYXkucG9wKCk7XG4gIGxldCBzdHJpbmdXaXRob3V0RGVncmVlU3ltYm9sID0gc3RyQXJyYXkuam9pbihcIlwiKTtcbiAgcmV0dXJuIHN0cmluZ1dpdGhvdXREZWdyZWVTeW1ib2w7XG59XG5cbi8vVG9nZ2xlcyBsb2FkaW5nIGljb25zIG9mZiBEb21cbmZ1bmN0aW9uIHRvZ2dsZUxvYWRpbmdJY29uc09mZkRvbSgpIHtcbiAgY29uc3QgbG9hZGVySWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvYWRlclwiKTtcbiAgY29uc3QgbG9jYXRpb25IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1oZWFkZXJcIik7XG4gIGxvY2F0aW9uSGVhZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGVyLXRleHRcIik7XG4gIGxvYWRlckljb25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LnJlbW92ZSgpO1xuICB9KTtcbn1cblxuLy9Ub2dnbGVzIGxvYWRpbmcgaWNvbnMgb24gRG9tXG5mdW5jdGlvbiB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpIHtcbiAgY29uc3Qgd2VhdGhlckljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWljb24sIC50ZW1wLW51bWJlclwiKTtcbiAgY29uc3QgbG9jYXRpb25IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1oZWFkZXJcIik7XG4gIGxvY2F0aW9uSGVhZGluZy5jbGFzc0xpc3QuYWRkKFwibG9hZGVyLXRleHRcIik7XG4gIHdlYXRoZXJJY29ucy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChcImxvYWRlclwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XG4gIH0pO1xufVxuXG4vL1JlbW92ZXMgYWxsIHdlYXRoZXIgZGF0YSBmcm9tIERvbVxuZnVuY3Rpb24gcmVtb3ZlV2VhdGhlckRhdGFEb20oKSB7XG4gIGNvbnN0IGVsZW1lbnRzVG9DbGVhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgXCIud2VhdGhlci1kZXNjcmlwdGlvbiBoNiwudGVtcGVyYXR1cmUgaDIsLmxvY2F0aW9uLWhlYWRlciwud2VhdGhlci1pY29uIGltZ1wiXG4gICk7XG4gIGVsZW1lbnRzVG9DbGVhci5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgZWxlbWVudC5zcmMgPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9XG4gIH0pO1xufVxuXG4vL1JlbmRlcnMgc2VsZWN0ZWQgc2NhbGUgdG8gYmUgaGlnaGxpZ2h0ZWQgaW4gRG9tXG5mdW5jdGlvbiB0b2dnbGVDZWxzaXVzRmFocmVuaGVpdFNlbGVjdGVkRG9tKCkge1xuICBjb25zdCBjZWxzaXVzU3ltYm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLXN5bWJvbFwiKTtcbiAgY29uc3QgZmFocmVuaGVpdFN5bWJvbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmFocmVuaGVpdC1zeW1ib2xcIik7XG4gIGNlbHNpdXNTeW1ib2wuY2xhc3NMaXN0LnRvZ2dsZShcInNjYWxlLXN5bWJvbC1zZWxlY3RlZFwiKTtcbiAgZmFocmVuaGVpdFN5bWJvbC5jbGFzc0xpc3QudG9nZ2xlKFwic2NhbGUtc3ltYm9sLXNlbGVjdGVkXCIpO1xufVxuXG4vL1JlbmRlcnMgYmFja2dyb3VuZCBzd2F0Y2ggcGF0dGVybiBEb21cbmZ1bmN0aW9uIHJlbmRlckJhY2tncm91bmRXZWF0aGVyU3dhdGNoKHVybCkge1xuICBjb25zdCB3ZWF0aGVyU3dhdGNoTGF5ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXJcIlxuICApO1xuICB3ZWF0aGVyU3dhdGNoTGF5ZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3VybH0pYDtcbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2ZvbnRzL01lcnJpd2VhdGhlclNhbnMudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6IFwiTWVycml3ZWF0aGVyXCI7XG4gIHNyYzogbG9jYWwoXCJNZXJyaXdlYXRoZXIgUmVndWxhclwiKSwgdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBmb250LXdlaWdodDogNDAwO1xufVxuXG46cm9vdCB7XG4gIC0tbWFpbi1wcm9qZWN0cy1jb2xvcjogcmdiKDIyOSwgMjQzLCAyNDYpO1xufVxuXG5odG1sLFxuYm9keSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogNDY1cHg7XG59XG5cbi5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGVuZDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxMDB2dztcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gIGFsaWduLXNlbGY6IGJhc2VsaW5lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XG59XG5cbi5mb290ZXItaW5mbyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcbn1cblxuLmhlYWRlciBoMSB7XG4gIHBhZGRpbmctbGVmdDogMzBweDtcbn1cblxuYm9keSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWluLXdpZHRoOiA1NTBweDtcbiAgbWluLWhlaWdodDogMzUwcHg7XG59XG5cbi5hcHAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogNDB2dztcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgKi9cbiAgbWluLXdpZHRoOiA1MDBweDtcbiAgYXNwZWN0LXJhdGlvOiAxNS85O1xuICBib3gtc2hhZG93OiByZ2JhKDUwLCA1MCwgOTMsIDAuMjUpIDBweCA1MHB4IDEwMHB4IC0yMHB4LFxuICAgIHJnYmEoMCwgMCwgMCwgMC4zKSAwcHggMzBweCA2MHB4IC0zMHB4LFxuICAgIHJnYmEoMTAsIDM3LCA2NCwgMC4zNSkgMHB4IC0ycHggNnB4IDBweCBpbnNldDtcbn1cblxuLmZvb3RlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDI1JTtcbiAgLyogYm9yZGVyOiAycHggc29saWQgcmdiKDE4NiwgMTg0LCAxODQpOyAqL1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMzMsIDM2LCAxMzMpO1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA1cHg7XG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA1cHg7XG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxODQsIDE4NCwgMTg2KTsgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDMzLCAzNiwgMTMzKTtcbn1cblxuLmFwcC1ib2R5IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogNzUlO1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7XG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDVweDtcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDVweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nLXRvcDogMzVweDtcbiAgcGFkZGluZy1ib3R0b206IDE1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcbn1cblxuLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJhY2tncm91bmQtc2l6ZTogYXV0bztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBvcGFjaXR5OiAwLjM7XG4gIHRvcDogMHB4O1xuICByaWdodDogMHB4O1xuICBib3R0b206IDBweDtcbiAgbGVmdDogMHB4O1xufVxuXG4uc2VhcmNoLWdvIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIHJnYig3LCA3LCA3KTsgKi9cbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBoZWlnaHQ6IDYwJTtcbiAgd2lkdGg6IDcwJTtcbiAgcGFkZGluZzogMCA1cHggMCA1cHg7XG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzEsIDEzMCwgMTMwKTsgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xufVxuXG5pbnB1dCB7XG4gIGhlaWdodDogNTAlO1xuICB3aWR0aDogNzUlO1xuICBwYWRkaW5nOiAwIDVweDtcbn1cblxuYnV0dG9uIHtcbiAgaGVpZ2h0OiA1NSU7XG4gIHdpZHRoOiAxNSU7XG59XG5cbi53ZWF0aGVyLWNvbnRhaW5lciB7XG4gIHotaW5kZXg6IDI7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XG4gIGdhcDogNXB4O1xuICB3aWR0aDogNzAlO1xuICBtaW4taGVpZ2h0OiAxOTJweDtcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDIwNSwgMjAzLCAyMDMpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcbn1cbi5sb2NhdGlvbi1oZWFkZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogLTUlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogNXB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA1LCAyMDMsIDIwMyk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgei1pbmRleDogMjtcbn1cblxuLmNlbHNpdXMtZmFyLXRvZ2dsZSB7XG4gIHotaW5kZXg6IDI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTQlO1xuICByaWdodDogMzRweDtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMzBweDtcbiAgYm9yZGVyOiBzb2xpZCByZ2IoMTMxLCAxMzAsIDEzMCkgMXB4O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIHBhZGRpbmc6IDJweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzMiwgMjI5LCAyMjkpO1xufVxuXG4udG9nZ2xlLWNpcmNsZSB7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgd2lkdGg6IDEycHg7XG4gIGhlaWdodDogMTJweDtcbiAgYm9yZGVyOiBzb2xpZCByZ2IoMTYzLCAxNjEsIDE2MSkgMXB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzEsIDEzMCwgMTMwKTtcbn1cblxuLnRvZGF5LFxuLnRvbW1vcm93LFxuLm92ZXJtb3Jyb3cge1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDJmciAxZnIgMWZyO1xufVxuXG4uZGF5LFxuLndlYXRoZXItZGVzY3JpcHRpb24ge1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZGF5OmFmdGVyLFxuLndlYXRoZXItZGVzY3JpcHRpb246YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kOiBibGFjaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiA1JTtcbiAgaGVpZ2h0OiAxcHg7XG4gIHdpZHRoOiA5MCU7XG59XG5cbi53ZWF0aGVyLWRlc2NyaXB0aW9uOmFmdGVyIHtcbiAgdG9wOiA1cHg7XG59XG5cbi5kYXk6YWZ0ZXIge1xuICBib3R0b206IDVweDtcbn1cblxuLndlYXRoZXItaWNvbixcbi50ZW1wZXJhdHVyZSB7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbn1cblxuLmRheSB7XG4gIG1pbi1oZWlnaHQ6IDE0cHg7XG59XG5cbi50b2dnbGUtdXAge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG5cbi50b2dnbGUtZG93biB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5mYWhyZW5oZWl0LXN5bWJvbCxcbi5jZWxzaXVzLXN5bWJvbCB7XG4gIHdpZHRoOiAyOHB4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY29sb3I6IHJnYigxNjMsIDE2MSwgMTYxKTtcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiAxcHggZ3JleSBzb2xpZDtcbiAgb3BhY2l0eTogMC43O1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5kaXNhYmxlLXBvaW50ZXIge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgY3Vyc29yOiBub25lO1xufVxuXG4uc2NhbGUtc3ltYm9sLXNlbGVjdGVkIHtcbiAgLyogYm9yZGVyOiAxcHggZ3JleSBzb2xpZDsgKi9cbiAgYm94LXNoYWRvdzogMHB4IDJweCBncmV5O1xuICBvcGFjaXR5OiAxO1xufVxuXG4uZmFocmVuaGVpdC1zeW1ib2wge1xuICBib3R0b206IC0yMHB4O1xuICBsZWZ0OiAxNXB4O1xufVxuXG4uY2Vsc2l1cy1zeW1ib2wge1xuICB0b3A6IC0xNXB4O1xuICBsZWZ0OiAxNXB4O1xufVxuXG4ubG9hZGVyIHtcbiAgd2lkdGg6IDMxcHg7XG4gIC0tZjogOHB4O1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgcGFkZGluZzogMXB4O1xuICBiYWNrZ3JvdW5kOiBjb25pYy1ncmFkaWVudCgjMDAwMCAxMCUsICMzMzZjZjApIGNvbnRlbnQtYm94O1xuICBtYXNrOiByZXBlYXRpbmctY29uaWMtZ3JhZGllbnQoIzAwMDAgMGRlZywgIzAwMCAxZGVnIDIwZGVnLCAjMDAwMCAyMWRlZyAzNmRlZyksXG4gICAgcmFkaWFsLWdyYWRpZW50KFxuICAgICAgZmFydGhlc3Qtc2lkZSxcbiAgICAgICMwMDAwIGNhbGMoMTAwJSAtIHZhcigtLWYpIC0gMXB4KSxcbiAgICAgICMwMDAgY2FsYygxMDAlIC0gdmFyKC0tZikpXG4gICAgKTtcbiAgbWFzay1jb21wb3NpdGU6IGRlc3RpbmF0aW9uLWluO1xuICBtYXNrLWNvbXBvc2l0ZTogaW50ZXJzZWN0O1xuICBhbmltYXRpb246IGw0IDFzIGluZmluaXRlIHN0ZXBzKDEwKTtcbn1cblxuQGtleWZyYW1lcyBsNCB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxdHVybik7XG4gIH1cbn1cblxuLmxvYWRlci10ZXh0IHtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1mYW1pbHk6IE1lcnJpd2VhdGhlciwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBhbmltYXRpb246IGwxIDFzIGxpbmVhciBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG4ubG9hZGVyLXRleHQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJMb2FkaW5nLi4uXCI7XG59XG5cbkBrZXlmcmFtZXMgbDEge1xuICB0byB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuXG5idXR0b24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbmE6bGluayB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cblxuYSB7XG4gIGNvbG9yOiAjMDAwO1xufVxuXG4vKiB0YXJnZXQgdGhlIGVsZW1lbnQgeW91IHdhbnQgdGhlIGFuaW1hdGlvbiBvbiAqL1xuLmhlYWRlciBkaXYge1xuICAvKiBhZGQgdGhlc2Ugc3R5bGVzIHRvIG1ha2UgdGhlIHRleHQgbW92ZSBzbW9vdGhseSAqL1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGFuaW1hdGlvbjogc2xpZGUtbGVmdCAycyBlYXNlIGZvcndhcmRzO1xufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlLWxlZnQge1xuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTg1dncpO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNjAwcHgpIHtcbiAgLmhlYWRlciBkaXYge1xuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0xNjAwIDJzIGVhc2UgZm9yd2FyZHM7XG4gIH1cblxuICAuaGVhZGVyIGRpdiBoMSB7XG4gICAgZm9udC1zaXplOiAxLjVlbTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0xNjAwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODB2dyk7XG4gICAgfVxuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3ODBweCkge1xuICAuaGVhZGVyIGRpdiB7XG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTc4MCAycyBlYXNlIGZvcndhcmRzO1xuICB9XG5cbiAgLmhlYWRlciBkaXYgaDEge1xuICAgIGZvbnQtc2l6ZTogMS41ZW07XG4gIH1cblxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtNzgwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNzB2dyk7XG4gICAgfVxuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzMDBweCkge1xuICAuaGVhZGVyIGRpdiB7XG4gICAgZm9udC1zaXplOiAxLjJlbTtcbiAgICBhbmltYXRpb246IHNsaWRlLWxlZnQtMzAwIDJzIGVhc2UgZm9yd2FyZHM7XG4gIH1cbiAgLmhlYWRlciBkaXYgaDEge1xuICAgIGZvbnQtc2l6ZTogMS4yZW07XG4gIH1cblxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtMzAwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNXZ3KTtcbiAgICB9XG4gIH1cbn1cblxuLmhlYWRlciBkaXYge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uc3VuLWxvZ28ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiA2NHB4O1xuICBoZWlnaHQ6IDY0cHg7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtFQUN0Qix5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSwyQkFBMkI7RUFDM0IsMkVBQXVFO0VBQ3ZFLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFlBQVk7RUFDWix1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLG9DQUFvQztBQUN0Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFlBQVk7RUFDWix1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLG9DQUFvQztBQUN0Qzs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHVCQUF1QjtFQUN2QixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLDZCQUE2QjtFQUM3QixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCOztpREFFK0M7QUFDakQ7O0FBRUE7RUFD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RUFDOUIseUJBQXlCO0VBQ3pCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFO0lBQ0Usd0JBQXdCO0VBQzFCO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIscUNBQXFDO0VBQ3JDLGVBQWU7RUFDZiwwQ0FBMEM7QUFDNUM7QUFDQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaO0FBQ0Y7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBLGlEQUFpRDtBQUNqRDtFQUNFLG9EQUFvRDtFQUNwRCxxQkFBcUI7RUFDckIsc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0U7SUFDRSw0QkFBNEI7RUFDOUI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsMkNBQTJDO0VBQzdDOztFQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0U7TUFDRSw0QkFBNEI7SUFDOUI7RUFDRjtBQUNGOztBQUVBO0VBQ0U7SUFDRSwwQ0FBMEM7RUFDNUM7O0VBRUE7SUFDRSxnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRTtNQUNFLDRCQUE0QjtJQUM5QjtFQUNGO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLGdCQUFnQjtJQUNoQiwwQ0FBMEM7RUFDNUM7RUFDQTtJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFO01BQ0UsMkJBQTJCO0lBQzdCO0VBQ0Y7QUFDRjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGZvbnQtZmFtaWx5OiBNZXJyaXdlYXRoZXI7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNZXJyaXdlYXRoZXJcXFwiO1xcbiAgc3JjOiBsb2NhbChcXFwiTWVycml3ZWF0aGVyIFJlZ3VsYXJcXFwiKSwgdXJsKFxcXCIuL2ZvbnRzL01lcnJpd2VhdGhlclNhbnMudHRmXFxcIik7XFxuICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG46cm9vdCB7XFxuICAtLW1haW4tcHJvamVjdHMtY29sb3I6IHJnYigyMjksIDI0MywgMjQ2KTtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWluLWhlaWdodDogNDY1cHg7XFxufVxcblxcbi5oZWFkZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogZW5kO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYWxpZ24tc2VsZjogYmFzZWxpbmU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XFxufVxcblxcbi5mb290ZXItaW5mbyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XFxufVxcblxcbi5oZWFkZXIgaDEge1xcbiAgcGFkZGluZy1sZWZ0OiAzMHB4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1pbi13aWR0aDogNTUwcHg7XFxuICBtaW4taGVpZ2h0OiAzNTBweDtcXG59XFxuXFxuLmFwcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHdpZHRoOiA0MHZ3O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgYmxhY2s7ICovXFxuICBtaW4td2lkdGg6IDUwMHB4O1xcbiAgYXNwZWN0LXJhdGlvOiAxNS85O1xcbiAgYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDkzLCAwLjI1KSAwcHggNTBweCAxMDBweCAtMjBweCxcXG4gICAgcmdiYSgwLCAwLCAwLCAwLjMpIDBweCAzMHB4IDYwcHggLTMwcHgsXFxuICAgIHJnYmEoMTAsIDM3LCA2NCwgMC4zNSkgMHB4IC0ycHggNnB4IDBweCBpbnNldDtcXG59XFxuXFxuLmZvb3RlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgaGVpZ2h0OiAyNSU7XFxuICAvKiBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7ICovXFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMzMsIDM2LCAxMzMpO1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4O1xcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDVweDtcXG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxODQsIDE4NCwgMTg2KTsgKi9cXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigzMywgMzYsIDEzMyk7XFxufVxcblxcbi5hcHAtYm9keSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgaGVpZ2h0OiA3NSU7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1cHg7XFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZy10b3A6IDM1cHg7XFxuICBwYWRkaW5nLWJvdHRvbTogMTVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcXG59XFxuXFxuLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYmFja2dyb3VuZC1zaXplOiBhdXRvO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMC4zO1xcbiAgdG9wOiAwcHg7XFxuICByaWdodDogMHB4O1xcbiAgYm90dG9tOiAwcHg7XFxuICBsZWZ0OiAwcHg7XFxufVxcblxcbi5zZWFyY2gtZ28ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIHJnYig3LCA3LCA3KTsgKi9cXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGhlaWdodDogNjAlO1xcbiAgd2lkdGg6IDcwJTtcXG4gIHBhZGRpbmc6IDAgNXB4IDAgNXB4O1xcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzMSwgMTMwLCAxMzApOyAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xcbn1cXG5cXG5pbnB1dCB7XFxuICBoZWlnaHQ6IDUwJTtcXG4gIHdpZHRoOiA3NSU7XFxuICBwYWRkaW5nOiAwIDVweDtcXG59XFxuXFxuYnV0dG9uIHtcXG4gIGhlaWdodDogNTUlO1xcbiAgd2lkdGg6IDE1JTtcXG59XFxuXFxuLndlYXRoZXItY29udGFpbmVyIHtcXG4gIHotaW5kZXg6IDI7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogNXB4O1xcbiAgd2lkdGg6IDcwJTtcXG4gIG1pbi1oZWlnaHQ6IDE5MnB4O1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDIwNSwgMjAzLCAyMDMpO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xcbn1cXG4ubG9jYXRpb24taGVhZGVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogLTUlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA1LCAyMDMsIDIwMyk7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uY2Vsc2l1cy1mYXItdG9nZ2xlIHtcXG4gIHotaW5kZXg6IDI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMTQlO1xcbiAgcmlnaHQ6IDM0cHg7XFxuICB3aWR0aDogMTZweDtcXG4gIGhlaWdodDogMzBweDtcXG4gIGJvcmRlcjogc29saWQgcmdiKDEzMSwgMTMwLCAxMzApIDFweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIHBhZGRpbmc6IDJweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMzIsIDIyOSwgMjI5KTtcXG59XFxuXFxuLnRvZ2dsZS1jaXJjbGUge1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgd2lkdGg6IDEycHg7XFxuICBoZWlnaHQ6IDEycHg7XFxuICBib3JkZXI6IHNvbGlkIHJnYigxNjMsIDE2MSwgMTYxKSAxcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTMxLCAxMzAsIDEzMCk7XFxufVxcblxcbi50b2RheSxcXG4udG9tbW9yb3csXFxuLm92ZXJtb3Jyb3cge1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgZ3JleTsgKi9cXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAyZnIgMWZyIDFmcjtcXG59XFxuXFxuLmRheSxcXG4ud2VhdGhlci1kZXNjcmlwdGlvbiB7XFxuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmRheTphZnRlcixcXG4ud2VhdGhlci1kZXNjcmlwdGlvbjphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGJhY2tncm91bmQ6IGJsYWNrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogNSU7XFxuICBoZWlnaHQ6IDFweDtcXG4gIHdpZHRoOiA5MCU7XFxufVxcblxcbi53ZWF0aGVyLWRlc2NyaXB0aW9uOmFmdGVyIHtcXG4gIHRvcDogNXB4O1xcbn1cXG5cXG4uZGF5OmFmdGVyIHtcXG4gIGJvdHRvbTogNXB4O1xcbn1cXG5cXG4ud2VhdGhlci1pY29uLFxcbi50ZW1wZXJhdHVyZSB7XFxuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5kYXkge1xcbiAgbWluLWhlaWdodDogMTRweDtcXG59XFxuXFxuLnRvZ2dsZS11cCB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi50b2dnbGUtZG93biB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbn1cXG5cXG4uZmFocmVuaGVpdC1zeW1ib2wsXFxuLmNlbHNpdXMtc3ltYm9sIHtcXG4gIHdpZHRoOiAyOHB4O1xcbiAgaGVpZ2h0OiAyMHB4O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgY29sb3I6IHJnYigxNjMsIDE2MSwgMTYxKTtcXG4gIGJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMXB4IGdyZXkgc29saWQ7XFxuICBvcGFjaXR5OiAwLjc7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5kaXNhYmxlLXBvaW50ZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBjdXJzb3I6IG5vbmU7XFxufVxcblxcbi5zY2FsZS1zeW1ib2wtc2VsZWN0ZWQge1xcbiAgLyogYm9yZGVyOiAxcHggZ3JleSBzb2xpZDsgKi9cXG4gIGJveC1zaGFkb3c6IDBweCAycHggZ3JleTtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbi5mYWhyZW5oZWl0LXN5bWJvbCB7XFxuICBib3R0b206IC0yMHB4O1xcbiAgbGVmdDogMTVweDtcXG59XFxuXFxuLmNlbHNpdXMtc3ltYm9sIHtcXG4gIHRvcDogLTE1cHg7XFxuICBsZWZ0OiAxNXB4O1xcbn1cXG5cXG4ubG9hZGVyIHtcXG4gIHdpZHRoOiAzMXB4O1xcbiAgLS1mOiA4cHg7XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBwYWRkaW5nOiAxcHg7XFxuICBiYWNrZ3JvdW5kOiBjb25pYy1ncmFkaWVudCgjMDAwMCAxMCUsICMzMzZjZjApIGNvbnRlbnQtYm94O1xcbiAgbWFzazogcmVwZWF0aW5nLWNvbmljLWdyYWRpZW50KCMwMDAwIDBkZWcsICMwMDAgMWRlZyAyMGRlZywgIzAwMDAgMjFkZWcgMzZkZWcpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoXFxuICAgICAgZmFydGhlc3Qtc2lkZSxcXG4gICAgICAjMDAwMCBjYWxjKDEwMCUgLSB2YXIoLS1mKSAtIDFweCksXFxuICAgICAgIzAwMCBjYWxjKDEwMCUgLSB2YXIoLS1mKSlcXG4gICAgKTtcXG4gIG1hc2stY29tcG9zaXRlOiBkZXN0aW5hdGlvbi1pbjtcXG4gIG1hc2stY29tcG9zaXRlOiBpbnRlcnNlY3Q7XFxuICBhbmltYXRpb246IGw0IDFzIGluZmluaXRlIHN0ZXBzKDEwKTtcXG59XFxuXFxuQGtleWZyYW1lcyBsNCB7XFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDF0dXJuKTtcXG4gIH1cXG59XFxuXFxuLmxvYWRlci10ZXh0IHtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgYW5pbWF0aW9uOiBsMSAxcyBsaW5lYXIgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG4ubG9hZGVyLXRleHQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJMb2FkaW5nLi4uXFxcIjtcXG59XFxuXFxuQGtleWZyYW1lcyBsMSB7XFxuICB0byB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxufVxcblxcbmJ1dHRvbiB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbmE6bGluayB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbmEge1xcbiAgY29sb3I6ICMwMDA7XFxufVxcblxcbi8qIHRhcmdldCB0aGUgZWxlbWVudCB5b3Ugd2FudCB0aGUgYW5pbWF0aW9uIG9uICovXFxuLmhlYWRlciBkaXYge1xcbiAgLyogYWRkIHRoZXNlIHN0eWxlcyB0byBtYWtlIHRoZSB0ZXh0IG1vdmUgc21vb3RobHkgKi9cXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGFuaW1hdGlvbjogc2xpZGUtbGVmdCAycyBlYXNlIGZvcndhcmRzO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNsaWRlLWxlZnQge1xcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODV2dyk7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAxNjAwcHgpIHtcXG4gIC5oZWFkZXIgZGl2IHtcXG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTE2MDAgMnMgZWFzZSBmb3J3YXJkcztcXG4gIH1cXG5cXG4gIC5oZWFkZXIgZGl2IGgxIHtcXG4gICAgZm9udC1zaXplOiAxLjVlbTtcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0xNjAwIHtcXG4gICAgMTAwJSB7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC04MHZ3KTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNzgwcHgpIHtcXG4gIC5oZWFkZXIgZGl2IHtcXG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTc4MCAycyBlYXNlIGZvcndhcmRzO1xcbiAgfVxcblxcbiAgLmhlYWRlciBkaXYgaDEge1xcbiAgICBmb250LXNpemU6IDEuNWVtO1xcbiAgfVxcblxcbiAgQGtleWZyYW1lcyBzbGlkZS1sZWZ0LTc4MCB7XFxuICAgIDEwMCUge1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNzB2dyk7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDMwMHB4KSB7XFxuICAuaGVhZGVyIGRpdiB7XFxuICAgIGZvbnQtc2l6ZTogMS4yZW07XFxuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0zMDAgMnMgZWFzZSBmb3J3YXJkcztcXG4gIH1cXG4gIC5oZWFkZXIgZGl2IGgxIHtcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0zMDAge1xcbiAgICAxMDAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTV2dyk7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuLmhlYWRlciBkaXYge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4uc3VuLWxvZ28ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDY0cHg7XFxuICBoZWlnaHQ6IDY0cHg7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcbm9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyJdLCJuYW1lcyI6WyJpbml0IiwiZ29CdXR0b24iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ0b2dnbGVCdXR0b24iLCJ1c2VySW5wdXQiLCJjZWxzaXVzRmFocmVuaGVpdEJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0RG9tIiwiZGlzYWJsZUNlbGNpdXNGYWhyZW5oZWl0QnV0dG9uUG9pbnRlciIsImhhbmRsZUdvQnV0dG9uIiwiZm9yRWFjaCIsImJ0biIsImV2ZW50Iiwia2V5IiwiY2Vsc2l1c0J1dHRvbiIsImZhaHJlbmhlaXRCdXR0b24iLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJsb2NhdGlvbiIsInZhbHVlIiwidHJpbSIsImFsZXJ0IiwiZmV0Y2hXZWF0aGVyRm9yZWNhc3QiLCJ0aGVuIiwicmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tIiwiZ2V0Q3VycmVudGxvY2F0aW9uIiwiY29vcmRzIiwiZ2V0Q3VycmVudENpdHkiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsInRvZ2dsZUxvYWRpbmdJY29uc09uRG9tIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInJlc3BvbnNlIiwibGF0IiwibGF0aXR1ZGUiLCJsbmciLCJsb25naXR1ZGUiLCJmZXRjaCIsImpzb24iLCJvYmoiLCJjaXR5IiwiRXJyb3IiLCJBUElfS0VZIiwidXJsIiwib2siLCJzdGF0dXMiLCJ3ZWF0aGVyT2JqIiwibG9hZGluZ0ltYWdlRXhpc3RzIiwicmVtb3ZlV2VhdGhlckRhdGFEb20iLCJ0b2dnbGVMb2FkaW5nSWNvbnNPZmZEb20iLCJ0b2dnbGVQb3NpdGlvbiIsInRlbXBTY2FsZSIsImNvbnRhaW5zIiwibmFtZSIsImNvdW50cnkiLCJmb3JlY2FzdCIsImZvcmVjYXN0ZGF5IiwidG9kYXlzV2VhdGhlckljb24iLCJkYXkiLCJjb25kaXRpb24iLCJpY29uIiwiaW5kZXgiLCJhdmVyYWdlVGVtcCIsIndlYXRoZXJJY29uIiwiZGVzY3JpcHRpb24iLCJ0ZXh0IiwiZGF5SW5kZXgiLCJyZW5kZXJEYXlET00iLCJyZW5kZXJMb2NhdGlvbkhlYWRpbmdEb20iLCJyZW5kZXJEYXRlSGVhZGluZ3NEb20iLCJyZW5kZXJCYWNrZ3JvdW5kV2VhdGhlclN3YXRjaCIsInRlbXBlcmF0dXJlIiwiY2hpbGRyZW4iLCJ0ZXh0Q29udGVudCIsInNyYyIsImxvY2F0aW9uSGVhZGluZyIsImZvcm1hdERhdGVIZWFkaW5ncyIsImhvd01hbnlEYXlzSW5Ub1RoZUZ1dHVyZSIsImRheXNPZldlZWsiLCJEYXRlIiwic2V0RGF0ZSIsImdldERhdGUiLCJkYXlOYW1lIiwiZ2V0RGF5IiwiZGF0ZSIsImFkZE9yZGluYWxOdW1lclN1ZmZpeCIsIm51bWJlciIsImFycmF5IiwiU3RyaW5nIiwic3BsaXQiLCJudW1iZXJBbmRTdWZmaXgiLCJsYXN0TnVtYmVySW5BcnJheSIsImxlbmd0aCIsImpvaW4iLCJkYXRlSGVhZGluZ3MiLCJoZWFkaW5nIiwidG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXRTZWxlY3RlZERvbSIsInRlbXBlcmF0dXJlcyIsImN1cnJlbnRTY2FsZSIsInRlbXAiLCJ0ZW1wZXJhdHVyZVdpdGhvdXREZWdyZWVTeW1ib2wiLCJyZW1vdmVEZWdyZWVTeW1ib2wiLCJ0b2dnbGVWYWx1ZUNlbHNpdXNGYWhyZW5oZWl0IiwidHlwZSIsIkNFTFNJVVNfVE9fRkFIUkVOSEVJVF9GQUNUT1IiLCJGQUhSRU5IRUlUX1RPX0NFTFNJVVNfRkFDVE9SIiwiRkFIUkVOSEVJVF9GUkVFWklOR19QT0lOVCIsInZhbHVlQ29udmVydGVkIiwiTnVtYmVyIiwiYWRkRGVncmVlU3ltYm9sIiwidG9GaXhlZCIsInN0ciIsInN0ckFycmF5IiwicHVzaCIsInN0cmluZ1dpdGhEZWdyZWVTeW1ib2wiLCJwb3AiLCJzdHJpbmdXaXRob3V0RGVncmVlU3ltYm9sIiwibG9hZGVySWNvbnMiLCJyZW1vdmUiLCJlbGVtZW50Iiwid2VhdGhlckljb25zIiwiYWRkIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZWxlbWVudHNUb0NsZWFyIiwidGFnTmFtZSIsImNlbHNpdXNTeW1ib2wiLCJmYWhyZW5oZWl0U3ltYm9sIiwid2VhdGhlclN3YXRjaExheWVyIiwic3R5bGUiLCJiYWNrZ3JvdW5kSW1hZ2UiXSwic291cmNlUm9vdCI6IiJ9