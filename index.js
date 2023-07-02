const autoCompleteConfig = {
    renderOption: (anOption) => {
        const imgSrc = anOption.Poster == 'N/A' ? '' : anOption.Poster;
        return `<img src="${imgSrc}" /><h1>${anOption.Title}&#160(${anOption.Year})</h1>`;
    },

    inputValue: (option) => {
        return option.Title;
    },
    fetchData: async (searchTerm) => {
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
    },
};

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summary, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '6f7f0822',
            i: movie.imdbID,
        },
    });

    summary.innerHTML = movieTemplate(response.data);
    if (side == 'right') {
        rightMovie = response.data;
    } else {
        leftMovie = response.data;
    }
    if (rightMovie && leftMovie) {
        runForComparison();
    }
};
const runForComparison = () => {
    const leftSummary = document.querySelectorAll(
        '#left-summary .notification'
    );
    const rightSummary = document.querySelectorAll(
        '#right-summary .notification'
    );
    leftSummary.forEach((item, index) => {
        const leftValue = item.dataset.value;
        const rightValue = rightSummary[index].dataset.value;
        console.log(item, rightSummary[index]);
        if (parseFloat(leftValue) > parseFloat(rightValue)) {
            item.classList.add('is-primary');
            rightSummary[index].classList.add('is-warning');
        } else {
            item.classList.add('is-warning');
            rightSummary[index].classList.add('is-primary');
        }
    });
};
const movieTemplate = (movieDetail) => {
    const awardsFirst = movieDetail.Awards.split(' ');
    const awardsSecond = awardsFirst.filter((item) => parseInt(item));
    const totalAwards = awardsSecond.reduce(
        (initial, secondary) => parseInt(initial) + parseInt(secondary)
    );
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    );

    const metascore = parseInt(movieDetail.Metascore);

    const imdbRating = parseFloat(movieDetail.imdbRating);

    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value="${totalAwards}" class="notification is-primary">
        <p class="title"> ${movieDetail.Awards} </p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title"> ${movieDetail.BoxOffice} </p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title"> ${movieDetail.Metascore} </p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title"> ${movieDetail.imdbRating} </p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title"> ${movieDetail.imdbVotes} </p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};

autocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (option) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(option, document.querySelector('#left-summary'), 'left');
    },
});
autocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (option) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(
            option,
            document.querySelector('#right-summary'),
            'right'
        );
    },
});
