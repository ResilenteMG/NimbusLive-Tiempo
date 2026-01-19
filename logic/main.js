const API_KEY = "61726015fade96e2c93c9e03e02ca697";

// Esta función es el corazón: dibuja los datos en tu tarjeta de cristal
async function llamarAPI(url) {
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.cod === 200) {
            // 1. Datos de texto
            document.getElementById('cityName').textContent = `${datos.name}, ${datos.sys.country}`;
            document.getElementById('temp').textContent = `${Math.round(datos.main.temp)}°C`;
            document.getElementById('description').textContent = datos.weather[0].description;

            // 2. Lógica de Iconos Lucide
            const iconContainer = document.getElementById('weather-icon');
            const climaPrincipal = datos.weather[0].main; // Ejemplo: 'Clear', 'Clouds', 'Rain'
            
            let iconName = 'cloud'; // Icono por defecto

            if (climaPrincipal === 'Clear') iconName = 'sun';
            if (climaPrincipal === 'Clouds') iconName = 'cloud';
            if (climaPrincipal === 'Rain' || climaPrincipal === 'Drizzle') iconName = 'cloud-rain';
            if (climaPrincipal === 'Thunderstorm') iconName = 'cloud-lightning';
            if (climaPrincipal === 'Snow') iconName = 'snowflake';
            if (climaPrincipal === 'Mist' || climaPrincipal === 'Fog') iconName = 'cloud-fog';

            // Inyectamos el icono con el tamaño deseado (size="48")
            iconContainer.innerHTML = `<i data-lucide="${iconName}" class="w-12 h-12"></i>`;
            
            // ¡IMPORTANTE! Decirle a Lucide que renderice el nuevo icono
            lucide.createIcons();

        }
    } catch (error) {
        console.error("Error con los iconos:", error);
    }
}
// Configuración al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciar con Castellón por geolocalización
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`);
        },
        () => {
            // Si el usuario no da permiso, cargamos Castellón por nombre
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?q=Castellon&appid=${API_KEY}&units=metric&lang=es`);
        }
    );

    // 2. Configurar el botón de búsqueda
    const boton = document.getElementById('searchBtn');
    const entrada = document.getElementById('cityInput');

    boton.addEventListener('click', () => {
        if (entrada.value.trim() !== "") {
            llamarAPI(`https://api.openweathermap.org/data/2.5/weather?q=${entrada.value}&appid=${API_KEY}&units=metric&lang=es`);
        }
    });
});