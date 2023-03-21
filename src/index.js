import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

//document.querySelector('form').reset()

const DEBOUNCE_DELAY = 300;

const inputText = document.querySelector('#search-box');
const listContries = document.querySelector('.country-list');
let detailsCountry = document.querySelector('.country-info');

inputText.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputCurrent = e.target.value.trim();
  if (!inputCurrent) {
    clearCurrentValue();
    return;
  }

  fetchCountries(inputCurrent)
    .then(someCountries => {
      if (someCountries.length > 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.', 'warning');
        // clearCurrentValue();
        return;
      }
      renderCountriesList(someCountries);
    })
    .catch(error => {
      Notiflix.Notify.failure(`Try again! ${error}`);
      clearCurrentValue();
    });
}

function renderCountriesList(countries) {
  let data;
  let refs;
  clearCurrentValue();
  if (countries.length === 1) {
    data = getElemCountry(countries);
    refs = detailsCountry;
  } else {
    data = getListContries(countries);
    refs = detailsCountry;
  }
  makeElemsContries(refs, data);
}

function makeElemsContries(detailsCountry, markup) {
  detailsCountry.innerHTML = markup;
}

function getElemCountry(country) {
  return country.map(
    ({ name, capital, population, flags, languages }) => `
      <ul class ="country-info">
      <li class = "country-info__item">
      <img
      class = "country-title__flag"
        src="${flags.svg}" 
        alt="${name.official}" 
        width="60" 
        height="40">
      <h1 class="country-name">${name.official}</h1>        
          </li>
      <li class = "country-info__item">
          <p class= "country-info__item--description">Capital: ${capital}</p>
          </li>
          <li>
          <p class= "country-info__item--description">Population:  ${population}</p>
          </li>
          <li>
          <p class= "country-info__item--description">Languages: ${Object.values(
            languages
          )}</p>
          </li>
      </ul>
  `
  );
}

function getListContries(contries) {
  return contries
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-title__flag" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="60" 
          height="40">
        <p>${name.official}</p>
      </li>`
    )
    .join('');
}

function clearCurrentValue() {
  detailsCountry.innerHTML = '';
  listContries.innerHTML = '';
}
