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
  z-index: 1;
  position: absolute;
  width: 64px;
  top: 10px;
  right: -35px;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Merriweather;\n}\n\n@font-face {\n  font-family: \"Merriweather\";\n  src: local(\"Merriweather Regular\"), url(\"./fonts/MerriweatherSans.ttf\");\n  font-weight: 400;\n}\n\n:root {\n  --main-projects-color: rgb(229, 243, 246);\n}\n\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  min-height: 465px;\n}\n\n.header {\n  display: flex;\n  justify-content: end;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: baseline;\n  background-color: rgb(197, 227, 232);\n}\n\n.footer-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: flex-end;\n  background-color: rgb(197, 227, 232);\n}\n\n.header h1 {\n  padding-left: 30px;\n}\n\nbody {\n  border: 1px solid black;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 550px;\n  min-height: 350px;\n}\n\n.app {\n  display: flex;\n  flex-direction: column;\n  width: 40vw;\n  border-radius: 5px;\n  /* border: 1px solid black; */\n  min-width: 500px;\n  aspect-ratio: 15/9;\n  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,\n    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,\n    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;\n}\n\n.footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 25%;\n  /* border: 2px solid rgb(186, 184, 184); */\n  border: 2px solid rgb(33, 36, 133);\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n  /* background-color: rgb(184, 184, 186); */\n  background-color: rgb(33, 36, 133);\n}\n\n.app-body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 75%;\n  border: 2px solid rgb(186, 184, 184);\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  position: relative;\n  padding-top: 35px;\n  padding-bottom: 15px;\n  background-color: rgb(197, 227, 232);\n}\n\n.weather-swatch-opacity-layer {\n  position: absolute;\n  background-size: auto;\n  position: absolute;\n  opacity: 0.3;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n.search-go {\n  display: flex;\n  justify-content: space-evenly;\n  align-items: center;\n  /* border: 1px solid rgb(7, 7, 7); */\n  border-radius: 5px;\n  height: 60%;\n  width: 70%;\n  padding: 0 5px 0 5px;\n  /* background-color: rgb(131, 130, 130); */\n  background-color: rgb(197, 227, 232);\n}\n\ninput {\n  height: 50%;\n  width: 75%;\n  padding: 0 5px;\n}\n\nbutton {\n  height: 55%;\n  width: 15%;\n}\n\n.weather-container {\n  z-index: 2;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 5px;\n  width: 70%;\n  min-height: 192px;\n  border: 2px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  background-color: rgb(255, 255, 255);\n}\n.location-header {\n  position: absolute;\n  top: -5%;\n  background-color: white;\n  padding: 5px;\n  border: 1px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  z-index: 2;\n}\n\n.celsius-far-toggle {\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 14%;\n  right: 34px;\n  width: 16px;\n  height: 30px;\n  border: solid rgb(131, 130, 130) 1px;\n  border-radius: 8px;\n  padding: 2px;\n  background-color: rgb(232, 229, 229);\n}\n\n.toggle-circle {\n  border-radius: 6px;\n  width: 12px;\n  height: 12px;\n  border: solid rgb(163, 161, 161) 1px;\n  cursor: pointer;\n  background-color: rgb(131, 130, 130);\n}\n\n.today,\n.tommorow,\n.overmorrow {\n  /* border: 1px solid grey; */\n  border-radius: 5px;\n  display: grid;\n  grid-template-rows: 1fr 2fr 1fr 1fr;\n}\n\n.day,\n.weather-description {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n}\n\n.day:after,\n.weather-description:after {\n  content: \"\";\n  background: black;\n  position: absolute;\n  left: 5%;\n  height: 1px;\n  width: 90%;\n}\n\n.weather-description:after {\n  top: 5px;\n}\n\n.day:after {\n  bottom: 5px;\n}\n\n.weather-icon,\n.temperature {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n}\n\n.day {\n  min-height: 14px;\n}\n\n.toggle-up {\n  justify-content: flex-start;\n}\n\n.toggle-down {\n  justify-content: flex-end;\n}\n\n.fahrenheit-symbol,\n.celsius-symbol {\n  width: 28px;\n  height: 20px;\n  position: absolute;\n  color: rgb(163, 161, 161);\n  border-radius: 15px;\n  text-align: center;\n  background-color: white;\n  border: 1px grey solid;\n  opacity: 0.7;\n  cursor: pointer;\n}\n\n.disable-pointer {\n  pointer-events: none;\n  cursor: none;\n}\n\n.scale-symbol-selected {\n  /* border: 1px grey solid; */\n  box-shadow: 0px 2px grey;\n  opacity: 1;\n}\n\n.fahrenheit-symbol {\n  bottom: -20px;\n  left: 15px;\n}\n\n.celsius-symbol {\n  top: -15px;\n  left: 15px;\n}\n\n.loader {\n  width: 31px;\n  --f: 8px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  padding: 1px;\n  background: conic-gradient(#0000 10%, #336cf0) content-box;\n  mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),\n    radial-gradient(\n      farthest-side,\n      #0000 calc(100% - var(--f) - 1px),\n      #000 calc(100% - var(--f))\n    );\n  mask-composite: destination-in;\n  mask-composite: intersect;\n  animation: l4 1s infinite steps(10);\n}\n\n@keyframes l4 {\n  to {\n    transform: rotate(1turn);\n  }\n}\n\n.loader-text {\n  font-weight: normal;\n  font-family: Merriweather, sans-serif;\n  font-size: 16px;\n  animation: l1 1s linear infinite alternate;\n}\n.loader-text:before {\n  content: \"Loading...\";\n}\n\n@keyframes l1 {\n  to {\n    opacity: 0;\n  }\n}\n\nbutton {\n  cursor: pointer;\n}\n\na:link {\n  text-decoration: none;\n}\n\na {\n  color: #000;\n}\n\n/* target the element you want the animation on */\n.header div {\n  /* add these styles to make the text move smoothly */\n  display: inline-block;\n  animation: slide-left 2s ease forwards;\n}\n\n@keyframes slide-left {\n  100% {\n    transform: translateX(-85vw);\n  }\n}\n\n@media (max-width: 1600px) {\n  .header div {\n    animation: slide-left-1600 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-1600 {\n    100% {\n      transform: translateX(-80vw);\n    }\n  }\n}\n\n@media (max-width: 780px) {\n  .header div {\n    animation: slide-left-780 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-780 {\n    100% {\n      transform: translateX(-70vw);\n    }\n  }\n}\n\n@media (max-width: 300px) {\n  .header div {\n    font-size: 1.2em;\n    animation: slide-left-300 2s ease forwards;\n  }\n  .header div h1 {\n    font-size: 1.2em;\n  }\n\n  @keyframes slide-left-300 {\n    100% {\n      transform: translateX(-5vw);\n    }\n  }\n}\n\n.header div {\n  position: relative;\n}\n.sun-logo {\n  z-index: 1;\n  position: absolute;\n  width: 64px;\n  top: 10px;\n  right: -35px;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnRkFBZ0YsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLE9BQU8sT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxPQUFPLE9BQU8sWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLE1BQU0sWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksV0FBVyxZQUFZLFVBQVUsS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sWUFBWSxNQUFNLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLE1BQU0sS0FBSyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE1BQU0sS0FBSyxZ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LEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uYW1lLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL25hbWUvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmluaXQoKTtcblxuLy8gVXNlciBCdXR0b25zXG5jb25zdCBnb0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XG5jb25zdCB0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZ2dsZS1jaXJjbGVcIik7XG5jb25zdCB1c2VySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG5jb25zdCBjZWxzaXVzRmFocmVuaGVpdEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICBcIi5mYWhyZW5oZWl0LXN5bWJvbCwuY2Vsc2l1cy1zeW1ib2xcIlxuKTtcblxuLy9CdXR0b24gZXZlbnQgbGlzdGVuZXJzXG50b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgZGlzYWJsZUNlbGNpdXNGYWhyZW5oZWl0QnV0dG9uUG9pbnRlcigpO1xufSk7XG5cbmdvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVHb0J1dHRvbik7XG5cbmNlbHNpdXNGYWhyZW5oZWl0QnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgICBkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyKCk7XG4gIH0pO1xufSk7XG5cbi8vQWxsb3dzIFVzZXIgdG8gaGl0IHJldHVybiB0byBzdWJtaXQgc2VhcmNoXG51c2VySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICBoYW5kbGVHb0J1dHRvbigpO1xuICB9XG59KTtcblxuLy9TdG9wcyB1c2VyIGNsaWNraW5nIGJ1dHRvbiB0aGF0IGlzIGFscmVhZHkgY3VycmVudGx5IHNlbGVjdGVkXG5mdW5jdGlvbiBkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyKCkge1xuICBjb25zdCBjZWxzaXVzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLXN5bWJvbFwiKTtcbiAgY29uc3QgZmFocmVuaGVpdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmFocmVuaGVpdC1zeW1ib2xcIik7XG4gIGNlbHNpdXNCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGUtcG9pbnRlclwiKTtcbiAgZmFocmVuaGVpdEJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZGlzYWJsZS1wb2ludGVyXCIpO1xufVxuXG4vL0hhbmRsZXMgdXNlciBsb2NhdGlvbiBzZWFyY2hcbmZ1bmN0aW9uIGhhbmRsZUdvQnV0dG9uKCkge1xuICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG4gIGlmIChsb2NhdGlvbi52YWx1ZS50cmltKCkgPT09IFwiXCIpIHtcbiAgICBhbGVydChcIlBsZWFzZSBlbnRlciBsb2NhdGlvblwiKTtcbiAgfSBlbHNlIHtcbiAgICBmZXRjaFdlYXRoZXJGb3JlY2FzdChsb2NhdGlvbi52YWx1ZSkudGhlbihyZW5kZXJXZWF0aGVyRm9yZWNhc3REb20pO1xuICAgIGxvY2F0aW9uLnZhbHVlID0gXCJcIjtcbiAgfVxufVxuXG4vL09uIHN0YXJ0IHVwXG5mdW5jdGlvbiBpbml0KCkge1xuICBnZXRDdXJyZW50bG9jYXRpb24oKVxuICAgIC50aGVuKChjb29yZHMpID0+IGdldEN1cnJlbnRDaXR5KC4uLmNvb3JkcykpXG4gICAgLnRoZW4oZmV0Y2hXZWF0aGVyRm9yZWNhc3QpXG4gICAgLnRoZW4ocmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tKVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSB3YXMgYW4gZXJyb3IgaW5pdGlhbGlzaW5nXCIsIGVycm9yKTtcbiAgICAgIGZldGNoV2VhdGhlckZvcmVjYXN0KFwiTG9uZG9uXCIpLnRoZW4ocmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tKTtcbiAgICB9KTtcbn1cblxuLy9Bc3luYyBmdW5jdGlvbiB0aGF0IHVzZXMgYnJvd3NlciBnZW9sb2NhdGlvbiB0byBhY2Nlc3MgbGF0LGxuZ1xuZnVuY3Rpb24gZ2V0Q3VycmVudGxvY2F0aW9uKCkge1xuICB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbnN0IGxhdCA9IHJlc3BvbnNlLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgIGNvbnN0IGxuZyA9IHJlc3BvbnNlLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICByZXR1cm4gW2xhdCwgbG5nXTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0pO1xufVxuXG4vL0FzeW5jIGZ1bmN0aW9uIHRoYXRzIHVzZXMgQVBJIHRvIHJldmVyc2UgbG9va3VwIGNpdHkgZnJvbSBsYXQsbG5nXG5mdW5jdGlvbiBnZXRDdXJyZW50Q2l0eShsYXQsIGxuZykge1xuICByZXR1cm4gZmV0Y2goYGh0dHBzOi8vZ2VvY29kZS54eXovJHtsYXR9LCR7bG5nfT9nZW9pdD1qc29uYClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmNpdHkgPT09IFwiVGhyb3R0bGVkISBTZWUgZ2VvY29kZS54eXovcHJpY2luZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlb2NvZGUgbG9vayB1cCB0aHJvdHRsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqLmNpdHk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY2F1Z2h0IHdoZW4gZmV0Y2hpbmcgY29vcmRzXCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBcIkxvbmRvblwiO1xuICAgIH0pO1xufVxuXG4vL0FzeW5jIGZ1bmN0aW9uIHRoYXRzIHVzZXMgQVBJIHRvIGxvb2t1cCB3ZWF0aGVyIG9iamVjdCBmb3IgY2l0eVxuZnVuY3Rpb24gZmV0Y2hXZWF0aGVyRm9yZWNhc3QobG9jYXRpb24pIHtcbiAgY29uc3QgQVBJX0tFWSA9IFwiMDFlMTY5NTVhNzUxNDI4YWE0MDE0MTcxNTI0MTkwNlwiO1xuICBjb25zdCB1cmwgPSBgaHR0cDovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP3E9JHtsb2NhdGlvbn0ma2V5PSR7QVBJX0tFWX0mZGF5cz0zYDtcbiAgcmV0dXJuIGZldGNoKHVybClcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKCh3ZWF0aGVyT2JqKSA9PiB7XG4gICAgICByZXR1cm4gd2VhdGhlck9iajtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIEhUVFBgLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9KTtcbn1cblxuLy9SZW5kZXJzIHdlYXRoZXIgZGF0YSB0byBEb21cbmZ1bmN0aW9uIHJlbmRlcldlYXRoZXJGb3JlY2FzdERvbSh3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IGxvYWRpbmdJbWFnZUV4aXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGVyLXRleHRcIikgIT09IG51bGw7XG4gIGlmICghbG9hZGluZ0ltYWdlRXhpc3RzKSB7XG4gICAgcmVtb3ZlV2VhdGhlckRhdGFEb20oKTtcbiAgICB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpO1xuICB9XG4gIHRvZ2dsZUxvYWRpbmdJY29uc09mZkRvbSgpO1xuICBjb25zdCB0b2dnbGVQb3NpdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2Vsc2l1cy1mYXItdG9nZ2xlXCIpO1xuICBjb25zdCB0ZW1wU2NhbGUgPSB0b2dnbGVQb3NpdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b2dnbGUtdXBcIikgPyBcImNcIiA6IFwiZlwiO1xuICBjb25zdCBjaXR5ID0gd2VhdGhlck9iai5sb2NhdGlvbi5uYW1lO1xuICBjb25zdCBjb3VudHJ5ID0gd2VhdGhlck9iai5sb2NhdGlvbi5jb3VudHJ5O1xuICBjb25zdCBmb3JlY2FzdCA9IHdlYXRoZXJPYmouZm9yZWNhc3QuZm9yZWNhc3RkYXk7XG4gIGNvbnN0IHRvZGF5c1dlYXRoZXJJY29uID0gYGh0dHBzOiR7Zm9yZWNhc3RbMF0uZGF5LmNvbmRpdGlvbi5pY29ufWA7XG5cbiAgZm9yZWNhc3QuZm9yRWFjaCgoZGF5LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGF2ZXJhZ2VUZW1wID0gZGF5LmRheVtgYXZndGVtcF8ke3RlbXBTY2FsZX1gXTtcbiAgICBjb25zdCB3ZWF0aGVySWNvbiA9IGBodHRwczoke2RheS5kYXkuY29uZGl0aW9uLmljb259YDtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRheS5kYXkuY29uZGl0aW9uLnRleHQ7XG4gICAgY29uc3QgZGF5SW5kZXggPSBpbmRleDtcbiAgICByZW5kZXJEYXlET00oYXZlcmFnZVRlbXAsIHdlYXRoZXJJY29uLCBkZXNjcmlwdGlvbiwgZGF5SW5kZXgpO1xuICB9KTtcbiAgcmVuZGVyTG9jYXRpb25IZWFkaW5nRG9tKGNpdHksIGNvdW50cnkpO1xuICByZW5kZXJEYXRlSGVhZGluZ3NEb20oKTtcbiAgcmVuZGVyQmFja2dyb3VuZFdlYXRoZXJTd2F0Y2godG9kYXlzV2VhdGhlckljb24pO1xufVxuXG4vL1JlbmRlciBvbmUgZGF5cyB3ZWF0aGVyIGRldGFpbHMgdG8gRG9tXG5mdW5jdGlvbiByZW5kZXJEYXlET00odGVtcGVyYXR1cmUsIGljb24sIGRlc2NyaXB0aW9uLCBkYXlJbmRleCkge1xuICBjb25zdCBkYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItY29udGFpbmVyXCIpLmNoaWxkcmVuW2RheUluZGV4XTtcbiAgZGF5LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGVyYXR1cmUgaDJcIikudGV4dENvbnRlbnQgPSBgJHt0ZW1wZXJhdHVyZX3CsGA7XG4gIGRheS5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItaWNvblwiKS5jaGlsZHJlblswXS5zcmMgPSBpY29uO1xuICBkYXkucXVlcnlTZWxlY3RvcihcIi53ZWF0aGVyLWRlc2NyaXB0aW9uIGg2XCIpLnRleHRDb250ZW50ID0gZGVzY3JpcHRpb247XG59XG5cbi8vUmVuZGVyIGxvY2F0aW9uIGhlYWRpbmdcbmZ1bmN0aW9uIHJlbmRlckxvY2F0aW9uSGVhZGluZ0RvbShjaXR5LCBjb3VudHJ5KSB7XG4gIGNvbnN0IGxvY2F0aW9uSGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb24taGVhZGVyXCIpO1xuICBsb2NhdGlvbkhlYWRpbmcudGV4dENvbnRlbnQgPSBgJHtjaXR5fSAtICR7Y291bnRyeX1gO1xufVxuXG4vL1JldHVybnMgZGF5L2RhdGUgWCBkYXlzIGluIHRvIHRoZSBmdXR1cmVcbmZ1bmN0aW9uIGZvcm1hdERhdGVIZWFkaW5ncyhob3dNYW55RGF5c0luVG9UaGVGdXR1cmUpIHtcbiAgY29uc3QgZGF5c09mV2VlayA9IFtcbiAgICBcIlN1bmRheVwiLFxuICAgIFwiTW9uZGF5XCIsXG4gICAgXCJUdWVzZGF5XCIsXG4gICAgXCJXZWRuZXNkYXlcIixcbiAgICBcIlRodXJzZGF5XCIsXG4gICAgXCJGcmlkYXlcIixcbiAgICBcIlNhdHVyZGF5XCIsXG4gIF07XG5cbiAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIGhvd01hbnlEYXlzSW5Ub1RoZUZ1dHVyZSk7XG4gIGNvbnN0IGRheU5hbWUgPSBkYXlzT2ZXZWVrW2RheS5nZXREYXkoKV07XG4gIGNvbnN0IGRhdGUgPSBhZGRPcmRpbmFsTnVtZXJTdWZmaXgoZGF5LmdldERhdGUoKSk7XG5cbiAgcmV0dXJuIGAke2RheU5hbWV9ICR7ZGF0ZX1gO1xufVxuXG4vL0FkZHMgY29ycmVjdCBvcmRpbmFsIG51bWJlciBzdWZmaXggdG8gbnVtYmVyXG5mdW5jdGlvbiBhZGRPcmRpbmFsTnVtZXJTdWZmaXgobnVtYmVyKSB7XG4gIGNvbnN0IGFycmF5ID0gU3RyaW5nKG51bWJlcikuc3BsaXQoXCJcIik7XG4gIGxldCBudW1iZXJBbmRTdWZmaXg7XG4gIGNvbnN0IGxhc3ROdW1iZXJJbkFycmF5ID0gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gIGlmIChsYXN0TnVtYmVySW5BcnJheSA9PT0gXCIxXCIpIHtcbiAgICBudW1iZXJBbmRTdWZmaXggPSBhcnJheS5qb2luKFwiXCIpICsgXCJzdFwiO1xuICB9IGVsc2UgaWYgKGxhc3ROdW1iZXJJbkFycmF5ID09PSBcIjJcIikge1xuICAgIG51bWJlckFuZFN1ZmZpeCA9IGFycmF5LmpvaW4oXCJcIikgKyBcIm5kXCI7XG4gIH0gZWxzZSBpZiAobGFzdE51bWJlckluQXJyYXkgPT09IFwiM1wiKSB7XG4gICAgbnVtYmVyQW5kU3VmZml4ID0gYXJyYXkuam9pbihcIlwiKSArIFwicmRcIjtcbiAgfSBlbHNlIHtcbiAgICBudW1iZXJBbmRTdWZmaXggPSBhcnJheS5qb2luKFwiXCIpICsgXCJ0aFwiO1xuICB9XG4gIHJldHVybiBudW1iZXJBbmRTdWZmaXg7XG59XG5cbi8vUmVuZGVycyBkYXRlIGhlYWRpbmdzIHRvIERvbVxuZnVuY3Rpb24gcmVuZGVyRGF0ZUhlYWRpbmdzRG9tKCkge1xuICBjb25zdCBkYXRlSGVhZGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRheSBoNVwiKTtcbiAgZGF0ZUhlYWRpbmdzLmZvckVhY2goKGhlYWRpbmcsIGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4IDw9IDApIHtcbiAgICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRvZGF5XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSBmb3JtYXREYXRlSGVhZGluZ3MoaW5kZXgpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vVG9nZ2xlcyByZW5kZXIgYmV0d2VlbiBGYWhyZW5oZWl0IGFuZCBDZWxzaXVzIGluIERvbS5cbmZ1bmN0aW9uIHRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0RG9tKCkge1xuICB0b2dnbGVDZWxzaXVzRmFocmVuaGVpdFNlbGVjdGVkRG9tKCk7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2Vsc2l1cy1mYXItdG9nZ2xlXCIpO1xuICBjb25zdCB0ZW1wZXJhdHVyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRlbXAtbnVtYmVyXCIpO1xuICBjb25zdCBjdXJyZW50U2NhbGUgPSB0b2dnbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9nZ2xlLXVwXCIpXG4gICAgPyBcImNlbHNpdXNcIlxuICAgIDogXCJmYWhyZW5oZWl0XCI7XG4gIHRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKFwidG9nZ2xlLXVwXCIpO1xuICB0b2dnbGUuY2xhc3NMaXN0LnRvZ2dsZShcInRvZ2dsZS1kb3duXCIpO1xuXG4gIHRlbXBlcmF0dXJlcy5mb3JFYWNoKCh0ZW1wKSA9PiB7XG4gICAgbGV0IHRlbXBlcmF0dXJlV2l0aG91dERlZ3JlZVN5bWJvbCA9IHJlbW92ZURlZ3JlZVN5bWJvbCh0ZW1wLnRleHRDb250ZW50KTtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0gdG9nZ2xlVmFsdWVDZWxzaXVzRmFocmVuaGVpdChcbiAgICAgIHRlbXBlcmF0dXJlV2l0aG91dERlZ3JlZVN5bWJvbCxcbiAgICAgIGN1cnJlbnRTY2FsZVxuICAgICk7XG4gIH0pO1xufVxuXG4vL0NvbnZlcnRzIGJldHdlZW4gRmFocmVuaGVpdCBhbmQgQ2Vsc2l1c1xuZnVuY3Rpb24gdG9nZ2xlVmFsdWVDZWxzaXVzRmFocmVuaGVpdCh2YWx1ZSwgdHlwZSkge1xuICBjb25zdCBDRUxTSVVTX1RPX0ZBSFJFTkhFSVRfRkFDVE9SID0gOSAvIDU7XG4gIGNvbnN0IEZBSFJFTkhFSVRfVE9fQ0VMU0lVU19GQUNUT1IgPSA1IC8gOTtcbiAgY29uc3QgRkFIUkVOSEVJVF9GUkVFWklOR19QT0lOVCA9IDMyO1xuICBsZXQgdmFsdWVDb252ZXJ0ZWQ7XG5cbiAgaWYgKHR5cGUgPT09IFwiZmFocmVuaGVpdFwiKSB7XG4gICAgdmFsdWVDb252ZXJ0ZWQgPVxuICAgICAgKE51bWJlcih2YWx1ZSkgLSBGQUhSRU5IRUlUX0ZSRUVaSU5HX1BPSU5UKSAqXG4gICAgICBGQUhSRU5IRUlUX1RPX0NFTFNJVVNfRkFDVE9SO1xuICB9IGVsc2Uge1xuICAgIHZhbHVlQ29udmVydGVkID1cbiAgICAgIE51bWJlcih2YWx1ZSkgKiBDRUxTSVVTX1RPX0ZBSFJFTkhFSVRfRkFDVE9SICsgRkFIUkVOSEVJVF9GUkVFWklOR19QT0lOVDtcbiAgfVxuICByZXR1cm4gYWRkRGVncmVlU3ltYm9sKHZhbHVlQ29udmVydGVkLnRvRml4ZWQoMSkpO1xufVxuXG4vL0FkZHMgZGVncmVlIHN5bWJvbCB0byBzdHJpbmdcbmZ1bmN0aW9uIGFkZERlZ3JlZVN5bWJvbChzdHIpIHtcbiAgbGV0IHN0ckFycmF5ID0gc3RyLnNwbGl0KFwiXCIpO1xuICBzdHJBcnJheS5wdXNoKFwiwrBcIik7XG4gIGxldCBzdHJpbmdXaXRoRGVncmVlU3ltYm9sID0gc3RyQXJyYXkuam9pbihcIlwiKTtcbiAgcmV0dXJuIHN0cmluZ1dpdGhEZWdyZWVTeW1ib2w7XG59XG5cbi8vUmVtb3ZlcyBkZWdyZWUgc3ltYm9sIGZyb20gc3RyaW5nXG5mdW5jdGlvbiByZW1vdmVEZWdyZWVTeW1ib2woc3RyKSB7XG4gIGxldCBzdHJBcnJheSA9IHN0ci5zcGxpdChcIlwiKTtcbiAgc3RyQXJyYXkucG9wKCk7XG4gIGxldCBzdHJpbmdXaXRob3V0RGVncmVlU3ltYm9sID0gc3RyQXJyYXkuam9pbihcIlwiKTtcbiAgcmV0dXJuIHN0cmluZ1dpdGhvdXREZWdyZWVTeW1ib2w7XG59XG5cbi8vVG9nZ2xlcyBsb2FkaW5nIGljb25zIG9mZiBEb21cbmZ1bmN0aW9uIHRvZ2dsZUxvYWRpbmdJY29uc09mZkRvbSgpIHtcbiAgY29uc3QgbG9hZGVySWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvYWRlclwiKTtcbiAgY29uc3QgbG9jYXRpb25IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1oZWFkZXJcIik7XG4gIGxvY2F0aW9uSGVhZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGVyLXRleHRcIik7XG4gIGxvYWRlckljb25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LnJlbW92ZSgpO1xuICB9KTtcbn1cblxuLy9Ub2dnbGVzIGxvYWRpbmcgaWNvbnMgb24gRG9tXG5mdW5jdGlvbiB0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSgpIHtcbiAgY29uc3Qgd2VhdGhlckljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWljb24sIC50ZW1wLW51bWJlclwiKTtcbiAgY29uc3QgbG9jYXRpb25IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1oZWFkZXJcIik7XG4gIGxvY2F0aW9uSGVhZGluZy5jbGFzc0xpc3QuYWRkKFwibG9hZGVyLXRleHRcIik7XG4gIHdlYXRoZXJJY29ucy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChcImxvYWRlclwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XG4gIH0pO1xufVxuXG4vL1JlbW92ZXMgYWxsIHdlYXRoZXIgZGF0YSBmcm9tIERvbVxuZnVuY3Rpb24gcmVtb3ZlV2VhdGhlckRhdGFEb20oKSB7XG4gIGNvbnN0IGVsZW1lbnRzVG9DbGVhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgXCIud2VhdGhlci1kZXNjcmlwdGlvbiBoNiwudGVtcGVyYXR1cmUgaDIsLmxvY2F0aW9uLWhlYWRlciwud2VhdGhlci1pY29uIGltZ1wiXG4gICk7XG4gIGVsZW1lbnRzVG9DbGVhci5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgZWxlbWVudC5zcmMgPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9XG4gIH0pO1xufVxuXG4vL1JlbmRlcnMgc2VsZWN0ZWQgc2NhbGUgdG8gYmUgaGlnaGxpZ2h0ZWQgaW4gRG9tXG5mdW5jdGlvbiB0b2dnbGVDZWxzaXVzRmFocmVuaGVpdFNlbGVjdGVkRG9tKCkge1xuICBjb25zdCBjZWxzaXVzU3ltYm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLXN5bWJvbFwiKTtcbiAgY29uc3QgZmFocmVuaGVpdFN5bWJvbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmFocmVuaGVpdC1zeW1ib2xcIik7XG4gIGNlbHNpdXNTeW1ib2wuY2xhc3NMaXN0LnRvZ2dsZShcInNjYWxlLXN5bWJvbC1zZWxlY3RlZFwiKTtcbiAgZmFocmVuaGVpdFN5bWJvbC5jbGFzc0xpc3QudG9nZ2xlKFwic2NhbGUtc3ltYm9sLXNlbGVjdGVkXCIpO1xufVxuXG4vL1JlbmRlcnMgYmFja2dyb3VuZCBzd2F0Y2ggcGF0dGVybiBEb21cbmZ1bmN0aW9uIHJlbmRlckJhY2tncm91bmRXZWF0aGVyU3dhdGNoKHVybCkge1xuICBjb25zdCB3ZWF0aGVyU3dhdGNoTGF5ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXJcIlxuICApO1xuICB3ZWF0aGVyU3dhdGNoTGF5ZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3VybH0pYDtcbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2ZvbnRzL01lcnJpd2VhdGhlclNhbnMudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6IFwiTWVycml3ZWF0aGVyXCI7XG4gIHNyYzogbG9jYWwoXCJNZXJyaXdlYXRoZXIgUmVndWxhclwiKSwgdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBmb250LXdlaWdodDogNDAwO1xufVxuXG46cm9vdCB7XG4gIC0tbWFpbi1wcm9qZWN0cy1jb2xvcjogcmdiKDIyOSwgMjQzLCAyNDYpO1xufVxuXG5odG1sLFxuYm9keSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogNDY1cHg7XG59XG5cbi5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGVuZDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxMDB2dztcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gIGFsaWduLXNlbGY6IGJhc2VsaW5lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XG59XG5cbi5mb290ZXItaW5mbyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcbn1cblxuLmhlYWRlciBoMSB7XG4gIHBhZGRpbmctbGVmdDogMzBweDtcbn1cblxuYm9keSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWluLXdpZHRoOiA1NTBweDtcbiAgbWluLWhlaWdodDogMzUwcHg7XG59XG5cbi5hcHAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogNDB2dztcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgKi9cbiAgbWluLXdpZHRoOiA1MDBweDtcbiAgYXNwZWN0LXJhdGlvOiAxNS85O1xuICBib3gtc2hhZG93OiByZ2JhKDUwLCA1MCwgOTMsIDAuMjUpIDBweCA1MHB4IDEwMHB4IC0yMHB4LFxuICAgIHJnYmEoMCwgMCwgMCwgMC4zKSAwcHggMzBweCA2MHB4IC0zMHB4LFxuICAgIHJnYmEoMTAsIDM3LCA2NCwgMC4zNSkgMHB4IC0ycHggNnB4IDBweCBpbnNldDtcbn1cblxuLmZvb3RlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDI1JTtcbiAgLyogYm9yZGVyOiAycHggc29saWQgcmdiKDE4NiwgMTg0LCAxODQpOyAqL1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMzMsIDM2LCAxMzMpO1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA1cHg7XG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA1cHg7XG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxODQsIDE4NCwgMTg2KTsgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDMzLCAzNiwgMTMzKTtcbn1cblxuLmFwcC1ib2R5IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogNzUlO1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7XG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDVweDtcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDVweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nLXRvcDogMzVweDtcbiAgcGFkZGluZy1ib3R0b206IDE1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcbn1cblxuLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJhY2tncm91bmQtc2l6ZTogYXV0bztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBvcGFjaXR5OiAwLjM7XG4gIHRvcDogMHB4O1xuICByaWdodDogMHB4O1xuICBib3R0b206IDBweDtcbiAgbGVmdDogMHB4O1xufVxuXG4uc2VhcmNoLWdvIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIHJnYig3LCA3LCA3KTsgKi9cbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBoZWlnaHQ6IDYwJTtcbiAgd2lkdGg6IDcwJTtcbiAgcGFkZGluZzogMCA1cHggMCA1cHg7XG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzEsIDEzMCwgMTMwKTsgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xufVxuXG5pbnB1dCB7XG4gIGhlaWdodDogNTAlO1xuICB3aWR0aDogNzUlO1xuICBwYWRkaW5nOiAwIDVweDtcbn1cblxuYnV0dG9uIHtcbiAgaGVpZ2h0OiA1NSU7XG4gIHdpZHRoOiAxNSU7XG59XG5cbi53ZWF0aGVyLWNvbnRhaW5lciB7XG4gIHotaW5kZXg6IDI7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XG4gIGdhcDogNXB4O1xuICB3aWR0aDogNzAlO1xuICBtaW4taGVpZ2h0OiAxOTJweDtcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDIwNSwgMjAzLCAyMDMpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcbn1cbi5sb2NhdGlvbi1oZWFkZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogLTUlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogNXB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA1LCAyMDMsIDIwMyk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgei1pbmRleDogMjtcbn1cblxuLmNlbHNpdXMtZmFyLXRvZ2dsZSB7XG4gIHotaW5kZXg6IDI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTQlO1xuICByaWdodDogMzRweDtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMzBweDtcbiAgYm9yZGVyOiBzb2xpZCByZ2IoMTMxLCAxMzAsIDEzMCkgMXB4O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIHBhZGRpbmc6IDJweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzMiwgMjI5LCAyMjkpO1xufVxuXG4udG9nZ2xlLWNpcmNsZSB7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgd2lkdGg6IDEycHg7XG4gIGhlaWdodDogMTJweDtcbiAgYm9yZGVyOiBzb2xpZCByZ2IoMTYzLCAxNjEsIDE2MSkgMXB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzEsIDEzMCwgMTMwKTtcbn1cblxuLnRvZGF5LFxuLnRvbW1vcm93LFxuLm92ZXJtb3Jyb3cge1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDJmciAxZnIgMWZyO1xufVxuXG4uZGF5LFxuLndlYXRoZXItZGVzY3JpcHRpb24ge1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZGF5OmFmdGVyLFxuLndlYXRoZXItZGVzY3JpcHRpb246YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kOiBibGFjaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiA1JTtcbiAgaGVpZ2h0OiAxcHg7XG4gIHdpZHRoOiA5MCU7XG59XG5cbi53ZWF0aGVyLWRlc2NyaXB0aW9uOmFmdGVyIHtcbiAgdG9wOiA1cHg7XG59XG5cbi5kYXk6YWZ0ZXIge1xuICBib3R0b206IDVweDtcbn1cblxuLndlYXRoZXItaWNvbixcbi50ZW1wZXJhdHVyZSB7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbn1cblxuLmRheSB7XG4gIG1pbi1oZWlnaHQ6IDE0cHg7XG59XG5cbi50b2dnbGUtdXAge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG5cbi50b2dnbGUtZG93biB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi5mYWhyZW5oZWl0LXN5bWJvbCxcbi5jZWxzaXVzLXN5bWJvbCB7XG4gIHdpZHRoOiAyOHB4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY29sb3I6IHJnYigxNjMsIDE2MSwgMTYxKTtcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiAxcHggZ3JleSBzb2xpZDtcbiAgb3BhY2l0eTogMC43O1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5kaXNhYmxlLXBvaW50ZXIge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgY3Vyc29yOiBub25lO1xufVxuXG4uc2NhbGUtc3ltYm9sLXNlbGVjdGVkIHtcbiAgLyogYm9yZGVyOiAxcHggZ3JleSBzb2xpZDsgKi9cbiAgYm94LXNoYWRvdzogMHB4IDJweCBncmV5O1xuICBvcGFjaXR5OiAxO1xufVxuXG4uZmFocmVuaGVpdC1zeW1ib2wge1xuICBib3R0b206IC0yMHB4O1xuICBsZWZ0OiAxNXB4O1xufVxuXG4uY2Vsc2l1cy1zeW1ib2wge1xuICB0b3A6IC0xNXB4O1xuICBsZWZ0OiAxNXB4O1xufVxuXG4ubG9hZGVyIHtcbiAgd2lkdGg6IDMxcHg7XG4gIC0tZjogOHB4O1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgcGFkZGluZzogMXB4O1xuICBiYWNrZ3JvdW5kOiBjb25pYy1ncmFkaWVudCgjMDAwMCAxMCUsICMzMzZjZjApIGNvbnRlbnQtYm94O1xuICBtYXNrOiByZXBlYXRpbmctY29uaWMtZ3JhZGllbnQoIzAwMDAgMGRlZywgIzAwMCAxZGVnIDIwZGVnLCAjMDAwMCAyMWRlZyAzNmRlZyksXG4gICAgcmFkaWFsLWdyYWRpZW50KFxuICAgICAgZmFydGhlc3Qtc2lkZSxcbiAgICAgICMwMDAwIGNhbGMoMTAwJSAtIHZhcigtLWYpIC0gMXB4KSxcbiAgICAgICMwMDAgY2FsYygxMDAlIC0gdmFyKC0tZikpXG4gICAgKTtcbiAgbWFzay1jb21wb3NpdGU6IGRlc3RpbmF0aW9uLWluO1xuICBtYXNrLWNvbXBvc2l0ZTogaW50ZXJzZWN0O1xuICBhbmltYXRpb246IGw0IDFzIGluZmluaXRlIHN0ZXBzKDEwKTtcbn1cblxuQGtleWZyYW1lcyBsNCB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxdHVybik7XG4gIH1cbn1cblxuLmxvYWRlci10ZXh0IHtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1mYW1pbHk6IE1lcnJpd2VhdGhlciwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBhbmltYXRpb246IGwxIDFzIGxpbmVhciBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG4ubG9hZGVyLXRleHQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJMb2FkaW5nLi4uXCI7XG59XG5cbkBrZXlmcmFtZXMgbDEge1xuICB0byB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuXG5idXR0b24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbmE6bGluayB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cblxuYSB7XG4gIGNvbG9yOiAjMDAwO1xufVxuXG4vKiB0YXJnZXQgdGhlIGVsZW1lbnQgeW91IHdhbnQgdGhlIGFuaW1hdGlvbiBvbiAqL1xuLmhlYWRlciBkaXYge1xuICAvKiBhZGQgdGhlc2Ugc3R5bGVzIHRvIG1ha2UgdGhlIHRleHQgbW92ZSBzbW9vdGhseSAqL1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGFuaW1hdGlvbjogc2xpZGUtbGVmdCAycyBlYXNlIGZvcndhcmRzO1xufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlLWxlZnQge1xuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTg1dncpO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNjAwcHgpIHtcbiAgLmhlYWRlciBkaXYge1xuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0xNjAwIDJzIGVhc2UgZm9yd2FyZHM7XG4gIH1cblxuICAuaGVhZGVyIGRpdiBoMSB7XG4gICAgZm9udC1zaXplOiAxLjVlbTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0xNjAwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODB2dyk7XG4gICAgfVxuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3ODBweCkge1xuICAuaGVhZGVyIGRpdiB7XG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTc4MCAycyBlYXNlIGZvcndhcmRzO1xuICB9XG5cbiAgLmhlYWRlciBkaXYgaDEge1xuICAgIGZvbnQtc2l6ZTogMS41ZW07XG4gIH1cblxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtNzgwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNzB2dyk7XG4gICAgfVxuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzMDBweCkge1xuICAuaGVhZGVyIGRpdiB7XG4gICAgZm9udC1zaXplOiAxLjJlbTtcbiAgICBhbmltYXRpb246IHNsaWRlLWxlZnQtMzAwIDJzIGVhc2UgZm9yd2FyZHM7XG4gIH1cbiAgLmhlYWRlciBkaXYgaDEge1xuICAgIGZvbnQtc2l6ZTogMS4yZW07XG4gIH1cblxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtMzAwIHtcbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNXZ3KTtcbiAgICB9XG4gIH1cbn1cblxuLmhlYWRlciBkaXYge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uc3VuLWxvZ28ge1xuICB6LWluZGV4OiAxO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiA2NHB4O1xuICB0b3A6IDEwcHg7XG4gIHJpZ2h0OiAtMzVweDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCO0VBQ3RCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLDJCQUEyQjtFQUMzQiwyRUFBdUU7RUFDdkUsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UseUNBQXlDO0FBQzNDOztBQUVBOztFQUVFLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osWUFBWTtFQUNaLHVCQUF1QjtFQUN2QixvQkFBb0I7RUFDcEIsb0NBQW9DO0FBQ3RDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osWUFBWTtFQUNaLHVCQUF1QjtFQUN2QixvQkFBb0I7RUFDcEIsb0NBQW9DO0FBQ3RDOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUNoQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsNkJB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ZixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLDBEQUEwRDtFQUMxRDs7Ozs7S0FLRztFQUNILDhCQUE4QjtFQUM5Qix5QkFBeUI7RUFDekIsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0U7SUFDRSx3QkFBd0I7RUFDMUI7QUFDRjs7QUFFQTtFQUNFLG1CQUFtQjtFQUNuQixxQ0FBcUM7RUFDckMsZUFBZTtFQUNmLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0U7SUFDRSxVQUFVO0VBQ1o7QUFDRjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUEsaURBQWlEO0FBQ2pEO0VBQ0Usb0RBQW9EO0VBQ3BELHFCQUFxQjtFQUNyQixzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRTtJQUNFLDRCQUE0QjtFQUM5QjtBQUNGOztBQUVBO0VBQ0U7SUFDRSwyQ0FBMkM7RUFDN0M7O0VBRUE7SUFDRSxnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRTtNQUNFLDRCQUE0QjtJQUM5QjtFQUNGO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLDBDQUEwQztFQUM1Qzs7RUFFQTtJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFO01BQ0UsNEJBQTRCO0lBQzlCO0VBQ0Y7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsZ0JBQWdCO0lBQ2hCLDBDQUEwQztFQUM1QztFQUNBO0lBQ0UsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0U7TUFDRSwyQkFBMkI7SUFDN0I7RUFDRjtBQUNGOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxVQUFVO0VBQ1Ysa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxTQUFTO0VBQ1QsWUFBWTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiTWVycml3ZWF0aGVyXFxcIjtcXG4gIHNyYzogbG9jYWwoXFxcIk1lcnJpd2VhdGhlciBSZWd1bGFyXFxcIiksIHVybChcXFwiLi9mb250cy9NZXJyaXdlYXRoZXJTYW5zLnR0ZlxcXCIpO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuOnJvb3Qge1xcbiAgLS1tYWluLXByb2plY3RzLWNvbG9yOiByZ2IoMjI5LCAyNDMsIDI0Nik7XFxufVxcblxcbmh0bWwsXFxuYm9keSB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1pbi1oZWlnaHQ6IDQ2NXB4O1xcbn1cXG5cXG4uaGVhZGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGVuZDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGFsaWduLXNlbGY6IGJhc2VsaW5lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xcbn1cXG5cXG4uZm9vdGVyLWluZm8ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xcbn1cXG5cXG4uaGVhZGVyIGgxIHtcXG4gIHBhZGRpbmctbGVmdDogMzBweDtcXG59XFxuXFxuYm9keSB7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBtaW4td2lkdGg6IDU1MHB4O1xcbiAgbWluLWhlaWdodDogMzUwcHg7XFxufVxcblxcbi5hcHAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICB3aWR0aDogNDB2dztcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyAqL1xcbiAgbWluLXdpZHRoOiA1MDBweDtcXG4gIGFzcGVjdC1yYXRpbzogMTUvOTtcXG4gIGJveC1zaGFkb3c6IHJnYmEoNTAsIDUwLCA5MywgMC4yNSkgMHB4IDUwcHggMTAwcHggLTIwcHgsXFxuICAgIHJnYmEoMCwgMCwgMCwgMC4zKSAwcHggMzBweCA2MHB4IC0zMHB4LFxcbiAgICByZ2JhKDEwLCAzNywgNjQsIDAuMzUpIDBweCAtMnB4IDZweCAwcHggaW5zZXQ7XFxufVxcblxcbi5mb290ZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGhlaWdodDogMjUlO1xcbiAgLyogYm9yZGVyOiAycHggc29saWQgcmdiKDE4NiwgMTg0LCAxODQpOyAqL1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDMzLCAzNiwgMTMzKTtcXG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDVweDtcXG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA1cHg7XFxuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTg0LCAxODQsIDE4Nik7ICovXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzMsIDM2LCAxMzMpO1xcbn1cXG5cXG4uYXBwLWJvZHkge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGhlaWdodDogNzUlO1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDE4NiwgMTg0LCAxODQpO1xcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNXB4O1xcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDVweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmctdG9wOiAzNXB4O1xcbiAgcGFkZGluZy1ib3R0b206IDE1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XFxufVxcblxcbi53ZWF0aGVyLXN3YXRjaC1vcGFjaXR5LWxheWVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJhY2tncm91bmQtc2l6ZTogYXV0bztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG9wYWNpdHk6IDAuMztcXG4gIHRvcDogMHB4O1xcbiAgcmlnaHQ6IDBweDtcXG4gIGJvdHRvbTogMHB4O1xcbiAgbGVmdDogMHB4O1xcbn1cXG5cXG4uc2VhcmNoLWdvIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAvKiBib3JkZXI6IDFweCBzb2xpZCByZ2IoNywgNywgNyk7ICovXFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBoZWlnaHQ6IDYwJTtcXG4gIHdpZHRoOiA3MCU7XFxuICBwYWRkaW5nOiAwIDVweCAwIDVweDtcXG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzEsIDEzMCwgMTMwKTsgKi9cXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcXG59XFxuXFxuaW5wdXQge1xcbiAgaGVpZ2h0OiA1MCU7XFxuICB3aWR0aDogNzUlO1xcbiAgcGFkZGluZzogMCA1cHg7XFxufVxcblxcbmJ1dHRvbiB7XFxuICBoZWlnaHQ6IDU1JTtcXG4gIHdpZHRoOiAxNSU7XFxufVxcblxcbi53ZWF0aGVyLWNvbnRhaW5lciB7XFxuICB6LWluZGV4OiAyO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XFxuICBnYXA6IDVweDtcXG4gIHdpZHRoOiA3MCU7XFxuICBtaW4taGVpZ2h0OiAxOTJweDtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigyMDUsIDIwMywgMjAzKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcXG59XFxuLmxvY2F0aW9uLWhlYWRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IC01JTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiKDIwNSwgMjAzLCAyMDMpO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuLmNlbHNpdXMtZmFyLXRvZ2dsZSB7XFxuICB6LWluZGV4OiAyO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDE0JTtcXG4gIHJpZ2h0OiAzNHB4O1xcbiAgd2lkdGg6IDE2cHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICBib3JkZXI6IHNvbGlkIHJnYigxMzEsIDEzMCwgMTMwKSAxcHg7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBwYWRkaW5nOiAycHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjMyLCAyMjksIDIyOSk7XFxufVxcblxcbi50b2dnbGUtY2lyY2xlIHtcXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcXG4gIHdpZHRoOiAxMnB4O1xcbiAgaGVpZ2h0OiAxMnB4O1xcbiAgYm9yZGVyOiBzb2xpZCByZ2IoMTYzLCAxNjEsIDE2MSkgMXB4O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzMSwgMTMwLCAxMzApO1xcbn1cXG5cXG4udG9kYXksXFxuLnRvbW1vcm93LFxcbi5vdmVybW9ycm93IHtcXG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMmZyIDFmciAxZnI7XFxufVxcblxcbi5kYXksXFxuLndlYXRoZXItZGVzY3JpcHRpb24ge1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgZ3JleTsgKi9cXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5kYXk6YWZ0ZXIsXFxuLndlYXRoZXItZGVzY3JpcHRpb246YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBiYWNrZ3JvdW5kOiBibGFjaztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IDUlO1xcbiAgaGVpZ2h0OiAxcHg7XFxuICB3aWR0aDogOTAlO1xcbn1cXG5cXG4ud2VhdGhlci1kZXNjcmlwdGlvbjphZnRlciB7XFxuICB0b3A6IDVweDtcXG59XFxuXFxuLmRheTphZnRlciB7XFxuICBib3R0b206IDVweDtcXG59XFxuXFxuLndlYXRoZXItaWNvbixcXG4udGVtcGVyYXR1cmUge1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgZ3JleTsgKi9cXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbn1cXG5cXG4uZGF5IHtcXG4gIG1pbi1oZWlnaHQ6IDE0cHg7XFxufVxcblxcbi50b2dnbGUtdXAge1xcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xcbn1cXG5cXG4udG9nZ2xlLWRvd24ge1xcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG59XFxuXFxuLmZhaHJlbmhlaXQtc3ltYm9sLFxcbi5jZWxzaXVzLXN5bWJvbCB7XFxuICB3aWR0aDogMjhweDtcXG4gIGhlaWdodDogMjBweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGNvbG9yOiByZ2IoMTYzLCAxNjEsIDE2MSk7XFxuICBib3JkZXItcmFkaXVzOiAxNXB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBncmV5IHNvbGlkO1xcbiAgb3BhY2l0eTogMC43O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uZGlzYWJsZS1wb2ludGVyIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgY3Vyc29yOiBub25lO1xcbn1cXG5cXG4uc2NhbGUtc3ltYm9sLXNlbGVjdGVkIHtcXG4gIC8qIGJvcmRlcjogMXB4IGdyZXkgc29saWQ7ICovXFxuICBib3gtc2hhZG93OiAwcHggMnB4IGdyZXk7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4uZmFocmVuaGVpdC1zeW1ib2wge1xcbiAgYm90dG9tOiAtMjBweDtcXG4gIGxlZnQ6IDE1cHg7XFxufVxcblxcbi5jZWxzaXVzLXN5bWJvbCB7XFxuICB0b3A6IC0xNXB4O1xcbiAgbGVmdDogMTVweDtcXG59XFxuXFxuLmxvYWRlciB7XFxuICB3aWR0aDogMzFweDtcXG4gIC0tZjogOHB4O1xcbiAgYXNwZWN0LXJhdGlvOiAxO1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgcGFkZGluZzogMXB4O1xcbiAgYmFja2dyb3VuZDogY29uaWMtZ3JhZGllbnQoIzAwMDAgMTAlLCAjMzM2Y2YwKSBjb250ZW50LWJveDtcXG4gIG1hc2s6IHJlcGVhdGluZy1jb25pYy1ncmFkaWVudCgjMDAwMCAwZGVnLCAjMDAwIDFkZWcgMjBkZWcsICMwMDAwIDIxZGVnIDM2ZGVnKSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KFxcbiAgICAgIGZhcnRoZXN0LXNpZGUsXFxuICAgICAgIzAwMDAgY2FsYygxMDAlIC0gdmFyKC0tZikgLSAxcHgpLFxcbiAgICAgICMwMDAgY2FsYygxMDAlIC0gdmFyKC0tZikpXFxuICAgICk7XFxuICBtYXNrLWNvbXBvc2l0ZTogZGVzdGluYXRpb24taW47XFxuICBtYXNrLWNvbXBvc2l0ZTogaW50ZXJzZWN0O1xcbiAgYW5pbWF0aW9uOiBsNCAxcyBpbmZpbml0ZSBzdGVwcygxMCk7XFxufVxcblxcbkBrZXlmcmFtZXMgbDQge1xcbiAgdG8ge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxdHVybik7XFxuICB9XFxufVxcblxcbi5sb2FkZXItdGV4dCB7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgZm9udC1mYW1pbHk6IE1lcnJpd2VhdGhlciwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGFuaW1hdGlvbjogbDEgMXMgbGluZWFyIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuLmxvYWRlci10ZXh0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiTG9hZGluZy4uLlxcXCI7XFxufVxcblxcbkBrZXlmcmFtZXMgbDEge1xcbiAgdG8ge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cXG5idXR0b24ge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5hOmxpbmsge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG5cXG4vKiB0YXJnZXQgdGhlIGVsZW1lbnQgeW91IHdhbnQgdGhlIGFuaW1hdGlvbiBvbiAqL1xcbi5oZWFkZXIgZGl2IHtcXG4gIC8qIGFkZCB0aGVzZSBzdHlsZXMgdG8gbWFrZSB0aGUgdGV4dCBtb3ZlIHNtb290aGx5ICovXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBhbmltYXRpb246IHNsaWRlLWxlZnQgMnMgZWFzZSBmb3J3YXJkcztcXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1sZWZ0IHtcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTg1dncpO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMTYwMHB4KSB7XFxuICAuaGVhZGVyIGRpdiB7XFxuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0xNjAwIDJzIGVhc2UgZm9yd2FyZHM7XFxuICB9XFxuXFxuICAuaGVhZGVyIGRpdiBoMSB7XFxuICAgIGZvbnQtc2l6ZTogMS41ZW07XFxuICB9XFxuXFxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtMTYwMCB7XFxuICAgIDEwMCUge1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODB2dyk7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDc4MHB4KSB7XFxuICAuaGVhZGVyIGRpdiB7XFxuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC03ODAgMnMgZWFzZSBmb3J3YXJkcztcXG4gIH1cXG5cXG4gIC5oZWFkZXIgZGl2IGgxIHtcXG4gICAgZm9udC1zaXplOiAxLjVlbTtcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC03ODAge1xcbiAgICAxMDAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTcwdncpO1xcbiAgICB9XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAzMDBweCkge1xcbiAgLmhlYWRlciBkaXYge1xcbiAgICBmb250LXNpemU6IDEuMmVtO1xcbiAgICBhbmltYXRpb246IHNsaWRlLWxlZnQtMzAwIDJzIGVhc2UgZm9yd2FyZHM7XFxuICB9XFxuICAuaGVhZGVyIGRpdiBoMSB7XFxuICAgIGZvbnQtc2l6ZTogMS4yZW07XFxuICB9XFxuXFxuICBAa2V5ZnJhbWVzIHNsaWRlLWxlZnQtMzAwIHtcXG4gICAgMTAwJSB7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01dncpO1xcbiAgICB9XFxuICB9XFxufVxcblxcbi5oZWFkZXIgZGl2IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLnN1bi1sb2dvIHtcXG4gIHotaW5kZXg6IDE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogNjRweDtcXG4gIHRvcDogMTBweDtcXG4gIHJpZ2h0OiAtMzVweDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07Il0sIm5hbWVzIjpbImluaXQiLCJnb0J1dHRvbiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRvZ2dsZUJ1dHRvbiIsInVzZXJJbnB1dCIsImNlbHNpdXNGYWhyZW5oZWl0QnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20iLCJkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyIiwiaGFuZGxlR29CdXR0b24iLCJmb3JFYWNoIiwiYnRuIiwiZXZlbnQiLCJrZXkiLCJjZWxzaXVzQnV0dG9uIiwiZmFocmVuaGVpdEJ1dHRvbiIsImNsYXNzTGlzdCIsInRvZ2dsZSIsImxvY2F0aW9uIiwidmFsdWUiLCJ0cmltIiwiYWxlcnQiLCJmZXRjaFdlYXRoZXJGb3JlY2FzdCIsInRoZW4iLCJyZW5kZXJXZWF0aGVyRm9yZWNhc3REb20iLCJnZXRDdXJyZW50bG9jYXRpb24iLCJjb29yZHMiLCJnZXRDdXJyZW50Q2l0eSIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwidG9nZ2xlTG9hZGluZ0ljb25zT25Eb20iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicmVzcG9uc2UiLCJsYXQiLCJsYXRpdHVkZSIsImxuZyIsImxvbmdpdHVkZSIsImZldGNoIiwianNvbiIsIm9iaiIsImNpdHkiLCJFcnJvciIsIkFQSV9LRVkiLCJ1cmwiLCJvayIsInN0YXR1cyIsIndlYXRoZXJPYmoiLCJsb2FkaW5nSW1hZ2VFeGlzdHMiLCJyZW1vdmVXZWF0aGVyRGF0YURvbSIsInRvZ2dsZUxvYWRpbmdJY29uc09mZkRvbSIsInRvZ2dsZVBvc2l0aW9uIiwidGVtcFNjYWxlIiwiY29udGFpbnMiLCJuYW1lIiwiY291bnRyeSIsImZvcmVjYXN0IiwiZm9yZWNhc3RkYXkiLCJ0b2RheXNXZWF0aGVySWNvbiIsImRheSIsImNvbmRpdGlvbiIsImljb24iLCJpbmRleCIsImF2ZXJhZ2VUZW1wIiwid2VhdGhlckljb24iLCJkZXNjcmlwdGlvbiIsInRleHQiLCJkYXlJbmRleCIsInJlbmRlckRheURPTSIsInJlbmRlckxvY2F0aW9uSGVhZGluZ0RvbSIsInJlbmRlckRhdGVIZWFkaW5nc0RvbSIsInJlbmRlckJhY2tncm91bmRXZWF0aGVyU3dhdGNoIiwidGVtcGVyYXR1cmUiLCJjaGlsZHJlbiIsInRleHRDb250ZW50Iiwic3JjIiwibG9jYXRpb25IZWFkaW5nIiwiZm9ybWF0RGF0ZUhlYWRpbmdzIiwiaG93TWFueURheXNJblRvVGhlRnV0dXJlIiwiZGF5c09mV2VlayIsIkRhdGUiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsImRheU5hbWUiLCJnZXREYXkiLCJkYXRlIiwiYWRkT3JkaW5hbE51bWVyU3VmZml4IiwibnVtYmVyIiwiYXJyYXkiLCJTdHJpbmciLCJzcGxpdCIsIm51bWJlckFuZFN1ZmZpeCIsImxhc3ROdW1iZXJJbkFycmF5IiwibGVuZ3RoIiwiam9pbiIsImRhdGVIZWFkaW5ncyIsImhlYWRpbmciLCJ0b2dnbGVDZWxzaXVzRmFocmVuaGVpdFNlbGVjdGVkRG9tIiwidGVtcGVyYXR1cmVzIiwiY3VycmVudFNjYWxlIiwidGVtcCIsInRlbXBlcmF0dXJlV2l0aG91dERlZ3JlZVN5bWJvbCIsInJlbW92ZURlZ3JlZVN5bWJvbCIsInRvZ2dsZVZhbHVlQ2Vsc2l1c0ZhaHJlbmhlaXQiLCJ0eXBlIiwiQ0VMU0lVU19UT19GQUhSRU5IRUlUX0ZBQ1RPUiIsIkZBSFJFTkhFSVRfVE9fQ0VMU0lVU19GQUNUT1IiLCJGQUhSRU5IRUlUX0ZSRUVaSU5HX1BPSU5UIiwidmFsdWVDb252ZXJ0ZWQiLCJOdW1iZXIiLCJhZGREZWdyZWVTeW1ib2wiLCJ0b0ZpeGVkIiwic3RyIiwic3RyQXJyYXkiLCJwdXNoIiwic3RyaW5nV2l0aERlZ3JlZVN5bWJvbCIsInBvcCIsInN0cmluZ1dpdGhvdXREZWdyZWVTeW1ib2wiLCJsb2FkZXJJY29ucyIsInJlbW92ZSIsImVsZW1lbnQiLCJ3ZWF0aGVySWNvbnMiLCJhZGQiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJlbGVtZW50c1RvQ2xlYXIiLCJ0YWdOYW1lIiwiY2Vsc2l1c1N5bWJvbCIsImZhaHJlbmhlaXRTeW1ib2wiLCJ3ZWF0aGVyU3dhdGNoTGF5ZXIiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSJdLCJzb3VyY2VSb290IjoiIn0=