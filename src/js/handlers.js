import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';
import { fetchImages } from './fetchimages';

const lightbox = new SimpleLightbox('.gallery a');

const hideBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'none');
const showBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'block');
hideBtnLoadMore();

let page = 1;
let perPage = 40;

export async function onFormSubmit(e) {
  e.preventDefault();

  let request = refs.form.elements.searchQuery.value.trim();
  page = 1;
  cleanGallery();

  if (request === '') {
    hideBtnLoadMore();
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const galleryItems = await fetchImages(request, page);
    let totalPages = galleryItems.data.totalHits;

    if (galleryItems.data.hits.length === 0) {
      cleanGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalPages >= 1 && totalPages < 40) {
      hideBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    } else if (totalPages > 40) {
      showBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    }
    renderGalleryMarkup(galleryItems.data.hits);

    lightbox.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  lightbox.refresh();
}

export async function onClickBtnLoadMore() {
  page += 1;
  let request = refs.form.elements.searchQuery.value.trim();

  try {
    const galleryItems = await fetchImages(request, page);
    let showPages = galleryItems.data.totalHits / perPage;

    if (showPages <= page) {
      hideBtnLoadMore();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    renderGalleryMarkup(galleryItems.data.hits);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  lightbox.refresh();
}

function cleanGallery() {
  refs.gallery.innerHTML = '';
  page = 1;
  hideBtnLoadMore();
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}">
              <img
              class="gallery__image"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
              width = "350px"
              height = "250px"
            />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
}

function renderGalleryMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
}