import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PixabayApi {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      key: '30687334-5aed2e645051261bb19af205b',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };

  async getPhotos() {
    const urlApi = `?q=${this.#query}&per_page=${this.#perPage}&page=${
      this.#page
    }`;
    const { data } = await axios.get(urlApi, this.#params);
    return data;
  }

  incrementPage() {
    this.#page += 1;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  resetPage() {
    this.#page = 1;
  }
  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
