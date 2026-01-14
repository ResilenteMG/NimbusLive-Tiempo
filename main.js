const API_KEY = '61726015fade96e2c93c9e03e02ca697';

async function cargarClima() {
    try {
        // Buscamos Castellón directamente
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Castellon&appid=${API_KEY}&units=metric&lang=es`);
        const data = await res.json();
        
        if (data.main) {
            // Rellenar temperatura y ciudad
            document.querySelector('.temp-number').textContent = Math.round(data.main.temp);
            document.querySelector('.city-name').textContent = data.name.toUpperCase();
            document.querySelector('.weather-desc').textContent = data.weather[0].description.toUpperCase();
            
            // Rellenar Humedad y Viento usando tus IDs exactos
            document.getElementById('humidity-display').textContent = data.main.humidity + '%';
            document.getElementById('wind-display').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
        }
    } catch (e) {
        console.error("Error de conexión");
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarClima);