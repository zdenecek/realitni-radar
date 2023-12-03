
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export default instance;
