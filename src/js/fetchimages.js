import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32810217-d4150f11c342a4e2afb80e8cd';
//id 32810217
export async function fetchImages(value, page = 1, perPage = 40) {
  try {
     const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
      )
      return response;
 
  } catch (error) {
    return Promise.reject(`${error}`);
  }
}
