const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const API_KEY = "ec3b2a08b02de4cb412bf1c4c281940d";


async function getWeather(city) {
    try {
        errorMessage.textContent = "";
        loading.style.display = "block";

        // Find the city location
        const geoUrl =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},IN&limit=5&appid=${API_KEY}`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        console.log("Location:", geoData);

        if (!geoResponse.ok) {
            if (geoResponse.status === 401) {
                throw new Error("Invalid or inactive API key");
            }

            throw new Error("Unable to find location");
        }

        if (geoData.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData[0];

        // Get weather using latitude and longitude
        const weatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        console.log("Weather:", data);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid or inactive API key");
            }

            throw new Error(data.message || "Unable to fetch weather");
        }

        // Display data
        cityName.textContent = data.name;

        countryName.textContent =
            `${location.state ? location.state + ", " : ""}${data.sys.country}`;

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        description.textContent =
            data.weather[0].description;

        feelsLike.textContent =
            `Feels like ${Math.round(data.main.feels_like)}°C`;

        humidity.textContent =
            `${data.main.humidity}%`;

        windSpeed.textContent =
            `${data.wind.speed} m/s`;

        pressure.textContent =
            `${data.main.pressure} hPa`;

        visibility.textContent =
            `${(data.visibility / 1000).toFixed(1)} km`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherIcon.alt =
            data.weather[0].description;

        weatherIcon.style.display = "block";

        localStorage.setItem("lastCity", city);

        errorMessage.textContent = "";

    } catch (error) {

        console.error("Error:", error);

        cityName.textContent = "Weather unavailable";
        countryName.textContent = "";
        temperature.textContent = "--°C";
        description.textContent = "Unable to get weather information";
        feelsLike.textContent = "Please try again";
        humidity.textContent = "--%";
        windSpeed.textContent = "-- m/s";
        pressure.textContent = "-- hPa";
        visibility.textContent = "-- km";

        weatherIcon.style.display = "none";

        errorMessage.textContent = error.message;

    } finally {
        loading.style.display = "none";
    }
}


// Search button
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});


// Press Enter to search
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// Remember last searched city
const lastCity = localStorage.getItem("lastCity");

if (lastCity) {
    cityInput.value = lastCity;
}