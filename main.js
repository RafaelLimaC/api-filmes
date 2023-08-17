// movie database api

const apiKey = '256371d219f67643eadeacb6718a981b';
const baseUrl = 'https://api.themoviedb.org/3/';

async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    const fetchResponse = await fetch(url)
    const { results } = await fetchResponse.json()
    return results
};

// renderizar cards

const wrapperCards = document.getElementById('wrapperCards');


function criarCard(movie) {

    let { title, poster_path, vote_average, release_date, overview } = movie
    const isFavorited = false // implementação da lógica em um dia posterior
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
                        <span class="card-favoritar"><i class="fa-regular fa-heart"></i>Favoritar</span>
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

window.onload = async function() {
    const movies = await getPopularMovies()
    movies.forEach(movie => criarCard(movie))
}