let peliculas = []; // Array vacío para guardar las películas


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json') // Petición Fetch para obtener los datos de las películas desde la URL
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la carga del Fetch");
        }
        return response.json();
    })
    .then(data => {
        peliculas = data; // Almacena los datos en la variable peliculas
        console.log(peliculas); 
    })
    .catch(error => console.error("Error:", error));

    
    document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);

    // Escucha el evento 'keypress' en el campo de búsqueda, lo uso para poder buscar películas presionando Enter, no solo haciendo click en el botón "Buscar"
    document.getElementById('inputBuscar').addEventListener('keypress', function(event) { 
        if (event.key === 'Enter') { // Verifica si la tecla presionada es Enter
            buscarPeliculas(); // Llama a la función de búsqueda
        }
    });
});

// Función para buscar películas
function buscarPeliculas() {
    const busqueda = document.getElementById('inputBuscar').value.toLowerCase(); // Obtiene el valor de búsqueda en minúsculas
    console.log('Buscando:', busqueda); // Imprime la búsqueda en la consola

    // Filtra las películas para encontrar coincidencias en el título, tagline, descripción o géneros
    const resultados = peliculas.filter(pelicula => {
        const titleMatch = pelicula.title && pelicula.title.toLowerCase().includes(busqueda);
        const taglineMatch = pelicula.tagline && pelicula.tagline.toLowerCase().includes(busqueda);
        const overviewMatch = pelicula.overview && pelicula.overview.toLowerCase().includes(busqueda);
        const genresMatch = pelicula.genres && pelicula.genres.some(genre => 
            typeof genre === 'string' && genre.toLowerCase().includes(busqueda)
        );

        return titleMatch || taglineMatch || overviewMatch || genresMatch; // Retorna true si hay coincidencia
    });

    console.log('Resultados:', resultados); // Imprime los resultados
    mostrarResultados(resultados); // Llama a la función para mostrar los resultados en la interfaz
}

// Función para mostrar resultados de búsqueda
function mostrarResultados(resultados) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpia resultados anteriores

    // Recorre cada película en los resultados y crea un elemento "lista" para cada una
    resultados.forEach(pelicula => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <h5>${pelicula.title} <span class="badge bg-secondary">${pelicula.vote_average}</span></h5>
            <p>${pelicula.tagline}</p>
        `;
        li.addEventListener('click', () => mostrarDetalles(pelicula)); // Evento para mostrar los detalles al hacer click
        lista.appendChild(li); // Añade el elemento de lista a la lista en la interfaz
    });
}

// Función para mostrar detalles de una película
function mostrarDetalles(pelicula) {
    const contenedorDetalles = document.createElement('div');
    contenedorDetalles.classList.add('offcanvas', 'offcanvas-top', 'bg-light');
    contenedorDetalles.setAttribute('tabindex', '-1'); // Establece el atributo 'tabindex' para el contenedor, que en este caso implica
    //que al utilizar Tab en el teclado no se seleccione ese elemento, lo cual asegura que el contenedor de detalles pueda ser mostrado y 
    //enfocado cuando se necesita, sin interferir en la navegación normal sobre otros elementos de la página.

    console.log(pelicula.genres); // Imprime los géneros de la película en la consola para verificar su estructura

    // Define el contenido HTML del contenedor de detalles
    contenedorDetalles.innerHTML = `
        <div class="offcanvas-header">
            <h5>${pelicula.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <p>${pelicula.overview}</p>
            <p><strong>Géneros:</strong> ${pelicula.genres.map(genre => genre.name).join(', ')}</p>
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownDetalles" data-bs-toggle="dropdown" aria-expanded="false">
                Más detalles
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownDetalles">
                <li><a class="dropdown-item">Año: ${new Date(pelicula.release_date).getFullYear()}</a></li>
                <li><a class="dropdown-item">Duración: ${pelicula.runtime} min</a></li>
                <li><a class="dropdown-item">Presupuesto: $${pelicula.budget.toLocaleString()}</a></li>
                <li><a class="dropdown-item">Ganancias: $${pelicula.revenue.toLocaleString()}</a></li>
            </ul>
        </div>
    `;

    document.body.appendChild(contenedorDetalles); // Añade el contenedor de detalles al cuerpo del documento
    const offcanvas = new bootstrap.Offcanvas(contenedorDetalles); // Crea una instancia de Offcanvas de Bootstrap
    offcanvas.show(); // Muestra el contenedor de detalles en la interfaz
}






// Recordatorio:
// Dropdowns: Menús que permiten seleccionar opciones de una lista desplegable.
// Offcanvas: Contenidos deslizantes que ofrecen información adicional sin interrumpir la experiencia de navegación.