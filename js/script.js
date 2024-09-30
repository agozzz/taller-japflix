let peliculas = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => {
        if (!response.ok){
            throw new Error("Error en la carga del Fetch");
        }
        return response.json();
    })
    .then(data => {
        peliculas = data;
        console.log(peliculas);
    })
    .catch(error => console.error("Error:", error));
});