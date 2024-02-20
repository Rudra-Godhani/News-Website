const API_KEY = "a423ac83cf894d3f8069c9d1a2a95d5b";
const url = " https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));


function reload() {
    window.location.reload();
}

let spin = document.querySelector(".spinner");
let cards = document.querySelector(".cards-container");
let noData = document.querySelector(".noData");

function displayLoading() {
    spin.style.display = "block";
    cards.style.display = "none";
    noData.style.display = "none";

}

function hideLoading() {
    spin.style.display = "none";
    cards.style.display = "flex";
    noData.style.display = "flex";
}

async function fetchNews(query) {
    displayLoading();
    try {
        const res = await fetch(`${url}${query}&apikey=${API_KEY}`);
        const data = await res.json();
        console.log(data);
        if (data.articles.length === 0) {
            noData.innerHTML = "No Data Found";
        }
        bindData(data.articles);
    } catch (error) {
        console.log("error:", error);
        noData.innerHTML = "Error in fetching Data";
    }
    hideLoading();
}



function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    let newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    })

}

let currentSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    currentSelectedNav?.classList.remove('active');
    currentSelectedNav = navItem;
    currentSelectedNav.classList.add('active');
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    currentSelectedNav?.classList.remove("active");
    currentSelectedNav = null;
});
