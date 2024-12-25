const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY

const searchForm = document.getElementById("search-form")
const searchResults = document.getElementById("search-results")
let myMovieId = JSON.parse(localStorage.getItem("myMovieId"))

searchForm.addEventListener("submit", async (e)=> {
    e.preventDefault()
    const formData = new FormData(searchForm)
    const searchTerm = formData.get("search-name")

    if(searchTerm) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${searchTerm}`)
        const data = await res.json()
        displaySearchResults(data.Search)
        searchForm.reset() 
    }
})

document.addEventListener("click",  (e)=> {
    if(e.target.dataset.movieid) {
        if(!myMovieId) { myMovieId = [] }

        if(!myMovieId.includes(e.target.dataset.movieid)) {
        myMovieId.push(e.target.dataset.movieid)
        localStorage.setItem("myMovieId", JSON.stringify(myMovieId))
        }
    }
})

async function displaySearchResults(searchResultsArr) {

    if(searchResultsArr) {
        const html = await getSearchHtml(searchResultsArr)
        searchResults.innerHTML = html
    } else {
        searchResults.innerHTML = `<h2>Unable to find what you’re looking for. Please try another search.</h2>`
    }
}

async function getSearchHtml(searchResultsArr) {
    const searchResultsArray = searchResultsArr.slice(0, 10)
    const searchResultPromises = searchResultsArray.map(async (movie)=> {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${movie.imdbID}`)
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
                            <p class="add-watchlist" data-movieid="${movieDetail.imdbID}"><i class="fa-solid fa-circle-plus"></i>  Watchlist</p>
                        </div>

                        <div class="movie-plot">
                            <article>${movieDetail.Plot}</article>
                        </div>
                    </div>
                </div>
                <hr class="divider">`
}