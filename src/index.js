import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import { PixabayApi } from './js/pixabayApi';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
const pixabayApi = new PixabayApi();

refs.form.addEventListener('submit', handleSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function handleSubmit(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    Notify.warning('Sorry, enter data to search!');
    return;
  }

  pixabayApi.query = query;
  clearPage();
  try {
    const { hits, totalHits } = await pixabayApi.getPhotos();
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
    pixabayApi.calculateTotalPages(totalHits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    if (pixabayApi.isShowLoadMore) {
      refs.loadMore.classList.remove('is-hidden');
    }
    gallery.refresh();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearPage();
  }
}

async function onLoadMore() {
  pixabayApi.incrementPage();
  if (!pixabayApi.isShowLoadMore) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await pixabayApi.getPhotos();
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
    scrollPhoto();
    gallery.refresh();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearPage();
  }
}
function scrollPhoto() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearPage() {
  pixabayApi.resetPage();
  refs.list.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
}
