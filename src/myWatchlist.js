// const omdbApiKey = "b2fbbe57"
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY


const displayText = document.getElementById('display-text')
let myMovieId = JSON.parse(localStorage.getItem("myMovieId"))
const searchResults = document.getElementById("search-results")

document.addEventListener("click",  (e)=> {
    if(e.target.dataset.movieid) {
        handleRemoveWatchlist(e.target.dataset.movieid)
        }
    }
)

function handleRemoveWatchlist(movieId) {
    const updatedWatchlist = myMovieId.filter((id)=> id !== movieId)
    localStorage.setItem("myMovieId", JSON.stringify(updatedWatchlist))
    myMovieId = updatedWatchlist
    displaySearchResults()
}

async function displaySearchResults() {
    if(myMovieId.length > 0) {
        const html = await getSearchHtml()
        searchResults.innerHTML = html
    } else {
        searchResults.innerHTML = 
        displayText.innerHTML = `
        <div class="icon-container flex">
                </div>     
                <div id="display-text"><h2>There are no movies in your watchlist.</h2></div>

    `
    }
}

async function getSearchHtml() {
    const searchResultPromises = myMovieId.map(async (id)=> {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${id}`)
        const movieDetail = await res.json()
        return formHTML(movieDetail)
    })

    const searchResultHTML = await Promise.all(searchResultPromises)
    return searchResultHTML.join("")
}


export function formHTML(movieDetail) {
    return `
        <div class="movie-item">
                    <div class="poster-container">
                        <img src="${movieDetail.Poster}" alt="Movie poster" class="poster">
                    </div>
                    <div class="movie-description">
                        <div class = "movie-title">
                            <h3>${movieDetail.Title}<h3>
                            <i class="fa-solid fa-star star"></i> 
                            <p class="movie-rating">${movieDetail.imdbRating}</p>       
                        </div>
                        
                        <div class="movie-meta">
                            <p>${movieDetail.Runtime}</p>
                            <p>${movieDetail.Genre}</p>
                            <p class="remove-watchlist" data-movieid="${movieDetail.imdbID}"><i class="fa-solid fa-circle-minus"></i>  Watchlist</p>
                        </div>

                        <div class="movie-plot">
                            <article>${movieDetail.Plot}</article>
                        </div>
                    </div>
                </div>
                <hr class="divider">`
}

displaySearchResults()