async function fetchWeather() {
  const searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "77a1747b6b185ca86498f2561121ef17";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  async function getLonAndLat() {
    const countryCode = "PH";
    const geoCodeURL =
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geoCodeURL);

    if (!response.ok) {
      console.log("Bad response!", response.status);
      weatherDataSection.innerHTML = `
        <div>
          <h2>Error</h2>
          <p>Could not fetch location data. Please try again.</p>
        </div>
      `;
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }

    return data[0]; // has lat, lon
  }

  async function getWeatherData(lon, lat) {
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log("Bad response", response.status);
      weatherDataSection.innerHTML = `
        <div>
          <h2>Error</h2>
          <p>Could not fetch weather data. Please try again.</p>
        </div>
      `;
      return;
    }

    const data = await response.json();

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  document.getElementById("search").value = "";

  const geocodeData = await getLonAndLat();
  if (!geocodeData) return;

  await getWeatherData(geocodeData.lon, geocodeData.lat);
}