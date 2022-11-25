'use strict';

const cards = document.querySelector('.cards');
const gameNumber = document.querySelector('.game-number');
const popup = document.querySelector('.popup');
const popupClose = document.querySelector('.popup__close');
const sortCategory = document.querySelector('.sort__category');

const renderError = errorMessage => {
  alert(errorMessage);
};

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': `${your - own - api - key}`,
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
  },
};

const getData = url => {
  return fetch(url, options).then(response => {
    if (!response.ok) throw new Error('Games can not found');
    return response.json();
  });
};

//? Get whole game data and insert to the HTML
const insertHtml = url => {
  while (cards.firstChild) cards.removeChild(cards.lastChild);
  getData(url)
    .then(datas => {
      gameNumber.textContent = datas.length;
      datas.forEach(data => {
        const html = `
      <div class="card" data-id="${data.id}">
      <div class="card__front">
        <div class="card__img">
          <img
            src="${data.thumbnail}"
            alt="Game's Image"
          />
        </div>
        <div class="card__info">
          <h5 class="heading-5 text-white">platform: ${data.platform}</h5>
          <h5 class="heading-5 text-white">publisher: ${data.publisher}</h5>
          <h5 class="heading-5 text-white">developer: ${data.developer}</h5>
          <h5 class="heading-5 text-white">release date: ${data.release_date}</h5>
        </div>
      </div>
      <div class="card__back">
        <h5 class="heading-5 text-white">${data.short_description}</h5>
        <h5 class="heading-5 text-white">genre: ${data.genre}</h5>
        <a  class="btn btn-white text-orange">learn more</a>
      </div>
    </div>
        `;

        cards.insertAdjacentHTML('beforeend', html);
      });
    })
    .catch(error => {
      console.log(error);

      renderError(`Something went wrong 🤯💣`);
    });
};

insertHtml('https://free-to-play-games-database.p.rapidapi.com/api/games');

const createImage = (imageCount, screenshots) => {
  let imageArr = [];
  for (let i = 0; i < imageCount; i++) {
    imageArr.push(
      `<img src="${screenshots[i].image}"alt="" class="popup__img"/>`
    );
  }
  return imageArr;
};

//? Specific Game Information
cards.addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn')) return;

  const btn = e.target;
  const gameId = btn.closest('.card').dataset.id;
  getData(
    `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`
  )
    .then(data => {
      const {
        minimum_system_requirements: {
          os = '?',
          processor = '?',
          memory = '?',
          graphics = '?',
          storage = '?',
        } = '?',
        screenshots,
        description,
      } = data;

      const html = `
      <div class="popup__images">
        ${createImage(screenshots.length, screenshots)}
      </div>

      <div class = "popup__info">
        <h2 class="heading-4">Information About the game</h2>
        <h5 class="heading-5 text-white fw-500">${description}</h5>
      </div>

      <div class = "popup__system">
        <h2 class="heading-4">Minimum System Requirements</h2>
        <h5 class="heading-5 fw-500 text-white">
          OS: ${os}
        </h5>
        <h5 class="heading-5 fw-500 text-white">
          Processor: ${processor}
        </h5>
        <h5 class="heading-5 fw-500 text-white">memory: ${memory}</h5>
        <h5 class="heading-5 fw-500 text-white">
          graphics: ${graphics}
        </h5>
        <h5 class="heading-5 fw-500 text-white">storage: ${storage}</h5>
      </div>
    `;

      popup.insertAdjacentHTML('afterbegin', html);
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
      popup.style.opacity = 1;
    })
    .catch(error => {
      renderError(error.message);
    });
});

//? Close popup
popup.addEventListener('click', function (e) {
  if (!e.target.classList.contains('popup__close')) return;
  while (popup.firstChild) {
    popup.removeChild(popup.lastChild);
  }
  popup.style.transform = 'translate(-50%, -50%) scale(0)';
  popup.style.opacity = 0;
  popup.insertAdjacentHTML('beforeend', '<p class="popup__close">X</p>');
});

//? Sort Games

sortCategory.addEventListener('click', function (e) {
  if (!e.target.classList.contains('category')) return;
  const categoryName = e.target.textContent.toLowerCase();
  if (categoryName === 'all')
    return insertHtml(
      'https://free-to-play-games-database.p.rapidapi.com/api/games'
    );
  insertHtml(
    `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${categoryName}`
  );
});
