"use strict";

// Получаем элементы со страницы ----------------------------------------------

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvShowsItem = document.querySelectorAll(".tv-shows__item"),
  tvCardImg = document.querySelector(".tv-card__img");

// Определяем переменные ------------------------------------------------------

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

const backSrcImg = () => {
  let srcImg = tvCardImg.getAttribute("src");
  let dataBackdrop = tvCardImg.getAttribute("data-backdrop");

  if (srcImg != "" && dataBackdrop != 0) {
    tvCardImg.setAttribute("data-backdrop", srcImg);
    tvCardImg.setAttribute("src", dataBackdrop);
  }
};

const backDropImg = () => {
  let srcImg = tvCardImg.getAttribute("src");
  let dataBackdrop = tvCardImg.getAttribute("data-backdrop");

  if (srcImg != "" && dataBackdrop != 0) {
    tvCardImg.setAttribute("src", dataBackdrop);
    tvCardImg.setAttribute("data-backdrop", srcImg);
  }
};

// Вызов функций --------------------------------------------------------------

// Обработчики событий---------------------------------------------------------

hamburger.addEventListener("click", openMenu);
document.addEventListener("click", closeMenu);
leftMenu.addEventListener("click", openDropdownMenu);
tvCardImg.addEventListener("mouseover", backDropImg);
tvCardImg.addEventListener("mouseout", backSrcImg);
