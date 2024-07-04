import "./style.css";
init();

const goButton = document.querySelector("button");
const toggleButton = document.querySelector(".toggle-circle");

toggleButton.addEventListener("click", toggleCelciusFahrenheitDom);
goButton.addEventListener("click", () => {
  let location = document.querySelector("input");
  renderWeatherForecast(location.value);
  location.value = "";
});

function init() {
  getCurrentlocation()
    .then((coords) => getCurrentCity(...coords))
    .then(renderWeatherForecast)
    .catch((error) => {
      console.error("There was an error initialising", error);
      renderWeatherForecast("London");
    });
}

function getCurrentlocation() {
  toggleLoadingIconsOn();
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

function fetchWeatherForecast(location) {
  const apiKey = "01e16955a751428aa40141715241906";
  const url = `http://api.weatherapi.com/v1/forecast.json?q=${location}&key=${apiKey}&days=3`;
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

function renderWeatherForecast(location) {
  fetchWeatherForecast(location)
    .then(function (weatherObj) {
      toggleLoadingIconsOff();
      const togglePosition = document.querySelector(".celcius-far-toggle");
      const tempScale = togglePosition.classList.contains("toggle-up")
        ? "c"
        : "f";
      const city = weatherObj.location.name;
      const country = weatherObj.location.country;
      const forecast = weatherObj.forecast.forecastday;
      forecast.forEach((day, index) => {
        const averageTemp = day.day[`avgtemp_${tempScale}`];
        const weatherIcon = `https:${day.day.condition.icon}`;
        const description = day.day.condition.text;
        const dayIndex = index;
        renderDayDOM(averageTemp, weatherIcon, description, dayIndex);
      });
      renderLocationHeadingDom(city, country);
      renderDateHeadingsDom();
    })
    .catch(function (error) {
      console.error("Error rendering the weather:", error);
    });
}

function renderDayDOM(temperature, icon, description, dayIndex) {
  const day = document.querySelector(".weather-container").children[dayIndex];
  day.querySelector(".temperature h2").textContent = `${temperature}°`;
  day.querySelector(".weather-icon").children[0].src = icon;
  day.querySelector(".weather-description h6").textContent = description;
}

function renderLocationHeadingDom(city, country) {
  const locationHeading = document.querySelector(".location-header");
  locationHeading.textContent = `${city} - ${country}`;
}

function formatDateHeadings(howManyDaysInToTheFuture) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const day = new Date();
  day.setDate(day.getDate() + howManyDaysInToTheFuture);
  const dayName =
    daysOfWeek[new Date().getDay() - 1 + howManyDaysInToTheFuture];
  const date = addOrdinalNumerSuffix(day.getDate());

  return `${dayName} ${date}`;
}

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

function toggleCelciusFahrenheitDom() {
  const toggle = document.querySelector(".celcius-far-toggle");
  const temperatures = document.querySelectorAll(".temp-number");
  const currentScale = toggle.classList.contains("toggle-up")
    ? "celcius"
    : "fahrenheit";
  toggle.classList.toggle("toggle-up");
  toggle.classList.toggle("toggle-down");

  temperatures.forEach((temp) => {
    let temperatureWithoutDegreeSymbol = removeDegreeSymbol(temp.textContent);
    temp.textContent = toggleValueCelciusFahrenheit(
      Number(temperatureWithoutDegreeSymbol),
      currentScale
    );
  });
}

function toggleValueCelciusFahrenheit(value, type) {
  let answer;
  if (type === "fahrenheit") {
    answer = (value - 32) / (9 / 5);
  } else {
    answer = value * (9 / 5) + 32;
  }
  //Adds degree symbol
  return addDegreeSymbol(String(answer.toFixed(1)));
}

function addDegreeSymbol(str) {
  let strArray = str.split("");
  strArray.push("°");
  let stringWithDegreeSymbol = strArray.join("");
  return stringWithDegreeSymbol;
}

function removeDegreeSymbol(str) {
  let strArray = str.split("");
  strArray.pop();
  let stringWithoutDegreeSymbol = strArray.join("");
  return stringWithoutDegreeSymbol;
}

function toggleLoadingIconsOff() {
  const loaderIcons = document.querySelectorAll(".loader");
  loaderIcons.forEach((element) => {
    element.remove();
  });
}

function toggleLoadingIconsOn() {
  const weatherIcons = document.querySelectorAll(".weather-icon");
  weatherIcons.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("loader");
    element.appendChild(div);
  });
}
