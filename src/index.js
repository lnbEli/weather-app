import "./style.css";
init();

// User Buttons
const goButton = document.querySelector("button");
const toggleButton = document.querySelector(".toggle-circle");
const userInput = document.querySelector("input");
const celsiusFahrenheitButtons = document.querySelectorAll(
  ".fahrenheit-symbol,.celsius-symbol"
);
const animatedLogoDiv = document.querySelector(".header div");

//Button event listeners
toggleButton.addEventListener("click", () => {
  toggleCelsiusFahrenheitDom();
  disableCelciusFahrenheitButtonPointer();
});

goButton.addEventListener("click", handleGoButton);

celsiusFahrenheitButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleCelsiusFahrenheitDom();
    disableCelciusFahrenheitButtonPointer();
  });
});

//Allows User to hit return to submit search
userInput.addEventListener("keyup", (event) => {
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
  getCurrentlocation()
    .then((coords) => getCurrentCity(...coords))
    .then(fetchWeatherForecast)
    .then(renderWeatherForecastDom)
    .catch((error) => {
      console.error("There was an error initialising", error);
      fetchWeatherForecast("London").then(renderWeatherForecastDom);
    });
}

//Async function that uses browser geolocation to access lat,lng
function getCurrentlocation() {
  toggleLoadingIconsOnDom();
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
    .then(function (response) {
      const lat = response.coords.latitude;
      const lng = response.coords.longitude;
      return [lat, lng];
    })
    .catch((error) => {
      throw error;
    });
}

//Async function thats uses API to reverse lookup city from lat,lng
function getCurrentCity(lat, lng) {
  return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then((response) => {
      return response.json();
    })
    .then((obj) => {
      if (obj.city === "Throttled! See geocode.xyz/pricing") {
        throw new Error("Geocode look up throttled");
      } else {
        return obj.city;
      }
    })
    .catch((error) => {
      console.error("Error caught when fetching coords", error);
      return "London";
    });
}

//Async function thats uses API to lookup weather object for city
function fetchWeatherForecast(location) {
  const API_KEY = "01e16955a751428aa40141715241906";
  const url = `https://api.weatherapi.com/v1/forecast.json?q=${location}&key=${API_KEY}&days=3`;
  return fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((weatherObj) => {
      return weatherObj;
    })
    .catch(function (error) {
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
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
  const currentScale = toggle.classList.contains("toggle-up")
    ? "celsius"
    : "fahrenheit";
  toggle.classList.toggle("toggle-up");
  toggle.classList.toggle("toggle-down");

  temperatures.forEach((temp) => {
    let temperatureWithoutDegreeSymbol = removeDegreeSymbol(temp.textContent);
    temp.textContent = toggleValueCelsiusFahrenheit(
      temperatureWithoutDegreeSymbol,
      currentScale
    );
  });
}

//Converts between Fahrenheit and Celsius
function toggleValueCelsiusFahrenheit(value, type) {
  const CELSIUS_TO_FAHRENHEIT_FACTOR = 9 / 5;
  const FAHRENHEIT_TO_CELSIUS_FACTOR = 5 / 9;
  const FAHRENHEIT_FREEZING_POINT = 32;
  let valueConverted;

  if (type === "fahrenheit") {
    valueConverted =
      (Number(value) - FAHRENHEIT_FREEZING_POINT) *
      FAHRENHEIT_TO_CELSIUS_FACTOR;
  } else {
    valueConverted =
      Number(value) * CELSIUS_TO_FAHRENHEIT_FACTOR + FAHRENHEIT_FREEZING_POINT;
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
  loaderIcons.forEach((element) => {
    element.remove();
  });
}

//Toggles loading icons on Dom
function toggleLoadingIconsOnDom() {
  const weatherIcons = document.querySelectorAll(".weather-icon, .temp-number");
  const locationHeading = document.querySelector(".location-header");
  locationHeading.classList.add("loader-text");
  weatherIcons.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("loader");
    element.appendChild(div);
  });
}

//Removes all weather data from Dom
function removeWeatherDataDom() {
  const elementsToClear = document.querySelectorAll(
    ".weather-description h6,.temperature h2,.location-header,.weather-icon img"
  );
  elementsToClear.forEach((element) => {
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
  const weatherSwatchLayer = document.querySelector(
    ".weather-swatch-opacity-layer"
  );
  weatherSwatchLayer.style.backgroundImage = `url(${url})`;
}
