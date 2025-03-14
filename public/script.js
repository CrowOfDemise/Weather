document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed"); // Debugging
    if (navigator.geolocation) {
        console.log("Requesting geolocation..."); // Debugging
        navigator.geolocation.getCurrentPosition(getWeather, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function getWeather(position) {
    console.log("Geolocation success:", position); // Debugging
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY; // Use the new environment variable
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    console.log("Fetching weather data from:", apiUrl); // Debugging

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather data received:", data); // Debugging

            const location = data.location.name + ", " + data.location.country;
            const temperature = data.current.temp_c + "°C";
            const description = data.current.condition.text;
            const iconUrl = data.current.condition.icon;

            document.getElementById('location').textContent = `Location: ${location}`;
            document.getElementById('temperature').textContent = `Temperature: ${temperature}`;
            document.getElementById('description').textContent = `Description: ${description}`;

            // Optional: Add weather icon
            const icon = document.createElement('img');
            icon.src = `https:${iconUrl}`;
            icon.alt = description;
            document.getElementById('weather-info').appendChild(icon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('location').textContent = "Failed to load location.";
            document.getElementById('temperature').textContent = "Failed to load temperature.";
            document.getElementById('description').textContent = "Failed to load weather description.";
        });
}

function showError(error) {
    console.error('Geolocation error:', error); // Debugging
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
