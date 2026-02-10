const API_KEY = "61726015fade96e2c93c9e03e02ca697";

// Esta función es el corazón: dibuja los datos en tu tarjeta de cristal
async function llamarAPI(url) {
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.cod === 200) {

            document.getElementById('cityName').textContent = `${datos.name}, ${datos.sys.country}`;
            document.getElementById('temp').textContent = `${Math.round(datos.main.temp)}°C`;
            document.getElementById('description').textContent = datos.weather[0].description.toUpperCase();
            
            
            const iconContainer = document.getElementById('weather-icon');
            iconContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png" class="w-20 h-20">`;


            if (typeof aplicarFondoDinamico === 'function') aplicarFondoDinamico(datos.weather[0].main);

            const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${datos.name}&units=metric&lang=es&appid=${API_KEY}`;
            const resForecast = await fetch(urlForecast);
            const dataForecast = await resForecast.json();

            if (dataForecast.cod === "200") {
                mostrarPronostico(dataForecast.list);
            }
        } else {
            alert("Ciudad no encontrada");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciar con Castellón por geolocalización
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`);
        },
        () => {
        
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?q=Castellon&appid=${API_KEY}&units=metric&lang=es`);
        }
    );


    const boton = document.getElementById('searchBtn');
    const entrada = document.getElementById('cityInput');

    boton.addEventListener('click', () => {
        if (entrada.value.trim() !== "") {
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?q=${entrada.value}&appid=${API_KEY}&units=metric&lang=es`);
        }
    });
});
function aplicarFondoDinamico(clima) {
    const body = document.body;
    
    
    let brisa = document.querySelector('.brisa-efecto');
    if (!brisa) {
        brisa = document.createElement('div');
        brisa.className = 'brisa-efecto';
        body.appendChild(brisa);
    }

    
    if (clima === 'Rain' || clima === 'Clouds') {
        brisa.style.opacity = "0.5"; // Se nota un poco más
    } else {
        brisa.style.opacity = "0.2"; // Muy sutil para Dubai/Sol
    }
}
function mostrarPronostico(lista) {
    const contenedorHoras = document.getElementById('hourly-forecast');
    const contenedorDias = document.getElementById('daily-forecast');
    

    contenedorHoras.innerHTML = '';
    contenedorDias.innerHTML = '';

    
    lista.slice(0, 8).forEach(item => {
        const fecha = new Date(item.dt * 1000);
        const hora = fecha.getHours() + ":00";
        
        const card = document.createElement('div');
        // Usamos tus clases de Tailwind para el efecto cristal
        card.className = "min-w-[90px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center text-white text-center";
        card.innerHTML = `
            <span class="text-xs opacity-70">${hora}</span>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" class="w-12 h-12" alt="clima">
            <span class="font-bold text-lg">${Math.round(item.main.temp)}°</span>
        `;
        contenedorHoras.appendChild(card);
    });


    const pronosticosDiarios = lista.filter(item => item.dt_txt.includes("12:00:00"));
    
    pronosticosDiarios.forEach(item => {
        const fecha = new Date(item.dt * 1000);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        
        const fila = document.createElement('div');
        fila.className = "flex justify-between items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-2 text-white w-full";
        fila.innerHTML = `
            <span class="capitalize font-medium w-28 text-left">${nombreDia}</span>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" class="w-10 h-10" alt="clima">
            <span class="font-bold text-right w-12">${Math.round(item.main.temp)}°C</span>
        `;
        contenedorDias.appendChild(fila);
    });
}