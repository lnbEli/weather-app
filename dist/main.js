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
const animatedLogoDiv = document.querySelector(".header div");

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

//Adjusts styles on animated heading
animatedLogoDiv.addEventListener("animationend", () => {
  const headerLogo = document.querySelector(".header div h1");
  const sunLogo = document.querySelector(".sun-logo");
  sunLogo.style.filter = "brightness(100%)";
  headerLogo.style.opacity = "100%";
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

.header div {
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

.header div h1 {
  opacity: 30%;
}

.header div {
  position: relative;
}
.sun-logo {
  filter: brightness(50%);
  z-index: 1;
  position: absolute;
  width: 64px;
  top: 10px;
  right: -35px;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Merriweather;\n}\n\n@font-face {\n  font-family: \"Merriweather\";\n  src: local(\"Merriweather Regular\"), url(\"./fonts/MerriweatherSans.ttf\");\n  font-weight: 400;\n}\n\n:root {\n  --main-projects-color: rgb(229, 243, 246);\n}\n\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  min-height: 465px;\n}\n\n.header {\n  display: flex;\n  justify-content: end;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: baseline;\n  background-color: rgb(197, 227, 232);\n}\n\n.footer-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  height: 60px;\n  width: 100vw;\n  border: 1px solid black;\n  align-self: flex-end;\n  background-color: rgb(197, 227, 232);\n}\n\n.header h1 {\n  padding-left: 30px;\n}\n\nbody {\n  border: 1px solid black;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 550px;\n  min-height: 350px;\n}\n\n.app {\n  display: flex;\n  flex-direction: column;\n  width: 40vw;\n  border-radius: 5px;\n  /* border: 1px solid black; */\n  min-width: 500px;\n  aspect-ratio: 15/9;\n  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,\n    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,\n    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;\n}\n\n.footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 25%;\n  /* border: 2px solid rgb(186, 184, 184); */\n  border: 2px solid rgb(33, 36, 133);\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n  /* background-color: rgb(184, 184, 186); */\n  background-color: rgb(33, 36, 133);\n}\n\n.app-body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 75%;\n  border: 2px solid rgb(186, 184, 184);\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  position: relative;\n  padding-top: 35px;\n  padding-bottom: 15px;\n  background-color: rgb(197, 227, 232);\n}\n\n.weather-swatch-opacity-layer {\n  position: absolute;\n  background-size: auto;\n  position: absolute;\n  opacity: 0.3;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n.search-go {\n  display: flex;\n  justify-content: space-evenly;\n  align-items: center;\n  /* border: 1px solid rgb(7, 7, 7); */\n  border-radius: 5px;\n  height: 60%;\n  width: 70%;\n  padding: 0 5px 0 5px;\n  /* background-color: rgb(131, 130, 130); */\n  background-color: rgb(197, 227, 232);\n}\n\ninput {\n  height: 50%;\n  width: 75%;\n  padding: 0 5px;\n}\n\nbutton {\n  height: 55%;\n  width: 15%;\n}\n\n.weather-container {\n  z-index: 2;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 5px;\n  width: 70%;\n  min-height: 192px;\n  border: 2px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  background-color: rgb(255, 255, 255);\n}\n.location-header {\n  position: absolute;\n  top: -5%;\n  background-color: white;\n  padding: 5px;\n  border: 1px solid rgb(205, 203, 203);\n  border-radius: 5px;\n  z-index: 2;\n}\n\n.celsius-far-toggle {\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 14%;\n  right: 34px;\n  width: 16px;\n  height: 30px;\n  border: solid rgb(131, 130, 130) 1px;\n  border-radius: 8px;\n  padding: 2px;\n  background-color: rgb(232, 229, 229);\n}\n\n.toggle-circle {\n  border-radius: 6px;\n  width: 12px;\n  height: 12px;\n  border: solid rgb(163, 161, 161) 1px;\n  cursor: pointer;\n  background-color: rgb(131, 130, 130);\n}\n\n.today,\n.tommorow,\n.overmorrow {\n  /* border: 1px solid grey; */\n  border-radius: 5px;\n  display: grid;\n  grid-template-rows: 1fr 2fr 1fr 1fr;\n}\n\n.day,\n.weather-description {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n}\n\n.day:after,\n.weather-description:after {\n  content: \"\";\n  background: black;\n  position: absolute;\n  left: 5%;\n  height: 1px;\n  width: 90%;\n}\n\n.weather-description:after {\n  top: 5px;\n}\n\n.day:after {\n  bottom: 5px;\n}\n\n.weather-icon,\n.temperature {\n  /* border: 1px solid grey; */\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n}\n\n.day {\n  min-height: 14px;\n}\n\n.toggle-up {\n  justify-content: flex-start;\n}\n\n.toggle-down {\n  justify-content: flex-end;\n}\n\n.fahrenheit-symbol,\n.celsius-symbol {\n  width: 28px;\n  height: 20px;\n  position: absolute;\n  color: rgb(163, 161, 161);\n  border-radius: 15px;\n  text-align: center;\n  background-color: white;\n  border: 1px grey solid;\n  opacity: 0.7;\n  cursor: pointer;\n}\n\n.disable-pointer {\n  pointer-events: none;\n  cursor: none;\n}\n\n.scale-symbol-selected {\n  /* border: 1px grey solid; */\n  box-shadow: 0px 2px grey;\n  opacity: 1;\n}\n\n.fahrenheit-symbol {\n  bottom: -20px;\n  left: 15px;\n}\n\n.celsius-symbol {\n  top: -15px;\n  left: 15px;\n}\n\n.loader {\n  width: 31px;\n  --f: 8px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  padding: 1px;\n  background: conic-gradient(#0000 10%, #336cf0) content-box;\n  mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),\n    radial-gradient(\n      farthest-side,\n      #0000 calc(100% - var(--f) - 1px),\n      #000 calc(100% - var(--f))\n    );\n  mask-composite: destination-in;\n  mask-composite: intersect;\n  animation: l4 1s infinite steps(10);\n}\n\n@keyframes l4 {\n  to {\n    transform: rotate(1turn);\n  }\n}\n\n.loader-text {\n  font-weight: normal;\n  font-family: Merriweather, sans-serif;\n  font-size: 16px;\n  animation: l1 1s linear infinite alternate;\n}\n.loader-text:before {\n  content: \"Loading...\";\n}\n\n@keyframes l1 {\n  to {\n    opacity: 0;\n  }\n}\n\nbutton {\n  cursor: pointer;\n}\n\na:link {\n  text-decoration: none;\n}\n\na {\n  color: #000;\n}\n\n.header div {\n  animation: slide-left 2s ease forwards;\n}\n\n@keyframes slide-left {\n  100% {\n    transform: translateX(-85vw);\n  }\n}\n\n@media (max-width: 1600px) {\n  .header div {\n    animation: slide-left-1600 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-1600 {\n    100% {\n      transform: translateX(-80vw);\n    }\n  }\n}\n\n@media (max-width: 780px) {\n  .header div {\n    animation: slide-left-780 2s ease forwards;\n  }\n\n  .header div h1 {\n    font-size: 1.5em;\n  }\n\n  @keyframes slide-left-780 {\n    100% {\n      transform: translateX(-70vw);\n    }\n  }\n}\n\n@media (max-width: 300px) {\n  .header div {\n    font-size: 1.2em;\n    animation: slide-left-300 2s ease forwards;\n  }\n  .header div h1 {\n    font-size: 1.2em;\n  }\n\n  @keyframes slide-left-300 {\n    100% {\n      transform: translateX(-5vw);\n    }\n  }\n}\n\n.header div h1 {\n  opacity: 30%;\n}\n\n.header div {\n  position: relative;\n}\n.sun-logo {\n  filter: brightness(50%);\n  z-index: 1;\n  position: absolute;\n  width: 64px;\n  top: 10px;\n  right: -35px;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnRkFBZ0YsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLE9BQU8sT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxPQUFPLE9BQU8sWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLE1BQU0sWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksV0FBVyxZQUFZLFVBQVUsS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssS0FBSyxZQUFZLE1BQU0sTUFB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Q0FBSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uYW1lLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL25hbWUvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vbmFtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL25hbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9uYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmluaXQoKTtcblxuLy8gVXNlciBCdXR0b25zXG5jb25zdCBnb0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XG5jb25zdCB0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZ2dsZS1jaXJjbGVcIik7XG5jb25zdCB1c2VySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG5jb25zdCBjZWxzaXVzRmFocmVuaGVpdEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICBcIi5mYWhyZW5oZWl0LXN5bWJvbCwuY2Vsc2l1cy1zeW1ib2xcIlxuKTtcbmNvbnN0IGFuaW1hdGVkTG9nb0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGVhZGVyIGRpdlwiKTtcblxuLy9CdXR0b24gZXZlbnQgbGlzdGVuZXJzXG50b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgZGlzYWJsZUNlbGNpdXNGYWhyZW5oZWl0QnV0dG9uUG9pbnRlcigpO1xufSk7XG5cbmdvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVHb0J1dHRvbik7XG5cbmNlbHNpdXNGYWhyZW5oZWl0QnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKTtcbiAgICBkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyKCk7XG4gIH0pO1xufSk7XG5cbi8vQWxsb3dzIFVzZXIgdG8gaGl0IHJldHVybiB0byBzdWJtaXQgc2VhcmNoXG51c2VySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICBoYW5kbGVHb0J1dHRvbigpO1xuICB9XG59KTtcblxuLy9BZGp1c3RzIHN0eWxlcyBvbiBhbmltYXRlZCBoZWFkaW5nXG5hbmltYXRlZExvZ29EaXYuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiB7XG4gIGNvbnN0IGhlYWRlckxvZ28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlciBkaXYgaDFcIik7XG4gIGNvbnN0IHN1bkxvZ28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1bi1sb2dvXCIpO1xuICBzdW5Mb2dvLnN0eWxlLmZpbHRlciA9IFwiYnJpZ2h0bmVzcygxMDAlKVwiO1xuICBoZWFkZXJMb2dvLnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcbn0pO1xuXG4vL1N0b3BzIHVzZXIgY2xpY2tpbmcgYnV0dG9uIHRoYXQgaXMgYWxyZWFkeSBjdXJyZW50bHkgc2VsZWN0ZWRcbmZ1bmN0aW9uIGRpc2FibGVDZWxjaXVzRmFocmVuaGVpdEJ1dHRvblBvaW50ZXIoKSB7XG4gIGNvbnN0IGNlbHNpdXNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbHNpdXMtc3ltYm9sXCIpO1xuICBjb25zdCBmYWhyZW5oZWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYWhyZW5oZWl0LXN5bWJvbFwiKTtcbiAgY2Vsc2l1c0J1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZGlzYWJsZS1wb2ludGVyXCIpO1xuICBmYWhyZW5oZWl0QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJkaXNhYmxlLXBvaW50ZXJcIik7XG59XG5cbi8vSGFuZGxlcyB1c2VyIGxvY2F0aW9uIHNlYXJjaFxuZnVuY3Rpb24gaGFuZGxlR29CdXR0b24oKSB7XG4gIGxldCBsb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcbiAgaWYgKGxvY2F0aW9uLnZhbHVlLnRyaW0oKSA9PT0gXCJcIikge1xuICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIGxvY2F0aW9uXCIpO1xuICB9IGVsc2Uge1xuICAgIGZldGNoV2VhdGhlckZvcmVjYXN0KGxvY2F0aW9uLnZhbHVlKS50aGVuKHJlbmRlcldlYXRoZXJGb3JlY2FzdERvbSk7XG4gICAgbG9jYXRpb24udmFsdWUgPSBcIlwiO1xuICB9XG59XG5cbi8vT24gc3RhcnQgdXBcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGdldEN1cnJlbnRsb2NhdGlvbigpXG4gICAgLnRoZW4oKGNvb3JkcykgPT4gZ2V0Q3VycmVudENpdHkoLi4uY29vcmRzKSlcbiAgICAudGhlbihmZXRjaFdlYXRoZXJGb3JlY2FzdClcbiAgICAudGhlbihyZW5kZXJXZWF0aGVyRm9yZWNhc3REb20pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlIHdhcyBhbiBlcnJvciBpbml0aWFsaXNpbmdcIiwgZXJyb3IpO1xuICAgICAgZmV0Y2hXZWF0aGVyRm9yZWNhc3QoXCJMb25kb25cIikudGhlbihyZW5kZXJXZWF0aGVyRm9yZWNhc3REb20pO1xuICAgIH0pO1xufVxuXG4vL0FzeW5jIGZ1bmN0aW9uIHRoYXQgdXNlcyBicm93c2VyIGdlb2xvY2F0aW9uIHRvIGFjY2VzcyBsYXQsbG5nXG5mdW5jdGlvbiBnZXRDdXJyZW50bG9jYXRpb24oKSB7XG4gIHRvZ2dsZUxvYWRpbmdJY29uc09uRG9tKCk7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihyZXNvbHZlLCByZWplY3QpO1xuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY29uc3QgbGF0ID0gcmVzcG9uc2UuY29vcmRzLmxhdGl0dWRlO1xuICAgICAgY29uc3QgbG5nID0gcmVzcG9uc2UuY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgIHJldHVybiBbbGF0LCBsbmddO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSk7XG59XG5cbi8vQXN5bmMgZnVuY3Rpb24gdGhhdHMgdXNlcyBBUEkgdG8gcmV2ZXJzZSBsb29rdXAgY2l0eSBmcm9tIGxhdCxsbmdcbmZ1bmN0aW9uIGdldEN1cnJlbnRDaXR5KGxhdCwgbG5nKSB7XG4gIHJldHVybiBmZXRjaChgaHR0cHM6Ly9nZW9jb2RlLnh5ei8ke2xhdH0sJHtsbmd9P2dlb2l0PWpzb25gKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouY2l0eSA9PT0gXCJUaHJvdHRsZWQhIFNlZSBnZW9jb2RlLnh5ei9wcmljaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VvY29kZSBsb29rIHVwIHRocm90dGxlZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYmouY2l0eTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjYXVnaHQgd2hlbiBmZXRjaGluZyBjb29yZHNcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIFwiTG9uZG9uXCI7XG4gICAgfSk7XG59XG5cbi8vQXN5bmMgZnVuY3Rpb24gdGhhdHMgdXNlcyBBUEkgdG8gbG9va3VwIHdlYXRoZXIgb2JqZWN0IGZvciBjaXR5XG5mdW5jdGlvbiBmZXRjaFdlYXRoZXJGb3JlY2FzdChsb2NhdGlvbikge1xuICBjb25zdCBBUElfS0VZID0gXCIwMWUxNjk1NWE3NTE0MjhhYTQwMTQxNzE1MjQxOTA2XCI7XG4gIGNvbnN0IHVybCA9IGBodHRwOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/cT0ke2xvY2F0aW9ufSZrZXk9JHtBUElfS0VZfSZkYXlzPTNgO1xuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IhIHN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oKHdlYXRoZXJPYmopID0+IHtcbiAgICAgIHJldHVybiB3ZWF0aGVyT2JqO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgSFRUUGAsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0pO1xufVxuXG4vL1JlbmRlcnMgd2VhdGhlciBkYXRhIHRvIERvbVxuZnVuY3Rpb24gcmVuZGVyV2VhdGhlckZvcmVjYXN0RG9tKHdlYXRoZXJPYmopIHtcbiAgY29uc3QgbG9hZGluZ0ltYWdlRXhpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2FkZXItdGV4dFwiKSAhPT0gbnVsbDtcbiAgaWYgKCFsb2FkaW5nSW1hZ2VFeGlzdHMpIHtcbiAgICByZW1vdmVXZWF0aGVyRGF0YURvbSgpO1xuICAgIHRvZ2dsZUxvYWRpbmdJY29uc09uRG9tKCk7XG4gIH1cbiAgdG9nZ2xlTG9hZGluZ0ljb25zT2ZmRG9tKCk7XG4gIGNvbnN0IHRvZ2dsZVBvc2l0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLWZhci10b2dnbGVcIik7XG4gIGNvbnN0IHRlbXBTY2FsZSA9IHRvZ2dsZVBvc2l0aW9uLmNsYXNzTGlzdC5jb250YWlucyhcInRvZ2dsZS11cFwiKSA/IFwiY1wiIDogXCJmXCI7XG4gIGNvbnN0IGNpdHkgPSB3ZWF0aGVyT2JqLmxvY2F0aW9uLm5hbWU7XG4gIGNvbnN0IGNvdW50cnkgPSB3ZWF0aGVyT2JqLmxvY2F0aW9uLmNvdW50cnk7XG4gIGNvbnN0IGZvcmVjYXN0ID0gd2VhdGhlck9iai5mb3JlY2FzdC5mb3JlY2FzdGRheTtcbiAgY29uc3QgdG9kYXlzV2VhdGhlckljb24gPSBgaHR0cHM6JHtmb3JlY2FzdFswXS5kYXkuY29uZGl0aW9uLmljb259YDtcblxuICBmb3JlY2FzdC5mb3JFYWNoKChkYXksIGluZGV4KSA9PiB7XG4gICAgY29uc3QgYXZlcmFnZVRlbXAgPSBkYXkuZGF5W2Bhdmd0ZW1wXyR7dGVtcFNjYWxlfWBdO1xuICAgIGNvbnN0IHdlYXRoZXJJY29uID0gYGh0dHBzOiR7ZGF5LmRheS5jb25kaXRpb24uaWNvbn1gO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZGF5LmRheS5jb25kaXRpb24udGV4dDtcbiAgICBjb25zdCBkYXlJbmRleCA9IGluZGV4O1xuICAgIHJlbmRlckRheURPTShhdmVyYWdlVGVtcCwgd2VhdGhlckljb24sIGRlc2NyaXB0aW9uLCBkYXlJbmRleCk7XG4gIH0pO1xuICByZW5kZXJMb2NhdGlvbkhlYWRpbmdEb20oY2l0eSwgY291bnRyeSk7XG4gIHJlbmRlckRhdGVIZWFkaW5nc0RvbSgpO1xuICByZW5kZXJCYWNrZ3JvdW5kV2VhdGhlclN3YXRjaCh0b2RheXNXZWF0aGVySWNvbik7XG59XG5cbi8vUmVuZGVyIG9uZSBkYXlzIHdlYXRoZXIgZGV0YWlscyB0byBEb21cbmZ1bmN0aW9uIHJlbmRlckRheURPTSh0ZW1wZXJhdHVyZSwgaWNvbiwgZGVzY3JpcHRpb24sIGRheUluZGV4KSB7XG4gIGNvbnN0IGRheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VhdGhlci1jb250YWluZXJcIikuY2hpbGRyZW5bZGF5SW5kZXhdO1xuICBkYXkucXVlcnlTZWxlY3RvcihcIi50ZW1wZXJhdHVyZSBoMlwiKS50ZXh0Q29udGVudCA9IGAke3RlbXBlcmF0dXJlfcKwYDtcbiAgZGF5LnF1ZXJ5U2VsZWN0b3IoXCIud2VhdGhlci1pY29uXCIpLmNoaWxkcmVuWzBdLnNyYyA9IGljb247XG4gIGRheS5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItZGVzY3JpcHRpb24gaDZcIikudGV4dENvbnRlbnQgPSBkZXNjcmlwdGlvbjtcbn1cblxuLy9SZW5kZXIgbG9jYXRpb24gaGVhZGluZ1xuZnVuY3Rpb24gcmVuZGVyTG9jYXRpb25IZWFkaW5nRG9tKGNpdHksIGNvdW50cnkpIHtcbiAgY29uc3QgbG9jYXRpb25IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1oZWFkZXJcIik7XG4gIGxvY2F0aW9uSGVhZGluZy50ZXh0Q29udGVudCA9IGAke2NpdHl9IC0gJHtjb3VudHJ5fWA7XG59XG5cbi8vUmV0dXJucyBkYXkvZGF0ZSBYIGRheXMgaW4gdG8gdGhlIGZ1dHVyZVxuZnVuY3Rpb24gZm9ybWF0RGF0ZUhlYWRpbmdzKGhvd01hbnlEYXlzSW5Ub1RoZUZ1dHVyZSkge1xuICBjb25zdCBkYXlzT2ZXZWVrID0gW1xuICAgIFwiU3VuZGF5XCIsXG4gICAgXCJNb25kYXlcIixcbiAgICBcIlR1ZXNkYXlcIixcbiAgICBcIldlZG5lc2RheVwiLFxuICAgIFwiVGh1cnNkYXlcIixcbiAgICBcIkZyaWRheVwiLFxuICAgIFwiU2F0dXJkYXlcIixcbiAgXTtcblxuICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xuICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgaG93TWFueURheXNJblRvVGhlRnV0dXJlKTtcbiAgY29uc3QgZGF5TmFtZSA9IGRheXNPZldlZWtbZGF5LmdldERheSgpXTtcbiAgY29uc3QgZGF0ZSA9IGFkZE9yZGluYWxOdW1lclN1ZmZpeChkYXkuZ2V0RGF0ZSgpKTtcblxuICByZXR1cm4gYCR7ZGF5TmFtZX0gJHtkYXRlfWA7XG59XG5cbi8vQWRkcyBjb3JyZWN0IG9yZGluYWwgbnVtYmVyIHN1ZmZpeCB0byBudW1iZXJcbmZ1bmN0aW9uIGFkZE9yZGluYWxOdW1lclN1ZmZpeChudW1iZXIpIHtcbiAgY29uc3QgYXJyYXkgPSBTdHJpbmcobnVtYmVyKS5zcGxpdChcIlwiKTtcbiAgbGV0IG51bWJlckFuZFN1ZmZpeDtcbiAgY29uc3QgbGFzdE51bWJlckluQXJyYXkgPSBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgaWYgKGxhc3ROdW1iZXJJbkFycmF5ID09PSBcIjFcIikge1xuICAgIG51bWJlckFuZFN1ZmZpeCA9IGFycmF5LmpvaW4oXCJcIikgKyBcInN0XCI7XG4gIH0gZWxzZSBpZiAobGFzdE51bWJlckluQXJyYXkgPT09IFwiMlwiKSB7XG4gICAgbnVtYmVyQW5kU3VmZml4ID0gYXJyYXkuam9pbihcIlwiKSArIFwibmRcIjtcbiAgfSBlbHNlIGlmIChsYXN0TnVtYmVySW5BcnJheSA9PT0gXCIzXCIpIHtcbiAgICBudW1iZXJBbmRTdWZmaXggPSBhcnJheS5qb2luKFwiXCIpICsgXCJyZFwiO1xuICB9IGVsc2Uge1xuICAgIG51bWJlckFuZFN1ZmZpeCA9IGFycmF5LmpvaW4oXCJcIikgKyBcInRoXCI7XG4gIH1cbiAgcmV0dXJuIG51bWJlckFuZFN1ZmZpeDtcbn1cblxuLy9SZW5kZXJzIGRhdGUgaGVhZGluZ3MgdG8gRG9tXG5mdW5jdGlvbiByZW5kZXJEYXRlSGVhZGluZ3NEb20oKSB7XG4gIGNvbnN0IGRhdGVIZWFkaW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGF5IGg1XCIpO1xuICBkYXRlSGVhZGluZ3MuZm9yRWFjaCgoaGVhZGluZywgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgaGVhZGluZy50ZXh0Q29udGVudCA9IFwiVG9kYXlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGluZy50ZXh0Q29udGVudCA9IGZvcm1hdERhdGVIZWFkaW5ncyhpbmRleCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy9Ub2dnbGVzIHJlbmRlciBiZXR3ZWVuIEZhaHJlbmhlaXQgYW5kIENlbHNpdXMgaW4gRG9tLlxuZnVuY3Rpb24gdG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20oKSB7XG4gIHRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0U2VsZWN0ZWREb20oKTtcbiAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZWxzaXVzLWZhci10b2dnbGVcIik7XG4gIGNvbnN0IHRlbXBlcmF0dXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGVtcC1udW1iZXJcIik7XG4gIGNvbnN0IGN1cnJlbnRTY2FsZSA9IHRvZ2dsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b2dnbGUtdXBcIilcbiAgICA/IFwiY2Vsc2l1c1wiXG4gICAgOiBcImZhaHJlbmhlaXRcIjtcbiAgdG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoXCJ0b2dnbGUtdXBcIik7XG4gIHRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKFwidG9nZ2xlLWRvd25cIik7XG5cbiAgdGVtcGVyYXR1cmVzLmZvckVhY2goKHRlbXApID0+IHtcbiAgICBsZXQgdGVtcGVyYXR1cmVXaXRob3V0RGVncmVlU3ltYm9sID0gcmVtb3ZlRGVncmVlU3ltYm9sKHRlbXAudGV4dENvbnRlbnQpO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSB0b2dnbGVWYWx1ZUNlbHNpdXNGYWhyZW5oZWl0KFxuICAgICAgdGVtcGVyYXR1cmVXaXRob3V0RGVncmVlU3ltYm9sLFxuICAgICAgY3VycmVudFNjYWxlXG4gICAgKTtcbiAgfSk7XG59XG5cbi8vQ29udmVydHMgYmV0d2VlbiBGYWhyZW5oZWl0IGFuZCBDZWxzaXVzXG5mdW5jdGlvbiB0b2dnbGVWYWx1ZUNlbHNpdXNGYWhyZW5oZWl0KHZhbHVlLCB0eXBlKSB7XG4gIGNvbnN0IENFTFNJVVNfVE9fRkFIUkVOSEVJVF9GQUNUT1IgPSA5IC8gNTtcbiAgY29uc3QgRkFIUkVOSEVJVF9UT19DRUxTSVVTX0ZBQ1RPUiA9IDUgLyA5O1xuICBjb25zdCBGQUhSRU5IRUlUX0ZSRUVaSU5HX1BPSU5UID0gMzI7XG4gIGxldCB2YWx1ZUNvbnZlcnRlZDtcblxuICBpZiAodHlwZSA9PT0gXCJmYWhyZW5oZWl0XCIpIHtcbiAgICB2YWx1ZUNvbnZlcnRlZCA9XG4gICAgICAoTnVtYmVyKHZhbHVlKSAtIEZBSFJFTkhFSVRfRlJFRVpJTkdfUE9JTlQpICpcbiAgICAgIEZBSFJFTkhFSVRfVE9fQ0VMU0lVU19GQUNUT1I7XG4gIH0gZWxzZSB7XG4gICAgdmFsdWVDb252ZXJ0ZWQgPVxuICAgICAgTnVtYmVyKHZhbHVlKSAqIENFTFNJVVNfVE9fRkFIUkVOSEVJVF9GQUNUT1IgKyBGQUhSRU5IRUlUX0ZSRUVaSU5HX1BPSU5UO1xuICB9XG4gIHJldHVybiBhZGREZWdyZWVTeW1ib2wodmFsdWVDb252ZXJ0ZWQudG9GaXhlZCgxKSk7XG59XG5cbi8vQWRkcyBkZWdyZWUgc3ltYm9sIHRvIHN0cmluZ1xuZnVuY3Rpb24gYWRkRGVncmVlU3ltYm9sKHN0cikge1xuICBsZXQgc3RyQXJyYXkgPSBzdHIuc3BsaXQoXCJcIik7XG4gIHN0ckFycmF5LnB1c2goXCLCsFwiKTtcbiAgbGV0IHN0cmluZ1dpdGhEZWdyZWVTeW1ib2wgPSBzdHJBcnJheS5qb2luKFwiXCIpO1xuICByZXR1cm4gc3RyaW5nV2l0aERlZ3JlZVN5bWJvbDtcbn1cblxuLy9SZW1vdmVzIGRlZ3JlZSBzeW1ib2wgZnJvbSBzdHJpbmdcbmZ1bmN0aW9uIHJlbW92ZURlZ3JlZVN5bWJvbChzdHIpIHtcbiAgbGV0IHN0ckFycmF5ID0gc3RyLnNwbGl0KFwiXCIpO1xuICBzdHJBcnJheS5wb3AoKTtcbiAgbGV0IHN0cmluZ1dpdGhvdXREZWdyZWVTeW1ib2wgPSBzdHJBcnJheS5qb2luKFwiXCIpO1xuICByZXR1cm4gc3RyaW5nV2l0aG91dERlZ3JlZVN5bWJvbDtcbn1cblxuLy9Ub2dnbGVzIGxvYWRpbmcgaWNvbnMgb2ZmIERvbVxuZnVuY3Rpb24gdG9nZ2xlTG9hZGluZ0ljb25zT2ZmRG9tKCkge1xuICBjb25zdCBsb2FkZXJJY29ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubG9hZGVyXCIpO1xuICBjb25zdCBsb2NhdGlvbkhlYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWhlYWRlclwiKTtcbiAgbG9jYXRpb25IZWFkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkZXItdGV4dFwiKTtcbiAgbG9hZGVySWNvbnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG4vL1RvZ2dsZXMgbG9hZGluZyBpY29ucyBvbiBEb21cbmZ1bmN0aW9uIHRvZ2dsZUxvYWRpbmdJY29uc09uRG9tKCkge1xuICBjb25zdCB3ZWF0aGVySWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItaWNvbiwgLnRlbXAtbnVtYmVyXCIpO1xuICBjb25zdCBsb2NhdGlvbkhlYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWhlYWRlclwiKTtcbiAgbG9jYXRpb25IZWFkaW5nLmNsYXNzTGlzdC5hZGQoXCJsb2FkZXItdGV4dFwiKTtcbiAgd2VhdGhlckljb25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwibG9hZGVyXCIpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfSk7XG59XG5cbi8vUmVtb3ZlcyBhbGwgd2VhdGhlciBkYXRhIGZyb20gRG9tXG5mdW5jdGlvbiByZW1vdmVXZWF0aGVyRGF0YURvbSgpIHtcbiAgY29uc3QgZWxlbWVudHNUb0NsZWFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICBcIi53ZWF0aGVyLWRlc2NyaXB0aW9uIGg2LC50ZW1wZXJhdHVyZSBoMiwubG9jYXRpb24taGVhZGVyLC53ZWF0aGVyLWljb24gaW1nXCJcbiAgKTtcbiAgZWxlbWVudHNUb0NsZWFyLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIklNR1wiKSB7XG4gICAgICBlbGVtZW50LnNyYyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vUmVuZGVycyBzZWxlY3RlZCBzY2FsZSB0byBiZSBoaWdobGlnaHRlZCBpbiBEb21cbmZ1bmN0aW9uIHRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0U2VsZWN0ZWREb20oKSB7XG4gIGNvbnN0IGNlbHNpdXNTeW1ib2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbHNpdXMtc3ltYm9sXCIpO1xuICBjb25zdCBmYWhyZW5oZWl0U3ltYm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYWhyZW5oZWl0LXN5bWJvbFwiKTtcbiAgY2Vsc2l1c1N5bWJvbC5jbGFzc0xpc3QudG9nZ2xlKFwic2NhbGUtc3ltYm9sLXNlbGVjdGVkXCIpO1xuICBmYWhyZW5oZWl0U3ltYm9sLmNsYXNzTGlzdC50b2dnbGUoXCJzY2FsZS1zeW1ib2wtc2VsZWN0ZWRcIik7XG59XG5cbi8vUmVuZGVycyBiYWNrZ3JvdW5kIHN3YXRjaCBwYXR0ZXJuIERvbVxuZnVuY3Rpb24gcmVuZGVyQmFja2dyb3VuZFdlYXRoZXJTd2F0Y2godXJsKSB7XG4gIGNvbnN0IHdlYXRoZXJTd2F0Y2hMYXllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIud2VhdGhlci1zd2F0Y2gtb3BhY2l0eS1sYXllclwiXG4gICk7XG4gIHdlYXRoZXJTd2F0Y2hMYXllci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dXJsfSlgO1xufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4vZm9udHMvTWVycml3ZWF0aGVyU2Fucy50dGZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZvbnQtZmFtaWx5OiBNZXJyaXdlYXRoZXI7XG59XG5cbkBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogXCJNZXJyaXdlYXRoZXJcIjtcbiAgc3JjOiBsb2NhbChcIk1lcnJpd2VhdGhlciBSZWd1bGFyXCIpLCB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSk7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG59XG5cbjpyb290IHtcbiAgLS1tYWluLXByb2plY3RzLWNvbG9yOiByZ2IoMjI5LCAyNDMsIDI0Nik7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtaW4taGVpZ2h0OiA0NjVweDtcbn1cblxuLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZW5kO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgYWxpZ24tc2VsZjogYmFzZWxpbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcbn1cblxuLmZvb3Rlci1pbmZvIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaGVpZ2h0OiA2MHB4O1xuICB3aWR0aDogMTAwdnc7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xufVxuXG4uaGVhZGVyIGgxIHtcbiAgcGFkZGluZy1sZWZ0OiAzMHB4O1xufVxuXG5ib2R5IHtcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtaW4td2lkdGg6IDU1MHB4O1xuICBtaW4taGVpZ2h0OiAzNTBweDtcbn1cblxuLmFwcCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHdpZHRoOiA0MHZ3O1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyAqL1xuICBtaW4td2lkdGg6IDUwMHB4O1xuICBhc3BlY3QtcmF0aW86IDE1Lzk7XG4gIGJveC1zaGFkb3c6IHJnYmEoNTAsIDUwLCA5MywgMC4yNSkgMHB4IDUwcHggMTAwcHggLTIwcHgsXG4gICAgcmdiYSgwLCAwLCAwLCAwLjMpIDBweCAzMHB4IDYwcHggLTMwcHgsXG4gICAgcmdiYSgxMCwgMzcsIDY0LCAwLjM1KSAwcHggLTJweCA2cHggMHB4IGluc2V0O1xufVxuXG4uZm9vdGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMjUlO1xuICAvKiBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7ICovXG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigzMywgMzYsIDEzMyk7XG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDVweDtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDVweDtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDE4NCwgMTg0LCAxODYpOyAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzMsIDM2LCAxMzMpO1xufVxuXG4uYXBwLWJvZHkge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiA3NSU7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigxODYsIDE4NCwgMTg0KTtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNXB4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmctdG9wOiAzNXB4O1xuICBwYWRkaW5nLWJvdHRvbTogMTVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xufVxuXG4ud2VhdGhlci1zd2F0Y2gtb3BhY2l0eS1sYXllciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYmFja2dyb3VuZC1zaXplOiBhdXRvO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG9wYWNpdHk6IDAuMztcbiAgdG9wOiAwcHg7XG4gIHJpZ2h0OiAwcHg7XG4gIGJvdHRvbTogMHB4O1xuICBsZWZ0OiAwcHg7XG59XG5cbi5zZWFyY2gtZ28ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgLyogYm9yZGVyOiAxcHggc29saWQgcmdiKDcsIDcsIDcpOyAqL1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGhlaWdodDogNjAlO1xuICB3aWR0aDogNzAlO1xuICBwYWRkaW5nOiAwIDVweCAwIDVweDtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzMSwgMTMwLCAxMzApOyAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XG59XG5cbmlucHV0IHtcbiAgaGVpZ2h0OiA1MCU7XG4gIHdpZHRoOiA3NSU7XG4gIHBhZGRpbmc6IDAgNXB4O1xufVxuXG5idXR0b24ge1xuICBoZWlnaHQ6IDU1JTtcbiAgd2lkdGg6IDE1JTtcbn1cblxuLndlYXRoZXItY29udGFpbmVyIHtcbiAgei1pbmRleDogMjtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcbiAgZ2FwOiA1cHg7XG4gIHdpZHRoOiA3MCU7XG4gIG1pbi1oZWlnaHQ6IDE5MnB4O1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMjA1LCAyMDMsIDIwMyk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xufVxuLmxvY2F0aW9uLWhlYWRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAtNSU7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nOiA1cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyMDUsIDIwMywgMjAzKTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICB6LWluZGV4OiAyO1xufVxuXG4uY2Vsc2l1cy1mYXItdG9nZ2xlIHtcbiAgei1pbmRleDogMjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxNCU7XG4gIHJpZ2h0OiAzNHB4O1xuICB3aWR0aDogMTZweDtcbiAgaGVpZ2h0OiAzMHB4O1xuICBib3JkZXI6IHNvbGlkIHJnYigxMzEsIDEzMCwgMTMwKSAxcHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgcGFkZGluZzogMnB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjMyLCAyMjksIDIyOSk7XG59XG5cbi50b2dnbGUtY2lyY2xlIHtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICB3aWR0aDogMTJweDtcbiAgaGVpZ2h0OiAxMnB4O1xuICBib3JkZXI6IHNvbGlkIHJnYigxNjMsIDE2MSwgMTYxKSAxcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzMSwgMTMwLCAxMzApO1xufVxuXG4udG9kYXksXG4udG9tbW9yb3csXG4ub3Zlcm1vcnJvdyB7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMmZyIDFmciAxZnI7XG59XG5cbi5kYXksXG4ud2VhdGhlci1kZXNjcmlwdGlvbiB7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7ICovXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5kYXk6YWZ0ZXIsXG4ud2VhdGhlci1kZXNjcmlwdGlvbjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJhY2tncm91bmQ6IGJsYWNrO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDUlO1xuICBoZWlnaHQ6IDFweDtcbiAgd2lkdGg6IDkwJTtcbn1cblxuLndlYXRoZXItZGVzY3JpcHRpb246YWZ0ZXIge1xuICB0b3A6IDVweDtcbn1cblxuLmRheTphZnRlciB7XG4gIGJvdHRvbTogNXB4O1xufVxuXG4ud2VhdGhlci1pY29uLFxuLnRlbXBlcmF0dXJlIHtcbiAgLyogYm9yZGVyOiAxcHggc29saWQgZ3JleTsgKi9cbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xufVxuXG4uZGF5IHtcbiAgbWluLWhlaWdodDogMTRweDtcbn1cblxuLnRvZ2dsZS11cCB7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbn1cblxuLnRvZ2dsZS1kb3duIHtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbn1cblxuLmZhaHJlbmhlaXQtc3ltYm9sLFxuLmNlbHNpdXMtc3ltYm9sIHtcbiAgd2lkdGg6IDI4cHg7XG4gIGhlaWdodDogMjBweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBjb2xvcjogcmdiKDE2MywgMTYxLCAxNjEpO1xuICBib3JkZXItcmFkaXVzOiAxNXB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDFweCBncmV5IHNvbGlkO1xuICBvcGFjaXR5OiAwLjc7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmRpc2FibGUtcG9pbnRlciB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBjdXJzb3I6IG5vbmU7XG59XG5cbi5zY2FsZS1zeW1ib2wtc2VsZWN0ZWQge1xuICAvKiBib3JkZXI6IDFweCBncmV5IHNvbGlkOyAqL1xuICBib3gtc2hhZG93OiAwcHggMnB4IGdyZXk7XG4gIG9wYWNpdHk6IDE7XG59XG5cbi5mYWhyZW5oZWl0LXN5bWJvbCB7XG4gIGJvdHRvbTogLTIwcHg7XG4gIGxlZnQ6IDE1cHg7XG59XG5cbi5jZWxzaXVzLXN5bWJvbCB7XG4gIHRvcDogLTE1cHg7XG4gIGxlZnQ6IDE1cHg7XG59XG5cbi5sb2FkZXIge1xuICB3aWR0aDogMzFweDtcbiAgLS1mOiA4cHg7XG4gIGFzcGVjdC1yYXRpbzogMTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBwYWRkaW5nOiAxcHg7XG4gIGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KCMwMDAwIDEwJSwgIzMzNmNmMCkgY29udGVudC1ib3g7XG4gIG1hc2s6IHJlcGVhdGluZy1jb25pYy1ncmFkaWVudCgjMDAwMCAwZGVnLCAjMDAwIDFkZWcgMjBkZWcsICMwMDAwIDIxZGVnIDM2ZGVnKSxcbiAgICByYWRpYWwtZ3JhZGllbnQoXG4gICAgICBmYXJ0aGVzdC1zaWRlLFxuICAgICAgIzAwMDAgY2FsYygxMDAlIC0gdmFyKC0tZikgLSAxcHgpLFxuICAgICAgIzAwMCBjYWxjKDEwMCUgLSB2YXIoLS1mKSlcbiAgICApO1xuICBtYXNrLWNvbXBvc2l0ZTogZGVzdGluYXRpb24taW47XG4gIG1hc2stY29tcG9zaXRlOiBpbnRlcnNlY3Q7XG4gIGFuaW1hdGlvbjogbDQgMXMgaW5maW5pdGUgc3RlcHMoMTApO1xufVxuXG5Aa2V5ZnJhbWVzIGw0IHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDF0dXJuKTtcbiAgfVxufVxuXG4ubG9hZGVyLXRleHQge1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDE2cHg7XG4gIGFuaW1hdGlvbjogbDEgMXMgbGluZWFyIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cbi5sb2FkZXItdGV4dDpiZWZvcmUge1xuICBjb250ZW50OiBcIkxvYWRpbmcuLi5cIjtcbn1cblxuQGtleWZyYW1lcyBsMSB7XG4gIHRvIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG5cbmJ1dHRvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuYTpsaW5rIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG5hIHtcbiAgY29sb3I6ICMwMDA7XG59XG5cbi5oZWFkZXIgZGl2IHtcbiAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0IDJzIGVhc2UgZm9yd2FyZHM7XG59XG5cbkBrZXlmcmFtZXMgc2xpZGUtbGVmdCB7XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODV2dyk7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDE2MDBweCkge1xuICAuaGVhZGVyIGRpdiB7XG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTE2MDAgMnMgZWFzZSBmb3J3YXJkcztcbiAgfVxuXG4gIC5oZWFkZXIgZGl2IGgxIHtcbiAgICBmb250LXNpemU6IDEuNWVtO1xuICB9XG5cbiAgQGtleWZyYW1lcyBzbGlkZS1sZWZ0LTE2MDAge1xuICAgIDEwMCUge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC04MHZ3KTtcbiAgICB9XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc4MHB4KSB7XG4gIC5oZWFkZXIgZGl2IHtcbiAgICBhbmltYXRpb246IHNsaWRlLWxlZnQtNzgwIDJzIGVhc2UgZm9yd2FyZHM7XG4gIH1cblxuICAuaGVhZGVyIGRpdiBoMSB7XG4gICAgZm9udC1zaXplOiAxLjVlbTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC03ODAge1xuICAgIDEwMCUge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC03MHZ3KTtcbiAgICB9XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDMwMHB4KSB7XG4gIC5oZWFkZXIgZGl2IHtcbiAgICBmb250LXNpemU6IDEuMmVtO1xuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0zMDAgMnMgZWFzZSBmb3J3YXJkcztcbiAgfVxuICAuaGVhZGVyIGRpdiBoMSB7XG4gICAgZm9udC1zaXplOiAxLjJlbTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0zMDAge1xuICAgIDEwMCUge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01dncpO1xuICAgIH1cbiAgfVxufVxuXG4uaGVhZGVyIGRpdiBoMSB7XG4gIG9wYWNpdHk6IDMwJTtcbn1cblxuLmhlYWRlciBkaXYge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uc3VuLWxvZ28ge1xuICBmaWx0ZXI6IGJyaWdodG5lc3MoNTAlKTtcbiAgei1pbmRleDogMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogNjRweDtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogLTM1cHg7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNl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VTtFQUNaO0FBQ0Y7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0U7SUFDRSw0QkFBNEI7RUFDOUI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsMkNBQTJDO0VBQzdDOztFQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0U7TUFDRSw0QkFBNEI7SUFDOUI7RUFDRjtBQUNGOztBQUVBO0VBQ0U7SUFDRSwwQ0FBMEM7RUFDNUM7O0VBRUE7SUFDRSxnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRTtNQUNFLDRCQUE0QjtJQUM5QjtFQUNGO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLGdCQUFnQjtJQUNoQiwwQ0FBMEM7RUFDNUM7RUFDQTtJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFO01BQ0UsMkJBQTJCO0lBQzdCO0VBQ0Y7QUFDRjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDVixrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFNBQVM7RUFDVCxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGZvbnQtZmFtaWx5OiBNZXJyaXdlYXRoZXI7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNZXJyaXdlYXRoZXJcXFwiO1xcbiAgc3JjOiBsb2NhbChcXFwiTWVycml3ZWF0aGVyIFJlZ3VsYXJcXFwiKSwgdXJsKFxcXCIuL2ZvbnRzL01lcnJpd2VhdGhlclNhbnMudHRmXFxcIik7XFxuICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG46cm9vdCB7XFxuICAtLW1haW4tcHJvamVjdHMtY29sb3I6IHJnYigyMjksIDI0MywgMjQ2KTtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWluLWhlaWdodDogNDY1cHg7XFxufVxcblxcbi5oZWFkZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogZW5kO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYWxpZ24tc2VsZjogYmFzZWxpbmU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XFxufVxcblxcbi5mb290ZXItaW5mbyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAyMjcsIDIzMik7XFxufVxcblxcbi5oZWFkZXIgaDEge1xcbiAgcGFkZGluZy1sZWZ0OiAzMHB4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1pbi13aWR0aDogNTUwcHg7XFxuICBtaW4taGVpZ2h0OiAzNTBweDtcXG59XFxuXFxuLmFwcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHdpZHRoOiA0MHZ3O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgYmxhY2s7ICovXFxuICBtaW4td2lkdGg6IDUwMHB4O1xcbiAgYXNwZWN0LXJhdGlvOiAxNS85O1xcbiAgYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDkzLCAwLjI1KSAwcHggNTBweCAxMDBweCAtMjBweCxcXG4gICAgcmdiYSgwLCAwLCAwLCAwLjMpIDBweCAzMHB4IDYwcHggLTMwcHgsXFxuICAgIHJnYmEoMTAsIDM3LCA2NCwgMC4zNSkgMHB4IC0ycHggNnB4IDBweCBpbnNldDtcXG59XFxuXFxuLmZvb3RlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgaGVpZ2h0OiAyNSU7XFxuICAvKiBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7ICovXFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMzMsIDM2LCAxMzMpO1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4O1xcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDVweDtcXG4gIC8qIGJhY2tncm91bmQtY29sb3I6IHJnYigxODQsIDE4NCwgMTg2KTsgKi9cXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigzMywgMzYsIDEzMyk7XFxufVxcblxcbi5hcHAtYm9keSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgaGVpZ2h0OiA3NSU7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTg2LCAxODQsIDE4NCk7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1cHg7XFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZy10b3A6IDM1cHg7XFxuICBwYWRkaW5nLWJvdHRvbTogMTVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDIyNywgMjMyKTtcXG59XFxuXFxuLndlYXRoZXItc3dhdGNoLW9wYWNpdHktbGF5ZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYmFja2dyb3VuZC1zaXplOiBhdXRvO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMC4zO1xcbiAgdG9wOiAwcHg7XFxuICByaWdodDogMHB4O1xcbiAgYm90dG9tOiAwcHg7XFxuICBsZWZ0OiAwcHg7XFxufVxcblxcbi5zZWFyY2gtZ28ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIHJnYig3LCA3LCA3KTsgKi9cXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGhlaWdodDogNjAlO1xcbiAgd2lkdGg6IDcwJTtcXG4gIHBhZGRpbmc6IDAgNXB4IDAgNXB4O1xcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzMSwgMTMwLCAxMzApOyAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMjI3LCAyMzIpO1xcbn1cXG5cXG5pbnB1dCB7XFxuICBoZWlnaHQ6IDUwJTtcXG4gIHdpZHRoOiA3NSU7XFxuICBwYWRkaW5nOiAwIDVweDtcXG59XFxuXFxuYnV0dG9uIHtcXG4gIGhlaWdodDogNTUlO1xcbiAgd2lkdGg6IDE1JTtcXG59XFxuXFxuLndlYXRoZXItY29udGFpbmVyIHtcXG4gIHotaW5kZXg6IDI7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogNXB4O1xcbiAgd2lkdGg6IDcwJTtcXG4gIG1pbi1oZWlnaHQ6IDE5MnB4O1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDIwNSwgMjAzLCAyMDMpO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xcbn1cXG4ubG9jYXRpb24taGVhZGVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogLTUlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA1LCAyMDMsIDIwMyk7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uY2Vsc2l1cy1mYXItdG9nZ2xlIHtcXG4gIHotaW5kZXg6IDI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMTQlO1xcbiAgcmlnaHQ6IDM0cHg7XFxuICB3aWR0aDogMTZweDtcXG4gIGhlaWdodDogMzBweDtcXG4gIGJvcmRlcjogc29saWQgcmdiKDEzMSwgMTMwLCAxMzApIDFweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIHBhZGRpbmc6IDJweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMzIsIDIyOSwgMjI5KTtcXG59XFxuXFxuLnRvZ2dsZS1jaXJjbGUge1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgd2lkdGg6IDEycHg7XFxuICBoZWlnaHQ6IDEycHg7XFxuICBib3JkZXI6IHNvbGlkIHJnYigxNjMsIDE2MSwgMTYxKSAxcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTMxLCAxMzAsIDEzMCk7XFxufVxcblxcbi50b2RheSxcXG4udG9tbW9yb3csXFxuLm92ZXJtb3Jyb3cge1xcbiAgLyogYm9yZGVyOiAxcHggc29saWQgZ3JleTsgKi9cXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAyZnIgMWZyIDFmcjtcXG59XFxuXFxuLmRheSxcXG4ud2VhdGhlci1kZXNjcmlwdGlvbiB7XFxuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmRheTphZnRlcixcXG4ud2VhdGhlci1kZXNjcmlwdGlvbjphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGJhY2tncm91bmQ6IGJsYWNrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogNSU7XFxuICBoZWlnaHQ6IDFweDtcXG4gIHdpZHRoOiA5MCU7XFxufVxcblxcbi53ZWF0aGVyLWRlc2NyaXB0aW9uOmFmdGVyIHtcXG4gIHRvcDogNXB4O1xcbn1cXG5cXG4uZGF5OmFmdGVyIHtcXG4gIGJvdHRvbTogNXB4O1xcbn1cXG5cXG4ud2VhdGhlci1pY29uLFxcbi50ZW1wZXJhdHVyZSB7XFxuICAvKiBib3JkZXI6IDFweCBzb2xpZCBncmV5OyAqL1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5kYXkge1xcbiAgbWluLWhlaWdodDogMTRweDtcXG59XFxuXFxuLnRvZ2dsZS11cCB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi50b2dnbGUtZG93biB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbn1cXG5cXG4uZmFocmVuaGVpdC1zeW1ib2wsXFxuLmNlbHNpdXMtc3ltYm9sIHtcXG4gIHdpZHRoOiAyOHB4O1xcbiAgaGVpZ2h0OiAyMHB4O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgY29sb3I6IHJnYigxNjMsIDE2MSwgMTYxKTtcXG4gIGJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMXB4IGdyZXkgc29saWQ7XFxuICBvcGFjaXR5OiAwLjc7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5kaXNhYmxlLXBvaW50ZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBjdXJzb3I6IG5vbmU7XFxufVxcblxcbi5zY2FsZS1zeW1ib2wtc2VsZWN0ZWQge1xcbiAgLyogYm9yZGVyOiAxcHggZ3JleSBzb2xpZDsgKi9cXG4gIGJveC1zaGFkb3c6IDBweCAycHggZ3JleTtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbi5mYWhyZW5oZWl0LXN5bWJvbCB7XFxuICBib3R0b206IC0yMHB4O1xcbiAgbGVmdDogMTVweDtcXG59XFxuXFxuLmNlbHNpdXMtc3ltYm9sIHtcXG4gIHRvcDogLTE1cHg7XFxuICBsZWZ0OiAxNXB4O1xcbn1cXG5cXG4ubG9hZGVyIHtcXG4gIHdpZHRoOiAzMXB4O1xcbiAgLS1mOiA4cHg7XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBwYWRkaW5nOiAxcHg7XFxuICBiYWNrZ3JvdW5kOiBjb25pYy1ncmFkaWVudCgjMDAwMCAxMCUsICMzMzZjZjApIGNvbnRlbnQtYm94O1xcbiAgbWFzazogcmVwZWF0aW5nLWNvbmljLWdyYWRpZW50KCMwMDAwIDBkZWcsICMwMDAgMWRlZyAyMGRlZywgIzAwMDAgMjFkZWcgMzZkZWcpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoXFxuICAgICAgZmFydGhlc3Qtc2lkZSxcXG4gICAgICAjMDAwMCBjYWxjKDEwMCUgLSB2YXIoLS1mKSAtIDFweCksXFxuICAgICAgIzAwMCBjYWxjKDEwMCUgLSB2YXIoLS1mKSlcXG4gICAgKTtcXG4gIG1hc2stY29tcG9zaXRlOiBkZXN0aW5hdGlvbi1pbjtcXG4gIG1hc2stY29tcG9zaXRlOiBpbnRlcnNlY3Q7XFxuICBhbmltYXRpb246IGw0IDFzIGluZmluaXRlIHN0ZXBzKDEwKTtcXG59XFxuXFxuQGtleWZyYW1lcyBsNCB7XFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDF0dXJuKTtcXG4gIH1cXG59XFxuXFxuLmxvYWRlci10ZXh0IHtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBmb250LWZhbWlseTogTWVycml3ZWF0aGVyLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgYW5pbWF0aW9uOiBsMSAxcyBsaW5lYXIgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG4ubG9hZGVyLXRleHQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJMb2FkaW5nLi4uXFxcIjtcXG59XFxuXFxuQGtleWZyYW1lcyBsMSB7XFxuICB0byB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxufVxcblxcbmJ1dHRvbiB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbmE6bGluayB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbmEge1xcbiAgY29sb3I6ICMwMDA7XFxufVxcblxcbi5oZWFkZXIgZGl2IHtcXG4gIGFuaW1hdGlvbjogc2xpZGUtbGVmdCAycyBlYXNlIGZvcndhcmRzO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNsaWRlLWxlZnQge1xcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtODV2dyk7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAxNjAwcHgpIHtcXG4gIC5oZWFkZXIgZGl2IHtcXG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTE2MDAgMnMgZWFzZSBmb3J3YXJkcztcXG4gIH1cXG5cXG4gIC5oZWFkZXIgZGl2IGgxIHtcXG4gICAgZm9udC1zaXplOiAxLjVlbTtcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0xNjAwIHtcXG4gICAgMTAwJSB7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC04MHZ3KTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNzgwcHgpIHtcXG4gIC5oZWFkZXIgZGl2IHtcXG4gICAgYW5pbWF0aW9uOiBzbGlkZS1sZWZ0LTc4MCAycyBlYXNlIGZvcndhcmRzO1xcbiAgfVxcblxcbiAgLmhlYWRlciBkaXYgaDEge1xcbiAgICBmb250LXNpemU6IDEuNWVtO1xcbiAgfVxcblxcbiAgQGtleWZyYW1lcyBzbGlkZS1sZWZ0LTc4MCB7XFxuICAgIDEwMCUge1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNzB2dyk7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDMwMHB4KSB7XFxuICAuaGVhZGVyIGRpdiB7XFxuICAgIGZvbnQtc2l6ZTogMS4yZW07XFxuICAgIGFuaW1hdGlvbjogc2xpZGUtbGVmdC0zMDAgMnMgZWFzZSBmb3J3YXJkcztcXG4gIH1cXG4gIC5oZWFkZXIgZGl2IGgxIHtcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgc2xpZGUtbGVmdC0zMDAge1xcbiAgICAxMDAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTV2dyk7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuLmhlYWRlciBkaXYgaDEge1xcbiAgb3BhY2l0eTogMzAlO1xcbn1cXG5cXG4uaGVhZGVyIGRpdiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi5zdW4tbG9nbyB7XFxuICBmaWx0ZXI6IGJyaWdodG5lc3MoNTAlKTtcXG4gIHotaW5kZXg6IDE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogNjRweDtcXG4gIHRvcDogMTBweDtcXG4gIHJpZ2h0OiAtMzVweDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07Il0sIm5hbWVzIjpbImluaXQiLCJnb0J1dHRvbiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRvZ2dsZUJ1dHRvbiIsInVzZXJJbnB1dCIsImNlbHNpdXNGYWhyZW5oZWl0QnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhbmltYXRlZExvZ29EaXYiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlQ2Vsc2l1c0ZhaHJlbmhlaXREb20iLCJkaXNhYmxlQ2VsY2l1c0ZhaHJlbmhlaXRCdXR0b25Qb2ludGVyIiwiaGFuZGxlR29CdXR0b24iLCJmb3JFYWNoIiwiYnRuIiwiZXZlbnQiLCJrZXkiLCJoZWFkZXJMb2dvIiwic3VuTG9nbyIsInN0eWxlIiwiZmlsdGVyIiwib3BhY2l0eSIsImNlbHNpdXNCdXR0b24iLCJmYWhyZW5oZWl0QnV0dG9uIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwibG9jYXRpb24iLCJ2YWx1ZSIsInRyaW0iLCJhbGVydCIsImZldGNoV2VhdGhlckZvcmVjYXN0IiwidGhlbiIsInJlbmRlcldlYXRoZXJGb3JlY2FzdERvbSIsImdldEN1cnJlbnRsb2NhdGlvbiIsImNvb3JkcyIsImdldEN1cnJlbnRDaXR5IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJ0b2dnbGVMb2FkaW5nSWNvbnNPbkRvbSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJyZXNwb25zZSIsImxhdCIsImxhdGl0dWRlIiwibG5nIiwibG9uZ2l0dWRlIiwiZmV0Y2giLCJqc29uIiwib2JqIiwiY2l0eSIsIkVycm9yIiwiQVBJX0tFWSIsInVybCIsIm9rIiwic3RhdHVzIiwid2VhdGhlck9iaiIsImxvYWRpbmdJbWFnZUV4aXN0cyIsInJlbW92ZVdlYXRoZXJEYXRhRG9tIiwidG9nZ2xlTG9hZGluZ0ljb25zT2ZmRG9tIiwidG9nZ2xlUG9zaXRpb24iLCJ0ZW1wU2NhbGUiLCJjb250YWlucyIsIm5hbWUiLCJjb3VudHJ5IiwiZm9yZWNhc3QiLCJmb3JlY2FzdGRheSIsInRvZGF5c1dlYXRoZXJJY29uIiwiZGF5IiwiY29uZGl0aW9uIiwiaWNvbiIsImluZGV4IiwiYXZlcmFnZVRlbXAiLCJ3ZWF0aGVySWNvbiIsImRlc2NyaXB0aW9uIiwidGV4dCIsImRheUluZGV4IiwicmVuZGVyRGF5RE9NIiwicmVuZGVyTG9jYXRpb25IZWFkaW5nRG9tIiwicmVuZGVyRGF0ZUhlYWRpbmdzRG9tIiwicmVuZGVyQmFja2dyb3VuZFdlYXRoZXJTd2F0Y2giLCJ0ZW1wZXJhdHVyZSIsImNoaWxkcmVuIiwidGV4dENvbnRlbnQiLCJzcmMiLCJsb2NhdGlvbkhlYWRpbmciLCJmb3JtYXREYXRlSGVhZGluZ3MiLCJob3dNYW55RGF5c0luVG9UaGVGdXR1cmUiLCJkYXlzT2ZXZWVrIiwiRGF0ZSIsInNldERhdGUiLCJnZXREYXRlIiwiZGF5TmFtZSIsImdldERheSIsImRhdGUiLCJhZGRPcmRpbmFsTnVtZXJTdWZmaXgiLCJudW1iZXIiLCJhcnJheSIsIlN0cmluZyIsInNwbGl0IiwibnVtYmVyQW5kU3VmZml4IiwibGFzdE51bWJlckluQXJyYXkiLCJsZW5ndGgiLCJqb2luIiwiZGF0ZUhlYWRpbmdzIiwiaGVhZGluZyIsInRvZ2dsZUNlbHNpdXNGYWhyZW5oZWl0U2VsZWN0ZWREb20iLCJ0ZW1wZXJhdHVyZXMiLCJjdXJyZW50U2NhbGUiLCJ0ZW1wIiwidGVtcGVyYXR1cmVXaXRob3V0RGVncmVlU3ltYm9sIiwicmVtb3ZlRGVncmVlU3ltYm9sIiwidG9nZ2xlVmFsdWVDZWxzaXVzRmFocmVuaGVpdCIsInR5cGUiLCJDRUxTSVVTX1RPX0ZBSFJFTkhFSVRfRkFDVE9SIiwiRkFIUkVOSEVJVF9UT19DRUxTSVVTX0ZBQ1RPUiIsIkZBSFJFTkhFSVRfRlJFRVpJTkdfUE9JTlQiLCJ2YWx1ZUNvbnZlcnRlZCIsIk51bWJlciIsImFkZERlZ3JlZVN5bWJvbCIsInRvRml4ZWQiLCJzdHIiLCJzdHJBcnJheSIsInB1c2giLCJzdHJpbmdXaXRoRGVncmVlU3ltYm9sIiwicG9wIiwic3RyaW5nV2l0aG91dERlZ3JlZVN5bWJvbCIsImxvYWRlckljb25zIiwicmVtb3ZlIiwiZWxlbWVudCIsIndlYXRoZXJJY29ucyIsImFkZCIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImVsZW1lbnRzVG9DbGVhciIsInRhZ05hbWUiLCJjZWxzaXVzU3ltYm9sIiwiZmFocmVuaGVpdFN5bWJvbCIsIndlYXRoZXJTd2F0Y2hMYXllciIsImJhY2tncm91bmRJbWFnZSJdLCJzb3VyY2VSb290IjoiIn0=