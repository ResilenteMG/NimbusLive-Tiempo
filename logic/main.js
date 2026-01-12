const API_KEY = "61726015desvanecimiento96e2c93c9e03e02ca697"; 

window.onload = () => {

    solicitarUbicacion();
    
    configurarEventos();
};

function solicitarUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const lat = posicion.coords.latitude;
                const lon = posicion.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
                llamarAPI(url);
            },
            () => {
            
                buscarPorCiudad("Castellon");
            }
        );
    } else {
        buscarPorCiudad("Castellon");
    }
}

async function llamarAPI(url) {
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.cod === 200) {
            actualizarInterfaz(datos);
        } else if (datos.cod === 401) {

            mostrarError("API en proceso de activación. Espera unos minutos.");
        } else {
            mostrarError("Ciudad no encontrada.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        mostrarError("Error al conectar con el servidor.");
    }
}


function actualizarInterfaz(datos) {
    // Aseguramos que los IDs coincidan con tu index.html
    document.getElementById('city-name').textContent = `${datos.name}, ${datos.sys.country}`;
    document.getElementById('temp-display').textContent = `${Math.round(datos.main.temp)}°C`;
    document.getElementById('weather-desc').textContent = datos.weather[0].description;
    document.getElementById('humidity-display').textContent = `${datos.main.humidity}%`;
    document.getElementById('wind-display').textContent = `${Math.round(datos.wind.speed * 3.6)} km/h`;
    
    console.log("Datos cargados con éxito para:", datos.name);
}

function buscarPorCiudad(ciudad) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
    llamarAPI(url);
}

function configurarEventos() {
    const btn = document.getElementById('btn-search');
    const input = document.getElementById('search-input');


    btn.addEventListener('click', () => {
        if (input.value.trim()) buscarPorCiudad(input.value);
    });


    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            buscarPorCiudad(input.value);
        }
    });
}

function mostrarError(mensaje) {
    document.getElementById('weather-desc').textContent = mensaje;
    document.getElementById('temp-display').textContent = "--°";
}