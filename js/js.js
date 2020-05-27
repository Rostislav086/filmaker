"use strict";
// Определяем переменные ------------------------------------------------------

const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "51f63c395fd2b361299f884c49cbc1c3";

// Получаем элементы со страницы ----------------------------------------------

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvCardImgAll = document.querySelectorAll(".tv-card__img"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  modal = document.querySelector(".modal");

const DBService = class {
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
};

const renderCard = (response) => {
  tvShowsList.textContent = "";

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
    card.classList.add("tv-shows__item");
    // <span class="tv-card__vote">${item.vote_average}</span>
    card.innerHTML = `        
     <a href="#" class="tv-card">
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

    tvShowsList.insertAdjacentElement("afterbegin", card);
    console.log(response.results);
  });
};

new DBService().getTestData().then(renderCard);

// Функции --------------------------------------------------------------------

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

const openDropdownMenu = () => {
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
    document.body.style.overflow = "hidden";
    modal.classList.remove("hide");
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
