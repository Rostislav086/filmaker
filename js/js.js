"use strict";

// Определяем переменные/классы ------------------------------------------------------

const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";

const loading = document.createElement("div");
loading.classList.add("loading");

const DBService = class {
  constructor() {
    this.SERVER = "https://api.themoviedb.org/3";
    this.API_KEY = "51f63c395fd2b361299f884c49cbc1c3";
  }

  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Dont get data ");
    }
  };

  getTestData = async () => {
    return await this.getData("test.json");
  };

  getTestCard = async () => {
    return await this.getData("card.json");
  };

  getSearchResult = (query) => {
    return this.getData(
      `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`
    );
  };

  getTvShow = (id) => {
    return this.getData(
      `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
  };
};

// Получаем элементы со страницы ----------------------------------------------

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvCardImgAll = document.querySelectorAll(".tv-card__img"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  modal = document.querySelector(".modal"),
  tvShows = document.querySelector(".tv-shows"),
  tvShowsHead = document.querySelector(".tv-shows__head"),
  tvCardImg = document.querySelector(".tv-card__img"),
  imageContent = document.querySelector(".image__content"),
  modalTitle = document.querySelector(".modal__title"),
  genresList = document.querySelector(".genres-list"),
  rating = document.querySelector(".rating"),
  description = document.querySelector(".description"),
  modalLink = document.querySelector(".modal__link"),
  searchForm = document.querySelector(".search__form"),
  searchFormInput = document.querySelector(".search__form-input");

// Функции --------------------------------------------------------------------

const renderCard = (response) => {
  if (response.total_results) {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "Результат поиска";

    response.results.forEach((item) => {
      const posterIMG = item.poster_path
        ? IMG_URL + item.poster_path
        : "img/no-poster.jpg";

      const backdropIMG = item.backdrop_path
        ? IMG_URL + item.backdrop_path
        : "img/no-poster.jpg";

      const voteElem =
        item.vote_average != 0
          ? `<span class="tv-card__vote">${item.vote_average}</span>`
          : "";

      const card = document.createElement("li");
      card.idTV = item.id;
      card.classList.add("tv-shows__item");
      // <span class="tv-card__vote">${item.vote_average}</span>
      card.innerHTML = `        
     <a href="#" id ="${item.id}" class="tv-card">
        ${voteElem}
        <img
            class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt="${item.name}"
        />
        <h4 class="tv-card__head">${item.name}</h4>
    </a>
    `;

      loading.remove();
      tvShowsList.insertAdjacentElement("afterbegin", card);
    });
  } else {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "По вашему запросу ничего не найдено";
    loading.remove();
  }
};

const searchSubmit = (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
    console.log(value);
  }
  searchFormInput.value = "";
};

const openMenu = () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
};

const closeMenu = (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
  }
};

const openDropdownMenu = (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest(".dropdown");

  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
};

const openModal = (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest(".tv-card");

  if (card) {
    new DBService()
      .getTvShow(card.id)
      .then((response) => {
        if (response.poster_path) {
          tvCardImg.src = IMG_URL + response.poster_path;
        } else {
          imageContent.style.display = "none";
        }

        modalTitle.textContent = response.name;
        genresList.textContent = "";
        for (const item of response.genres) {
          genresList.innerHTML += `<li>${item.name}</li>`;
        }
        rating.textContent = response.vote_average;
        description.textContent = response.overview;
        modalLink.textContent = response.homepage;
      })
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      });
  }
};

const closeModal = (event) => {
  const target = event.target;
  if (target.closest(".cross") || target.classList.contains("modal")) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
};

const changeImg = (event) => {
  const card = event.target.closest(".tv-shows__item");

  if (card) {
    const img = card.querySelector(".tv-card__img");
    const backDrop = img.dataset.backdrop;
    if (backDrop) {
      img.dataset.backdrop = img.src;
      img.src = backDrop;
    }
  }
};

// Вызов функций --------------------------------------------------------------

// Обработчики событий---------------------------------------------------------

hamburger.addEventListener("click", openMenu);
document.addEventListener("click", closeMenu);
leftMenu.addEventListener("click", openDropdownMenu);
tvShowsList.addEventListener("click", openModal);
modal.addEventListener("click", closeModal);
tvShowsList.addEventListener("mouseover", changeImg);
tvShowsList.addEventListener("mouseout", changeImg);
searchForm.addEventListener("submit", searchSubmit);
