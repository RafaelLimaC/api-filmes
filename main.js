// movie database api

const apiKey = '256371d219f67643eadeacb6718a981b';
let movies = [];

async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    const fetchResponse = await fetch(url)
    const { results } = await fetchResponse.json()
    return results
};

async function buscarFilmes(busca) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${busca}&language=en-US&page=1`

    const fetchResponse = await fetch(url)
    const { results } = await fetchResponse.json()
    return results
}

const favoriteState = {
      favorited: '<i class="fa-solid fa-heart"></i>',
      notFavorited: '<i class="fa-regular fa-heart">'
}

function favoriteButtonPressed(event, movieId) {
    const movie = movies.find(movie => movie.id == movieId);
    const emptyHeart = event.currentTarget.querySelector('.empty-heart');
    const filledHeart = event.currentTarget.querySelector('.filled-heart');

    if (emptyHeart.style.display === 'none') {
        emptyHeart.style.display = 'inline-block';
        filledHeart.style.display = 'none';
        removeFromLocalStorage(movie.id);
    } else {
        emptyHeart.style.display = 'none';
        filledHeart.style.display = 'inline-block';
        saveToLocalStorage(movie);
    }
}


function getFavoriteMovies() {
    return JSON.parse(localStorage.getItem('favoriteMovies'))
}
  
function saveToLocalStorage(movie) {
    const movies = getFavoriteMovies() || []
    movies.push(movie)
    const moviesJSON = JSON.stringify(movies)
    localStorage.setItem('favoriteMovies', moviesJSON)
}
  
function checkMovieIsFavorited(id) {
    const movies = getFavoriteMovies() || []
    return movies.find(movie => movie.id == id)
}
  
function removeFromLocalStorage(id) {
    const movies = getFavoriteMovies() || []
    const findMovie = movies.find(movie => movie.id == id)
    const newMovies = movies.filter(movie => movie.id != findMovie.id)
    localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

// renderizar cards

const wrapperCards = document.getElementById('wrapperCards');
const campoBusca = document.getElementById('busca');

document.addEventListener('click', function(event) {
    const clickedElement = event.target;


    if (clickedElement.classList.contains('card-favoritar')) {
        const movieId = clickedElement.getAttribute('data-movie-id');
        favoriteButtonPressed(event, movieId); // Passando o ID do filme para a função
    } else if (clickedElement.classList.contains('fa-heart')) {
        const movieId = clickedElement.getAttribute('data-movie-id');
        favoriteButtonPressed(event, movieId); // Passando o ID do filme para a função
    }
});



function limparContainer() {
    wrapperCards.innerHTML = ''
}

function criarCard(movie) {

    let { title, poster_path, vote_average, release_date, overview, id } = movie
    const votoFormatado = formatarNumeroRedondo(vote_average)
    const limitedOverview = overview.length > 250 ? overview.slice(0, 250) + '...' : overview;

    const year = new Date(release_date).getFullYear()
    const image = `https://image.tmdb.org/t/p/w500${poster_path}`

    const cardContent = `
            <div class="card">
                <img class="card-image" src="${image}" alt="" srcset="">
                <div class="card-info">
                    <h2 class="card-titulo">${title} (${year})</h2>
                    <div class="card-icons">
                        <span class="card-nota"><i class="fa-solid fa-star"></i>${votoFormatado}</span>
                        <span class="card-favoritar">${favoriteState.notFavorited}</i>Favoritar</span>
                    </div>
                </div>
                <p class="card-texto">${limitedOverview}</p>
            </div>`;

    wrapperCards.innerHTML += cardContent;
}

function formatarNumeroRedondo(numero) {
    if (numero === Math.floor(numero)) {
      return numero.toFixed(1);
    }
    return numero.toString();
}

campoBusca.addEventListener("keyup", async (event) => {
    if (event.code === 'Enter') {
        limparContainer();
        const movies = await buscarFilmes(campoBusca.value);
        movies.forEach(movie => criarCard(movie));
    };
});

window.onload = async function() {
    movies = await getPopularMovies()
    movies.forEach(movie => criarCard(movie))
}

