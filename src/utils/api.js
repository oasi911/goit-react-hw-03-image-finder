import axios from 'axios';
import { toast } from 'react-toastify';

const API_KEY = '34881705-1e85e8c708a083119a0406cc9';
export async function getImages(state) {
  const { per_page, currentPage, query } = state;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${query}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${per_page}`
    );
    return response;
  } catch (error) {
    toast.error(error.message);
  }
}
