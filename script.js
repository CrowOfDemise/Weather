document.addEventListener('DOMContentLoaded', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function getWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = process.env.WEATHERAPI_API_KEY; // Use environment variable
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const location = data.location.name + ", " + data.location.country;
            const temperature = data.current.temp_c;
            const description = data.current.condition.text;
            const iconUrl = data.current.condition.icon;

            document.getElementById('location').textContent = `Location: ${location}`;
            document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
            document.getElementById('description').textContent = `Description: ${description}`;

            // Optional: Add weather icon
            const icon = document.createElement('img');
            icon.src = `https:${iconUrl}`;
            icon.alt = description;
            document.getElementById('weather-info').appendChild(icon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function showError(error) {
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
