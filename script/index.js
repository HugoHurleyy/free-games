'use strict';

const cards = document.querySelector('.cards');
const gameNumber = document.querySelector('.game-number');
const popup = document.querySelector('.popup');

const renderError = errorMessage => {
  alert(errorMessage);
};

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'cf8258c1fbmshffc26c9b2ea24efp1bd3e4jsne631f1018de2',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
  },
};

const getData = url => {
  return fetch(url, options).then(response => {
    if (!response.ok) throw new Error('Games can not found');
    console.log(response);
    return response.json();
  });
};

const insertHtml = () => {
  getData('https://free-to-play-games-database.p.rapidapi.com/api/games')
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

      renderError(`${error.message}`);
    });
};

insertHtml();

cards.addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn')) return;

  const btn = e.target;
  const gameId = btn.closest('.card').dataset.id;
  getData(
    `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`
  )
    .then(data => {
      const html = `
      <div class="popup__images">
        <img
          src="${data.screenshots[0].image}"
          alt=""
          class="popup__img"
        />
        <img
          src="${data.screenshots[0].image}"
          alt=""
          class="popup__img"
        />
        <img
          src="${data.screenshots[0].image}"
          alt=""
          class="popup__img"
        />
        <img
          src="${data.screenshots[0].image}"
          alt=""
          class="popup__img"
        />
      </div>
      <h2 class="heading-4">Information About the game</h2>
      <h5 class="heading-5 text-white fw-500">${data.description}</h5>

      <h2 class="heading-4">Minimum System Requirements</h2>
      <h5 class="heading-5 fw-500 text-white">
        OS: ${data.minimum_system_requirements.os}
      </h5>
      <h5 class="heading-5 fw-500 text-white">
        Processor: ${data.minimum_system_requirements.processor}
      </h5>
      <h5 class="heading-5 fw-500 text-white">memory: ${data.minimum_system_requirements.memory}</h5>
      <h5 class="heading-5 fw-500 text-white">
        graphics: ${data.minimum_system_requirements.graphics}
      </h5>
      <h5 class="heading-5 fw-500 text-white">storage: ${data.minimum_system_requirements.storage}</h5>

    `;

      popup.insertAdjacentHTML('afterbegin', html);
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
      popup.style.opacity = 1;
    })
    .catch(error => {
      renderError(
        'We cant reach this game information right now please try later'
      );
    });
});
