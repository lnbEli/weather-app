import "./style.css";

getCurrentlocation();

const goButton = document.querySelector("button");

goButton.addEventListener("click", () => {
  const location = document.querySelector("input").value;
  renderWeatherForecast(location);
});

function getCurrentlocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
    .then(function (response) {
      const lat = response.coords.latitude;
      const lng = response.coords.longitude;
      return getCurrentCity(lat, lng);
    })
    .then((city) => {
      renderWeatherForecast(city);
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
      return obj.city;
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
    .then((weather) => {
      return weather.forecast.forecastday;
    })
    .catch(function (error) {
      console.error(`Error HTTP`, error);
      throw error;
    });
}

function renderWeatherForecast(location) {
  fetchWeatherForecast(location)
    .then(function (forecast) {
      forecast.forEach((day, index) => {
        const averageTemp = `${day.day.avgtemp_c}°`;
        const weatherIcon = `https:${day.day.condition.icon}`;
        const description = day.day.condition.text;
        const dayIndex = index;
        renderDayDOM(averageTemp, weatherIcon, description, dayIndex);
      });
    })
    .catch(function (error) {
      console.error("Error rendering the weather:", error);
    });
}

function renderDayDOM(temperature, icon, description, dayIndex) {
  const day = document.querySelector(".weather-container").children[dayIndex];
  day.querySelector(".temperature h2").textContent = temperature;
  day.querySelector(".weather-icon").children[0].src = icon;
  day.querySelector(".weather-description h6").textContent = description;
}
