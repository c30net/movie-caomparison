const fetchData = async (searchTerm) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '6f7f0822',
            s: searchTerm,
        },
    });
    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
};

const getMovieInfo = async (movie) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '6f7f0822',
            i: movie.imdbID,
        },
    });

    console.log(response.data);
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label ><b>Search For a Movie</b></label>
<br>
<input  class="input is-info is-normal" size='20' />
<br>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results ">
        </div>
    </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultWrapper = document.querySelector('.results');

const onInput = async (event) => {
    const movies = await fetchData(event.target.value);
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster == 'N/A' ? '' : movie.Poster;
        option.classList.add('dropdown-item');
        option.innerHTML = `<img src="${imgSrc}" /><h1>${movie.Title}</h1>`;

        option.addEventListener('click', () => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            getMovieInfo(movie);
        });

        resultWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 1000));
document.querySelector('html').addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});
